import { UnidaPrayerLogo } from "../shared/unida-prayer-logo";

export function Footer() {
	return (
		<footer className="relative z-10 mt-auto border-t border-white/10 bg-[#071629]/80 py-8 text-xs text-slate-300 backdrop-blur-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.25)]">
			<div className="mx-auto max-w-5xl px-4 sm:px-6">
				<div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
					<UnidaPrayerLogo href="/" size="sm" variant="full" theme="dark" />

					<div className="flex flex-col items-center gap-2 sm:items-end">
						<div className="flex items-center text-xs font-semibold text-emerald-300 bg-emerald-500/15 px-3.5 py-1 rounded-full border border-emerald-400/30 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
							<span className="relative mr-2 flex h-2 w-2">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
								<span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
							</span>
							<span>Sistem Operasional Kampus Siman</span>
						</div>
						<p className="text-[11px] text-slate-400 text-center sm:text-right">
							© 2026 Universitas Darussalam Gontor • UNIDA Prayer System V2.0
						</p>
						<p className="text-[10px] text-slate-400/80 font-medium tracking-wide text-center sm:text-right">
							Dibuat Oleh FarrelGhozy
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
