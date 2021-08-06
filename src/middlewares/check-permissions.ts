import { NextFunction, Response } from "express";
import { FORBIDDEN } from "../utils/error-codes";
import { IPermission } from "../utils/permissions";

export default function checkPermissions(
  ...permittedRoles: Array<IPermission>
) {
  return (request: any, response: Response, next: NextFunction) => {
    const { user } = request;
    console.log(user);
    if (user) {
      next();
    } else {
      response.status(403).json({ message: FORBIDDEN }); // user is forbidden
    }
  };
}
