import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function isValidSessionTokenStructure(token: string | undefined): boolean {
	if (!token) return false;
	const parts = token.split(".");
	if (parts.length !== 5) return false;
	const [adminIdRaw, random, issuedAtRaw, expiresAtRaw, signature] = parts;
	const adminId = Number.parseInt(adminIdRaw ?? "", 10);
	const issuedAt = Number.parseInt(issuedAtRaw ?? "", 10);
	const expiresAt = Number.parseInt(expiresAtRaw ?? "", 10);
	if (
		!Number.isSafeInteger(adminId) ||
		adminId <= 0 ||
		!Number.isSafeInteger(issuedAt) ||
		!Number.isSafeInteger(expiresAt) ||
		!random ||
		random.length < 10 ||
		!signature ||
		signature.length < 32 ||
		Date.now() > expiresAt
	) {
		return false;
	}
	return true;
}

export function middleware(request: NextRequest) {
	const rawAdminPath = (
		process.env.NEXT_PUBLIC_ADMIN_PATH ||
		process.env.ADMIN_PATH ||
		""
	).trim();
	const adminBasePath =
		!rawAdminPath || rawAdminPath === "undefined" || rawAdminPath === "null"
			? "/admin"
			: (rawAdminPath.startsWith("/") ? rawAdminPath : `/${rawAdminPath}`).replace(/\/+$/, "") || "/admin";

	const rawLoginPath = (
		process.env.NEXT_PUBLIC_LOGIN_PATH ||
		process.env.LOGIN_PATH ||
		""
	).trim();
	const customLogin =
		!rawLoginPath || rawLoginPath === "undefined" || rawLoginPath === "null"
			? null
			: (rawLoginPath.startsWith("/") ? rawLoginPath : `/${rawLoginPath}`).replace(/\/+$/, "");

	const loginPath =
		customLogin && customLogin !== "/login"
			? customLogin
			: adminBasePath !== "/admin"
				? `${adminBasePath}/login`
				: "/login";

	const rawPath = request.nextUrl.pathname;
	const pathname =
		rawPath.length > 1 && rawPath.endsWith("/")
			? rawPath.replace(/\/+$/, "")
			: rawPath;

	const isDev = process.env.NODE_ENV === "development";

	// 1. Jika rute kustom diaktifkan, blokir akses langsung ke "/admin" atau "/login" default
	if (adminBasePath !== "/admin") {
		if (pathname === "/admin" || pathname.startsWith("/admin/")) {
			return NextResponse.rewrite(new URL("/not-found", request.url), { status: 404 });
		}
	}
	if (loginPath !== "/login") {
		if (pathname === "/login" || pathname.startsWith("/login/")) {
			return NextResponse.rewrite(new URL("/not-found", request.url), { status: 404 });
		}
	}

	// 2. Tangani rute login rahasia (loginPath)
	if (pathname === loginPath) {
		const sessionCookie = request.cookies.get("unida_prayer_session")?.value;
		if (isValidSessionTokenStructure(sessionCookie)) {
			return NextResponse.redirect(new URL(adminBasePath, request.url));
		}
		return NextResponse.rewrite(new URL("/login", request.url));
	}

	// 3. Tangani rute admin rahasia (adminBasePath) beserta seluruh subpath-nya
	if (pathname === adminBasePath || pathname.startsWith(`${adminBasePath}/`)) {
		const subpath = pathname.slice(adminBasePath.length);

		// Mode development lokal (NODE_ENV=development): bypass login requirement.
		// Mode production: wajib memiliki session token valid, jika tidak redirect ke loginPath.
		if (!isDev) {
			const sessionCookie = request.cookies.get("unida_prayer_session")?.value;
			if (!isValidSessionTokenStructure(sessionCookie)) {
				const loginUrl = new URL(loginPath, request.url);
				return NextResponse.redirect(loginUrl);
			}
		}

		// Terautentikasi (atau mode dev) -> rewrite ke rute internal /admin
		const targetInternalPath = subpath ? `/admin${subpath}` : "/admin";
		return NextResponse.rewrite(new URL(targetInternalPath, request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - api (API endpoints)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - backgrounds (background images)
		 * - Static public files (favicon.ico, manifest.json, png icons, etc.)
		 */
		"/((?!api|_next/static|_next/image|backgrounds|favicon.ico|manifest.json|apple-touch-icon.png|app-icon-.*\\.png|favicon-.*\\.png|og-image.png).*)",
	],
};
