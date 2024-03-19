<script lang="ts">
	export let data;

	const date = `${data.meta.updatedAt}T00:00`;
	const updatedAt = new Date(date).toLocaleDateString("en-US", {
		dateStyle: "long",
	});
</script>

<svelte:head>
	<title>{data.meta.title} - Orbit</title>
</svelte:head>

<div class="mx-auto my-24 max-w-3xl">
	<article class="prose prose-slate !prose-invert mx-auto max-w-none">
		<div class="mb-20 text-center">
			<h1 class="mb-2 text-5xl">{data.meta.title}</h1>
			<p class="text-lg font-medium">Last updated on {updatedAt}</p>
		</div>

		<svelte:component this={data.content} />
	</article>
</div>
