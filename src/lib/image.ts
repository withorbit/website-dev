import sharp from "sharp";

// Modularlized for the purpose of seeding and local testing

interface Source {
	density: number;
	buffer: Buffer;
}

export async function processImage(input: ArrayBuffer): Promise<Source[]> {
	const sources: Source[] = [];

	for (const size of [28, 56, 112]) {
		const buffer = await sharp(input, { animated: true })
			.resize({ width: size * 3, height: size, fit: "inside" })
			.webp({ quality: 85 })
			.toBuffer();

		sources.push({ density: size / 28, buffer });
	}

	return sources;
}
