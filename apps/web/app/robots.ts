import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const baseUrl =
		process.env.NEXT_PUBLIC_APP_URL ||
		process.env.WEB_URL ||
		"https://prayer.utc.web.id";
	const cleanBase = baseUrl.replace(/\/+$/, "");

	const adminPath =
		process.env.ADMIN_PATH || process.env.NEXT_PUBLIC_ADMIN_PATH || "/admin";
	const loginPath =
		process.env.LOGIN_PATH || process.env.NEXT_PUBLIC_LOGIN_PATH || "/login";

	const disallows = Array.from(
		new Set([
			"/admin/",
			"/login",
			"/api/",
			adminPath.endsWith("/") ? adminPath : `${adminPath}/`,
			loginPath,
		]),
	);

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: disallows,
			},
		],
		sitemap: `${cleanBase}/sitemap.xml`,
		host: cleanBase,
	};
}
