import { fail, ok, type ErrorCode } from "@unida-prayer/shared";
import { Elysia } from "elysia";
import { config } from "../../core/config";
import { SESSION_COOKIE_NAME } from "./guard";
import { loginRateLimiter } from "./rate-limit";
import { changePasswordBodySchema, loginBodySchema } from "./schema";
import {
	AuthError,
	changeAdminPassword,
	getSessionAdmin,
	loginAdmin,
	logoutAdmin,
} from "./service";

export const authRoutes = new Elysia({ prefix: "/api/auth" })
	.post(
		"/login",
		async ({ body, cookie, headers, status }) => {
			const forwarded = headers["x-forwarded-for"];
			const clientIp = (forwarded ? forwarded.split(",")[0]?.trim() : undefined) || headers["x-real-ip"] || "127.0.0.1";
			const rateLimitKey = `${clientIp}:${body.email.trim().toLowerCase()}`;

			const check = loginRateLimiter.isBlocked(rateLimitKey);
			if (check.blocked) {
				const waitMin = Math.max(1, Math.ceil(check.remainingWaitMs / 60000));
				return status(
					429,
					fail(
						"RATE_LIMITED",
						`Terlalu banyak percobaan login yang gagal. Silakan coba lagi dalam ${waitMin} menit.`,
					),
				);
			}

			try {
				const { admin, token } = await loginAdmin(body.email, body.password);
				loginRateLimiter.recordSuccess(rateLimitKey);

				const sessionCookie = cookie[SESSION_COOKIE_NAME];
				sessionCookie?.set({
					value: token,
					httpOnly: true,
					path: "/",
					sameSite: "lax",
					secure: config.nodeEnv === "production",
					maxAge: 7 * 24 * 60 * 60,
				});

				return ok(admin);
			} catch (error) {
				if (error instanceof AuthError) {
					loginRateLimiter.recordFailure(rateLimitKey);
					return status(error.statusCode, fail(error.code as ErrorCode, error.message));
				}
				throw error;
			}
		},
		{
			body: loginBodySchema,
		},
	)
	.post("/logout", ({ cookie }) => {
		const rawToken = cookie[SESSION_COOKIE_NAME]?.value;
		const token = typeof rawToken === "string" ? rawToken : undefined;
		logoutAdmin(token);
		cookie[SESSION_COOKIE_NAME]?.remove();
		return ok({ success: true });
	})
	.get("/me", async ({ cookie, status }) => {
		try {
			const rawToken = cookie[SESSION_COOKIE_NAME]?.value;
			const token = typeof rawToken === "string" ? rawToken : undefined;
			const admin = await getSessionAdmin(token);
			return ok(admin);
		} catch (error) {
			if (error instanceof AuthError) {
				return status(error.statusCode, fail(error.code as ErrorCode, error.message));
			}
			throw error;
		}
	})
	.post(
		"/change-password",
		async ({ body, cookie, status }) => {
			try {
				const rawToken = cookie[SESSION_COOKIE_NAME]?.value;
				const token = typeof rawToken === "string" ? rawToken : undefined;
				const admin = await getSessionAdmin(token);
				if (admin.id === 0) {
					return status(400, fail("VALIDATION_ERROR", "Ganti kata sandi nonaktif dalam mode development (bypass login)."));
				}
				await changeAdminPassword(admin.id, body.oldPassword, body.newPassword);
				cookie[SESSION_COOKIE_NAME]?.remove();
				return ok({ success: true, message: "Kata sandi berhasil diperbarui. Silakan login kembali." });
			} catch (error) {
				if (error instanceof AuthError) {
					return status(error.statusCode, fail(error.code as ErrorCode, error.message));
				}
				throw error;
			}
		},
		{
			body: changePasswordBodySchema,
		},
	);
