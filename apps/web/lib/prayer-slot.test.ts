import { describe, expect, it } from "bun:test";
import type { TodayPrayerData } from "../types/prayer";
import { computeSlotStatus, getCurrentPrayerName } from "./prayer-slot";

const mockPrayerData: TodayPrayerData = {
	locationName: "UNIDA Gontor",
	timezone: "Asia/Jakarta",
	coordinates: { latitude: -7.8652, longitude: 111.4617 },
	dateLocal: "2026-11-08",
	isFriday: false,
	hijri: {
		formatted: "28 Jumadil Ula 1448",
		day: 28,
		monthName: "Jumadil Ula",
		year: 1448,
		adjustmentDays: 0,
	},
	times: {
		FAJR: {
			utc: "2026-11-07T20:53:00.000Z", // 03:53 WIB
			time24: "03:53",
			timeLabel: "03:53",
			displayName: "Subuh",
		},
		SUNRISE: {
			utc: "2026-11-07T22:08:00.000Z", // 05:08 WIB
			time24: "05:08",
			timeLabel: "05:08",
			displayName: "Terbit",
		},
		DHUHR: {
			utc: "2026-11-08T04:26:00.000Z", // 11:26 WIB
			time24: "11:26",
			timeLabel: "11:26",
			displayName: "Dzuhur",
		},
		ASR: {
			utc: "2026-11-08T07:44:00.000Z", // 14:44 WIB
			time24: "14:44",
			timeLabel: "14:44",
			displayName: "Ashar",
		},
		MAGHRIB: {
			utc: "2026-11-08T10:44:00.000Z", // 17:44 WIB
			time24: "17:44",
			timeLabel: "17:44",
			displayName: "Maghrib",
		},
		ISHA: {
			utc: "2026-11-08T11:56:00.000Z", // 18:56 WIB
			time24: "18:56",
			timeLabel: "18:56",
			displayName: "Isya",
		},
	},
	nextPrayer: {
		prayerName: "DHUHR",
		displayName: "Dzuhur",
		scheduledAtUtc: "2026-11-08T04:26:00.000Z",
		time24: "11:26",
		timeLabel: "11:26",
		remainingSeconds: 3600,
		isTomorrow: false,
	},
	serverNowUtc: "2026-11-08T00:00:00.000Z",
};

describe("getCurrentPrayerName", () => {
	it("mengembalikan FAJR saat jam Subuh (04:15 WIB)", () => {
		const t = new Date("2026-11-07T21:15:00.000Z").getTime();
		expect(getCurrentPrayerName(mockPrayerData, t)).toBe("FAJR");
	});

	it("mengembalikan null saat antara Terbit dan Dzuhur (08:00 WIB)", () => {
		const t = new Date("2026-11-08T01:00:00.000Z").getTime();
		expect(getCurrentPrayerName(mockPrayerData, t)).toBeNull();
	});

	it("mengembalikan DHUHR saat waktu Dzuhur (12:30 WIB)", () => {
		const t = new Date("2026-11-08T05:30:00.000Z").getTime();
		expect(getCurrentPrayerName(mockPrayerData, t)).toBe("DHUHR");
	});

	it("mengembalikan ASR saat waktu Ashar (15:00 WIB)", () => {
		const t = new Date("2026-11-08T08:00:00.000Z").getTime();
		expect(getCurrentPrayerName(mockPrayerData, t)).toBe("ASR");
	});

	it("mengembalikan MAGHRIB saat waktu Maghrib (18:00 WIB)", () => {
		const t = new Date("2026-11-08T11:00:00.000Z").getTime();
		expect(getCurrentPrayerName(mockPrayerData, t)).toBe("MAGHRIB");
	});

	it("mengembalikan ISHA saat waktu Isya malam hari (20:48 WIB)", () => {
		const t = new Date("2026-11-08T13:48:00.000Z").getTime();
		expect(getCurrentPrayerName(mockPrayerData, t)).toBe("ISHA");
	});
});

