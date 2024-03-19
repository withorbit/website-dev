<script lang="ts">
	import { Download, Search } from "lucide-svelte";
	import Particles from "../Particles.svelte";
</script>

<section class="relative mx-auto max-w-6xl px-4 sm:px-6">
	<Particles class="absolute inset-0 -z-10" />

	<div
		class="pointer-events-none absolute inset-0 -z-10 -mx-28 overflow-hidden rounded-br-[3rem]"
		aria-hidden
	>
		<div class="absolute bottom-0 left-1/2 -z-10 -translate-x-1/2">
			<img class="max-w-none" src="/img/glows/hero-bottom.png" alt="" width="2150" height="770" />
		</div>
	</div>

	<div class="pb-24 pt-36 md:pb-40 md:pt-56">
		<div class="mx-auto max-w-3xl text-center">
			<div class="mb-6">
				<div
					class="relative inline-flex before:absolute before:inset-0 before:bg-purple-500 before:blur-md"
				>
					<div
						id="cta"
						class="btn-sm relative px-2.5 py-1 shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-slate-800/50 hover:text-white"
					>
						<span class="relative inline-flex items-center">Orbit is now in beta</span>
					</div>
				</div>
			</div>

			<h1
				class="bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 bg-clip-text pb-4 text-5xl font-extrabold text-transparent md:text-6xl"
			>
				Next generation Twitch enhancement
			</h1>

			<p class="mb-8 text-lg text-secondary-foreground">
				A unified suite of user-friendly Twitch utilities delivering a consistent, reliable, and
				enjoyable experience that works anywhere.
			</p>

			<div
				class="mx-auto max-w-xs space-y-4 sm:inline-flex sm:max-w-none sm:justify-center sm:space-x-4 sm:space-y-0"
			>
				<div>
					<a
						class="btn w-full bg-gradient-to-r from-white/80 via-white to-white/80 px-4 py-1.5 text-slate-900 hover:bg-white"
						href="#install"
					>
						<Download class="mr-2 text-primary" />
						Install
					</a>
				</div>

				<div>
					<a
						class="btn w-full bg-purple-900/25 px-4 py-1.5 text-slate-200 hover:bg-opacity-30 hover:text-white"
						href="/emotes"
					>
						<Search class="mr-2" />
						<span>Browse emotes</span>
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	#cta {
		background:
			linear-gradient(theme("colors.purple.500"), theme("colors.purple.500")) padding-box,
			linear-gradient(theme("colors.purple.500"), theme("colors.purple.200") 75%, transparent 100%)
				border-box;
	}
</style>
