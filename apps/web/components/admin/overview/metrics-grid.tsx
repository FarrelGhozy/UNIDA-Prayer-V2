import { MessageSquare, Radio, Server, Users } from "lucide-react";
import Link from "next/link";
import { adminRoute } from "../../../lib/admin-path";
import { WahaStatusBadge, WorkerStatusBadge } from "../shared/status-badges";

export interface SystemStatusData {
	api: "ok";
	database: { ok: boolean; latencyMs: number };
	worker: {
		state: "HEALTHY" | "WARNING" | "OFFLINE";
		lastHeartbeatAt: string | null;
		workerId: string | null;
	};
	waha: {
		status: string;
		session: string;
	};
	counts: {
		todaySent: number;
		pending: number;
		failed: number;
		unknown: number;
		totalTargets: number;
		activeTargets: number;
	};
	recent: Array<{
		id: number;
		prayerName: string;
		messageType: string;
		targetName: string;
		status: string;
		scheduledAtUtc: string;
		sentAtUtc: string | null;
		lastError: string | null;
	}>;
	timestampUtc: string;
}

interface MetricsGridProps {
	statusData: SystemStatusData | null;
}

export function MetricsGrid({ statusData }: MetricsGridProps) {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<div className="rounded-3xl glass-panel glass-sheen p-5 transition-all duration-300 hover:-translate-y-0.5">
				<div className="flex items-center justify-between">
					<span className="text-xs font-semibold text-slate-700 dark:text-slate-300">WhatsApp Gateway</span>
					<Radio className="h-4 w-4 text-[#1D5FA7] dark:text-[#6BA9D8]" />
				</div>
				<div className="mt-3 flex items-baseline justify-between">
					<WahaStatusBadge status={statusData?.waha?.status ?? "Memuat..."} />
					<Link
						href={adminRoute("/whatsapp")}
						className="text-[11px] font-semibold text-[#1D5FA7] hover:underline dark:text-[#6BA9D8]"
					>
						Kelola Sesi &rarr;
					</Link>
				</div>
			</div>

			<div className="rounded-3xl glass-panel glass-sheen p-5 transition-all duration-300 hover:-translate-y-0.5">
				<div className="flex items-center justify-between">
					<span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Worker Scheduler</span>
					<Server className="h-4 w-4 text-[#1D5FA7] dark:text-[#6BA9D8]" />
				</div>
				<div className="mt-3 flex items-baseline justify-between">
					<WorkerStatusBadge state={statusData?.worker?.state ?? "OFFLINE"} />
					<span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
						{statusData?.database?.ok ? `DB: ${statusData.database.latencyMs}ms` : "DB Offline"}
					</span>
				</div>
			</div>

			<div className="rounded-3xl glass-panel glass-sheen p-5 transition-all duration-300 hover:-translate-y-0.5">
				<div className="flex items-center justify-between">
					<span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Terkirim Hari Ini</span>
					<MessageSquare className="h-4 w-4 text-[#1D5FA7] dark:text-[#6BA9D8]" />
				</div>
				<div className="mt-3 flex items-baseline gap-2">
					<span className="text-2xl font-extrabold text-[#102A46] dark:text-white">
						{statusData?.counts?.todaySent ?? 0}
					</span>
					<span className="text-xs text-blue-700 font-semibold dark:text-sky-300">
						({statusData?.counts?.pending ?? 0} antrean)
					</span>
				</div>
			</div>

			<div className="rounded-3xl glass-panel glass-sheen p-5 transition-all duration-300 hover:-translate-y-0.5">
				<div className="flex items-center justify-between">
					<span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Grup WhatsApp</span>
					<Users className="h-4 w-4 text-[#1D5FA7] dark:text-[#6BA9D8]" />
				</div>
				<div className="mt-3 flex items-baseline gap-2">
					<span className="text-2xl font-extrabold text-[#102A46] dark:text-white">
						{statusData?.counts?.activeTargets ?? 0}
					</span>
					<span className="text-xs font-medium text-slate-600 dark:text-slate-400">
						aktif dari {statusData?.counts?.totalTargets ?? 0} terdaftar
					</span>
				</div>
			</div>
		</div>
	);
}
