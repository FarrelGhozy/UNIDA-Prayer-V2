"use client";

import { Hourglass } from "lucide-react";
import { ToggleSwitch } from "../../shared/toggle-switch";

export interface IqamahIntervals {
	FAJR: number;
	DHUHR: number;
	ASR: number;
	MAGHRIB: number;
	ISHA: number;
}

interface IqamahSettingsCardProps {
	enabled: boolean;
	intervals: IqamahIntervals;
	onChangeEnabled: (val: boolean) => void;
	onChangeInterval: (prayer: keyof IqamahIntervals, val: number) => void;
}

const PRAYER_LABELS: Record<keyof IqamahIntervals, { name: string; defaultHint: string }> = {
	FAJR: { name: "Subuh", defaultHint: "Default: 15 menit" },
	DHUHR: { name: "Dzuhur / Jumat", defaultHint: "Default: 10 menit" },
	ASR: { name: "Ashar", defaultHint: "Default: 10 menit" },
	MAGHRIB: { name: "Maghrib", defaultHint: "Default: 15 menit" },
	ISHA: { name: "Isya", defaultHint: "Default: 10 menit" },
};

export function IqamahSettingsCard({
	enabled,
	intervals,
	onChangeEnabled,
	onChangeInterval,
}: IqamahSettingsCardProps) {
	const prayerKeys: Array<keyof IqamahIntervals> = ["FAJR", "DHUHR", "ASR", "MAGHRIB", "ISHA"];

	return (
		<div className="glass-panel glass-sheen rounded-3xl border border-slate-200/80 bg-white/95 p-5 sm:p-6 shadow-2xs space-y-5 dark:border-white/10 dark:bg-[#0D1C2E]/80">
			<div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
				<Hourglass className="h-4 w-4 text-[#1D5FA7] dark:text-[#6BA9D8]" />
				<h2 className="text-sm font-bold text-[#102A46] dark:text-white">
					Jeda Adzan ke Iqomah
				</h2>
			</div>

			<div className="space-y-4 text-xs">
				<ToggleSwitch
					id="iqamah-enabled-switch"
					checked={enabled}
					onChange={onChangeEnabled}
					label="Aktifkan Hitung Mundur Jeda Iqomah di Halaman Utama"
					description="Saat waktu shalat masuk, layar utama akan menghitung mundur sisa menit menuju kumandang iqomah sebelum berganti ke shalat berikutnya."
					variant="emerald"
				/>

				{enabled && (
					<div className="border-t border-slate-100 dark:border-white/5 pt-4 space-y-3">
						<span className="block font-bold text-xs text-[#102A46] dark:text-slate-200">
							Durasi Jeda Iqomah per Waktu Shalat (Menit):
						</span>

						<div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
							{prayerKeys.map((key) => {
								const info = PRAYER_LABELS[key];
								return (
									<div
										key={key}
										className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-3 dark:border-white/10 dark:bg-slate-900/40"
									>
										<label
											htmlFor={`iqamah-interval-${key}`}
											className="block font-bold text-xs text-[#102A46] dark:text-slate-200 mb-1"
										>
											{info.name}
										</label>
										<div className="flex items-center gap-1.5">
											<input
												id={`iqamah-interval-${key}`}
												type="number"
												min={1}
												max={60}
												value={intervals[key] ?? 10}
												onChange={(e) =>
													onChangeInterval(
														key,
														Math.max(1, Math.min(60, Number.parseInt(e.target.value, 10) || 10)),
													)
												}
												className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-center font-mono text-sm font-bold text-[#172B43] focus:border-[#1D5FA7] focus:outline-none dark:border-white/15 dark:bg-slate-900/80 dark:text-white dark:focus:border-sky-400"
											/>
											<span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
												mnt
											</span>
										</div>
										<span className="mt-1 block text-[10px] text-slate-400 dark:text-slate-500">
											{info.defaultHint}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
