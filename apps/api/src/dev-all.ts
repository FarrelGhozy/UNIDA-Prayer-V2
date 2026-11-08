const children = new Set<ReturnType<typeof Bun.spawn>>();

function streamWithPrefix(
	stream: ReadableStream<Uint8Array> | null,
	label: string,
	isError: boolean,
): void {
	if (!stream) return;
	const reader = stream.getReader();
	const decoder = new TextDecoder();
	let buffer = "";
	const flush = (chunk: string, final: boolean): void => {
		buffer += chunk;
		const lines = buffer.split("\n");
		buffer = final ? "" : (lines.pop() ?? "");
		for (const line of lines) {
			if (line.length === 0) continue;
			const out = `[${label}] ${line}`;
			if (isError) console.error(out);
			else console.log(out);
		}
	}
	;
	(async () => {
		try {
			while (true) {
				const result = await reader.read();
				if (result.done) {
					if (buffer.length > 0) flush("", true);
					break;
				}
				flush(decoder.decode(result.value, { stream: true }), false);
			}
		} catch {
			try {
				reader.releaseLock();
			} catch {
				// stream sudah ditutup, abaikan
			}
		}
	})();
}

function spawnLabeled(label: string, args: string[]): ReturnType<typeof Bun.spawn> {
	const proc = Bun.spawn(args, {
		stdout: "pipe",
		stderr: "pipe",
	});
	children.add(proc);
	streamWithPrefix(proc.stdout, label, false);
	streamWithPrefix(proc.stderr, label, true);
	void proc.exited.then((code) => {
		children.delete(proc);
		if (code !== 0) {
			console.error(`[${label}] keluar dengan kode ${String(code)}`);
		}
		for (const other of children) {
			try {
				other.kill();
			} catch {
				// proses sudah berhenti, abaikan
			}
		}
		setTimeout(() => process.exit(code ?? 1), 300);
	});
	return proc;
}

let shuttingDown = false;

function shutdown(signal: string): void {
	if (shuttingDown) return;
	shuttingDown = true;
	console.log(`[dev-all] menerima ${signal}, menghentikan api+worker...`);
	for (const child of children) {
		try {
			child.kill();
		} catch {
			// proses sudah berhenti, abaikan
		}
	}
	setTimeout(() => process.exit(0), 500);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

spawnLabeled("api", ["bun", "run", "src/index.ts"]);
spawnLabeled("worker", ["bun", "run", "src/worker/index.ts"]);

console.log("[dev-all] api+worker berjalan dalam 1 log. Ctrl+C untuk berhenti.");
