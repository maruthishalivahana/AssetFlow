import { existsSync, mkdirSync } from 'fs';
import path from 'path';

import multer from 'multer';

import { env } from './env';

export const uploadDir = path.resolve(process.cwd(), env.UPLOAD_DIR);

if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

export const multerStorage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDir);
  },
  filename: (_req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
