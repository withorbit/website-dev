<script lang="ts">
	import {
		GalleryVerticalEnd,
		Search,
		TextCursorInput,
		Settings2,
		Zap,
		ShieldCheck,
	} from "lucide-svelte";
	import Spotlight from "../Spotlight.svelte";
	import Particles from "../Particles.svelte";

	const features = [
		{
			icon: GalleryVerticalEnd,
			name: "Emote sets",
			description: "Organize emotes into sets for quick access and to share between users.",
		},
		{
			icon: Search,
			name: "Keywords",
			description: "Get notified whenever a custom keyword or term appears in chat.",
		},
		{
			icon: TextCursorInput,
			name: "Autocompletion",
			description:
				"Tab completion so you never have to remember if an emote started with a capital.",
		},
		{
			icon: Settings2,
			name: "Customizable chat",
			description: "Personalize the chat interface to make it feel the way you want.",
		},
		{
			icon: Zap,
			name: "Performant emotes",
			description: "Emotes are served in modern image formats for the best performance.",
		},
		{
			icon: ShieldCheck,
			name: "Moderation utilities",
			// todo
			description:
				"Reprehenderit minim elit non aliquip mollit ipsum Lorem ad veniam nisi incididunt eu culpa.",
		},
	];
</script>

<section id="feature-driven" class="relative pb-24">
	<div class="absolute left-1/2 top-0 -z-10 -ml-32 -mt-24 size-80 -translate-x-1/2">
		<Particles class="absolute inset-0 -z-10" density={6} speed={30} />
	</div>

	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="pt-16 md:pt-32">
			<div class="mx-auto max-w-3xl pb-12 text-center md:pb-20">
				<h2
					class="inline-flex bg-gradient-to-r from-purple-500 to-purple-200 bg-clip-text pb-3 font-medium text-transparent"
				>
					Feature driven
				</h2>

				<p
					class="bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 bg-clip-text pb-4 text-4xl font-extrabold text-transparent md:text-5xl"
				>
					Faster. Smarter.
				</p>

				<p class="text-lg text-muted-foreground">
					Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex, consequatur sit iste
					incidunt necessitatibus minima nesciunt. Quasi obcaecati, repellendus nostrum.
				</p>
			</div>

			<div class="relative pb-12 md:pb-20">
				<div
					class="pointer-events-none absolute bottom-0 left-1/2 -mb-20 -translate-x-1/2 opacity-50 blur-2xl"
					aria-hidden="true"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="434" height="427">
						<defs>
							<linearGradient id="bs2-a" x1="19.609%" x2="50%" y1="14.544%" y2="100%">
								<stop offset="0%" stop-color="#6366F1" />
								<stop offset="100%" stop-color="#6366F1" stop-opacity="0" />
							</linearGradient>
						</defs>

						<path
							d="m346 898 461 369-284 58z"
							fill="url(#bs2-a)"
							fill-rule="evenodd"
							transform="translate(-346 -898)"
						/>
					</svg>
				</div>

				<Spotlight class="group grid gap-6 md:grid-cols-12">
					<div class="md:col-span-12">
						<div class="card">
							<div class="relative z-20 h-full overflow-hidden rounded-[inherit] bg-slate-900">
								<div class="flex flex-col md:flex-row md:items-center md:justify-between">
									<div class="absolute right-0 top-0 blur-2xl" aria-hidden="true">
										<svg width="342" height="393" xmlns="http://www.w3.org/2000/svg">
											<defs>
												<linearGradient id="bs-a" x1="19.609%" x2="50%" y1="14.544%" y2="100%">
													<stop offset="0%" stop-color="#6366F1" />
													<stop offset="100%" stop-color="#6366F1" stop-opacity="0" />
												</linearGradient>
											</defs>

											<path
												d="m104 .827 461 369-284 58z"
												fill="url(#bs-a)"
												fill-rule="evenodd"
												opacity=".7"
												transform="translate(0 -112.827)"
											/>
										</svg>
									</div>

									<div
										class="pointer-events-none absolute bottom-0 left-1/2 -z-10 flex aspect-square h-full -translate-x-1/2 translate-y-1/2 flex-center"
										aria-hidden="true"
									>
										<div
											class="absolute inset-0 rounded-full bg-purple-500 opacity-70 blur-[120px] translate-z-0"
										></div>
										<div
											class="absolute h-1/4 w-1/4 rounded-full bg-purple-400 blur-[40px] translate-z-0"
										></div>
									</div>

									<div
										class="order-1 shrink-0 p-6 pt-0 md:order-none md:max-w-[480px] md:p-8 md:pr-0"
									>
										<div class="mb-5">
											<h3
												class="inline-flex bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 bg-clip-text pb-1 text-xl font-bold text-transparent"
											>
												Thousands of emotes
											</h3>

											<p class="text-muted-foreground">
												Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
												tempor incididunt ut labore et dolore magna aliqua.
											</p>
										</div>

										<a
											class="group/link text-sm font-medium text-slate-300 hover:text-white"
											href="/emotes"
										>
											<span
												class="underline decoration-purple-700 decoration-2 underline-offset-2 group-hover/link:decoration-purple-500"
											>
												Browse emotes
											</span>

											<span class="ml-1 text-purple-500">&rarr;</span>
										</a>
									</div>

									<div class="relative h-64 w-full overflow-hidden md:h-auto">
										<img
											class="absolute bottom-0 left-1/2 mx-auto max-w-none -translate-x-1/2 md:relative md:left-0 md:translate-x-0"
											src=""
											alt="Thousands of emotes"
											width="500"
											height="400"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="md:col-span-7">
						<div class="card">
							<div class="relative z-20 h-full overflow-hidden rounded-[inherit] bg-slate-900">
								<div class="flex flex-col">
									<div
										class="pointer-events-none absolute bottom-0 left-1/2 -z-10 aspect-square w-1/2 -translate-x-1/2 translate-y-1/2"
										aria-hidden="true"
									>
										<div
											class="absolute inset-0 rounded-full bg-slate-800 blur-[80px] translate-z-0"
										></div>
									</div>

									<div class="order-1 shrink-0 p-6 pt-0 md:order-none md:max-w-[480px] md:p-8">
										<h3
											class="inline-flex bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 bg-clip-text pb-1 text-xl font-bold text-transparent"
										>
											Highlight #2
										</h3>

										<p class="text-muted-foreground">
											Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
											incididunt.
										</p>
									</div>

									<div class="relative h-64 w-full overflow-hidden md:h-auto md:pb-8">
										<img
											class="absolute bottom-0 left-1/2 mx-auto max-w-none -translate-x-1/2 md:relative md:left-0 md:max-w-full md:translate-x-0"
											src=""
											alt="Feature 02"
											width="536"
											height="230"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="md:col-span-5">
						<div class="card">
							<div class="relative z-20 h-full overflow-hidden rounded-[inherit] bg-slate-900">
								<div class="flex flex-col">
									<div
										class="pointer-events-none absolute bottom-0 left-1/2 -z-10 aspect-square w-1/2 -translate-x-1/2 translate-y-1/2"
										aria-hidden="true"
									>
										<div
											class="absolute inset-0 rounded-full bg-slate-800 blur-[80px] translate-z-0"
										></div>
									</div>

									<div class="order-1 shrink-0 p-6 pt-0 md:order-none md:max-w-[480px] md:p-8">
										<h3
											class="inline-flex bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 bg-clip-text pb-1 text-xl font-bold text-transparent"
										>
											Discord integration
										</h3>

										<p class="text-muted-foreground">
											Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
											incididunt.
										</p>
									</div>

									<div
										class="relative flex h-64 w-full overflow-hidden flex-center md:h-auto md:pb-8"
									>
										<img
											class="absolute bottom-0 left-1/2 mx-auto max-w-none -translate-x-1/2 md:relative md:left-0 md:max-w-full md:translate-x-0"
											src=""
											alt="Discord integration"
											width="230"
											height="230"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Spotlight>
			</div>

			<div class="grid gap-8 md:grid-cols-3 md:gap-12">
				{#each features as feature}
					<div>
						<div class="mb-1 flex items-center">
							<svelte:component this={feature.icon} class="mr-2" />
							<span class="font-medium">{feature.name}</span>
						</div>

						<p class="text-sm text-muted-foreground">
							{feature.description}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
