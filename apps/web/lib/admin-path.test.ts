import { describe, expect, it } from "bun:test";
import {
	adminRoute,
	ADMIN_BASE_PATH,
	getLoginRoute,
	LOGIN_ROUTE,
	resolveAdminBase,
} from "./admin-path";

describe("admin-path helper", () => {
	it("menyediakan ADMIN_BASE_PATH dengan fallback /admin", () => {
		expect(ADMIN_BASE_PATH).toBeDefined();
		expect(ADMIN_BASE_PATH.startsWith("/")).toBe(true);
	});

	it("LOGIN_ROUTE memiliki fallback path yang valid", () => {
		expect(LOGIN_ROUTE).toBeDefined();
		expect(LOGIN_ROUTE.startsWith("/")).toBe(true);
	});

	it("adminRoute() mengembalikan base path bila tanpa argumen atau '/'", () => {
		expect(adminRoute()).toBe(ADMIN_BASE_PATH);
		expect(adminRoute("")).toBe(ADMIN_BASE_PATH);
		expect(adminRoute("/")).toBe(ADMIN_BASE_PATH);
	});

	it("adminRoute('/prayer') menghasilkan prefix yang benar", () => {
		expect(adminRoute("/prayer")).toBe(`${ADMIN_BASE_PATH}/prayer`);
		expect(adminRoute("prayer")).toBe(`${ADMIN_BASE_PATH}/prayer`);
	});

	it("adminRoute('/messages?status=FAILED') mempertahankan query string", () => {
		expect(adminRoute("/messages?status=FAILED")).toBe(
			`${ADMIN_BASE_PATH}/messages?status=FAILED`,
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

	it("getLoginRoute() menghasilkan rute login sesuai konteks path admin", () => {
		expect(getLoginRoute("/portal-rahasia/targets")).toBe("/portal-rahasia/login");
		expect(getLoginRoute("/admin/targets")).toBe("/login");
	});
});
