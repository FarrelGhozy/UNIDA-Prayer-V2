interface AttemptRecord {
	count: number;
	firstAttemptAt: number;
	blockedUntil: number | null;
}

export class LoginRateLimiter {
	private attempts = new Map<string, AttemptRecord>();
	private maxAttempts: number;
	private windowMs: number;
	private blockDurationMs: number;

	constructor(options?: {
		maxAttempts?: number;
		windowMs?: number;
		blockDurationMs?: number;
	}) {
		this.maxAttempts = options?.maxAttempts ?? 5;
		this.windowMs = options?.windowMs ?? 15 * 60 * 1000;
		this.blockDurationMs = options?.blockDurationMs ?? 15 * 60 * 1000;
	}

	isBlocked(key: string, now = Date.now()): { blocked: boolean; remainingWaitMs: number } {
		this.cleanup(now);
		const record = this.attempts.get(key);
		if (!record) {
			return { blocked: false, remainingWaitMs: 0 };
		}

		if (record.blockedUntil && record.blockedUntil > now) {
			return { blocked: true, remainingWaitMs: record.blockedUntil - now };
		}

		return { blocked: false, remainingWaitMs: 0 };
	}

	recordFailure(key: string, now = Date.now()): { blocked: boolean; attemptsLeft: number } {
		this.cleanup(now);
		let record = this.attempts.get(key);

		if (!record || now - record.firstAttemptAt > this.windowMs) {
			record = {
				count: 1,
				firstAttemptAt: now,
				blockedUntil: null,
			};
			this.attempts.set(key, record);
			return { blocked: false, attemptsLeft: this.maxAttempts - 1 };
		}

		record.count += 1;
		if (record.count >= this.maxAttempts) {
			record.blockedUntil = now + this.blockDurationMs;
			return { blocked: true, attemptsLeft: 0 };
		}

		return { blocked: false, attemptsLeft: this.maxAttempts - record.count };
	}

	recordSuccess(key: string): void {
		this.attempts.delete(key);
	}

	reset(): void {
		this.attempts.clear();
	}

	private cleanup(now: number): void {
		if (this.attempts.size > 1000) {
			for (const [key, record] of this.attempts.entries()) {
				const isExpiredWindow = now - record.firstAttemptAt > this.windowMs;
				const isExpiredBlock = !record.blockedUntil || record.blockedUntil <= now;
				if (isExpiredWindow && isExpiredBlock) {
					this.attempts.delete(key);
				}
			}
		}
	}
}

export const loginRateLimiter = new LoginRateLimiter();
