import Fuse from "fuse.js";
import { GetShortLinksSuccessPayload } from "@/repositories/shortlinks/index";

export function createApiErrorObject(msg: string, code: number) {
	return {
		ok: false as const,
		msg,
		code,
	};
}

export type ApiError = ReturnType<typeof createApiErrorObject>;

export function filterShortLinksBySearchKey({
	data,
	searchKey,
}: {
	data: GetShortLinksSuccessPayload;
	searchKey: string;
}): GetShortLinksSuccessPayload {
	const shortLinks = data.data;

	const fuse = new Fuse(shortLinks, { keys: ["name"] });

	const result = fuse
		.search(searchKey)
		.reduce<GetShortLinksSuccessPayload["data"]>((c, v) => {
			c.push(v.item);
			return c;
		}, []);

	return {
		ok: true as const,
		data: result,
	};
}
