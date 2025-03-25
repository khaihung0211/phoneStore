const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = file.fieldname + "-" + Date.now() + ext;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
