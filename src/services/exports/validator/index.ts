import { z } from "zod";

export const exportOrderPayloadSchema = z.object({
  cartId: z.string().min(1, "cartId wajib diisi"),
  targetEmail: z.string().email("Format email tidak valid"),
});
