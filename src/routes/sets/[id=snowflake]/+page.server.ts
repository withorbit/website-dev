import type { Prisma } from "@prisma/client";
import { error } from "@sveltejs/kit";

export async function load({ locals, url, params }) {
	const sort = url.searchParams.get("sort") ?? "new";
	const order = (url.searchParams.get("order") ?? "desc") as Prisma.SortOrder;

	const set = await locals.db.emoteSet.findUnique({
		where: {
			id: params.id,
		},
		select: {
			id: true,
			name: true,
			capacity: true,
			emotes: {
				select: {
					id: true,
					name: true,
					width: true,
					height: true,
					user: {
						select: {
							id: true,
							username: true,
						},
					},
				},
				orderBy: {
					id: sort === "new" ? order : undefined,
					name: sort === "name" ? order : undefined,
				},
			},
			user: {
				select: {
					id: true,
					username: true,
					avatarUrl: true,
				},
			},
		},
	});

	if (!set) error(404);

	return {
		query: {
			sort,
			order,
		},
		set,
	};
}
