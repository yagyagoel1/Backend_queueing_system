import express from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { processTaskA,processTaskB, processTaskC } from "../controllers/queue.controller.js";




const router = express.Router();

router.route("/dotaska").get(verifyUser,processTaskA);
router.route("/dotaskb").get(verifyUser,processTaskB);
router.route("/dotaskc").get(verifyUser,processTaskC);

export default router;