<script lang="ts">
	import { Puzzle } from "lucide-svelte";
	import { Chrome, Safari, Edge, Firefox, Opera } from "../icons";
	import Button from "../ui/button/button.svelte";
	import Particles from "../Particles.svelte";

	const browsers = [
		{ icon: Chrome, name: "Chrome" },
		{ icon: Safari, name: "Safari" },
		{ icon: Edge, name: "Edge" },
		{ icon: Firefox, name: "Firefox" },
		{ icon: Opera, name: "Opera" },
	];
</script>

<section id="install" class="relative mx-auto max-w-6xl px-4 pb-16 sm:px-6">
	<div
		class="pointer-events-none absolute inset-0 -z-10 -mx-28 overflow-hidden rounded-t-[3rem]"
		aria-hidden="true"
	>
		<div class="absolute left-1/2 top-0 -z-10 -translate-x-1/2">
			<img class="max-w-none" src="/img/glows/hero-top.png" alt="" width="1400" height="660" />
		</div>
	</div>

	<div class="pb-12 pt-16 md:pb-20 md:pt-52">
		<div
			class="mx-auto flex max-w-xl flex-col space-y-8 space-y-reverse md:max-w-none md:flex-row md:items-center md:space-x-8 md:space-y-0 lg:space-x-16 xl:space-x-20"
		>
			<div class="order-1 max-md:text-center md:order-none md:w-7/12 lg:w-1/2">
				<h2
					class="inline-flex bg-gradient-to-r from-purple-500 to-purple-200 bg-clip-text pb-3 font-medium text-transparent"
				>
					Install
				</h2>

				<p
					class="bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 bg-clip-text pb-3 text-3xl font-extrabold text-transparent md:text-4xl"
				>
					Use now in your favorite browser.
				</p>

				<p class="mb-4 text-lg text-muted-foreground">
					Ea et sunt ipsum dolor velit labore veniam quis excepteur fugiat laborum anim non magna.
				</p>

				<div class="flex max-w-xs justify-center space-x-2 max-md:mx-auto md:justify-normal">
					{#each browsers as browser}
						<Button
							title={browser.name}
							class="group size-12"
							variant="outline"
							aria-label={browser.name}
						>
							<svelte:component
								this={browser.icon}
								class="size-6 shrink-0 text-muted-foreground transition-colors group-hover:text-secondary-foreground"
							/>
						</Button>
					{/each}
				</div>
			</div>

			<div class="md:w-5/12 lg:w-1/2">
				<div class="relative -mt-12 py-24">
					<Particles class="absolute inset-0 -z-10" density={10} speed={30} />

					<div class="flex flex-center">
						<div class="relative flex size-48 flex-center">
							<svg
								class="pointer-events-none absolute inset-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform blur-md will-change-transform"
								width="480"
								height="480"
								viewBox="0 0 480 480"
								xmlns="http://www.w3.org/2000/svg"
							>
								<defs>
									<linearGradient id="pulse-a" x1="50%" x2="50%" y1="100%" y2="0%">
										<stop offset="0%" stop-color="#A855F7" />
										<stop offset="76.382%" stop-color="#FAF5FF" />
										<stop offset="100%" stop-color="#6366F1" />
									</linearGradient>
								</defs>

								<g fill-rule="evenodd">
									<path
										class="pulse"
										d="M240,0 C372.5484,0 480,107.4516 480,240 C480,372.5484 372.5484,480 240,480 C107.4516,480 0,372.5484 0,240 C0,107.4516 107.4516,0 240,0 Z M240,88.8 C156.4944,88.8 88.8,156.4944 88.8,240 C88.8,323.5056 156.4944,391.2 240,391.2 C323.5056,391.2 391.2,323.5056 391.2,240 C391.2,156.4944 323.5056,88.8 240,88.8 Z"
										fill="url(#pulse-a)"
										fill-rule="evenodd"
									></path>
									<path
										class="pulse ![animation-delay:-4000ms]"
										d="M240,0 C372.5484,0 480,107.4516 480,240 C480,372.5484 372.5484,480 240,480 C107.4516,480 0,372.5484 0,240 C0,107.4516 107.4516,0 240,0 Z M240,88.8 C156.4944,88.8 88.8,156.4944 88.8,240 C88.8,323.5056 156.4944,391.2 240,391.2 C323.5056,391.2 391.2,323.5056 391.2,240 C391.2,156.4944 323.5056,88.8 240,88.8 Z"
										fill="url(#pulse-a)"
										fill-rule="evenodd"
									></path>
									<path
										class="pulse ![animation-delay:-8000ms]"
										d="M240,0 C372.5484,0 480,107.4516 480,240 C480,372.5484 372.5484,480 240,480 C107.4516,480 0,372.5484 0,240 C0,107.4516 107.4516,0 240,0 Z M240,88.8 C156.4944,88.8 88.8,156.4944 88.8,240 C88.8,323.5056 156.4944,391.2 240,391.2 C323.5056,391.2 391.2,323.5056 391.2,240 C391.2,156.4944 323.5056,88.8 240,88.8 Z"
										fill="url(#pulse-a)"
										fill-rule="evenodd"
									></path>
								</g>
							</svg>

							<div
								id="grid"
								class="pointer-events-none absolute inset-0 left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 transform overflow-hidden rounded-full"
							>
								<div class="h-[200%]">
									<span class="absolute inset-0"></span>
									<span class="absolute inset-0"></span>
								</div>
							</div>

							<div class="absolute">
								<div
									class="icon relative flex size-16 -rotate-[15deg] rounded-2xl border border-transparent shadow-2xl flex-center before:absolute before:inset-0 before:rounded-2xl before:bg-slate-800/30"
								>
									<Puzzle class="relative !size-5 text-foreground" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	#grid {
		mask-image: radial-gradient(#000, transparent 60%);
	}

	#grid > div {
		animation: elevator 20s linear infinite;
	}

	#grid span:first-child {
		background: repeating-linear-gradient(
			transparent,
			transparent 48px,
			theme("colors.purple.500") 48px,
			theme("colors.purple.500") 49px
		);
	}

	#grid span:last-child {
		background: repeating-linear-gradient(
			90deg,
			transparent,
			transparent 48px,
			theme("colors.purple.500") 48px,
			theme("colors.purple.500") 49px
		);
	}

	.pulse {
		opacity: 0;
		transform-origin: center;
		animation: pulse 12000ms linear infinite;
	}

	.icon {
		background:
			linear-gradient(theme("colors.slate.900"), theme("colors.slate.900")) padding-box,
			conic-gradient(
					theme("colors.slate.400"),
					theme("colors.slate.700") 25%,
					theme("colors.slate.700") 75%,
					theme("colors.slate.400") 100%
				)
				border-box;
	}

	@keyframes elevator {
		from {
			transform: translateY(0);
		}

		to {
			transform: translateY(-245px);
		}
	}

	@keyframes pulse {
		0% {
			opacity: 0;
			transform: scale(0.25) translateZ(0);
		}

		30% {
			opacity: 0.4;
		}

		70% {
			opacity: 0;
		}

		80% {
			transform: scale(1) translateZ(0);
		}
	}
</style>
