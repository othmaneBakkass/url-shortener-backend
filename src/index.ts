import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createShortLink, getShortLinks } from "./repositories/shortlinks";
import { CreateShortLinkSchema } from "./repositories/shortlinks/schema";
import { nanoid } from "nanoid";
import { cors } from "hono/cors";

const app = new Hono();

app
	.use(
		cors({
			origin: process.env.CLIENT_URL ?? "http://localhost:3000",
			allowMethods: ["GET", "POST"],
		})
	)
	.get("/shortLinks", async (c) => {
		const data = await getShortLinks();

		if (!data.ok) {
			c.status(500);
			return c.json(data);
		}

		c.status(200);
		return c.json(data);
	})
	.post("/shortLinks", async (c) => {
		const body = await c.req.json();
		const short_link = nanoid(7);
		const props = CreateShortLinkSchema.safeParse({ ...body, short_link });

		if (!props.success) {
			c.status(400);
			return c.json({ msg: "schema error", error: props.error });
		}

		const data = await createShortLink(props.data);

		if (!data.ok) {
			c.status(500);
			return c.json(data);
		}

		c.status(200);
		return c.json(data);
	});

const port = 3000;

serve({
	fetch: app.fetch,
	port,
});
