import { Power } from "lucide-react";

interface KillSwitchBannerProps {
	sendingEnabled: boolean;
	saving: boolean;
	onToggle: () => void;
}

export function KillSwitchBanner({
	sendingEnabled,
	saving,
	onToggle,
}: KillSwitchBannerProps) {
	return (
		<div
			className={`glass-panel rounded-3xl border p-6 shadow-xs transition ${
				sendingEnabled
					? "glass-sheen bg-white/95 border-slate-200/80 dark:border-white/10 dark:bg-[#0D1C2E]/80"
					: "bg-rose-50/70 border-rose-300 dark:bg-rose-950/40 dark:border-rose-800/60"
			}`}
		>
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<Power
							className={`h-5 w-5 ${
								sendingEnabled
									? "text-emerald-600 dark:text-emerald-400"
									: "text-rose-600 dark:text-rose-400"
							}`}
						/>
						<h2 className="text-base font-bold text-[#102A46] dark:text-white">
							Kill-Switch Pengiriman Pesan Global
						</h2>
					</div>
					<p className="text-xs text-[#64748B] max-w-xl dark:text-slate-300">
						{sendingEnabled
							? "Pengiriman AKTIF. Pesan pengingat shalat dikirim otomatis ke grup WhatsApp yang dipilih sesuai jadwal hisab."
							: "PENGIRIMAN DITAHAN (KILL-SWITCH AKTIF). Worker tidak akan mengirim pesan apa pun ke WhatsApp hingga sakelar ini diaktifkan kembali."}
					</p>
				</div>

				<button
					type="button"
					onClick={onToggle}
					disabled={saving}
					className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold shadow-xs transition ${
						sendingEnabled
							? "bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-700"
							: "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
					}`}
				>
					<Power className="h-4 w-4" />
					<span>
						{sendingEnabled ? "Matikan Pengiriman (Darurat)" : "Nyalakan Pengiriman"}
					</span>
				</button>
			</div>
		</div>
	);
}
