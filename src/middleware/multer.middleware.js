import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'text/csv' // .csv
    ];
    
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only Excel and CSV files are allowed.'), false);
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});