const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { uploadToCloudinary } = require('../utils/cloudinary');
const asyncHandler = require('../utils/asyncHandler');

// Use /tmp for serverless environments (like Vercel)
const uploadDir = process.env.NODE_ENV === 'production' 
  ? path.join(os.tmpdir(), 'uploads')
  : path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
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

  const folder = req.body.folder || 'products';

  // If Cloudinary keys are template defaults, keep file locally as a static asset!
  const hasCloudinary = process.env.CLOUDINARY_API_KEY && 
                        process.env.CLOUDINARY_API_KEY !== 'your_api_key' && 
                        process.env.CLOUDINARY_API_KEY !== '';

  if (!hasCloudinary) {
    console.warn('Cloudinary credentials not detected, falling back to local static serving.');
    
    // We return a path pointing to our server's static folder dynamically
    const relativeUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    return res.status(200).json({
      success: true,
      url: relativeUrl,
      public_id: `local-${req.file.filename}`
    });
  }

  // Upload to Cloudinary
  const result = await uploadToCloudinary(req.file.path, folder);
  if (!result) {
    res.status(500);
    throw new Error('Cloudinary upload connection failed');
  }

  res.status(200).json({
    success: true,
    url: result.secure_url,
    public_id: result.public_id
  });
}));

module.exports = router;
