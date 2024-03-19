<script lang="ts">
	import Icon from "@iconify/svelte";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import type { EmoteSetValidator } from "$lib/schemas";
	import { PUBLIC_CDN_URL } from "$env/static/public";
	import { setEditOpen, setDeleteOpen } from "$lib/stores";
	import type { UserSet } from "$routes/users/[id=snowflake]/+page.svelte";
	import { Button } from "../ui/button";
	import Edit from "./EmoteSetEdit.svelte";
	import Delete from "./EmoteSetDelete.svelte";

	export let set: UserSet;
	// export let form: EmoteSetSchemaValidator;

	let setMenuOpen = false;

	// const setEmotes = [...set.emotes, ...set.origins.flatMap((o) => o.emotes)];

	async function deleteSet() {
		await fetch(`/sets/${set.id}`, { method: "DELETE" });

		// location.reload();
	}
</script>

<div class="flex w-full flex-col justify-between rounded-lg border bg-background p-4 shadow">
	<div class="flex w-full items-center justify-between">
		<div class="flex items-center">
			<a class="truncate text-lg font-semibold hover:underline" href="/sets/{set.id}">
				{set.name}
			</a>

			<div class="ml-2 text-sm font-medium">
				{set.emotes.length} <span class="text-muted-foreground">/ {set.capacity}</span>
			</div>
		</div>

		{#if set.name !== "Personal"}
			{@const isChannel = set.name === "Channel"}

			<DropdownMenu.Root bind:open={setMenuOpen}>
				<DropdownMenu.Trigger asChild let:builder>
					<Button class="size-7" builders={[builder]} size="icon" variant="ghost">
						<Icon icon="lucide:more-horizontal" />
					</Button>
				</DropdownMenu.Trigger>

				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Item>
							<button class="w-full text-left" on:click={() => ($setEditOpen = true)}>
								Edit
							</button>
						</DropdownMenu.Item>

						<DropdownMenu.Separator />

						<DropdownMenu.Item disabled={isChannel}>
							<button
								class="w-full text-left text-destructive"
								disabled={isChannel}
								aria-disabled={isChannel}
								on:click={() => {
									setMenuOpen = false;
									$setDeleteOpen = true;
								}}
							>
								Delete
							</button>
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{/if}
	</div>

	<div class="mt-3 grid max-w-max grid-cols-5 grid-rows-2 items-center gap-2">
		{#each set.emotes.slice(0, 10) as emote}
			<!-- todo: find a better way to display? -->
			<a class="flex size-7 flex-center" title={emote.name} href="/emotes/{emote.id}">
				<img
					src="{PUBLIC_CDN_URL}/emotes/{emote.id}/1x.webp"
					alt=""
					width={emote.width}
					height={emote.height}
				/>
			</a>
		{/each}

		{#if set.emotes.length < 10}
			{#each { length: 10 - set.emotes.length } as _}
				<span class="flex size-7 rounded border border-dashed border-slate-600 bg-slate-900/40">
				</span>
			{/each}
		{/if}
	</div>
</div>

<!-- <Edit {form} {set} /> -->
<Delete id={set.id} name={set.name} />
