import { ApiError } from "../utils/ApiError.js";

import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";




export const verifyUser = asyncHandler(async (req, res, next) => {
  const { token} = req.cookies;
    if (!token) {
        return res.status(401).json(new ApiError(401, "You need to login first"));
    }

  try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(payload._id).select("-password");
    if (!user  || user.token != token) {
      return res.status(401).json(new ApiError(401, "User not found"));
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json(new ApiError(401, "Invalid token"));
  }
})