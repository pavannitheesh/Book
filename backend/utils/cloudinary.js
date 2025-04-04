const cloudinary = require('cloudinary').v2;
require('dotenv').config(); 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to generate random avatar using DiceBear API and upload to Cloudinary
const generateRandomAvatar = async (userId) => {
  try {
    // Generate a unique identifier for the avatar
    const publicId = `user-avatar-${userId}-${Date.now()}`;
    
    // Generate random values for the avatar
    const styles = [ "adventurer",
    "avataaars",
    "big-ears",
    "big-smile",
    "bottts",
    "croodles",
    "dylan",
    "fun-emoji",
    "glass",
    "icons",
    "identicon",
    "initials",
    "lorelei",
    "micah",
    "miniavs",
    "notionists",
    "open-peeps",
    "personas",
    "pixel-art",
    "rings",
    "shapes",
    "thumbs"]
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const seed = Math.random().toString(36).substring(7);
    
    // Create DiceBear URL
    const avatarUrl = `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${seed}&size=200`;
    
    // Upload the generated avatar to Cloudinary
    const result = await cloudinary.uploader.upload(avatarUrl, {
      public_id: publicId,
      folder: 'avatars',
      transformation: [{ width: 200, height: 200, crop: 'fill' }]
    })

    return result.secure_url;
  } catch (error) {
    console.error('Error generating avatar:', error);
    throw error;
  }
};

module.exports = { cloudinary, generateRandomAvatar };