require('dotenv').config(); // Load variables from .env file
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// Configure Cloudinary with credentials from .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set the target folder where images are stored
const targetFolderPath = "C:\\Users\\leotr\\Documents\\GitHub\\NEW2\\coverimg";

// Helper function for generating an alt tag
const generateAltTag = (fileName) => {
    const baseName = path.basename(fileName, path.extname(fileName));
    return baseName.replace(/_/g, ' ').substring(0, 125);
};

// Get all image files from the target folder (no subfolders)
const getImageFiles = (dir) => {
    return fs.readdirSync(dir)
        .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
        .map(file => path.join(dir, file));
};

// Upload images from the target folder
const uploadImages = async() => {
    const imageFiles = getImageFiles(targetFolderPath);

    for (const filePath of imageFiles) {
        const fileName = path.basename(filePath);
        const folderStructure = "IMG/coverimg"; // Uploads to "IMG/coverimg" in Cloudinary

        console.log(`📤 Uploading: ${fileName} to folder: ${folderStructure}...`);

        try {
            const altText = generateAltTag(fileName);
            const publicId = path.basename(fileName, path.extname(fileName));

            const result = await cloudinary.uploader.upload(filePath, {
                folder: folderStructure,
                public_id: publicId,
                context: { alt: altText },
                transformation: [{
                    width: 1800,
                    height: 1800,
                    crop: "limit",
                    quality: "auto",
                }],
            });

            console.log(`✅ Uploaded: ${result.secure_url} with alt text: "${altText}"`);
        } catch (error) {
            console.error(`❌ Error uploading ${fileName}:`, error);
        }
    }
};

uploadImages();