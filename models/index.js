import { Contact } from "./schemas/contacts.js";

export const listContacts =  () => Contact.find({});

export const getContactById = (id) => Contact.findById({_id:id});

export const createContact = ({name, email, phone}) => Contact.create({name, email, phone});

export const removeContact = (id) => Contact.findByIdAndDelete({_id: id});

export const updateContact = (id, actualFields) => Contact.findByIdAndUpdate({_id: id}, actualFields, {new: true});

export const updateStatusContact = (id, actualStatus) => Contact.findByIdAndUpdate({_id: id}, actualStatus, {new: true});
