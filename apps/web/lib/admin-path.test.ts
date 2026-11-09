import { afterAll, beforeEach, describe, expect, it } from "bun:test";
import {
	adminRoute,
	ADMIN_BASE_PATH,
	getLoginRoute,
	getRuntimeAdminPath,
	getRuntimeLoginPath,
	LOGIN_ROUTE,
	resolveAdminBase,
} from "./admin-path";

describe("admin-path helper", () => {
	const originalAdminPath = process.env.ADMIN_PATH;
	const originalLoginPath = process.env.LOGIN_PATH;
	const originalPublicAdminPath = process.env.NEXT_PUBLIC_ADMIN_PATH;
	const originalPublicLoginPath = process.env.NEXT_PUBLIC_LOGIN_PATH;

	beforeEach(() => {
		delete process.env.ADMIN_PATH;
		delete process.env.LOGIN_PATH;
		delete process.env.NEXT_PUBLIC_ADMIN_PATH;
		delete process.env.NEXT_PUBLIC_LOGIN_PATH;
	});

	afterAll(() => {
		if (originalAdminPath !== undefined) process.env.ADMIN_PATH = originalAdminPath;
		if (originalLoginPath !== undefined) process.env.LOGIN_PATH = originalLoginPath;
		if (originalPublicAdminPath !== undefined)
			process.env.NEXT_PUBLIC_ADMIN_PATH = originalPublicAdminPath;
		if (originalPublicLoginPath !== undefined)
			process.env.NEXT_PUBLIC_LOGIN_PATH = originalPublicLoginPath;
	});

	it("menyediakan ADMIN_BASE_PATH dengan fallback /admin", () => {
		expect(ADMIN_BASE_PATH).toBeDefined();
		expect(ADMIN_BASE_PATH.startsWith("/")).toBe(true);
	});

	it("LOGIN_ROUTE memiliki fallback path yang valid", () => {
		expect(LOGIN_ROUTE).toBeDefined();
		expect(LOGIN_ROUTE.startsWith("/")).toBe(true);
	});

	it("adminRoute() mengembalikan base path bila tanpa argumen atau '/'", () => {
		expect(adminRoute()).toBe("/admin");
		expect(adminRoute("")).toBe("/admin");
		expect(adminRoute("/")).toBe("/admin");
	});

	it("adminRoute('/prayer') menghasilkan prefix yang benar", () => {
		expect(adminRoute("/prayer")).toBe("/admin/prayer");
		expect(adminRoute("prayer")).toBe("/admin/prayer");
	});

	it("adminRoute('/messages?status=FAILED') mempertahankan query string", () => {
		expect(adminRoute("/messages?status=FAILED")).toBe(
			"/admin/messages?status=FAILED",
		);
	});

	it("resolveAdminBase() mendeteksi base path kustom dari URL browser secara dinamis", () => {
		expect(resolveAdminBase("/pengurus-siman/whatsapp")).toBe("/pengurus-siman");
		expect(resolveAdminBase("/pengurus-siman/prayer")).toBe("/pengurus-siman");
		expect(resolveAdminBase("/pengurus-siman/login")).toBe("/pengurus-siman");
		expect(resolveAdminBase("/pengurus-siman")).toBe("/pengurus-siman");
		expect(resolveAdminBase("/admin/messages")).toBe("/admin");
	});

	it("adminRoute() dengan currentPathname menghasilkan rute subpath sesuai base URL aktif", () => {
		const current = "/portal-rahasia/whatsapp";
		expect(adminRoute("/prayer", current)).toBe("/portal-rahasia/prayer");
		expect(adminRoute("/targets", current)).toBe("/portal-rahasia/targets");
		expect(adminRoute("/", current)).toBe("/portal-rahasia");
	});

	it("getLoginRoute() menghasilkan rute login sesuai konteks path admin tanpa login kustom", () => {
		expect(getLoginRoute("/portal-rahasia/targets")).toBe("/portal-rahasia/login");
		expect(getLoginRoute("/admin/targets")).toBe("/login");
	});

	it("getRuntimeLoginPath() dan getLoginRoute() menghormati rute login kustom terpisah", () => {
		process.env.NEXT_PUBLIC_LOGIN_PATH = "/masuk88";
		expect(getRuntimeLoginPath()).toBe("/masuk88");
		expect(getLoginRoute("/opop/targets")).toBe("/masuk88");
		expect(getLoginRoute("/admin/targets")).toBe("/masuk88");
	});

	it("resolveAdminBase() tidak mengira login path kustom sebagai admin base", () => {
		process.env.NEXT_PUBLIC_ADMIN_PATH = "/opop";
		process.env.NEXT_PUBLIC_LOGIN_PATH = "/masuk88";
		expect(resolveAdminBase("/masuk88")).toBe("/opop");
		expect(adminRoute("/", "/masuk88")).toBe("/opop");
	});

	it("getRuntimeAdminPath() dan getRuntimeLoginPath() membaca cookie browser bila tersedia", () => {
		// Mock document.cookie
		const originalDocument = globalThis.document;
		// @ts-expect-error Mocking document for unit test
		globalThis.document = {
			cookie: "unida_admin_path=/rahasia-banget; unida_login_path=/pintu-masuk",
		};

		expect(getRuntimeAdminPath()).toBe("/rahasia-banget");
		expect(getRuntimeLoginPath()).toBe("/pintu-masuk");
		expect(getLoginRoute()).toBe("/pintu-masuk");

		// Restore
		(globalThis as unknown as { document: unknown }).document = originalDocument;
	});
});
