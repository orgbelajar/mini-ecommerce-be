// import { Authentication } from "../../generated/prisma/client";

export type RefreshTokenRequest = {
  token: string;
};

export type AuthenticationResponse = {
  accessToken: string;
  refreshToken: string;
};

export type VerifyUserCredentialRequest = {
  username: string;
  password: string;
};

// export function toAuthenticationResponse(authentication: Authentication): AuthenticationResponse {
//   return {
//     accessToken: authentication.accessToken,
//     refreshToken: authentication.refreshToken,
//   };
// }