import ContactCollection from '../db/models/contacts.js';

export const getAllContacts = async () => {
  try {
    const contacts = await ContactCollection.find();
    return contacts;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};
export const getContactById = async (id) => {
  try {
    const contact = await ContactCollection.findById(id);
    if (!contact) {
      throw new Error('Contact not found');
    }
    return contact;
  } catch (error) {
    console.error('Error fetching contact by ID:', error);
    throw error;
  }
};


