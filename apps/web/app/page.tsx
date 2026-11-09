"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DynamicPrayerBackground } from "../components/landing/dynamic-prayer-background";
import { ErrorState } from "../components/landing/error-state";
import { Footer } from "../components/landing/footer";
import { Header } from "../components/landing/header";
import { NextPrayerHero, type HeroPrayerDisplay } from "../components/landing/next-prayer-hero";
import { PrayerTimesGrid } from "../components/landing/prayer-times-grid";
import { RandomHadithCard } from "../components/landing/random-hadith-card";
import { SkeletonLoading } from "../components/landing/skeleton-loading";
import { ValidationNotice } from "../components/landing/validation-notice";
import { WeeklyPrayerTable } from "../components/landing/weekly-prayer-table";
import { WhatsappBanner } from "../components/landing/whatsapp-banner";
import { fetchApi } from "../lib/api-client";
import { computeSlotStatus } from "../lib/prayer-slot";
import type {
	SlotStatus,
	TodayPrayerData,
	WeeklyPrayerDay,
	WeeklyPrayerResponse,
} from "../types/prayer";

function getLocalDateString(timeMs: number, timeZone = "Asia/Jakarta"): string {
	try {
		return new Intl.DateTimeFormat("en-CA", {
			timeZone,
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		}).format(new Date(timeMs));
	} catch {
		const d = new Date(timeMs);
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
	}
}

