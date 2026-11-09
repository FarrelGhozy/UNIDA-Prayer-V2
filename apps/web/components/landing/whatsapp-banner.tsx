import { AlertCircle, Clock, PauseCircle, Send } from "lucide-react";
import type { PublicWhatsappStatus } from "../../types/prayer";

interface WhatsappBannerProps {
	status?: PublicWhatsappStatus;
}

export function WhatsappBanner({ status }: WhatsappBannerProps) {
	const state = status?.state ?? "CONNECTED";
	const activeCount = status?.activeGroupsCount ?? 0;
	const preMinutes = status?.preReminderMinutes ?? 3;

	if (state === "DISCONNECTED") {
		return (
			<div className="rounded-3xl glass-panel glass-sheen p-6 sm:p-7 shadow-[0_10px_35px_rgba(244,63,94,0.08)] dark:shadow-[0_15px_35px_rgba(244,63,94,0.15)] border-rose-500/20">
				<div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-start gap-4">
						<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/15 text-rose-600 shadow-[0_0_20px_rgba(244,63,94,0.2),inset_0_1px_1px_rgba(255,255,255,0.6)] dark:text-rose-400 dark:shadow-[0_0_20px_rgba(244,63,94,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)]">
							<AlertCircle className="h-6 w-6" />
						</div>
						<div className="space-y-1">
							<div className="flex items-center gap-2">
								<h2 className="text-base font-bold text-[#102A46] dark:text-white">
									Pengingat Otomatis WhatsApp Bot
								</h2>
								<span className="rounded-full border border-rose-400/30 bg-rose-500/15 px-2.5 py-0.5 text-[10px] font-bold text-rose-800 backdrop-blur-xs dark:text-rose-300">
									Terputus
								</span>
							</div>
							<p className="text-xs text-[#64748B] sm:text-sm dark:text-slate-300">
								Layanan pengingat otomatis WhatsApp saat ini sedang dalam pemeliharaan atau koneksi bot terputus. Penayangan hisab jadwal shalat di website tetap beroperasi normal.
							</p>
						</div>
					</div>

					<div className="inline-flex shrink-0 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/15 px-4 py-2.5 text-xs font-semibold text-rose-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] backdrop-blur-md dark:text-rose-300 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
						<span className="relative mr-2 flex h-2 w-2">
							<span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
						</span>
						<span>Koneksi Bot Terputus</span>
					</div>
				</div>
			</div>
		);
	}

	if (state === "PAUSED") {
		return (
			<div className="rounded-3xl glass-panel glass-sheen p-6 sm:p-7 shadow-[0_10px_35px_rgba(245,158,11,0.08)] dark:shadow-[0_15px_35px_rgba(245,158,11,0.15)] border-amber-500/20">
				<div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-start gap-4">
						<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/15 text-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.2),inset_0_1px_1px_rgba(255,255,255,0.6)] dark:text-amber-400 dark:shadow-[0_0_20px_rgba(245,158,11,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)]">
							<PauseCircle className="h-6 w-6" />
						</div>
						<div className="space-y-1">
							<div className="flex items-center gap-2">
								<h2 className="text-base font-bold text-[#102A46] dark:text-white">
									Pengingat Otomatis WhatsApp Bot
								</h2>
								<span className="rounded-full border border-amber-400/30 bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 backdrop-blur-xs dark:text-amber-300">
									Dijeda
								</span>
							</div>
							<p className="text-xs text-[#64748B] sm:text-sm dark:text-slate-300">
								Pengiriman pesan pengingat WhatsApp sedang dinonaktifkan sementara melalui panel administrasi. Jadwal shalat pada layar tetap aktif.
							</p>
						</div>
					</div>

					<div className="inline-flex shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/15 px-4 py-2.5 text-xs font-semibold text-amber-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] backdrop-blur-md dark:text-amber-300 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
						<Clock className="mr-1.5 h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
						<span>Pengiriman Dijeda</span>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="rounded-3xl glass-panel glass-sheen p-6 sm:p-7 shadow-[0_10px_35px_rgba(16,185,129,0.08)] dark:shadow-[0_15px_35px_rgba(16,185,129,0.15)]">
			<div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-start gap-4">
					<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.2),inset_0_1px_1px_rgba(255,255,255,0.6)] dark:text-emerald-400 dark:shadow-[0_0_20px_rgba(16,185,129,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)]">
						<Send className="h-6 w-6" />
					</div>
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<h2 className="text-base font-bold text-[#102A46] dark:text-white">
								Pengingat Otomatis WhatsApp Bot
							</h2>
							<span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 backdrop-blur-xs dark:text-emerald-300">
								Aktif
							</span>
						</div>
						<p className="text-xs text-[#64748B] sm:text-sm dark:text-slate-300">
							UNIDA Prayer mengirimkan pesan pre-reminder {preMinutes} menit sebelum adzan dan notifikasi tepat waktu shalat disertai hadits/ayat pilihan ke grup WhatsApp civitas akademika.
						</p>
					</div>
				</div>

				<div className="inline-flex shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-4 py-2.5 text-xs font-semibold text-emerald-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] backdrop-blur-md dark:text-emerald-300 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
					<span className="relative mr-2 flex h-2 w-2">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
						<span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
					</span>
					<span>{activeCount > 0 ? `Terkoneksi ${activeCount} Grup` : "Terkoneksi Grup"}</span>
				</div>
			</div>
		</div>
	);
}
