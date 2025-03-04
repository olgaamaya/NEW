// Step 1: Import required libraries
require('dotenv').config(); // This loads variables from .env file
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// Step 2: Configure Cloudinary with credentials from .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Step 3: Set the folder where images are stored
const folderPath = "./images"; // Change this if needed

// Step 4: Upload all images from the folder
const uploadImages = async() => {
    const files = fs.readdirSync(folderPath); // Get all images

    for (const file of files) {
        const filePath = path.join(folderPath, file);
        console.log(`📤 Uploading: ${file}...`);

        try {
            const result = await cloudinary.uploader.upload(filePath, {
                folder: "bulk_uploads", // Cloudinary folder name
            });
            console.log(`✅ Uploaded: ${result.secure_url}`);
        } catch (error) {
            console.error(`❌ Error uploading ${file}:`, error);
        }
    }
};

uploadImages();