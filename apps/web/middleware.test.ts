import { afterAll, beforeEach, describe, expect, it } from "bun:test";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";

function makeTestSessionToken(expiresAtOffsetMs = 86400000): string {
	const adminId = 1;
	const random = "a1b2c3d4e5f6g7h8";
	const issuedAt = Date.now();
	const expiresAt = issuedAt + expiresAtOffsetMs;
	const sig = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
	return `${adminId}.${random}.${issuedAt}.${expiresAt}.${sig}`;
}

describe("middleware secret admin routing", () => {
	const originalAdminPath = process.env.NEXT_PUBLIC_ADMIN_PATH;
	const originalLoginPath = process.env.NEXT_PUBLIC_LOGIN_PATH;

	beforeEach(() => {
		// Isolasi dari .env lokal yang mungkin memakai login path kustom.
		delete process.env.NEXT_PUBLIC_LOGIN_PATH;
	});

	afterAll(() => {
		if (originalAdminPath === undefined) {
			delete process.env.NEXT_PUBLIC_ADMIN_PATH;
		} else {
			process.env.NEXT_PUBLIC_ADMIN_PATH = originalAdminPath;
		}
		if (originalLoginPath === undefined) {
			delete process.env.NEXT_PUBLIC_LOGIN_PATH;
		} else {
			process.env.NEXT_PUBLIC_LOGIN_PATH = originalLoginPath;
		}
	});

	it("memblokir /admin dan /login langsung (404) bila kustom path diatur", () => {
		process.env.NEXT_PUBLIC_ADMIN_PATH = "/pengurus-siman";

		const reqAdmin = new NextRequest("http://localhost:3000/admin");
		const resAdmin = middleware(reqAdmin);
		expect(resAdmin.status).toBe(404);

		const reqLogin = new NextRequest("http://localhost:3000/login");
		const resLogin = middleware(reqLogin);
		expect(resLogin.status).toBe(404);
	});

	it("me-rewrite kustom path /login ke form /login", () => {
		process.env.NEXT_PUBLIC_ADMIN_PATH = "/pengurus-siman";

		const req = new NextRequest("http://localhost:3000/pengurus-siman/login");
		const res = middleware(req);
		expect(res.headers.get("x-middleware-rewrite")).toContain("/login");
	});

	it("me-redirect kustom path ke login jika belum ada session cookie", () => {
		process.env.NEXT_PUBLIC_ADMIN_PATH = "/pengurus-siman";

		const req = new NextRequest("http://localhost:3000/pengurus-siman");
		const res = middleware(req);
		expect(res.status).toBe(307);
		expect(res.headers.get("location")).toContain("/pengurus-siman/login");
	});

	it("me-rewrite kustom path ke /admin jika sudah ada session cookie valid", () => {
		process.env.NEXT_PUBLIC_ADMIN_PATH = "/pengurus-siman";

		const req = new NextRequest("http://localhost:3000/pengurus-siman", {
			headers: {
				cookie: `unida_prayer_session=${makeTestSessionToken()}`,
			},
		});
		const res = middleware(req);
		expect(res.headers.get("x-middleware-rewrite")).toContain("/admin");
	});

	it("me-redirect kustom path ke login jika session cookie malformed atau expired", () => {
		process.env.NEXT_PUBLIC_ADMIN_PATH = "/pengurus-siman";

		// 1. Cookie malformed / dummy asal
		const reqMalformed = new NextRequest("http://localhost:3000/pengurus-siman", {
			headers: {
				cookie: "unida_prayer_session=dummy-asal",
			},
		});
		const resMalformed = middleware(reqMalformed);
		expect(resMalformed.status).toBe(307);
		expect(resMalformed.headers.get("location")).toContain("/pengurus-siman/login");

		// 2. Cookie expired
		const reqExpired = new NextRequest("http://localhost:3000/pengurus-siman", {
			headers: {
				cookie: `unida_prayer_session=${makeTestSessionToken(-5000)}`,
			},
		});
		const resExpired = middleware(reqExpired);
		expect(resExpired.status).toBe(307);
		expect(resExpired.headers.get("location")).toContain("/pengurus-siman/login");
	});

	it("mendukung kustom NEXT_PUBLIC_LOGIN_PATH yang terpisah dari admin path", () => {
		process.env.NEXT_PUBLIC_ADMIN_PATH = "/pengurus-siman";
		process.env.NEXT_PUBLIC_LOGIN_PATH = "/gerbang-rahasia";

		// Default /login diblokir
		const reqLogin = new NextRequest("http://localhost:3000/login");
		expect(middleware(reqLogin).status).toBe(404);

		// Akses /gerbang-rahasia di-rewrite ke form /login
		const reqCustomLogin = new NextRequest("http://localhost:3000/gerbang-rahasia");
		const resCustomLogin = middleware(reqCustomLogin);
		expect(resCustomLogin.headers.get("x-middleware-rewrite")).toContain("/login");

		// Akses admin tanpa cookie me-redirect ke /gerbang-rahasia
		const reqAdmin = new NextRequest("http://localhost:3000/pengurus-siman");
		const resAdmin = middleware(reqAdmin);
		expect(resAdmin.status).toBe(307);
		expect(resAdmin.headers.get("location")).toContain("/gerbang-rahasia");

		delete process.env.NEXT_PUBLIC_LOGIN_PATH;
	});

	it("me-rewrite subpath kustom (mis. /prayer) ke /admin/prayer", () => {
		process.env.NEXT_PUBLIC_ADMIN_PATH = "/pengurus-siman";

		const req = new NextRequest("http://localhost:3000/pengurus-siman/prayer", {
			headers: {
				cookie: `unida_prayer_session=${makeTestSessionToken()}`,
			},
		});
		const res = middleware(req);
		expect(res.headers.get("x-middleware-rewrite")).toContain("/admin/prayer");
	});

	it("melewatkan login requirement tapi tetap me-rewrite ke /admin bila NODE_ENV=development", () => {
		const originalNodeEnv = process.env.NODE_ENV;
		// NODE_ENV readonly di types Next — set via defineProperty.
		Object.defineProperty(process.env, "NODE_ENV", {
			value: "development",
			configurable: true,
			writable: true,
			enumerable: true,
		});
		process.env.NEXT_PUBLIC_ADMIN_PATH = "/pengurus-siman";

		// Tanpa cookie, tetap sukses 200 dan di-rewrite ke /admin internal
		const req = new NextRequest("http://localhost:3000/pengurus-siman");
		const res = middleware(req);
		expect(res.status).toBe(200);
		expect(res.headers.get("location")).toBeNull();
		expect(res.headers.get("x-middleware-rewrite")).toContain("/admin");

		// Subpath kustom juga langsung di-rewrite tanpa login
		const reqSub = new NextRequest("http://localhost:3000/pengurus-siman/whatsapp");
		const resSub = middleware(reqSub);
		expect(resSub.status).toBe(200);
		expect(resSub.headers.get("x-middleware-rewrite")).toContain("/admin/whatsapp");

		Object.defineProperty(process.env, "NODE_ENV", {
			value: originalNodeEnv,
			configurable: true,
			writable: true,
			enumerable: true,
		});
	});

	it("menormalisasi trailing slash pada path kustom", () => {
		process.env.NEXT_PUBLIC_ADMIN_PATH = "/pengurus-siman";

		const req = new NextRequest("http://localhost:3000/pengurus-siman/", {
			headers: {
				cookie: `unida_prayer_session=${makeTestSessionToken()}`,
			},
		});
		const res = middleware(req);
		expect(res.status).toBe(200);
		expect(res.headers.get("x-middleware-rewrite")).toContain("/admin");
	});

	it("membiarkan rute landing / tanpa intervensi", () => {
		process.env.NEXT_PUBLIC_ADMIN_PATH = "/pengurus-siman";

		const req = new NextRequest("http://localhost:3000/");
		const res = middleware(req);
		expect(res.headers.get("x-middleware-rewrite")).toBeNull();
		expect(res.status).toBe(200);
	});
});
