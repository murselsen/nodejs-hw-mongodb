import {
  getAllContacts,
  getContactById,
  createContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getAllContactsController = async (req, res, next) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await getContactById(contactId);
    console.log('Contact found:', contact);
    if (!contact) {
      next(createHttpError(404, 'Contact not found'));
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    console.error('Error fetching contact by ID:', error);
  }
};

export const createContactController = async (req, res, next) => {
  const payload = req.body;
  try {
    const result = await createContact(payload);
    if (!result) {
      return next(createHttpError(400, 'Contact creation failed'));
    }
    res.status(201).json({
      status: 201,
      message: 'Contact created successfully!',
      data: result,
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    next(createHttpError(500, 'Internal Server Error'));
  }
};
