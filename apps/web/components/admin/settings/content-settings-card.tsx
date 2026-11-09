import { BookOpen, Sliders } from "lucide-react";
import { ToggleSwitch } from "../../shared/toggle-switch";

interface ContentSettingsCardProps {
	includeHadith: boolean;
	landingHadithEnabled?: boolean;
	onChangeIncludeHadith: (val: boolean) => void;
	onChangeLandingHadithEnabled?: (val: boolean) => void;
}

export function ContentSettingsCard({
	includeHadith,
	landingHadithEnabled = true,
	onChangeIncludeHadith,
	onChangeLandingHadithEnabled,
}: ContentSettingsCardProps) {
	return (
		<div className="glass-panel glass-sheen rounded-3xl border border-slate-200/80 bg-white/95 p-5 sm:p-6 shadow-2xs space-y-4 dark:border-white/10 dark:bg-[#0D1C2E]/80">
			<div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
				<Sliders className="h-4 w-4 text-[#1D5FA7] dark:text-[#6BA9D8]" />
				<h2 className="text-sm font-bold text-[#102A46] dark:text-white">
					Pengaturan Konten & Hadits
				</h2>
			</div>

			<div className="space-y-4 text-xs">
				<ToggleSwitch
					id="include-hadith-switch"
					checked={includeHadith}
					onChange={onChangeIncludeHadith}
					label="Sertakan Hadits / Ayat Harian pada Pesan Adzan"
					description="Bila diaktifkan, bot akan memilih hadits aktif secara acak dan bergiliran untuk disisipkan ke dalam pesan adzan WhatsApp."
				/>

				{onChangeLandingHadithEnabled && (
					<div className="border-t border-slate-100 dark:border-white/5 pt-3">
						<ToggleSwitch
							id="landing-hadith-switch"
							checked={landingHadithEnabled}
							onChange={onChangeLandingHadithEnabled}
							label={
								<span className="inline-flex items-center gap-1.5">
									<BookOpen className="h-3.5 w-3.5 text-[#1D5FA7] dark:text-sky-400" />
									Tampilkan Kutipan Hadits di Halaman Utama (Landing)
								</span>
							}
							description="Menampilkan kutipan hadits/ayat pilihan secara acak dari sistem di bawah tabel jadwal mingguan pada halaman publik."
							variant="emerald"
						/>
					</div>
				)}
			</div>
		</div>
	);
}
