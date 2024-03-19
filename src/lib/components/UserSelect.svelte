<script lang="ts">
	import * as Command from "$lib/components/ui/command";
	import * as Dialog from "$lib/components/ui/dialog";
	import { userSelectOpen } from "$lib/stores";
</script>

<Dialog.Root bind:open={$userSelectOpen}>
	<Dialog.Content class="">
		<Dialog.Header class="">
			<Dialog.Title>Add an editor</Dialog.Title>

			<Dialog.Description>
				Add a user to be an editor for your channel to help manage your emotes.
			</Dialog.Description>

			<Command.Root>
				<Command.Input placeholder="Search users..." />
				<Command.List>
					<Command.Empty>No users found.</Command.Empty>
					<Command.Group heading="Suggestions">
						<Command.Item>Calendar</Command.Item>
						<Command.Item>Search Emoji</Command.Item>
						<Command.Item>Calculator</Command.Item>
					</Command.Group>
				</Command.List>
			</Command.Root>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
