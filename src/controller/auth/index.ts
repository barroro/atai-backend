import { Request, Response } from "express";
import Joi from "joi";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { AUTH_FAILED, INVALID_FORMAT } from "../../utils/error-codes";
import { User } from "../../entity/User";
import { getRepository } from "typeorm";

const jwtSecret = process.env.JWT_SECRET || "";

const userCreateScheme = Joi.object().keys({
  usernameOrEmail: Joi.string().required(),
  password: Joi.string().required(),
});

export async function authenticate(req: Request, res: Response) {
  const userRepository = getRepository(User);
  const { error, value } = userCreateScheme.validate(req.body);

  if (error) {
    return res.status(422).json({
      error_code: INVALID_FORMAT,
      message: error.details.map((x) => x.message).join(", "),
    });
  }

  try {
    const userFound: User | undefined = await userRepository.findOne({
      where: [
        { username: value.usernameOrEmail },
        { email: value.usernameOrEmail },
      ],
    });

    if (!userFound)
      return res.status(409).json({
        error_code: INVALID_FORMAT,
        message: "User doesn't exists",
      });

    const verify = await argon2.verify(userFound.password, value.password);
    if (!verify)
      return res.status(409).json({
        error_code: AUTH_FAILED,
        message: "UNAUTHORIZED",
      });
    console.log(verify);
    const payload = {
      userId: userFound.id,
      email: userFound.email,
      username: userFound.username,
    };
    const token = jwt.sign(payload, jwtSecret);
    return res.status(200).json({
      authenticated: true,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error,
    });
  }
}
