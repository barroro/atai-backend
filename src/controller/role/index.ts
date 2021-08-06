import { Request, Response } from "express";
import Joi from "joi";
import { INTERNAL_SERVER_ERROR, INVALID_FORMAT } from "../../utils/error-codes";
import { getRepository } from "typeorm";
import { IPagedRequest } from "src/shared/dtos/IPagedRequest";
import { Role } from "../../entity/Role";

const rolesFiltersScheme = Joi.object().keys({
  keyword: Joi.string().allow("", null),
  page: Joi.number().default(0),
  pageSize: Joi.number().default(10),
  orderKey: Joi.string().allow("", null),
  orderDirection: Joi.string().allow("", null),
});

export async function getRoles(req: Request, res: Response) {
  const { error, value } = rolesFiltersScheme.validate(req.query);
  if (error) {
    return res.status(422).json({
      error_code: INVALID_FORMAT,
      message: error.details.map((x) => x.message).join(", "),
    });
  }

  const pagedRequest: IPagedRequest = value;
  try {
    const roleRepository = getRepository(Role);
    const count = await roleRepository.count();

    const query = roleRepository.createQueryBuilder("role");

    if (pagedRequest.keyword)
      query
        .where(
          `LOWER(role.name) LIKE '%${pagedRequest.keyword.toLowerCase()}%'`
        )
        .orWhere(
          `LOWER(role.description) LIKE '%${pagedRequest.keyword.toLowerCase()}%'`
        );

    if (pagedRequest.orderKey && pagedRequest.orderDirection)
      query.orderBy(
        `role.${pagedRequest.orderKey}`,
        pagedRequest.orderDirection
      );

    query
      .skip(pagedRequest.pageSize * pagedRequest.page)
      .take(pagedRequest.pageSize);

    const roles = await query.getMany();

    return res.status(200).json({
      items: roles,
      total: count,
    });
  } catch (error) {
    return res.status(500).json({
      error: INTERNAL_SERVER_ERROR,
      message: error,
    });
  }
}

const roleCreateScheme = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().allow("", null),
});

export async function createRole(req: Request, res: Response) {
  const { error, value } = roleCreateScheme.validate(req.body);
  const roleRepository = getRepository(Role);
  if (error) {
    return res.status(422).json({
      error_code: INVALID_FORMAT,
      message: error.details.map((x) => x.message).join(", "),
    });
  }

  try {
    const exists: Role | undefined = await roleRepository.findOne({
      name: value.name,
    });
    if (exists)
      return res.status(409).json({
        error_code: INVALID_FORMAT,
        message: "Name already exists",
      });

    const role = roleRepository.create(value);
    await roleRepository.save(role);
    return res.status(200).json({
      role,
      message: "ROLE CREATED",
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
}

export async function getRoleById(req: Request, res: Response) {
  const _id = req.params.id;
  const roleRepository = getRepository(Role);
  if (!_id) {
    return res.status(422).json({
      error_code: INVALID_FORMAT,
      message: "ID REQUIRED",
    });
  }
  try {
    const role = await roleRepository.findOneOrFail(_id);
    return res.status(200).json({
      role,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
}

const roleUpdateScheme = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});

export async function updateRole(req: Request, res: Response) {
  const _id = req.params.id;
  if (!_id) {
    return res.status(422).json({
      error_code: INVALID_FORMAT,
      message: "ID REQUIRED",
    });
  }

  const { error, value } = roleUpdateScheme.validate(req.body);
  const roleRepository = getRepository(Role);
  if (error) {
    return res.status(422).json({
      error_code: INVALID_FORMAT,
      message: error.details.map((x) => x.message).join(", "),
    });
  }
  try {
    const role = await roleRepository.findOneOrFail(_id);
    role.name = value.description;
    role.description = value.description;
    const roleUpdated = await roleRepository.save(role);
    return res.status(200).json({
      role: roleUpdated,
      message: "ROLE UPDATED",
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
}

export async function deleteRole(req: Request, res: Response) {
  const _id = req.params.id;
  const roleRepository = getRepository(Role);
  if (!_id) {
    return res.status(422).json({
      error_code: INVALID_FORMAT,
      message: "ID REQUIRED",
    });
  }
  try {
    const results = await roleRepository.delete(_id);
    return res.status(200).json({
      roleId: results,
      message: "ROLE DELETED",
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
}
