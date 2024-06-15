import express from "express";
import metricsRouter from "./metrics.route.js";

 const router = express.Router();

router.use("/metrics",metricsRouter);



export default router;