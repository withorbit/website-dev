<script lang="ts">
	import { onMount } from "svelte";

	let className: string;
	export { className as class };

	let card: HTMLDivElement;

	let mouse = { x: 0, y: 0 };
	let { width, height } = { width: 0, height: 0 };

	onMount(() => updateSize());

	function updateSize() {
		width = card.offsetWidth;
		height = card.offsetHeight;
	}

	function onMouseMove(event: MouseEvent): void {
		const rect = card.getBoundingClientRect();

		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		const isInside = x < width && x > 0 && y < height && y > 0;

		if (isInside) {
			mouse = { x, y };

			for (const child of card.children as Iterable<HTMLElement>) {
				const childRect = child.getBoundingClientRect();

				const x = -(childRect.left - rect.left) + mouse.x;
				const y = -(childRect.top - rect.top) + mouse.y;

				child.style.setProperty("--mouse-x", `${x}px`);
				child.style.setProperty("--mouse-y", `${y}px`);
			}
		}
	}
</script>

<svelte:window on:mousemove={onMouseMove} on:resize={updateSize} />

<div class={className} bind:this={card}>
	<slot />
</div>
