import { User } from "./user";

export interface UserFilters {
  fullname?: string;
  email?: string;
  role?: string;
  status?: string;
  fromDate?: string;
}

export interface UserRepository {
  create(
    user: Omit<
      User,
      "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy"
    >,
  ): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, userData: Partial<User>): Promise<User | null>;
  findAll(filters: UserFilters): Promise<User[]>;
  deactivate(id: string): Promise<void | null>;
}
