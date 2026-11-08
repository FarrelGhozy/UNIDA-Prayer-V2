import { Activity, Database, Info, Radio, Server } from "lucide-react";
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
}

interface SystemDiagnosticsCardProps {
	systemStatus: SystemStatusData | null;
}

export function SystemDiagnosticsCard({ systemStatus }: SystemDiagnosticsCardProps) {
	return (
		<div className="glass-panel glass-sheen rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-2xs space-y-4 dark:border-white/10 dark:bg-[#0D1C2E]/80">
			<div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
				<Activity className="h-4 w-4 text-[#1D5FA7] dark:text-[#6BA9D8]" />
				<h2 className="text-sm font-bold text-[#102A46] dark:text-white">
					Diagnostik & Kesehatan Sistem
				</h2>
			</div>

			{systemStatus ? (
				<div className="space-y-3 text-xs">
					<div className="rounded-2xl bg-slate-50 p-3 border border-slate-100 space-y-1 dark:bg-white/5 dark:border-white/10">
						<div className="flex items-center justify-between">
							<span className="font-semibold text-slate-700 flex items-center gap-1.5 dark:text-slate-200">
								<Server className="h-3.5 w-3.5 text-[#1D5FA7] dark:text-[#6BA9D8]" />
								Worker Scheduler:
							</span>
							<WorkerStatusBadge state={systemStatus.worker.state} />
						</div>
						<p className="text-[10px] text-slate-600 font-medium dark:text-slate-400">
							ID: <code className="font-semibold text-slate-800 dark:text-sky-300">{systemStatus.worker.workerId || "-"}</code>
						</p>
						<p className="text-[10px] text-slate-600 font-medium dark:text-slate-400">
							Heartbeat:{" "}
							<span className="font-semibold text-slate-800 dark:text-slate-200">
								{systemStatus.worker.lastHeartbeatAt
									? new Date(systemStatus.worker.lastHeartbeatAt).toLocaleTimeString("id-ID")
									: "Belum tercatat"}
							</span>
						</p>
					</div>

					<div className="rounded-2xl bg-slate-50 p-3 border border-slate-100 space-y-1 dark:bg-white/5 dark:border-white/10">
						<div className="flex items-center justify-between">
							<span className="font-semibold text-slate-700 flex items-center gap-1.5 dark:text-slate-200">
								<Database className="h-3.5 w-3.5 text-[#1D5FA7] dark:text-[#6BA9D8]" />
								Database MySQL:
							</span>
							<span
								className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
									systemStatus.database.ok
										? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/30 dark:bg-emerald-950/60 dark:text-emerald-300"
										: "bg-rose-50 text-rose-700 ring-1 ring-rose-600/30 dark:bg-rose-950/60 dark:text-rose-300"
								}`}
							>
								{systemStatus.database.ok ? "Connected" : "Error"}
							</span>
						</div>
						<p className="text-[10px] text-slate-600 font-medium dark:text-slate-400">
							Latensi: <span className="font-semibold text-slate-800 dark:text-slate-200">{systemStatus.database.latencyMs} ms</span>
						</p>
					</div>

					<div className="rounded-2xl bg-slate-50 p-3 border border-slate-100 space-y-1 dark:bg-white/5 dark:border-white/10">
						<div className="flex items-center justify-between">
							<span className="font-semibold text-slate-700 flex items-center gap-1.5 dark:text-slate-200">
								<Radio className="h-3.5 w-3.5 text-[#1D5FA7] dark:text-[#6BA9D8]" />
								WAHA WhatsApp:
							</span>
							<WahaStatusBadge status={systemStatus.waha.status} />
						</div>
						<p className="text-[10px] text-slate-600 font-medium dark:text-slate-400">
							Sesi: <code className="font-semibold text-slate-800 dark:text-sky-300">{systemStatus.waha.session}</code>
						</p>
					</div>
				</div>
			) : (
				<div className="text-xs text-slate-500 font-medium">Memuat status diagnostik...</div>
			)}

			<div className="rounded-xl bg-blue-50/90 border border-blue-200/80 p-3 text-[11px] text-[#123B6D] font-medium flex items-start gap-2 dark:bg-sky-950/40 dark:text-sky-300 dark:border dark:border-sky-800/40">
				<Info className="h-4 w-4 shrink-0 mt-0.5" />
				<span>
					Perubahan pengaturan di halaman ini disimpan ke database MySQL (<code>app_settings</code>) dan bertahan melewati restart server.
				</span>
			</div>
		</div>
	);
}
