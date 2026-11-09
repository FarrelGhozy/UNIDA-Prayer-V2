import {
	calcPrayerTimes,
	formatHijri,
	getNextPrayer,
	type HijriDateInfo,
	type NextPrayerInfo,
	type PrayerEngineInput,
	type PrayerOrSunrise,
	type PrayerTimesResult,
} from "@unida-prayer/prayer-engine";
import { formatInTimeZone } from "date-fns-tz";
import { eq } from "drizzle-orm";
import { db } from "../../database/client";
import { appSettings } from "../../database/schema/appSettings";
import { hadiths } from "../../database/schema/hadiths";
import { messageTargets } from "../../database/schema/targets";
import { getSessionStatus } from "../../integrations/waha";

export type FardPrayerName = "FAJR" | "DHUHR" | "ASR" | "MAGHRIB" | "ISHA";

export interface IqamahSettings {
	enabled: boolean;
	intervals: Record<FardPrayerName, number>;
}

export interface PublicWhatsappStatus {
	state: "CONNECTED" | "DISCONNECTED" | "PAUSED";
	activeGroupsCount: number;
	preReminderMinutes: number;
}

export interface ResolvedSettings {
	location: {
		name: string;
		latitude: number;
		longitude: number;
		timezone: string;
	};
	calculation: {
		fajrAngle: number;
		ishaAngle: number;
		asrFactor: 1 | 2;
		methodLabel: string;
	};
	adjustments: Record<PrayerOrSunrise, number>;
	hijri: {
		adjustmentDays: number;
	};
	reminder: {
		enabled: boolean;
		preReminderEnabled: boolean;
		adhanReminderEnabled: boolean;
		preReminderMinutes: number;
		lateGraceMinutes: number;
	};
	iqamah: IqamahSettings;
}

export const DEFAULT_SETTINGS: ResolvedSettings = {
	location: {
		name: "UNIDA Gontor",
		latitude: -7.8652,
		longitude: 111.4617,
		timezone: "Asia/Jakarta",
	},
	calculation: {
		fajrAngle: 20.0,
		ishaAngle: 18.0,
		asrFactor: 1,
		methodLabel: "Kemenag",
	},
	adjustments: {
		FAJR: 0,
		SUNRISE: 0,
		DHUHR: 0,
		ASR: 0,
		MAGHRIB: 0,
		ISHA: 0,
	},
	hijri: {
		adjustmentDays: 0,
	},
	reminder: {
		enabled: true,
		preReminderEnabled: true,
		adhanReminderEnabled: true,
		preReminderMinutes: 3,
		lateGraceMinutes: 5,
	},
	iqamah: {
		enabled: true,
		intervals: {
			FAJR: 15,
			DHUHR: 10,
			ASR: 10,
			MAGHRIB: 15,
			ISHA: 10,
		},
	},
};

function isValidTimezone(tz: string): boolean {
	try {
		Intl.DateTimeFormat(undefined, { timeZone: tz });
		return true;
	} catch {
		return false;
	}
}

