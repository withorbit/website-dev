<script lang="ts">
	import Spotlight from "../Spotlight.svelte";
</script>

<section id="desktop-client" class="relative pb-16">
	<div
		class="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 -translate-y-1/4 opacity-50 blur-2xl"
		aria-hidden="true"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="434" height="427">
			<defs>
				<linearGradient id="bs3-a" x1="19.609%" x2="50%" y1="14.544%" y2="100%">
					<stop offset="0%" stop-color="#6366F1" />
					<stop offset="100%" stop-color="#6366F1" stop-opacity="0" />
				</linearGradient>
			</defs>
			<path
				fill="url(#bs3-a)"
				fill-rule="evenodd"
				d="m410 0 461 369-284 58z"
				transform="matrix(1 0 0 -1 -410 427)"
			/>
		</svg>
	</div>

	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="pb-12 pt-16 md:pb-20 md:pt-32">
			<div class="mx-auto max-w-3xl pb-12 text-center md:pb-20">
				<h2
					class="inline-flex bg-gradient-to-r from-purple-500 to-purple-200 bg-clip-text pb-3 font-medium text-transparent"
				>
					Desktop client
				</h2>
				<p
					class="bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 bg-clip-text pb-4 text-4xl font-extrabold text-transparent md:text-5xl"
				>
					More than an extension.
				</p>
				<p class="text-lg text-muted-foreground">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident repudiandae eius
					consequatur. Eu reprehenderit esse voluptate elit.
				</p>
			</div>

			<div class="mx-auto max-w-3xl">
				<Spotlight class="group">
					<div class="card">
						<div class="relative z-20 h-full overflow-hidden rounded-[inherit] bg-slate-900">
							<div
								class="pointer-events-none absolute bottom-0 left-1/2 -z-10 aspect-square w-1/2 -translate-x-1/2 translate-y-1/2"
								aria-hidden="true"
							>
								<div
									class="absolute inset-0 rounded-full bg-purple-500 blur-[120px] translate-z-0"
								></div>
							</div>

							<img class="aspect-video" src="/" alt="Desktop client preview" />
						</div>
					</div>
				</Spotlight>
			</div>
		</div>
	</div>
</section>
