const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Storage configuration with custom destination based on route/field
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'avatars';
    if (file.fieldname === 'cover') {
      folder = 'covers';
    } else if (file.fieldname === 'portfolio') {
      folder = 'portfolios';
    } else if (file.fieldname === 'product' || file.fieldname === 'preview') {
      folder = 'products';
    }

    const dir = path.join(__dirname, '..', 'uploads', folder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// File filter for image security
const fileFilter = (req, file, cb) => {
  const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WEBP, GIF, and SVG images are allowed!'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter,
});

module.exports = upload;