describe("computeSlotStatus", () => {
	it("menandai CURRENT pada shalat yang sedang berjalan di waktu Isya (20:48 WIB)", () => {
		const t = new Date("2026-11-08T13:48:00.000Z").getTime(); // 20:48 WIB
		const ishaData: TodayPrayerData = {
			...mockPrayerData,
			nextPrayer: {
				prayerName: "FAJR",
				displayName: "Subuh",
				scheduledAtUtc: "2026-11-08T20:53:00.000Z",
				time24: "03:53",
				timeLabel: "03:53",
				remainingSeconds: 25000,
				isTomorrow: true,
			},
		};

		// Isya harus berstatus CURRENT
		expect(
			computeSlotStatus({
				data: ishaData,
				currentServerTime: t,
				utcString: ishaData.times.ISHA.utc,
				prayerName: "ISHA",
			}),
		).toBe("CURRENT");

		// Shalat-shalat sebelumnya berstatus PASSED
		expect(
			computeSlotStatus({
				data: ishaData,
				currentServerTime: t,
				utcString: ishaData.times.FAJR.utc,
				prayerName: "FAJR",
			}),
		).toBe("PASSED");
		expect(
			computeSlotStatus({
				data: ishaData,
				currentServerTime: t,
				utcString: ishaData.times.MAGHRIB.utc,
				prayerName: "MAGHRIB",
			}),
		).toBe("PASSED");
	});

	it("menandai CURRENT pada Dzuhur dan NEXT pada Ashar di siang hari (12:30 WIB)", () => {
		const t = new Date("2026-11-08T05:30:00.000Z").getTime(); // 12:30 WIB
		const dhuhrData: TodayPrayerData = {
			...mockPrayerData,
			nextPrayer: {
				prayerName: "ASR",
				displayName: "Ashar",
				scheduledAtUtc: mockPrayerData.times.ASR.utc,
				time24: "14:44",
				timeLabel: "14:44",
				remainingSeconds: 7200,
				isTomorrow: false,
			},
		};

		// Dzuhur adalah CURRENT
		expect(
			computeSlotStatus({
				data: dhuhrData,
				currentServerTime: t,
				utcString: dhuhrData.times.DHUHR.utc,
				prayerName: "DHUHR",
			}),
		).toBe("CURRENT");

		// Ashar adalah NEXT
		expect(
			computeSlotStatus({
				data: dhuhrData,
				currentServerTime: t,
				utcString: dhuhrData.times.ASR.utc,
				prayerName: "ASR",
			}),
		).toBe("NEXT");

		// Subuh sudah PASSED
		expect(
			computeSlotStatus({
				data: dhuhrData,
				currentServerTime: t,
				utcString: dhuhrData.times.FAJR.utc,
				prayerName: "FAJR",
			}),
		).toBe("PASSED");

		// Maghrib masih UPCOMING
		expect(
			computeSlotStatus({
				data: dhuhrData,
				currentServerTime: t,
				utcString: dhuhrData.times.MAGHRIB.utc,
				prayerName: "MAGHRIB",
			}),
		).toBe("UPCOMING");
	});

	it("menandai NEXT pada Dzuhur saat jam dhuha (08:00 WIB) tanpa CURRENT", () => {
		const t = new Date("2026-11-08T01:00:00.000Z").getTime(); // 08:00 WIB

		expect(
			computeSlotStatus({
				data: mockPrayerData,
				currentServerTime: t,
				utcString: mockPrayerData.times.DHUHR.utc,
				prayerName: "DHUHR",
			}),
		).toBe("NEXT");

		expect(
			computeSlotStatus({
				data: mockPrayerData,
				currentServerTime: t,
				utcString: mockPrayerData.times.FAJR.utc,
				prayerName: "FAJR",
			}),
		).toBe("PASSED");
	});
});
