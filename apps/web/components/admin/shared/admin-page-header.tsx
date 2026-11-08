import type { ReactNode } from "react";

interface AdminPageHeaderProps {
	title: string;
	description: ReactNode;
	children?: ReactNode;
}

export function AdminPageHeader({
	title,
	description,
	children,
}: AdminPageHeaderProps) {
	return (
		<div className="flex flex-col gap-3 rounded-2xl p-4 sm:p-5 glass-panel glass-sheen sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h1 className="text-xl font-bold text-[#102A46] sm:text-2xl dark:text-white">
					{title}
				</h1>
				<p className="text-xs font-medium text-slate-600 dark:text-slate-300">
					{description}
				</p>
			</div>
			{children && (
				<div className="flex items-center gap-2 shrink-0">
					{children}
				</div>
			)}
		</div>
	);
}
