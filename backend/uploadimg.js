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

// Step 3: Set the root folder where images are stored
const rootFolderPath = "C:\\Users\\leotr\\Documents\\GitHub\\olgaamaya\\IMG_upload"; // Change this if needed

// Step 4: Create a helper function for generating an alt tag
const generateAltTag = (fileName) => {
    const baseName = path.basename(fileName, path.extname(fileName)); // Get the file name without extension
    const altText = baseName.replace(/_/g, ' ').substring(0, 125); // Replace underscores with spaces and limit to 125 chars
    return altText;
};

// Step 5: Get all image files from the folders (no nested subfolders)
const getImageFiles = (dir) => {
    let imageFiles = [];
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        // If it's a directory, check it for images (no recursion into subdirectories)
        if (stat.isDirectory()) {
            const imagesInFolder = fs.readdirSync(filePath).filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f)); // You can add other extensions if needed
            imagesInFolder.forEach(image => imageFiles.push(path.join(filePath, image)));
        }
    });

    return imageFiles;
};

// Step 6: Upload all images from the folder
const uploadImages = async() => {
    const imageFiles = getImageFiles(rootFolderPath); // Get all images from the folders

    for (const filePath of imageFiles) {
        const fileName = path.basename(filePath); // Get the file name
        const parentFolder = path.basename(path.dirname(filePath)); // Get the immediate folder name (e.g., folder1, folder2, etc.)
        const folderStructure = `IMG/${parentFolder}`; // Set the Cloudinary folder to be "IMG" + the folder name

        console.log(`📤 Uploading: ${fileName} to folder: ${folderStructure}...`);

        try {
            // Generate the alt text for the image
            const altText = generateAltTag(fileName);

            // Specify the public_id to keep the original file name
            const publicId = path.basename(fileName, path.extname(fileName)); // Get the file name without extension

            // Apply resizing and compression transformations directly to the image during upload
            const result = await cloudinary.uploader.upload(filePath, {
                folder: folderStructure,
                public_id: publicId, // Keep the file name as the public_id
                context: {
                    alt: altText, // Adding alt text to the image's metadata
                },
                transformation: [{
                    width: 1800, // Max width
                    height: 1800, // Max height
                    crop: "limit", // Maintain aspect ratio
                    quality: "auto", // Apply automatic compression
                }],
            });

            console.log(`✅ Uploaded: ${result.secure_url} with alt text: "${altText}"`);
        } catch (error) {
            console.error(`❌ Error uploading ${fileName}:`, error);
        }
    }
};

uploadImages();