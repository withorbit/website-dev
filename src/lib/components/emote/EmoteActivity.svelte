<script lang="ts">
	import { createActivityMessage } from "$lib/activity";
	import type { FullEmote } from "$routes/emotes/[id=snowflake]/+page.svelte";

	export let emote: FullEmote;
</script>

<section id="audit-log" class="flex flex-col items-center">
	<div class="mt-2 h-full w-full rounded-xl border bg-background p-2">
		<div class="overflow-y-auto">
			<div class="flex flex-col gap-y-2">
				{#each emote.activity as activity}
					<div class="flex rounded-lg p-2">
						<img
							class="mr-2 rounded-full p-0.5"
							src={activity.user.avatarUrl}
							alt=""
							width="48"
							height="48"
						/>

						<div class="flex flex-col">
							<span class="font-medium">{activity.user.username}</span>

							<p class="text-sm text-muted-foreground">
								<!-- {createActivityMessage(activity)} -->
							</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
