import { Hono } from "hono";
import { CollaborationRepositories } from "../repositories/index";
import { CartRepositories } from "../../carts/repositories/index";
import { collaborationPayloadSchema } from "../validator/index";
import { authMiddleware } from "../../../middlewares/auth";
import { ApplicationVariables } from "../../../model/app-model";

export const collaborationController = new Hono<{
  Variables: ApplicationVariables;
}>();

collaborationController.use(authMiddleware);

// TODO
collaborationController.post("/api/collaborations", async (c) => {
  const user = c.get("user");
  const request = collaborationPayloadSchema.parse(await c.req.json());

  // Hanya owner cart yang berhak menambah kolaborator
  await CartRepositories.verifyCartOwner({
    cartId: request.cartId,
    ownerId: user.id,
  });

  const response = await CollaborationRepositories.addCollaboration(request);

  return c.json(
    {
      status: "success",
      message: "Kolaborasi berhasil ditambahkan",
      data: response,
    },
    201,
  );
});

// TODO
collaborationController.delete("/api/collaborations", async (c) => {
  const user = c.get("user");
  const request = collaborationPayloadSchema.parse(await c.req.json());

  // Hanya owner cart yang berhak menghapus kolaborator
  await CartRepositories.verifyCartOwner({
    cartId: request.cartId,
    ownerId: user.id,
  });

  await CollaborationRepositories.deleteCollaboration(request);

  return c.json(
    {
      status: "success",
      message: "Kolaborasi berhasil dihapus",
    },
    200,
  );
});
