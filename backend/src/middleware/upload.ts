import multer from "multer";
import path from "path";
// Set up storage engine
const storage = multer.diskStorage({
  destination: "./uploads/", // Make sure this folder exists in your backend root
  filename: function (req, file, cb) {
    // Create a unique filename to avoid overwrites
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // Limit file size to 10MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("file"); // 'file' is the name of the input field in the form
// Check File Type
function checkFileType(
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif|pdf|zip/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Images, PDFs, or ZIP files only!"));
  }
}
export default upload;

const imageFileFilter = function (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Images only!"));
  }
};

export const uploadPortfolioImage = multer({
  storage: storage, // We can reuse the same storage engine
  limits: { fileSize: 5000000 }, // A smaller limit for images, e.g., 5MB
  fileFilter: imageFileFilter,
}).single("portfolioImage"); // Use a specific field name
