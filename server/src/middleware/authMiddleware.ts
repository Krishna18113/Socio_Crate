import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
// import { PrismaClient } from "generated/prisma";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface JwtPayload {
  id: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      const user = await prisma.user.findUnique({ where: { id: decoded.id } });

      if (!user) {
        res.status(401).json({ message: "User not found" });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "No token, authorization denied" });
  }
};
