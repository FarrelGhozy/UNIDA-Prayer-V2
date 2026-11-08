import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl =
		process.env.NEXT_PUBLIC_APP_URL ||
		process.env.WEB_URL ||
		"https://prayer.utc.web.id";
	const cleanBase = baseUrl.replace(/\/+$/, "");

	return [
		{
			url: cleanBase,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
			images: [`${cleanBase}/og-image.jpg`],
		},
	];
}
