import express from "express";
import {
  getUsers,
  createUser,
  deleteUser,
  getUserById,
  updateUser,
} from "../../controller/user";
import { Auth } from "../../middlewares/check-auth";
import checkPermissions from "../../middlewares/check-permissions";

const userRouter = express.Router();

// userRouter.get("/", Auth, checkPermissions("SHOW_USERS"), getUsers);
userRouter.get("/", Auth, checkPermissions("SHOW_USERS"), getUsers);
userRouter.get("/:id", Auth, checkPermissions("SHOW_USERS"), getUserById);
userRouter.post("/", Auth, checkPermissions("CREATE_USER"), createUser);
userRouter.put("/:id", Auth, checkPermissions("UPDATE_USER"), updateUser);
userRouter.delete("/:id", Auth, checkPermissions("DELETE_USER"), deleteUser);

export default userRouter;
