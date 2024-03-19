import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient({
	// log: ["query"],
	errorFormat: "pretty",
});

const setQuery = {
	select: {
		id: true,
		name: true,
		capacity: true,
		user: {
			select: {
				id: true,
				username: true,
				avatarUrl: true,
			},
		},
		emotes: {
			select: {
				id: true,
				name: true,
			},
		},
	},
};

export const editableSetsQuery = {
	sets: setQuery,
	editors: {
		select: {
			sets: setQuery,
		},
	},
};
