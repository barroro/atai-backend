import express from "express";
import authRouter from "./auth";
import userRouter from "./users";
import roleRouter from "./roles";

const router = express.Router();

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/roles", roleRouter);

export default router;
