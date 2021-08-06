import express from "express";
import { authenticate } from "../../controller/auth";

const authRouter = express.Router();

authRouter.post("/authenticate", authenticate);

export default authRouter;
