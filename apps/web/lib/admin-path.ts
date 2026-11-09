/**
 * Konfigurasi rute path admin dan login dari environment variable / runtime cookies.
 * Mendukung deteksi dinamis di sisi klien (browser) sehingga bila NEXT_PUBLIC_ADMIN_PATH
 * atau NEXT_PUBLIC_LOGIN_PATH diatur pada production container (Docker GHCR image),
 * seluruh link subpath admin (/whatsapp, /prayer, dll.) dan rute login otomatis
 * sinkron 100% tanpa perlu rebuild image.
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
	if (!trimmed || trimmed === "undefined" || trimmed === "null") {
		return null;
	}
	const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
	return withSlash.replace(/\/+$/, "") || null;
}

function getCookie(name: string): string | null {
	if (typeof document === "undefined") return null;
	const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
	return match ? decodeURIComponent(match[1]) : null;
}

export function getRuntimeAdminPath(): string {
	const fromCookie = getCookie("unida_admin_path");
	if (fromCookie) {
		const norm = normalizePath(fromCookie);
		if (norm) return norm;
	}
	return (
		normalizePath(process.env.ADMIN_PATH || process.env.NEXT_PUBLIC_ADMIN_PATH) ||
		"/admin"
	);
}

function getExplicitCustomLogin(): string | null {
	const fromCookie = getCookie("unida_login_path");
	if (fromCookie) {
		const norm = normalizePath(fromCookie);
		if (norm && norm !== "/login") return norm;
	}
	const customLogin = normalizePath(
		process.env.LOGIN_PATH || process.env.NEXT_PUBLIC_LOGIN_PATH,
	);
	if (customLogin && customLogin !== "/login") {
		return customLogin;
	}
	return null;
}

export function getRuntimeLoginPath(currentPathname?: string): string {
	const explicitLogin = getExplicitCustomLogin();
	if (explicitLogin) {
		return explicitLogin;
	}
	const adminBase = resolveAdminBase(currentPathname);
	return adminBase !== "/admin" ? `${adminBase}/login` : "/login";
}

export const ADMIN_BASE_PATH =
	normalizePath(process.env.ADMIN_PATH || process.env.NEXT_PUBLIC_ADMIN_PATH) ||
	"/admin";

const customLoginEnv = normalizePath(
	process.env.LOGIN_PATH || process.env.NEXT_PUBLIC_LOGIN_PATH,
);

export const LOGIN_ROUTE =
	customLoginEnv && customLoginEnv !== "/login"
		? customLoginEnv
		: ADMIN_BASE_PATH !== "/admin"
			? `${ADMIN_BASE_PATH}/login`
			: "/login";

/**
 * Menyelesaikan base path admin aktif secara runtime.
 * Menghindari jebakan salah mengira rute login kustom sebagai admin base.
 */
export function resolveAdminBase(currentPathname?: string): string {
	const envBase = getRuntimeAdminPath();
	const explicitLogin = getExplicitCustomLogin();

	const path =
		currentPathname ??
		(typeof window !== "undefined" ? window.location.pathname : "");
	const cleanPath = normalizePath(path);

	if (!cleanPath) {
		return envBase;
	}

	// Bila URL saat ini adalah rute login aktif (mis. /masuk88 atau /login),
	// base admin-nya adalah envBase, JANGAN kembalikan rute login!
	if (cleanPath === "/login" || (explicitLogin && cleanPath === explicitLogin)) {
		return envBase;
	}

	// Deteksi bila URL adalah format subpath login di bawah admin (mis. /opop/login -> /opop)
	if (cleanPath.endsWith("/login")) {
		const prefix = cleanPath.slice(0, -"/login".length);
		if (prefix) return prefix;
		return envBase;
	}

	for (const sub of KNOWN_ADMIN_SUBPATHS) {
		if (sub !== "/login" && cleanPath.endsWith(sub)) {
			const prefix = cleanPath.slice(0, -sub.length);
			if (prefix) return prefix;
		}
	}

	if (envBase !== "/admin" && cleanPath.startsWith(envBase)) {
		return envBase;
	}

	if (cleanPath === "/admin" || cleanPath.startsWith("/admin/")) {
		return "/admin";
	}

	// Jika pengguna berada langsung di root path kustom admin (mis. /opop)
	if (
		cleanPath &&
		(!explicitLogin || cleanPath !== explicitLogin) &&
		!cleanPath.startsWith("/api") &&
		!cleanPath.startsWith("/_next")
	) {
		return cleanPath;
	}

	return envBase;
}

/**
 * Mendapatkan rute login aktif sesuai konteks runtime.
 */
export function getLoginRoute(currentPathname?: string): string {
	return getRuntimeLoginPath(currentPathname);
}

/**
 * Menghasilkan URL subpath admin lengkap dengan prefix admin yang sesuai.
 * Contoh: adminRoute("/prayer", "/opop/whatsapp") -> "/opop/prayer"
 */
export function adminRoute(path = "", currentPathname?: string): string {
	const base = resolveAdminBase(currentPathname);
	if (!path || path === "/" || path === "") {
		return base;
	}
	const clean = path.startsWith("/") ? path : `/${path}`;
	return `${base}${clean}`;
}
