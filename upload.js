import { join } from "path";
import path from "node:path";
import multer from "multer";
import { nanoid } from "nanoid";

const UPLOAD_DIR = join(process.cwd(), "upload");

const extensionWhiteList = [".jpg", ".jpeg", ".png", ".gif"];
const mimetypeWhiteList = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, callback) => {
    const date = Date.now();
    const id = nanoid();
    const fileName = [date, id, file.originalname].join("_");

    const extension = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;
    if (
      !extensionWhiteList.includes(extension) ||
      !mimetypeWhiteList.includes(mimetype)
  ) {
    return callback(null, false)
  }
    callback(null, fileName);
  },

  limits: { fileSize: 1_000_000 },
});

export const upload = multer({ storage });
