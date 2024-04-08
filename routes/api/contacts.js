import express from "express";

import {
  getAll,
  getById,
  addContact,
  deleteContact,
  actualizeContact,
  actualizeStatusContact
} from "../../controller/controller.js";

const router = express.Router();

router.get("/", getAll);
router.get("/:contactId", getById);
router.post("/", addContact);
router.delete("/:contactId", deleteContact);
router.patch("/:contactId", actualizeContact);
router.patch("/:contactId/favorite", actualizeStatusContact);

export default router;
