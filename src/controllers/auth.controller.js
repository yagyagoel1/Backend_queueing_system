import User from "../models/user.model.js";
import { validateAuth } from "../schemas/auth.schema.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import bcrypt from "bcrypt";
const signup=  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
   const validate = await validateAuth({email, password});
   if(validate.error){
      return res.status(400).json(new ApiError(400,validate.error.errors[0].message));

   }
   const userExists = await User.findOne({ email });
   if(userExists){
       return res.status(400).json(new ApiError(400,"User already exists"));
   }
    const user = await User.create({ email, password });
    return res.status(201).json(new ApiResponse(201,"User created successfully",{email:user.email,id:user._id}));
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const validate = await validateAuth({email, password});
    if(validate.error){
        return res.status(400).json(new ApiError(400,validate.error.errors[0].message));
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json(new ApiError(401,"Invalid email or password"));
    }
    const validatePassword = await user.isPasswordCorrect(password);

    if (!validatePassword) {
        return res.status(401).json(new ApiError(401,"Invalid email or password"));
    }
    const token = await user.generateToken();
    return res.status(200).cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }).json(new ApiResponse(200,"User logged in successfully",{email:user.email,id:user._id}));
})
export {signup,login}
