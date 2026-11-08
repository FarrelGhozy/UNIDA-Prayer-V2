"use client";

import { Calendar, MapPin, MoonStar } from "lucide-react";
import { useState } from "react";
import type { HijriDateInfo } from "../../types/prayer";

interface CalendarBannerProps {
	locationName: string;
	gregorianDateFormatted: string;
	hijri?: HijriDateInfo;
}

export function CalendarBanner({
	locationName,
	gregorianDateFormatted,
	hijri,
}: CalendarBannerProps) {
	const [showTooltip, setShowTooltip] = useState(false);

	return (
		<div className="flex flex-col gap-3 rounded-2xl bg-white/95 backdrop-blur-md p-4 shadow-sm ring-1 ring-slate-200/80 sm:flex-row sm:items-center sm:justify-between sm:p-5 dark:bg-[#0D2137]/90 dark:ring-white/10">
			<div className="flex items-center gap-3">
				<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1D5FA7] dark:bg-blue-900/40 dark:text-[#6BA9D8]">
					<MapPin className="h-5 w-5" />
				</div>
				<div>
					<div className="flex items-center gap-2">
						<span className="text-sm font-bold text-[#102A46] dark:text-white">
							{locationName}
						</span>
						<span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/60 dark:text-emerald-400 dark:ring-emerald-500/30">
							Siman, Ponorogo
						</span>
					</div>
					<p className="text-xs text-[#64748B] dark:text-slate-400">
						Koordinat: −7.8652° LS, 111.4617° BT • Zona: Asia/Jakarta (WIB)
					</p>
				</div>
			</div>

			<div className="relative border-t border-slate-100 pt-3 sm:border-t-0 sm:pt-0 sm:text-right dark:border-white/10">
				<div className="flex items-center gap-2 sm:justify-end">
					<Calendar className="h-4 w-4 text-[#1D5FA7] dark:text-[#6BA9D8]" />
					<span className="text-sm font-semibold text-[#102A46] dark:text-white">
						{gregorianDateFormatted || "Memuat tanggal..."}
					</span>
				</div>
				<div className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-[#1D5FA7] dark:text-[#6BA9D8] sm:justify-end">
					<span>{hijri?.formatted ?? "Memuat kalender Hijriyah..."}</span>
					<button
						type="button"
						onClick={() => setShowTooltip((v) => !v)}
						onMouseEnter={() => setShowTooltip(true)}
						onMouseLeave={() => setShowTooltip(false)}
						aria-label="Informasi kalender Hijriyah Umm al-Qura"
						className="relative inline-flex items-center justify-center rounded-full p-1 text-[#1D5FA7] hover:bg-blue-50 transition dark:text-[#6BA9D8] dark:hover:bg-white/10"
					>
						<MoonStar className="h-3.5 w-3.5" />
					</button>
				</div>

				{showTooltip && (
					<div className="absolute right-0 top-full z-30 mt-1 max-w-xs rounded-xl bg-slate-900/95 px-3 py-2 text-[11px] font-normal text-white shadow-xl backdrop-blur-xs ring-1 ring-white/15">
						Penanggalan Umm al-Qura berbasis hisab kampus. Koreksi hisab:{" "}
						{hijri?.adjustmentDays ? `${hijri.adjustmentDays > 0 ? "+" : ""}${hijri.adjustmentDays} hari` : "0 hari"}.
					</div>
				)}
			</div>
		</div>
	);
}
