import type { Infer, SuperValidated } from "sveltekit-superforms";
import { ZodIssueCode, z } from "zod";
import { Reason } from "@prisma/client";

export const emoteSchema = z.object({
	emote: z.instanceof(File).optional(),
	name: z
		.string()
		.min(2, "Name must be at least 2 characters.")
		.max(100, "Name must be at most 100 characters.")
		.regex(
			/[\w:][-\w:]{1,99}/i,
			"Name can only contain alphanumeric characters, underscores, dases, and colons.",
		),
	public: z.enum(["true", "false"]).default("true"),
	options: z.array(z.string()).default([]),
	tags: z
		.array(z.string())
		.default([])
		.superRefine((tags, ctx) => {
			// have to do validation in refinement instead of type to properly display errors
			for (const tag of tags) {
				let issues = false;

				if (tag.length < 2) {
					ctx.addIssue({
						code: ZodIssueCode.too_small,
						type: "string",
						minimum: 2,
						inclusive: true,
						message: "Tags must be at least 2 characters.",
					});

					issues = true;
				}

				if (tag.length > 32) {
					ctx.addIssue({
						code: ZodIssueCode.too_big,
						type: "string",
						maximum: 32,
						inclusive: true,
						message: "Tags must be at most 32 characters.",
					});

					issues = true;
				}

				if (!/^[a-z\d]{2,32}$/i.test(tag)) {
					ctx.addIssue({
						code: ZodIssueCode.invalid_string,
						validation: "regex",
						message: "Tags can only contain alphanumeric characters.",
					});

					issues = true;
				}

				if (issues) return z.NEVER;
			}
		}),
});

export const emoteSetSchema = z.object({
	name: z
		.string()
		.min(2)
		.max(32)
		.regex(/^\w[\w ]{2,32}$/)
		.trim(),
	capacity: z.number().min(1).max(1000),
});

export const emoteReportSchema = z.object({
	reason: z.enum([
		Reason.Explicit,
		Reason.Harassment,
		Reason.HateSpeech,
		Reason.Misinformation,
		Reason.Violent,
	]),
});

export type EmoteValidator = SuperValidated<Infer<typeof emoteSchema>>;
export type EmoteSetValidator = SuperValidated<Infer<typeof emoteSetSchema>>;
export type EmoteReportValidator = SuperValidated<Infer<typeof emoteReportSchema>>;
