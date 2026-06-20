import { User as PrismaUserModel } from "@prisma/client";
import { User } from "../../../core/users/domain/user";

export class UserMapper {
  static toDomain(prismaUser: PrismaUserModel): User {
    return {
      id: prismaUser.id,
      fullname: prismaUser.fullname,
      email: prismaUser.email,
      password: prismaUser.password,
      role: prismaUser.role,
      status: prismaUser.status,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      createdBy: prismaUser.createdBy ?? null,
      updatedBy: prismaUser.updatedBy ?? null,
    };
  }

  static toDomainResponse(
    user: PrismaUserModel | User,
  ): Omit<
    User,
    "password" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy"
  > {
    return {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      status: user.status,
    };
  }
}
