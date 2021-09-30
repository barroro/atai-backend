import { Request, Response } from "express";
import Joi from "joi";
import { INVALID_FORMAT } from "../../utils/error-codes";
import { Category } from "../../entity/Category";
import { getRepository } from "typeorm";

export async function getCategories(req: Request, res: Response) {
  try {
    const categoryRepository = getRepository(Category);
    const categories = await categoryRepository.find();
    return res.status(200).json({
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
}

const categoryCreateScheme = Joi.object().keys({
  name: Joi.string().required(),
});

export async function createCategory(req: Request, res: Response) {
  const { error, value } = categoryCreateScheme.validate(req.body);
  const categoryRepository = getRepository(Category);
  if (error) {
    return res.status(422).json({
      error_code: INVALID_FORMAT,
      message: error.details.map((x) => x.message).join(", "),
    });
  }

  try {
    const exists: Category | undefined = await categoryRepository.findOne({
      name: value.name,
    });
    if (exists)
      return res.status(409).json({
        error_code: INVALID_FORMAT,
        message: "Category already exists",
      });

    const category = categoryRepository.create(value);
    await categoryRepository.save(category);
    return res.status(200).json({
      category,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
}

export async function getCategoryById(req: Request, res: Response) {
  const _id = req.params.id;
  const categoryRepository = getRepository(Category);
  if (!_id) {
    return res.status(422).json({
      error_code: INVALID_FORMAT,
      message: "ID REQUIRED",
    });
  }
  try {
    const category = await categoryRepository.findOneOrFail(_id, {
      relations: ["category"],
    });
    return res.status(200).json({
      category,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
}

const categoryUpdateScheme = Joi.object().keys({
  name: Joi.string().required(),
});

export async function updateCategory(req: Request, res: Response) {
  const _id = req.params.id;
  if (!_id) {
    return res.status(422).json({
      error_code: INVALID_FORMAT,
      message: "ID REQUIRED",
    });
  }

  const { error, value } = categoryUpdateScheme.validate(req.body);
  const categoryRepository = getRepository(Category);
  if (error) {
    return res.status(422).json({
      error_code: INVALID_FORMAT,
      message: error.details.map((x) => x.message).join(", "),
    });
  }
  try {
    const category = await categoryRepository.findOneOrFail(_id);
    category.name = value.name;
    const categoryUpdated = await categoryRepository.save(category);
    return res.status(200).json({
      category: categoryUpdated,
      message: "Category UPDATED",
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
}

export async function deleteCategory(req: Request, res: Response) {
  const _id = req.params.id;
  const categoryRepository = getRepository(Category);
  if (!_id) {
    return res.status(422).json({
      error_code: INVALID_FORMAT,
      message: "ID REQUIRED",
    });
  }
  try {
    const results = await categoryRepository.delete(_id);
    return res.status(200).json({
      id: results,
      message: "Category DELETED",
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
}
