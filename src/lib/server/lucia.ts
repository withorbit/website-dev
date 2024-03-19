import { Twitch } from "arctic";
import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { type Prisma, Role, type Subscription } from "@prisma/client";
import { dev } from "$app/environment";
import { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } from "$env/static/private";
import { db } from "./db";

const adapter = new PrismaAdapter(db.session, db.user);

export const auth = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev,
		},
	},
	getUserAttributes(data) {
		const roles = data.roles as Role[];

		return {
			id: data.id,
			twitchId: data.twitchId,
			username: data.username,
			avatarUrl: data.avatarUrl,
			roles: roles,
			subscription: data.subscription as Subscription,
			// todo: dev
			isTrusted: true || roles.includes(Role.Moderator) || roles.includes(Role.Admin),
		};
	},
});

export const twitch = new Twitch(
	TWITCH_CLIENT_ID,
	TWITCH_CLIENT_SECRET,
	"http://localhost:5173/login/twitch/callback",
);

declare module "lucia" {
	interface Register {
		Lucia: typeof auth;
		DatabaseUserAttributes: Prisma.UserCreateInput;
	}
}
