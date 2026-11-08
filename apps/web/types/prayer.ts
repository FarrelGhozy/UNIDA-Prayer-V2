export interface FormattedPrayerTime {
	utc: string;
	time24: string;
	timeLabel: string;
	displayName: string;
}

export interface NextPrayerInfo {
	prayerName: string;
	displayName: string;
	scheduledAtUtc: string;
	time24: string;
	timeLabel: string;
	remainingSeconds: number;
	isTomorrow: boolean;
}

export interface HijriDateInfo {
	formatted: string;
	day: number;
	monthName: string;
	year: number;
	adjustmentDays: number;
}

export interface TodayPrayerData {
	locationName: string;
	timezone: string;
	coordinates: {
		latitude: number;
		longitude: number;
	};
	dateLocal: string;
	isFriday: boolean;
	hijri: HijriDateInfo;
	times: {
		FAJR: FormattedPrayerTime;
		SUNRISE: FormattedPrayerTime;
		DHUHR: FormattedPrayerTime;
		ASR: FormattedPrayerTime;
		MAGHRIB: FormattedPrayerTime;
		ISHA: FormattedPrayerTime;
	};
	nextPrayer: NextPrayerInfo;
	serverNowUtc: string;
}

export type SlotStatus = "PASSED" | "CURRENT" | "NEXT" | "UPCOMING";

export interface WeeklyPrayerDay {
	dateLocal: string;
	dayName: string;
	dayFormatted: string;
	isToday: boolean;
	isTomorrow?: boolean;
	isFriday: boolean;
	hijri: HijriDateInfo;
	times: {
		fajr: string;
		sunrise: string;
		dhuhr: string;
		asr: string;
		maghrib: string;
		isha: string;
	};
}

export interface WeeklyPrayerResponse {
	locationName: string;
	timezone: string;
	startDate: string;
	days: WeeklyPrayerDay[];
}
