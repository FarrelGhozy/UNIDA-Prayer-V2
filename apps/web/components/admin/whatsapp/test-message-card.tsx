import { Send } from "lucide-react";

export type TestTargetMode = "GROUP" | "PERSONAL";

export interface MessageTargetOption {
	id: number;
	name: string;
	targetId: string;
	isActive: boolean;
}

interface TestMessageCardProps {
	targets: MessageTargetOption[];
	selectedTargetId: number | null;
	mode: TestTargetMode;
	phone: string;
	customText: string;
	sendingTest: boolean;
	testResult: string | null;
	onSelectTarget: (id: number) => void;
	onModeChange: (mode: TestTargetMode) => void;
	onPhoneChange: (phone: string) => void;
	onChangeText: (text: string) => void;
	onSendTest: (e: React.FormEvent) => void;
}

export function TestMessageCard({
	targets,
	selectedTargetId,
	mode,
	phone,
	customText,
	sendingTest,
	testResult,
	onSelectTarget,
	onModeChange,
	onPhoneChange,
	onChangeText,
	onSendTest,
}: TestMessageCardProps) {
	const canSend =
		!sendingTest && (mode === "GROUP" ? selectedTargetId !== null : phone.trim().length > 0);
	return (
		<div className="rounded-3xl glass-panel glass-sheen p-6 space-y-4">
			<div className="flex items-center gap-2 border-b border-slate-200/60 pb-3 dark:border-white/10">
				<Send className="h-4 w-4 text-[#1D5FA7] dark:text-[#6BA9D8]" />
				<h2 className="text-sm font-bold text-[#102A46] dark:text-white">
					Kirim Pesan Uji Coba (Test Message)
				</h2>
			</div>

			<p className="text-xs text-[#64748B] dark:text-slate-300">
				Uji konektivitas gateway WAHA dengan mengirimkan pesan uji coba ke grup pilihan.
			</p>

			<form onSubmit={onSendTest} className="space-y-4">
				<div>
					<label className="block text-xs font-semibold text-[#102A46] mb-1 dark:text-slate-200">
						Tujuan Pengujian:
					</label>
					<div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100/80 p-1 dark:bg-white/5">
						{(["GROUP", "PERSONAL"] as const).map((m) => (
							<button
								key={m}
								type="button"
								onClick={() => onModeChange(m)}
								className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
									mode === m
										? "bg-white text-[#102A46] shadow-xs ring-1 ring-slate-200 dark:bg-white/15 dark:text-white dark:ring-white/15"
										: "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
								}`}
							>
								{m === "GROUP" ? "Grup Tersimpan" : "Nomor Pribadi"}
							</button>
						))}
					</div>
				</div>

				{mode === "GROUP" ? (
					<div>
						<label className="block text-xs font-semibold text-[#102A46] mb-1 dark:text-slate-200">
							Pilih Target Penerima:
						</label>
						{targets.length > 0 ? (
							<select
								value={selectedTargetId ?? ""}
								onChange={(e) => onSelectTarget(Number(e.target.value))}
								className="w-full rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2 text-xs text-[#172B43] focus:bg-white focus:border-[#1D5FA7] focus:outline-none font-medium dark:border-white/15 dark:bg-black/25 dark:text-white dark:focus:border-sky-400"
							>
								{targets.map((t) => (
									<option key={t.id} value={t.id} className="dark:bg-[#0A1B2E]">
										{t.name} {t.isActive ? "(Aktif)" : "(Nonaktif)"}
									</option>
								))}
							</select>
						) : (
							<div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-400 dark:bg-white/5 dark:text-slate-400">
								Belum ada target tersinkronisasi. Silakan sinkronisasi grup di menu Target.
							</div>
						)}
					</div>
				) : (
					<div>
						<label className="block text-xs font-semibold text-[#102A46] mb-1 dark:text-slate-200">
							Nomor HP Pribadi:
						</label>
						<input
							type="tel"
							value={phone}
							onChange={(e) => onPhoneChange(e.target.value)}
							placeholder="cth: 081234567890"
							className="w-full rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2 text-xs text-[#172B43] focus:bg-white focus:border-[#1D5FA7] focus:outline-none font-medium dark:border-white/15 dark:bg-black/25 dark:text-white dark:focus:border-sky-400"
						/>
						<p className="mt-1 text-[11px] text-slate-400 dark:text-slate-400">
							Uji ke nomor sendiri dulu sebelum ke grup. Tidak disimpan ke daftar target.
						</p>
					</div>
				)}

				<div>
					<label className="block text-xs font-semibold text-[#102A46] mb-1 dark:text-slate-200">
						Pesan Kustom (Opsional):
					</label>
					<textarea
						rows={2}
						value={customText}
						onChange={(e) => onChangeText(e.target.value)}
						placeholder="Biarkan kosong untuk menggunakan teks pengujian standar UNIDA Prayer..."
						className="w-full rounded-xl border border-slate-200/80 bg-white/80 p-3 text-xs text-[#172B43] focus:bg-white focus:border-[#1D5FA7] focus:outline-none dark:border-white/15 dark:bg-black/25 dark:text-white dark:focus:border-sky-400"
					/>
				</div>

				{testResult && (
					<div className="rounded-xl bg-emerald-50/80 border border-emerald-200 p-3 text-xs text-emerald-800 font-medium dark:bg-emerald-950/60 dark:border-emerald-800/60 dark:text-emerald-200">
						{testResult}
					</div>
				)}

				<div className="flex justify-end">
					<button
						type="submit"
						disabled={!canSend}
						className="inline-flex items-center gap-2 rounded-xl bg-[#123B6D] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#1D5FA7] transition disabled:opacity-50 dark:bg-[#1D5FA7] dark:hover:bg-[#2563EB]"
					>
						<Send className="h-4 w-4" />
						<span>{sendingTest ? "Mengirim Pesan..." : "Kirim Pesan Uji Coba"}</span>
					</button>
				</div>
			</form>
		</div>
	);
}
