import { z } from "zod";
import type { Color } from "@prisma/client";
import { json } from "@sveltejs/kit";

const patchBody = z.object({
	userId: z.string(),
	color: z.custom<Color>().or(z.null()),
	badge: z.string().or(z.null()),
});

export async function PATCH({ locals, request, params }) {
	const body = patchBody.parse(await request.json());

	try {
		const user = await locals.db.user.update({
			where: { id: body.userId },
			data: {
				colorId: body.color?.id,
				badgeId: body.badge ?? undefined,
			},
		});

		const key = `users:${params.id}`;

		await locals.redis
			.multi()
			.call("JSON.SET", key, "$.color", JSON.stringify(body.color))
			.call("JSON.SET", key, "$.badgeId", JSON.stringify(body.badge))
			.exec();

		return json(user, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			locals.log.error(error);
		}

		return new Response(null, { status: 500 });
	}
}
