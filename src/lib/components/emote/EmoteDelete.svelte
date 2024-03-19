<script lang="ts">
	import { goto } from "$app/navigation";
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import { emoteDeleteOpen } from "$lib/stores";
	import type { FullEmote } from "$routes/emotes/[id=snowflake]/+page.svelte";
	import { buttonVariants } from "../ui/button";

	export let emote: FullEmote;

	async function deleteEmote() {
		await fetch(`/emotes/${emote.id}`, { method: "DELETE" });
		await goto("/emotes", { invalidateAll: true });
	}
</script>

<AlertDialog.Root bind:open={$emoteDeleteOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure?</AlertDialog.Title>

			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete
				<span class="font-medium text-foreground">{emote.name}</span>
				and be removed from
				<span class="font-medium text-foreground">{emote.sets.length}</span> sets.
			</AlertDialog.Description>
		</AlertDialog.Header>

		<AlertDialog.Footer class="mt-2">
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action class={buttonVariants({ variant: "destructive" })} on:click={deleteEmote}>
				Continue
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
