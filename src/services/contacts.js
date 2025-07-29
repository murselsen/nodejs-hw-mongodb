import { isValidObjectId } from 'mongoose';
import ContactCollection from '../db/models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await ContactCollection.find();
  console.log('Contacts found:', contacts);
  if (!contacts) {
    return null;
  }
  return contacts;
};
export const getContactById = async (id) => {
  if (!isValidObjectId(id)) return null;

  try {
    const contact = await ContactCollection.findById(id);
    console.log('Contact found:', contact);
    return contact; // null ise null döner, varsa contact döner
  } catch (error) {
    console.error('Error in getContactById:', error);
    return null; // Hata durumunda null döndür
  }
};
