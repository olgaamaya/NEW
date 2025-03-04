const express = require('express');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Initialize Express app
const app = express();

// Middleware to handle CORS
app.use(cors());

// API Endpoint to fetch Cloudinary media based on the folder
app.get("/api/get-cloudinary-media", async(req, res) => {
    try {
        const { folder } = req.query;

        // Check if folder parameter exists
        if (!folder) {
            return res.status(400).json({ error: "Folder parameter is required" });
        }

        console.log(`Fetching media for folder: ${folder}`);

        // Sanitize the folder name to prevent malicious input
        const sanitizedFolder = folder.replace(/[^\w\s]/gi, ''); // Remove special characters

        // Fetch resources from Cloudinary
        const result = await cloudinary.api.resources({
            type: "upload",
            prefix: `IMG/${sanitizedFolder}/`, // Ensure exact folder match by adding a trailing slash
            max_results: 20, // Limit the number of results to 20
        });

        // Map the Cloudinary response to a simplified media list
        const mediaFiles = result.resources.map((file) => ({
            type: file.resource_type,
            src: file.secure_url,
        }));

        console.log('Fetched media files: ', mediaFiles);
        res.json(mediaFiles); // Respond with the media files
    } catch (error) {
        console.error("Error fetching Cloudinary media:", error);
        res.status(500).json({ error: "Failed to fetch media" });
    }
});

// Start the server
const port = process.env.PORT || 10000; // Use the port from environment variable or default to 10000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});