export async function getResolvedSettings(): Promise<ResolvedSettings> {
	const rows = await db.select().from(appSettings);
	const map = new Map<string, unknown>();
	for (const row of rows) {
		map.set(row.key, row.value);
	}

	const loc = map.get("location") as Partial<ResolvedSettings["location"]> | undefined;
	const calc = map.get("prayer_calculation") as Partial<ResolvedSettings["calculation"]> | undefined;
	const adj = map.get("prayer_adjustments") as Partial<Record<string, number>> | undefined;
	const hij = map.get("hijri_settings") as Partial<ResolvedSettings["hijri"]> | undefined;
	const rem = map.get("reminder_settings") as Partial<ResolvedSettings["reminder"]> | undefined;
	const iqamah = map.get("iqamah_settings") as Partial<IqamahSettings> | undefined;
	const iqIntervals = iqamah?.intervals;

	const tzRaw = typeof loc?.timezone === "string" ? loc.timezone : DEFAULT_SETTINGS.location.timezone;
	const timezone = isValidTimezone(tzRaw) ? tzRaw : DEFAULT_SETTINGS.location.timezone;

	return {
		location: {
			name: typeof loc?.name === "string" ? loc.name : DEFAULT_SETTINGS.location.name,
			latitude: typeof loc?.latitude === "number" ? loc.latitude : DEFAULT_SETTINGS.location.latitude,
			longitude: typeof loc?.longitude === "number" ? loc.longitude : DEFAULT_SETTINGS.location.longitude,
			timezone,
		},
		calculation: {
			fajrAngle: typeof calc?.fajrAngle === "number" ? calc.fajrAngle : DEFAULT_SETTINGS.calculation.fajrAngle,
			ishaAngle: typeof calc?.ishaAngle === "number" ? calc.ishaAngle : DEFAULT_SETTINGS.calculation.ishaAngle,
			asrFactor: calc?.asrFactor === 2 ? 2 : 1,
			methodLabel: typeof calc?.methodLabel === "string" ? calc.methodLabel : DEFAULT_SETTINGS.calculation.methodLabel,
		},
		adjustments: {
			FAJR: typeof adj?.FAJR === "number" ? adj.FAJR : (typeof adj?.fajr === "number" ? adj.fajr : 0),
			SUNRISE: typeof adj?.SUNRISE === "number" ? adj.SUNRISE : (typeof adj?.sunrise === "number" ? adj.sunrise : 0),
			DHUHR: typeof adj?.DHUHR === "number" ? adj.DHUHR : (typeof adj?.dhuhr === "number" ? adj.dhuhr : 0),
			ASR: typeof adj?.ASR === "number" ? adj.ASR : (typeof adj?.asr === "number" ? adj.asr : 0),
			MAGHRIB: typeof adj?.MAGHRIB === "number" ? adj.MAGHRIB : (typeof adj?.maghrib === "number" ? adj.maghrib : 0),
			ISHA: typeof adj?.ISHA === "number" ? adj.ISHA : (typeof adj?.isha === "number" ? adj.isha : 0),
		},
		hijri: {
			adjustmentDays: typeof hij?.adjustmentDays === "number" ? hij.adjustmentDays : DEFAULT_SETTINGS.hijri.adjustmentDays,
		},
		reminder: {
			enabled: typeof rem?.enabled === "boolean" ? rem.enabled : DEFAULT_SETTINGS.reminder.enabled,
			preReminderEnabled: typeof rem?.preReminderEnabled === "boolean" ? rem.preReminderEnabled : DEFAULT_SETTINGS.reminder.preReminderEnabled,
			adhanReminderEnabled: typeof rem?.adhanReminderEnabled === "boolean" ? rem.adhanReminderEnabled : DEFAULT_SETTINGS.reminder.adhanReminderEnabled,
			preReminderMinutes: typeof rem?.preReminderMinutes === "number" ? rem.preReminderMinutes : DEFAULT_SETTINGS.reminder.preReminderMinutes,
			lateGraceMinutes: typeof rem?.lateGraceMinutes === "number" ? rem.lateGraceMinutes : DEFAULT_SETTINGS.reminder.lateGraceMinutes,
		},
		iqamah: {
			enabled: typeof iqamah?.enabled === "boolean" ? iqamah.enabled : DEFAULT_SETTINGS.iqamah.enabled,
			intervals: {
				FAJR: typeof iqIntervals?.FAJR === "number" ? iqIntervals.FAJR : DEFAULT_SETTINGS.iqamah.intervals.FAJR,
				DHUHR: typeof iqIntervals?.DHUHR === "number" ? iqIntervals.DHUHR : DEFAULT_SETTINGS.iqamah.intervals.DHUHR,
				ASR: typeof iqIntervals?.ASR === "number" ? iqIntervals.ASR : DEFAULT_SETTINGS.iqamah.intervals.ASR,
				MAGHRIB: typeof iqIntervals?.MAGHRIB === "number" ? iqIntervals.MAGHRIB : DEFAULT_SETTINGS.iqamah.intervals.MAGHRIB,
				ISHA: typeof iqIntervals?.ISHA === "number" ? iqIntervals.ISHA : DEFAULT_SETTINGS.iqamah.intervals.ISHA,
			},
		},
	};
}

let cachedWahaState: { status: string; expiresAt: number } | null = null;

async function getCachedWahaWorking(): Promise<boolean> {
	const now = Date.now();
	if (cachedWahaState && cachedWahaState.expiresAt > now) {
		return cachedWahaState.status === "WORKING";
	}
	try {
		const session = await getSessionStatus();
		cachedWahaState = {
			status: session.status,
			expiresAt: now + 20_000,
		};
		return session.status === "WORKING";
	} catch {
		cachedWahaState = {
			status: "FAILED",
			expiresAt: now + 20_000,
		};
		return false;
	}
}

export interface TodayPrayerResponse {
	locationName: string;
	timezone: string;
	coordinates: {
		latitude: number;
		longitude: number;
	};
	dateLocal: string;
	isFriday: boolean;
	hijri: HijriDateInfo;
	times: PrayerTimesResult["times"];
	nextPrayer: NextPrayerInfo;
	serverNowUtc: string;
	iqamah: IqamahSettings;
	randomHadith?: { id: number; text: string; source: string } | null;
	whatsappStatus: PublicWhatsappStatus;
}

