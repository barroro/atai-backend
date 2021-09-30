import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entity/User";
import { getRepository } from "typeorm";
import ResponseHandler from "../utils/responseHandler";
import {
  AUTH_FAILED,
  AUTH_MISSING_TOKEN,
  INCORRECT_JWT_SIGN,
} from "../utils/error-codes";

const jwtSecret = process.env.JWT_SECRET || "";

export const Auth = async (req: any, res: Response, next: NextFunction) => {
  const userRepository = getRepository(User);
  try {
    if (req.path.startsWith("/auth")) return next();

    if (req.headers.authorization == undefined)
      return ResponseHandler().fail.authMissingToken(res, AUTH_MISSING_TOKEN);

    const token = req.headers.authorization.split(" ")[1];
    if (
      !token.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
    ) {
      return ResponseHandler().fail.unauthorized(res, INCORRECT_JWT_SIGN);
    }
    const decoded: any = jwt.verify(token, jwtSecret);
    const user = await userRepository.findOne(decoded.userId);
    req.user = user;
    if (!user) return ResponseHandler().fail.unauthorized(res, AUTH_FAILED);

    next();
  } catch (error) {
    return ResponseHandler().fail.unauthorized(res, AUTH_FAILED);
  }
};
