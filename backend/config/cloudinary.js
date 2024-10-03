const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const cloudinaryMiddleware = (req, res, next) => {
  req.cloudinary = cloudinary; // Attach Cloudinary to the request object
  next();
};
async function testCloudinaryConnection() {
  try {
    // Test uploading a sample image or file
    const uploadResult = await cloudinary.uploader.upload("https://media.istockphoto.com/id/2149530993/photo/digital-human-head-concept-for-ai-metaverse-and-facial-recognition-technology.jpg?s=1024x1024&w=is&k=20&c=Ob0ACggwWuFDFRgIc-SM5bLWjNbIyoREeulmLN8dhLs=", {
      resource_type: "image"
    });

    console.log("Upload successful! File URL:", uploadResult.secure_url);

    // Remove the uploaded image from Cloudinary
    const publicId = uploadResult.public_id; // Get the public ID of the uploaded image
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image"
    });

    console.log("Image removed from Cloudinary successfully.");
  } catch (error) {
    console.error("Error connecting to Cloudinary:", error);
  }
}

// Test the connection immediately upon file load (optional)
testCloudinaryConnection();


module.exports = cloudinaryMiddleware;