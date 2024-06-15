import User from "../models/user.model.js";
import { validateAuth } from "../schemas/auth.schema.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";

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

export {signup}