export async function getTodayPrayer(dateQuery?: string): Promise<TodayPrayerResponse> {
	const settings = await getResolvedSettings();
	const now = new Date();

	const dateLocal =
		dateQuery && /^\d{4}-\d{2}-\d{2}$/.test(dateQuery)
			? dateQuery
			: formatInTimeZone(now, settings.location.timezone, "yyyy-MM-dd");

	const engineInput: PrayerEngineInput = {
		dateLocal,
		latitude: settings.location.latitude,
		longitude: settings.location.longitude,
		timezone: settings.location.timezone,
		fajrAngle: settings.calculation.fajrAngle,
		ishaAngle: settings.calculation.ishaAngle,
		asrFactor: settings.calculation.asrFactor,
		adjustmentsMinutes: settings.adjustments,
	};

	const prayerTimes = calcPrayerTimes(engineInput);
	const hijri = formatHijri(dateLocal, settings.hijri.adjustmentDays);
	const nextPrayer = getNextPrayer({
		todayResult: prayerTimes,
		nowUtc: now,
		inputForTomorrow: {
			...engineInput,
			dateLocal: formatInTimeZone(
				new Date(now.getTime() + 24 * 60 * 60 * 1000),
				settings.location.timezone,
				"yyyy-MM-dd",
			),
		},
	});

	const rows = await db.select().from(appSettings);
	const map = new Map<string, unknown>();
	for (const row of rows) {
		map.set(row.key, row.value);
	}
	const content = (map.get("content_settings") as {
		includeHadith?: boolean;
		sendingEnabled?: boolean;
		landingHadithEnabled?: boolean;
	}) ?? {};

	let randomHadith: { id: number; text: string; source: string } | null = null;
	if (content.landingHadithEnabled !== false) {
		const activeHadiths = await db
			.select({ id: hadiths.id, text: hadiths.text, source: hadiths.source })
			.from(hadiths)
			.where(eq(hadiths.isActive, true));
		if (activeHadiths.length > 0) {
			const picked =
				activeHadiths[Math.floor(Math.random() * activeHadiths.length)];
			if (picked) {
				randomHadith = picked;
			}
		}
	}

	const activeTargets = await db
		.select({ id: messageTargets.id })
		.from(messageTargets)
		.where(eq(messageTargets.isActive, true));

	const isPaused =
		!settings.reminder.enabled || content.sendingEnabled === false;

	let waState: "CONNECTED" | "DISCONNECTED" | "PAUSED" = "DISCONNECTED";
	if (isPaused) {
		waState = "PAUSED";
	} else if (activeTargets.length === 0) {
		waState = "DISCONNECTED";
	} else {
		const isWahaWorking = await getCachedWahaWorking();
		waState = isWahaWorking ? "CONNECTED" : "DISCONNECTED";
	}

	const whatsappStatus: PublicWhatsappStatus = {
		state: waState,
		activeGroupsCount: activeTargets.length,
		preReminderMinutes: settings.reminder.preReminderMinutes,
	};

	return {
		locationName: settings.location.name,
		timezone: settings.location.timezone,
		coordinates: {
			latitude: settings.location.latitude,
			longitude: settings.location.longitude,
		},
		dateLocal,
		isFriday: prayerTimes.isFriday,
		hijri,
		times: prayerTimes.times,
		nextPrayer,
		serverNowUtc: now.toISOString(),
		iqamah: settings.iqamah,
		randomHadith,
		whatsappStatus,
	};
}

export async function getNextPrayerOnly(): Promise<{
	nextPrayer: NextPrayerInfo;
	serverNowUtc: string;
}> {
	const today = await getTodayPrayer();
	return {
		nextPrayer: today.nextPrayer,
		serverNowUtc: today.serverNowUtc,
	};
}

export interface WeeklyPrayerDay {
	dateLocal: string;
	dayName: string;
	dayFormatted: string;
	isToday: boolean;
	isTomorrow: boolean;
	isFriday: boolean;
	hijri: HijriDateInfo;
	times: {
		fajr: string;
		sunrise: string;
		dhuhr: string;
		asr: string;
		maghrib: string;
		isha: string;
	};
}

export interface WeeklyPrayerResponse {
	locationName: string;
	timezone: string;
	startDate: string;
	days: WeeklyPrayerDay[];
}

