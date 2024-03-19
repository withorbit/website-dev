<!-- TODO: blocking https://github.com/melt-ui/melt-ui/pull/547 -->

<script lang="ts">
	import Icon from "@iconify/svelte";
	import { page } from "$app/stores";
	import { PUBLIC_DOCS_URL } from "$env/static/public";
	import { busy } from "$lib/stores";

	interface ColorStop {
		hex: string;
		position: number;
	}

	interface DropShadow {
		x: number;
		y: number;
		blur?: number;
		hex: string;
	}

	let theme = "dark";
	let func = "linear-gradient";
	let direction = "";
	let angle: number | null = null;
	let shape = "circle";
	let position = "at center";

	let name = "";
	let gradient = "";
	let shadow = "";

	// can't `as const` in an each block
	const axes = ["x", "y"] as const;

	const functions = [
		"linear-gradient",
		"radial-gradient",
		"repeating-linear-gradient",
		"repeating-radial-gradient",
	];

	const directions = [
		"",
		"to left",
		"to right",
		"to top",
		"to top left",
		"to top right",
		"to bottom",
		"to bottom left",
		"to bottom right",
	];

	const positions = [
		"",
		"at center",
		...directions.slice(1).map((dir) => (dir ? dir.replace("to", "at") : "")),
	];

	const defaultStop = { hex: "ffffff", position: 100 };
	const defaultShadow = { x: 0, y: 0, blur: 0, hex: "000000" };

	let stops: ColorStop[] = [{ hex: "000000", position: 0 }, { ...defaultStop }];
	let shadows: DropShadow[] = [{ ...defaultShadow }];

	$: {
		const line = func.includes("linear")
			? angle
				? `${angle}deg`
				: direction || "to bottom"
			: `${shape} ${position}`;

		const colorStops = stops.map((stop) => `#${stop.hex} ${stop.position}%`).join(", ");

		gradient = `${func}(${line}, ${colorStops})`;
	}

	$: shadow = shadows.map((s) => `drop-shadow(${s.x}px ${s.y}px ${s.blur}px #${s.hex})`).join(" ");

	$: output = [
		`.${name.toLowerCase().replaceAll(" ", "-") || "new-color"} {`,
		`\tbackground-image: ${gradient};`,
		`\tfilter: ${shadow};`,
		"}",
	].join("\n");

	function addStop(index: number) {
		const half = (stops[index].position + stops[index + 1]?.position) / 2;

		stops.splice(index + 1, 0, {
			hex: "ffffff",
			position: half || 100,
		});

		stops = stops;
	}

	function addShadow(index: number) {
		shadows.splice(index + 1, 0, { ...defaultShadow });
		shadows = shadows;
	}

	async function submit() {
		$busy = true;

		await fetch("/admin/color-tool", {
			method: "POST",
			body: JSON.stringify({ name, gradient, shadow }),
		});

		$busy = false;
	}
</script>

<svelte:head>
	<title>Color tool - Orbit</title>
</svelte:head>

