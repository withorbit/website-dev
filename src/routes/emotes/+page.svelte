<script lang="ts" context="module">
	import type { PageData } from "./$types";

	export type TargetEmote = Omit<PageData["emotes"][number], "nsfw" | "_count">;
	export type SelectableSet = PageData["editableSets"][number];
</script>

<script lang="ts">
	import { ChevronLeft, ChevronRight, Filter, Plus, Search } from "lucide-svelte";
	import { onMount, tick } from "svelte";
	import { mediaQuery } from "svelte-legos";
	import { goto, replaceState } from "$app/navigation";
	import { page } from "$app/stores";
	import * as Emote from "$lib/components/emote";
	import * as EmoteSet from "$lib/components/emote-set";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import * as Pagination from "$lib/components/ui/pagination";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { setSelectOpen } from "$lib/stores";
	import { debounce } from "$lib/utils";

	export let data;

	let { query, sort, filter } = data.params;

	let mounted = false;
	let input: HTMLInputElement;
	let target: TargetEmote | null = null;
	let selectedSort = "";

	const sortTypes = [
		{ label: "Trending", key: "trending" },
		{ label: "Relevant", key: "rel" },
		{ label: "New", key: "new" },
		{ label: "Most used", key: "uses", order: "desc" },
		{ label: "Least used", key: "uses", order: "asc" },
	];

	const filters = [
		{ key: "ignore_tags", label: "Ignore tags", value: filter.ignoreTags },
		{ key: "animated", label: "Animated", value: filter.animated },
		{ key: "modifier", label: "Modifier", value: filter.modifier },
		{ key: "nsfw", label: "NSFW", value: filter.nsfw },
	];

	const isDesktop = mediaQuery("(min-width: 768px)");
	const current = sortTypes.find((type) => type.key === sort);

	if (current) {
		selectedSort = `${current.key}-${sortTypes.indexOf(current)}`;
	}

	$: count = Math.min(data.total, $isDesktop ? 3600 : 1600);
	$: perPage = $isDesktop ? 36 : 16;
	$: siblingCount = $isDesktop ? 1 : 0;
	$: ({ url } = $page);

	const debouncedSearch = debounce(updateQuery, 250);
	$: mounted && debouncedSearch(query);

	onMount(() => {
		mounted = true;

		return () => (mounted = false);
	});

	// todo: adjust
	function getRows() {
		const n = data.emotes.length;

		if (n > 0 && n <= 7) return "grid-rows-1";
		if (n > 7 && n <= 14) return "grid-rows-2";
		if (n > 14 && n <= 21) return "grid-rows-3";

		return "grid-rows-4";
	}

	async function onPageChange(page: number) {
		if (page !== data.params.page) {
			url.searchParams.set("page", page.toString());
			await refresh();
		}
	}

	async function updateQuery(query: string) {
		if (query === "") {
			url.searchParams.delete("q");
		} else {
			url.searchParams.set("q", query);
		}

		await refresh();

		const input = document.getElementById("search");
		input?.focus();
	}

	async function updateFilter(checked: boolean | string, key: string) {
		if (typeof checked === "string") return;

		if (checked) {
			url.searchParams.append("filter", key);
		} else {
			url.searchParams.delete("filter", key);
		}

		await refresh();
	}

	// todo: find a better way to do this
	async function updateSort(value?: string) {
		if (!value) return;

		const [key, index] = value.split("-");
		const order = sortTypes[+index].order;

		url.searchParams.set("sort", key);

		if (order) {
			url.searchParams.set("order", order);
		}

		await refresh();
	}

	async function refresh() {
		await tick();
		replaceState(url, {});
		await goto(url, { invalidateAll: true });
	}
</script>

<svelte:head>
	<title>Browse emotes - Orbit</title>
</svelte:head>

