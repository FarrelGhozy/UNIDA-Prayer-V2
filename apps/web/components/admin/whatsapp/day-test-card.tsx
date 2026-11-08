"use client";

import {
	AlertCircle,
	Bell,
	CalendarClock,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	Eye,
	Play,
	Send,
	Sparkles,
	Square,
	Volume2,
	XCircle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchApi } from "../../../lib/api-client";
import type { TestTargetMode } from "./test-message-card";

interface PreviewMessage {
	seq: number;
	prayerName: string;
	messageType: "PRE_REMINDER" | "ADHAN";
	label: string;
	body: string;
	contentRef: string;
}

interface PreviewData {
	target: { chatId: string; displayName: string };
	dateLocal: string;
	messages: PreviewMessage[];
	estimatedSeconds: number;
}

interface RunStatus {
	runId: string;
	status: "RUNNING" | "DONE" | "CANCELLED";
	total: number;
	sent: number;
	failed: number;
	target: string;
	results: { seq: number; ok: boolean; messageId?: string; error?: string }[];
}

interface DayTestCardProps {
	mode: TestTargetMode;
	targetId: number | null;
	phone: string;
	hasTargets: boolean;
}

function targetBody(
	mode: TestTargetMode,
	targetId: number | null,
	phone: string,
): Record<string, unknown> | null {
	if (mode === "GROUP") {
		if (targetId === null) return null;
		return { targetId };
	}
	if (phone.trim().length === 0) return null;
	return { phone: phone.trim() };
}

