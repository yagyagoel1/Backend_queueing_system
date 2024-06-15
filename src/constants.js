export const DB_NAME = "test";
export const defaultJobOptions = {
    removeOnComplete: {
      count: 100,
      age: 60 * 60 * 24,
    },
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnFail: false,
  }; //defaultJobOptions for bullmq email job
  export const redisConnection = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT 
  };