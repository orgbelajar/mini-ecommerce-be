import { Hono } from "hono";
import { authMiddleware } from "../../../middlewares/auth";
import { ApplicationVariables } from "../../../model/app-model";
import { exportOrderPayloadSchema } from "../validator/index";
import { ExportPublisher } from "../publisher/index";
import type { ExportOrderMessage } from "../../../model/export-model";

export const exportController = new Hono<{
  Variables: ApplicationVariables;
}>();

exportController.post("/api/export/order", authMiddleware, async (c) => {
  const request = exportOrderPayloadSchema.parse(await c.req.json());
  const credential = c.get("user");

  const message: ExportOrderMessage = {
    cartId: request.cartId,
    targetEmail: request.targetEmail,
    userId: credential.id as string,
    username: credential.username as string,
    requestedAt: new Date().toISOString(),
  };

  await ExportPublisher.publishExportOrder(message);

  return c.json(
    {
      status: "success",
      message:
        "Permintaan export sedang diproses. Laporan akan dikirim ke email Anda.",
    },
    201,
  );
});
