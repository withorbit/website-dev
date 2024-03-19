<script lang="ts">
	import { notificationsOpen } from "$lib/stores";
	import { Button } from "./ui/button";
	import * as Card from "./ui/card";
	import * as Sheet from "./ui/sheet";
</script>

<Sheet.Root bind:open={$notificationsOpen}>
	<Sheet.Content class="overflow-auto sm:max-w-md">
		<Sheet.Header>
			<Sheet.Title>Notifications</Sheet.Title>

			<Sheet.Description>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima fugiat repudiandae minus
				mollitia placeat adipisci quaerat.
			</Sheet.Description>
		</Sheet.Header>

		<ul class="mt-6 space-y-6">
			{#each Array(5) as notification}
				<li>
					<Card.Root>
						<Card.Header>
							<Card.Title>Notification title</Card.Title>
							<Card.Description>Lorem ipsum</Card.Description>
						</Card.Header>

						<Card.Content>
							<p class="text-sm">
								Aliqua irure excepteur officia velit mollit. Mollit excepteur eu nostrud voluptate
								proident laboris.
							</p>
						</Card.Content>

						<Card.Footer class="flex justify-end gap-x-4">
							<Button variant="outline">Dismiss</Button>
							<Button variant="secondary">Action</Button>
						</Card.Footer>
					</Card.Root>
				</li>
			{/each}
		</ul>
	</Sheet.Content>
</Sheet.Root>
