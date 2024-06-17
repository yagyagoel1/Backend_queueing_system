import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { addRequest } from "../utils/queue.js";

const processTaskA = asyncHandler(async (req, res) => {
    await addRequest("fsdfsfdsfsadf", {task: "A"});

    return res.status(200).json(new ApiResponse(200, "Task A added to queue"));
});
const processTaskB = asyncHandler(async (req, res) => {
    await addRequest("fsdfsfdsfsadf", {task: "B"});

    return res.status(200).json(new ApiResponse(200, "Task B added to queue"));
});
const processTaskC = asyncHandler(async (req, res) => {
    await addRequest("fsdfsfdsfsadf", {task: "C"});

    return res.status(200).json(new ApiResponse(200, "Task C added to queue"));
});
export { processTaskA,processTaskB,processTaskC}
