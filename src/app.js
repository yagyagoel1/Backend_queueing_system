import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { middleware } from "./utils/prometheus.js";
import router from "./routes/index.route.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:4000",
    credentials: true,
  })
);
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






