<script lang="ts">
	import { fade, scale } from "svelte/transition";
	import { superForm } from "sveltekit-superforms/client";
	import { melt, createDialog, createSlider } from "@melt-ui/svelte";
	import type { EmoteSetValidator } from "$lib/schemas";
	import { setEditOpen } from "$lib/stores";
	// import type { EmoteSetData } from "./EmoteSetShelf.svelte";

	export let set: any;
	export let form: EmoteSetValidator;

	const isChannel = set.name === "Channel";

	const { constraints, errors } = superForm(form);

	const {
		elements: { portalled, overlay, content, title, close },
		states: { open },
	} = createDialog({ open: setEditOpen, role: "alertdialog" });

	const {
		elements: { root, range, thumbs },
		states: { value },
	} = createSlider({
		defaultValue: [set.capacity],
		min: 1,
		max: 1000,
	});

	async function onSubmit(event: { currentTarget: HTMLFormElement }) {
		const formData = new FormData(event.currentTarget);

		await fetch(`/sets/${set.id}`, {
			method: "PATCH",
			body: JSON.stringify({
				name: formData.get("name") ?? set.name,
				capacity: formData.get("capacity") ?? set.capacity,
			}),
		});

		location.reload();
	}
</script>

<div use:melt={$portalled}>
	{#if $open}
		<div transition:fade={{ duration: 150 }} use:melt={$overlay}></div>

		<div
			class="flex w-[28rem] flex-col rounded-xl p-6 shadow-lg"
			transition:scale={{ duration: 150, start: 0.95 }}
			use:melt={$content}
		>
			<div>
				<h3 class="text-xl font-bold" use:melt={$title}>Edit "{set.name}"</h3>
			</div>

			<form class="mt-4 flex flex-col space-y-6" on:submit|preventDefault={onSubmit}>
				<div>
					<label for="name">Name</label>

					<input
						id="name"
						class="form-field disabled:cursor-not-allowed disabled:opacity-50"
						name="name"
						type="text"
						value={set.name}
						disabled={isChannel}
						aria-disabled={isChannel}
						aria-invalid={!!$errors.name}
						{...$constraints.name}
					/>

					{#if $errors.name}
						<p class="mt-2 text-sm text-red-500">{$errors.name[0]}</p>
					{/if}
				</div>

				<div>
					<label for="capacity">Capacity</label>

					<div class="mt-2 flex w-full items-center">
						<div class="relative mr-4 flex h-5 w-full items-center" use:melt={$root}>
							<div class="h-2 w-full rounded-lg bg-slate-700">
								<div class="h-2 rounded-l-lg bg-purple-600" use:melt={$range}></div>
							</div>

							<div
								class="size-5 rounded-full bg-slate-200 hover:cursor-grab hover:bg-white focus:cursor-grabbing"
								use:melt={$thumbs[0]}
							></div>
						</div>

						<input
							id="capacity"
							class="form-field mt-0 max-w-[4rem] !px-2.5 !py-1"
							type="number"
							name="capacity"
							bind:value={$value[0]}
							{...$constraints.capacity}
						/>
					</div>
				</div>

				<div class="flex justify-end gap-x-6 text-sm font-medium">
					<button class="hover:text-slate-300" type="button" use:melt={$close}>Cancel</button>
					<button class="btn-purple rounded-md px-3 py-1.5 text-white">Submit</button>
				</div>
			</form>
		</div>
	{/if}
</div>

<style>
	#capacity {
		appearance: textfield;
	}

	#capacity::-webkit-outer-spin-button,
	#capacity::-webkit-inner-spin-button {
		appearance: none;
		margin: 0;
	}
</style>
