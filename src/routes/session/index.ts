import express from "express";
import { Auth } from "../../middlewares/check-auth";
import { getCurrentSession } from "../../controller/session";

const sessionRouter = express.Router();

sessionRouter.get("/getCurrentSession", Auth, getCurrentSession);

export default sessionRouter;
