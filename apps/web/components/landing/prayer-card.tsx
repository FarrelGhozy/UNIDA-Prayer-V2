import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import type { SlotStatus } from "../../types/prayer";

interface PrayerCardProps {
	name: string;
	time: string;
	icon: ReactNode;
	status: SlotStatus;
	badge?: string;
	isAstronomicalNote?: boolean;
}

export function PrayerCard({
	name,
	time,
	icon,
	status,
	badge,
	isAstronomicalNote = false,
}: PrayerCardProps) {
	const isNext = status === "NEXT";
	const isPassed = status === "PASSED";

	return (
		<div
			className={`relative flex flex-col justify-between rounded-2xl p-4 transition-all ${
				isNext
					? "bg-white/95 backdrop-blur-md ring-2 ring-[#1D5FA7] shadow-md -translate-y-0.5 dark:bg-[#123B6D]/90 dark:ring-[#6BA9D8]"
					: isPassed
						? "bg-slate-100/95 backdrop-blur-md border border-slate-200/80 shadow-2xs dark:bg-[#081523]/70 dark:border-white/5"
						: "bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-2xs hover:border-slate-300 dark:bg-[#0D2137]/90 dark:border-white/10 dark:hover:border-white/20"
			}`}
		>
			{isNext && (
				<span className="absolute -top-2.5 right-3 rounded-full bg-[#1D5FA7] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs dark:bg-[#1D5FA7]">
					Berikutnya
				</span>
			)}

			<div>
				<div className="flex items-center justify-between">
					<div
						className={`flex h-9 w-9 items-center justify-center rounded-xl ${
							isNext
								? "bg-[#123B6D] text-[#6BA9D8] dark:bg-[#0A1B2E] dark:text-[#6BA9D8]"
								: isPassed
									? "bg-slate-200/80 text-slate-500 dark:bg-white/5 dark:text-slate-500"
									: "bg-blue-50 text-[#1D5FA7] dark:bg-blue-900/40 dark:text-[#6BA9D8]"
						}`}
					>
						{icon}
					</div>

					{badge && (
						<span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
							{badge}
						</span>
					)}

					{isPassed && (
						<span title="Sudah lewat">
							<CheckCircle2 className="h-4 w-4 text-slate-400 dark:text-slate-500" />
						</span>
					)}
				</div>

				<div className="mt-3">
					<h4 className="text-xs font-bold text-[#102A46] dark:text-white">{name}</h4>
					{isAstronomicalNote && (
						<span className="text-[10px] text-slate-400 dark:text-slate-400">Batas Terbit</span>
					)}
				</div>
			</div>

			<div className="mt-4 pt-2 border-t border-slate-100 dark:border-white/10">
				<span
					className={`font-mono text-base font-extrabold tracking-tight tabular-nums ${
						isNext
							? "text-[#123B6D] dark:text-white"
							: isPassed
								? "text-slate-500 dark:text-slate-500"
								: "text-[#172B43] dark:text-white"
					}`}
				>
					{time.replace(" WIB", "")}
				</span>
				<span className="ml-1 text-[10px] font-semibold text-[#64748B] dark:text-slate-400">WIB</span>
			</div>
		</div>
	);
}
