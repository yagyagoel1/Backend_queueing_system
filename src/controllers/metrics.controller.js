import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prometheus } from "../utils/prometheus.js";

const metrics = asyncHandler(async (req, res) => {
  if(req.headers.metricspass != process.env.METRICS_PASSWORD){
    return res.status(401).json(new ApiError(401,"Unauthorized"));
   
  }
    res.set('Content-Type', prometheus.register.contentType);
    res.status(200).send(await prometheus.register.metrics());
  });
export {metrics}