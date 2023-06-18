const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Func upload file
const uploadFile = (field, main, fileSizeMb = 1, fileExtention = 'png|jpg|gif|jpeg') => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `./public/uploads/${main}`)
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname)
        }
    });

    const upload = multer({
        storage: storage,
        limits: {
            fileSize: fileSizeMb * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            const fileTypes = new RegExp(fileExtention);
            const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
            const mimeType = fileTypes.test(file.mimetype);

            if (mimeType && extName) {
                return cb(null, true);
            } else {
                req.errors = ['Error upload file']; // Thêm dòng này để gán giá trị lỗi vào biến errors của request
                cb('Error upload file');
            }
        }
    }).single(field);

    return upload;
}

// Func remove file
let removeFile = (folder, fileName) => {
    if (fileName != "" && fileName != undefined) {
        let path = _basedir + folder + '/' + fileName;
        //console.log(`path delete `, path);
        if (fs.existsSync(path)) fs.unlink(path, (err) => { if (err) throw err; });
    }
}

module.exports = {
    upload: uploadFile,
    remove: removeFile
}

