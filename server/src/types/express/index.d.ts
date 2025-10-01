import { Request } from "express";
import { PrismaClient } from "@prisma/client";
import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User;  // <-- use Prisma's User type here
    }
  }
}






// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         id: string;
//         name?: string;
//         email?: string;
//       };
//     }
//   }
// }

