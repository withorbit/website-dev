import "dotenv/config";
import { blue, green, red, yellow } from "colorette";
import { MeiliSearch } from "meilisearch";
import sharp from "sharp";
import { S3 } from "@aws-sdk/client-s3";
import { faker } from "@faker-js/faker";
import { type Prisma, PrismaClient } from "@prisma/client";
import { processImage } from "../src/lib/image";
import colors from "./colors.json";

const USER_ID = "52208482530623488";
const SNOWFLAKE_MIN = 450_000_000_000_000_000n;
const SNOWFLAKE_MAX = 490_000_000_000_000_000n;

const populated = (name: string, n: number) => `${yellow(name)} populated with ${green(n)} rows\n`;
const mockId = (min = SNOWFLAKE_MIN) => faker.number.bigInt({ min, max: SNOWFLAKE_MAX }).toString();

const db = new PrismaClient();

const ms = new MeiliSearch({
	host: "http://localhost:7700",
	apiKey: process.env.MS_API_KEY,
});

export const s3 = new S3({
	region: "us-east-2",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
});

const index = ms.index("emotes");

async function main() {
	const count = await db.user.count({ where: { id: USER_ID } });

	if (!count) {
		console.log(`User with ID ${yellow(USER_ID)} not found.`);
		return;
	}

	try {
		await seedColors();
		await seedEmotes();
	} catch (error) {
		console.log(`Error during seeding: ${red(error.message)}`);
		return;
	}

	console.log(`Finished seeding ${green("✓")}`);
}

async function seedColors() {
	console.group(`Seeding ${yellow("colors")}...`);

	const { count } = await db.color.createMany({
		data: colors.map((color) => ({
			id: mockId(),
			name: color.name,
			gradient: color.gradient,
			shadow: color.shadows.join(" "),
		})),
		skipDuplicates: true,
	});

	console.log(populated("colors", count));
	console.groupEnd();
}

async function seedEmotes(limit = 100) {
	console.group(`Seeding ${yellow("emotes")}...`);

	await resetEmotes();
	await db.emoteSet.deleteMany({
		where: { name: "Sample" },
	});

	const data: Prisma.EmoteCreateManyInput[] = [];

	const response = await fetch("https://7tv.io/v3/emote-sets/65cc058bd3b1b01bf94ca6e0");
	const { emotes } = await response.json();

	const truncated = emotes.slice(0, limit);

	console.group(`Uploading to AWS...`);
	let i = 0;

	for (const emote of truncated) {
		const id = mockId();

		const response = await fetch(`https://${emote.data.host.url}/4x.webp`);
		const buffer = await response.arrayBuffer();
		const sources = await processImage(buffer);

		for (const source of sources) {
			await s3.putObject({
				Bucket: process.env.AWS_BUCKET!,
				Key: `emotes/${id}/${source.density}x.webp`,
				Body: source.buffer,
				ContentType: "image/webp",
			});
		}

		const progress = blue(`${++i}/${truncated.length}`);
		console.log(`(${progress}) Uploaded ${blue(emote.name)} (${yellow(id)})`);

		const metadata = await sharp(sources[0].buffer).metadata();

		data.push({
			id,
			name: emote.name,
			tags: emote.data.tags,
			width: metadata.width!,
			height: metadata.height!,
			public: true,
			animated: emote.data.animated,
			userId: USER_ID,
		});
	}

	console.log();
	console.groupEnd();

	const { count } = await db.emote.createMany({ data, skipDuplicates: true });

	// not optimal but it's dev only so not a huge deal
	for (const emote of data) {
		await db.emote.update({
			where: { id: emote.id },
			data: {
				activity: {
					create: {
						id: mockId(BigInt(emote.id)),
						action: "Create",
						userId: emote.userId,
						new: {
							name: emote.name,
						},
						key: "name",
					},
				},
				versions: {
					create: {
						id: mockId(),
						name: "Initial upload",
						index: 1,
					},
				},
			},
		});
	}

	console.log(populated("emotes", count));

	const { taskUid } = await index.addDocuments(data, { primaryKey: "id" });
	await index.tasks.waitForTasks([taskUid], { timeOutMs: 15_000 });

	console.log(`Documents added to search index\n`);
	console.groupEnd();

	await createSampleSet(data.map((x) => x.id).slice(0, -20));
}

async function resetEmotes() {
	console.group(`Resetting ${yellow("emotes")}...`);

	await index.deleteAllDocuments();

	console.log("Search index cleared\n");

	const { count } = await db.emote.deleteMany();

	console.log(`${green(count)} rows deleted`);

	const { Contents } = await s3.listObjectsV2({ Bucket: process.env.AWS_BUCKET! });
	if (!Contents?.length) return;

	const objects: { Key: string }[] = [];

	for (const { Key } of Contents ?? []) {
		if (Key?.startsWith("emotes")) objects.push({ Key });
	}

	await s3.deleteObjects({
		Bucket: process.env.AWS_BUCKET!,
		Delete: { Objects: objects },
	});

	console.log(`${green(objects.length)} files deleted\n`);
	console.groupEnd();
}

async function createSampleSet(ids: string[]) {
	console.log(`Creating ${yellow("Sample")} emote set...`);

	await db.emoteSet.create({
		data: {
			id: mockId(),
			name: "Sample",
			capacity: 500,
			emotes: {
				connect: ids.map((id) => ({ id })),
			},
			userId: USER_ID,
		},
	});

	console.log(`Created ${yellow("Sample")}\n`);
}

main();
