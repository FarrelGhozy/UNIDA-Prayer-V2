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

function withRuntimePathCookies(
	res: NextResponse,
	adminBasePath: string,
	loginPath: string,
): NextResponse {
	res.cookies.set("unida_admin_path", adminBasePath, {
		path: "/",
		httpOnly: false,
		sameSite: "lax",
	});
	res.cookies.set("unida_login_path", loginPath, {
		path: "/",
		httpOnly: false,
		sameSite: "lax",
	});
	return res;
}

export function middleware(request: NextRequest) {
	const rawAdminPath = (
		process.env.ADMIN_PATH ||
		process.env.NEXT_PUBLIC_ADMIN_PATH ||
		""
	).trim();
	const adminBasePath =
		!rawAdminPath || rawAdminPath === "undefined" || rawAdminPath === "null"
			? "/admin"
			: (rawAdminPath.startsWith("/") ? rawAdminPath : `/${rawAdminPath}`).replace(/\/+$/, "") || "/admin";

	const rawLoginPath = (
		process.env.LOGIN_PATH ||
		process.env.NEXT_PUBLIC_LOGIN_PATH ||
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
			return withRuntimePathCookies(
				NextResponse.rewrite(new URL("/not-found", request.url), { status: 404 }),
				adminBasePath,
				loginPath,
			);
		}
	}
	if (loginPath !== "/login") {
		if (pathname === "/login" || pathname.startsWith("/login/")) {
			return withRuntimePathCookies(
				NextResponse.rewrite(new URL("/not-found", request.url), { status: 404 }),
				adminBasePath,
				loginPath,
			);
		}
	}

	// 2. Redirect eksplisit jika pengguna membuka `${adminBasePath}/login` saat loginPath terpisah
	if (loginPath !== `${adminBasePath}/login` && pathname === `${adminBasePath}/login`) {
		return withRuntimePathCookies(
			NextResponse.redirect(new URL(loginPath, request.url)),
			adminBasePath,
			loginPath,
		);
	}

	// 3. Tangani rute login rahasia (loginPath)
	if (pathname === loginPath) {
		const sessionCookie = request.cookies.get("unida_prayer_session")?.value;
		const isRelogin =
			request.nextUrl.searchParams.has("relogin") ||
			request.nextUrl.searchParams.has("force");

		if (isValidSessionTokenStructure(sessionCookie) && !isRelogin) {
			return withRuntimePathCookies(
				NextResponse.redirect(new URL(adminBasePath, request.url)),
				adminBasePath,
				loginPath,
			);
		}
		return withRuntimePathCookies(
			NextResponse.rewrite(new URL("/login", request.url)),
			adminBasePath,
			loginPath,
		);
	}

	// 4. Tangani rute admin rahasia (adminBasePath) beserta seluruh subpath-nya
	if (pathname === adminBasePath || pathname.startsWith(`${adminBasePath}/`)) {
		const subpath = pathname.slice(adminBasePath.length);

		// Mode development lokal (NODE_ENV=development): bypass login requirement.
		// Mode production: wajib memiliki session token valid, jika tidak redirect ke loginPath.
		if (!isDev) {
			const sessionCookie = request.cookies.get("unida_prayer_session")?.value;
			if (!isValidSessionTokenStructure(sessionCookie)) {
				const loginUrl = new URL(loginPath, request.url);
				return withRuntimePathCookies(
					NextResponse.redirect(loginUrl),
					adminBasePath,
					loginPath,
				);
			}
		}

		// Terautentikasi (atau mode dev) -> rewrite ke rute internal /admin
		const targetInternalPath = subpath ? `/admin${subpath}` : "/admin";
		return withRuntimePathCookies(
			NextResponse.rewrite(new URL(targetInternalPath, request.url)),
			adminBasePath,
			loginPath,
		);
	}

	return withRuntimePathCookies(NextResponse.next(), adminBasePath, loginPath);
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
