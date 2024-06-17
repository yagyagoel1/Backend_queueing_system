import { Queue, Worker } from 'bullmq';
import { redisConnection } from '../constants.js';
import { logger } from '../index.js';

const connection = redisConnection
const userQueues = new Map(); // Map to hold queues for each user
const inactivityTimers = new Map(); // Map to hold inactivity timers for each user

// Function to create or get a queue for a user
function getOrCreateQueue(userId) {
    if (!userQueues.has(userId)) {
        const queue = new Queue(userId, { connection });
        userQueues.set(userId, { queue, worker: null });
    }
    return userQueues.get(userId).queue;
}

// Function to process requests in the user's queue
function processUserQueue(userId) {
    const userQueue = userQueues.get(userId).queue;

    if (!userQueues.get(userId).worker) {
        const worker = new Worker(userId, async (job) => {
            // Simulate processing the job (replace with actual processing logic)
            logger.info(`Processing job ${job.id} for user ${userId}`);
            console.log(JSON.stringify(job.data))
            if(job.data.task=="A"){
                console.log("Task A")
            await new Promise((resolve) => setTimeout(resolve, 5000));
            }
            else if(job.data.task=="B"){
                console.log("Task B")

            await new Promise((resolve) => setTimeout(resolve,3000));
            }
            else if(job.data.task=="C"){
                console.log("Task C")
            await new Promise((resolve) => setTimeout(resolve, 1000));
            }     
            logger.info(`Job ${job.id} completed for user ${userId}`);
        }, { connection });

        userQueues.get(userId).worker = worker;

        // Remove the queue and worker when all jobs are completed
        worker.on('completed', async () => {
            const jobCounts = await userQueue.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed');
            if (jobCounts.waiting === 0 && jobCounts.active === 0) {
                // Set an inactivity timer to remove the queue after 10 minutes
                const timer = setTimeout(async () => {
                    await worker.close();
                    await userQueue.close();
                    userQueues.delete(userId);
                    inactivityTimers.delete(userId);
                    logger.info(`All jobs completed for user ${userId}. Queue deleted after inactivity.`);
                }, 10 * 60 * 1000);

                inactivityTimers.set(userId, timer);
            }
        });

        // Handle worker errors
        worker.on('failed', (job, err) => {
            logger.error(`Job ${job.id} failed for user ${userId}:`, err);
            logger.error(`${JSON.stringify(job.data)}`)
            //store the job

        });
        worker.on('error', (err) => {
            logger.error(`Worker error for user ${userId}:`, err);
            logger.error(`${JSON.stringify(job.data)}`)
        });
    }
}

// Function to add a request to the user's queue
export async function addRequest(userId, request) {
    const queue = getOrCreateQueue(userId);
    await queue.add('request', request);

    // Clear the inactivity timer if the queue is active again
    if (inactivityTimers.has(userId)) {
        clearTimeout(inactivityTimers.get(userId));
        inactivityTimers.delete(userId);
    }

    processUserQueue(userId);
}
