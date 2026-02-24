import { prisma } from "../../../applications/database";
import InvariantError from "../../../exceptions/invariant-error";

export class AuthenticationRepository {
  static async addRefreshToken(token: string) {
    return prisma.authentication.create({
      data: {
        token,
      },
    });
  }

  static async verifyRefreshToken(token: string) {
    const result = await prisma.authentication.findUnique({
      where: {
        token,
      },
    });

    if (!result) {
      throw new InvariantError("Refresh token tidak valid");
    }

    return result;
  }

  static async deleteRefreshToken(token: string) {
    return prisma.authentication.delete({
      where: {
        token,
      },
    });
  }
}
