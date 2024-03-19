<script lang="ts">
	import dayjs from "dayjs";
	import { Gift, Check } from "lucide-svelte";
	import { page } from "$app/stores";
	import { PUBLIC_STRIPE_URL } from "$env/static/public";
	import Particles from "$lib/components/Particles.svelte";
	import Spotlight from "$lib/components/Spotlight.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Snowflake } from "$lib/snowflake";

	$: subscription = $page.data.authUser?.subscription;

	const plans = [
		{
			name: "Free",
			description:
				"Modi dolorem expedita deleniti. Corporis iste qui inventore pariatur adipisci vitae.",
			price: 0,
			features: [
				"10 personal emotes",
				"5 MB uploads",
				"Lorem ipsum",
				"Lorem ipsum",
				//
			],
		},
		{
			name: "Plus",
			description:
				"Explicabo quo fugit vel facere ullam corrupti non dolores. Expedita eius sit sequi.",
			price: 5,
			features: [
				"25 personal emotes",
				"10 MB uploads",
				"Priority queue",
				"Username colors",
				"Subscriber badge",
			],
		},
	];
</script>

<svelte:head>
	<title>Plus - Orbit</title>
</svelte:head>

<div class="relative mx-auto max-w-7xl pb-24 pt-32">
	<div
		class="pointer-events-none absolute -top-24 left-1/2 -z-10 flex aspect-square w-[800px] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
		aria-hidden="true"
	>
		<div
			class="absolute inset-0 rounded-full bg-purple-500 opacity-30 blur-[120px] translate-z-0"
		></div>
		<div
			class="absolute size-64 rounded-full bg-purple-400 opacity-70 blur-[80px] translate-z-0"
		></div>
	</div>

	<Particles class="absolute inset-0 -z-10 h-96" density={20} />

	<div
		class="pointer-events-none absolute left-1/2 -z-10 -mt-40 -translate-x-1/2 opacity-90 blur-2xl md:block"
		aria-hidden="true"
	>
		<img src="/img/glows/pricing.svg" class="max-w-none" width="1440" height="430" alt="" />
	</div>

	<div class="px-4 sm:px-6">
		<div class="pb-10 text-center md:pb-16">
			<div
				class="inline-flex bg-gradient-to-r from-purple-500 to-purple-200 bg-clip-text pb-1 font-medium text-transparent"
			>
				Orbit Plus
			</div>

			<h1
				class="bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 bg-clip-text pb-4 text-5xl font-extrabold text-transparent"
			>
				Show your support
			</h1>

			<div class="mx-auto max-w-3xl">
				<p class="text-lg text-slate-300">
					Support the development of Orbit and unlock vanity features and increased limits. Lorem,
					ipsum dolor sit amet consectetur adipisicing elit.
				</p>
			</div>
		</div>

		<!-- todo: progress -->
		{#if subscription}
			{@const date = dayjs(Snowflake.toDate(subscription.id))}
			{@const days = date.diff(dayjs(), "days")}

			<div class="flex flex-col items-center gap-y-4 py-16">
				<div class="mt-1.5 text-sm text-slate-300">
					Subscribed
					<time class="font-medium text-slate-200" datetime={date.toISOString()}>
						{date.format("LL")}
					</time>
				</div>

				<div class="flex gap-x-6">
					<!-- badge 1 -->
					<progress value={days} aria-valuemin="-1" aria-valuenow={days} aria-valuemax="-1">
					</progress>
					<!-- badge 2 -->
				</div>
			</div>
		{/if}

		<div class="px-6 lg:px-8">
			<Spotlight class="group mx-auto grid max-w-md grid-cols-1 gap-8 md:max-w-4xl md:grid-cols-2">
				{#each plans as plan}
					<div class="card">
						<div
							class="relative z-20 flex h-full flex-col justify-between rounded-[inherit] bg-slate-900 p-8 sm:p-10"
						>
							<div
								class="pointer-events-none absolute bottom-0 left-1/2 -z-10 aspect-square w-1/2 -translate-x-1/2 translate-y-1/2"
								aria-hidden="true"
							>
								<div
									class="absolute inset-0 rounded-full bg-slate-800 blur-[80px] translate-z-0"
								></div>
							</div>

							<div>
								<h2 class="text-base/7">{plan.name}</h2>

								<div class="mt-4 flex items-baseline gap-x-2">
									<span class="text-4xl font-bold tracking-tight">${plan.price}</span>
									<span class="text-base/7 font-medium text-muted-foreground">/ month</span>
								</div>

								<p class="mt-4 text-base/7 text-slate-300">
									Explicabo quo fugit vel facere ullam corrupti non dolores. Expedita eius sit
									sequi.
								</p>

								<ul role="list" class="mt-8 space-y-4 text-sm/6">
									{#each plan.features as feature}
										<li class="flex items-center">
											<Check class="mr-2 text-primary" />
											{feature}
										</li>
									{/each}
								</ul>
							</div>

							{#if subscription}
								{#if plan.name === "Free"}
									<Button class="mt-8" href="" size="lg">Downgrade</Button>
								{:else}
									<Button class="mt-8" disabled size="lg">Active</Button>
								{/if}
							{:else if plan.name === "Free"}
								<Button class="mt-8" disabled size="lg">Active</Button>
							{:else}
								<Button class="mt-8" href={PUBLIC_STRIPE_URL} size="lg">Upgrade</Button>
							{/if}
						</div>
					</div>
				{/each}

				<!-- <div
					class="pointer-events-none absolute bottom-0 left-[60%] -translate-x-1/2 translate-y-[-80%] scale-125 opacity-70 blur-2xl max-md:hidden"
					aria-hidden="true"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="440" height="430">
						<defs>
							<linearGradient id="bs5-a" x1="20%" x2="50%" y1="15%" y2="100%">
								<stop offset="0%" stop-color="#A855F7" />
								<stop offset="100%" stop-color="#6366F1" stop-opacity="0" />
							</linearGradient>
						</defs>

						<path
							fill="url(#bs5-a)"
							fill-rule="evenodd"
							d="m661 736 461 369-284 58z"
							transform="matrix(1 0 0 -1 -660 1160)"
						/>
					</svg>
				</div> -->

				<div class="card md:col-span-2">
					<div
						class="relative z-20 flex flex-col items-start gap-x-8 gap-y-6 rounded-[inherit] bg-slate-900 p-8 shadow-md sm:gap-y-10 sm:p-10 lg:flex-row lg:items-center"
					>
						<div
							class="pointer-events-none absolute bottom-4 -z-10 aspect-square w-1/4 translate-y-1/2 md:-right-12"
							aria-hidden="true"
						>
							<div
								class="absolute inset-0 rounded-full bg-purple-700/70 blur-3xl translate-z-0"
							></div>
						</div>

						<div class="lg:min-w-0 lg:flex-1">
							<h2 class="text-lg/8">Gift a subscription</h2>

							<p class="mt-1 text-base leading-7 text-slate-300">
								Feeling generous? Gift a month subscription of Orbit Plus to a friend.
							</p>
						</div>

						<Button>
							Gift a sub <Gift class="ml-2" />
						</Button>
					</div>
				</div>
			</Spotlight>
		</div>
	</div>
</div>

<style>
	h2 {
		display: inline-flex;
		background-clip: text;
		background-image: linear-gradient(
			to right,
			theme("colors.primary.DEFAULT"),
			theme("colors.purple.200")
		);
		font-weight: 600;
		color: transparent;
	}
</style>
