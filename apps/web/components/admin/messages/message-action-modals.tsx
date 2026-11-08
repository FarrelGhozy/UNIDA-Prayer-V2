import { RotateCw, XCircle } from "lucide-react";

interface RetryModalProps {
	confirmRetryId: number | null;
	actionLoading: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export function MessageRetryModal({
	confirmRetryId,
	actionLoading,
	onClose,
	onConfirm,
}: RetryModalProps) {
	if (!confirmRetryId) return null;

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm dark:bg-black/70">
			<div className="glass-panel w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 dark:border-white/15 dark:bg-[#0D1C2E]">
				<div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
					<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/50">
						<RotateCw className="h-5 w-5" />
					</div>
					<h3 className="text-base font-bold text-[#102A46] dark:text-white">
						Retry Pengiriman Pesan
					</h3>
				</div>
				<p className="text-xs text-[#64748B] dark:text-slate-300 leading-relaxed">
					Apakah Anda yakin ingin menjadwalkan ulang pengiriman pesan ID #{confirmRetryId}? Pesan akan dikembalikan ke status PENDING dan segera diproses worker.
				</p>
				<div className="flex items-center justify-end gap-2 pt-2">
					<button
						type="button"
						onClick={onClose}
						className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition dark:border-white/15 dark:text-slate-300 dark:hover:bg-white/5"
					>
						Batal
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={actionLoading}
						className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition dark:bg-emerald-500 dark:hover:bg-emerald-600"
					>
						{actionLoading ? "Memproses..." : "Ya, Kirim Ulang"}
					</button>
				</div>
			</div>
		</div>
	);
}

interface CancelModalProps {
	confirmCancelId: number | null;
	actionLoading: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export function MessageCancelModal({
	confirmCancelId,
	actionLoading,
	onClose,
	onConfirm,
}: CancelModalProps) {
	if (!confirmCancelId) return null;

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm dark:bg-black/70">
			<div className="glass-panel w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 dark:border-white/15 dark:bg-[#0D1C2E]">
				<div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
					<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/50">
						<XCircle className="h-5 w-5" />
					</div>
					<h3 className="text-base font-bold text-[#102A46] dark:text-white">
						Batalkan Pesan Antrean
					</h3>
				</div>
				<p className="text-xs text-[#64748B] dark:text-slate-300 leading-relaxed">
					Apakah Anda yakin ingin membatalkan pengiriman pesan ID #{confirmCancelId}? Pesan ini tidak akan dikirimkan ke WhatsApp.
				</p>
				<div className="flex items-center justify-end gap-2 pt-2">
					<button
						type="button"
						onClick={onClose}
						className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition dark:border-white/15 dark:text-slate-300 dark:hover:bg-white/5"
					>
						Kembali
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={actionLoading}
						className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50 transition dark:bg-rose-500 dark:hover:bg-rose-600"
					>
						{actionLoading ? "Membatalkan..." : "Ya, Batalkan Pesan"}
					</button>
				</div>
			</div>
		</div>
	);
}
