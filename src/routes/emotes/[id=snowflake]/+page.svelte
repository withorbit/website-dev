<script lang="ts" context="module">
	import type { PageData } from "./$types";

	export type FullEmote = PageData["emote"];
</script>

<script lang="ts">
	import { MessageSquare, Activity, History } from "lucide-svelte";
	import { PUBLIC_BASE_URL, PUBLIC_CDN_URL } from "$env/static/public";
	import * as Emote from "$lib/components/emote";
	import * as EmoteSet from "$lib/components/emote-set";
	import { Badge } from "$lib/components/ui/badge";
	import { Separator } from "$lib/components/ui/separator";
	import * as Tabs from "$lib/components/ui/tabs";

	export let data;

	const tabs = [
		{ label: "Playground", icon: MessageSquare, component: Emote.Playground },
		{ label: "Activity", icon: Activity, component: Emote.Activity },
		{ label: "Versions", icon: History, component: Emote.Versions },
	];

	const imageUrl = `${PUBLIC_CDN_URL}/emotes/${data.emote.id}/4x.webp`;

	$: channelCount = data.emote.sets.filter((set) => set.name === "Channel").length;
	$: setCount = data.emote.sets.filter((set) => set.name !== "Channel").length;
</script>

<svelte:head>
	<title>{data.emote.name} by {data.emote.user.username} - Orbit</title>

	<meta property="og:type" content="website" />
	<meta property="og:title" content="{data.emote.name} - Orbit" />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:url" content="{PUBLIC_BASE_URL}/emotes/{data.emote.id}" />
</svelte:head>

<div class="mx-auto flex max-w-7xl flex-col px-4 pb-24 pt-32 sm:px-6">
	<div class="relative flex flex-col items-center">
		<div
			class="pointer-events-none absolute -top-52 left-1/2 -z-10 -translate-x-1/2 opacity-70 blur-2xl md:block"
			aria-hidden="true"
		>
			<img class="max-w-none" src="/img/glows/3.png" alt="" width="1500" height="400" />
		</div>

		<div class="flex flex-col">
			<div class="flex w-full flex-col items-center sm:items-start">
				<div class="flex items-center">
					<img
						class="mr-2 rounded-full"
						src={data.emote.user.avatarUrl}
						alt=""
						width="28"
						height="28"
					/>

					<a class="hover:underline" href="/users/{data.emote.user.id}">
						<h2 class="text-lg font-medium">{data.emote.user.username}</h2>
					</a>
				</div>

				<div
					class="mt-2 flex w-full flex-col items-center justify-between sm:flex-row sm:items-end"
				>
					<h1 class="max-w-sm truncate text-4xl font-extrabold sm:max-w-md" title={data.emote.name}>
						{data.emote.name}
					</h1>

					<div class="mt-4 flex min-w-max flex-col text-center text-sm sm:mt-0 sm:text-right">
						<span class="font-medium text-muted-foreground">
							In <span class="font-bold text-foreground">{channelCount}</span> channels
						</span>

						<span class="font-medium text-muted-foreground">
							In <span class="font-bold text-foreground">{setCount}</span> emote sets
						</span>
					</div>
				</div>
			</div>

			<div class="mb-8 mt-6 flex flex-col justify-center gap-6 sm:flex-row">
				{#each [1, 2, 4] as density}
					<div class="flex flex-col flex-center">
						<div class="flex aspect-square h-44 rounded-lg border bg-background flex-center">
							<Emote.Preview emote={data.emote} {density} lazy={false} />
						</div>

						<span class="mt-2 text-sm font-medium">
							{data.emote.width * density} x {data.emote.height * density}
						</span>
					</div>
				{/each}
			</div>
		</div>

		{#if data.emote.tags.length}
			<ul class="flex max-w-3xl flex-wrap justify-center gap-1.5">
				{#each data.emote.tags as tag}
					<li>
						<Badge variant="secondary">#{tag}</Badge>
					</li>
				{/each}
			</ul>
		{/if}

		<Emote.Toolbar emote={data.emote} />
	</div>

	<Separator class="mb-6 mt-2" />

	<Tabs.Root class="mx-auto w-full" value="Playground">
		<Tabs.List class="w-full">
			{#each tabs as tab}
				<Tabs.Trigger class="flex w-full items-center gap-x-2" value={tab.label}>
					<svelte:component this={tab.icon} />
					{tab.label}
				</Tabs.Trigger>
			{/each}
		</Tabs.List>

		{#each tabs as tab}
			<Tabs.Content value={tab.label}>
				<svelte:component this={tab.component} emote={data.emote} />
			</Tabs.Content>
		{/each}
	</Tabs.Root>
</div>

<EmoteSet.Select emote={data.emote} sets={data.editableSets} />

<Emote.Report emote={data.emote} />
<Emote.Delete emote={data.emote} />
