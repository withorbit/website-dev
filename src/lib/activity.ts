import type { Action, Activity as RawActivity, Prisma, User } from "@prisma/client";

export type Activity = ActivityCreate | ActivityUpdate;

interface BaseActivity extends RawActivity {
	user: Pick<User, "username" | "avatarUrl">;
}

interface ActivityCreate extends BaseActivity {
	action: Action;
	new: Prisma.JsonValue;
	key: string;
}

interface ActivityUpdate extends BaseActivity {
	action: Action;
	new: Prisma.JsonValue;
	old: Prisma.JsonValue;
	key: string;
}

export function createActivityMessage(activity: Activity): string {
	switch (activity.action) {
		case "Create": {
			return "";
			// return `${activity.user.username} created ${activity.new?.[activity.key]}`
		}

		case "Update": {
			return "";
		}

		default:
			return "";
	}
}
