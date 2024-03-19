<script lang="ts">
	import { toast } from "svelte-sonner";
	import { superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { Reason, type Emote } from "@prisma/client";
	import { page } from "$app/stores";
	import * as Dialog from "$lib/components/ui/dialog";
	import { emoteReportSchema, type EmoteReportValidator } from "$lib/schemas";
	import { emoteReportOpen } from "$lib/stores";
	import { Button } from "../ui/button";
	import * as Form from "../ui/form";
	import * as RadioGroup from "../ui/radio-group";

	export let emote: Partial<Emote>;

	const schema: EmoteReportValidator = $page.data.reportForm;
	const form = superForm(schema, {
		validators: zodClient(emoteReportSchema),
	});

	const { form: formData, enhance } = form;

	const reasons = [
		{ name: "Nudity or explicit sexual acts", value: Reason.Explicit },
		{ name: "Depictions of violence", value: Reason.Violent },
		{ name: "Promoting hate speech", value: Reason.HateSpeech },
		{ name: "Targeted individual harassment", value: Reason.Harassment },
		{ name: "Spreading misinformation", value: Reason.Misinformation },
	];
</script>

<Dialog.Root bind:open={$emoteReportOpen}>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title>Report "{emote.name}"</Dialog.Title>

			<Dialog.Description asChild>
				<p class="text-sm text-muted-foreground">
					Report an emote for violating the
					<a href="/guidelines">emote guidelines</a>. If you abuse this feature, you may be
					prevented from using it in the future.
				</p>
			</Dialog.Description>
		</Dialog.Header>

		<form
			id="report"
			method="post"
			action="/emotes/{emote.id}?/report"
			on:submit={() => {
				$emoteReportOpen = false;
				toast.success("Your report has been submitted");
			}}
			use:enhance
		>
			<Form.Fieldset {form} name="reason">
				<Form.Legend class="mb-2">Select a reason</Form.Legend>

				<RadioGroup.Root class="space-y-2" bind:value={$formData.reason}>
					{#each reasons as reason}
						<div class="flex items-center gap-x-2">
							<Form.Control let:attrs>
								<RadioGroup.Item value={reason.value} {...attrs} />
								<Form.Label>{reason.name}</Form.Label>
							</Form.Control>
						</div>
					{/each}

					<RadioGroup.Input name="reason" />
				</RadioGroup.Root>
			</Form.Fieldset>
		</form>

		<Dialog.Footer class="mt-2">
			<Button variant="outline" on:click={() => ($emoteReportOpen = false)}>Cancel</Button>
			<Form.Button form="report">Submit</Form.Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
