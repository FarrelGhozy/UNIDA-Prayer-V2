"use client";

import type { ReactNode } from "react";

interface ToggleSwitchProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
	disabled?: boolean;
	size?: "sm" | "md";
	id?: string;
	label?: ReactNode;
	description?: ReactNode;
	className?: string;
	variant?: "blue" | "emerald";
}

export function ToggleSwitch({
	checked,
	onChange,
	disabled = false,
	size = "md",
	id,
	label,
	description,
	className = "",
	variant = "blue",
}: ToggleSwitchProps) {
	const dimensions =
		size === "sm"
			? {
					track: "w-[48px] h-[26px] p-[2.5px]",
					knob: "w-[20px] h-[20px]",
					translate: checked ? "translate-x-[22px]" : "translate-x-0",
					indicator: "h-1.5 w-1.5",
				}
			: {
					track: "w-[58px] h-[32px] p-[3px]",
					knob: "w-[25px] h-[25px]",
					translate: checked ? "translate-x-[26px]" : "translate-x-0",
					indicator: "h-2 w-2",
				};

	const activeTrackBg =
		variant === "emerald"
			? "border-emerald-500/60 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.25),0_0_16px_rgba(16,185,129,0.35)]"
			: "border-[#1D5FA7]/70 bg-gradient-to-r from-[#123B6D] via-[#1D5FA7] to-[#2563EB] shadow-[inset_0_2px_4px_rgba(0,0,0,0.25),0_0_16px_rgba(37,99,235,0.35)]";

	const inactiveTrackBg =
		"border-slate-300/80 bg-slate-200/90 shadow-[inset_0_2px_4px_rgba(18,59,109,0.12)] dark:border-white/15 dark:bg-slate-800/80 dark:shadow-[inset_0_2px_5px_rgba(0,0,0,0.6)]";

	const button = (
		<button
			type="button"
			role="switch"
			id={id}
			aria-checked={checked}
			disabled={disabled}
			onClick={(e) => {
				e.stopPropagation();
				if (!disabled) onChange(!checked);
			}}
			className={`group relative inline-flex shrink-0 items-center rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 select-none ${
				dimensions.track
			} ${checked ? activeTrackBg : inactiveTrackBg} ${
				disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
			} backdrop-blur-md ${className}`}
		>
			<div className="pointer-events-none absolute inset-x-2 top-0.5 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

			<div
				className={`relative flex items-center justify-center rounded-full transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
					dimensions.knob
				} ${dimensions.translate} ${
					checked
						? "border border-white/90 bg-gradient-to-b from-white via-white/95 to-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.35),0_0_8px_rgba(255,255,255,0.5)]"
						: "border border-white/70 bg-gradient-to-b from-white via-white/90 to-slate-200 shadow-[0_2px_6px_rgba(0,0,0,0.18)] dark:border-white/30 dark:bg-slate-300"
				}`}
			>
				<div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/60 via-transparent to-transparent opacity-90" />
				<span
					className={`rounded-full transition-colors duration-300 ${dimensions.indicator} ${
						checked
							? variant === "emerald"
								? "bg-emerald-600 shadow-[0_0_6px_rgba(16,185,129,0.8)]"
								: "bg-[#1D5FA7] shadow-[0_0_6px_rgba(29,95,167,0.8)]"
							: "bg-slate-400/60 dark:bg-slate-500/80"
					}`}
				/>
			</div>
		</button>
	);

	if (!label && !description) {
		return button;
	}

	return (
		<div
			className={`flex items-start justify-between gap-4 cursor-pointer select-none ${
				disabled ? "opacity-50 cursor-not-allowed" : ""
			}`}
			onClick={() => {
				if (!disabled) onChange(!checked);
			}}
		>
			<div className="space-y-0.5 pr-2">
				{label && (
					<label
						htmlFor={id}
						className="block font-bold text-xs sm:text-sm text-[#102A46] dark:text-slate-200 cursor-pointer"
					>
						{label}
					</label>
				)}
				{description && (
					<p className="text-slate-600 text-[11px] sm:text-xs font-medium dark:text-slate-400 leading-relaxed">
						{description}
					</p>
				)}
			</div>
			{button}
		</div>
	);
}
