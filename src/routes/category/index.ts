import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../../controller/category";
import { Auth } from "../../middlewares/check-auth";

const categoryRouter = express.Router();

categoryRouter.get("/", Auth, getCategories);
categoryRouter.get("/:id", Auth, getCategoryById);
categoryRouter.post("/", Auth, createCategory);
categoryRouter.put("/:id", Auth, updateCategory);
categoryRouter.delete("/:id", Auth, deleteCategory);

export default categoryRouter;
