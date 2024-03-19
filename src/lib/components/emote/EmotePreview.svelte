<script lang="ts">
	import type { Emote } from "@prisma/client";
	import { PUBLIC_CDN_URL } from "$env/static/public";

	export let emote: Partial<Emote>;
	export let density = 1;
	export let lazy = true;

	let className = "";
	export { className as class };

	const srcBase = `${PUBLIC_CDN_URL}/emotes/${emote.id}`;
</script>

<img
	class={className}
	src="{srcBase}/{density}x.webp"
	alt={emote.name}
	width={(emote.width ?? 1) * density}
	height={(emote.height ?? 1) * density}
	decoding="async"
	loading={lazy ? "lazy" : "eager"}
/>
