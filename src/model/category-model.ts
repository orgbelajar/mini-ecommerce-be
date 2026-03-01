import { Category } from "../../generated/prisma/client";

export type CategoryRequest = {
  name: string;
};

export type CategoryResponse = {
  categoryId: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export const toAddCategoryResponse = (category: Category): CategoryResponse => {
  return {
    categoryId: category.id,
    name: category.name,
    createdAt: category.createdAt,
  };
};

export const toGetCategoryByIdResponse = (category: Category): CategoryResponse => {
  return {
    categoryId: category.id,
    name: category.name,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
};

export const toEditCategoryResponse = (category: Category): CategoryResponse => {
  return {
    categoryId: category.id,
    name: category.name,
    updatedAt: category.updatedAt,
  };
};
  