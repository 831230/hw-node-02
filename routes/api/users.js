import express from "express";
import { auth } from "../../middlewares.js";

import { addUser, loginUser, logout, currentUser } from "../../controller/userController.js";

const router = express.Router();

router.post("/signup", addUser);
router.post("/login", loginUser);
router.get("/logout", auth, logout);
router.get("/current", auth, currentUser);

export default router;