"use client";

import { BookOpen, Quote } from "lucide-react";
import type { RandomHadithData } from "../../types/prayer";

interface RandomHadithCardProps {
	hadith?: RandomHadithData | null;
}

export function RandomHadithCard({ hadith }: RandomHadithCardProps) {
	if (!hadith || !hadith.text) {
		return null;
	}

	const isQuranVerse =
		hadith.source.toUpperCase().startsWith("QS.") ||
		hadith.source.toUpperCase().startsWith("QS ");

	return (
		<div className="relative overflow-hidden rounded-3xl glass-panel glass-sheen p-6 sm:p-7 shadow-[0_10px_35px_rgba(29,95,167,0.06)] dark:shadow-[0_15px_35px_rgba(56,189,248,0.1)] transition-all">
			<div className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full bg-blue-500/10 dark:bg-sky-400/10 blur-2xl" />

			<div className="relative z-10 flex flex-col gap-4">
				<div className="flex items-center justify-between border-b border-slate-200/50 dark:border-white/10 pb-3">
					<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1D5FA7] dark:text-[#6BA9D8]">
						<BookOpen className="h-4 w-4" />
						<span>{isQuranVerse ? "Kutipan Ayat Pilihan Hari Ini" : "Kutipan Hadits Pilihan Hari Ini"}</span>
					</div>
					<Quote className="h-5 w-5 text-slate-300 dark:text-slate-600 rotate-180 opacity-60" />
				</div>

				<div className="space-y-3">
					<p className="font-serif font-['Times_New_Roman',Georgia,Cambria,serif] text-sm sm:text-base leading-relaxed text-[#102A46] dark:text-slate-100 italic">
						&ldquo;{hadith.text}&rdquo;
					</p>

					<div className="flex items-center justify-end">
						<span className="inline-flex items-center rounded-xl border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-[#1D5FA7] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] backdrop-blur-md dark:border-sky-400/20 dark:bg-sky-500/15 dark:text-[#6BA9D8] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
							{hadith.source}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
