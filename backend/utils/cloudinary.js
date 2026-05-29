const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (localFilePath, folderName) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      folder: `veloura/${folderName}`,
    });
    // Remove file from local server after successful upload
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // Remove file from local server if upload fails
    fs.unlinkSync(localFilePath);
    console.error('Cloudinary upload failed:', error);
    return null;
  }
};

const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const response = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return response;
  } catch (error) {
    console.error('Cloudinary delete failed:', error);
    return null;
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
