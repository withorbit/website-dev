import { fail, redirect } from "@sveltejs/kit";
import { auth } from "$lib/server";

export const actions = {
	async default({ locals, cookies }) {
		if (!locals.session) return fail(401);

		await auth.invalidateSession(locals.session.id);
		await locals.redis.call("JSON.DEL", `users:${locals.session.userId}`);

		const cookie = auth.createBlankSessionCookie();

		cookies.set(cookie.name, cookie.value, {
			path: ".",
			...cookie.attributes,
		});

		redirect(302, "/");
	},
};
