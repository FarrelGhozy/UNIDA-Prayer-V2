"use client";

import { Clock } from "lucide-react";
import { UnidaPrayerLogo } from "../shared/unida-prayer-logo";

interface HeaderProps {
	liveTimeString: string;
	theme?: "light" | "dark";
}

export function Header({ liveTimeString, theme = "light" }: HeaderProps) {
	return (
		<header className="sticky top-0 z-40 border-b border-white/60 bg-white/65 shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl transition-colors duration-500 dark:border-white/10 dark:bg-[#071426]/65 dark:shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
				<UnidaPrayerLogo href="/" size="sm" showBadge theme={theme} />

				<div className="flex items-center gap-2 sm:gap-4">
					<div className="flex items-center gap-1.5 rounded-full border border-blue-200/60 bg-linear-to-r from-blue-500/10 to-sky-500/10 px-3.5 py-1.5 text-xs font-semibold text-[#123B6D] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] backdrop-blur-md dark:border-white/15 dark:bg-white/10 dark:text-white dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
						<Clock className="h-3.5 w-3.5 text-[#1D5FA7] dark:text-[#6BA9D8]" />
						<span className="tabular-nums font-mono text-sm font-bold tracking-wide">
							{liveTimeString}
						</span>
						<span className="text-[10px] font-medium text-[#64748B] dark:text-slate-400">WIB</span>
					</div>
				</div>
			</div>
		</header>
	);
}
