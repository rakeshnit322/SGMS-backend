import multer from 'multer';


export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: 'File upload error',
            error: err.message
        });
    }

    return res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
};