const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { uploadToCloudinary } = require('../utils/cloudinary');
const asyncHandler = require('../utils/asyncHandler');

// Use local persistent uploads folder, falling back to /tmp on Vercel (read-only environment)
const uploadDir = process.env.VERCEL 
  ? path.join(os.tmpdir(), 'uploads')
  : path.join(__dirname, '../uploads');

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn('Could not create uploads directory (expected on some read-only platforms):', err.message);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const router = express.Router();

router.post('/image', upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload an image file');
  }

  // We return a path pointing to our server's static folder dynamically
  const relativeUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  
  return res.status(200).json({
    success: true,
    url: relativeUrl,
    public_id: `local-${req.file.filename}`
  });
}));

module.exports = router;
