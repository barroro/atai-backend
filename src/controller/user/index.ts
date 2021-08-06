import { Request, Response } from "express";
import Joi from "joi";
import argon2 from "argon2";
import { INVALID_FORMAT } from "../../utils/error-codes";
import { User } from "../../entity/User";
import { getRepository } from "typeorm";
import { IPagedRequest } from "src/shared/dtos/IPagedRequest";

const usersFiltersScheme = Joi.object().keys({
  keyword: Joi.string().allow("", null),
  page: Joi.number().default(0),
  pageSize: Joi.number().default(10),
  orderKey: Joi.string().allow("", null),
  orderDirection: Joi.string().allow("", null),
});

export async function getUsers(req: Request, res: Response) {
  const { error, value } = usersFiltersScheme.validate(req.query);
  if (error) {
    return res.status(422).json({
      error_code: INVALID_FORMAT,
      message: error.details.map((x) => x.message).join(", "),
    });
  }

  const pagedRequest: IPagedRequest = value;
  try {
    const userRepository = getRepository(User);
    const count = await userRepository.count();

    const query = userRepository.createQueryBuilder("user");

    if (pagedRequest.keyword)
      query
        .where(
          `LOWER(user.firstName) LIKE '%${pagedRequest.keyword.toLowerCase()}%'`
        )
        .orWhere(
          `LOWER(user.lastName) LIKE '%${pagedRequest.keyword.toLowerCase()}%'`
        )
        .orWhere(
          `LOWER(user.email) LIKE '%${pagedRequest.keyword.toLowerCase()}%'`
        );

    if (pagedRequest.orderKey && pagedRequest.orderDirection)
      query.orderBy(
        `user.${pagedRequest.orderKey}`,
        pagedRequest.orderDirection
      );

    query
      .skip(pagedRequest.pageSize * pagedRequest.page)
      .take(pagedRequest.pageSize);

    const users = await query.getMany();

    return res.status(200).json({
      items: users,
      total: count,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
}

const userCreateScheme = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});

export async function createUser(req: Request, res: Response) {
  const { error, value } = userCreateScheme.validate(req.body);
  const userRepository = getRepository(User);
  if (error) {
    return res.status(422).json({
      error_code: INVALID_FORMAT,
      message: error.details.map((x) => x.message).join(", "),
    });
  }

  try {
    const exists: User | undefined = await userRepository.findOne({
      username: value.username,
      email: value.email,
    });
    if (exists)
      return res.status(409).json({
        error_code: INVALID_FORMAT,
        message: "Username or email already exists",
      });

    const hashedPassword = await argon2.hash(value.password);
    const user = userRepository.create({
      ...value,
      password: hashedPassword,
    });
    await userRepository.save(user);
    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
}

export async function getUserById(req: Request, res: Response) {
  const _id = req.params.id;
  const userRepository = getRepository(User);
  if (!_id) {
    return res.status(422).json({
      error_code: INVALID_FORMAT,
      message: "ID REQUIRED",
    });
  }
  try {
    const user = await userRepository.findOneOrFail(_id, {
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

const userUpdateScheme = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});

export async function updateUser(req: Request, res: Response) {
  const _id = req.params.id;
  if (!_id) {
    return res.status(422).json({
      error_code: INVALID_FORMAT,
      message: "ID REQUIRED",
    });
  }

  const { error, value } = userUpdateScheme.validate(req.body);
  const userRepository = getRepository(User);
  if (error) {
    return res.status(422).json({
      error_code: INVALID_FORMAT,
      message: error.details.map((x) => x.message).join(", "),
    });
  }
  try {
    const user = await userRepository.findOneOrFail(_id);
    user.firstName = value.firstName;
    user.lastName = value.lastName;
    const userUpdated = await userRepository.save(user);
    return res.status(200).json({
      user: userUpdated,
      message: "USER UPDATED",
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
}

export async function deleteUser(req: Request, res: Response) {
  const _id = req.params.id;
  const userRepository = getRepository(User);
  if (!_id) {
    return res.status(422).json({
      error_code: INVALID_FORMAT,
      message: "ID REQUIRED",
    });
  }
  try {
    const results = await userRepository.delete(_id);
    return res.status(200).json({
      userId: results,
      message: "USER DELETED",
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
}
