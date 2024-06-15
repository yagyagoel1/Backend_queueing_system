import express from "express";
import { metrics } from "../controllers/metrics.controller.js";

const router = express.Router();

router.route("/").get(metrics);


export default router;