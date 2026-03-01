import { Hono } from "hono";
import { ProductRepository } from "../repositories/index";
import {
  addProductPayloadSchema,
  editProductPayloadSchema,
  restockProductPayloadSchema,
} from "../validator/index";
import InvariantError from "../../../exceptions/invariant-error";
import {
  ALLOWED_IMAGE_TYPES,
  ensureUploadDir,
  MAX_FILE_SIZE,
  MIME_TO_EXT,
  UPLOAD_DIR,
} from "../storage/storage-config";

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

productController.post("/api/upload/:id/image", async (c) => {
  const id = c.req.param("id");

  const body = await c.req.parseBody();
  const file = body["image"];

  // Validasi: pastikan file ada dan bertipe File
  if (!file || !(file instanceof File)) {
    throw new InvariantError("File gambar wajib diunggah pada field 'image'");
  }

  // Validasi: tipe file
  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type as (typeof ALLOWED_IMAGE_TYPES)[number],
    )
  ) {
    throw new InvariantError(
      "Tipe file tidak didukung. Gunakan JPEG, JPG, PNG, atau WebP",
    );
  }

  // Validasi: ukuran file
  if (file.size > MAX_FILE_SIZE) {
    throw new InvariantError("Ukuran file melebihi batas maksimum 5MB");
  }

  // Pastikan direktori upload ada
  await ensureUploadDir();

  // Generate nama file unik
  const ext = MIME_TO_EXT[file.type];
  const originalName = file.name.replace(/\.[^/.]+$/, "");
  const filename = `${Date.now()}-${originalName}.${ext}`;
  const filepath = `${UPLOAD_DIR}/${filename}`;

  // Simpan file ke disk menggunakan Bun API
  const buffer = await file.arrayBuffer();
  await Bun.write(filepath, buffer);

  // Buat URL lokasi file
  const host = process.env.HOST || "localhost";
  const port = process.env.PORT || 3000;
  const fileLocation = `http://${host}:${port}/images/${encodeURIComponent(filename)}`;

  await ProductRepository.addImageProductById(id, fileLocation);

  return c.json(
    {
      status: "success",
      message: "Gambar produk berhasil diunggah",
      data: { fileLocation },
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
