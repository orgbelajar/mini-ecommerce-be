import { prisma } from "../../../applications/database";
import {
  AddProductRequest,
  EditProductRequest,
  RestockProductRequest,
  ProductResponse,
  toProductResponse,
} from "../../../model/product-model";
import { nanoid } from "nanoid";
import NotFoundError from "../../../exceptions/not-found-error";

export class ProductRepository {
  static async addProduct(
    request: AddProductRequest,
  ): Promise<ProductResponse> {
    const id = `product-${nanoid(17)}`;

    const product = await prisma.product.create({
      data: {
        id,
        ...request,
      },
    });

    return toProductResponse(product);
  }

  static async getProductById(id: string): Promise<ProductResponse> {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundError("Produk tidak ditemukan");
    }

    return toProductResponse(product);
  }

  static async editProductById(
    id: string,
    request: EditProductRequest,
  ): Promise<ProductResponse> {
    await this.getProductById(id);

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        ...request,
      },
    });

    return toProductResponse(product);
  }

  static async restockProduct(
    id: string,
    request: RestockProductRequest,
  ): Promise<ProductResponse> {
    await this.getProductById(id);

    const product = await prisma.product.update({
      where: { id },
      data: {
        stock: { increment: request.stock },
      },
    });

    return toProductResponse(product);
  }

  static async addImageProductById(
    id: string,
    fileLocation: string,
  ): Promise<void> {
    // Cek produk ada atau tidak
    await this.getProductById(id);

    // Update gambar produk jika gambar produk sebelumnya ada
    await prisma.product.update({
      where: {
        id,
      },
      data: {
        image: fileLocation,
      },
    });
  }

  static async deleteProductById(id: string): Promise<void> {
    await this.getProductById(id);

    await prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
