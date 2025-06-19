import { UserType } from "@common/DbTypes";

declare global {
  namespace Express {
    interface Request {
      user?: UserType;
    }
  }
}
