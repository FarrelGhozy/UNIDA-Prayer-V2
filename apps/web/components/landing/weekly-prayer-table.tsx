"use client";

import { CalendarDays } from "lucide-react";
import type { WeeklyPrayerDay } from "../../types/prayer";

interface WeeklyPrayerTableProps {
	days?: WeeklyPrayerDay[] | null;
	loading?: boolean;
}

export function WeeklyPrayerTable({ days, loading }: WeeklyPrayerTableProps) {
	if (loading) {
		return (
			<div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-[#0D2137]/90 animate-pulse">
				<div className="h-5 w-48 rounded-md bg-slate-200 dark:bg-slate-700 mb-4" />
				<div className="h-48 w-full rounded-2xl bg-slate-100 dark:bg-slate-800" />
			</div>
		);
	}

	if (!days || days.length === 0) {
		return null;
	}

	return (
		<div className="overflow-hidden rounded-3xl glass-panel glass-sheen">
			<div className="border-b border-slate-200/40 px-5 py-4 dark:border-white/10">
				<div className="flex items-center gap-2.5">
					<div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-[#1D5FA7] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] dark:border-sky-400/20 dark:bg-sky-500/15 dark:text-[#6BA9D8] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
						<CalendarDays className="h-5 w-5" />
					</div>
					<div>
						<h2 className="text-sm font-bold text-[#102A46] sm:text-base dark:text-white">
							Jadwal Shalat Mingguan
						</h2>
						<p className="text-xs text-[#64748B] dark:text-slate-400">
							Rangkuman hisab jadwal shalat 7 hari ke depan mulai besok
						</p>
					</div>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full min-w-[620px] text-left border-collapse text-xs">
					<thead>
						<tr className="border-b border-slate-200/90 bg-slate-100/90 text-[11px] font-extrabold text-[#102A46] backdrop-blur-md dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
							<th className="py-3 px-4">Hari & Tanggal</th>
							<th className="py-3 px-3 text-center">Subuh</th>
							<th className="py-3 px-3 text-center">Terbit</th>
							<th className="py-3 px-3 text-center">Dzuhur</th>
							<th className="py-3 px-3 text-center">Ashar</th>
							<th className="py-3 px-3 text-center">Maghrib</th>
							<th className="py-3 px-3 text-center">Isya</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-200/40 text-[#102A46] dark:divide-white/5 dark:text-slate-200">
						{days.map((day) => {
							return (
								<tr
									key={day.dateLocal}
									className={`transition ${
										day.isTomorrow
											? "bg-blue-500/10 font-semibold border-l-4 border-[#1D5FA7] dark:bg-sky-500/15 dark:border-[#38BDF8]"
											: "hover:bg-white/40 dark:hover:bg-white/5"
									}`}
								>
									<td className="py-3.5 px-4">
										<div className="flex items-center gap-2">
											<div>
												<div className="flex items-center gap-1.5">
													<span className="font-bold text-[#102A46] dark:text-white">
														{day.dayName}, {day.dayFormatted}
													</span>
													{day.isTomorrow && (
														<span className="rounded-md bg-[#1D5FA7] px-1.5 py-0.5 text-[10px] font-bold text-white shadow-2xs">
															Besok
														</span>
													)}
												</div>
												<span className="text-[10px] text-[#64748B] dark:text-slate-400">
													{day.hijri.day} {day.hijri.monthName} {day.hijri.year} H
												</span>
											</div>
										</div>
									</td>
									<td className="py-3.5 px-3 text-center font-mono tabular-nums">
										{day.times.fajr}
									</td>
									<td className="py-3.5 px-3 text-center font-mono tabular-nums text-slate-500 dark:text-slate-400">
										{day.times.sunrise}
									</td>
									<td className="py-3.5 px-3 text-center font-mono tabular-nums">
										<div>{day.times.dhuhr}</div>
										{day.isFriday && (
											<span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
												(Jumat)
											</span>
										)}
									</td>
									<td className="py-3.5 px-3 text-center font-mono tabular-nums">
										{day.times.asr}
									</td>
									<td className="py-3.5 px-3 text-center font-mono tabular-nums font-semibold text-[#123B6D] dark:text-[#6BA9D8]">
										{day.times.maghrib}
									</td>
									<td className="py-3.5 px-3 text-center font-mono tabular-nums">
										{day.times.isha}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
