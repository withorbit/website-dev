import { generateState } from "arctic";
import { redirect } from "@sveltejs/kit";
import { dev } from "$app/environment";
import { twitch } from "$lib/server/lucia";

export async function GET({ cookies }) {
	const state = generateState()
	const url = await twitch.createAuthorizationURL(state)

	cookies.set("twitch_oauth_state", state, {
		httpOnly: true,
		secure: !dev,
		path: "/",
		maxAge: 3600,
		sameSite: "lax"
	});

	redirect(302, url.toString())
}
