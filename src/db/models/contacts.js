import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

contactSchema.pre('save', (next) => {
  console.log('A new contact is being created:', this);
  next();
});

contactSchema.post('save', (doc) => {
  console.log('Contact saved:', doc);
});

const ContactCollection = model('contacts', contactSchema);

export default ContactCollection;
