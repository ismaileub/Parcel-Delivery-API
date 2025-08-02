import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      role: string;
      id: string;
    };
    req.user = decoded; // Now this will work correctly
    next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    res.status(403).json({ message: "Forbidden access" });
  }
};
