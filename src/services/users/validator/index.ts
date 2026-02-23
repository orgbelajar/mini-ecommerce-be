import { z, ZodType } from "zod";
import { RegisterUserRequest } from "../../../model/user-model";

// export class UserValidation {
//   static readonly REGISTER: ZodType<RegisterUserRequest> = z.object({
//     username: z.string().min(1).max(50),
//     password: z.string().min(1).max(100),
//     fullname: z.string().min(1).max(100),
//   });
// }

export const userPayloadSchema: ZodType<RegisterUserRequest> = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(1).max(100),
  fullname: z.string().min(1).max(100),
});