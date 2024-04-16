import {
  listContacts,
  getContactById,
  createContact,
  removeContact,
  updateContact,
  updateStatusContact,
} from "../models/index.js";

import Joi from "joi";
const schema = Joi.object({
  name: Joi.string().alphanum().min(2).max(30),
  email: Joi.string().email({ minDomainSegments: 2, multiple: true }),
  phone: Joi.string().alphanum().min(9).max(15),
  favorite: Joi.boolean().default(false),
});

export const getAll = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const contacts = await listContacts(userId);

    if (!req.user.token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    if (!req.user.token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const id = req.params.contactId;
    const searchedContact = await getContactById(id);
    searchedContact
      ? res.status(200).json(searchedContact)
      : res.status(404).json({ message: "Not found" });
  } catch (error) {
    next(error);
  }
};

export const addContact = async (req, res, next) => {
  try {
    if (!req.user.token) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const { name, email, phone } = req.body;

    const validateResult = schema.validate(req.body);
    if (validateResult.error || !req.body)
      return res.status(400).json({ message: validateResult.error.message });

    const newContact = await createContact({
      name,
      email,
      phone,
      owner: req.user._id,
    });
    res.status(201).json({ newContact });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    if (!req.user.token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const id = req.params.contactId;
    const result = await removeContact(id);

    if (!result) res.status(404).json({ message: "Not found" });
    if (result) res.status(200).json({ message: result });
  } catch (error) {
    next(error);
  }
};

export const actualizeContact = async (req, res, next) => {
  try {
    if (!req.user.token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const id = req.params.contactId;
    const validateResult = schema.validate(req.body);
    if (validateResult.error || !req.body)
      return res.status(400).json({ message: validateResult.error.message });

    const result = await updateContact(id, req.body);

    if (!result) res.status(404).json({ message: "Not found" });
    if (result) res.status(200).json({ message: result });
  } catch (error) {
    next(error);
  }
};

export const actualizeStatusContact = async (req, res, next) => {
  try {
    if (!req.user.token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const id = req.params.contactId;
    const validateResult = schema.validate(req.body);
    if (validateResult.error || !req.body)
      return res.status(400).json({ message: validateResult.error.message });

    const result = await updateStatusContact(id, req.body);
    if (!result) res.status(404).json({ message: "Not found" });
    if (result) res.status(200).json({ message: result });
  } catch (error) {
    next(error);
  }
};
