const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

const express = require("express");

const Joi = require("joi");
const schema = Joi.object({
  name: Joi.string().alphanum().min(2).max(30),
  email: Joi.string().email({ minDomainSegments: 2, multiple: true }),
  phone: Joi.string().alphanum().min(9).max(15),
});

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json(contacts);
  } catch (error) {
    next(error)
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const searchedContact = await getContactById(id);
    searchedContact
      ? res.status(200).json(searchedContact)
      : res.status(404).json({ message: "Not found" });
  } catch (error) {
    next(error)
  }
});

router.post("/", async (req, res, next) => {
  try {
    const validateResult = schema.validate(req.body);
    if (validateResult.error || !req.body)
      return res.status(400).json({ message: validateResult.error.message });

    const newContact = await addContact(req.body);
    res.status(201).json({ newContact });
  } catch (error) {
    next(error)
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const result = await removeContact(id);

    if (!result) res.status(404).json({ message: "Not found" });
    if (result) res.status(200).json({ message: result });
  } catch (error) {
    next(error)
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const body = req.body;

    const validateResult = schema.validate(body);
    if (validateResult.error || !body)
      return res.status(400).json({ message: validateResult.error.message });

    const result = await updateContact(id, body);

    if (!result) res.status(404).json({ message: "Not found" });
    if (result) res.status(200).json({ message: result });
  } catch (error) {
    next(error)
  }
});

module.exports = router;
