<script lang="ts">
	import {
		User,
		ScrollText,
		Columns3,
		Upload,
		Bell,
		ChevronRight,
		Star,
		Palette,
		LogOut,
	} from "lucide-svelte";
	import { enhance } from "$app/forms";
	import { page } from "$app/stores";
	import { PUBLIC_DOCS_URL } from "$env/static/public";
	import { notificationsOpen } from "$lib/stores";
	import { Button } from "./ui/button";
	import * as DropdownMenu from "./ui/dropdown-menu";
	import { Separator } from "./ui/separator";

	let dropdownOpen = false;

	const groups = [
		[
			{
				label: "Profile",
				href: `/users/${$page.data.authUser?.id}`,
				icon: User,
			},
			{
				label: "Notifications",
				icon: Bell,
				onClick: (event: Event) => {
					event.preventDefault();

					dropdownOpen = false;
					$notificationsOpen = true;
				},
			},
			{
				label: "Upload emote",
				href: "/emotes/new",
				icon: Upload,
			},
			{
				label: "Oribt Plus",
				href: "/plus",
				icon: Star,
			},
		],
	];

	if ($page.data.authUser?.isTrusted) {
		groups.push([
			{
				label: "Queue",
				href: "/admin/queue",
				icon: Columns3,
			},
			{
				label: "Audit log",
				href: "/admin/audit-log",
				icon: ScrollText,
			},
			{
				label: "Color tool",
				href: "/admin/color-tool",
				icon: Palette,
			},
		]);
	}
</script>

<header class="absolute z-20 w-full">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="flex h-16 items-center justify-between md:h-20">
			<div class="mr-4 shrink-0">
				<a class="block" href="/" aria-label="Orbit">
					<img src="/img/logo.svg" alt="Orbit" width="38" height="38" />
				</a>
			</div>

			<nav class="flex grow flex-wrap items-center justify-end space-x-2">
				<Button class="text-current" href="/emotes" variant="link">Emotes</Button>
				<Button class="text-current" href="/sets" variant="link">Sets</Button>
				<Button class="text-current" href={PUBLIC_DOCS_URL} variant="link">Docs</Button>

				<Separator class="h-6" orientation="vertical" />

				{#if $page.data.authUser}
					{@const user = $page.data.authUser}

					<DropdownMenu.Root bind:open={dropdownOpen}>
						<DropdownMenu.Trigger asChild let:builder>
							<Button class="group text-current" builders={[builder]} variant="link">
								{user.username}

								<ChevronRight class="ml-2 transition-transform group-data-[state=open]:rotate-90" />
							</Button>
						</DropdownMenu.Trigger>

						<DropdownMenu.Content class="w-44 [&_a]:w-full">
							{#each groups as children}
								<DropdownMenu.Group>
									{#each children as child}
										<DropdownMenu.Item>
											<svelte:component this={child.icon} class="mr-2" />

											{#if child.href}
												<a href={child.href}>{child.label}</a>
											{:else}
												<button class="w-full text-left" type="button" on:click={child.onClick}>
													{child.label}
												</button>
											{/if}
										</DropdownMenu.Item>
									{/each}
								</DropdownMenu.Group>

								<DropdownMenu.Separator />
							{/each}

							<DropdownMenu.Item>
								<LogOut class="mr-2" />

								<form class="w-full" method="post" action="/logout" use:enhance>
									<button class="w-full text-left" type="submit">Log out</button>
								</form>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				{:else}
					<Button class="text-current" href="/login/twitch" variant="link">Log in</Button>
				{/if}
			</nav>
		</div>
	</div>
</header>
