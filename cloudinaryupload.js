require('dotenv').config(); // Load environment variables
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const baseFolderPath = "./IMG_upload"; // Local base folder containing subfolders with images

const uploadImages = async(folderPath, cloudinaryFolder) => {
    const items = fs.readdirSync(folderPath);
    let fileCounter = 1;

    for (const item of items) {
        const itemPath = path.join(folderPath, item);

        if (fs.statSync(itemPath).isDirectory()) {
            // Recursively process subdirectories
            await uploadImages(itemPath, `${cloudinaryFolder}/${item}`);
        } else {
            const folderName = path.basename(folderPath); // Get current subfolder name
            const newFileName = `${folderName}_${fileCounter}`; // Rename format "subfolder_1", "subfolder_2", etc.
            fileCounter++;

            console.log(`📤 Uploading: ${item} as ${newFileName} to ${cloudinaryFolder}...`);

            try {
                const result = await cloudinary.uploader.upload(itemPath, {
                    folder: cloudinaryFolder,
                    public_id: newFileName, // Set the new filename
                    categorization: "google_tagging", // Enable Cloudinary's AI-based auto-tagging
                    auto_tagging: 0.6, // Confidence threshold for tagging
                    transformation: [{
                            width: 1700,
                            height: 1700,
                            crop: "limit" // Ensures it scales to fit within the width and height while maintaining the aspect ratio
                        },
                        { quality: "auto" }, // Automatically adjust quality for compression
                        { fetch_format: "auto" } // Ensure optimal format conversion
                    ]
                });
                console.log(`✅ Uploaded: ${result.secure_url}`);
            } catch (error) {
                console.error(`❌ Error uploading ${item}:`, error);
            }
        }
    }
};

uploadImages(baseFolderPath, "bulk_uploads");