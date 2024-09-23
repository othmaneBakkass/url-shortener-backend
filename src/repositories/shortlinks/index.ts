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
		const data = await db.shortLinks.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});

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

export type GetShortLinksSuccessPayload = Extract<
	Awaited<ReturnType<typeof getShortLinks>>,
	{ ok: true }
>;

export async function getShortLinkByMiniUrl(shortLink: string) {
	try {
		const data = await db.shortLinks.findFirst({
			where: {
				short_link: shortLink,
			},
		});

		return {
			ok: true as const,
			data,
		};
	} catch (error) {
		console.log(
			"🚀 ~ getShortLinkByMiniUrl error ~",
			"shortLink:",
			shortLink,
			"error:",
			error
		);
		return {
			ok: false as const,
			msg: "database error" as const,
		};
	}
}

export async function deleteShortLinkByID(id: string) {
	try {
		const data = await db.shortLinks.delete({
			where: {
				id,
			},
		});

		return {
			ok: true as const,
			data: {
				name: data.name,
				short_link: data.short_link,
				original_url: data.original_url,
			},
		};
	} catch (error) {
		console.log(
			"🚀 ~ deleteShortLinkByID error ~",
			"shortLink:",
			id,
			"error:",
			error
		);
		return {
			ok: false as const,
			msg: "database error" as const,
		};
	}
}
