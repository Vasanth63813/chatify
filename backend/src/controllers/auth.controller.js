import { sendWelcomeEmail } from "../email/emailHandler.js";
import cloudinary from "../lib/cloudinary.js";
import { sender } from "../lib/resend.js";
import { getJwtToken } from "../lib/utils.js";
import User from "../model/User.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;

  try {
    // 1. Required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // 2. Password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // 3. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // 4. Check existing user
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // 5. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. Create user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    console.log("Saving user...");

    // 7. Save to MongoDB
    const savedUser = await newUser.save();

    console.log("User saved:", savedUser._id);

    // 8. Generate JWT
    getJwtToken(savedUser._id, res);

    try {
      await sendWelcomeEmail(
        savedUser.email,
        savedUser.fullName,
        process.env.CLIENT_URL,
      );
    } catch (error) {
      console.error("SEND EMAIL ERRROP");
    }

    // 9. Send response
    return res.status(201).json({
      _id: savedUser._id,
      fullName: savedUser.fullName,
      email: savedUser.email,
      profilePic: savedUser.profilePic,
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ Message: "All feilds are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found pls signUp" });
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    getJwtToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login controller", error);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const logout = (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logout successfully" });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic) {
      return res.status(400).json({ message: " profile pic required" });
    }
    const response = await cloudinary.uploader.upload({ profilePic });
    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: response.secure_url },
      { new: true },
    );
    return res.status(200).json({ updateProfile });
  } catch (error) {
    console.log("Error in update profile pic");

    res.status(500).json({ message: "Internal Error" });
  }
};
