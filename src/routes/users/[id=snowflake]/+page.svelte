<script lang="ts" context="module">
	import type { PageData } from "./$types";

	export type UserSet = PageData["user"]["sets"][number];
</script>

<script lang="ts">
	import { ChevronLeft, ChevronRight, Unlink } from "lucide-svelte";
	import { toast } from "svelte-sonner";
	import Icon from "@iconify/svelte";
	import { PUBLIC_BASE_URL, PUBLIC_CDN_URL } from "$env/static/public";
	import * as Emote from "$lib/components/emote";
	import * as EmoteSet from "$lib/components/emote-set";
	import * as Avatar from "$lib/components/ui/avatar";
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import * as Pagination from "$lib/components/ui/pagination";
	import { Separator } from "$lib/components/ui/separator";
	import * as Tooltip from "$lib/components/ui/tooltip";
	import { Twitch, Discord } from "$lib/components/icons";
	import UserSelect from "$lib/components/UserSelect.svelte";
	import { ROLE_COLORS } from "$lib/constants";
	import badges from "$lib/data/badges.json";
	import { Snowflake } from "$lib/snowflake";
	import { userSelectOpen, setCreateOpen } from "$lib/stores";
	import { Provider } from "@prisma/client";

	export let data;

	const providers = {
		[Provider.Twitch]: {
			class: "bg-[#9147ff] hover:bg-[#772ce8]",
			icon: Twitch,
		},
		[Provider.Discord]: {
			class: "bg-[#5865F2]",
			icon: Discord,
		},
	};

	const previous = {
		badge: data.user.badgeId,
		color: data.user.color,
	};

	const selected = { ...previous };
	const joinDate = Snowflake.toDate(data.user.id);

	let editing = false;

	$: isSelf = data.authUser?.id === data.user.id;
	$: currentBadge = badges.find((b) => b.id === selected.badge);

	async function saveChanges() {
		editing = false;

		if (previous.badge === selected.badge && previous.color?.id === selected.color?.id) {
			return;
		}

		try {
			await fetch(`/users/${data.user.id}`, {
				method: "PATCH",
				body: JSON.stringify({
					userId: data.user.id,
					...selected,
				}),
			});

			previous.badge = selected.badge;
			previous.color = selected.color;

			toast.success("Profile saved successfully");
		} catch {
			toast.error("Failed to save profile");
		}
	}
</script>

<svelte:head>
	<title>{data.user.username} - Orbit</title>

	<meta property="og:type" content="profile" />
	<meta property="og:title" content="{data.user.username} - Orbit" />
	<meta property="og:image" content={data.user.avatarUrl} />
	<meta property="og:url" content="{PUBLIC_BASE_URL}/users/{data.user.id}" />
</svelte:head>

