import { Compass } from "lucide-react";

export function ValidationNotice() {
	return (
		<div className="rounded-2xl glass-panel glass-sheen p-4 text-xs text-slate-600 dark:text-slate-300">
			<div className="flex items-start gap-3">
				<div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-[#1D5FA7] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] dark:border-sky-400/20 dark:bg-sky-500/15 dark:text-[#6BA9D8] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
					<Compass className="h-4 w-4" />
				</div>
				<div className="space-y-1">
					<p className="font-bold text-[#102A46] dark:text-white">
						Rujukan Hisab & Ketentuan Validasi:
					</p>
					<p className="leading-relaxed">
						Jadwal hasil perhitungan hisab lokal kampus Siman (−7.8652, 111.4617) menggunakan metode sudut Subuh 20.0°, Isya 18.0°, Madhab Syafi&apos;i; validasi terhadap rujukan resmi Kemenag RI dan jadwal muadzin Masjid Jami&apos; UNIDA Gontor berjalan secara berkala.
					</p>
				</div>
			</div>
		</div>
	);
}
