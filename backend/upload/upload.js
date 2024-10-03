const multer = require('multer')
const path = require('path')
const destination = path.join(__dirname, '../uploadedFiles/')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, destination)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const extname = path.extname(file.originalname).toLowerCase();
        if (extname === '.zip') {
            console.log("valid zip file")
            cb(null, true)
        }
        else {
            cb(new Error('Only .gip files are allowed!'), false);
          }
    }
})

module.exports = upload