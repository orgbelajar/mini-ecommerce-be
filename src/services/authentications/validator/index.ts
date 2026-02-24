import { z, ZodType } from "zod";
import { RefreshTokenRequest, VerifyUserCredentialRequest } from "../../../model/auth-model";

export const refreshTokenPayloadSchema: ZodType<RefreshTokenRequest> = z.object({
  token: z.string().nonempty(),
});

export const verifyUserCredentialPayloadSchema: ZodType<VerifyUserCredentialRequest> = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(1).max(100),
});