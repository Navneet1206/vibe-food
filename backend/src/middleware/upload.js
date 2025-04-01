const multer = require("multer");
const path = require("path");

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "uploads/";

    // Set upload path based on file type
    if (file.fieldname === "avatar") {
      uploadPath += "avatars/";
    } else if (file.fieldname === "restaurantImage") {
      uploadPath += "restaurants/";
    } else if (file.fieldname === "menuItemImage") {
      uploadPath += "menu-items/";
    } else if (file.fieldname === "document") {
      uploadPath += "documents/";
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    "image/jpeg": true,
    "image/png": true,
    "image/jpg": true,
    "application/pdf": true,
    "application/msword": true,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": true,
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, JPG, PDF, and DOC files are allowed."
      ),
      false
    );
  }
};

// Configure upload limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Export upload configurations for different use cases
module.exports = {
  // Single file uploads
  uploadAvatar: upload.single("avatar"),
  uploadRestaurantImage: upload.single("restaurantImage"),
  uploadMenuItemImage: upload.single("menuItemImage"),
  uploadDocument: upload.single("document"),

  // Multiple file uploads
  uploadRestaurantImages: upload.array("images", 5), // Max 5 images
  uploadMenuItemImages: upload.array("images", 3), // Max 3 images
  uploadDocuments: upload.array("documents", 4), // Max 4 documents

  // Mixed uploads
  uploadRestaurant: upload.fields([
    { name: "images", maxCount: 5 },
    { name: "documents", maxCount: 2 },
  ]),
  uploadMenuItem: upload.fields([
    { name: "image", maxCount: 1 },
    { name: "additionalImages", maxCount: 2 },
  ]),
  uploadDeliveryPartner: upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "documents", maxCount: 4 },
  ]),
};
