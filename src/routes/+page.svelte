<script lang="ts">
	import { DesktopClient, FeatureDriven, Hero, Install } from "$lib/components/home";
	import Particles from "$lib/components/Particles.svelte";
</script>

<svelte:head>
	<title>Orbit - Next generation Twitch enhancement</title>

	<meta
		name="description"
		content="A unified suite of user-friendly Twitch utilities delivering a consistent, reliable, and enjoyable experience that works anywhere."
	/>
</svelte:head>

<Hero />

<div class="relative mx-auto max-w-6xl px-4 sm:px-6">
	<div class="absolute inset-0 mx-auto max-w-6xl px-4 sm:px-6">
		<Particles class="absolute inset-0 -z-10" density={8} />
	</div>

	<div class="py-8 md:py-12"></div>
</div>

<Install />
<FeatureDriven />
<!-- <DesktopClient /> -->
