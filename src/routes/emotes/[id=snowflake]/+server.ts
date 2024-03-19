import { z } from "zod";
import type { EmoteSet, Prisma } from "@prisma/client";
import { error, json } from "@sveltejs/kit";
import { AWS_BUCKET } from "$env/static/private";
import { snowflake } from "$lib/snowflake";

const patchBody = z.object({
	approved: z.boolean().optional(),
	nsfw: z.boolean().optional(),
	tags: z.array(z.string()).optional(),
	sets: z.array(z.string()).default([]),
});

export async function PATCH({ locals, params, request }) {
	const body = patchBody.parse(await request.json());
	const activity: Omit<Prisma.ActivityCreateManyInput, "emoteId">[] = [];

	const value = await locals.redis.call("JSON.GET", `emotes:${params.id}:sets`, "$");
	const cached = (JSON.parse(value as string) as [EmoteSet[]] | null)?.[0] ?? [];

	if (body.approved) {
		activity.push({
			id: snowflake.next(),
			action: "Update",
			new: { approved: body.approved },
			old: { approved: !body.approved },
			key: "approved",
			userId: locals.user!.id,
		});
	}

	if (body.tags) {
		activity.push({
			id: snowflake.next(),
			action: "Update",
			new: { tags: body.tags },
			key: "tags",
			userId: locals.user!.id,
		});
	}

	const [added, removed] = diff(
		cached.map((set) => set.id),
		body.sets,
	);

	const emote = await locals.db.emote.update({
		where: { id: params.id },
		data: {
			approved: body.approved,
			sets: {
				connect: added,
				disconnect: removed,
			},
			activity: {
				createMany: {
					data: activity,
				},
			},
		},
		include: {
			sets: true,
		},
	});

	await locals.redis.call("JSON.SET", `emotes:${params.id}:sets`, "$", JSON.stringify(emote.sets));

	return json({ emote }, { status: 200 });
}

export async function DELETE({ locals, params }) {
	try {
		await locals.db.emote.delete({
			where: { id: params.id },
		});

		await locals.ms.index("emotes").deleteDocument(params.id);

		const objects: { Key: string }[] = [];

		const { Contents } = await locals.s3.listObjectsV2({
			Bucket: AWS_BUCKET,
		});

		for (const { Key } of Contents ?? []) {
			if (Key?.includes(params.id)) objects.push({ Key });
		}

		await locals.s3.deleteObjects({
			Bucket: AWS_BUCKET,
			Delete: { Objects: objects },
		});
	} catch {
		error(404);
	}

	return new Response(null, { status: 204 });
}

function diff(previous: string[], current: string[]) {
	const added: { id: string }[] = [];
	const removed: { id: string }[] = [];

	for (const id of previous) {
		if (!current.includes(id)) removed.push({ id });
	}

	for (const id of current) {
		if (!previous.includes(id)) added.push({ id });
	}

	return [added, removed];
}
