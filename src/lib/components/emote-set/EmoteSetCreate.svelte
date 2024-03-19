<script lang="ts">
	import { superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { emoteSetSchema, type EmoteSetValidator } from "$lib/schemas";
	import { busy, setCreateOpen } from "$lib/stores";
	import { Button } from "../ui/button";
	import * as Dialog from "../ui/dialog";
	import * as Form from "../ui/form";
	import { Input } from "../ui/input";
	import { Slider } from "../ui/slider";
	import { page } from "$app/stores";

	const schema: EmoteSetValidator = $page.data.setCreateForm;
	const form = superForm(schema, {
		validators: zodClient(emoteSetSchema),
	});

	const { form: formData, delayed, enhance } = form;

	$: capacity = [($formData.capacity = 500)];
	$: $setCreateOpen = $busy = $delayed;
</script>

<Dialog.Root bind:open={$setCreateOpen}>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title>Create new emote set</Dialog.Title>

			<Dialog.Description>
				Emote sets organize emotes that can be easily used by and shared between other users.
			</Dialog.Description>
		</Dialog.Header>

		<form
			id="set-create"
			class="flex flex-col gap-y-4"
			method="post"
			action="/sets"
			on:submit={() => ($setCreateOpen = false)}
			use:enhance
		>
			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>Name</Form.Label>
					<Input type="text" autocomplete="off" bind:value={$formData.name} {...attrs} />
				</Form.Control>

				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="capacity">
				<Form.Control let:attrs>
					<Form.Label>Capacity</Form.Label>

					<div class="mt-1.5 flex items-center gap-x-4">
						<Slider min={1} max={1000} bind:value={capacity} />
						<Input class="max-w-16" type="number" bind:value={capacity[0]} />
					</div>

					<Input type="hidden" bind:value={$formData.capacity} {...attrs} />
				</Form.Control>

				<Form.FieldErrors />
			</Form.Field>
		</form>

		<Dialog.Footer class="mt-2">
			<Button variant="outline" on:click={() => ($setCreateOpen = false)}>Cancel</Button>
			<Form.Button form="set-create">Create</Form.Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<style scoped>
	:global(input[type="number"]) {
		appearance: textfield;
	}

	:global(input[type="number"])::-webkit-outer-spin-button,
	:global(input[type="number"])::-webkit-inner-spin-button {
		appearance: none;
		margin: 0;
	}
</style>
