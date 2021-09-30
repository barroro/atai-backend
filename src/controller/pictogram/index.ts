import { Request, Response } from "express";
import Joi from "joi";
import { INVALID_FORMAT } from "../../utils/error-codes";
import { Pictogram } from "../../entity/Pictogram";
import { getRepository } from "typeorm";
import { IPagedRequest } from "src/shared/dtos/IPagedRequest";

const pictogramsFiltersScheme = Joi.object().keys({
  keyword: Joi.string().allow("", null),
  page: Joi.number().default(0),
  pageSize: Joi.number().default(10),
  orderKey: Joi.string().allow("", null),
  orderDirection: Joi.string().allow("", null),
});

export async function getPictograms(req: Request, res: Response) {
  const { error, value } = pictogramsFiltersScheme.validate(req.query);
  if (error) {
    return res.status(422).json({
      error_code: INVALID_FORMAT,
      message: error.details.map((x) => x.message).join(", "),
    });
  }

  const pagedRequest: IPagedRequest = value;
  try {
    const pictogramRepository = getRepository(Pictogram);
    const count = await pictogramRepository.count();

    const query = pictogramRepository.createQueryBuilder("pictogram");

    if (pagedRequest.keyword)
      query
        .where(
          `LOWER(pictogram.name) LIKE '%${pagedRequest.keyword.toLowerCase()}%'`
        )
        .orWhere(
          `LOWER(pictogram.description) LIKE '%${pagedRequest.keyword.toLowerCase()}%'`
        );

    if (pagedRequest.orderKey && pagedRequest.orderDirection)
      query.orderBy(
        `Pictogram.${pagedRequest.orderKey}`,
        pagedRequest.orderDirection
      );

    query
      .skip(pagedRequest.pageSize * pagedRequest.page)
      .take(pagedRequest.pageSize);

    const pictograms = await query.getMany();

    return res.status(200).json({
      items: pictograms,
      total: count,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
}

const pictogramCreateScheme = Joi.object().keys({
  name: Joi.string().required(),
  categoryId: Joi.number().required(),
  description: Joi.string().allow("", null),
});

export async function createPictogram(req: Request, res: Response) {
  const { error, value } = pictogramCreateScheme.validate(req.body);
  const pictogramRepository = getRepository(Pictogram);
  if (error) {
    return res.status(422).json({
      error_code: INVALID_FORMAT,
      message: error.details.map((x) => x.message).join(", "),
    });
  }

  try {
    const exists: Pictogram | undefined = await pictogramRepository.findOne({
      name: value.name,
    });
    if (exists)
      return res.status(409).json({
        error_code: INVALID_FORMAT,
        message: "Pictogram already exists",
      });

    const pictogram = pictogramRepository.create(value);
    await pictogramRepository.save(pictogram);
    return res.status(200).json({
      pictogram,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
}

export async function getPictogramById(req: Request, res: Response) {
  const _id = req.params.id;
  const pictogramRepository = getRepository(Pictogram);
  if (!_id) {
    return res.status(422).json({
      error_code: INVALID_FORMAT,
      message: "ID REQUIRED",
    });
  }
  try {
    const pictogram = await pictogramRepository.findOneOrFail(_id, {
      relations: ["category"],
    });
    return res.status(200).json({
      pictogram,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
}

const pictogramUpdateScheme = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  categoryId: Joi.number().required(),
});

export async function updatePictogram(req: Request, res: Response) {
  const _id = req.params.id;
  if (!_id) {
    return res.status(422).json({
      error_code: INVALID_FORMAT,
      message: "ID REQUIRED",
    });
  }

  const { error, value } = pictogramUpdateScheme.validate(req.body);
  const pictogramRepository = getRepository(Pictogram);
  if (error) {
    return res.status(422).json({
      error_code: INVALID_FORMAT,
      message: error.details.map((x) => x.message).join(", "),
    });
  }
  try {
    const pictogram = await pictogramRepository.findOneOrFail(_id);
    pictogram.name = value.name;
    pictogram.description = value.description;
    pictogram.categoryId = value.category;
    const pictogramUpdated = await pictogramRepository.save(pictogram);
    return res.status(200).json({
      pictogram: pictogramUpdated,
      message: "Pictogram UPDATED",
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
}

export async function deletePictogram(req: Request, res: Response) {
  const _id = req.params.id;
  const pictogramRepository = getRepository(Pictogram);
  if (!_id) {
    return res.status(422).json({
      error_code: INVALID_FORMAT,
      message: "ID REQUIRED",
    });
  }
  try {
    const results = await pictogramRepository.delete(_id);
    return res.status(200).json({
      id: results,
      message: "Pictogram DELETED",
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
}
