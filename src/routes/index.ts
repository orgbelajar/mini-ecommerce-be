import { Hono } from "hono";
import products from "../services/products/routes/index.ts";

const router = new Hono();

router.route("/", products);

export default router;