import path from "node:path";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import gravatar from "gravatar";
import Jimp from "jimp";
import fs from "node:fs/promises"
import { nanoid } from "nanoid";
import dotenv from "dotenv";

import { IMAGE_DIR } from "../app.js";

dotenv.config();

const SECRET_JWT = process.env.SECRET_JWT;


import {
  findUserByEmail,
  createUser,
  updateToken,
  getUserById,
  updateAvatar
} from "../models/index.js";

import Joi from "joi";
const schema = Joi.object({
  // password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  password: Joi.string().alphanum().min(5).max(30),
  email: Joi.string().email({ minDomainSegments: 2, multiple: true }),
});

//==================================================
const hashPassword = async (pwd) => {
  const saltRounds = 10;

  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(pwd, salt);

  return hash;
};

const validatePassword = (pwd, hash) => bcrypt.compare(pwd, hash);
//======================================================

export const addUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const validateResult = schema.validate(req.body);
    if (validateResult.error || !req.body)
      return res.status(400).json({ message: validateResult.error.message });

    const isEmailTaken = await findUserByEmail(email);
    if (isEmailTaken) res.status(409).json("Email in use");

    const hashedPassword = await hashPassword(password);

    const avatarURL = gravatar.url(email);

    const result = await createUser({ password: hashedPassword, email, avatarURL });
    res.status(201).json({ ResponseBody: result });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const validateResult = schema.validate(req.body);
    if (validateResult.error || !req.body)
      return res.status(400).json({ message: validateResult.error.message });

    const user = await findUserByEmail(email);

    const isValidPassword = await validatePassword(password, user.password);
    if (!user || !isValidPassword)
      return res.status(401).json("Email or password is wrong");

    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, SECRET_JWT);
    await updateToken(user._id, { token });

    res.status(200).json({ token, user });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = null;
    await updateToken(user._id, { token });
    return res.status(204).json({ message: "You have successful logout" });
  } catch (error) {
    next(error);
  }
};

export const currentUser = async (req, res, next) => {
  try {
    return res.status(200).json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}; 

export const actualizeAvatar = async (req, res, next) => {
  try {
    const userId = req.user._id
    const avatarId = nanoid();

    const avatarImg = req.file;

    const newFileName = [avatarId, avatarImg.originalname].join("_");

    const avatarURL = path.join("avatars", newFileName);
    
    Jimp.read(avatarImg.path)
      .then((img) => {
        return img
          .resize(250, 250)
          .write(path.join(IMAGE_DIR, newFileName))
      })
      .then(() => fs.unlink(avatarImg.path))

    await updateAvatar(userId, {avatarURL});
    return res.status(200).json({avatarURL: avatarURL})

  } catch (error) {
    console.error(error);
    next(error)
  }
}