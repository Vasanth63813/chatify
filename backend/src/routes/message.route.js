import express from "express";
import { protectRotues } from "../middleware/auth.middleware.js";
import { getAllcontacts, sendMessage ,getMessageById} from "../controllers/message.controller.js";

const router = express.Router();

router.get('/contacts',protectRotues,getAllcontacts)
 router.get('/chatpartner',protectRotues)
router.get('/:id',protectRotues,getMessageById)
router.post("/send/:id",protectRotues,sendMessage);

export default router;