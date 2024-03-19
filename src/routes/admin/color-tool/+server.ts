import type { Color } from "@prisma/client";
import { json } from "@sveltejs/kit";
import { snowflake } from "$lib/snowflake";

export async function POST({ locals, request }) {
	const body: Omit<Color, "id"> = await request.json();

	const color = await locals.db.color.create({
		data: {
			id: snowflake.next(),
			name: body.name,
			gradient: body.gradient,
			shadow: body.shadow
		}
	})

	return json(color, { status: 201 });
}
