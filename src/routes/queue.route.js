import express from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { processTaska } from "../controllers/queue.controller.js";




const router = express.Router();

router.route("/dotaska").get(verifyUser,processTaska);

export default router;