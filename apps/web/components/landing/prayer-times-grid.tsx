"use client";

import {
	Check,
	CloudSun,
	Copy,
	Moon,
	RefreshCw,
	Sun,
	SunMedium,
	Sunrise,
	Sunset,
} from "lucide-react";
import { useState } from "react";
import type { SlotStatus, TodayPrayerData } from "../../types/prayer";
import { PrayerCard } from "./prayer-card";

interface PrayerTimesGridProps {
	data: TodayPrayerData;
	refreshing: boolean;
	onRefresh: () => void;
	getSlotStatus: (utcString: string, prayerName: string) => SlotStatus;
}

export function PrayerTimesGrid({
	data,
	refreshing,
	onRefresh,
	getSlotStatus,
}: PrayerTimesGridProps) {
	const [copied, setCopied] = useState(false);

	const handleCopySchedule = async () => {
		const text = `🕌 *Jadwal Shalat Kampus Siman UNIDA Gontor*
📅 ${data.dateLocal} ${data.hijri ? `(${data.hijri.formatted})` : ""}

• Subuh: ${data.times.FAJR.timeLabel}
• Terbit: ${data.times.SUNRISE.timeLabel}
• ${data.isFriday ? "Jumat" : "Dzuhur"}: ${data.times.DHUHR.timeLabel}
• Ashar: ${data.times.ASR.timeLabel}
• Maghrib: ${data.times.MAGHRIB.timeLabel}
• Isya: ${data.times.ISHA.timeLabel}

_UNIDA Prayer System V2.0_`;

		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// fallback jika clipboard tidak didukung
		}
	};

	return (
		<div>
			<div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4 glass-panel glass-sheen">
				<h3 className="text-sm font-bold text-[#102A46] sm:text-base dark:text-white">
					Jadwal Shalat Hari Ini
				</h3>

				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={handleCopySchedule}
						className="inline-flex items-center gap-1.5 rounded-xl border border-white/80 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all hover:bg-white/90 hover:text-[#123B6D] active:scale-95 dark:border-white/15 dark:bg-white/10 dark:text-slate-200 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] dark:hover:bg-white/20"
						title="Salin ringkasan jadwal untuk dibagikan ke WhatsApp"
					>
						{copied ? (
							<>
								<Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
								<span className="text-emerald-700 dark:text-emerald-400">Tersalin!</span>
							</>
						) : (
							<>
								<Copy className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
								<span>Salin Jadwal</span>
							</>
						)}
					</button>

					<button
						type="button"
						onClick={onRefresh}
						disabled={refreshing}
						className="inline-flex items-center gap-1.5 rounded-xl border border-blue-400/30 bg-blue-500/15 px-3 py-1.5 text-xs font-semibold text-[#1D5FA7] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_2px_8px_rgba(29,95,167,0.1)] backdrop-blur-md transition-all hover:bg-blue-500/25 active:scale-95 disabled:opacity-50 dark:border-sky-400/30 dark:bg-sky-500/20 dark:text-[#6BA9D8] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] dark:hover:bg-sky-500/30"
					>
						<RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
						<span>Perbarui</span>
					</button>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
				<PrayerCard
					name="Subuh"
					time={data.times.FAJR.timeLabel}
					icon={<Sunrise className="h-5 w-5" />}
					status={getSlotStatus(data.times.FAJR.utc, "FAJR")}
				/>

				<PrayerCard
					name="Terbit"
					time={data.times.SUNRISE.timeLabel}
					icon={<SunMedium className="h-5 w-5" />}
					status={getSlotStatus(data.times.SUNRISE.utc, "SUNRISE")}
					isAstronomicalNote
				/>

				<PrayerCard
					name={data.times.DHUHR.displayName}
					time={data.times.DHUHR.timeLabel}
					icon={<Sun className="h-5 w-5" />}
					status={getSlotStatus(data.times.DHUHR.utc, "DHUHR")}
					badge={data.isFriday ? "Jumat Berkah" : undefined}
				/>

				<PrayerCard
					name="Ashar"
					time={data.times.ASR.timeLabel}
					icon={<CloudSun className="h-5 w-5" />}
					status={getSlotStatus(data.times.ASR.utc, "ASR")}
				/>

				<PrayerCard
					name="Maghrib"
					time={data.times.MAGHRIB.timeLabel}
					icon={<Sunset className="h-5 w-5" />}
					status={getSlotStatus(data.times.MAGHRIB.utc, "MAGHRIB")}
				/>

				<PrayerCard
					name="Isya"
					time={data.times.ISHA.timeLabel}
					icon={<Moon className="h-5 w-5" />}
					status={getSlotStatus(data.times.ISHA.utc, "ISHA")}
				/>
			</div>
		</div>
	);
}
