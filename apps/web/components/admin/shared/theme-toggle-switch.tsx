"use client";

import { Moon, Sun } from "lucide-react";

interface ThemeToggleSwitchProps {
	theme: "dark" | "light";
	onToggle: () => void;
	size?: "sm" | "md";
	className?: string;
	title?: string;
}

export function ThemeToggleSwitch({
	theme,
	onToggle,
	size = "md",
	className = "",
	title,
}: ThemeToggleSwitchProps) {
	const isDark = theme === "dark";

	const dimensions =
		size === "sm"
			? {
					track: "w-[52px] h-[28px] p-[3px]",
					knob: "w-[22px] h-[22px]",
					translate: isDark ? "translate-x-[24px]" : "translate-x-0",
					icon: "h-3 w-3",
				}
			: {
					track: "w-[62px] h-[34px] p-[3px]",
					knob: "w-[26px] h-[26px]",
					translate: isDark ? "translate-x-[28px]" : "translate-x-0",
					icon: "h-3.5 w-3.5",
				};

	return (
		<button
			type="button"
			role="switch"
			aria-checked={isDark}
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
			title={title || (isDark ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap")}
			onClick={(e) => {
				e.stopPropagation();
				onToggle();
			}}
			className={`group relative inline-flex shrink-0 items-center rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 select-none ${dimensions.track} ${
				isDark
					? "border border-white/25 bg-gradient-to-r from-[#0C1A2E]/90 via-[#10233B]/85 to-[#0C1A2E]/90 shadow-[inset_0_2px_5px_rgba(0,0,0,0.7),0_2px_10px_rgba(0,0,0,0.35)] backdrop-blur-md"
					: "border border-slate-300/90 bg-gradient-to-r from-slate-200/90 via-slate-100/95 to-slate-200/90 shadow-[inset_0_2px_4px_rgba(18,59,109,0.12),0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-md"
			} ${className}`}
		>
			{/* Specular sheen over track */}
			<div className="pointer-events-none absolute inset-x-2 top-0.5 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

			{/* Sliding Frosted Glass Thumb */}
			<div
				className={`relative flex items-center justify-center rounded-full transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${dimensions.knob} ${dimensions.translate} ${
					isDark
						? "border border-white/40 bg-gradient-to-b from-white/35 via-white/20 to-white/10 text-sky-200 shadow-[0_2px_8px_rgba(0,0,0,0.45),0_0_12px_rgba(56,189,248,0.3)] backdrop-blur-lg"
						: "border border-white/95 bg-gradient-to-b from-white via-white/90 to-white/75 text-amber-500 shadow-[0_2px_6px_rgba(0,0,0,0.18),0_0_10px_rgba(251,191,36,0.25)] backdrop-blur-lg"
				}`}
			>
				{/* Specular lens reflection on top-left of the knob */}
				<div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-80" />

				{isDark ? (
					<Moon
						className={`${dimensions.icon} fill-sky-200/40 text-sky-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] transition-transform duration-300`}
					/>
				) : (
					<Sun
						className={`${dimensions.icon} text-amber-500 drop-shadow-[0_1px_2px_rgba(251,191,36,0.3)] transition-transform duration-300`}
					/>
				)}
			</div>
		</button>
	);
}
