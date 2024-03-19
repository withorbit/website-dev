<script lang="ts">
	import { Upload, X } from "lucide-svelte";
	import { superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { Button } from "$lib/components/ui/button";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import * as RadioGroup from "$lib/components/ui/radio-group";
	import { Separator } from "$lib/components/ui/separator";
	import { emoteSchema } from "$lib/schemas";
	import { busy } from "$lib/stores";

	export let data;

	let upload: HTMLInputElement;
	let isOverDropZone = false;
	let currentTag = "";

	const options = [
		{ name: "Modifier", desc: "Allow this emote to be used on top of others." },
		{ name: "NSFW", desc: "Mark this emote as not safe for work." },
	];

	const form = superForm(data.form, {
		validators: zodClient(emoteSchema),
	});
	const { form: formData, errors, delayed, enhance } = form;

	$: $busy = $delayed;

	function onDrop(event: DragEvent) {
		isOverDropZone = false;

		if (!event.dataTransfer) return;

		const [item] = event.dataTransfer.items;

		if (item.kind === "file") {
			if (!/^image\/(png|jpeg|gif|webp|avif)$/.test(item.getAsFile()!.type)) {
				$errors.emote = ["Invalid file type."];
			} else {
				upload.files = event.dataTransfer.files;
				$errors.emote = [];

				$formData.emote = upload.files.item(0)!;

				if (!$formData.name) {
					$formData.name = $formData.emote.name.split(".")[0];
				}
			}
		}
	}

	function onUpload(event: { currentTarget: HTMLInputElement }) {
		$formData.emote = event.currentTarget.files?.item(0) ?? undefined;

		if ($formData.emote) {
			$formData.name = $formData.emote.name.split(".")[0];
		}
	}

	function onKeydown(event: KeyboardEvent) {
		if (![" ", "Enter"].includes(event.key)) return;

		event.preventDefault();
		const tag = currentTag.trim();

		if (
			tag &&
			!$formData.tags.some((t) => t.toLowerCase() === tag.toLowerCase()) &&
			$formData.tags.length < 10
		) {
			$formData.tags = [...$formData.tags, tag];
		}

		currentTag = "";
	}

	function reset() {
		upload.files = null;

		$formData.emote = undefined;
		$formData.tags = [];
		$formData.name = "";
		$formData.public = "true";
		$formData.options = [];

		scrollTo(0, 0);
	}
</script>

<svelte:head>
	<title>Upload emote - Orbit</title>
</svelte:head>

<div class="relative mx-auto flex max-w-xl flex-col items-center px-4 pb-24 pt-32 sm:items-start">
	<div
		class="absolute -top-10 left-1/2 -z-10 -translate-x-1/2 transform-gpu overflow-hidden opacity-60 blur-3xl"
		aria-hidden="true"
	>
		<img class="max-w-screen-lg" src="/img/glows/4.png" alt="" width="3670" height="1930" />
	</div>

	<h1 class="mb-10 text-4xl font-extrabold tracking-tight lg:text-5xl">Upload emote</h1>

	<form
		id="emote-new"
		class="relative space-y-6"
		method="post"
		enctype="multipart/form-data"
		use:enhance
	>
		<div class="flex shrink-0 grow-0 flex-col">
			<div class="flex flex-col items-center sm:flex-row sm:items-start">
				<div
					class="group relative flex aspect-square size-56 flex-col rounded-lg border border-solid bg-background text-center flex-center sm:min-w-max"
					class:opacity-75={isOverDropZone}
					role="none"
					on:dragover|preventDefault={() => (isOverDropZone = true)}
					on:dragleave={() => (isOverDropZone = false)}
					on:drop|preventDefault={onDrop}
				>
					{#if $formData.emote}
						<img
							class="h-32 w-auto object-contain"
							src={URL.createObjectURL($formData.emote)}
							alt={$formData.name}
							height="128"
						/>

						<Button
							class="absolute bottom-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
							size="sm"
							variant="secondary"
							on:click={() => {
								upload.files = null;

								$formData.emote = undefined;
								$formData.name = "";
							}}
						>
							Remove
						</Button>
					{:else}
						<Upload class="mx-auto size-6" />
						<p class="mt-4 text-sm">Drag & drop</p>
					{/if}
				</div>

				<div class="mt-4 text-sm/6 sm:ml-10 sm:mt-0">
					<p class="text-center sm:text-left">
						<Button class="h-auto p-0" variant="link" on:click={() => upload.click()}>
							Upload
						</Button>
						or drag and drop a file.
					</p>

					<ul class="mt-4 list-disc space-y-2">
						<li>
							<p>PNG, JPG, GIF, WebP, and AVIF file types are supported.</p>
						</li>
						<li>
							<p>File size cannot exceed 5 MB (10 MB for <a href="/plus">Plus</a> members).</p>
						</li>
					</ul>
				</div>
			</div>

			{#if $errors.emote}
				<p class="mt-2 text-sm text-destructive-foreground">{$errors.emote}</p>
			{/if}

			<input
				id="upload"
				name="emote"
				type="file"
				accept=".png,.jpg,.gif,.webp,.avif"
				hidden
				bind:this={upload}
				on:input={onUpload}
			/>
		</div>

		<span class="block h-px w-full bg-slate-700" role="separator"></span>

		<Form.Field {form} name="name">
			<Form.Control let:attrs>
				<Form.Label>Name</Form.Label>
				<Input type="text" autocomplete="off" bind:value={$formData.name} {...attrs} />
			</Form.Control>

			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="tags">
			<Form.Control let:attrs>
				{@const { name, ...attributes } = attrs}

				<Form.Label>
					Tags <span class="text-xs text-muted-foreground">(Optional)</span>
				</Form.Label>

				<Input
					type="text"
					autocomplete="off"
					placeholder={$formData.tags.length >= 10 ? "Max number of tags reached" : undefined}
					disabled={$formData.tags.length >= 10}
					bind:value={currentTag}
					on:keydown={onKeydown}
					{...attributes}
				/>

				{#each $formData.tags as tag}
					<input {name} value={tag} type="hidden" />
				{/each}
			</Form.Control>

			<Form.Description>Add up to 10 tags to help others find your emote.</Form.Description>

			{#if $formData.tags.length}
				<div class="flex flex-wrap gap-2">
					{#each $formData.tags as tag}
						<div
							class="inline-flex h-7 items-center rounded-sm border bg-secondary pl-2 text-xs text-secondary-foreground hover:bg-secondary/80"
						>
							{tag}

							<Button
								class="h-full px-2 py-1 hover:bg-transparent"
								variant="ghost"
								on:click={() => {
									$formData.tags = $formData.tags.filter((t) => t !== tag);
								}}
							>
								<X class="size-3.5" />
							</Button>
						</div>
					{/each}
				</div>
			{/if}

			<Form.FieldErrors />
		</Form.Field>

		<Separator />

		<div
			class="absolute left-1/2 -z-10 -translate-x-1/2 transform-gpu overflow-hidden opacity-70 blur-3xl"
			aria-hidden="true"
		>
			<img class="max-w-screen-xl" src="/img/glows/2.png" alt="" width="3000" height="700" />
		</div>

		<Form.Fieldset {form} name="public">
			<Form.Legend class="sr-only">Visibility</Form.Legend>

			<RadioGroup.Root class="space-y-3" bind:value={$formData.public}>
				<div class="flex flex-row items-start">
					<Form.Control let:attrs>
						<RadioGroup.Item class="mt-1.5" value="true" {...attrs} />

						<div class="ml-3">
							<Form.Label>Public</Form.Label>
							<Form.Description>This emote can be seen and used by anyone.</Form.Description>
						</div>
					</Form.Control>
				</div>

				<div class="flex flex-row items-start">
					<Form.Control let:attrs>
						<RadioGroup.Item class="mt-1.5" value="false" {...attrs} />

						<div class="ml-3">
							<Form.Label>Private</Form.Label>
							<Form.Description>
								This emote is not publicly listed and can only be used by you.
							</Form.Description>
						</div>
					</Form.Control>
				</div>
			</RadioGroup.Root>
		</Form.Fieldset>

		<Separator />

		<Form.Fieldset {form} name="options">
			<Form.Legend class="sr-only">Options</Form.Legend>

			<div class="space-y-6">
				{#each options as option}
					{@const id = option.name.toLowerCase()}
					{@const checked = $formData.options.includes(id)}

					<div class="flex flex-row items-start">
						<Form.Control let:attrs>
							{@const { name, ...attributes } = attrs}

							<Checkbox
								{checked}
								onCheckedChange={(value) => {
									if (value) {
										$formData.options = [...$formData.options, id];
									} else {
										$formData.options = $formData.options.filter((o) => o !== id);
									}
								}}
								{...attributes}
							/>

							<div class="ml-3 space-y-1.5 leading-none">
								<Form.Label>{option.name}</Form.Label>
								<Form.Description>{option.desc}</Form.Description>
							</div>

							<input {name} value={id} type="checkbox" {checked} hidden />
						</Form.Control>
					</div>
				{/each}
			</div>
		</Form.Fieldset>

		<div class="!mt-10 flex justify-end gap-x-2">
			<Button variant="outline" on:click={reset}>Reset</Button>
			<Form.Button form="emote-new">Submit</Form.Button>
		</div>
	</form>
</div>
