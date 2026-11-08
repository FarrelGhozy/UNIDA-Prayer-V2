export function SkeletonLoading() {
	return (
		<div className="space-y-6">
			<div className="h-64 w-full animate-pulse rounded-3xl glass-panel p-8">
				<div className="h-6 w-36 rounded-md bg-slate-300/60 dark:bg-slate-700/60" />
				<div className="mt-4 h-12 w-64 rounded-lg bg-slate-300/60 dark:bg-slate-700/60" />
				<div className="mt-6 h-16 w-full rounded-xl bg-slate-200/50 dark:bg-slate-800/50" />
			</div>
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
				{[...Array(6)].map((_, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton elements
						key={i}
						className="h-36 animate-pulse rounded-2xl glass-panel p-4"
					>
						<div className="h-8 w-8 rounded-lg bg-slate-300/60 dark:bg-slate-700/60" />
						<div className="mt-4 h-4 w-16 rounded bg-slate-300/60 dark:bg-slate-700/60" />
						<div className="mt-2 h-6 w-20 rounded bg-slate-200/50 dark:bg-slate-800/50" />
					</div>
				))}
			</div>
		</div>
	);
}