<div class="mx-auto mb-24 mt-32 max-w-6xl px-4 sm:mt-40 sm:px-6">
	<div class="max-w-prose">
		<h1 id="title" class="text-4xl font-extrabold">Color tool</h1>

		<p class="mt-2">
			The color tool allows you to create <a href="{PUBLIC_DOCS_URL}/colors" target="_blank"
				>colors</a
			>
			for Orbit Plus users. [...]
			<a href="{PUBLIC_DOCS_URL}/admin/color-tool" target="_blank">Read more</a>.
		</p>
	</div>

	<div class="mt-16 flex flex-col gap-x-6 lg:flex-row">
		<div class="flex w-full max-w-md flex-col space-y-4 xl:max-w-lg">
			<div class="h-64 w-full rounded-2xl" style:background-image={gradient}></div>

			<div
				class="group relative flex h-32 w-full rounded-2xl flex-center {theme === 'dark'
					? 'border border-gray-800 bg-[#18181b]'
					: 'bg-white'}"
			>
				<span
					class="bg-clip-text text-2xl font-semibold text-transparent"
					style:background-image={gradient}
					style:filter={shadow}
				>
					{$page.data.authUser?.username}
				</span>

				<button
					class="absolute bottom-4 right-4 rounded-md bg-slate-700 p-2 opacity-0 transition-opacity hover:bg-slate-600 group-hover:opacity-100"
					title="Toggle theme preview"
					type="button"
					on:click={() => {
						theme = theme === "dark" ? "light" : "dark";
					}}
				>
					<Icon icon={theme === "dark" ? "octicon:sun-16" : "octicon:moon-16"} />
				</button>
			</div>

			<div id="output" class="rounded-xl bg-slate-800 pb-1 pl-4 pt-4 font-medium">
				<pre class="overflow-auto pb-2"><code>{output}</code></pre>
			</div>
		</div>

		<div class="flex flex-col space-y-8">
			<div>
				<label for="name">Name</label>
				<input id="name" class="form-field max-w-sm" type="text" bind:value={name} />
			</div>

			<div class="flex max-w-sm flex-col">
				<span class="text-lg font-semibold">Gradient</span>

				<div class="mt-2 space-y-4">
					<div>
						<label for="function">Function</label>

						<select id="function" class="form-field" bind:value={func}>
							{#each functions as func}
								<option>{func}</option>
							{/each}
						</select>
					</div>

					<div class="flex items-center gap-x-3">
						{#if func.includes("linear")}
							<div>
								<label for="direction">Direction</label>

								<select
									id="direction"
									class="form-field disabled:cursor-not-allowed disabled:bg-slate-800"
									title="Direction"
									disabled={!!angle}
									bind:value={direction}
								>
									{#each directions as direction}
										<option>{direction}</option>
									{/each}
								</select>
							</div>

							<span class="mt-8 text-sm text-muted-foreground">or</span>

							<div>
								<label for="angle">Angle</label>

								<div class="relative">
									<input
										id="angle"
										class="form-field max-w-24 disabled:cursor-not-allowed disabled:bg-slate-800"
										title="Angle"
										type="text"
										disabled={!!direction}
										bind:value={angle}
									/>

									<span
										class="absolute inset-y-0 right-0 flex items-center pr-2 text-sm text-muted-foreground"
									>
										deg
									</span>
								</div>
							</div>
						{:else}
							<div>
								<label for="shape">Shape</label>

								<select id="shape" class="form-field" bind:value={shape}>
									<option>circle</option>
									<option>ellipse</option>
								</select>
							</div>

							<div>
								<label for="position">Position</label>

								<select id="position" class="form-field" title="Position" bind:value={position}>
									{#each positions as position}
										<option>{position}</option>
									{/each}
								</select>
							</div>
						{/if}
					</div>

					<div class="flex flex-col gap-y-2">
						<span class="text-sm/6 font-medium">Color stops</span>

						{#each stops as stop, i}
							<div class="flex items-center space-x-2">
								<div
									class="size-4 rounded-full ring-1 ring-inset ring-slate-600"
									style:background="#{stop.hex}"
								></div>

								<div
									class="flex rounded-md bg-slate-950 ring-1 ring-inset ring-slate-700 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-500"
								>
									<span class="flex select-none items-center pl-3 text-sm text-muted-foreground"
										>#</span
									>

									<input
										class="max-w-24 rounded-r-md border-0 bg-transparent pl-1.5 text-sm uppercase focus:ring-0"
										type="text"
										maxlength="8"
										bind:value={stop.hex}
										on:keyup={() => {
											stop.hex = stop.hex.replace(/^#/, "");
										}}
									/>
								</div>

								<div class="relative">
									<input
										class="form-field !mt-0 max-w-16"
										title="Position"
										type="text"
										maxlength="3"
										bind:value={stop.position}
									/>

									<span
										class="absolute inset-y-0 right-0 flex items-center pr-2 text-sm text-muted-foreground"
									>
										%
									</span>
								</div>

								<button
									class="btn-slate flex size-6 rounded flex-center"
									title="Add color after this stop"
									type="button"
									on:click={() => addStop(i)}
								>
									<Icon class="size-3" icon="heroicons:plus" />
								</button>

								<button
									class="btn-slate flex size-6 rounded text-red-500 flex-center disabled:cursor-not-allowed disabled:opacity-50 [&:not(:disabled)]:hover:bg-slate-600"
									title="Remove color"
									type="button"
									disabled={stops.length < 3}
									on:click={() => {
										stops.splice(i, 1);
										stops = stops;
									}}
								>
									<Icon class="size-3" icon="heroicons:minus" />
								</button>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="flex flex-col">
				<span class="text-lg font-semibold">Shadows</span>

				<ul class="mt-2 flex flex-col gap-y-2">
					{#each shadows as shadow, i}
						<li class="flex items-center gap-x-2">
							<div
								class="size-4 rounded-full ring-1 ring-inset ring-slate-600"
								style:background="#{shadow.hex}"
							></div>

							<div
								class="flex rounded-md bg-slate-950 ring-1 ring-inset ring-slate-700 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-500"
							>
								<span class="flex select-none items-center pl-3 text-sm text-muted-foreground"
									>#</span
								>

								<input
									class="max-w-24 rounded-r-md border-0 bg-transparent pl-1.5 text-sm uppercase focus:ring-0"
									type="text"
									maxlength="8"
									bind:value={shadow.hex}
									on:keyup={() => {
										shadow.hex = shadow.hex.replace(/^#/, "");
									}}
								/>
							</div>

							{#each axes as axis}
								<div
									class="relative flex rounded-md bg-slate-950 ring-1 ring-inset ring-slate-700 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-500"
								>
									<span
										class="flex select-none items-center pl-3 text-sm font-medium text-muted-foreground"
									>
										{axis.toUpperCase()}:
									</span>

									<input
										class="max-w-16 rounded-r-md border-0 bg-transparent pl-1.5 text-sm uppercase focus:ring-0"
										title="{axis === 'x' ? 'Horizontal' : 'Veritcal'} offset"
										type="text"
										bind:value={shadow[axis]}
									/>

									<span
										class="absolute inset-y-0 right-0 flex items-center pr-2 text-sm text-muted-foreground"
									>
										px
									</span>
								</div>
							{/each}

							<div class="relative">
								<input
									class="form-field !mt-0 max-w-16"
									title="Blur"
									type="text"
									bind:value={shadow.blur}
								/>

								<span
									class="absolute inset-y-0 right-0 flex items-center pr-2 text-sm text-muted-foreground"
								>
									px
								</span>
							</div>

							<button
								class="btn-slate flex size-6 rounded flex-center"
								title="Add shadow"
								type="button"
								on:click={() => addShadow(i)}
							>
								<Icon class="size-3" icon="heroicons:plus" />
							</button>

							<button
								class="btn-slate flex size-6 rounded text-red-500 flex-center disabled:cursor-not-allowed disabled:opacity-50"
								title="Remove shadow"
								type="button"
								disabled={shadows.length < 2}
								on:click={() => {
									shadows.splice(i, 1);
									shadows = shadows;
								}}
							>
								<Icon class="size-3" icon="heroicons:minus" />
							</button>
						</li>
					{/each}
				</ul>

				<button
					class="btn-purple mt-6 self-start rounded-md px-3 py-1.5 text-sm font-medium text-white"
					type="button"
					on:click={submit}
				>
					Submit
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	#title {
		color: transparent;
		background-clip: text;
		background-image: repeating-linear-gradient(
			to right,
			theme("colors.red.400"),
			theme("colors.orange.400"),
			theme("colors.yellow.400"),
			theme("colors.green.400"),
			theme("colors.blue.400"),
			theme("colors.indigo.400"),
			theme("colors.violet.400")
		);
		background-size: 300% 100%;
		animation: rainbow 15s ease-in-out infinite;
	}

	#output {
		scrollbar-width: thin;
		scrollbar-color: theme("colors.slate.600") transparent;
	}

	#output::-webkit-scrollbar {
		width: 8px;
	}

	#output::-webkit-scrollbar-thumb {
		background: theme("colors.slate.600");
	}

	#output::-webkit-scrollbar-track {
		background: transparent;
	}

	@keyframes rainbow {
		0%,
		100% {
			background-position: 0 0;
		}

		50% {
			background-position: 100% 0;
		}
	}
</style>
