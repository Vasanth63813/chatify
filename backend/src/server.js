import express from "express";
import dotenv from "dotenv";

import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";


dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

app.use("/api/auth", authRouter);
app.use("/api/message",messageRouter);

app.listen(port, () => {
  console.log("server is running in", port);
});
