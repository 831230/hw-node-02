import express from "express";
import { auth } from "../../middlewares.js";

import { upload } from "../../upload.js";

import { addUser, loginUser, logout, currentUser, actualizeAvatar } from "../../controller/userController.js";

const router = express.Router();

router.post("/signup", addUser);
router.post("/login", loginUser);
router.get("/logout", auth, logout);
router.get("/current", auth, currentUser);
router.patch("/avatars", auth, upload.single("avatar"), actualizeAvatar);

export default router;