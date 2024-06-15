import { login, signup } from "../controllers/auth.controller.js";
import express from "express";



const router = express.Router();


router.route("/signup").post(signup);

router.route("/login").post(login);
export default router;