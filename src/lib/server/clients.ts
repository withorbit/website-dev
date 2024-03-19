import { MeiliSearch } from "meilisearch";
import { S3 } from "@aws-sdk/client-s3";
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, MS_API_KEY, MS_URL } from "$env/static/private";

export const ms = new MeiliSearch({
	host: MS_URL,
	apiKey: MS_API_KEY
})

export const s3 = new S3({
	region: "us-east-2",
	credentials: {
		accessKeyId: AWS_ACCESS_KEY_ID,
		secretAccessKey: AWS_SECRET_ACCESS_KEY,
	},
});
