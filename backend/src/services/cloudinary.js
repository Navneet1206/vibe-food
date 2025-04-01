const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, file) => {
      // Set folder based on file type
      if (file.fieldname === "avatar") {
        return "avatars";
      } else if (file.fieldname === "restaurantImage") {
        return "restaurants";
      } else if (file.fieldname === "menuItemImage") {
        return "menu-items";
      } else if (file.fieldname === "document") {
        return "documents";
      }
      return "uploads";
    },
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
    transformation: [
      { width: 800, height: 800, crop: "limit" },
      { quality: "auto" },
    ],
  },
});

// Configure upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = {
      "image/jpeg": true,
      "image/png": true,
      "image/jpg": true,
      "application/pdf": true,
    };

    if (allowedTypes[file.mimetype]) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, JPG, and PDF files are allowed."
        ),
        false
      );
    }
  },
});

// Upload single file
const uploadSingle = (fieldName) => upload.single(fieldName);

// Upload multiple files
const uploadMultiple = (fieldName, maxCount) =>
  upload.array(fieldName, maxCount);

// Upload mixed files
const uploadMixed = (fields) => upload.fields(fields);

// Delete file
const deleteFile = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
};

// Get file URL
const getFileUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, options);
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadMixed,
  deleteFile,
  getFileUrl,
  cloudinary,
};
