const express = require("express");
const cors = require("cors"); // Import cors
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;

// Enable CORS for all origins
app.use(cors({ origin: "https://olgaamaya.github.io" }));

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

        if (!folder) {
            return res.status(400).json({ error: "Folder parameter is required" });
        }

        const result = await cloudinary.api.resources({
            type: "upload",
            prefix: `IMG/${folder}`,
            max_results: 20, // Limit results
        });

        const mediaFiles = result.resources.map((file) => ({
            type: file.resource_type,
            src: file.secure_url,
        }));

        res.json(mediaFiles);
    } catch (error) {
        console.error("Error fetching Cloudinary media:", error);
        res.status(500).json({ error: "Failed to fetch media" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`✅ Server running at: http://localhost:${PORT}`);
});