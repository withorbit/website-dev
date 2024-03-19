import { zod } from "sveltekit-superforms/adapters";
import { superValidate } from "sveltekit-superforms/server";
import type { PrismaClient } from "@prisma/client";
import { error } from "@sveltejs/kit";
import { emoteSetSchema } from "$lib/schemas";

const emoteSubquery = {
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
};

export async function load({ locals, params }) {
	const key = `users:${params.id}`;
	const cached = (await locals.redis.call("JSON.GET", key)) as string;

	let user: Awaited<ReturnType<typeof getUser>> | null = null;

	if (cached) {
		user = JSON.parse(cached);
	} else {
		user = await getUser(locals.db, params.id);
	}

	if (!user) error(404);

	await locals.redis
		.multi()
		.call("JSON.SET", key, "$", JSON.stringify(user), "NX")
		.expire(key, 1800)
		.exec();

	const colors = await locals.db.color.findMany({
		where: {
			id: {
				gte: user.subscription?.id,
			},
		},
		orderBy: { id: "asc" },
	});

	return {
		user,
		colors,
		setCreateForm: await superValidate(zod(emoteSetSchema)),
	};
}

async function getUser(db: PrismaClient, id: string) {
	return await db.user.findFirst({
		where: { id },
		select: {
			id: true,
			username: true,
			avatarUrl: true,
			badgeId: true,
			color: true,
			roles: true,
			connections: {
				select: {
					providerId: true,
					user: {
						select: {
							username: true,
						},
					},
				},
			},
			subscription: {
				select: {
					id: true,
				},
			},
			editors: {
				select: {
					id: true,
					username: true,
					avatarUrl: true,
				},
			},
			emotes: emoteSubquery,
			sets: {
				select: {
					id: true,
					name: true,
					capacity: true,
					emotes: emoteSubquery,
				},
			},
		},
	});
}
