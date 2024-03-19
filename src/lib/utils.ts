import { type ClassValue, clsx } from "clsx";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

interface FlyAndScaleParams {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
}

export function flyAndScale(
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 },
): TransitionConfig {
	const style = getComputedStyle(node);
	const transform = style.transform === "none" ? "" : style.transform;

	return {
		duration: params.duration ?? 200,
		delay: 0,
		easing: cubicOut,
		css(t) {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t,
			});
		},
	};
}

function scaleConversion(valueA: number, scaleA: [number, number], scaleB: [number, number]) {
	const [minA, maxA] = scaleA;
	const [minB, maxB] = scaleB;

	const percentage = (valueA - minA) / (maxA - minA);
	const valueB = percentage * (maxB - minB) + minB;

	return valueB;
}

function styleToString(style: Record<string, number | string>) {
	return Object.keys(style).reduce((str, key) => {
		return str + `${key}:${style[key]};`;
	}, "");
}

export function debounce<T extends (...args: never[]) => unknown>(fn: T, timeout: number) {
	let timeoutId: number | undefined;

	return (...args: Parameters<T>) => {
		window.clearTimeout(timeoutId);

		timeoutId = window.setTimeout(() => {
			fn(...args);
		}, timeout);
	};
}