<div class="relative mx-auto max-w-[88rem] px-4 pb-24 pt-32 sm:px-6">
	<div
		class="pointer-events-none absolute -top-32 left-[40%] -z-10 -translate-x-1/2 opacity-50 blur-3xl md:block"
		aria-hidden="true"
	>
		<img class="max-w-none" src="/img/glows/user.png" alt="" width="1400" height="400" />
	</div>

	<div class="flex flex-col lg:flex-row">
		<div class="mx-auto flex max-w-xs flex-col items-center lg:max-w-min">
			<div class="flex flex-col items-center">
				<Avatar.Root class="size-52 md:size-64">
					<Avatar.Image src={data.user.avatarUrl} alt={data.user.username} />

					<Avatar.Fallback>
						<Icon class="size-12 md:size-24" icon="lucide:user" />
					</Avatar.Fallback>
				</Avatar.Root>

				<h1 class="mt-4 flex items-center text-2xl font-extrabold md:text-3xl">
					{#if selected.badge}
						<Tooltip.Root openDelay={100} closeDelay={0}>
							<Tooltip.Trigger>
								<img
									class="mr-2 size-6"
									src="{PUBLIC_CDN_URL}/badges/{selected.badge}/4x.png"
									alt=""
									decoding="async"
									loading="lazy"
								/>
							</Tooltip.Trigger>

							<Tooltip.Content class="bg-secondary">
								<p>{currentBadge?.description}</p>
							</Tooltip.Content>
						</Tooltip.Root>
					{/if}

					<span
						class="username"
						data-color={!!selected.color}
						style:--gradient={selected.color?.gradient}
						style:--shadow={selected.color?.shadow}
					>
						{data.user.username}
					</span>
				</h1>

				<div class="mt-1.5 text-sm text-muted-foreground">
					Joined
					<time class="font-medium text-foreground" datetime={joinDate.toISOString()}>
						{joinDate.format("LL")}
					</time>
				</div>

				{#if isSelf}
					{#if editing}
						<Button class="mt-4 w-full" on:click={saveChanges}>Save changes</Button>
					{:else}
						<Button class="mt-4 w-full" variant="secondary" on:click={() => (editing = true)}>
							Edit profile
						</Button>
					{/if}
				{:else}
					<!-- <Button></Button> -->
				{/if}
			</div>

			<div class="mt-4 w-full space-y-6">
				<div class="flex flex-col items-center lg:items-start">
					<span class="font-semibold">Roles</span>

					<div class="mt-2 flex flex-wrap justify-center gap-1.5 lg:[justify-content:normal]">
						{#each data.user.roles as role}
							<Badge variant="secondary">
								<div class="{ROLE_COLORS[role]} mr-1.5 size-2 rounded-full"></div>
								{role}
							</Badge>
						{:else}
							<span class="text-sm">None</span>
						{/each}
					</div>
				</div>

				<div class="flex flex-col items-center lg:items-start">
					<span class="font-semibold">Editors</span>

					<div class="mt-2 flex flex-wrap gap-2">
						{#each data.user.editors ?? [] as editor}
							<Tooltip.Root openDelay={100} closeDelay={0}>
								<Tooltip.Trigger>
									<a class="rounded-full" href="/users/{editor.id}" data-sveltekit-reload>
										<img
											class="rounded-full"
											src={editor.avatarUrl}
											alt=""
											width="28"
											height="28"
										/>
									</a>
								</Tooltip.Trigger>

								<Tooltip.Content class="bg-secondary">
									<span>{editor.username}</span>
								</Tooltip.Content>
							</Tooltip.Root>
						{:else}
							{#if !isSelf}
								<span class="text-sm">None</span>
							{/if}
						{/each}

						{#if isSelf}
							<Button
								class="size-8"
								size="icon"
								variant="secondary"
								on:click={() => ($userSelectOpen = true)}
							>
								<Icon class="size-3.5" icon="lucide:plus" />
							</Button>
						{/if}
					</div>
				</div>

				<div class="flex flex-col items-center lg:items-start">
					<span class="font-semibold">Connections</span>

					<div class="mt-2 flex w-full gap-2">
						{#each data.user.connections as connection}
							<div class="flex w-full gap-2">
								<Button
									class="relative flex-auto text-base {providers[connection.providerId].class}"
									href={connection.providerId === "Discord"
										? undefined
										: `https://twitch.tv/${connection.user.username}`}
									size="sm"
									variant="secondary"
								>
									<svelte:component
										this={providers[connection.providerId].icon}
										class="absolute left-0 ml-3 mr-2"
									/>

									<span class="text-sm">{connection.user.username}</span>
								</Button>

								<Button class="size-8" size="icon" variant="secondary">
									<Unlink />
								</Button>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<Separator class="my-8 lg:hidden" />

		<div class="flex w-full flex-col gap-y-8 lg:ml-16">
			{#if editing}
				<div class="space-y-4">
					<h2 class="text-xl font-semibold">Appearance</h2>

					<div>
						<h3 class="text-lg font-medium">Badge</h3>

						<ul class="mt-2 flex flex-wrap gap-4">
							<li class="group flex flex-col items-center" aria-current={!selected.badge}>
								<Button
									class="size-14 group-aria-[current=true]:border-green-700"
									size="icon"
									variant="outline"
									on:click={() => (selected.badge = null)}
								>
									<Icon class="size-8 text-muted-foreground" icon="lucide:ban" />
								</Button>

								<span class="mt-1.5 text-xs font-medium group-aria-[current=true]:text-green-600">
									None
								</span>
							</li>

							{#each badges as badge}
								<li
									class="group flex flex-col items-center"
									aria-current={selected.badge === badge.id}
								>
									<Button
										class="size-14 group-aria-[current=true]:border-green-700"
										size="icon"
										variant="outline"
										on:click={() => (selected.badge = badge.id)}
									>
										<img
											src="{PUBLIC_CDN_URL}/badges/{badge.id}/4x.png"
											alt={badge.description}
											width="72"
											height="72"
											decoding="async"
										/>
									</Button>

									<span
										class="mt-1.5 text-xs font-medium transition-colors group-aria-[current=true]:text-green-600"
									>
										{badge.name}
									</span>
								</li>
							{/each}
						</ul>
					</div>

					<div>
						<h3 class="text-lg font-medium">Color</h3>

						<ul class="mt-2 flex flex-wrap gap-1">
							<li class="group" aria-current={!selected.color}>
								<Button
									class="text-sm group-aria-[current=true]:border-green-700"
									size="sm"
									variant="outline"
									on:click={() => (selected.color = null)}
								>
									<span class="font-medium">None</span>
								</Button>
							</li>

							{#each data.colors as color}
								<li class="group" aria-current={selected.color?.id === color.id}>
									<Button
										class="text-sm group-aria-[current=true]:border-green-700"
										size="sm"
										variant="outline"
										on:click={() => (selected.color = color)}
									>
										<span
											class="bg-clip-text font-semibold text-transparent"
											style:background-image={color.gradient}
											style:filter={color.shadow}
										>
											{color.name}
										</span>
									</Button>
								</li>
							{/each}
						</ul>
					</div>
				</div>

				<Separator />
			{/if}

			<div class="w-full">
				<div class="mb-2.5 flex items-center">
					<h2 class="text-xl font-semibold">Emote sets</h2>

					{#if isSelf}
						<Button
							class="ml-2.5 h-6 px-2 py-0.5"
							size="sm"
							on:click={() => ($setCreateOpen = true)}
						>
							New set +
						</Button>
					{/if}
				</div>

				<div class="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
					{#each data.user.sets as set}
						<EmoteSet.Shelf {set} />
					{/each}
				</div>
			</div>

			<div class="w-full">
				<div class="mb-2.5 flex items-center">
					<h2 class="text-xl font-semibold">Emotes</h2>

					{#if isSelf}
						<Button class="ml-2.5 h-6 px-2 py-0.5" size="sm" href="/emotes/new">New emote +</Button>
					{/if}
				</div>

				{#if data.user.emotes.length}
					<div class="flex flex-col items-center">
						<div
							class="grid grid-cols-3 gap-x-2 gap-y-3.5 sm:grid-cols-5 md:grid-cols-7 xl:grid-cols-9"
						>
							{#each data.user.emotes.slice(0, 36) as emote}
								<div>
									<a
										class="flex aspect-square overflow-hidden rounded-lg border bg-background transition-colors flex-center hover:bg-border"
										title={emote.name}
										href="/emotes/{emote.id}"
									>
										<Emote.Preview {emote} density={2} />
									</a>

									<span class="mx-1 mt-2 block truncate text-center text-sm font-semibold">
										{emote.name}
									</span>
								</div>
							{/each}
						</div>

						<!-- todo -->
						{#if data.user.emotes.length > 36}
							<div class="mt-14">
								<Pagination.Root
									count={data.user.emotes.length}
									perPage={36}
									siblingCount={1}
									let:currentPage
									let:pages
								>
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
													<!-- {#key $page.url} -->
													<Pagination.Link isActive={currentPage === p.value} page={p}>
														{p.value}
													</Pagination.Link>
													<!-- {/key} -->
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
							</div>
						{/if}
					</div>
				{:else if isSelf}
					You haven't uploaded any emotes.
				{:else}
					This user doesn't have any public emotes.
				{/if}
			</div>
		</div>
	</div>
</div>

<EmoteSet.Create />
<UserSelect />
