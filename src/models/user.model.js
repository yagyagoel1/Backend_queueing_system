import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        index:true

    },
    password:{
        type:String,
        requried: [true, "password  is requried"],
    },
    token:{
        type:String
    }
    },{timestamps:true});
    

const User = mongoose.model('User',userSchema);
userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
});
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
userSchema.generateToken = async function () {
    return await jwt.sign(
      {
        _id: this._id,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRY }
    );
  };

export default User;