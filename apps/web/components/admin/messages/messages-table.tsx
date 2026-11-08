import {
	ChevronLeft,
	ChevronRight,
	Eye,
	MessageSquare,
	RefreshCw,
	RotateCw,
	XCircle,
} from "lucide-react";
import { MessageStatusBadge } from "../shared/status-badges";

export interface ScheduledMessageItem {
	id: number;
	idempotencyKey: string;
	prayerDate: string;
	prayerName: string;
	messageType: string;
	targetId: number;
	targetName: string;
	targetExternalId: string;
	prayerTimeUtc: string;
	scheduledAtUtc: string;
	messageBody: string;
	contentRef: string | null;
	status: "PENDING" | "PROCESSING" | "SENT" | "FAILED" | "EXPIRED" | "CANCELLED" | "UNKNOWN";
	attemptCount: number;
	nextAttemptAtUtc: string | null;
	claimedAtUtc: string | null;
	sentAtUtc: string | null;
	wahaMessageId: string | null;
	lastError: string | null;
	createdAt: string;
	updatedAt: string;
}

interface MessagesTableProps {
	messages: ScheduledMessageItem[];
	loading: boolean;
	page: number;
	totalPages: number;
	totalCount: number;
	onPageChange: (newPage: number) => void;
	onViewDetail: (msg: ScheduledMessageItem) => void;
	onRequestRetry: (id: number) => void;
	onRequestCancel: (id: number) => void;
}

export function MessagesTable({
	messages,
	loading,
	page,
	totalPages,
	totalCount,
	onPageChange,
	onViewDetail,
	onRequestRetry,
	onRequestCancel,
}: MessagesTableProps) {
	const formatPrayerName = (prayer: string) => {
		switch (prayer) {
			case "FAJR":
				return "Subuh";
			case "DHUHR":
				return "Dzuhur/Jumat";
			case "ASR":
				return "Ashar";
			case "MAGHRIB":
				return "Maghrib";
			case "ISHA":
				return "Isya";
			default:
				return prayer;
		}
	};

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center p-12 text-[#64748B] space-y-2 dark:text-slate-400">
				<RefreshCw className="h-6 w-6 animate-spin text-[#1D5FA7] dark:text-[#6BA9D8]" />
				<span className="text-xs">Memuat antrean pesan...</span>
			</div>
		);
	}

	if (messages.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center p-12 text-center text-[#64748B] space-y-3 dark:text-slate-400">
				<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#1D5FA7] dark:bg-sky-950/50 dark:text-sky-400">
					<MessageSquare className="h-6 w-6" />
				</div>
				<h3 className="text-sm font-bold text-[#102A46] dark:text-white">
					Tidak Ada Pesan Ditemukan
				</h3>
				<p className="max-w-sm text-xs dark:text-slate-300">
					Tidak ada data pesan yang sesuai dengan filter saat ini. Coba ubah kata kunci pencarian atau status filter.
				</p>
			</div>
		);
	}

	return (
		<div>
			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse text-xs">
					<thead>
						<tr className="border-b border-slate-200/90 bg-slate-100/90 text-[11px] font-extrabold text-[#102A46] dark:border-white/10 dark:bg-[#122842]/90 dark:text-slate-200">
							<th className="py-3 px-4">Status</th>
							<th className="py-3 px-4">Waktu & Tipe</th>
							<th className="py-3 px-4">Target Grup</th>
							<th className="py-3 px-4">Jadwal Kirim</th>
							<th className="py-3 px-4">Percobaan</th>
							<th className="py-3 px-4 text-right">Aksi</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-200/60 text-[#172B43] dark:divide-white/10 dark:text-slate-200">
						{messages.map((item) => (
							<tr key={item.id} className="transition hover:bg-slate-50/80 dark:hover:bg-white/5">
								<td className="py-3 px-4">
									<MessageStatusBadge status={item.status} />
								</td>
								<td className="py-3 px-4">
									<div className="font-bold text-[#102A46] dark:text-white">
										{formatPrayerName(item.prayerName)}
									</div>
									<span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
										{item.messageType === "ADHAN" ? "Adzan" : "Pre-Reminder"}
									</span>
								</td>
								<td className="py-3 px-4">
									<div className="font-semibold text-[#102A46] dark:text-white">{item.targetName}</div>
									<span className="text-[10px] text-slate-700 font-mono font-medium dark:text-slate-300">
										{item.targetExternalId}
									</span>
								</td>
								<td className="py-3 px-4">
									<div className="font-medium text-[#102A46] dark:text-slate-200">{item.prayerDate}</div>
									<span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
										{new Date(item.scheduledAtUtc).toLocaleTimeString("id-ID", {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</span>
								</td>
								<td className="py-3 px-4">
									<span className="font-semibold text-[#102A46] dark:text-slate-200">
										{item.attemptCount}x
									</span>
									{item.lastError && (
										<div
											title={item.lastError}
											className="max-w-[140px] truncate text-[10px] text-rose-600 font-medium dark:text-rose-400"
										>
											{item.lastError}
										</div>
									)}
								</td>
								<td className="py-3 px-4 text-right space-x-1">
									<button
										type="button"
										onClick={() => onViewDetail(item)}
										title="Lihat Pesan Lengkap"
										className="rounded-lg p-1.5 text-slate-500 transition hover:bg-blue-50 hover:text-[#1D5FA7] dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-[#6BA9D8]"
									>
										<Eye className="h-4 w-4" />
									</button>

									{(item.status === "FAILED" || item.status === "UNKNOWN") && (
										<button
											type="button"
											onClick={() => onRequestRetry(item.id)}
											title="Coba Kirim Ulang (Retry)"
											className="rounded-lg p-1.5 text-emerald-600 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
										>
											<RotateCw className="h-4 w-4" />
										</button>
									)}

									{item.status === "PENDING" && (
										<button
											type="button"
											onClick={() => onRequestCancel(item.id)}
											title="Batalkan Pesan"
											className="rounded-lg p-1.5 text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
										>
											<XCircle className="h-4 w-4" />
										</button>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{totalPages > 1 && (
				<div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs font-medium text-slate-700 bg-slate-50/50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
					<span>
						Menampilkan halaman <strong className="text-[#102A46] dark:text-white">{page}</strong> dari <strong className="text-[#102A46] dark:text-white">{totalPages}</strong> (Total {totalCount} pesan)
					</span>
					<div className="flex items-center gap-1.5">
						<button
							type="button"
							disabled={page <= 1}
							onClick={() => onPageChange(Math.max(1, page - 1))}
							className="rounded-lg border border-slate-200 p-1.5 text-[#102A46] transition hover:bg-slate-50 disabled:opacity-40 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
						>
							<ChevronLeft className="h-4 w-4" />
						</button>
						<button
							type="button"
							disabled={page >= totalPages}
							onClick={() => onPageChange(Math.min(totalPages, page + 1))}
							className="rounded-lg border border-slate-200 p-1.5 text-[#102A46] transition hover:bg-slate-50 disabled:opacity-40 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
						>
							<ChevronRight className="h-4 w-4" />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
