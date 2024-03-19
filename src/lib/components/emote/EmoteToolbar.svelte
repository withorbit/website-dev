<script lang="ts">
	import { Download, AlertCircle, Pencil, GalleryHorizontalEnd, Trash, Check } from "lucide-svelte";
	import { toast } from "svelte-sonner";
	import { page } from "$app/stores";
	import { Button } from "$lib/components/ui/button";
	import { Separator } from "$lib/components/ui/separator";
	import { emoteReportOpen, emoteDeleteOpen, setSelectOpen } from "$lib/stores";
	import type { FullEmote } from "$routes/emotes/[id=snowflake]/+page.svelte";

	export let emote: FullEmote;

	const toolbarButton = {
		size: "icon",
		variant: "secondary",
	} as const;

	async function download() {}

	async function approveEmote() {
		await fetch(`/emotes/${emote.id}`, {
			method: "PATCH",
			body: JSON.stringify({ approved: true }),
		});

		toast.success("Emote approved");
	}
</script>

<div class="mb-4 mt-12 flex items-center" role="toolbar">
	<div class="flex items-center gap-x-2" role="group">
		<Button on:click={() => ($setSelectOpen = true)}>Add to set</Button>

		<Button title="Download" aria-label="Download" {...toolbarButton} on:click={download}>
			<Download />
		</Button>

		<Button
			class="text-red-600"
			title="Report"
			aria-label="Report"
			{...toolbarButton}
			on:click={() => ($emoteReportOpen = true)}
		>
			<AlertCircle />
		</Button>
	</div>

	{#if emote.user.id === $page.data.authUser?.id}
		<Separator class="mx-4 h-8" orientation="vertical" />

		<div class="flex gap-x-2" role="group">
			<Button title="Edit" aria-label="Edit" {...toolbarButton}>
				<Pencil />
			</Button>

			<Button title="New version" aria-label="New version" {...toolbarButton}>
				<GalleryHorizontalEnd />
			</Button>

			<Button
				class="text-red-600"
				title="Delete"
				aria-label="Delete"
				on:click={() => ($emoteDeleteOpen = true)}
				{...toolbarButton}
			>
				<Trash />
			</Button>
		</div>
	{/if}

	{#if $page.data.authUser?.isTrusted && !emote.approved}
		<Separator class="mx-4 h-8" orientation="vertical" />

		<div class="flex gap-x-2" role="group">
			<Button
				class="text-green-500"
				title="Approve"
				aria-label="Approve"
				on:click={approveEmote}
				{...toolbarButton}
			>
				<Check />
			</Button>
		</div>
	{/if}
</div>
