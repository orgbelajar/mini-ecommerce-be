import { Hono } from "hono";
import { addCategoryPayloadSchema } from "../validator";
import { CategoryRepositories } from "../repositories";

export const categoryController = new Hono();

categoryController.post("/api/category", async (c) => {
  const request = addCategoryPayloadSchema.parse(await c.req.json());

  const response = await CategoryRepositories.addCategory(request);

  return c.json(
    {
      status: "success",
      message: "Category berhasil ditambahkan",
      data: response,
    },
    201,
  );
});
