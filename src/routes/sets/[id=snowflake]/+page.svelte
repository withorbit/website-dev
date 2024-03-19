<script lang="ts">
	import { X } from "lucide-svelte";
	import { tick } from "svelte";
	import { replaceState } from "$app/navigation";
	import { page } from "$app/stores";
	import { PUBLIC_BASE_URL } from "$env/static/public";
	import * as Emote from "$lib/components/emote";
	import { Button } from "$lib/components/ui/button";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { Separator } from "$lib/components/ui/separator";

	export let data;

	let selectedSort = "";

	const sortTypes = [
		{ label: "Newest", key: "new", order: "desc" },
		{ label: "Oldest", key: "new", order: "asc" },
		{ label: "Name (A-Z)", key: "name", order: "desc" },
		{ label: "Name (Z-A)", key: "name", order: "asc" },
	];

	const current = sortTypes.find((type) => type.key === data.query.sort);

	if (current) {
		selectedSort = `${current.key}-${sortTypes.indexOf(current)}`;
	}

	async function updateSort(value?: string) {
		if (!value) return;

		const [key, index] = value.split("-");

		$page.url.searchParams.set("sort", key);
		$page.url.searchParams.set("order", sortTypes[+index].order);

		await tick();
		replaceState($page.url, {});
	}

	async function removeEmote(id: string) {
		await fetch(`/sets/${data.set.id}`, {
			method: "DELETE",
			body: JSON.stringify({ id }),
		});
	}
</script>

<svelte:head>
	{#if data.set.name === "Personal"}
		<title>{data.set.user.username}'s Personal Emotes - Orbit</title>
	{:else if data.set.name === "Channel"}
		<title>{data.set.user.username}'s Channel Emotes - Orbit</title>
	{:else}
		<title>{data.set.name} by {data.set.user.username} - Orbit</title>
	{/if}

	<meta property="og:type" content="website" />
	<meta property="og:title" content="{data.set.name} by {data.set.user.username} - Orbit" />
	<meta property="og:url" content="{PUBLIC_BASE_URL}/sets/{data.set.id}" />
</svelte:head>

<div class="mx-auto flex max-w-7xl flex-col px-4 pb-24 pt-32 sm:px-6">
	<div class="flex w-full flex-col sm:items-start">
		<div class="flex items-center">
			<img class="mr-2 rounded-full" src={data.set.user.avatarUrl} alt="" width="28" height="28" />

			<a class="hover:underline" href="/users/{data.set.user.id}">
				<h2 class="text-lg font-medium">{data.set.user.username}</h2>
			</a>
		</div>

		<div class="mt-2 flex w-full flex-col justify-between sm:flex-row sm:items-end">
			<div class="flex items-center gap-x-4">
				<h1 class="text-4xl font-extrabold tracking-tight">{data.set.name}</h1>

				<Separator class="h-6" orientation="vertical" />

				<div class="text-xl font-semibold">
					{data.set.emotes.length}
					<span class="text-muted-foreground">/ {data.set.capacity}</span>
				</div>
			</div>

			<div class="mt-4 flex min-w-max flex-col text-center text-sm sm:mt-0 sm:text-right">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button class="whitespace-pre" builders={[builder]} variant="secondary">
							<span class="text-muted-foreground">Sort by:</span>
							{sortTypes[+selectedSort.slice(-1)].label}
						</Button>
					</DropdownMenu.Trigger>

					<DropdownMenu.Content class="w-40">
						<DropdownMenu.Group>
							<DropdownMenu.Label>Sort by</DropdownMenu.Label>

							<DropdownMenu.Separator />

							<DropdownMenu.RadioGroup onValueChange={updateSort} bind:value={selectedSort}>
								{#each sortTypes as sortType, i}
									<DropdownMenu.RadioItem value="{sortType.key}-{i}">
										{sortType.label}
									</DropdownMenu.RadioItem>
								{/each}
							</DropdownMenu.RadioGroup>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>

		{#if data.set.emotes.length}
			<div class="mt-8 grid w-full grid-cols-3 gap-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9">
				{#each data.set.emotes as emote}
					<div>
						<a
							class="group relative flex aspect-square rounded-lg border bg-background flex-center"
							href="/emotes/{emote.id}"
						>
							<Emote.Preview {emote} density={2} />

							{#if 1 || $page.data.authUser}
								<Button
									class="absolute -left-2 -top-2 size-6 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
									title="Remove emote"
									size="icon"
									variant="outline"
									on:click={() => removeEmote(emote.id)}
								>
									<X class="text-destructive" />
								</Button>
							{/if}
						</a>

						<div class="mt-2 text-center">
							<span class="mx-1 block truncate text-sm font-semibold">{emote.name}</span>

							<a
								class="mt-1 text-xs font-medium text-slate-300 hover:text-white"
								href="/users/{emote.user.id}"
							>
								{emote.user.username}
							</a>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="mx-auto mt-14 flex max-w-3xl flex-col gap-y-4 flex-center">
				<!-- todo: illustration -->
				<img class="rounded-3xl" src="/img/planet.png" alt="" width="256" height="256" />

				<span class="text-lg font-medium">This set has no emotes.</span>
				<Button href="/emotes">Browse emotes</Button>
			</div>
		{/if}
	</div>
</div>
