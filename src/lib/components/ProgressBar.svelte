<script lang="ts">
	import { linear } from "svelte/easing";
	import { fade } from "svelte/transition";
	import { navigating } from "$app/stores";
	import { busy } from "$lib/stores";

	let width = 0;
	let running = false;
	let spinner = false;
	let handle: number | undefined;
	let timeoutId: number | undefined;

	$: $busy ? start() : done();

	function start() {
		running = true;
		animate();
	}

	function done() {
		handle && cancelAnimationFrame(handle);
		width = 1;

		setTimeout(() => {
			width = 0;
			running = false;
			spinner = false;
		}, 500);
	}

	function animate() {
		running = true;

		let lastRequest = 0;

		function frame(time: number) {
			if (time - lastRequest < 700) {
				return (handle = requestAnimationFrame(frame));
			}

			lastRequest = time;

			if (width < 0.99) {
				width += increment(width) + [0, 0.005, 0.01, 0.02][(Math.random() * 4) | 0];
			}

			if (width > 0.99) {
				width = 0.99;
				handle && cancelAnimationFrame(handle);

				setTimeout(() => {
					spinner = true;
				}, 2000);
			}

			handle = requestAnimationFrame(frame);
		}

		handle = requestAnimationFrame(frame);
	}

	function increment(progress: number) {
		if (progress >= 0 && progress < 0.2) return 0.1;
		else if (progress >= 0.2 && progress < 0.5) return 0.04;
		else if (progress >= 0.5 && progress < 0.8) return 0.02;
		else if (progress >= 0.8 && progress < 0.99) return 0.005;

		return 0;
	}

	$: if ($navigating) {
		timeoutId = window.setTimeout(() => {
			$busy = true;
		}, 300);
	} else {
		clearTimeout(timeoutId);
		$busy = false;
	}
</script>

{#if running}
	<div transition:fade={{ duration: 300, easing: linear }}>
		<progress
			class="fixed left-0 top-0 z-[9999] h-0.5 appearance-none bg-primary transition-[width] duration-300"
			style:width="{width * 100}%"
		>
			<div class="absolute right-0 h-full w-24 -translate-y-1 translate-x-0 rotate-3"></div>
		</progress>

		<div
			class="fixed right-4 top-4 z-[9999] size-5 animate-spin rounded-full border-2 border-primary border-r-transparent {spinner
				? 'opacity-100'
				: 'opacity-0'} transition-opacity duration-300"
		></div>
	</div>
{/if}

<style>
	progress::-moz-progress-bar,
	progress::-webkit-progress-value {
		background: theme("colors.purple.500");
	}
</style>
