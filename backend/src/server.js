import express from "express";
import dotenv from "dotenv";

import path from "path";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import { connectDb } from "./lib/db.js";

dotenv.config();

const __dirname = path.resolve();
const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

//make ready for deployment
//frontend and backend in same port
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(port, () => {
  console.log("server is running in", port);
  connectDb();
});
