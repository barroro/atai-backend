import { Response } from "express";
import { User } from "../../entity/User";
import { getRepository } from "typeorm";
import ResponseHandler from "../../utils/responseHandler";
import { INCORRECT_JWT_SIGN } from "../../utils/error-codes";

export async function getCurrentSession(req: any, res: Response) {
  const userRepository = getRepository(User);

  const userId = req.user ? req.user.id : null;

  if (!userId)
    return ResponseHandler().fail.unauthorized(res, INCORRECT_JWT_SIGN);

  try {
    const user = await userRepository.findOneOrFail(userId, {
      select: ["firstName", "email", "lastName", "username", "id"],
      relations: ["roles"],
    });
    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
}
