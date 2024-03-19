import { z } from "zod";
import { error, json } from "@sveltejs/kit";

const patchBody = z.object({
	name: z.string().optional(),
	capacity: z.string().optional(),
});

export async function PATCH({ locals, params, request }) {
	const body = patchBody.parse(await request.json());

	const set = await locals.db.emoteSet.update({
		where: { id: params.id },
		data: {
			name: body.name,
			capacity: Number(body.capacity),
		},
	});

	return json(set, { status: 200 });
}

const deleteBody = z.object({
	emote: z.string().optional(),
});

export async function DELETE({ locals, params, request }) {
	const body = deleteBody.parse(await request.json());

	try {
		if (body.emote) {
			await locals.db.emoteSet.update({
				where: { id: params.id },
				data: {
					emotes: {
						delete: {
							id: body.emote,
						},
					},
				},
			});
		} else {
			await locals.db.emoteSet.delete({
				where: { id: params.id },
			});

			await locals.redis.call(
				"JSON.DEL",
				`users:${locals.user!.id}`,
				`$.sets[?(@.id=='${params.id}')]`,
			);
		}
	} catch {
		error(404);
	}

	return new Response(null, { status: 204 });
}
