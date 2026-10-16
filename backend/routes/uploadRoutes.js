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
    const ext = path.extname(file.originalname) || '.png';
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9.\-_]/g, '');
    cb(null, `${Date.now()}-${baseName || 'image'}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
});

const router = express.Router();

const isCloudinaryConfigured = () => {
  return (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY !== 'your_api_key'
  );
};

// Single image upload
router.post('/image', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'Image size exceeds the 25MB limit.' });
      }
      return res.status(400).json({ success: false, message: err.message || 'Error processing uploaded file.' });
    }
    next();
  });
}, asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload an image file' });
  }

  // Attempt Cloudinary upload if configured
  if (isCloudinaryConfigured()) {
    try {
      const cloudRes = await uploadToCloudinary(req.file.path, req.body.folder || 'products');
      if (cloudRes && cloudRes.secure_url) {
        return res.status(200).json({
          success: true,
          url: cloudRes.secure_url,
          public_id: cloudRes.public_id
        });
      }
    } catch (cErr) {
      console.warn('Cloudinary upload failed, falling back to local storage URL:', cErr.message);
    }
  }

  // Local storage fallback
  const relativeUrl = `${req.protocol}://${req.get('host')}/uploads/${encodeURIComponent(req.file.filename)}`;
  
  return res.status(200).json({
    success: true,
    url: relativeUrl,
    public_id: `local-${req.file.filename}`
  });
}));

// Multiple images upload
router.post('/multiple', (req, res, next) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'One or more images exceed the 25MB limit.' });
      }
      return res.status(400).json({ success: false, message: err.message || 'Error processing uploaded files.' });
    }
    next();
  });
}, asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'Please upload at least one image file' });
  }

  const results = [];
  const useCloud = isCloudinaryConfigured();

  for (const file of req.files) {
    let uploadedUrl = null;
    let publicId = null;

    if (useCloud) {
      try {
        const cloudRes = await uploadToCloudinary(file.path, req.body.folder || 'products');
        if (cloudRes && cloudRes.secure_url) {
          uploadedUrl = cloudRes.secure_url;
          publicId = cloudRes.public_id;
        }
      } catch (cErr) {
        console.warn('Cloudinary upload failed for item, falling back to local storage:', cErr.message);
      }
    }

    if (!uploadedUrl) {
      uploadedUrl = `${req.protocol}://${req.get('host')}/uploads/${encodeURIComponent(file.filename)}`;
      publicId = `local-${file.filename}`;
    }

    results.push({ url: uploadedUrl, public_id: publicId });
  }

  return res.status(200).json({
    success: true,
    count: results.length,
    urls: results.map(r => r.url),
    data: results
  });
}));

module.exports = router;
