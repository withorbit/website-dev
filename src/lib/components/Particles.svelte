<script lang="ts">
	import { onMount } from "svelte";

	interface Circle {
		x: number;
		y: number;
		dx: number;
		dy: number;
		translateX: number;
		translateY: number;
		size: number;
		magnetism: number;
		alpha: [from: number, to: number];
	}

	let className: string;
	export { className as class };

	export let density = 30;
	export let speed = 50;
	export let easing = 50;

	let container: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D;

	let circles: Circle[] = [];
	let mouse = { x: 0, y: 0 };
	let { width, height } = { width: 0, height: 0 };
	let dpr = 1;

	const rand = () => Math.random();

	onMount(() => {
		context = canvas.getContext("2d")!;
		dpr = devicePixelRatio || 1;

		init();
		animate();
	});

	function init(): void {
		circles = [];

		width = container.offsetWidth;
		height = container.offsetHeight;

		canvas.width = width * dpr;
		canvas.height = height * dpr;
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;

		context.scale(dpr, dpr);
		context.clearRect(0, 0, width, height);

		for (let i = 0; i < density; i++) {
			draw(circle());
		}
	}

	function circle(): Circle {
		return {
			x: Math.floor(rand() * width),
			y: Math.floor(rand() * height),
			dx: (rand() - 0.5) * 0.2,
			dy: (rand() - 0.5) * 0.2,
			translateX: 0,
			translateY: 0,
			size: Math.floor(rand() * 2) + 1,
			magnetism: 0.1 + rand() * 4,
			alpha: [0, parseFloat((rand() * 0.6 + 0.1).toFixed(1))],
		};
	}

	function draw(circle: Circle, update = false): void {
		context.translate(circle.translateX, circle.translateY);

		context.beginPath();
		context.arc(circle.x, circle.y, circle.size, 0, 2 * Math.PI);

		context.fillStyle = `rgba(255, 255, 255, ${circle.alpha[0]})`;
		context.fill();

		context.setTransform(dpr, 0, 0, dpr, 0, 0);

		if (!update) {
			circles.push(circle);
		}
	}

	function animate() {
		context.clearRect(0, 0, width, height);

		for (let i = 0; i < circles.length; i++) {
			const current = circles[i];

			const edges = [
				current.x + current.translateX - current.size,
				width - current.x - current.translateX - current.size,
				current.y + current.translateY - current.size,
				height - current.y - current.translateY - current.size,
			];

			const closest = edges.reduce((a, b) => Math.min(a, b));
			const remapped = parseFloat(Math.max(0, closest / 20).toFixed(2));

			if (remapped > 1) {
				current.alpha[0] += 0.02;
				current.alpha[0] = Math.min(...current.alpha);
			} else {
				current.alpha[0] = current.alpha[1] * remapped;
			}

			current.x += current.dx;
			current.y += current.dy;
			current.translateX += (mouse.x / (speed / current.magnetism) - current.translateX) / easing;
			current.translateY += (mouse.y / (speed / current.magnetism) - current.translateY) / easing;

			if (
				current.x < -current.size ||
				current.x > width + current.size ||
				current.y < -current.size ||
				current.y > height + current.size
			) {
				circles.splice(i, 1);

				draw(circle());
			} else {
				draw(current, true);
			}
		}

		requestAnimationFrame(animate);
	}

	function onMouseMove(event: MouseEvent) {
		const rect = canvas.getBoundingClientRect();

		const x = event.clientX - rect.left - width / 2;
		const y = event.clientY - rect.top - height / 2;

		const isInside = x < width / 2 && x > -(width / 2) && y < height / 2 && y > -(height / 2);

		if (isInside) {
			mouse = { x, y };
		}
	}
</script>

<svelte:window on:mousemove={onMouseMove} on:resize={init} />

<div class={className} aria-hidden bind:this={container}>
	<canvas bind:this={canvas}></canvas>
</div>
