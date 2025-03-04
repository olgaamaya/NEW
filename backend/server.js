const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;

// Enable CORS for multiple origins (allow both GitHub and local development)
app.use(cors({
    origin: ["https://olgaamaya.github.io", "http://127.0.0.1:5500"], // Allow both origins
}));

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// API Endpoint
app.get("/api/get-cloudinary-media", async(req, res) => {
    try {
        const { folder } = req.query;

        // Validate folder name
        if (!folder) {
            return res.status(400).json({ error: "Folder parameter is required" });
        }

        // Ensure exact folder name by removing slashes and other characters
        const sanitizedFolder = folder.trim().replace(/\//g, ''); // Remove any unwanted slashes
        console.log(`Fetching media from folder: ${sanitizedFolder}`);

        const result = await cloudinary.api.resources({
            type: "upload",
            folder: `IMG/${sanitizedFolder}`, // Use 'folder' instead of 'prefix'
            max_results: 20, // Limit the number of results
        });

        const mediaFiles = result.resources.map((file) => ({
            type: file.resource_type,
            src: file.secure_url,
        }));

        res.json(mediaFiles); // Send the media files as a JSON response
    } catch (error) {
        console.error("Error fetching Cloudinary media:", error);
        res.status(500).json({ error: "Failed to fetch media" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`✅ Server running at: http://localhost:${PORT}`);
});