<div class="relative mx-auto mb-14 mt-40 max-w-7xl items-center px-4 sm:px-6">
	<div
		class="pointer-events-none absolute -top-52 left-1/2 -z-10 -translate-x-1/2 opacity-70 blur-2xl md:block"
		aria-hidden="true"
	>
		<img class="max-w-none" src="/img/glows/3.png" alt="" width="1500" height="400" />
	</div>

	<div class="flex w-full items-center justify-between">
		<search>
			<!-- todo: form comp -->
			<form id="search-emotes" class="flex items-center space-x-2">
				<div class="relative grow md:grow-0">
					<label
						class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
						for="search"
						aria-label="Search emotes"
					>
						<Search />
					</label>

					<Input
						id="search"
						class="min-w-64 pl-9"
						name="q"
						type="search"
						placeholder="Search emotes..."
						bind:value={query}
					/>
				</div>

				<DropdownMenu.Root closeOnItemClick={false}>
					<DropdownMenu.Trigger asChild let:builder>
						<Button builders={[builder]} size="icon" variant="secondary">
							<Filter />
						</Button>
					</DropdownMenu.Trigger>

					<DropdownMenu.Content class="w-44">
						<DropdownMenu.Group>
							<DropdownMenu.Label>Filters</DropdownMenu.Label>

							<DropdownMenu.Separator />

							{#each filters as filter}
								<DropdownMenu.CheckboxItem
									onCheckedChange={(checked) => updateFilter(checked, filter.key)}
									bind:checked={filter.value}
								>
									{filter.label}
								</DropdownMenu.CheckboxItem>
							{/each}
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>

				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button class="whitespace-pre" builders={[builder]} variant="secondary">
							<span class="text-muted-foreground">Sort by:</span>
							{sortTypes[+selectedSort.slice(-1)].label}
						</Button>
					</DropdownMenu.Trigger>

					<DropdownMenu.Content class="w-44">
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
			</form>
		</search>

		<Button href="/emotes/new">Upload emote</Button>
	</div>

	{#if data.emotes.length}
		<output
			class="my-14 grid grid-cols-3 gap-4 sm:grid-cols-5 md:grid-cols-7 md:gap-6 lg:grid-cols-9 {getRows()}"
			for="search {filters.map((f) => `filter-${f.key}`).join(' ')} sort"
			form="search-emotes"
		>
			{#each data.emotes as emote (emote.id)}
				<div>
					<a
						class="group relative flex aspect-square rounded-lg border bg-background flex-center hover:bg-border"
						href="/emotes/{emote.id}"
					>
						<Emote.Preview {emote} density={2} />

						{#if $page.data.authUser}
							<Button
								class="absolute -left-2 -top-2 size-6 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
								title="Add emote to set"
								size="icon"
								variant="outline"
								aria-label="Add emote to set"
								on:click={(event) => {
									event.preventDefault();

									target = emote;
									$setSelectOpen = true;
								}}
							>
								<Plus />
							</Button>
						{/if}
					</a>

					<div class="mt-2 text-center">
						<span class="mx-1 block truncate text-sm font-semibold">{emote.name}</span>

						<a
							class="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
							href="/users/{emote.user.id}"
						>
							{emote.user.username}
						</a>
					</div>
				</div>
			{/each}
		</output>
	{:else}
		<div class="mx-auto mb-28 mt-14 flex max-w-3xl flex-col gap-y-4 flex-center">
			<!-- todo: illustration -->
			<img class="rounded-3xl" src="/img/planet.png" alt="" width="256" height="256" />
			<span class="text-lg font-medium">Your search returned no results.</span>
		</div>
	{/if}

	{#if data.emotes.length}
		<Pagination.Root {count} {perPage} {siblingCount} {onPageChange} let:currentPage let:pages>
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.PrevButton>
						<ChevronLeft />
						<span class="hidden sm:block">Previous</span>
					</Pagination.PrevButton>
				</Pagination.Item>

				{#each pages as p (p.key)}
					{#if p.type === "ellipsis"}
						<Pagination.Item>
							<Pagination.Ellipsis class="text-muted-foreground" />
						</Pagination.Item>
					{:else}
						<Pagination.Item>
							{#key $page.url}
								<Pagination.Link isActive={currentPage === p.value} page={p}>
									{p.value}
								</Pagination.Link>
							{/key}
						</Pagination.Item>
					{/if}
				{/each}

				<Pagination.Item>
					<Pagination.NextButton>
						<span class="hidden sm:block">Next</span>
						<ChevronRight />
					</Pagination.NextButton>
				</Pagination.Item>
			</Pagination.Content>
		</Pagination.Root>
	{/if}
</div>

{#if target}
	<EmoteSet.Select emote={target} sets={data.editableSets} />
{/if}
