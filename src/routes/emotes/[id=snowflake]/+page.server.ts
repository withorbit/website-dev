import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { error } from "@sveltejs/kit";
import { emoteReportSchema } from "$lib/schemas";
import { editableSetsQuery } from "$lib/server/db";
import { snowflake } from "$lib/snowflake";

export async function load({ locals, url, params }) {
	const v = Number(url.searchParams.get("v")) || 1;

	// const key = `emotes:${params.id}:${v}`;
	// const cached = await locals.redis.call("JSON.GET", key) as string

	const emote = await locals.db.emote.findFirst({
		where: {
			versions: {
				every: {
					index: v,
					emoteId: params.id,
				},
			},
		},
		include: {
			activity: {
				include: {
					user: {
						select: {
							username: true,
							avatarUrl: true,
						},
					},
				},
			},
			versions: {
				select: {
					id: true,
					name: true,
					description: true,
					emote: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			},
			user: {
				select: {
					id: true,
					username: true,
					avatarUrl: true,
					...editableSetsQuery,
				},
			},
			sets: {
				select: {
					id: true,
					name: true,
					_count: {
						select: {
							emotes: true,
						},
					},
				},
			},
		},
	});

	if (!emote) error(404);

	return {
		emote,
		editableSets: [...emote.user.sets, ...emote.user.editors.flatMap((e) => e.sets)],
		reportForm: await superValidate(zod(emoteReportSchema)),
	};
}

export const actions = {
	async report({ locals, params, request }) {
		const form = await superValidate(request, zod(emoteReportSchema));

		await locals.db.report.create({
			data: {
				id: snowflake.next(),
				reason: form.data.reason,
				emoteId: params.id,
				userId: locals.user!.id,
			},
		});
	},
};
