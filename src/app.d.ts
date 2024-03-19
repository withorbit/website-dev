import type { Redis } from "ioredis";
import type { Session, User as AuthUser } from "lucia";
import type { MeiliSearch } from "meilisearch";
import type { Logger } from "pino";
import type { S3 } from "@aws-sdk/client-s3";
import type { Prisma, PrismaClient, User } from "@prisma/client";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: Session | null;
			user: AuthUser | null;
			log: Logger;
			db: PrismaClient;
			ms: MeiliSearch;
			redis: Redis;
			s3: S3;
		}

		interface PageData {
			authUser: AuthUser | null;
		}

		// interface Platform {}
	}
}
