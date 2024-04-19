import express from "express";
import { auth } from "../../middlewares.js";

import {
  getAll,
  getById,
  addContact,
  deleteContact,
  actualizeContact,
  actualizeStatusContact,
} from "../../controller/contactsController.js";

const router = express.Router();

router.get("/", auth, getAll);
router.get("/:contactId", auth, getById);
router.post("/", auth, addContact);
router.delete("/:contactId", auth, deleteContact);
router.patch("/:contactId", auth, actualizeContact);
router.patch("/:contactId/favorite", auth, actualizeStatusContact);

export default router;