export async function getWeeklyPrayer(
	startDateQuery?: string,
): Promise<WeeklyPrayerResponse> {
	const settings = await getResolvedSettings();
	const now = new Date();
	const todayDateLocal = formatInTimeZone(
		now,
		settings.location.timezone,
		"yyyy-MM-dd",
	);

	const tomorrowDateLocal = formatInTimeZone(
		new Date(now.getTime() + 24 * 60 * 60 * 1000),
		settings.location.timezone,
		"yyyy-MM-dd",
	);

	const baseDateLocal =
		startDateQuery && /^\d{4}-\d{2}-\d{2}$/.test(startDateQuery)
			? startDateQuery
			: tomorrowDateLocal;

	const parts = baseDateLocal.split("-").map(Number);
	const y = parts[0] as number;
	const m = parts[1] as number;
	const d = parts[2] as number;
	const days: WeeklyPrayerDay[] = [];

	for (let i = 0; i < 7; i++) {
		const dateObj = new Date(Date.UTC(y, m - 1, d + i, 5, 0, 0));
		const curDateLocal = formatInTimeZone(
			dateObj,
			settings.location.timezone,
			"yyyy-MM-dd",
		);

		const engineInput: PrayerEngineInput = {
			dateLocal: curDateLocal,
			latitude: settings.location.latitude,
			longitude: settings.location.longitude,
			timezone: settings.location.timezone,
			fajrAngle: settings.calculation.fajrAngle,
			ishaAngle: settings.calculation.ishaAngle,
			asrFactor: settings.calculation.asrFactor,
			adjustmentsMinutes: settings.adjustments,
		};

		const prayerTimes = calcPrayerTimes(engineInput);
		const hijri = formatHijri(curDateLocal, settings.hijri.adjustmentDays);

		const dayName = new Intl.DateTimeFormat("id-ID", {
			weekday: "long",
			timeZone: settings.location.timezone,
		}).format(dateObj);

		const dayFormatted = new Intl.DateTimeFormat("id-ID", {
			day: "numeric",
			month: "short",
			timeZone: settings.location.timezone,
		}).format(dateObj);

		days.push({
			dateLocal: curDateLocal,
			dayName,
			dayFormatted,
			isToday: curDateLocal === todayDateLocal,
			isTomorrow: curDateLocal === tomorrowDateLocal,
			isFriday: prayerTimes.isFriday,
			hijri,
			times: {
				fajr: prayerTimes.times.FAJR.time24,
				sunrise: prayerTimes.times.SUNRISE.time24,
				dhuhr: prayerTimes.times.DHUHR.time24,
				asr: prayerTimes.times.ASR.time24,
				maghrib: prayerTimes.times.MAGHRIB.time24,
				isha: prayerTimes.times.ISHA.time24,
			},
		});
	}

	return {
		locationName: settings.location.name,
		timezone: settings.location.timezone,
		startDate: baseDateLocal,
		days,
	};
}

export async function getPublicSettings() {
	const settings = await getResolvedSettings();
	return {
		locationName: settings.location.name,
		timezone: settings.location.timezone,
		coordinates: {
			latitude: settings.location.latitude,
			longitude: settings.location.longitude,
		},
		methodLabel: settings.calculation.methodLabel,
		preReminderMinutes: settings.reminder.preReminderMinutes,
		hijriAdjustmentDays: settings.hijri.adjustmentDays,
		iqamah: settings.iqamah,
	};
}

export interface PreviewPrayerInput {
	dateLocal?: string;
	latitude?: number;
	longitude?: number;
	timezone?: string;
	fajrAngle?: number;
	ishaAngle?: number;
	asrFactor?: 1 | 2;
	adjustmentsMinutes?: Partial<Record<PrayerOrSunrise, number>>;
	hijriAdjustmentDays?: number;
}

export async function previewPrayerTimes(candidate: PreviewPrayerInput) {
	const settings = await getResolvedSettings();
	const now = new Date();

	const timezone = candidate.timezone ?? settings.location.timezone;
	const dateLocal =
		candidate.dateLocal ??
		formatInTimeZone(now, timezone, "yyyy-MM-dd");

	const engineInput: PrayerEngineInput = {
		dateLocal,
		latitude: candidate.latitude ?? settings.location.latitude,
		longitude: candidate.longitude ?? settings.location.longitude,
		timezone,
		fajrAngle: candidate.fajrAngle ?? settings.calculation.fajrAngle,
		ishaAngle: candidate.ishaAngle ?? settings.calculation.ishaAngle,
		asrFactor: candidate.asrFactor ?? settings.calculation.asrFactor,
		adjustmentsMinutes: {
			...settings.adjustments,
			...candidate.adjustmentsMinutes,
		},
	};

	const prayerTimes = calcPrayerTimes(engineInput);
	const hijriAdj = candidate.hijriAdjustmentDays ?? settings.hijri.adjustmentDays;
	const hijri = formatHijri(dateLocal, hijriAdj);

	return {
		input: engineInput,
		hijri,
		times: prayerTimes.times,
		isFriday: prayerTimes.isFriday,
		serverNowUtc: now.toISOString(),
	};
}
