import { Request } from "express";

export interface UserSession {
  id: string;
  role: string;
}
export interface AuthenticatedRequest extends Request {
  user?: UserSession;
}
