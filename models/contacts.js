const fs = require("fs/promises");
const path = require("path");
const process = require("process");

const contactsPath = path.join(process.cwd(), "models", "contacts.json");
const serializeData = (data) => JSON.stringify(data);

const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath);
  return JSON.parse(contacts);
};

const getContactById = async (contactId) => {
  const contacts = await fs.readFile(contactsPath);
  const contactById = JSON.parse(contacts).find(
    (contact) => contact.id === contactId
  );
  return contactById;
};

const removeContact = async (contactId) => {
  const contacts = await fs.readFile(contactsPath);
  const isValidId = JSON.parse(contacts).find((el) => el.id === contactId);
  if (!isValidId) return isValidId;

  const newContacts = JSON.parse(contacts).filter(
    (contact) => contact.id !== contactId
  );

  await fs.writeFile(contactsPath, serializeData(newContacts));

  return "contact deleted";
};

const addContact = async (body) => {
  const contacts = await fs.readFile(contactsPath);
  const { name, email, phone } = body;
  const id = new Date().getTime().toString();

  const newContact = {
    id,
    name,
    email,
    phone,
  };

  const parsedContacts = JSON.parse(contacts);
  const newContacts = [...parsedContacts, newContact];
  await fs.writeFile(contactsPath, serializeData(newContacts));

  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await fs.readFile(contactsPath);

  const isValidId = JSON.parse(contacts).find((el) => el.id === contactId);
  if (!isValidId) return isValidId;

  const updatedContacts = JSON.parse(contacts).map((contact) => {
    if (contact.id !== contactId) {
      return contact;
    } else {
      return {
        id: contactId,
        name: body.name ? body.name : contact.name,
        email: body.email ? body.email : contact.email,
        phone: body.phone ? body.phone : contact.phone,
      };
    }
  });

  await fs.writeFile(contactsPath, serializeData(updatedContacts));

  const updatedContact = {};
  updatedContacts.forEach((contact) => {
    if (contact.id === contactId) {
      updatedContact.id = contact.id;
      updatedContact.name = contact.name;
      updatedContact.email = contact.email;
      updatedContact.phone = contact.phone;
    }
  });

  return updatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
