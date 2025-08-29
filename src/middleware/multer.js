import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_UPLOAD_DIR);
  }, 
  filename: (req, file, cb) => {
    console.log('Multer | Upload File info:');
    console.log(file);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });
