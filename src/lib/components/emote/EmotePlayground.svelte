<script lang="ts">
	import { page } from "$app/stores";
	import { PUBLIC_CDN_URL } from "$env/static/public";
	import { TWITCH_COLORS } from "$lib/constants";
	import type { FullEmote } from "$routes/emotes/[id=snowflake]/+page.svelte";

	interface Message {
		author: string;
		color: string;
		content: string;
	}

	export let emote: FullEmote;

	let message = "";
	let messages: Message[] = [
		{
			author: "OrbitBot",
			color: randomColor(),
			content: `Welcome to the chat playground! Here, you can preview what ${emote.name} would look like in chat before adding it.`,
		},
	];

	const srcset = [1, 2, 4]
		.map((density) => {
			return `${PUBLIC_CDN_URL}/emotes/${emote.id}/${density}x.webp ${density}x`;
		})
		.join(", ");

	function randomColor() {
		return TWITCH_COLORS[(Math.random() * TWITCH_COLORS.length) | 0];
	}

	function sendMessage(event: Event) {
		if (!message || (event instanceof KeyboardEvent && event.key !== "Enter")) {
			return;
		}

		messages = [
			...messages,
			{
				author: $page.data.authUser?.username ?? "AnonymousUser",
				color: randomColor(),
				content: message,
			},
		];

		message = "";
	}
</script>

<section id="chat-preview" class="flex flex-col items-center">
	<div class="mt-2 w-full rounded-xl border bg-[#18181b] pt-4">
		<div id="chat" class="overflow-y-auto">
			<div class="min-h-48">
				{#each messages as message}
					<div class="px-7 py-1.5 [overflow-wrap:anywhere]">
						<div class="-mx-2.5 -my-1.5 rounded px-2.5 py-1.5 hover:bg-[hsla(0,0%,100%,.16)]">
							<div class="text-sm tracking-tight">
								<span class="min-w-max font-bold" style:color={randomColor()}>
									{message.author}<span class="font-normal text-foreground">: </span>
								</span>

								{#each message.content.split(/\s+/) as part}
									{#if part === emote.name}
										<img class="inline-block" {srcset} alt={emote.name} decoding="async" />
										{" "}
									{:else}
										<span class={part.startsWith("@") ? "font-bold" : "font-medium"}>
											{part}{" "}
										</span>
									{/if}
								{/each}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="p-4 pt-0">
			<div class="[transform:translate3d(0px,0px,0px)]">
				<input
					id="chat-input"
					class="block w-full resize-none overflow-x-hidden rounded border border-[#707071] bg-[#18181b] p-2.5 pr-10 text-sm leading-5 placeholder:text-sm placeholder:text-[#707071]"
					type="text"
					placeholder="Send a message"
					maxlength="500"
					bind:value={message}
					on:keydown={sendMessage}
				/>

				<div class="absolute inset-y-0 right-0 flex pr-[5px] flex-center">
					<button class="flex rounded p-1.5" type="button">
						<svg width="20" height="20" viewBox="0 0 20 20">
							<g>
								<path
									d="M7 11a1 1 0 100-2 1 1 0 000 2zM14 10a1 1 0 11-2 0 1 1 0 012 0zM10 14a2 2 0 002-2H8a2 2 0 002 2z"
									fill="#fff"
								/>

								<path
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0a6 6 0 11-12 0 6 6 0 0112 0z"
									fill="#fff"
									fill-rule="evenodd"
									clip-rule="evenodd"
								/>
							</g>
						</svg>
					</button>
				</div>
			</div>

			<div class="mt-2.5 flex justify-between">
				<button class="flex items-center rounded px-2 py-1.5" type="button">
					<svg class="mr-1" width="20" height="20" viewBox="0 0 20 20">
						<path d="M10 6a4 4 0 0 1 4 4h-2a2 2 0 0 0-2-2V6z" fill="#fff" />
						<path
							d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-2 0a6 6 0 1 1-12 0 6 6 0 0 1 12 0z"
							fill="#fff"
							fill-rule="evenodd"
							clip-rule="evenodd"
						/>
					</svg>

					<span class="text-sm font-bold text-[#adadb8]">0</span>
				</button>

				<div class="flex items-center">
					<button class="mr-1 rounded p-1.5" type="button">
						<svg width="20" height="20" viewBox="0 0 20 20">
							<path d="M10 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" fill="#fff" />
							<path
								d="M9 2h2a2.01 2.01 0 0 0 1.235 1.855l.53.22a2.01 2.01 0 0 0 2.185-.439l1.414 1.414a2.01 2.01 0 0 0-.439 2.185l.22.53A2.01 2.01 0 0 0 18 9v2a2.01 2.01 0 0 0-1.855 1.235l-.22.53a2.01 2.01 0 0 0 .44 2.185l-1.415 1.414a2.01 2.01 0 0 0-2.184-.439l-.531.22A2.01 2.01 0 0 0 11 18H9a2.01 2.01 0 0 0-1.235-1.854l-.53-.22a2.009 2.009 0 0 0-2.185.438L3.636 14.95a2.009 2.009 0 0 0 .438-2.184l-.22-.531A2.01 2.01 0 0 0 2 11V9c.809 0 1.545-.487 1.854-1.235l.22-.53a2.009 2.009 0 0 0-.438-2.185L5.05 3.636a2.01 2.01 0 0 0 2.185.438l.53-.22A2.01 2.01 0 0 0 9 2zm-4 8 1.464 3.536L10 15l3.535-1.464L15 10l-1.465-3.536L10 5 6.464 6.464 5 10z"
								fill="#fff"
								fill-rule="evenodd"
								clip-rule="evenodd"
							/>
						</svg>
					</button>

					<button
						class="flex rounded bg-[#9147ff] px-2.5 py-1.5 hover:bg-[#772ce8] active:bg-[#5c16c5]"
						type="button"
						on:click={sendMessage}
					>
						<span class="text-sm font-bold">Chat</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	#chat-preview button:has(svg):hover {
		background: rgb(83 83 95 / 48%);
	}

	#chat-preview button:has(svg):active {
		background: rgba(83 83 95 / 55%);
	}

	#chat {
		scrollbar-width: thin;
		scrollbar-color: rgb(84 84 84) transparent;
	}

	#chat::-webkit-scrollbar {
		width: 8px;
	}

	#chat::-webkit-scrollbar-thumb {
		background: rgb(84 84 84);
	}

	#chat::-webkit-scrollbar-track {
		background: transparent;
	}

	#chat-input:hover {
		outline: none;
		border-color: hsla(240, 8%, 88%, 0.4);
		box-shadow: inset 0 0 0 1px hsla(240, 8%, 88%, 0.4);
	}

	#chat-input:focus {
		outline: none;
		border-color: #a970ff;
		box-shadow:
			0 0 0 1px #a970ff,
			inset 0 0 0 1px #a970ff;
	}
</style>
