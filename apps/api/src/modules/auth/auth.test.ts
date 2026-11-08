import { describe, expect, it } from "bun:test";
import { LoginRateLimiter } from "./rate-limit";

describe("modules/auth/rate-limit", () => {
	it("memblokir setelah mencapai batas kegagalan maksimum", () => {
		const limiter = new LoginRateLimiter({
			maxAttempts: 3,
			windowMs: 60_000,
			blockDurationMs: 60_000,
		});

		const key = "192.168.1.1:admin@unida.gontor.ac.id";

		// Percobaan 1 gagal
		let res = limiter.recordFailure(key);
		expect(res.blocked).toBe(false);
		expect(res.attemptsLeft).toBe(2);
		expect(limiter.isBlocked(key).blocked).toBe(false);

		// Percobaan 2 gagal
		res = limiter.recordFailure(key);
		expect(res.blocked).toBe(false);
		expect(res.attemptsLeft).toBe(1);
		expect(limiter.isBlocked(key).blocked).toBe(false);

		// Percobaan 3 gagal -> langsung diblokir
		res = limiter.recordFailure(key);
		expect(res.blocked).toBe(true);
		expect(res.attemptsLeft).toBe(0);
		expect(limiter.isBlocked(key).blocked).toBe(true);
		expect(limiter.isBlocked(key).remainingWaitMs).toBeGreaterThan(0);
	});

	it("mereset kegagalan jika login berhasil", () => {
		const limiter = new LoginRateLimiter({
			maxAttempts: 3,
			windowMs: 60_000,
			blockDurationMs: 60_000,
		});

		const key = "192.168.1.2:admin@unida.gontor.ac.id";

		limiter.recordFailure(key);
		limiter.recordFailure(key);
		expect(limiter.isBlocked(key).blocked).toBe(false);

		limiter.recordSuccess(key);
		expect(limiter.isBlocked(key).blocked).toBe(false);

		// Setelah sukses, jatah kembali penuh
		const res = limiter.recordFailure(key);
		expect(res.attemptsLeft).toBe(2);
	});
});
