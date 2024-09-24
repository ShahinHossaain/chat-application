const createError = require("http-errors");
const multer = require("multer");
const path = require("path");

const uploader = (
    subfolder_path,
    allowed_file_types,
    max_file_size,
    error_msg
) => {
    // FILE UPLOAD FOLDER 
    const UPLOADS_FOLDER = `__dirname/../public/uploads/${subfolder_path}`

    //DEFINE THE STORAGE 
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, UPLOADS_FOLDER)
        },
        filename: (req, file, cb) => {
            const fileExt = path.extname(file.originalname);
            const fileName = file.originalname
                .replace(fileExt, "")
                .toLowerCase()
                .split(" ")
                .join("-") + "-" + Date.now();

            cb(null, fileName + fileExt);
        }
    });

    // PREPARE THE FINAL MULTER UPLOAD OBJECT
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: max_file_size
        },
        fileFilter: (req, file, cb) => {

            if (allowed_file_types.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(createError(error_msg));
            }
        }
    })
    return upload;
};

module.exports = uploader;