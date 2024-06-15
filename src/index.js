import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import cluster from "node:cluster";
import {cpus} from "node:os";
import { Logger } from "./utils/logger.js";

dotenv.config({
  path: "../env",
});
export const logger = Logger();
connectDB()
  .then(() => {
    try {
      app.on("error", () => {
        throw error;
      });
      if(cluster.isPrimary)
      {
        const cpuCount = cpus().length
        for(let i = 0; i<cpuCount;i++)
        {
          cluster.fork()
        }
        cluster.on('exit', (worker, code, signal) => {
          logger.error(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
          cluster.fork();
        });
      }
      else
      {
        app.listen(process.env.PORT, () => {
          logger.info(`Worker ${process.pid} started and listening on port ${process.env.PORT}`);
        });
      }

    } catch (err) {
      logger.error("something went wrong while working initalizing the worker threads " + err);
    }
  })
  .catch((err) => {
    logger.error("database connection failed" + err);
  });
/*
import  express  from "express";
const app = express();
;(async ()=>{
    try {
        mongoose.connect(`${process.env.MONGODB_URL}/
        ${DB_NAME}`)
        app.on("errror",(error)=>{
            console.log("Error: ", error)
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`process is  listening  on port ${process.env.PORT}`)
        })
    }
    catch(error)
    {
        console.error("error",error)
        throw err
    }
})()

*/