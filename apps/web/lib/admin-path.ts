/**
 * Konfigurasi rute path admin dan login dari environment variable.
 * - NEXT_PUBLIC_ADMIN_PATH: default fallback adalah "/admin"
 * - NEXT_PUBLIC_LOGIN_PATH: default fallback adalah `${ADMIN_BASE_PATH}/login` (bila admin bukan /admin) atau "/login"
 */
function normalizePath(raw: string | undefined): string | null {
	const trimmed = (raw ?? "").trim();
	if (!trimmed || trimmed === "undefined" || trimmed === "null") return null;
	const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
	return withSlash.replace(/\/+$/, "") || null;
}

export const ADMIN_BASE_PATH = normalizePath(process.env.NEXT_PUBLIC_ADMIN_PATH) || "/admin";

const customLogin = normalizePath(process.env.NEXT_PUBLIC_LOGIN_PATH);
export const LOGIN_ROUTE =
	customLogin && customLogin !== "/login"
		? customLogin
		: ADMIN_BASE_PATH !== "/admin"
			? `${ADMIN_BASE_PATH}/login`
			: "/login";

export function adminRoute(path = ""): string {
	if (!path || path === "/" || path === "") {
		return ADMIN_BASE_PATH;
	}
	const clean = path.startsWith("/") ? path : `/${path}`;
	return `${ADMIN_BASE_PATH}${clean}`;
}