export default function HomePage() {
	const [data, setData] = useState<TodayPrayerData | null>(null);
	const [weeklyDays, setWeeklyDays] = useState<WeeklyPrayerDay[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [refreshing, setRefreshing] = useState(false);

	const [serverSkewMs, setServerSkewMs] = useState(0);
	const [now, setNow] = useState<number | null>(null);

	const dataRef = useRef<TodayPrayerData | null>(null);
	const isFetchingRef = useRef<boolean>(false);
	const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const lastAdvanceKeyRef = useRef<string>("");

	const loadPrayerData = useCallback(async (isRefresh = false) => {
		if (isFetchingRef.current) return;
		isFetchingRef.current = true;

		if (isRefresh) {
			setRefreshing(true);
		} else {
			setLoading(true);
		}

		if (retryTimeoutRef.current) {
			clearTimeout(retryTimeoutRef.current);
			retryTimeoutRef.current = null;
		}

		try {
			const clientFetchStart = Date.now();
			const [resToday, resWeek] = await Promise.all([
				fetchApi<TodayPrayerData>("/api/public/prayer/today"),
				fetchApi<WeeklyPrayerResponse>("/api/public/prayer/week"),
			]);

			if (resToday.error || !resToday.data) {
				// Bila data belum pernah ada sama sekali, tampilkan error state
				if (!dataRef.current) {
					setError(
						resToday.error?.message ||
							"Jadwal shalat belum dapat dimuat dari server backend.",
					);
					setData(null);
				}
				// Stale-While-Revalidate: bila sebelumnya sudah ada data, jangan hapus data dari layar.
				// Jadwalkan auto-retry otomatis 10 detik kemudian agar display tidak macet.
				retryTimeoutRef.current = setTimeout(() => {
					loadPrayerData(true);
				}, 10000);
			} else {
				const serverTime = new Date(resToday.data.serverNowUtc).getTime();
				const latency = (Date.now() - clientFetchStart) / 2;
				setServerSkewMs(serverTime + latency - Date.now());
				setData(resToday.data);
				dataRef.current = resToday.data;
				setError(null);
			}

			if (resWeek.data?.days) {
				setWeeklyDays(resWeek.data.days);
			}
		} catch {
			if (!dataRef.current) {
				setError("Terjadi kendala saat menghubungi server.");
			}
			retryTimeoutRef.current = setTimeout(() => {
				loadPrayerData(true);
			}, 10000);
		} finally {
			setLoading(false);
			setRefreshing(false);
			isFetchingRef.current = false;
		}
	}, []);

	useEffect(() => {
		setNow(Date.now());
		loadPrayerData();

		return () => {
			if (retryTimeoutRef.current) {
				clearTimeout(retryTimeoutRef.current);
			}
		};
	}, [loadPrayerData]);

	useEffect(() => {
		const timer = setInterval(() => {
			setNow(Date.now());
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	// Sinkronisasi saat tab bangun dari mode tidur/hibernasi (visibility change / window focus)
	useEffect(() => {
		const handleVisibilityOrFocus = () => {
			if (document.visibilityState === "visible") {
				const current = Date.now();
				setNow(current);

				const currentData = dataRef.current;
				if (!currentData || isFetchingRef.current) return;

				const currentServerTime = current + serverSkewMs;
				const todayDateLocal = getLocalDateString(
					currentServerTime,
					currentData.timezone || "Asia/Jakarta",
				);
				const isDayChanged =
					currentData.dateLocal && todayDateLocal !== currentData.dateLocal;

				const nextPrayerUtc = currentData.nextPrayer?.scheduledAtUtc;
				const targetUtc = nextPrayerUtc
					? new Date(nextPrayerUtc).getTime()
					: null;
				const isPrayerTimeArrived =
					targetUtc !== null && currentServerTime >= targetUtc;

				if (isDayChanged || isPrayerTimeArrived) {
					loadPrayerData(true);
				}
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityOrFocus);
		window.addEventListener("focus", handleVisibilityOrFocus);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
			window.removeEventListener("focus", handleVisibilityOrFocus);
		};
	}, [serverSkewMs, loadPrayerData]);

	const [paramTheme, setParamTheme] = useState<"light" | "dark" | null>(null);
	const [paramPhase, setParamPhase] = useState<string | null>(null);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const searchParams = new URLSearchParams(window.location.search);
			const t = searchParams.get("theme")?.toLowerCase();
			if (t === "light" || t === "dark") {
				setParamTheme(t as "light" | "dark");
			}
			const p = searchParams.get("phase")?.toUpperCase();
			if (p) {
				setParamPhase(p);
			}
		}
	}, []);

	// Tema otomatis: Terbit s.d. Maghrib = Terang, di luar itu = Gelap
	const isDaytime = useMemo(() => {
		if (!now) return false;
		const currentTime = now + serverSkewMs;
		if (data?.times?.SUNRISE?.utc && data?.times?.MAGHRIB?.utc) {
			const tSunrise = new Date(data.times.SUNRISE.utc).getTime();
			const tMaghrib = new Date(data.times.MAGHRIB.utc).getTime();
			return currentTime >= tSunrise && currentTime < tMaghrib;
		}
		const hour = new Date(currentTime).getHours();
		return hour >= 5 && hour < 18;
	}, [data, now, serverSkewMs]);

	const theme: "light" | "dark" = paramTheme || (isDaytime ? "light" : "dark");

	// Evaluasi mode jeda Iqomah bila diaktifkan di sistem
	const iqamahWindow = useMemo(() => {
		if (!now || !data?.times || !data.iqamah?.enabled) return null;
		const currentServerTime = now + serverSkewMs;
		const fardOrder: Array<"ISHA" | "MAGHRIB" | "ASR" | "DHUHR" | "FAJR"> = [
			"ISHA",
			"MAGHRIB",
			"ASR",
			"DHUHR",
			"FAJR",
		];

		for (const prayerName of fardOrder) {
			const prayerSlot = data.times[prayerName];
			if (!prayerSlot?.utc) continue;
			const tAdzan = new Date(prayerSlot.utc).getTime();
			const intervalMinutes = data.iqamah.intervals[prayerName] ?? 10;
			const tIqamah = tAdzan + intervalMinutes * 60 * 1000;
			const tIqamahEnd = tIqamah + 30 * 1000; // 30 detik transisi saat Iqomah berkumandang

			if (currentServerTime >= tAdzan && currentServerTime < tIqamahEnd) {
				const isIqamahActive = currentServerTime >= tIqamah;
				return {
					prayerName,
					displayName: prayerSlot.displayName,
					timeLabel: prayerSlot.timeLabel,
					tAdzan,
					tIqamah,
					tIqamahEnd,
					isIqamahActive,
				};
			}
		}
		return null;
	}, [data, now, serverSkewMs]);

	// Auto-advance jadwal shalat & pergantian hari (Midnight 00:00:00 Rollover & Transisi Iqomah):
	// Memastikan halaman tetap akurat dan tidak stuck/freeze bila dibiarkan menyala berhari-hari.
	useEffect(() => {
		if (!now || !data) return;
		const currentServerTime = now + serverSkewMs;
		const todayDateLocal = getLocalDateString(
			currentServerTime,
			data.timezone || "Asia/Jakarta",
		);

		// 1. Deteksi pergantian hari kalender
		const isDayChanged = data.dateLocal && todayDateLocal !== data.dateLocal;

		// 2. Deteksi waktu shalat berikutnya tiba
		const nextPrayerUtc = data.nextPrayer?.scheduledAtUtc;
		const targetUtc = nextPrayerUtc
			? new Date(nextPrayerUtc).getTime()
			: null;
		const isPrayerTimeArrived =
			targetUtc !== null && currentServerTime >= targetUtc;

		// 3. Deteksi waktu transisi iqomah selesai (30 detik setelah iqomah)
		const isIqamahEnded =
			iqamahWindow !== null && currentServerTime >= iqamahWindow.tIqamahEnd;

		if (isDayChanged || isPrayerTimeArrived || isIqamahEnded) {
			const eventKey = `${todayDateLocal}:${nextPrayerUtc ?? ""}:${iqamahWindow?.prayerName ?? ""}:${isIqamahEnded}`;
			if (lastAdvanceKeyRef.current !== eventKey && !isFetchingRef.current) {
				lastAdvanceKeyRef.current = eventKey;
				loadPrayerData(true);
			}
		}
	}, [now, data, serverSkewMs, iqamahWindow, loadPrayerData]);

	const { heroDisplay, countdown } = useMemo(() => {
		if (!now || !data?.nextPrayer?.scheduledAtUtc) {
			return { heroDisplay: undefined, countdown: null };
		}
		const currentServerTime = now + serverSkewMs;

		if (iqamahWindow) {
			const isIqamahActive = iqamahWindow.isIqamahActive;
			const diffSeconds = isIqamahActive
				? 0
				: Math.max(0, Math.floor((iqamahWindow.tIqamah - currentServerTime) / 1000));

			const hours = Math.floor(diffSeconds / 3600);
			const minutes = Math.floor((diffSeconds % 3600) / 60);
			const seconds = diffSeconds % 60;

			const display: HeroPrayerDisplay = {
				displayName: iqamahWindow.displayName,
				timeLabel: iqamahWindow.timeLabel,
				isTomorrow: false,
				mode: isIqamahActive ? "IQAMAH_ACTIVE" : "IQAMAH_COUNTDOWN",
				countdownLabel: isIqamahActive ? "Waktu Iqomah Tiba" : "Menuju Kumandang Iqomah",
			};

			return {
				heroDisplay: display,
				countdown: {
					hours: String(hours).padStart(2, "0"),
					minutes: String(minutes).padStart(2, "0"),
					seconds: String(seconds).padStart(2, "0"),
				},
			};
		}

		const targetUtc = new Date(data.nextPrayer.scheduledAtUtc).getTime();
		const diffSeconds = Math.max(0, Math.floor((targetUtc - currentServerTime) / 1000));

		const hours = Math.floor(diffSeconds / 3600);
		const minutes = Math.floor((diffSeconds % 3600) / 60);
		const seconds = diffSeconds % 60;

		const display: HeroPrayerDisplay = {
			displayName: data.nextPrayer.displayName,
			timeLabel: data.nextPrayer.timeLabel,
			isTomorrow: data.nextPrayer.isTomorrow,
			mode: "BEFORE_ADHAN",
			countdownLabel: "Menuju Kumandang Adzan",
		};

		return {
			heroDisplay: display,
			countdown: {
				hours: String(hours).padStart(2, "0"),
				minutes: String(minutes).padStart(2, "0"),
				seconds: String(seconds).padStart(2, "0"),
			},
		};
	}, [data, now, serverSkewMs, iqamahWindow]);

	const liveTimeString = useMemo(() => {
		if (!now) return "--:--:--";
		const current = new Date(now + serverSkewMs);
		return current.toLocaleTimeString("id-ID", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
		});
	}, [now, serverSkewMs]);

	const gregorianDateFormatted = useMemo(() => {
		if (!data?.dateLocal) return "";
		const [year, month, day] = data.dateLocal.split("-").map(Number);
		if (!year || !month || !day) return "";
		const d = new Date(year, month - 1, day);
		return d.toLocaleDateString("id-ID", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	}, [data?.dateLocal]);

	const effectiveServerTime = useMemo(() => {
		if (paramPhase && data) {
			switch (paramPhase) {
				case "SUBUH":
					return new Date(data.times.FAJR.utc).getTime() + 60000;
				case "DZUHUR":
					return new Date(data.times.DHUHR.utc).getTime() + 60000;
				case "ASHAR":
					return new Date(data.times.ASR.utc).getTime() + 60000;
				case "MAGHRIB":
					return new Date(data.times.MAGHRIB.utc).getTime() + 60000;
				case "ISHA":
					return new Date(data.times.ISHA.utc).getTime() + 60000;
			}
		}
		return now !== null ? now + serverSkewMs : null;
	}, [data, now, paramPhase, serverSkewMs]);

	const getSlotStatus = useCallback(
		(utcString: string, prayerName: string): SlotStatus => {
			return computeSlotStatus({
				data,
				currentServerTime: effectiveServerTime,
				utcString,
				prayerName,
			});
		},
		[data, effectiveServerTime],
	);

	return (
		<div className={`relative flex min-h-screen flex-col transition-colors duration-700 bg-transparent ${theme === "dark" ? "dark text-white" : "text-[#172B43]"}`}>
			<DynamicPrayerBackground
				data={data}
				now={now}
				serverSkewMs={serverSkewMs}
				theme={theme}
			/>

			<div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
				<div
					className={`absolute -top-32 -right-32 h-[560px] w-[560px] rounded-full blur-[120px] transition-all duration-1000 ${
						theme === "dark"
							? "bg-blue-600/25 opacity-70"
							: "bg-sky-400/25 opacity-75"
					}`}
				/>
				<div
					className={`absolute top-1/2 -left-44 h-[600px] w-[600px] -translate-y-1/2 rounded-full blur-[130px] transition-all duration-1000 ${
						theme === "dark"
							? "bg-emerald-500/15 opacity-60"
							: "bg-teal-400/20 opacity-70"
					}`}
				/>
				<div
					className={`absolute -bottom-40 left-1/3 h-[520px] w-[520px] rounded-full blur-[120px] transition-all duration-1000 ${
						theme === "dark"
							? "bg-indigo-600/20 opacity-60"
							: "bg-blue-400/15 opacity-60"
					}`}
				/>
			</div>

			<Header liveTimeString={liveTimeString} theme={theme} />

			<main className="relative z-10 flex-1 px-4 py-6 sm:px-6 sm:py-8">
				<div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
					<h1 className="sr-only">
						UNIDA Prayer — Jadwal Shalat Kampus Siman & Pengingat WhatsApp
					</h1>
					{loading && <SkeletonLoading />}

					{error && !loading && (
						<ErrorState
							message={error}
							refreshing={refreshing}
							onRetry={() => loadPrayerData(true)}
						/>
					)}

					{data && !loading && !error && (
						<>
							<NextPrayerHero
								nextPrayer={data.nextPrayer}
								heroDisplay={heroDisplay}
								countdown={countdown}
								locationName={data.locationName ?? "UNIDA Gontor"}
								gregorianDateFormatted={gregorianDateFormatted}
								hijri={data.hijri}
							/>

							<PrayerTimesGrid
								data={data}
								refreshing={refreshing}
								onRefresh={() => loadPrayerData(true)}
								getSlotStatus={getSlotStatus}
							/>

							<WeeklyPrayerTable days={weeklyDays} loading={loading} />

							<RandomHadithCard hadith={data.randomHadith} />

							<WhatsappBanner status={data.whatsappStatus} />

							<ValidationNotice />
						</>
					)}
				</div>
			</main>

			<Footer />
		</div>
	);
}
