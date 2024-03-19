import { logger } from "$lib/logger";
import { auth, db, ms, redis, s3 } from "$lib/server";

export async function handle({ event, resolve }) {
	event.locals.log = logger;

	event.locals.db = db;
	event.locals.ms = ms;
	event.locals.s3 = s3;
	event.locals.redis = redis;

	const sessionId = event.cookies.get(auth.sessionCookieName);
	if (!sessionId) return resolve(event);

	const { session, user } = await auth.validateSession(sessionId);

	const cookie = session?.fresh
		? auth.createSessionCookie(session.id)
		: !session
			? auth.createBlankSessionCookie()
			: null;

	if (cookie) {
		event.cookies.set(cookie.name, cookie.value, {
			path: ".",
			...cookie.attributes,
		});
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
}
