"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DynamicPrayerBackground } from "../components/landing/dynamic-prayer-background";
import { ErrorState } from "../components/landing/error-state";
import { Footer } from "../components/landing/footer";
import { Header } from "../components/landing/header";
import { NextPrayerHero } from "../components/landing/next-prayer-hero";
import { PrayerTimesGrid } from "../components/landing/prayer-times-grid";
import { SkeletonLoading } from "../components/landing/skeleton-loading";
import { ValidationNotice } from "../components/landing/validation-notice";
import { WeeklyPrayerTable } from "../components/landing/weekly-prayer-table";
import { WhatsappBanner } from "../components/landing/whatsapp-banner";
import { fetchApi } from "../lib/api-client";
import type {
	SlotStatus,
	TodayPrayerData,
	WeeklyPrayerDay,
	WeeklyPrayerResponse,
} from "../types/prayer";

export default function HomePage() {
	const [data, setData] = useState<TodayPrayerData | null>(null);
	const [weeklyDays, setWeeklyDays] = useState<WeeklyPrayerDay[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [refreshing, setRefreshing] = useState(false);

	const [serverSkewMs, setServerSkewMs] = useState(0);
	const [now, setNow] = useState<number | null>(null);

	const loadPrayerData = useCallback(async (isRefresh = false) => {
		if (isRefresh) {
			setRefreshing(true);
		} else {
			setLoading(true);
		}
		setError(null);

		const clientFetchStart = Date.now();
		const [resToday, resWeek] = await Promise.all([
			fetchApi<TodayPrayerData>("/api/public/prayer/today"),
			fetchApi<WeeklyPrayerResponse>("/api/public/prayer/week"),
		]);

		if (resToday.error || !resToday.data) {
			setError(
				resToday.error?.message ||
					"Jadwal shalat belum dapat dimuat dari server backend.",
			);
			setData(null);
		} else {
			const serverTime = new Date(resToday.data.serverNowUtc).getTime();
			const latency = (Date.now() - clientFetchStart) / 2;
			setServerSkewMs(serverTime + latency - Date.now());
			setData(resToday.data);
		}

		if (resWeek.data?.days) {
			setWeeklyDays(resWeek.data.days);
		}

		setLoading(false);
		setRefreshing(false);
	}, []);

	useEffect(() => {
		setNow(Date.now());
		loadPrayerData();
	}, [loadPrayerData]);

	useEffect(() => {
		const timer = setInterval(() => {
			setNow(Date.now());
		}, 1000);
		return () => clearInterval(timer);
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

	const theme: "light" | "dark" = isDaytime ? "light" : "dark";

	// Countdown auto-advance: jika waktu tiba (00), langsung muat waktu shalat berikutnya
	const nextPrayerUtc = data?.nextPrayer?.scheduledAtUtc;
	useEffect(() => {
		if (!now || !nextPrayerUtc) return;
		const targetUtc = new Date(nextPrayerUtc).getTime();
		const currentServerTime = now + serverSkewMs;
		if (currentServerTime >= targetUtc) {
			loadPrayerData(true);
		}
	}, [now, nextPrayerUtc, serverSkewMs, loadPrayerData]);

	const countdown = useMemo(() => {
		if (!now || !data?.nextPrayer?.scheduledAtUtc) return null;
		const targetUtc = new Date(data.nextPrayer.scheduledAtUtc).getTime();
		const currentServerTime = now + serverSkewMs;
		const diffSeconds = Math.max(0, Math.floor((targetUtc - currentServerTime) / 1000));

		const hours = Math.floor(diffSeconds / 3600);
		const minutes = Math.floor((diffSeconds % 3600) / 60);
		const seconds = diffSeconds % 60;

		return {
			hours: String(hours).padStart(2, "0"),
			minutes: String(minutes).padStart(2, "0"),
			seconds: String(seconds).padStart(2, "0"),
		};
	}, [data, now, serverSkewMs]);

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

	const getSlotStatus = useCallback(
		(utcString: string, prayerName: string): SlotStatus => {
			if (!now || !data) return "UPCOMING";
			const currentServerTime = now + serverSkewMs;
			const targetTime = new Date(utcString).getTime();

			if (data.nextPrayer.prayerName === prayerName && !data.nextPrayer.isTomorrow) {
				return "NEXT";
			}
			if (targetTime < currentServerTime) {
				return "PASSED";
			}
			return "UPCOMING";
		},
		[data, now, serverSkewMs],
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

							<WhatsappBanner />

							<ValidationNotice />
						</>
					)}
				</div>
			</main>

			<Footer />
		</div>
	);
}
