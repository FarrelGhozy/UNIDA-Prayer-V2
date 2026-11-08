import { Send } from "lucide-react";

export function WhatsappBanner() {
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
							UNIDA Prayer mengirimkan pesan pre-reminder 3 menit sebelum adzan dan notifikasi tepat waktu shalat disertai hadits/ayat pilihan ke grup WhatsApp civitas akademika.
						</p>
					</div>
				</div>

				<div className="inline-flex shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-4 py-2.5 text-xs font-semibold text-emerald-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] backdrop-blur-md dark:text-emerald-300 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
					<span className="relative mr-2 flex h-2 w-2">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
						<span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
					</span>
					<span>Terkoneksi Grup</span>
				</div>
			</div>
		</div>
	);
}
