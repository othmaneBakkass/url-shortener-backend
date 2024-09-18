import { db } from "@/db";
import { CreateShortLinkProps } from "./schema";

export async function createShortLink({
	original_url,
	name,
	short_link,
}: CreateShortLinkProps) {
	try {
		const data = await db.shortLinks.create({
			data: {
				original_url,
				short_link,
				name,
			},
		});

		return {
			ok: true as const,
			data: {
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
				id: data.id,
			},
		};
	} catch (error) {
		console.log("🚀 ~ createShortLink error ~", error);
		return {
			ok: false as const,
			msg: "database error" as const,
		};
	}
}

export async function getShortLinks() {
	try {
		const data = await db.shortLinks.findMany();

		return {
			ok: true as const,
			data,
		};
	} catch (error) {
		console.log("🚀 ~ getShortLinks error ~", error);
		return {
			ok: false as const,
			msg: "database error" as const,
		};
	}
}
