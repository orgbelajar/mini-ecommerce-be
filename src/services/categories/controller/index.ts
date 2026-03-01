import { Hono } from "hono";
import { categoryPayloadSchema } from "../validator";
import { CategoryRepositories } from "../repositories";

export const categoryController = new Hono();

categoryController.post("/api/category", async (c) => {
  const request = categoryPayloadSchema.parse(await c.req.json());

  const response = await CategoryRepositories.addCategory(request);

  return c.json(
    {
      status: "success",
      message: "Kategori produk berhasil ditambahkan",
      data: response,
    },
    201,
  );
});
