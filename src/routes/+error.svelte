<script lang="ts">
	import { page } from "$app/stores";
</script>

<svelte:head>
	<title>{$page.status} - Orbit</title>
</svelte:head>

<!-- todo -->
<div class="text-center">
	<p class="text-base font-semibold text-purple-500">{$page.status}</p>
	<p class="mt-6 text-base/7 text-gray-500">
		{$page.error?.message}
	</p>
</div>
