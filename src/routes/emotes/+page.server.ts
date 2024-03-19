import type { Index } from "meilisearch";
import type { Emote } from "@prisma/client";
import { editableSetsQuery } from "$lib/server/db";

let index: Index | null = null;

export async function load({ locals, url }) {
	const query = url.searchParams.get("q");
	const page = Number(url.searchParams.get("page")) || 1;
	const sort = url.searchParams.get("sort") || "trending";
	const allFilters = url.searchParams.getAll("filter");

	const filters = {
		ignoreTags: allFilters.includes("ignore_tags"),
		animated: allFilters.includes("animated"),
		modifier: allFilters.includes("modifier"),
		nsfw: allFilters.includes("nsfw"),
	};

	if (!index) {
		index ??= locals.ms.index("emotes");

		await index.updateSettings({
			filterableAttributes: ["animated", "modifier", "nsfw"],
			searchableAttributes: ["name", "tags"],
			sortableAttributes: ["id"],
		});
	}

	const searchableAttributes = ["name"];

	if (!allFilters.includes("ignore_tags")) {
		searchableAttributes.push("tags");
	}

	const { taskUid } = await index.updateSearchableAttributes(searchableAttributes);
	await index.waitForTask(taskUid);

	const filter: string[] = [];

	for (const [key, value] of Object.entries(filters)) {
		if (key === "ignoreTags") continue;
		if (value) filter.push(`${key} = true`);
	}

	const result = await index.search<Emote>(query, {
		filter,
		limit: 36,
		offset: 36 * (page - 1),
	});

	const total = await locals.db.emote.count();

	const emotes = await locals.db.emote.findMany({
		where: {
			id: {
				in: result.hits.map((hit) => hit.id),
			},
		},
		select: {
			id: true,
			name: true,
			width: true,
			height: true,
			nsfw: true,
			user: {
				select: {
					id: true,
					username: true,
				},
			},
			sets: {
				select: {
					id: true,
				},
			},
		},
	});

	let user = null;

	if (locals.user) {
		user = await locals.db.user.findUnique({
			where: {
				twitchId: locals.user.twitchId,
			},
			select: editableSetsQuery,
		});
	}

	const userSets = user?.sets ?? [];
	const editorsSets = user?.editors.flatMap((e) => e.sets) ?? [];

	return {
		params: {
			query: query ?? "",
			page,
			sort,
			filter: filters,
		},
		emotes,
		total,
		editableSets: [...userSets, ...editorsSets],
	};
}
