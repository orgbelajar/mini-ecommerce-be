import { User } from "../../generated/prisma/client";

export type RegisterUserRequest = {
  username: string;
  password: string;
  fullname: string;
};

export type UserResponse = {
  id: string;
  username: string;
  fullname: string;
};

export type VerifyUsernameRequest = {
  username: string;
};

export type VerifyCredentialRequest = {
  username: string;
  password: string;
};

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    username: user.username,
    fullname: user.fullname,
  };
}
