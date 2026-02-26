import { prisma } from "../../../applications/database";
import {
  AddCategoryRequest,
  CategoryResponse,
} from "../../../model/category-model";
import { nanoid } from "nanoid";
import { InvariantError } from "../../../exceptions/index";

export class CategoryRepositories {
  static async addCategory(
    request: AddCategoryRequest,
  ): Promise<CategoryResponse> {
    const id = `category-${nanoid(17)}`;

    const category = await prisma.category.create({
      data: {
        id,
        ...request,
      },
    });

    if (!category) {
      throw new InvariantError("Category gagal ditambahkan");
    }

    return { categoryId: category.id };
  }
}
