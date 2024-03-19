<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import { setDeleteOpen } from "$lib/stores";
	import { buttonVariants } from "../ui/button";

	export let id: string;
	export let name: string;

	async function deleteSet() {
		await fetch(`/sets/${id}`, {
			method: "DELETE",
			body: "{}",
		});

		await invalidateAll();
	}
</script>

<AlertDialog.Root bind:open={$setDeleteOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure?</AlertDialog.Title>

			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete
				<span class="font-medium text-foreground">{name}</span>
				and be removed from any other sets using it as an origin.
			</AlertDialog.Description>
		</AlertDialog.Header>

		<AlertDialog.Footer class="mt-2">
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action class={buttonVariants({ variant: "destructive" })} on:click={deleteSet}>
				Continue
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
