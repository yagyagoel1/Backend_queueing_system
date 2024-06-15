import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { addRequest } from "../utils/queue.js";

const processTaska = asyncHandler(async (req, res) => {
    await addRequest(req.user._id, {task: "A"});

    return res.status(200).json(new ApiResponse(200, "Task A added to queue"));
});

export { processTaska}
