import { Response } from "express";
import chalk from "chalk";
import {
  CREATED_ELEMENT,
  UNPROCESSABLE_ENTITY,
  OK,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  AUTH_FAILED,
  AUTH_MISSING_TOKEN,
} from "../error-codes";

const ResponseHandler = () => {
  const success = (res: Response, msg?: string, body?: any) =>
    res.status(200).send({ message: msg || OK, data: body });

  const created = (res: Response, msg?: string, body?: any) =>
    res.status(201).send({ message: msg || CREATED_ELEMENT, data: body });

  const badRequest = (res: Response, msg?: string, body?: any) =>
    res.status(400).send({ message: msg || BAD_REQUEST, data: body });

  const unauthorized = (res: Response, msg?: string, body?: any) =>
    res.status(401).send({ message: msg || AUTH_FAILED, data: body });

  const authMissingToken = (res: Response, msg?: string, body?: any) =>
    res.status(403).send({ message: msg || AUTH_MISSING_TOKEN, data: body });

  const notfound = (res: Response, msg?: string, body?: any) =>
    res.status(404).send({ message: msg || NOT_FOUND, data: body });

  const unprocessableEntity = (res: Response, msg?: string, body?: any) =>
    res.status(422).send({ message: msg || UNPROCESSABLE_ENTITY, data: body });

  const failedDependency = (res: Response, msg?: string, body?: any) =>
    res.status(424).send({ message: msg || UNPROCESSABLE_ENTITY, data: body });

  const internalError = (res: Response, msg?: string, body?: any) =>
    res.status(500).send({ message: msg || INTERNAL_SERVER_ERROR, data: body });

  const errorHandler = (res: Response, error: Error) => {
    if (error.name === "ValidationError") return badRequest(res, error.message);

    console.log(
      chalk.redBright(
        `Unexpected internal error on request: ${chalk.white.bgRed(
          error.message
        )}`
      )
    );

    return internalError(res, error.message);
  };

  return {
    fail: {
      handle: errorHandler,
      internalError,
      notfound,
      badRequest,
      unprocessableEntity,
      unauthorized,
      failedDependency,
      authMissingToken,
    },
    success: {
      done: success,
      created,
    },
  };
};

export default ResponseHandler;
