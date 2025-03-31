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
    folder: "gatiyan-food",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

// Configure upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload an image."), false);
    }
  },
});

const cloudinaryService = {
  // Upload single image
  uploadSingle: (fieldName) => upload.single(fieldName),

  // Upload multiple images
  uploadMultiple: (fieldName, maxCount) => upload.array(fieldName, maxCount),

  // Delete image from Cloudinary
  deleteImage: async (publicId) => {
    try {
      await cloudinary.uploader.destroy(publicId);
      return true;
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  },

  // Get image URL
  getImageUrl: (publicId, options = {}) => {
    return cloudinary.url(publicId, options);
  },

  // Upload base64 image
  uploadBase64: async (base64String, folder = "gatiyan-food") => {
    try {
      const result = await cloudinary.uploader.upload(base64String, {
        folder,
        resource_type: "auto",
      });
      return result;
    } catch (error) {
      console.error("Error uploading base64 image:", error);
      throw error;
    }
  },
};

module.exports = cloudinaryService;
