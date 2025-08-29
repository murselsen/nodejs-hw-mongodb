import fs from 'fs/promises';
import { v2 as cloudinary } from 'cloudinary';

import { env } from './env.js';
import { CLOUDINARY } from '../constants/index.js';

cloudinary.config({
  cloud_name: env(CLOUDINARY.cloud_name),
  api_key: env(CLOUDINARY.api_key),
  api_secret: env(CLOUDINARY.api_secret),
  secure: true,
});

export const saveFile = async (file) => {
  const response = await cloudinary.uploader.upload(file.path);

  await fs.unlink(file.path);

  return response.secure_url;
};
