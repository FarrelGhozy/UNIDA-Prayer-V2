import {
	BookOpen,
	ChevronLeft,
	ChevronRight,
	Edit2,
	Power,
	RefreshCw,
	Trash2,
} from "lucide-react";

export interface HadithItem {
	id: number;
	seedKey: string | null;
	text: string;
	source: string;
	topic: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

interface HaditsTableProps {
	hadiths: HadithItem[];
	loading: boolean;
	page: number;
	totalPages: number;
	totalCount: number;
	onPageChange: (newPage: number) => void;
	onToggleActive: (h: HadithItem) => void;
	onOpenEdit: (h: HadithItem) => void;
	onRequestDelete: (id: number) => void;
}

export function HaditsTable({
	hadiths,
	loading,
	page,
	totalPages,
	totalCount,
	onPageChange,
	onToggleActive,
	onOpenEdit,
	onRequestDelete,
}: HaditsTableProps) {
	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center p-12 text-[#64748B] space-y-2 dark:text-slate-400">
				<RefreshCw className="h-6 w-6 animate-spin text-[#1D5FA7] dark:text-[#6BA9D8]" />
				<span className="text-xs">Memuat daftar hadits...</span>
			</div>
		);
	}

	if (hadiths.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center p-12 text-center text-[#64748B] space-y-3 dark:text-slate-400">
				<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#1D5FA7] dark:bg-sky-950/50 dark:text-sky-400">
					<BookOpen className="h-6 w-6" />
				</div>
				<h3 className="text-sm font-bold text-[#102A46] dark:text-white">
					Belum Ada Hadits Ditemukan
				</h3>
				<p className="max-w-sm text-xs dark:text-slate-300">
					Tidak ada data hadits yang sesuai dengan filter. Tambahkan hadits baru atau ubah kriteria pencarian.
				</p>
			</div>
		);
	}

	return (
		<div>
			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse text-xs">
					<thead>
						<tr className="border-b border-slate-100 bg-slate-50/90 text-[11px] font-bold text-slate-700 dark:border-white/10 dark:bg-[#122842]/90 dark:text-slate-200">
							<th className="py-3 px-4 w-12 text-center">#</th>
							<th className="py-3 px-4">Teks Terjemahan</th>
							<th className="py-3 px-4 w-52">Sumber Periwayatan</th>
							<th className="py-3 px-4 w-28 text-center">Status</th>
							<th className="py-3 px-4 w-44 text-right">Aksi</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100 text-[#172B43] dark:divide-white/10 dark:text-slate-200">
						{hadiths.map((h, idx) => (
							<tr key={h.id} className="transition hover:bg-slate-50/80 dark:hover:bg-white/5">
								<td className="py-3 px-4 text-center text-slate-400 font-mono text-[11px] dark:text-slate-400">
									{(page - 1) * 15 + idx + 1}
								</td>
								<td className="py-3 px-4">
									<p className="font-medium text-[#102A46] leading-relaxed line-clamp-2 dark:text-slate-100">
										&ldquo;{h.text}&rdquo;
									</p>
									{h.seedKey && (
										<span className="inline-block mt-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-mono text-slate-500 dark:bg-white/10 dark:text-slate-400">
											Seed: {h.seedKey}
										</span>
									)}
								</td>
								<td className="py-3 px-4">
									<span className="inline-flex items-center gap-1 font-semibold text-[#123B6D] bg-blue-50/80 px-2.5 py-1 rounded-lg text-[11px] dark:bg-sky-950/50 dark:text-sky-300">
										{h.source}
									</span>
								</td>
								<td className="py-3 px-4 text-center">
									{h.isActive ? (
										<span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-500/30">
											<span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
											Aktif
										</span>
									) : (
										<span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 dark:bg-white/5 dark:text-slate-400 dark:ring-white/10">
											<span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
											Nonaktif
										</span>
									)}
								</td>
								<td className="py-3 px-4 text-right">
									<div className="inline-flex items-center justify-end gap-1.5">
										<button
											type="button"
											onClick={() => onToggleActive(h)}
											className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold transition shadow-2xs ${
												h.isActive
													? "border border-amber-200/90 bg-amber-50/80 text-amber-800 hover:bg-amber-100/90 dark:border-amber-400/30 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-950/60"
													: "border border-emerald-200/90 bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100/90 dark:border-emerald-400/30 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/60"
											}`}
											title={h.isActive ? "Nonaktifkan hadits ini" : "Aktifkan hadits ini"}
										>
											<Power className="h-3 w-3" />
											<span>{h.isActive ? "Nonaktifkan" : "Aktifkan"}</span>
										</button>
										<button
											type="button"
											onClick={() => onOpenEdit(h)}
											title="Edit Hadits"
											className="rounded-xl border border-slate-200 bg-white p-1.5 text-slate-500 transition hover:bg-blue-50 hover:text-[#1D5FA7] dark:border-white/15 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-[#6BA9D8]"
										>
											<Edit2 className="h-3.5 w-3.5" />
										</button>
										<button
											type="button"
											onClick={() => onRequestDelete(h.id)}
											title="Hapus / Nonaktifkan Hadits"
											className="rounded-xl border border-rose-200 bg-white p-1.5 text-rose-500 transition hover:bg-rose-50 hover:text-rose-700 dark:border-rose-400/30 dark:bg-white/5 dark:text-rose-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-300"
										>
											<Trash2 className="h-3.5 w-3.5" />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{totalPages > 1 && (
				<div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs font-medium text-slate-700 bg-slate-50/50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
					<span>
						Menampilkan halaman <strong className="text-[#102A46] dark:text-white">{page}</strong> dari <strong className="text-[#102A46] dark:text-white">{totalPages}</strong> (Total {totalCount} hadits)
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
