import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { nanoid } from "nanoid";
import {
	createShortLink,
	deleteShortLinkByID,
	getShortLinkByMiniUrl,
	getShortLinks,
} from "@/repositories/shortlinks";
import { CreateShortLinkSchema } from "@/repositories/shortlinks/schema";
import { createApiErrorObject, filterShortLinksBySearchKey } from "@/utils";
import { config } from "dotenv";

const app = new Hono();

config();

app
	.use(
		cors({
			origin: process.env.CLIENT_URL ?? "http://localhost:3000",
			allowMethods: ["GET", "POST", "DELETE"],
		})
	)
	.get("/shortLinks/:miniUrlId", async (c) => {
		const miniUrlId = c.req.param("miniUrlId");
		if (!miniUrlId) {
			return c.json(createApiErrorObject("bad parameters", 400), 400);
		}
		const data = await getShortLinkByMiniUrl(miniUrlId);

		if (!data.ok) return c.json(createApiErrorObject(data.msg, 500), 500);

		return c.json(data, 200);
	})
	.delete("/shortLinks/:id", async (c) => {
		const id = c.req.param("id");
		if (!id) {
			return c.json(createApiErrorObject("bad parameters", 400), 400);
		}
		const data = await deleteShortLinkByID(id);

		if (!data.ok) return c.json(createApiErrorObject(data.msg, 500), 500);

		return c.json(data, 200);
	})
	.get("/shortLinks", async (c) => {
		let data = await getShortLinks();

		if (!data.ok) return c.json(createApiErrorObject(data.msg, 500), 500);
		const searchKey = c.req.query("searchKey");

		if (searchKey && searchKey.length > 0 && searchKey !== " ") {
			data = filterShortLinksBySearchKey({ data, searchKey });
		}

		return c.json(data, 200);
	})
	.post("/shortLinks", async (c) => {
		const body = await c.req.json();
		const short_link = nanoid(7);
		const props = CreateShortLinkSchema.safeParse({ ...body, short_link });

		if (!props.success) {
			return c.json(createApiErrorObject("bad parameters", 400), 400);
		}

		const data = await createShortLink(props.data);

		if (!data.ok) return c.json(createApiErrorObject(data.msg, 500), 500);

		return c.json(data, 200);
	});

const dynamicPort = Number(process.env.BACKEND_SERVER_PORT);
const port = isNaN(dynamicPort) ? 3000 : dynamicPort;
console.log("🚀 ~ running server on  ~", port);
serve({
	fetch: app.fetch,
	port,
});
