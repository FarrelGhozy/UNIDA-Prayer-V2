import { Search } from "lucide-react";

interface MessagesFiltersProps {
	searchQuery: string;
	statusFilter: string;
	prayerFilter: string;
	typeFilter: string;
	onSearchChange: (val: string) => void;
	onStatusChange: (val: string) => void;
	onPrayerChange: (val: string) => void;
	onTypeChange: (val: string) => void;
}

export function MessagesFilters({
	searchQuery,
	statusFilter,
	prayerFilter,
	typeFilter,
	onSearchChange,
	onStatusChange,
	onPrayerChange,
	onTypeChange,
}: MessagesFiltersProps) {
	return (
		<div className="glass-panel glass-sheen rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-2xs space-y-3 dark:border-white/10 dark:bg-[#0D1C2E]/80">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<div className="relative flex-1">
					<Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
					<input
						type="text"
						placeholder="Cari nama grup atau isi pesan..."
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-[#172B43] focus:bg-white focus:border-[#1D5FA7] focus:outline-none dark:border-white/15 dark:bg-slate-900/60 dark:text-white dark:placeholder-slate-400 dark:focus:bg-slate-900 dark:focus:border-sky-400"
					/>
				</div>

				<select
					value={prayerFilter}
					onChange={(e) => onPrayerChange(e.target.value)}
					className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-[#102A46] focus:bg-white focus:border-[#1D5FA7] focus:outline-none dark:border-white/15 dark:bg-slate-900/60 dark:text-white dark:focus:bg-slate-900 dark:focus:border-sky-400"
				>
					<option value="ALL">Semua Waktu Shalat</option>
					<option value="FAJR">Subuh</option>
					<option value="DHUHR">Dzuhur / Jumat</option>
					<option value="ASR">Ashar</option>
					<option value="MAGHRIB">Maghrib</option>
					<option value="ISHA">Isya</option>
				</select>

				<select
					value={typeFilter}
					onChange={(e) => onTypeChange(e.target.value)}
					className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-[#102A46] focus:bg-white focus:border-[#1D5FA7] focus:outline-none dark:border-white/15 dark:bg-slate-900/60 dark:text-white dark:focus:bg-slate-900 dark:focus:border-sky-400"
				>
					<option value="ALL">Semua Jenis Pesan</option>
					<option value="ADHAN">Adzan</option>
					<option value="PRE_REMINDER">Pre-Reminder</option>
				</select>
			</div>

			<div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
				{[
					{ label: "Semua Status", value: "ALL" },
					{ label: "Antrean (PENDING)", value: "PENDING" },
					{ label: "Terkirim (SENT)", value: "SENT" },
					{ label: "Gagal (FAILED)", value: "FAILED" },
					{ label: "Ambigu (UNKNOWN)", value: "UNKNOWN" },
					{ label: "Kedaluwarsa", value: "EXPIRED" },
					{ label: "Dibatalkan", value: "CANCELLED" },
				].map((tab) => (
					<button
						key={tab.value}
						type="button"
						onClick={() => onStatusChange(tab.value)}
						className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
							statusFilter === tab.value
								? "bg-[#123B6D] text-white shadow-2xs dark:bg-[#1D5FA7]"
								: "bg-slate-100 text-[#64748B] hover:bg-slate-200/70 hover:text-[#102A46] dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
						}`}
					>
						{tab.label}
					</button>
				))}
			</div>
		</div>
	);
}
