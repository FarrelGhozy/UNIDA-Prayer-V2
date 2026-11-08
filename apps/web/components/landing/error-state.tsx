import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
	message: string;
	refreshing: boolean;
	onRetry: () => void;
}

export function ErrorState({
	message,
	refreshing,
	onRetry,
}: ErrorStateProps) {
	return (
		<div className="rounded-3xl glass-panel glass-sheen p-6 sm:p-8">
			<div className="flex flex-col items-center text-center">
				<div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/15 text-red-600 shadow-[0_0_20px_rgba(239,68,68,0.2)] dark:text-red-400">
					<AlertCircle className="h-7 w-7" />
				</div>
				<h2 className="mt-4 text-lg font-bold text-[#102A46] sm:text-xl dark:text-white">
					Jadwal Belum Dapat Dimuat
				</h2>
				<p className="mt-2 max-w-md text-sm text-[#64748B] dark:text-slate-300">
					{message}
				</p>
				<div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/15 px-3.5 py-2 text-xs font-medium text-amber-800 backdrop-blur-xs dark:text-amber-300">
					Sesuai standar keandalan UNIDA Prayer, sistem tidak akan menampilkan perkiraan atau jadwal palsu saat backend tidak terjangkau.
				</div>
				<button
					type="button"
					onClick={onRetry}
					disabled={refreshing}
					className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#123B6D] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#1D5FA7] active:scale-95 disabled:opacity-50 dark:bg-[#1D5FA7] dark:hover:bg-[#2563EB]"
				>
					<RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
					{refreshing ? "Menghubungi Server..." : "Coba Muat Ulang"}
				</button>
			</div>
		</div>
	);
}
