import express from "express";
import metricsRouter from "./metrics.route.js";
import authRouter from "./auth.route.js";
import queueRouter from "./queue.route.js";
 const router = express.Router();

router.use("/metrics",metricsRouter);

router.use("/auth",authRouter);
router.use("/enqueue",queueRouter);
export default router;