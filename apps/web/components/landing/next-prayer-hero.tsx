import Image from "next/image";
import { Calendar, Clock, MapPin, MoonStar, Timer } from "lucide-react";
import type { HijriDateInfo, NextPrayerInfo } from "../../types/prayer";

export interface CountdownValues {
	hours: string;
	minutes: string;
	seconds: string;
}

export interface HeroPrayerDisplay {
	displayName: string;
	timeLabel: string;
	isTomorrow?: boolean;
	mode: "BEFORE_ADHAN" | "IQAMAH_COUNTDOWN" | "IQAMAH_ACTIVE";
	countdownLabel: string;
}

interface NextPrayerHeroProps {
	nextPrayer: NextPrayerInfo;
	heroDisplay?: HeroPrayerDisplay;
	countdown: CountdownValues | null;
	locationName: string;
	gregorianDateFormatted: string;
	hijri?: HijriDateInfo;
}

export function NextPrayerHero({
	nextPrayer,
	heroDisplay,
	countdown,
	locationName,
	gregorianDateFormatted,
	hijri,
}: NextPrayerHeroProps) {
	const mode = heroDisplay?.mode ?? "BEFORE_ADHAN";
	const isIqamahMode = mode === "IQAMAH_COUNTDOWN" || mode === "IQAMAH_ACTIVE";
	const displayName = heroDisplay?.displayName ?? nextPrayer.displayName;
	const timeLabel = heroDisplay?.timeLabel ?? nextPrayer.timeLabel;
	const isTomorrow = heroDisplay?.isTomorrow ?? nextPrayer.isTomorrow;
	const countdownLabel = heroDisplay?.countdownLabel ?? "Menuju Kumandang Adzan";

	return (
		<div className="relative overflow-hidden rounded-3xl border border-white/20 bg-linear-to-br from-[#0F2D54]/90 via-[#0C223E]/85 to-[#071628]/95 p-6 text-white backdrop-blur-2xl shadow-[0_20px_50px_rgba(10,27,46,0.35),inset_0_1px_2px_rgba(255,255,255,0.3)] sm:p-8 transition-all">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/15 via-white/5 to-transparent rounded-t-3xl" />

			<div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-linear-to-br from-[#1D5FA7]/40 to-[#38BDF8]/30 blur-3xl animate-pulse-glow" />
			<div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-linear-to-tr from-[#16835D]/30 to-[#6BA9D8]/25 blur-3xl animate-pulse-glow" />

			<div className="pointer-events-none absolute -bottom-[40px] -right-5 h-[195px] w-[195px] sm:h-[248px] sm:w-[248px] opacity-[0.09] select-none z-0">
				<Image
					src="/unida-logo.png"
					alt=""
					fill
					sizes="(max-width: 640px) 195px, 248px"
					className="object-contain filter brightness-0 invert blur-[1px]"
					priority
				/>
			</div>

			<div className="relative z-10 flex flex-col items-center text-center lg:flex-row lg:items-center lg:justify-between lg:text-left gap-6">
				<div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-5 max-w-2xl w-full order-2 lg:order-1">
					<div className="space-y-2.5 flex flex-col items-center lg:items-start">
						{isIqamahMode ? (
							<div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/25 px-3.5 py-1.5 text-xs font-bold text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-xl">
								<span className="relative flex h-2 w-2">
									<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
									<span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
								</span>
								<Timer className="h-3.5 w-3.5" />
								<span>{mode === "IQAMAH_ACTIVE" ? "Kumandang Iqomah" : "Waktu Shalat Telah Masuk"}</span>
							</div>
						) : (
							<div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-[#6BA9D8] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-xl">
								<span className="relative flex h-2 w-2">
									<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
									<span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
								</span>
								<Timer className="h-3.5 w-3.5" />
								<span>Waktu Shalat Berikutnya</span>
							</div>
						)}

						<div>
							<h2 className="font-serif font-['Times_New_Roman',Georgia,Cambria,serif] text-4xl font-extrabold tracking-tight sm:text-6xl text-white drop-shadow-sm">
								{displayName}
							</h2>
							<p className="mt-1.5 flex items-center justify-center lg:justify-start gap-2 text-sm text-slate-300">
								<Clock className="h-4 w-4 text-[#6BA9D8]" />
								<span>
									Pukul{" "}
									<strong className="text-white text-base font-bold">
										{timeLabel}
									</strong>
								</span>
								{isTomorrow && (
									<span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 text-xs font-medium text-amber-300 ring-1 ring-amber-400/30 backdrop-blur-xs">
										Keesokan Hari
									</span>
								)}
							</p>
						</div>
					</div>

					<div className="pt-4 border-t border-white/15 w-full flex flex-col items-center text-center lg:items-start lg:text-left space-y-2">
						<div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 text-xs order-1 lg:order-2">
							<div className="flex items-center gap-1.5 text-slate-200 font-medium">
								<Calendar className="h-3.5 w-3.5 text-[#6BA9D8]" />
								<span>{gregorianDateFormatted || "Memuat tanggal..."}</span>
							</div>
							<span className="text-slate-400/60">•</span>
							<div className="flex items-center gap-1.5 font-serif font-['Times_New_Roman',Georgia,Cambria,serif] italic text-xs sm:text-sm text-[#6BA9D8] tracking-wide">
								<MoonStar className="h-3.5 w-3.5 text-[#6BA9D8]" />
								<span>{hijri?.formatted ?? "Memuat kalender Hijriyah..."}</span>
							</div>
						</div>

						<div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2 text-xs order-2 lg:order-1">
							<div className="flex items-center gap-1.5 font-bold text-white">
								<MapPin className="h-3.5 w-3.5 text-[#6BA9D8]" />
								<span>{locationName}</span>
							</div>
							<span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300 ring-1 ring-emerald-400/30 backdrop-blur-xs">
								Siman, Ponorogo
							</span>
							<span className="text-[11px] text-slate-300/80">
								• −7.8652° LS, 111.4617° BT • Zona: Asia/Jakarta (WIB)
							</span>
						</div>
					</div>
				</div>

				{countdown && (
					<div className="relative overflow-hidden rounded-2xl border border-white/25 bg-black/25 p-5 sm:p-6 text-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_12px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl shrink-0 self-center order-1 lg:order-2 w-full max-w-xs sm:max-w-sm lg:w-auto">
						<div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/10 to-transparent" />
						<span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
							{countdownLabel}
						</span>

						{mode === "IQAMAH_ACTIVE" ? (
							<div className="mt-3 flex flex-col items-center justify-center py-2.5 px-4 rounded-xl border border-emerald-400/30 bg-emerald-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
								<span className="font-mono text-3xl font-extrabold text-emerald-300 animate-pulse tracking-wide drop-shadow-[0_0_12px_rgba(52,211,153,0.6)]">
									00:00:00
								</span>
								<span className="mt-1 text-xs font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
									Rapatkan & Luruskan Shaf
								</span>
							</div>
						) : (
							<div className="mt-3 flex items-center justify-center gap-2">
								<div className="flex flex-col items-center rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] min-w-[58px] sm:min-w-[68px]">
									<span className="tabular-nums font-mono text-3xl font-extrabold text-white sm:text-4xl">
										{countdown.hours}
									</span>
									<span className="text-[10px] uppercase tracking-wider text-slate-300">
										Jam
									</span>
								</div>
								<span className="font-mono text-2xl font-bold text-[#6BA9D8] animate-pulse drop-shadow-[0_0_8px_rgba(107,169,216,0.6)]">:</span>
								<div className="flex flex-col items-center rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] min-w-[58px] sm:min-w-[68px]">
									<span className="tabular-nums font-mono text-3xl font-extrabold text-white sm:text-4xl">
										{countdown.minutes}
									</span>
									<span className="text-[10px] uppercase tracking-wider text-slate-300">
										Menit
									</span>
								</div>
								<span className="font-mono text-2xl font-bold text-[#6BA9D8] animate-pulse drop-shadow-[0_0_8px_rgba(107,169,216,0.6)]">:</span>
								<div className="flex flex-col items-center rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] min-w-[58px] sm:min-w-[68px]">
									<span className="tabular-nums font-mono text-3xl font-extrabold text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)] sm:text-4xl">
										{countdown.seconds}
									</span>
									<span className="text-[10px] uppercase tracking-wider text-slate-300">
										Detik
									</span>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
