import { OAuth2RequestError } from "arctic";
import { Provider, Role } from "@prisma/client";
import { TWITCH_CLIENT_ID } from "$env/static/private";
import { auth, twitch } from "$lib/server/lucia";
import { snowflake } from "$lib/snowflake";

export async function GET({ locals, url, cookies, fetch }) {
	const storedState = cookies.get("twitch_oauth_state");

	const state = url.searchParams.get("state");
	const code = url.searchParams.get("code");

	if (!storedState || !code || !state || state !== storedState) {
		return new Response(null, { status: 400 });
	}

	try {
		const tokens = await twitch.validateAuthorizationCode(code);
		const response = await fetch("https://api.twitch.tv/helix/users", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`,
				"Client-Id": TWITCH_CLIENT_ID,
			},
		});

		const {
			data: [twitchUser],
		} = await response.json();

		const twitchId = Number(twitchUser.id);

		const existing = await locals.db.user.findFirst({
			select: { id: true },
			where: { twitchId },
		});

		if (existing) {
			const session = await auth.createSession(existing.id, {});
			const cookie = auth.createSessionCookie(session.id);

			cookies.set(cookie.name, cookie.value, {
				path: ".",
				...cookie.attributes,
			});
		} else {
			const userId = snowflake.next();
			const channelId = snowflake.next();

			const roles = twitchUser.broadcaster_type === "partner" ? [Role.Verified] : [];

			await locals.db.user.create({
				data: {
					id: userId,
					twitchId,
					username: twitchUser.display_name,
					avatarUrl: twitchUser.profile_image_url,
					roles,
					sets: {
						create: [
							{ id: userId, name: "Personal", capacity: 15 },
							{ id: channelId, name: "Channel", capacity: 500 },
						],
					},
					connections: {
						create: {
							providerId: Provider.Twitch,
							providerUserId: twitchId.toString(),
						},
					},
				},
			});

			const session = await auth.createSession(userId, {});
			const cookie = auth.createSessionCookie(session.id);

			cookies.set(cookie.name, cookie.value, {
				path: ".",
				...cookie.attributes,
			});
		}

		return new Response(null, {
			status: 302,
			headers: {
				Location: "/",
			},
		});
	} catch (error) {
		console.error(error);

		const status = error instanceof OAuth2RequestError ? 400 : 500;
		return new Response(null, { status });
	}
}
