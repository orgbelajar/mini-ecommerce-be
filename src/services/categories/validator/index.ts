import { z, ZodType } from "zod";
import { AddCategoryRequest } from "../../../model/category-model";

export const addCategoryPayloadSchema: ZodType<AddCategoryRequest> = z.object({
  name: z.string().min(1).max(100),
});
