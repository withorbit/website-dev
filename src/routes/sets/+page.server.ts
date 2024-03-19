import { zod } from "sveltekit-superforms/adapters";
import { setError, superValidate } from "sveltekit-superforms/server";
import { fail } from "@sveltejs/kit";
import { emoteSetSchema } from "$lib/schemas";
import { snowflake } from "$lib/snowflake";

export const actions = {
	async default({ locals, request }) {
		const form = await superValidate(request, zod(emoteSetSchema));

		const userId = locals.user!.id;
		const name = form.data.name;
		const capacity = form.data.capacity;

		const existing = await locals.db.emoteSet.findFirst({
			where: { name, userId },
		});

		if (existing) {
			setError(form, "name", "You already have an emote set with that name.");

			return fail(400, { form });
		}

		const set = await locals.db.emoteSet.create({
			data: {
				id: snowflake.next(),
				name,
				capacity,
				userId,
			},
			select: {
				id: true,
				name: true,
				capacity: true,
				emotes: {
					select: {
						id: true,
						name: true,
						nsfw: true,
						width: true,
						height: true,
					},
					orderBy: {
						id: "desc" as const,
					},
				},
			},
		});

		await locals.redis.call("JSON.ARRAPPEND", `users:${userId}`, "$.sets", JSON.stringify(set));

		return { form };
	},
};
