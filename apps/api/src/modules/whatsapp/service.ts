import { eq } from "drizzle-orm";
import { createLogger } from "../../core/logger";
import { utcNow } from "../../core/time";
import { db } from "../../database/client";
import { appSettings } from "../../database/schema/appSettings";
import { scheduledMessages } from "../../database/schema/messages";
import { messageTargets } from "../../database/schema/targets";
import { getResolvedSettings } from "../prayer/service";

const logger = createLogger("whatsapp-service");
import {
	getSessionQr,
	getSessionStatus,
	listGroups,
	logoutSession,
	restartSession,
	sendTextMessage,
	startSession,
	stopSession,
	WahaError,
} from "../../integrations/waha";
import { resolveDayTestTarget } from "../messages/testday";

export async function fetchSessionStatus() {
	return await getSessionStatus();
}

export async function startWahaSession() {
	return await startSession();
}

export async function stopWahaSession() {
	await stopSession();
	return { success: true };
}

export async function restartWahaSession() {
	await restartSession();
	return { success: true };
}

export async function logoutWahaSession() {
	await logoutSession();
	return { success: true };
}

export async function fetchQrCode() {
	return await getSessionQr();
}

export async function sendTestMessage(
	target: { targetId?: number; phone?: string },
	customText?: string,
) {
	let chatId: string;
	let displayName: string;

	const resolved = await resolveDayTestTarget({ targetId: target.targetId, phone: target.phone });
	chatId = resolved.chatId;
	displayName = resolved.displayName;

	const session = await getSessionStatus();
	if (session.status !== "WORKING") {
		throw new WahaError(
			`Sesi WhatsApp belum terhubung (status: ${session.status}). Pastikan pairing QR telah selesai.`,
			503,
			"WHATSAPP_SESSION_NOT_CONNECTED",
		);
	}

	let timezone = "Asia/Jakarta";
	try {
		const resolved = await getResolvedSettings();
		timezone = resolved.location.timezone;
	} catch {
	}
	const nowWib = utcNow().toLocaleString("id-ID", {
		timeZone: timezone,
		dateStyle: "full",
		timeStyle: "medium",
	});

	const text =
		customText?.trim() ||
		`🧪 *Uji Coba Pengiriman UNIDA Prayer*\n\nPesan uji coba ini dikirim oleh Administrator sistem untuk memastikan integrasi bot WhatsApp berjalan dengan baik.\n\n📅 Waktu uji: ${nowWib}`;

	const result = await sendTextMessage({
		chatId,
		text,
	});

	return {
		success: true,
		target: displayName,
		targetId: chatId,
		messageId: result.id,
	};
}

export async function syncGroups() {
	const session = await getSessionStatus();
	if (session.status !== "WORKING") {
		throw new WahaError(
			`Sesi WhatsApp belum aktif (status: ${session.status}). Silakan start/pairing sesi terlebih dahulu untuk sync grup.`,
			503,
			"WHATSAPP_SESSION_NOT_CONNECTED",
		);
	}

	const now = utcNow();
	const meId = session.me?.id;
	const currentJid = meId
		? (meId.split(":")[0] ?? meId).replace("@s.whatsapp.net", "@c.us")
		: null;

	const accountRow = await db
		.select()
		.from(appSettings)
		.where(eq(appSettings.key, "whatsapp_account"))
		.limit(1);

	const storedAccount = accountRow[0]?.value as { jid?: string } | undefined;
	const storedJid = storedAccount?.jid;

	let accountChanged = false;
	if (storedJid && currentJid && storedJid !== currentJid) {
		accountChanged = true;
		logger.warn("Pergantian nomor WhatsApp terdeteksi. Membatalkan antrean dan membersihkan data target lama.", {
			previousJid: storedJid,
			newJid: currentJid,
		});

		// 1. Batalkan dan hapus seluruh scheduled messages untuk nomor lama
		await db.delete(scheduledMessages);

		// 2. Hapus seluruh target grup lama
		await db.delete(messageTargets);
	}

	// Simpan identitas akun WA terhubung ke app_settings
	if (currentJid) {
		const accountData = {
			jid: currentJid,
			pushName: session.me?.pushName ?? "",
			updatedAt: now.toISOString(),
		};
		await db
			.insert(appSettings)
			.values({ key: "whatsapp_account", value: accountData, updatedAt: now })
			.onDuplicateKeyUpdate({ set: { value: accountData, updatedAt: now } });
	}

	const groups = await listGroups();
	const existingRows = await db.select().from(messageTargets);
	const existingMap = new Map(existingRows.map((r) => [r.targetId, r]));

	// Bersihkan grup yang sudah keluar / tidak lagi ada di akun WAHA
	const validGroupIds = new Set(groups.map((g) => g.id));
	const removedGroupIds: number[] = [];
	for (const row of existingRows) {
		if (!validGroupIds.has(row.targetId)) {
			removedGroupIds.push(row.id);
		}
	}
	if (removedGroupIds.length > 0) {
		for (const id of removedGroupIds) {
			await db.delete(messageTargets).where(eq(messageTargets.id, id));
		}
		logger.info("Grup yang sudah tidak terdaftar di WhatsApp dibersihkan dari target.", {
			count: removedGroupIds.length,
		});
	}

	let newCount = 0;
	let updatedCount = 0;

	for (const group of groups) {
		const existing = existingMap.get(group.id);
		if (existing) {
			if (existing.name !== group.name) {
				await db
					.update(messageTargets)
					.set({ name: group.name, updatedAt: now })
					.where(eq(messageTargets.id, existing.id));
				updatedCount += 1;
			}
		} else {
			await db.insert(messageTargets).values({
				targetType: "GROUP",
				targetId: group.id,
				name: group.name,
				isActive: false,
			});
			newCount += 1;
		}
	}

	return {
		totalSynced: groups.length,
		newCount,
		updatedCount,
		removedCount: removedGroupIds.length,
		accountChanged,
		accountJid: currentJid,
	};
}
