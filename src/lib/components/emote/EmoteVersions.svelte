<script lang="ts">
	import { Snowflake } from "$lib/snowflake";
	import type { FullEmote } from "$routes/emotes/[id=snowflake]/+page.svelte";
	import Preview from "./EmotePreview.svelte";

	export let emote: FullEmote;
</script>

<section id="versions" class="flex flex-col items-center">
	<div class="mt-2 h-full w-full rounded-xl border bg-background p-2">
		<div class="overflow-y-auto">
			<div class="flex flex-col gap-y-2">
				<ul class="divide-x-2">
					{#each emote.versions.toReversed() as version, i}
						{@const date = Snowflake.toDate(version.id)}

						<li>
							<a
								class="flex rounded-lg p-2 transition-colors hover:bg-border"
								href="/emotes/{emote.id}?v={i + 1}"
							>
								<div class="mr-2 flex aspect-square size-20 rounded-md border flex-center">
									<Preview {emote} density={2} />
								</div>

								<div class="flex flex-col">
									<span class="font-semibold">{version.name}</span>

									{#if version.description}
										<p class="text-sm">{version.description}</p>
									{/if}

									<time class="text-xs text-muted-foreground" datetime={date.toISOString()}>
										{date.format("LLL")}
									</time>
								</div>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</section>
