import express from "express";
import {
  createPictogram,
  deletePictogram,
  getPictogramById,
  updatePictogram,
  getPictograms,
} from "../../controller/pictogram";
import { Auth } from "../../middlewares/check-auth";

const pictogramRouter = express.Router();

pictogramRouter.get("/", Auth, getPictograms);
pictogramRouter.get("/:id", Auth, getPictogramById);
pictogramRouter.post("/", Auth, createPictogram);
pictogramRouter.put("/:id", Auth, updatePictogram);
pictogramRouter.delete("/:id", Auth, deletePictogram);

export default pictogramRouter;
