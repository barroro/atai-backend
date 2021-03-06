import express from "express";
import authRouter from "./auth";
import userRouter from "./users";
import roleRouter from "./roles";
import sessionRouter from "./session";
import categoryRouter from "./category";
import pictogramRouter from "./pictogram";

const router = express.Router();

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/roles", roleRouter);
router.use("/session", sessionRouter);
router.use("/pictograms", pictogramRouter);
router.use("/categories", categoryRouter);

export default router;
