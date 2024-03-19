import { Redis } from "ioredis";
import { logger } from "$lib/logger";

export const redis = new Redis({ maxRetriesPerRequest: null });

redis.on("error", (error) => {
	if (error.message.includes("ECONNREFUSED")) {
		logger.error(error.message);
	}
});
