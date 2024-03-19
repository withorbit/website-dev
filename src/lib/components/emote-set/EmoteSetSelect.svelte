<script lang="ts">
	import { toast } from "svelte-sonner";
	import Icon from "@iconify/svelte";
	import { invalidateAll } from "$app/navigation";
	import * as Dialog from "$lib/components/ui/dialog";
	import { setSelectOpen } from "$lib/stores";
	import type { TargetEmote, SelectableSet } from "$routes/emotes/+page.svelte";
	import { Button } from "../ui/button";
	import { Label } from "../ui/label";
	import { Input } from "../ui/input";

	interface Group {
		user: SelectableSet["user"];
		sets: SelectableSet[];
	}

	export let emote: TargetEmote;
	export let sets: SelectableSet[];

	$: preselected = emote.sets.map((set) => set.id);
	$: selected = [...preselected];
	$: grouped = groupSets(sets);

	let chosenName = emote.name;

	function updateSelection(set: SelectableSet) {
		if (selected.includes(set.id)) {
			selected = selected.filter((id) => id !== set.id);
		} else {
			selected = [...selected, set.id];
		}
	}

	function groupSets(sets: SelectableSet[]) {
		return sets.reduce<Group[]>((groups, set) => {
			const group = groups.find((g) => g.user.id === set.user.id);

			if (group) {
				group.sets.push(set);
			} else {
				groups.push({ user: set.user, sets: [set] });
			}

			return groups;
		}, []);
	}

	async function updateSets() {
		await fetch(`/emotes/${emote.id}`, {
			method: "PATCH",
			body: JSON.stringify({ sets: selected }),
		});

		$setSelectOpen = false;

		// todo: math this
		// if (selected.length) {
		// 	const changed = selected.filter((id) => !preselected.includes(id));

		// 	toast.success(`Successfully updated ${changed.length} set(s)`);
		// }

		await invalidateAll();
	}
</script>

<Dialog.Root bind:open={$setSelectOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Add "{emote.name}" to an emote set</Dialog.Title>

			<Dialog.Description>
				Adding this emote to a set being used as an origin will also update the parent sets. You can
				rename the emote if it conflicts with another.
			</Dialog.Description>
		</Dialog.Header>

		<div>
			<Label for="rename">Rename</Label>

			<Input
				class="mt-2"
				id="rename"
				type="text"
				minlength={2}
				maxlength={100}
				bind:value={chosenName}
			/>
		</div>

		<output id="selector" class="mt-2 max-h-64 overflow-y-auto">
			<ul class="space-y-4">
				{#each grouped as group}
					<li>
						<div class="flex items-center gap-x-2">
							<img
								class="rounded-full"
								src={group.user.avatarUrl}
								alt={group.user.username}
								width="24"
								height="24"
							/>

							<span class="font-medium">{group.user.username}</span>
							<span class="mr-2 h-px w-full bg-border"></span>
						</div>

						<ul class="ml-4 mt-2 text-sm">
							{#each group.sets as set (set.id)}
								<li>
									<Button
										class="flex w-full justify-between"
										variant="ghost"
										on:click={() => updateSelection(set)}
									>
										{set.name}

										<div class="flex items-center">
											<div class="mr-2">
												{set.emotes.length}
												<span class="text-muted-foreground">/ {set.capacity}</span>
											</div>

											<Icon
												class="size-4 {selected.includes(set.id)
													? 'visible text-primary'
													: 'invisible'}"
												icon="lucide:check"
											/>
										</div>
									</Button>
								</li>
							{/each}
						</ul>
					</li>
				{/each}
			</ul>
		</output>

		<Dialog.Footer class="mt-2">
			<Button
				variant="outline"
				on:click={() => {
					$setSelectOpen = false;
					selected = [...preselected];
				}}
			>
				Cancel
			</Button>

			<Button on:click={updateSets}>Add</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<style>
	#selector {
		scrollbar-color: theme("colors.secondary.DEFAULT") transparent;
		scrollbar-width: thin;
	}

	#selector::-webkit-scrollbar {
		width: 8px;
	}

	#selector::-webkit-scrollbar-thumb {
		background: theme("colors.secondary.DEFAULT");
	}

	#selector::-webkit-scrollbar-track {
		background: transparent;
	}
</style>
