import { z } from "zod";

export const CreateShortLinkSchema = z.object({
	original_url: z.string(),
	short_link: z.string(),
	name: z.string(),
});

export type CreateShortLinkProps = z.infer<typeof CreateShortLinkSchema>;
