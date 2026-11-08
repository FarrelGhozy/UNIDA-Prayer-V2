import {
	ArrowRight,
	BookOpen,
	Calendar,
	MessageSquare,
	Radio,
	Settings,
	Users,
} from "lucide-react";
import Link from "next/link";
import { adminRoute } from "../../../lib/admin-path";

export function QuickLinksGrid() {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<Link
				href={adminRoute("/whatsapp")}
				className="group rounded-3xl glass-panel glass-sheen p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#1D5FA7]/60 dark:hover:border-sky-400/50"
			>
				<div className="flex items-center justify-between">
					<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-[#1D5FA7] group-hover:bg-[#123B6D] group-hover:text-white transition dark:bg-blue-950/60 dark:text-sky-300 dark:group-hover:bg-[#1D5FA7]">
						<Radio className="h-5 w-5" />
					</div>
					<ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#1D5FA7] transition dark:group-hover:text-sky-300" />
				</div>
				<h3 className="mt-3 text-sm font-bold text-[#102A46] dark:text-white">Koneksi WhatsApp</h3>
				<p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">
					Pantau status sesi WAHA, scan QR code pairing, dan kirim pesan uji coba.
				</p>
			</Link>

			<Link
				href={adminRoute("/targets")}
				className="group rounded-3xl glass-panel glass-sheen p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/60 dark:hover:border-emerald-400/50"
			>
				<div className="flex items-center justify-between">
					<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition dark:bg-emerald-950/60 dark:text-emerald-400 dark:group-hover:bg-emerald-600">
						<Users className="h-5 w-5" />
					</div>
					<ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 transition dark:group-hover:text-emerald-300" />
				</div>
				<h3 className="mt-3 text-sm font-bold text-[#102A46] dark:text-white">Target & Grup</h3>
				<p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">
					Sinkronisasi grup dari WhatsApp dan aktifkan grup penerima jadwal shalat.
				</p>
			</Link>

			<Link
				href={adminRoute("/prayer")}
				className="group rounded-3xl glass-panel glass-sheen p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/60 dark:hover:border-indigo-400/50"
			>
				<div className="flex items-center justify-between">
					<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition dark:bg-indigo-950/60 dark:text-indigo-300 dark:group-hover:bg-indigo-600">
						<Calendar className="h-5 w-5" />
					</div>
					<ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition dark:group-hover:text-indigo-300" />
				</div>
				<h3 className="mt-3 text-sm font-bold text-[#102A46] dark:text-white">Jadwal & Hisab</h3>
				<p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">
					Sesuaikan koordinat kampus, sudut hisab Kemenag, koreksi menit, dan hitung ulang jadwal.
				</p>
			</Link>

			<Link
				href={adminRoute("/messages")}
				className="group rounded-3xl glass-panel glass-sheen p-5 transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/60 dark:hover:border-sky-400/50"
			>
				<div className="flex items-center justify-between">
					<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 group-hover:bg-sky-600 group-hover:text-white transition dark:bg-sky-950/60 dark:text-sky-300 dark:group-hover:bg-sky-600">
						<MessageSquare className="h-5 w-5" />
					</div>
					<ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-sky-600 transition dark:group-hover:text-sky-300" />
				</div>
				<h3 className="mt-3 text-sm font-bold text-[#102A46] dark:text-white">Riwayat Pesan</h3>
				<p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">
					Lihat daftar pesan yang telah terkirim, tinjau snapshot teks, dan lakukan retry manual.
				</p>
			</Link>

			<Link
				href={adminRoute("/hadits")}
				className="group rounded-3xl glass-panel glass-sheen p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/60 dark:hover:border-amber-400/50"
			>
				<div className="flex items-center justify-between">
					<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition dark:bg-amber-950/60 dark:text-amber-300 dark:group-hover:bg-amber-600">
						<BookOpen className="h-5 w-5" />
					</div>
					<ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 transition dark:group-hover:text-amber-300" />
				</div>
				<h3 className="mt-3 text-sm font-bold text-[#102A46] dark:text-white">Konten Hadits</h3>
				<p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">
					Kelola hadits dan ayat shalat terverifikasi yang dirotasikan pada pesan adzan harian.
				</p>
			</Link>

			<Link
				href={adminRoute("/settings")}
				className="group rounded-3xl glass-panel glass-sheen p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#1D5FA7]/60 dark:hover:border-sky-400/50"
			>
				<div className="flex items-center justify-between">
					<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 group-hover:bg-[#123B6D] group-hover:text-white transition dark:bg-white/10 dark:text-slate-300 dark:group-hover:bg-[#1D5FA7]">
						<Settings className="h-5 w-5" />
					</div>
					<ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#123B6D] transition dark:group-hover:text-sky-300" />
				</div>
				<h3 className="mt-3 text-sm font-bold text-[#102A46] dark:text-white">Pengaturan Sistem</h3>
				<p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">
					Kontrol kill-switch darurat, durasi pre-reminder, batas late grace, dan status server.
				</p>
			</Link>
		</div>
	);
}
