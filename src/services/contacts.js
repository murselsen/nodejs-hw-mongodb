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

  const contact = await ContactCollection.findById(id);
  console.log('Contact found:', contact);
  if (!contact) {
    console.error(`Contact with id ${id} not found`);
    return null; // Eğer contact bulunamazsa null döner
  }
  console.log('Contact retrieved successfully:', contact);
  return contact; // null ise null döner, varsa contact döner
};

export const createContact = async (payload) => {
  try {
    const result = await ContactCollection.create(payload);
    if (!result) {
      console.error('Contact creation failed:', result);
      return null; // Oluşturma başarısızsa null döner
    }
    return result; // Başarılı ise oluşturulan contact döner
  } catch (error) {
    console.error('Error in createContact:', error);
    return null; // Hata durumunda null döndür
  }
};

export const deleteContact = async (id) => {
  if (!isValidObjectId(id)) return null;

  const result = await ContactCollection.findByIdAndDelete(id, {
    sort: true,
  });
  if (!result) {
    console.error(`Contact with id ${id} not found for deletion`);
    return null; // Eğer contact bulunamazsa null döner
  }
  console.log('Contact deleted successfully:', result);
  return true; // Başarılı ise silinen true döner
};

export const updateContact = async (id, payload) => {
  if (!isValidObjectId(id)) return null;

  const result = await ContactCollection.findByIdAndUpdate(
    {
      _id: id,
    },
    payload,
    { runValidators: false }
  );

  if (!result) {
    return null;
  }
  return result;
};
