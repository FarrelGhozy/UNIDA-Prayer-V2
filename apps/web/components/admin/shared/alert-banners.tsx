import { AlertCircle, CheckCircle2 } from "lucide-react";

interface AlertBannerProps {
	message: string | null;
	onClose: () => void;
}

export function ErrorBanner({ message, onClose }: AlertBannerProps) {
	if (!message) return null;

	return (
		<div className="flex items-center gap-3 rounded-2xl bg-rose-50/90 border border-rose-200 p-4 text-xs text-rose-800 shadow-2xs backdrop-blur-md dark:bg-rose-950/70 dark:border-rose-800/60 dark:text-rose-200">
			<AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
			<span className="flex-1 font-medium">{message}</span>
			<button
				type="button"
				onClick={onClose}
				className="text-xs font-semibold text-rose-600 hover:text-rose-900 transition underline underline-offset-2 dark:text-rose-400 dark:hover:text-rose-200"
			>
				Tutup
			</button>
		</div>
	);
}

export function SuccessBanner({ message, onClose }: AlertBannerProps) {
	if (!message) return null;

	return (
		<div className="flex items-center gap-3 rounded-2xl bg-emerald-50/90 border border-emerald-200 p-4 text-xs text-emerald-800 shadow-2xs backdrop-blur-md dark:bg-emerald-950/70 dark:border-emerald-800/60 dark:text-emerald-200">
			<CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
			<span className="flex-1 font-medium">{message}</span>
			<button
				type="button"
				onClick={onClose}
				className="text-xs font-semibold text-emerald-600 hover:text-emerald-900 transition underline underline-offset-2 dark:text-emerald-400 dark:hover:text-emerald-200"
			>
				Tutup
			</button>
		</div>
	);
}
