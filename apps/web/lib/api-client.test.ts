import { afterEach, describe, expect, it } from "bun:test";
import { fetchApi } from "./api-client";

const originalFetch = globalThis.fetch;

afterEach(() => {
	globalThis.fetch = originalFetch;
});

function stubFetch(handler: () => Response) {
	globalThis.fetch = (async () => handler()) as unknown as typeof fetch;
}

describe("fetchApi", () => {
	it("mengubah balasan non-JSON 500 menjadi pesan ramah", async () => {
		stubFetch(() => new Response("Internal Server Error", { status: 500 }));

		const res = await fetchApi("https://example.test/api/health");

		expect(res.data).toBeNull();
		expect(res.error?.code).toBe("HTTP_500");
		expect(res.error?.message).toBe(
			"Layanan server sedang tidak tersedia. Silakan coba beberapa saat lagi.",
		);
	});

	it("memakai pesan error JSON dari backend", async () => {
		stubFetch(
			() =>
				new Response(
					JSON.stringify({
						data: null,
						error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan internal." },
					}),
					{ status: 500, headers: { "content-type": "application/json" } },
				),
		);

		const res = await fetchApi("https://example.test/api/health");

		expect(res.error?.code).toBe("INTERNAL_ERROR");
		expect(res.error?.message).toBe("Terjadi kesalahan internal.");
	});

	it("mengembalikan data saat respons JSON sukses", async () => {
		stubFetch(
			() =>
				new Response(JSON.stringify({ data: { ok: true }, error: null }), {
					status: 200,
					headers: { "content-type": "application/json" },
				}),
		);

		const res = await fetchApi<{ ok: boolean }>("https://example.test/api/health");

		expect(res.data).toEqual({ ok: true });
		expect(res.error).toBeNull();
	});

	it("menyembunyikan detail error jaringan dari UI", async () => {
		globalThis.fetch = (async () => {
			throw new Error("fetch failed: ECONNREFUSED");
		}) as unknown as typeof fetch;

		const res = await fetchApi("https://example.test/api/health");

		expect(res.error?.code).toBe("NETWORK_ERROR");
		expect(res.error?.message).not.toContain("ECONNREFUSED");
	});

	it("menolak respons sukses yang bukan JSON", async () => {
		stubFetch(
			() =>
				new Response("<html>ok</html>", {
					status: 200,
					headers: { "content-type": "text/html" },
				}),
		);

		const res = await fetchApi("https://example.test/api/health");

		expect(res.error?.code).toBe("INVALID_RESPONSE");
	});
});
