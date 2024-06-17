import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { middleware } from "./utils/prometheus.js";
import router from "./routes/index.route.js";
import { rateLimit } from "express-rate-limit";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:4000",
    credentials: true,
  })
);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: "Too many requests from this IP, please try again after 15 minutes",});

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(middleware);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).send(` ${process.pid} Hello World`);
});
app.use("/api/v1", router);
export { app };






