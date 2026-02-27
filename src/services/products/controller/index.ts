import { Hono } from "hono";
import { ProductRepository } from "../repositories/index";
import {
  addProductPayloadSchema,
  editProductPayloadSchema,
  restockProductPayloadSchema,
} from "../validator/index";

export const productController = new Hono();

productController.post("/api/product", async (c) => {
  const request = addProductPayloadSchema.parse(await c.req.json());

  const response = await ProductRepository.addProduct(request);

  return c.json(
    {
      status: "success",
      message: "Produk berhasil ditambahkan",
      data: response,
    },
    201,
  );
});

productController.get("/api/product/:id", async (c) => {
  const id = c.req.param("id");

  const response = await ProductRepository.getProductById(id);

  return c.json(
    {
      status: "success",
      data: response,
    },
    200,
  );
});

productController.patch("/api/product/:id", async (c) => {
  const id = c.req.param("id");
  const request = editProductPayloadSchema.parse(await c.req.json());

  const response = await ProductRepository.editProductById(id, request);

  return c.json(
    {
      status: "success",
      message: "Produk berhasil diperbarui",
      data: response,
    },
    200,
  );
});

productController.patch("/api/product/:id/stock", async (c) => {
  const id = c.req.param("id");
  const request = restockProductPayloadSchema.parse(await c.req.json());

  const response = await ProductRepository.restockProduct(id, request);

  return c.json(
    {
      status: "success",
      message: "Stok produk berhasil ditambahkan",
      data: response,
    },
    200,
  );
});

productController.delete("/api/product/:id", async (c) => {
  const id = c.req.param("id");

  await ProductRepository.deleteProductById(id);

  return c.json(
    {
      status: "success",
      message: "Produk berhasil dihapus",
    },
    200,
  );
});
