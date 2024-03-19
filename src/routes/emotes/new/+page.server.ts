import assert from "node:assert";
import sharp from "sharp";
import { removeFiles, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { fail, redirect } from "@sveltejs/kit";
import { AWS_BUCKET } from "$env/static/private";
import { processImage } from "$lib/image";
import { emoteSchema } from "$lib/schemas";
import { snowflake } from "$lib/snowflake";

export async function load() {
	return { form: await superValidate(zod(emoteSchema)) };
}

export const actions = {
	async default({ locals, request }) {
		const form = await superValidate(request, zod(emoteSchema));
		const { emote: file, ...data } = form.data;

		if (!file) {
			setError(form, "emote", "File is required.");
		}

		if (!form.valid) {
			return fail(400, removeFiles({ form }));
		}

		assert(file);

		const input = await file.arrayBuffer();
		const sizeLimit = locals.user?.subscription ? 10_000_000 : 5_000_000;

		if (input.byteLength > sizeLimit) {
			return fail(400, removeFiles({ form }));
		}

		const sources = await processImage(input);
		const metadata = await sharp(sources[0].buffer).metadata();

		const id = snowflake.next();
		const userId = locals.user!.id;

		const emote = await locals.db.emote.create({
			data: {
				id,
				name: data.name,
				tags: data.tags,
				width: metadata.width ?? 0,
				height: metadata.height ?? 0,
				approved: false,
				public: Boolean(data.public),
				modifier: data.options.includes("modifier"),
				nsfw: data.options.includes("nsfw"),
				animated: !!metadata.pages,
				activity: {
					create: {
						id: snowflake.next(),
						action: "Create",
						new: { id },
						key: "id",
						userId,
					},
				},
				versions: {
					create: {
						id: snowflake.next(),
						index: 1,
						name: "Initial upload",
						description: "",
					},
				},
				userId,
			},
		});

		await locals.ms.index("emotes").addDocuments([
			{
				id: emote.id,
				name: emote.name,
				tags: emote.tags,
				public: emote.public,
				animated: emote.animated,
			},
		]);

		for (const source of sources) {
			await locals.s3.putObject({
				Bucket: AWS_BUCKET,
				Key: `emotes/${emote.id}/${source.density}x.webp`,
				Body: source.buffer,
				ContentType: "image/webp",
			});
		}

		redirect(302, `/emotes/${emote.id}`);
	},
};
