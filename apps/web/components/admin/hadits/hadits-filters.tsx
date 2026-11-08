import { Search } from "lucide-react";

interface HaditsFiltersProps {
	searchQuery: string;
	activeFilter: "ALL" | "ACTIVE" | "INACTIVE";
	onSearchChange: (val: string) => void;
	onFilterChange: (val: "ALL" | "ACTIVE" | "INACTIVE") => void;
}

export function HaditsFilters({
	searchQuery,
	activeFilter,
	onSearchChange,
	onFilterChange,
}: HaditsFiltersProps) {
	return (
		<div className="glass-panel glass-sheen flex flex-col gap-3 rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-2xs sm:flex-row sm:items-center dark:border-white/10 dark:bg-[#0D1C2E]/80">
			<div className="relative flex-1">
				<Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
				<input
					type="text"
					placeholder="Cari teks hadits atau sumber..."
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
					className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-[#172B43] focus:bg-white focus:border-[#1D5FA7] focus:outline-none dark:border-white/15 dark:bg-slate-900/60 dark:text-white dark:placeholder-slate-400 dark:focus:bg-slate-900 dark:focus:border-sky-400"
				/>
			</div>

			<div className="flex items-center gap-1.5 text-xs">
				{(["ALL", "ACTIVE", "INACTIVE"] as const).map((filter) => (
					<button
						key={filter}
						type="button"
						onClick={() => onFilterChange(filter)}
						className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
							activeFilter === filter
								? "bg-[#123B6D] text-white shadow-2xs dark:bg-[#1D5FA7]"
								: "bg-slate-100 text-[#64748B] hover:bg-slate-200/70 hover:text-[#102A46] dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
						}`}
					>
						{filter === "ALL" ? "Semua" : filter === "ACTIVE" ? "Aktif" : "Nonaktif"}
					</button>
				))}
			</div>
		</div>
	);
}