export function DayTestCard({ mode, targetId, phone, hasTargets }: DayTestCardProps) {
	const [preview, setPreview] = useState<PreviewData | null>(null);
	const [previewLoading, setPreviewLoading] = useState(false);
	const [previewError, setPreviewError] = useState<string | null>(null);
	const [run, setRun] = useState<RunStatus | null>(null);
	const [runError, setRunError] = useState<string | null>(null);
	const [cancelling, setCancelling] = useState(false);
	const [expandedSeqs, setExpandedSeqs] = useState<Record<number, boolean>>({});
	const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

	const stopPolling = useCallback(() => {
		if (pollTimer.current) {
			clearInterval(pollTimer.current);
			pollTimer.current = null;
		}
	}, []);

	useEffect(() => stopPolling, [stopPolling]);

	// Target berubah → pratinjau lama tidak berlaku lagi.
	useEffect(() => {
		setPreview(null);
		setPreviewError(null);
		setExpandedSeqs({});
	}, [mode, targetId, phone]);

	const handlePreview = async () => {
		const body = targetBody(mode, targetId, phone);
		if (!body) return;

		setPreviewLoading(true);
		setPreviewError(null);
		setPreview(null);

		const res = await fetchApi<PreviewData>("/api/admin/whatsapp/test-day/preview", {
			method: "POST",
			body: JSON.stringify(body),
		});

		if (res.data) {
			setPreview(res.data);
			// Secara default buka 2 pesan pertama untuk preview cepat
			setExpandedSeqs({ 0: true, 1: true });
		} else if (res.error) {
			setPreviewError(res.error.message);
		}
		setPreviewLoading(false);
	};

	const pollStatus = useCallback(
		async (runId: string) => {
			const res = await fetchApi<RunStatus>(
				`/api/admin/whatsapp/test-day/status?runId=${encodeURIComponent(runId)}`,
			);
			if (res.data) {
				setRun(res.data);
				if (res.data.status !== "RUNNING") stopPolling();
			} else if (res.error) {
				setRunError(res.error.message);
				stopPolling();
			}
		},
		[stopPolling],
	);

	const handleStart = async (indexes?: number[]) => {
		const body = targetBody(mode, targetId, phone);
		if (!body) return;

		setRunError(null);
		setRun(null);

		const res = await fetchApi<{ runId: string; total: number; estimatedSeconds: number }>(
			"/api/admin/whatsapp/test-day/start",
			{
				method: "POST",
				body: JSON.stringify({ ...body, ...(indexes ? { indexes } : {}) }),
			},
		);

		if (res.data) {
			const runId = res.data.runId;
			setRun({
				runId,
				status: "RUNNING",
				total: res.data.total,
				sent: 0,
				failed: 0,
				target: "",
				results: [],
			});
			stopPolling();
			pollTimer.current = setInterval(() => pollStatus(runId), 2000);
			void pollStatus(runId);
		} else if (res.error) {
			setRunError(res.error.message);
		}
	};

	const handleCancel = async () => {
		if (!run || run.status !== "RUNNING") return;
		setCancelling(true);
		const res = await fetchApi<{ runId: string; status: string }>(
			"/api/admin/whatsapp/test-day/cancel",
			{ method: "POST", body: JSON.stringify({ runId: run.runId }) },
		);
		if (res.error) setRunError(res.error.message);
		setCancelling(false);
		void pollStatus(run.runId);
	};

	const toggleExpand = (seq: number) => {
		setExpandedSeqs((prev) => ({ ...prev, [seq]: !prev[seq] }));
	};

	const toggleExpandAll = () => {
		if (!preview) return;
		const allExpanded = preview.messages.every((m) => expandedSeqs[m.seq]);
		const next: Record<number, boolean> = {};
		if (!allExpanded) {
			preview.messages.forEach((m) => {
				next[m.seq] = true;
			});
		}
		setExpandedSeqs(next);
	};

	const canTarget =
		mode === "PERSONAL" ? phone.trim().length > 0 : targetId !== null && hasTargets;
	const running = run?.status === "RUNNING";
	const firstPre = preview?.messages.find((m) => m.messageType === "PRE_REMINDER");

	return (
		<div className="rounded-3xl glass-panel glass-sheen p-6 space-y-5">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/60 pb-4 dark:border-white/10">
				<div className="flex items-center gap-2.5">
					<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#1D5FA7] dark:bg-blue-950/60 dark:text-[#6BA9D8]">
						<CalendarClock className="h-5 w-5" />
					</div>
					<div>
						<h2 className="text-sm font-bold text-[#102A46] sm:text-base dark:text-white">
							Simulasi Sehari Penuh (Full-Day Test)
						</h2>
						<p className="text-xs text-[#64748B] dark:text-slate-300">
							Uji pengiriman rangkaian 10 pesan jadwal hari ini (pre-reminder + adzan) dengan jeda acak anti-spam.
						</p>
					</div>
				</div>

				<div className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-[#102A46] dark:bg-white/10 dark:text-slate-200">
					<span className="text-slate-400 dark:text-slate-400">Target:</span>
					<span>{mode === "GROUP" ? "Grup WhatsApp" : "Nomor Pribadi"}</span>
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-2.5 pt-1">
				<button
					type="button"
					onClick={handlePreview}
					disabled={previewLoading || running || !canTarget}
					className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/70 px-4 py-2.5 text-xs font-bold text-[#102A46] shadow-2xs backdrop-blur-md transition hover:bg-white disabled:opacity-50 cursor-pointer dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
				>
					<Eye className={`h-4 w-4 ${previewLoading ? "animate-spin" : "text-[#1D5FA7] dark:text-[#6BA9D8]"}`} />
					<span>{previewLoading ? "Memuat Pratinjau..." : "Pratinjau Sehari Penuh"}</span>
				</button>

				{preview && !running && (
					<>
						{firstPre && (
							<button
								type="button"
								onClick={() => handleStart([firstPre.seq])}
								className="inline-flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-xs font-bold text-[#1D5FA7] hover:bg-blue-500/20 transition cursor-pointer dark:border-sky-400/30 dark:bg-sky-500/15 dark:text-[#6BA9D8] dark:hover:bg-sky-500/25"
							>
								<Send className="h-3.5 w-3.5 text-[#1D5FA7] dark:text-[#6BA9D8]" />
								<span>Kirim 1 Sampel (Pre-Reminder)</span>
							</button>
						)}

						<button
							type="button"
							onClick={() => handleStart()}
							className="inline-flex items-center gap-2 rounded-xl bg-[#123B6D] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#1D5FA7] transition cursor-pointer dark:bg-[#1D5FA7] dark:hover:bg-[#2563EB]"
						>
							<Play className="h-3.5 w-3.5" />
							<span>Kirim Semua 10 Pesan</span>
							<span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] font-mono">
								±{preview.estimatedSeconds}d
							</span>
						</button>
					</>
				)}

				{running && (
					<button
						type="button"
						onClick={handleCancel}
						disabled={cancelling}
						className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition disabled:opacity-50 cursor-pointer dark:bg-rose-700 dark:hover:bg-rose-800"
					>
						<Square className="h-3.5 w-3.5" />
						<span>{cancelling ? "Membatalkan..." : "Hentikan Simulasi"}</span>
					</button>
				)}
			</div>

			{!canTarget && (
				<div className="flex items-center gap-2.5 rounded-2xl bg-amber-50/90 p-3.5 text-xs font-medium text-amber-900 border border-amber-200/80 backdrop-blur-md dark:bg-amber-950/70 dark:border-amber-700/60 dark:text-amber-200">
					<AlertCircle className="h-4 w-4 text-amber-700 shrink-0 dark:text-amber-400" />
					<span>
						{mode === "GROUP"
							? "Pilih grup tujuan yang tersimpan terlebih dahulu pada pilihan di atas."
							: "Isi nomor WhatsApp pribadi tujuan pada input di atas."}
					</span>
				</div>
			)}

			{previewError && (
				<div className="flex items-center gap-2.5 rounded-2xl bg-rose-50/90 p-3.5 text-xs font-medium text-rose-900 border border-rose-200/80 backdrop-blur-md dark:bg-rose-950/70 dark:border-rose-800/60 dark:text-rose-200">
					<XCircle className="h-4 w-4 text-rose-700 shrink-0 dark:text-rose-400" />
					<span>{previewError}</span>
				</div>
			)}

			{/* Progress & Live Status Box */}
			{run && (
				<div className="rounded-2xl border border-blue-100 bg-white/70 p-4.5 space-y-3.5 shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-[#071322]/70">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
						<div className="flex items-center gap-2">
							<span
								className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
									run.status === "RUNNING"
										? "bg-blue-100 text-[#123B6D] animate-pulse dark:bg-blue-950/80 dark:text-sky-300"
										: run.status === "DONE"
											? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
											: "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300"
								}`}
							>
								{run.status === "RUNNING" && <span className="h-2 w-2 rounded-full bg-[#1D5FA7]" />}
								{run.status === "DONE" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />}
								<span>
									{run.status === "RUNNING"
										? "Sedang Mengirim..."
										: run.status === "DONE"
											? "Simulasi Selesai"
											: "Dibatalkan"}
								</span>
							</span>
							<span className="text-xs text-[#64748B] dark:text-slate-400">ke {run.target || "Target"}</span>
						</div>

						<div className="flex items-center gap-3 text-xs font-semibold">
							<span className="text-emerald-700 font-mono dark:text-emerald-400">
								✓ {run.sent} Terkirim
							</span>
							{run.failed > 0 && (
								<span className="text-rose-700 font-mono dark:text-rose-400">
									✗ {run.failed} Gagal
								</span>
							)}
							<span className="text-slate-500 font-mono dark:text-slate-400">
								/ Total {run.total}
							</span>
						</div>
					</div>

					<div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 shadow-inner dark:bg-white/10">
						<div
							className={`h-full transition-all duration-300 ${
								run.status === "DONE"
									? "bg-emerald-600"
									: run.status === "CANCELLED"
										? "bg-slate-500"
										: "bg-linear-to-r from-[#123B6D] to-[#1D5FA7]"
							}`}
							style={{
								width: `${run.total > 0 ? ((run.sent + run.failed) / run.total) * 100 : 0}%`,
							}}
						/>
					</div>

					{run.results.some((r) => !r.ok) && (
						<div className="rounded-xl bg-rose-50 p-3 space-y-1 border border-rose-200/80 dark:bg-rose-950/60 dark:border-rose-900/60">
							{run.results
								.filter((r) => !r.ok)
								.map((r) => (
									<p key={r.seq} className="text-xs text-rose-800 dark:text-rose-300">
										• Pesan #{r.seq + 1} gagal dikirim: {r.error}
									</p>
								))}
						</div>
					)}
				</div>
			)}

			{runError && (
				<div className="flex items-center gap-2.5 rounded-2xl bg-rose-50/90 p-3.5 text-xs font-medium text-rose-900 border border-rose-200/80 backdrop-blur-md dark:bg-rose-950/70 dark:border-rose-800/60 dark:text-rose-200">
					<XCircle className="h-4 w-4 text-rose-700 shrink-0 dark:text-rose-400" />
					<span>{runError}</span>
				</div>
			)}

			{/* WhatsApp Message Preview Section */}
			{preview && (
				<div className="space-y-3 pt-2">
					<div className="flex items-center justify-between border-t border-slate-200/60 pt-3 dark:border-white/10">
						<div className="flex items-center gap-2">
							<span className="text-xs font-bold text-[#102A46] dark:text-white">
								Rangkaian Pesan ({preview.messages.length} Pesan)
							</span>
							<span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
								{preview.target.displayName}
							</span>
						</div>

						<button
							type="button"
							onClick={toggleExpandAll}
							className="text-[11px] font-semibold text-[#1D5FA7] hover:underline cursor-pointer dark:text-[#6BA9D8]"
						>
							{preview.messages.every((m) => expandedSeqs[m.seq])
								? "Tutup Semua"
								: "Buka Semua"}
						</button>
					</div>

					<div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
						{preview.messages.map((m) => {
							const isPre = m.messageType === "PRE_REMINDER";
							const isExpanded = !!expandedSeqs[m.seq];

							return (
								<div
									key={m.seq}
									className={`rounded-2xl border transition-all ${
										isExpanded
											? "border-slate-300 bg-white shadow-xs dark:border-white/20 dark:bg-[#0A1B2E]"
											: "border-slate-200/80 bg-slate-50/60 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
									}`}
								>
									<div
										onClick={() => toggleExpand(m.seq)}
										className="flex cursor-pointer items-center justify-between px-4 py-3 select-none"
									>
										<div className="flex items-center gap-2.5">
											<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-200 font-mono text-[11px] font-bold text-slate-700 dark:bg-white/15 dark:text-white">
												{m.seq + 1}
											</span>

											<span
												className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
													isPre
														? "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300"
														: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
												}`}
											>
												{isPre ? (
													<Bell className="h-3 w-3" />
												) : (
													<Volume2 className="h-3 w-3" />
												)}
												{isPre ? "Pre-Reminder" : "Adzan & Hadits"}
											</span>

											<span className="text-xs font-bold text-[#102A46] dark:text-white">
												{m.label.replace(/^(Pre-reminder|Adzan)\s*·\s*/i, "")}
											</span>
										</div>

										<div className="flex items-center gap-2">
											{!running && (
												<button
													type="button"
													onClick={(e) => {
														e.stopPropagation();
														void handleStart([m.seq]);
													}}
													className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-[#123B6D] hover:bg-blue-50 transition dark:border-white/15 dark:bg-white/10 dark:text-[#6BA9D8] dark:hover:bg-white/20"
													title="Kirim hanya pesan ini ke target"
												>
													Kirim Ini
												</button>
											)}
											{isExpanded ? (
												<ChevronUp className="h-4 w-4 text-slate-400" />
											) : (
												<ChevronDown className="h-4 w-4 text-slate-400" />
											)}
										</div>
									</div>

									{isExpanded && (
										<div className="border-t border-slate-100 px-4 pb-4 pt-3 space-y-2 dark:border-white/10">
											<div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3.5 shadow-2xs dark:border-emerald-900/60 dark:bg-emerald-950/40">
												<div className="flex items-center gap-1.5 pb-2 text-[10px] font-semibold text-emerald-800 border-b border-emerald-100/80 dark:text-emerald-300 dark:border-emerald-900/60">
													<Sparkles className="h-3 w-3" />
													<span>Pratinjau Format Pesan WhatsApp:</span>
												</div>
												<p className="mt-2 whitespace-pre-wrap font-sans text-xs leading-relaxed text-[#172B43] dark:text-slate-100">
													{m.body}
												</p>
											</div>

											{m.contentRef && (
												<p className="text-[10px] text-slate-400 font-mono dark:text-slate-500">
													Ref: {m.contentRef}
												</p>
											)}
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
