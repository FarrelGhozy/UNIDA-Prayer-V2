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

	const cardClasses = isNext
		? "glass-panel-active glass-sheen -translate-y-1"
		: isPassed
			? "glass-panel-passed opacity-75 hover:opacity-90"
			: "glass-panel glass-sheen hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(18,59,109,0.12),inset_0_1px_1px_rgba(255,255,255,1)] dark:hover:shadow-[0_15px_35px_rgba(29,95,167,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)]";

	return (
		<div
			className={`relative flex flex-col justify-between rounded-2xl p-4 transition-all duration-300 ${cardClasses}`}
		>
			{isNext && (
				<span className="absolute -top-2.5 right-3 inline-flex items-center gap-1 rounded-full bg-linear-to-r from-[#1D5FA7] to-[#123B6D] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-[0_2px_10px_rgba(29,95,167,0.4)] dark:from-[#1D5FA7] dark:to-[#6BA9D8]">
					<span className="relative flex h-1.5 w-1.5">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
						<span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
					</span>
					Berikutnya
				</span>
			)}

			<div>
				<div className="flex items-center justify-between">
					<div
						className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
							isNext
								? "bg-linear-to-br from-[#123B6D] to-[#1D5FA7] text-[#6BA9D8] shadow-sm dark:from-[#0A1B2E] dark:to-[#123B6D] dark:text-[#6BA9D8]"
								: isPassed
									? "bg-slate-200/50 text-slate-500 dark:bg-white/5 dark:text-slate-500"
									: "border border-blue-400/20 bg-blue-500/10 text-[#1D5FA7] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] dark:border-sky-400/20 dark:bg-sky-500/15 dark:text-[#6BA9D8] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
						}`}
					>
						{icon}
					</div>

					{badge && (
						<span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-700 backdrop-blur-xs dark:text-emerald-400">
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
						<span className="text-[10px] text-slate-500 dark:text-slate-400">Batas Terbit</span>
					)}
				</div>
			</div>

			<div className="mt-4 pt-2 border-t border-slate-200/40 dark:border-white/10">
				<span
					className={`font-mono text-base font-extrabold tracking-tight tabular-nums ${
						isNext
							? "text-[#123B6D] dark:text-white"
							: isPassed
								? "text-slate-500 dark:text-slate-500"
								: "text-[#102A46] dark:text-white"
					}`}
				>
					{time.replace(" WIB", "")}
				</span>
				<span className="ml-1 text-[10px] font-semibold text-[#64748B] dark:text-slate-400">WIB</span>
			</div>
		</div>
	);
}
