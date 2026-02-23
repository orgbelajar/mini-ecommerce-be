import type { Context } from "hono";
import { ZodError } from "zod";
import { ClientError } from "../exceptions/index";
// import { logger } from "../applications/logging";

const ErrorHandler = (err: Error, c: Context) => {
  // Handle ClientError dan subclass-nya (InvariantError, NotFoundError)
  // ClientError sudah extend HTTPException, jadi cukup satu pengecekan
  if (err instanceof ClientError) {
    return c.json({ errors: err.message }, err.status);
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return c.json({ errors: err.issues[0].message }, 400);
  }

  // Unhandled error
  console.error("Unhandled error:", err);
  return c.json({ errors: "Internal Server Error" }, 500);
};

export default ErrorHandler;
