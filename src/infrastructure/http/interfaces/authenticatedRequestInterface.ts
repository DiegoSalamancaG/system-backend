import { Request } from "express";

export interface MulterFileInMemory {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer; // ⭐️ Esto es lo que usa tu ImageUploadService
}
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };

  file?: MulterFileInMemory | any;
  files?: MulterFileInMemory[] | any;
}
