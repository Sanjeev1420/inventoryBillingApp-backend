import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const destination = function(req, file, cb) {
    let folder;
    if (req.originalUrl.includes('/addBrand')) {
        folder = 'brand';
    } else if (req.originalUrl.includes('/addProduct')) {
        folder = 'product';
    } else {
        folder = 'other';
    }
    const destinationPath = `./public/Uploads/${folder}`;
    cb(null, destinationPath);
};


const storage = multer.diskStorage({
    destination: destination,
    filename: function(req, file, cb) {
        cb(null, `${uuidv4()}${file.originalname}`); // Remove underscore before extension
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const uploadMiddleware = multer({ storage });

export default uploadMiddleware;
