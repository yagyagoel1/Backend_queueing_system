import { logger } from "../index.js";
  
const asyncHandler = (fn)=>async (req,res,next)=>{
      try {
          await fn(req,res,next)
      }
      catch (error){
          res.status(error.code||500).json({
              success:false,
              message : "internal server error"
          })
          //store the user info 
          logger.error(error.message,error)
          console.log(error.response.data)
      }
  }
  export { asyncHandler };