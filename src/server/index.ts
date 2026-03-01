import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { userController } from "../services/users/controller/index";
import { productController } from "../services/products/controller/index";
import { authenticationController } from "../services/authentications/controller/index";
import { cartController } from "../services/carts/controller/index";
import { collaborationController } from "../services/collaborations/controller/index";
import { categoryController } from "../services/categories/controller/index";
import ErrorHandler from "../middlewares/error";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// Serving file statis dari folder images
app.use(
  "/images/*", // /images/1234567890-foto.jpg (dari fileLocation)
  // "./src/services/products/files" + "/images/1234567890-foto.jpg"
  serveStatic({
    root: "./src/services/products/files",
  }),
);

app.route("/", authenticationController);
app.route("/", userController);
app.route("/", productController);
app.route("/", categoryController);
app.route("/", cartController);
app.route("/", collaborationController);

app.onError(ErrorHandler);

export default app;
