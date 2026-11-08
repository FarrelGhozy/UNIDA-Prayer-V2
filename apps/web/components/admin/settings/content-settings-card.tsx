import { Sliders } from "lucide-react";

interface ContentSettingsCardProps {
	includeHadith: boolean;
	onChangeIncludeHadith: (val: boolean) => void;
}

export function ContentSettingsCard({
	includeHadith,
	onChangeIncludeHadith,
}: ContentSettingsCardProps) {
	return (
		<div className="glass-panel glass-sheen rounded-3xl border border-slate-200/80 bg-white/95 p-5 sm:p-6 shadow-2xs space-y-4 dark:border-white/10 dark:bg-[#0D1C2E]/80">
			<div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
				<Sliders className="h-4 w-4 text-[#1D5FA7] dark:text-[#6BA9D8]" />
				<h2 className="text-sm font-bold text-[#102A46] dark:text-white">
					Pengaturan Konten & Hadits
				</h2>
			</div>

			<div className="space-y-3 text-xs">
				<div className="flex items-start gap-3">
					<input
						type="checkbox"
						id="include-hadith-check"
						checked={includeHadith}
						onChange={(e) => onChangeIncludeHadith(e.target.checked)}
						className="mt-0.5 h-4 w-4 rounded-md border-slate-300 text-[#123B6D] focus:ring-[#1D5FA7] dark:border-white/20 dark:bg-slate-900/60"
					/>
					<label htmlFor="include-hadith-check" className="cursor-pointer">
						<span className="font-bold text-[#102A46] dark:text-slate-200">
							Sertakan Kutipan Hadits / Ayat Harian pada Pesan Adzan
						</span>
						<p className="text-[#64748B] text-[11px] mt-0.5 dark:text-slate-400">
							Bila diaktifkan, bot akan memilih hadits aktif secara acak dan bergiliran untuk disisipkan ke dalam pesan adzan.
						</p>
					</label>
				</div>
			</div>
		</div>
	);
}
