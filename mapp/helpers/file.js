const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadFile = (field, main) => {
    const storage = multer.diskStorage({
        destination: (req, file, res) => {
            res(null, `./public/uploads/${main}`)
        },
        filename: (req, file, res) => {
            res(null, file.fieldname + "_" + Date.now() + "_" + file.originalname)
        }
    });
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: 1 * 1024 * 1024,
        }
    }).single(field);

    return upload;
}

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

