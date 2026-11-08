import { Trash2 } from "lucide-react";

interface HadithDeleteModalProps {
	deleteTargetId: number | null;
	actionLoading: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export function HadithDeleteModal({
	deleteTargetId,
	actionLoading,
	onClose,
	onConfirm,
}: HadithDeleteModalProps) {
	if (!deleteTargetId) return null;

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm dark:bg-black/70">
			<div className="glass-panel w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 dark:border-white/15 dark:bg-[#0D1C2E]">
				<div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
					<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/50">
						<Trash2 className="h-5 w-5" />
					</div>
					<h3 className="text-base font-bold text-[#102A46] dark:text-white">
						Hapus / Nonaktifkan Hadits
					</h3>
				</div>
				<p className="text-xs text-[#64748B] leading-relaxed dark:text-slate-300">
					Apakah Anda yakin ingin menghapus hadits ID #{deleteTargetId}? Bila hadits ini pernah tercatat dalam riwayat pesan, sistem akan secara aman mengubah statusnya menjadi <strong className="text-[#102A46] dark:text-white">nonaktif</strong> demi menjaga integritas data audit.
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
						className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50 transition dark:bg-rose-600 dark:hover:bg-rose-700"
					>
						{actionLoading ? "Memproses..." : "Ya, Hapus Hadits"}
					</button>
				</div>
			</div>
		</div>
	);
}
