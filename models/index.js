import { Contact, User } from "./schemas/contacts.js"; 

// =======================================CONTACTS================================================
export const listContacts =  (userId) => Contact.find({owner: userId});

export const getContactById = (id) => Contact.findById({_id:id});

export const createContact = ({name, email, phone, owner}) => Contact.create({name, email, phone, owner});

export const removeContact = (id) => Contact.findByIdAndDelete({_id: id});

export const updateContact = (id, actualFields) => Contact.findByIdAndUpdate({_id: id}, actualFields, {new: true});

export const updateStatusContact = (id, actualStatus) => Contact.findByIdAndUpdate({_id: id}, actualStatus, {new: true});


// =========================================USER==================================================
export const findUserByEmail = (email) => User.findOne({email});

export const createUser = ({password, email}) => User.create({password, email});

export const updateToken = (id, token) => User.findByIdAndUpdate({_id: id}, token, {new: true});

export const getUserById = (id) => User.findById({_id: id});
