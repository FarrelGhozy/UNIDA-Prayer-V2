import Image from "next/image";
import { Calendar, Clock, MapPin, MoonStar, Timer } from "lucide-react";
import type { HijriDateInfo, NextPrayerInfo } from "../../types/prayer";

interface CountdownValues {
	hours: string;
	minutes: string;
	seconds: string;
}

interface NextPrayerHeroProps {
	nextPrayer: NextPrayerInfo;
	countdown: CountdownValues | null;
	locationName: string;
	gregorianDateFormatted: string;
	hijri?: HijriDateInfo;
}

export function NextPrayerHero({
	nextPrayer,
	countdown,
	locationName,
	gregorianDateFormatted,
	hijri,
}: NextPrayerHeroProps) {
	return (
		<div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#123B6D] via-[#102A46] to-[#0A1B2E] p-6 text-white shadow-xl ring-1 ring-white/10 sm:p-8">
			{/* Ambient Light Orbs */}
			<div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#1D5FA7]/30 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#6BA9D8]/20 blur-3xl" />

			{/* Siluet Logo UNIDA Gontor di Pojok Kanan Bawah */}
			<div className="pointer-events-none absolute -bottom-[40px] -right-5 h-[195px] w-[195px] sm:h-[248px] sm:w-[248px] opacity-15 select-none z-0">
				<Image
					src="/unida-logo.png"
					alt=""
					fill
					sizes="(max-width: 640px) 195px, 248px"
					className="object-contain filter brightness-0 invert"
					priority
				/>
			</div>

			<div className="relative z-10 flex flex-col items-center text-center lg:flex-row lg:items-center lg:justify-between lg:text-left gap-6">
				{/* Sisi Kiri / Konten Teks Shalat, Penanggalan & Lokasi */}
				<div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-5 max-w-2xl w-full order-2 lg:order-1">
					{/* Waktu Shalat Berikutnya */}
					<div className="space-y-2.5 flex flex-col items-center lg:items-start">
						<div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#6BA9D8] backdrop-blur-md ring-1 ring-white/15">
							<span className="relative flex h-2 w-2">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
								<span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
							</span>
							<Timer className="h-3.5 w-3.5" />
							<span>Waktu Shalat Berikutnya</span>
						</div>

						<div>
							<h2 className="font-serif font-['Times_New_Roman',Georgia,Cambria,serif] text-4xl font-extrabold tracking-tight sm:text-6xl text-white drop-shadow-sm">
								{nextPrayer.displayName}
							</h2>
							<p className="mt-1.5 flex items-center justify-center lg:justify-start gap-2 text-sm text-slate-300">
								<Clock className="h-4 w-4 text-[#6BA9D8]" />
								<span>
									Pukul{" "}
									<strong className="text-white text-base font-bold">
										{nextPrayer.timeLabel}
									</strong>
								</span>
								{nextPrayer.isTomorrow && (
									<span className="rounded bg-amber-400/20 px-2 py-0.5 text-xs font-medium text-amber-300 ring-1 ring-amber-400/30">
										Keesokan Hari
									</span>
								)}
							</p>
						</div>
					</div>

					{/* Bagian Bawah: Penanggalan & Lokasi Kampus */}
					<div className="pt-4 border-t border-white/10 w-full flex flex-col items-center text-center lg:items-start lg:text-left space-y-2">
						{/* Penanggalan Masehi & Hijriyah (Di mobile: di atas koordinat) */}
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

						{/* Lokasi Kampus, Koordinat & Zona Waktu (Di mobile: paling bawah) */}
						<div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2 text-xs order-2 lg:order-1">
							<div className="flex items-center gap-1.5 font-bold text-white">
								<MapPin className="h-3.5 w-3.5 text-[#6BA9D8]" />
								<span>{locationName}</span>
							</div>
							<span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[11px] font-medium text-emerald-300 ring-1 ring-emerald-400/30">
								Siman, Ponorogo
							</span>
							<span className="text-[11px] text-slate-300/80">
								• −7.8652° LS, 111.4617° BT • Zona: Asia/Jakarta (WIB)
							</span>
						</div>
					</div>
				</div>

				{/* Kotak Countdown (Di mobile: paling atas dan center di tengah card) */}
				{countdown && (
					<div className="relative overflow-hidden rounded-2xl bg-white/10 p-5 backdrop-blur-md ring-1 ring-white/20 sm:p-6 shadow-inner shrink-0 self-center order-1 lg:order-2 w-full max-w-xs sm:max-w-sm lg:w-auto text-center">
						<span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
							Menuju Kumandang Adzan
						</span>
						<div className="mt-2.5 flex items-baseline justify-center gap-2.5">
							<div className="flex flex-col items-center">
								<span className="tabular-nums font-mono text-3xl font-extrabold text-white sm:text-4xl">
									{countdown.hours}
								</span>
								<span className="text-[10px] uppercase tracking-wider text-slate-300">
									Jam
								</span>
							</div>
							<span className="font-mono text-2xl font-bold text-[#6BA9D8] animate-pulse">:</span>
							<div className="flex flex-col items-center">
								<span className="tabular-nums font-mono text-3xl font-extrabold text-white sm:text-4xl">
									{countdown.minutes}
								</span>
								<span className="text-[10px] uppercase tracking-wider text-slate-300">
									Menit
								</span>
							</div>
							<span className="font-mono text-2xl font-bold text-[#6BA9D8] animate-pulse">:</span>
							<div className="flex flex-col items-center">
								<span className="tabular-nums font-mono text-3xl font-extrabold text-emerald-400 sm:text-4xl">
									{countdown.seconds}
								</span>
								<span className="text-[10px] uppercase tracking-wider text-slate-300">
									Detik
								</span>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
