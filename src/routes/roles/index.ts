import express from "express";
import {
  getRoles,
  createRole,
  deleteRole,
  getRoleById,
  updateRole,
} from "../../controller/role";
import { Auth } from "../../middlewares/check-auth";
import checkPermissions from "../../middlewares/check-permissions";

const roleRouter = express.Router();

roleRouter.get("/", Auth, checkPermissions("SHOW_ROLES"), getRoles);
roleRouter.get("/:id", Auth, checkPermissions("SHOW_ROLES"), getRoleById);
roleRouter.post("/", Auth, checkPermissions("CREATE_ROLE"), createRole);
roleRouter.put("/:id", Auth, checkPermissions("UPDATE_ROLE"), updateRole);
roleRouter.delete("/:id", Auth, checkPermissions("DELETE_ROLE"), deleteRole);

export default roleRouter;
