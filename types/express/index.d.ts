import type { JwtPayload } from "jsonwebtoken";
import { Request } from "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}
