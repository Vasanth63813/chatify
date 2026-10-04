import express from "express";
import { login, logout, signup,updateProfile } from "../controllers/auth.controller.js";
import { protectRotues } from "../middleware/auth.middleware.js";
import { arcjetProtect } from "../middleware/arcjet.middleware.js";

const router = express.Router();

//router.use(arcjetProtect)

router.get('/test',(req,res)=>{
    res.send("Test arcjet middleware")
})
router.post("/login", login);
router.post("/logout", logout);
router.post("/signup", signup);

router.put('/updateProfile',protectRotues,updateProfile)

router.get('/check',protectRotues,(req,res)=>{
    res.status(200).json(req.user);
})

export default router;
