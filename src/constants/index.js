import path from 'path';

export const SortOrder = {
  ASC: 'asc',
  DESC: 'desc',
};

export const ContactTypes = {
  WORK: 'work',
  HOME: 'home',
  PERSONAL: 'personal',
};

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

export const TEMPLATE_DIR = path.join(process.cwd(), 'src', 'templates');

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
