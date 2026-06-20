import {
  UserRepository,
  UserFilters,
} from "../../../core/users/domain/userRepository";
import { UserMapper } from "../mappers/userMapper";
import { User } from "../../../core/users/domain/user";
import { prisma } from "../../../context/prisma";
import { UserRole, UserStatus } from "@prisma/client";

export class PrismaUserRepository implements UserRepository {
  async create(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">,
  ): Promise<User> {
    const createdUser = await prisma.user.create({
      data: {
        fullname: userData.fullname,
        email: userData.email,
        password: userData.password,
        createdBy: userData.createdBy,
        role: userData.role as UserRole,
      },
    });
    return UserMapper.toDomain(createdUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({ where: { email } });
    if (!prismaUser) return null;
    return UserMapper.toDomain(prismaUser);
  }

  async findById(id: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({ where: { id } });
    if (!prismaUser) return null;
    return UserMapper.toDomain(prismaUser);
  }

  async findAll(filters: UserFilters): Promise<User[]> {
    const { fullname, email, role, status, fromDate } = filters;
    const users = await prisma.user.findMany({
      where: {
        ...(fullname && {
          fullname: { contains: fullname, mode: "insensitive" },
        }),
        ...(role && { role: role as UserRole }),
        ...(status && { status: status as UserStatus }),
        ...(email && { email }),
        ...(fromDate && {
          createdAt: {
            gte: new Date(fromDate), // gte = Greater Than or Equal (>=)
          },
        }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return users.map((u) => UserMapper.toDomain(u));
  }

  // Metodo para actualizar un producto
  async update(id: string, userData: Partial<User>): Promise<User> {
    const { role, status, ...restOfData } = userData;
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...restOfData,
        ...(role && { role: role as UserRole }),
        ...(status && { status: status as UserStatus }),
      },
    });
    return UserMapper.toDomain(updatedUser);
  }

  // Metodo para eliminar un usuario (soft delete)
  async deactivate(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { status: "INACTIVE" },
    });
  }
}
