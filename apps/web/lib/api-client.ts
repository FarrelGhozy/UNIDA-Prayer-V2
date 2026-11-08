export interface ApiError {
	code: string;
	message: string;
}

export interface ApiResponse<T> {
	data: T | null;
	error: ApiError | null;
}

const DEFAULT_ERROR_MESSAGE = "Terjadi kendala saat menghubungi server.";
const SERVER_UNAVAILABLE_MESSAGE =
	"Layanan server sedang tidak tersedia. Silakan coba beberapa saat lagi.";

function httpErrorMessage(status: number): string {
	if (status === 404) return "Layanan atau data tidak ditemukan.";
	if (status === 503) {
		return "Layanan server sedang dalam pemeliharaan atau DB belum siap.";
	}
	if (status >= 500) return SERVER_UNAVAILABLE_MESSAGE;
	return DEFAULT_ERROR_MESSAGE;
}

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
	return (
		typeof value === "object" &&
		value !== null &&
		!Array.isArray(value) &&
		("data" in value || "error" in value)
	);
}

// URL basis API:
// - NEXT_PUBLIC_API_URL (disarankan dikosongkan di dev/prod agar same-origin
//   "/api/..." lewat rewrite Next.js di next.config.ts → tidak kena CORS).
// - NEXT_PUBLIC_API_BASE_URL didukung sebagai alias lama (dipakai deploy/compose.yml).
// - SSR (server) memakai INTERNAL_API_URL bila keduanya kosong.
export function resolveApiUrl(endpoint: string): string {
	if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
		return endpoint;
	}
	const base = (
		process.env.NEXT_PUBLIC_API_URL ||
		process.env.NEXT_PUBLIC_API_BASE_URL ||
		(typeof window === "undefined"
			? process.env.INTERNAL_API_URL || "http://127.0.0.1:3511"
			: "")
	).trim();

	const cleanBase = base.replace(/\/+$/, "");
	const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

	// Bila base adalah relative "/api" dan endpoint sudah berawalan "/api",
	// jangan menduplikasi menjadi "/api/api/...".
	if (cleanBase === "/api" && cleanEndpoint.startsWith("/api/")) {
		return cleanEndpoint;
	}
	if (cleanBase.endsWith("/api") && cleanEndpoint.startsWith("/api/")) {
		return `${cleanBase.slice(0, -4)}${cleanEndpoint}`;
	}
	return `${cleanBase}${cleanEndpoint}`;
}

export async function fetchApi<T>(
	endpoint: string,
	options?: RequestInit,
): Promise<ApiResponse<T>> {
	const url = resolveApiUrl(endpoint);

	try {
		const res = await fetch(url, {
			...options,
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				...options?.headers,
			},
			credentials: "include",
		});

		// Proxy Next.js bisa membalas teks non-JSON (mis. "Internal Server Error").
		// Baca sebagai teks dulu agar pesan parse mentah tidak bocor ke UI.
		const text = await res.text();
		let json: ApiResponse<T> | null = null;
		if (text.length > 0) {
			try {
				const parsed: unknown = JSON.parse(text);
				if (isApiResponse(parsed)) {
					json = parsed as ApiResponse<T>;
				}
			} catch {
				json = null;
			}
		}

		if (!res.ok) {
			return {
				data: null,
				error: json?.error || {
					code: `HTTP_${res.status}`,
					message: httpErrorMessage(res.status),
				},
			};
		}

		if (!json) {
			return {
				data: null,
				error: {
					code: "INVALID_RESPONSE",
					message: "Respons dari server tidak dapat dibaca. Silakan coba lagi.",
				},
			};
		}

		return json;
	} catch {
		return {
			data: null,
			error: {
				code: "NETWORK_ERROR",
				message:
					"Gagal terhubung ke server UNIDA Prayer. Periksa koneksi Anda lalu coba lagi.",
			},
		};
	}
}
