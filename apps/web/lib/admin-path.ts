/**
 * Konfigurasi rute path admin dan login dari environment variable.
 * Mendukung deteksi dinamis di sisi klien (browser) sehingga bila NEXT_PUBLIC_ADMIN_PATH
 * diubah di .env atau server runtime, seluruh link subpath admin (/whatsapp, /prayer, dll.)
 * otomatis mengikuti URL yang sedang dibuka pengguna.
 */

const KNOWN_ADMIN_SUBPATHS = [
	"/whatsapp",
	"/targets",
	"/prayer",
	"/messages",
	"/hadits",
	"/settings",
	"/login",
] as const;

export function normalizePath(raw: string | undefined): string | null {
	const trimmed = (raw ?? "").trim();
	if (!trimmed || trimmed === "undefined" || trimmed === "null") return null;
	const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
	return withSlash.replace(/\/+$/, "") || null;
}

export const ADMIN_BASE_PATH =
	normalizePath(process.env.NEXT_PUBLIC_ADMIN_PATH || process.env.ADMIN_PATH) || "/admin";

const customLogin = normalizePath(
	process.env.NEXT_PUBLIC_LOGIN_PATH || process.env.LOGIN_PATH,
);

export const LOGIN_ROUTE =
	customLogin && customLogin !== "/login"
		? customLogin
		: ADMIN_BASE_PATH !== "/admin"
			? `${ADMIN_BASE_PATH}/login`
			: "/login";

/**
 * Menyelesaikan base path admin aktif secara runtime.
 * Prioritas:
 * 1. currentPathname eksplisit (misal dari hook usePathname() di Next.js)
 * 2. URL browser (window.location.pathname) saat dijalankan di client
 * 3. Fallback ke ADMIN_BASE_PATH (dari env atau default /admin)
 */
export function resolveAdminBase(currentPathname?: string): string {
	const envBase =
		normalizePath(process.env.NEXT_PUBLIC_ADMIN_PATH || process.env.ADMIN_PATH) ||
		"/admin";

	const path =
		currentPathname ??
		(typeof window !== "undefined" ? window.location.pathname : "");

	const cleanPath = path
		? (path.startsWith("/") ? path : `/${path}`).replace(/\/+$/, "")
		: "";

	if (!cleanPath || cleanPath === "/") {
		return envBase;
	}

	// Deteksi bila URL adalah salah satu subpath login (mis. /pengurus-siman/login -> /pengurus-siman)
	if (cleanPath === "/login") {
		return envBase;
	}

	for (const sub of KNOWN_ADMIN_SUBPATHS) {
		if (cleanPath.endsWith(sub)) {
			const prefix = cleanPath.slice(0, -sub.length);
			if (prefix) return prefix;
		}
	}

	// Jika pathname cocok dengan envBase
	if (envBase !== "/admin" && cleanPath.startsWith(envBase)) {
		return envBase;
	}

	// Jika pathname berada di bawah /admin standar
	if (cleanPath === "/admin" || cleanPath.startsWith("/admin/")) {
		return "/admin";
	}

	// Jika pengguna berada langsung di root path kustom (mis. /pengurus-siman)
	if (cleanPath && !cleanPath.startsWith("/api") && !cleanPath.startsWith("/_next")) {
		return cleanPath;
	}

	return envBase;
}

/**
 * Mendapatkan rute login aktif sesuai konteks path admin yang sedang dibuka.
 */
export function getLoginRoute(currentPathname?: string): string {
	if (customLogin && customLogin !== "/login") {
		return customLogin;
	}
	const adminBase = resolveAdminBase(currentPathname);
	return adminBase !== "/admin" ? `${adminBase}/login` : "/login";
}

/**
 * Menghasilkan URL subpath admin lengkap dengan prefix admin yang sesuai.
 * Contoh: adminRoute("/prayer", "/pengurus-siman/whatsapp") -> "/pengurus-siman/prayer"
 */
export function adminRoute(path = "", currentPathname?: string): string {
	const base = resolveAdminBase(currentPathname);
	if (!path || path === "/" || path === "") {
		return base;
	}
	const clean = path.startsWith("/") ? path : `/${path}`;
	return `${base}${clean}`;
}
