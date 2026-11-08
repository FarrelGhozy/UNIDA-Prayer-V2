import { AlertTriangle } from "lucide-react";

interface SessionActionModalProps {
	confirmAction: "STOP" | "RESTART" | "LOGOUT" | null;
	actionLoading: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export function SessionActionModal({
	confirmAction,
	actionLoading,
	onClose,
	onConfirm,
}: SessionActionModalProps) {
	if (!confirmAction) return null;

	const title =
		confirmAction === "STOP"
			? "Hentikan Sesi WhatsApp?"
			: confirmAction === "RESTART"
				? "Restart Sesi WhatsApp?"
				: "Logout & Hapus Pairing WhatsApp?";

	const message =
		confirmAction === "STOP"
			? "Menghentikan sesi akan memutus koneksi gateway ke WhatsApp. Bot tidak dapat mengirim pesan pengingat shalat hingga sesi dimulai kembali."
			: confirmAction === "RESTART"
				? "Merestart sesi akan memuat ulang koneksi ke server WAHA. Proses ini memerlukan beberapa detik."
				: "PERINGATAN: Tindakan ini akan menghapus sesi login dan pairing perangkat pada WAHA. Anda harus melakukan pemindaian QR code ulang untuk menghubungkan kembali bot WhatsApp.";

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
			<div className="w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-200/80 bg-white/95 backdrop-blur-2xl dark:border-white/15 dark:bg-[#0A1B2E]/95">
				<div className="flex items-center gap-3 text-rose-600">
					<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400">
						<AlertTriangle className="h-5 w-5" />
					</div>
					<h3 className="text-base font-bold text-[#102A46] dark:text-white">{title}</h3>
				</div>

				<p className="text-xs text-[#64748B] dark:text-slate-300 leading-relaxed">{message}</p>

				<div className="flex items-center justify-end gap-2 pt-2">
					<button
						type="button"
						onClick={onClose}
						className="rounded-xl border border-slate-200/80 px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition dark:border-white/15 dark:text-slate-300 dark:hover:bg-white/10"
					>
						Batal
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={actionLoading}
						className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50 transition dark:bg-rose-600 dark:hover:bg-rose-700"
					>
						{actionLoading ? "Memproses..." : "Ya, Lanjutkan"}
					</button>
				</div>
			</div>
		</div>
	);
}
