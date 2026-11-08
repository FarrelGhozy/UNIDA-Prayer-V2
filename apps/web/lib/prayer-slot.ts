import type { SlotStatus, TodayPrayerData } from "../types/prayer";

export type CurrentPrayerName = "FAJR" | "DHUHR" | "ASR" | "MAGHRIB" | "ISHA";

/**
 * Menentukan shalat fardhu yang sedang aktif berjalan pada saat ini.
 * - Subuh: sejak Fajr hingga Sunrise (Terbit)
 * - Dzuhur: sejak Dhuhr hingga Asr
 * - Ashar: sejak Asr hingga Maghrib
 * - Maghrib: sejak Maghrib hingga Isha
 * - Isya: sejak Isha hingga Subuh hari berikutnya
 * - Antara Terbit dan Dzuhur (dhuha): null (tidak ada shalat fardhu yang aktif)
 * - Sebelum Subuh hari ini: null pada grid jadwal hari ini
 */
export function getCurrentPrayerName(
	data: TodayPrayerData,
	currentServerTime: number,
): CurrentPrayerName | null {
	const tFajr = new Date(data.times.FAJR.utc).getTime();
	const tSunrise = new Date(data.times.SUNRISE.utc).getTime();
	const tDhuhr = new Date(data.times.DHUHR.utc).getTime();
	const tAsr = new Date(data.times.ASR.utc).getTime();
	const tMaghrib = new Date(data.times.MAGHRIB.utc).getTime();
	const tIsha = new Date(data.times.ISHA.utc).getTime();

	if (currentServerTime >= tIsha) {
		return "ISHA";
	}
	if (currentServerTime >= tMaghrib) {
		return "MAGHRIB";
	}
	if (currentServerTime >= tAsr) {
		return "ASR";
	}
	if (currentServerTime >= tDhuhr) {
		return "DHUHR";
	}
	if (currentServerTime >= tFajr && currentServerTime < tSunrise) {
		return "FAJR";
	}
	return null;
}

export interface ComputeSlotStatusParams {
	data: TodayPrayerData | null;
	currentServerTime: number | null;
	utcString: string;
	prayerName: string;
}

/**
 * Menghitung status kartu shalat (CURRENT, NEXT, PASSED, atau UPCOMING)
 */
export function computeSlotStatus(params: ComputeSlotStatusParams): SlotStatus {
	const { data, currentServerTime, utcString, prayerName } = params;
	if (!currentServerTime || !data) return "UPCOMING";

	const currentPrayer = getCurrentPrayerName(data, currentServerTime);
	if (currentPrayer === prayerName) {
		return "CURRENT";
	}

	// Tentukan shalat berikutnya pada hari ini secara berurutan
	let nextPrayerToday: string | null = null;
	if (currentPrayer === "FAJR") {
		nextPrayerToday = "DHUHR";
	} else if (currentPrayer === "DHUHR") {
		nextPrayerToday = "ASR";
	} else if (currentPrayer === "ASR") {
		nextPrayerToday = "MAGHRIB";
	} else if (currentPrayer === "MAGHRIB") {
		nextPrayerToday = "ISHA";
	} else if (currentPrayer === null) {
		const tFajr = new Date(data.times.FAJR.utc).getTime();
		const tDhuhr = new Date(data.times.DHUHR.utc).getTime();
		if (currentServerTime < tFajr) {
			nextPrayerToday = "FAJR";
		} else if (currentServerTime < tDhuhr) {
			nextPrayerToday = "DHUHR";
		}
	}

	if (nextPrayerToday && prayerName === nextPrayerToday) {
		return "NEXT";
	}

	// Fallback ke data.nextPrayer bila tidak besok
	if (data.nextPrayer.prayerName === prayerName && !data.nextPrayer.isTomorrow) {
		return "NEXT";
	}

	const targetTime = new Date(utcString).getTime();
	if (targetTime < currentServerTime) {
		return "PASSED";
	}

	return "UPCOMING";
}
