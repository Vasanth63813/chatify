import jwt from "jsonwebtoken";
import User from "../model/User.js";
import { ENV } from "../lib/env.js";

export const protectRotues = async (req, res, next) => {
  try {
    
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(400).json({ message: "Unauthorized -Token undefined" });
    }
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded)
      return res.status(400).json({ message: "unauthorized - token Invalid" });

    const user = await User.findById(decoded.UserId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in Auth middleWare")
    res.status(400).json({message:"Internal Error"})
  }
};
