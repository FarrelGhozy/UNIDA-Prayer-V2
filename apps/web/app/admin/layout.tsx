"use client";

import {
	ArrowLeft,
	BookOpen,
	Calendar,
	LayoutDashboard,
	LogOut,
	Menu,
	MessageSquare,
	Radio,
	Settings,
	User,
	Users,
	X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { ThemeToggleSwitch } from "../../components/admin/shared/theme-toggle-switch";
import { DynamicPrayerBackground } from "../../components/landing/dynamic-prayer-background";
import { UnidaPrayerLogo } from "../../components/shared/unida-prayer-logo";
import { fetchApi } from "../../lib/api-client";
import { adminRoute, LOGIN_ROUTE } from "../../lib/admin-path";

interface AdminProfile {
	id: number;
	name: string;
	email: string;
}

interface AdminLayoutProps {
	children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
	const pathname = usePathname();
	const router = useRouter();
	const [admin, setAdmin] = useState<AdminProfile | null>(null);
	const [authChecked, setAuthChecked] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

	useEffect(() => {
		setMobileMenuOpen(false);
	}, [pathname]);

	useEffect(() => {
		let cancelled = false;
		async function checkAuth() {
			const res = await fetchApi<AdminProfile>("/api/auth/me");
			if (cancelled) return;
			if (res.data) {
				setAdmin(res.data);
			} else {
				router.push(LOGIN_ROUTE);
				return;
			}
			setAuthChecked(true);
		}
		checkAuth();
		return () => {
			cancelled = true;
		};
	}, [router]);

	const handleLogout = async () => {
		await fetchApi("/api/auth/logout", { method: "POST" });
		router.push(LOGIN_ROUTE);
	};

	const navItems = [
		{
			label: "Dashboard Utama",
			href: adminRoute("/"),
			icon: <LayoutDashboard className="h-4 w-4" />,
		},
		{
			label: "WhatsApp Sesi",
			href: adminRoute("/whatsapp"),
			icon: <Radio className="h-4 w-4" />,
		},
		{
			label: "Grup & Target",
			href: adminRoute("/targets"),
			icon: <Users className="h-4 w-4" />,
		},
		{
			label: "Jadwal & Hisab",
			href: adminRoute("/prayer"),
			icon: <Calendar className="h-4 w-4" />,
		},
		{
			label: "Riwayat Kirim",
			href: adminRoute("/messages"),
			icon: <MessageSquare className="h-4 w-4" />,
		},
		{
			label: "Konten Hadits",
			href: adminRoute("/hadits"),
			icon: <BookOpen className="h-4 w-4" />,
		},
		{
			label: "Pengaturan Sistem",
			href: adminRoute("/settings"),
			icon: <Settings className="h-4 w-4" />,
		},
	];

	if (!authChecked) {
		return (
			<div className={`relative flex min-h-screen items-center justify-center bg-transparent ${theme === "dark" ? "dark text-white" : "text-[#172B43]"}`}>
				<DynamicPrayerBackground theme={theme} />
				<div className="rounded-2xl glass-panel p-5 shadow-sm">
					<p className="text-sm font-medium text-[#102A46] dark:text-white">Memeriksa sesi login…</p>
				</div>
			</div>
		);
	}

	return (
		<div className={`relative flex min-h-screen flex-col transition-colors duration-500 bg-transparent lg:flex-row ${theme === "dark" ? "dark text-white" : "text-[#172B43]"}`}>
			<DynamicPrayerBackground
				theme={theme}
				overlayClassName={
					theme === "dark"
						? "bg-linear-to-b from-[#030914]/85 via-[#07172E]/70 to-[#081B34]/90 backdrop-blur-[4px]"
						: "bg-linear-to-b from-[#06192E]/50 via-[#0D2644]/25 to-[#E8F0F8]/85 backdrop-blur-[3px]"
				}
			/>

			<div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
				<div
					className={`absolute -top-32 -right-32 h-[560px] w-[560px] rounded-full blur-[120px] transition-all duration-1000 ${
						theme === "dark"
							? "bg-blue-600/20 opacity-70"
							: "bg-sky-400/20 opacity-75"
					}`}
				/>
				<div
					className={`absolute top-1/2 -left-44 h-[600px] w-[600px] -translate-y-1/2 rounded-full blur-[130px] transition-all duration-1000 ${
						theme === "dark"
							? "bg-emerald-500/15 opacity-60"
							: "bg-teal-400/15 opacity-70"
					}`}
				/>
				<div
					className={`absolute -bottom-40 left-1/3 h-[520px] w-[520px] rounded-full blur-[120px] transition-all duration-1000 ${
						theme === "dark"
							? "bg-indigo-600/15 opacity-60"
							: "bg-blue-400/10 opacity-60"
					}`}
				/>
			</div>

			<header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/60 bg-white/70 px-4 py-3 shadow-[0_4px_25px_rgba(0,0,0,0.03)] backdrop-blur-xl transition-colors duration-500 dark:border-white/10 dark:bg-[#071426]/75 dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] lg:hidden">
				<UnidaPrayerLogo href={adminRoute("/")} size="xs" showBadge={false} theme={theme} />

				<div className="flex items-center gap-2">
					<ThemeToggleSwitch theme={theme} onToggle={toggleTheme} size="sm" />

					<button
						type="button"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-700 shadow-2xs backdrop-blur-md transition hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
						aria-label="Toggle navigation menu"
					>
						{mobileMenuOpen ? (
							<X className="h-5 w-5" />
						) : (
							<Menu className="h-5 w-5" />
						)}
					</button>
				</div>
			</header>

			{mobileMenuOpen && (
				<div
					className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden"
					onClick={() => setMobileMenuOpen(false)}
				>
					<div
						className="relative flex h-full w-4/5 max-w-xs flex-col justify-between border-r border-slate-200/80 bg-white/95 p-5 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#071426]/95"
						onClick={(e) => e.stopPropagation()}
					>
						<div>
							<div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/10">
								<UnidaPrayerLogo href={adminRoute("/")} size="xs" showBadge theme={theme} />
								<button
									type="button"
									onClick={() => setMobileMenuOpen(false)}
									className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-white"
								>
									<X className="h-5 w-5" />
								</button>
							</div>

							<nav className="mt-5 space-y-1">
								{navItems.map((item) => {
									const active = pathname === item.href;
									return (
										<Link
											key={item.href}
											href={item.href}
											className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
												active
													? "bg-[#123B6D] text-white shadow-xs dark:bg-[#1D5FA7] dark:shadow-[0_0_15px_rgba(29,95,167,0.4)]"
													: "text-slate-700 hover:bg-slate-100/80 hover:text-[#123B6D] dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
											}`}
										>
											{item.icon}
											<span>{item.label}</span>
										</Link>
									);
								})}
							</nav>
						</div>

						<div className="border-t border-slate-100 pt-4 space-y-3 dark:border-white/10">
							<div
								onClick={toggleTheme}
								className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/80 p-2.5 backdrop-blur-sm transition-all hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
							>
								<div className="flex flex-col">
									<span className="text-xs font-bold text-[#102A46] dark:text-white">
										Mode Tampilan
									</span>
									<span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
										{theme === "dark" ? "Gelap (Aktif)" : "Terang (Aktif)"}
									</span>
								</div>
								<ThemeToggleSwitch theme={theme} onToggle={toggleTheme} size="md" />
							</div>

							{admin && (
								<div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/80 p-2.5 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
									<div className="flex items-center gap-2 overflow-hidden">
										<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#123B6D] text-white dark:bg-[#1D5FA7]">
											<User className="h-3.5 w-3.5" />
										</div>
										<div className="overflow-hidden">
											<p className="truncate text-xs font-bold text-[#102A46] dark:text-white">
												{admin.name}
											</p>
											<p className="truncate text-[10px] font-medium text-slate-500 dark:text-slate-400">
												{admin.email}
											</p>
										</div>
									</div>
									<button
										type="button"
										onClick={handleLogout}
										title="Keluar dari akun"
										className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
									>
										<LogOut className="h-4 w-4" />
									</button>
								</div>
							)}

							<Link
								href="/"
								className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100/80 hover:text-[#123B6D] dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white transition"
							>
								<ArrowLeft className="h-4 w-4" />
								<span>Kembali ke Beranda</span>
							</Link>
						</div>
					</div>
				</div>
			)}

			<aside className="hidden w-64 shrink-0 border-r border-slate-200/80 bg-white/80 backdrop-blur-2xl transition-colors duration-500 dark:border-white/10 dark:bg-[#071426]/80 lg:flex lg:flex-col lg:justify-between lg:p-6 h-screen sticky top-0 shadow-sm dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
				<div>
					<UnidaPrayerLogo href={adminRoute("/")} size="sm" showBadge theme={theme} />

					<nav className="mt-8 space-y-1.5">
						{navItems.map((item) => {
							const active = pathname === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 ${
										active
											? "bg-[#123B6D] text-white shadow-xs dark:bg-[#1D5FA7] dark:shadow-[0_0_15px_rgba(29,95,167,0.4)]"
											: "text-slate-700 hover:bg-slate-100/80 hover:text-[#123B6D] dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
									}`}
								>
									{item.icon}
									<span>{item.label}</span>
								</Link>
							);
						})}
					</nav>
				</div>

				<div className="border-t border-slate-200/60 pt-4 space-y-3 dark:border-white/10">
					<div
						onClick={toggleTheme}
						className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/80 p-2.5 backdrop-blur-sm transition-all hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
					>
						<div className="flex flex-col">
							<span className="text-xs font-bold text-[#102A46] dark:text-white">
								Mode Tampilan
							</span>
							<span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
								{theme === "dark" ? "Gelap (Aktif)" : "Terang (Aktif)"}
							</span>
						</div>
						<ThemeToggleSwitch theme={theme} onToggle={toggleTheme} size="md" />
					</div>

					{admin && (
						<div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/80 p-2.5 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
							<div className="flex items-center gap-2 overflow-hidden">
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#123B6D] text-white shadow-2xs dark:bg-[#1D5FA7]">
									<User className="h-4 w-4" />
								</div>
								<div className="overflow-hidden">
									<p className="truncate text-xs font-bold text-[#102A46] dark:text-white">
										{admin.name}
									</p>
									<p className="truncate text-[10px] font-medium text-slate-500 dark:text-slate-400">
										{admin.email}
									</p>
								</div>
							</div>
							<button
								type="button"
								onClick={handleLogout}
								title="Keluar dari akun"
								className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
							>
								<LogOut className="h-4 w-4" />
							</button>
						</div>
					)}

					<Link
						href="/"
						className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100/80 hover:text-[#123B6D] dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white transition"
					>
						<ArrowLeft className="h-4 w-4" />
						<span>Kembali ke Beranda</span>
					</Link>
				</div>
			</aside>

			<div className="relative z-10 flex flex-1 flex-col">
				<main className="flex-1 p-4 sm:p-6 lg:p-8">
					<div className="mx-auto max-w-5xl">{children}</div>
				</main>
			</div>
		</div>
	);
}
