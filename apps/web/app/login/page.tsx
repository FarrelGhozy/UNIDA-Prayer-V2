"use client";

import {
	AlertCircle,
	ArrowLeft,
	Lock,
	Mail,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggleSwitch } from "../../components/admin/shared/theme-toggle-switch";
import { DynamicPrayerBackground } from "../../components/landing/dynamic-prayer-background";
import { UnidaPrayerIcon } from "../../components/shared/unida-prayer-logo";
import { fetchApi } from "../../lib/api-client";
import { adminRoute } from "../../lib/admin-path";

export default function LoginPage() {
	const router = useRouter();
	const pathname = usePathname();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [theme, setTheme] = useState<"dark" | "light">("dark");

	useEffect(() => {
		const saved = localStorage.getItem("unida_admin_theme");
		if (saved === "light" || saved === "dark") {
			setTheme(saved);
		} else {
			setTheme("dark");
		}
	}, []);

	const toggleTheme = () => {
		const next = theme === "dark" ? "light" : "dark";
		setTheme(next);
		localStorage.setItem("unida_admin_theme", next);
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const res = await fetchApi<{ id: number; name: string; email: string }>("/api/auth/login", {
			method: "POST",
			body: JSON.stringify({ email, password }),
		});

		if (res.data) {
			router.push(adminRoute("/", pathname));
		} else if (res.error) {
			setError(res.error.message);
		}
		setLoading(false);
	};

	return (
		<div
			className={`relative flex min-h-screen flex-col items-center justify-center transition-colors duration-500 bg-transparent p-4 sm:p-6 ${
				theme === "dark" ? "dark text-white" : "text-[#172B43]"
			}`}
		>
			<DynamicPrayerBackground
				theme={theme}
				overlayClassName={
					theme === "dark"
						? "bg-linear-to-b from-[#030914]/85 via-[#07172E]/70 to-[#081B34]/90 backdrop-blur-[4px]"
						: "bg-linear-to-b from-[#06192E]/65 via-[#0D2644]/45 to-[#E8F0F8]/88 backdrop-blur-[5px]"
				}
			/>

			{/* Efek pencahayaan ambient di latar belakang */}
			<div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
				<div
					className={`absolute -top-32 -right-32 h-[560px] w-[560px] rounded-full blur-[120px] transition-all duration-1000 ${
						theme === "dark"
							? "bg-blue-600/20 opacity-70"
							: "bg-sky-400/20 opacity-75"
					}`}
				/>
				<div
					className={`absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full blur-[120px] transition-all duration-1000 ${
						theme === "dark"
							? "bg-indigo-600/15 opacity-60"
							: "bg-blue-400/10 opacity-60"
					}`}
				/>
			</div>

			<div className="relative z-10 w-full max-w-md space-y-5">
				<div className="flex items-center justify-between">
					<Link
						href="/"
						className="inline-flex items-center gap-2 rounded-xl bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#102A46] shadow-2xs backdrop-blur-md ring-1 ring-slate-200/80 hover:bg-white hover:text-[#123B6D] transition dark:bg-white/10 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/20 dark:hover:text-white"
					>
						<ArrowLeft className="h-4 w-4" />
						<span>Kembali ke Beranda</span>
					</Link>

					<ThemeToggleSwitch theme={theme} onToggle={toggleTheme} size="sm" />
				</div>

				<div className="rounded-3xl glass-panel glass-sheen p-6 sm:p-8 space-y-6 shadow-2xl transition-all duration-300">
					<div className="flex flex-col items-center text-center space-y-2">
						<UnidaPrayerIcon size="lg" className="mb-1" />
						<h1 className="text-xl font-black text-[#102A46] dark:text-white">
							Portal Administrator UNIDA <span className="text-[#1D5FA7] dark:text-[#6BA9D8]">Prayer</span>
						</h1>
						<p className="text-xs text-[#64748B] dark:text-slate-300">
							Universitas Darussalam Gontor • Kampus Siman
						</p>
					</div>

					{error && (
						<div className="flex items-center gap-3 rounded-2xl bg-rose-50/90 border border-rose-200 p-3.5 text-xs text-rose-800 dark:bg-rose-950/60 dark:border-rose-800/60 dark:text-rose-200">
							<AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
							<span className="flex-1 font-medium">{error}</span>
						</div>
					)}

					<form onSubmit={handleLogin} className="space-y-4">
						<div>
							<label
								htmlFor="email-input"
								className="block text-xs font-bold text-[#102A46] dark:text-slate-200 mb-1.5"
							>
								Email Administrator:
							</label>
							<div className="relative">
								<Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
								<input
									id="email-input"
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="admin@unida.gontor.ac.id"
									className="w-full rounded-xl border border-slate-200/80 bg-slate-50/80 py-2.5 pl-9 pr-3 text-xs text-[#172B43] shadow-2xs focus:bg-white focus:border-[#1D5FA7] focus:outline-none transition dark:border-white/15 dark:bg-slate-900/60 dark:text-white dark:focus:bg-slate-900 dark:focus:border-sky-400"
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor="password-input"
								className="block text-xs font-bold text-[#102A46] dark:text-slate-200 mb-1.5"
							>
								Kata Sandi:
							</label>
							<div className="relative">
								<Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
								<input
									id="password-input"
									type="password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="••••••••••••"
									className="w-full rounded-xl border border-slate-200/80 bg-slate-50/80 py-2.5 pl-9 pr-3 text-xs text-[#172B43] shadow-2xs focus:bg-white focus:border-[#1D5FA7] focus:outline-none transition dark:border-white/15 dark:bg-slate-900/60 dark:text-white dark:focus:bg-slate-900 dark:focus:border-sky-400"
								/>
							</div>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full rounded-xl bg-linear-to-r from-[#123B6D] to-[#1D5FA7] py-3 text-xs font-bold text-white shadow-md hover:from-[#1D5FA7] hover:to-[#2A75C6] active:scale-[0.99] transition disabled:opacity-50 dark:from-[#1D5FA7] dark:to-[#123B6D] dark:hover:from-[#2A75C6] dark:hover:to-[#1D5FA7]"
						>
							{loading ? "Memverifikasi..." : "Masuk ke Dashboard"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
