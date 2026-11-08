import { Sliders } from "lucide-react";

interface AdjustmentsSettingsCardProps {
	adjFajr: number;
	adjSunrise: number;
	adjDhuhr: number;
	adjAsr: number;
	adjMaghrib: number;
	adjIsha: number;
	hijriAdjustmentDays: number;
	onChangeAdjFajr: (val: number) => void;
	onChangeAdjSunrise: (val: number) => void;
	onChangeAdjDhuhr: (val: number) => void;
	onChangeAdjAsr: (val: number) => void;
	onChangeAdjMaghrib: (val: number) => void;
	onChangeAdjIsha: (val: number) => void;
	onChangeHijriDays: (val: number) => void;
}

export function AdjustmentsSettingsCard({
	adjFajr,
	adjSunrise,
	adjDhuhr,
	adjAsr,
	adjMaghrib,
	adjIsha,
	hijriAdjustmentDays,
	onChangeAdjFajr,
	onChangeAdjSunrise,
	onChangeAdjDhuhr,
	onChangeAdjAsr,
	onChangeAdjMaghrib,
	onChangeAdjIsha,
	onChangeHijriDays,
}: AdjustmentsSettingsCardProps) {
	return (
		<div className="rounded-3xl glass-panel glass-sheen p-5 sm:p-6 shadow-2xs space-y-4">
			<div className="flex items-center gap-2 border-b border-slate-200/60 pb-3 dark:border-white/10">
				<Sliders className="h-4 w-4 text-[#1D5FA7] dark:text-[#6BA9D8]" />
				<h2 className="text-sm font-bold text-[#102A46] dark:text-white">
					Koreksi Menit Shalat (Ihtiyath: -10 s/d +10 Menit)
				</h2>
			</div>

			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
				<div>
					<label className="block text-xs font-semibold text-[#102A46] mb-1 dark:text-slate-200">Subuh:</label>
					<input
						type="number"
						min={-10}
						max={10}
						value={adjFajr}
						onChange={(e) => onChangeAdjFajr(Number.parseInt(e.target.value, 10) || 0)}
						className="w-full rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2 text-xs text-center font-bold text-[#172B43] focus:bg-white focus:border-[#1D5FA7] focus:outline-none dark:border-white/15 dark:bg-black/25 dark:text-white dark:focus:border-sky-400"
					/>
				</div>
				<div>
					<label className="block text-xs font-semibold text-[#102A46] mb-1 dark:text-slate-200">Terbit:</label>
					<input
						type="number"
						min={-10}
						max={10}
						value={adjSunrise}
						onChange={(e) => onChangeAdjSunrise(Number.parseInt(e.target.value, 10) || 0)}
						className="w-full rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2 text-xs text-center font-bold text-[#172B43] focus:bg-white focus:border-[#1D5FA7] focus:outline-none dark:border-white/15 dark:bg-black/25 dark:text-white dark:focus:border-sky-400"
					/>
				</div>
				<div>
					<label className="block text-xs font-semibold text-[#102A46] mb-1 dark:text-slate-200">Dzuhur / Jumat:</label>
					<input
						type="number"
						min={-10}
						max={10}
						value={adjDhuhr}
						onChange={(e) => onChangeAdjDhuhr(Number.parseInt(e.target.value, 10) || 0)}
						className="w-full rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2 text-xs text-center font-bold text-[#172B43] focus:bg-white focus:border-[#1D5FA7] focus:outline-none dark:border-white/15 dark:bg-black/25 dark:text-white dark:focus:border-sky-400"
					/>
				</div>
				<div>
					<label className="block text-xs font-semibold text-[#102A46] mb-1 dark:text-slate-200">Ashar:</label>
					<input
						type="number"
						min={-10}
						max={10}
						value={adjAsr}
						onChange={(e) => onChangeAdjAsr(Number.parseInt(e.target.value, 10) || 0)}
						className="w-full rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2 text-xs text-center font-bold text-[#172B43] focus:bg-white focus:border-[#1D5FA7] focus:outline-none dark:border-white/15 dark:bg-black/25 dark:text-white dark:focus:border-sky-400"
					/>
				</div>
				<div>
					<label className="block text-xs font-semibold text-[#102A46] mb-1 dark:text-slate-200">Maghrib:</label>
					<input
						type="number"
						min={-10}
						max={10}
						value={adjMaghrib}
						onChange={(e) => onChangeAdjMaghrib(Number.parseInt(e.target.value, 10) || 0)}
						className="w-full rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2 text-xs text-center font-bold text-[#172B43] focus:bg-white focus:border-[#1D5FA7] focus:outline-none dark:border-white/15 dark:bg-black/25 dark:text-white dark:focus:border-sky-400"
					/>
				</div>
				<div>
					<label className="block text-xs font-semibold text-[#102A46] mb-1 dark:text-slate-200">Isya:</label>
					<input
						type="number"
						min={-10}
						max={10}
						value={adjIsha}
						onChange={(e) => onChangeAdjIsha(Number.parseInt(e.target.value, 10) || 0)}
						className="w-full rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2 text-xs text-center font-bold text-[#172B43] focus:bg-white focus:border-[#1D5FA7] focus:outline-none dark:border-white/15 dark:bg-black/25 dark:text-white dark:focus:border-sky-400"
					/>
				</div>
			</div>

			<div className="border-t border-slate-200/60 pt-3 dark:border-white/10">
				<label className="block text-xs font-semibold text-[#102A46] mb-1 dark:text-slate-200">
					Penyesuaian Hari Hijriyah (-2 s/d +2 hari):
				</label>
				<input
					type="number"
					min={-2}
					max={2}
					value={hijriAdjustmentDays}
					onChange={(e) => onChangeHijriDays(Number.parseInt(e.target.value, 10) || 0)}
					className="w-24 rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2 text-xs text-center font-bold text-[#172B43] focus:bg-white focus:border-[#1D5FA7] focus:outline-none dark:border-white/15 dark:bg-black/25 dark:text-white dark:focus:border-sky-400"
				/>
				<span className="ml-2 text-[11px] text-[#64748B] dark:text-slate-400">
					Digunakan untuk menyelaraskan tanggal hisab dengan hilal ru'yatul hilal lokal.
				</span>
			</div>
		</div>
	);
}
