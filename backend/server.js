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

// CORS configuration
const corsOptions = {
    origin: function(origin, callback) {
        // Uncomment the line below to allow all origins temporarily for debugging
        // callback(null, true);

        if (!origin || origin === 'https://olgaamaya.github.io') {
            callback(null, true);
        } else {
            callback(new Error('CORS policy: Not allowed by CORS policy'), false);
        }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

// Middleware to handle CORS
app.use(cors(corsOptions));

// API Endpoint to fetch Cloudinary media based on the folder
app.get("/api/get-cloudinary-media", async(req, res) => {
    try {
        const { folder, limit } = req.query;

        // Validate folder parameter
        if (!folder) {
            return res.status(400).json({ error: "Folder parameter is required" });
        }

        console.log(`Fetching media for folder: ${folder}`);

        // Sanitize folder name
        const sanitizedFolder = folder.replace(/[^\w\s]/gi, '');

        // Default max_results is 20, but use 'limit' if provided
        const maxResults = limit ? parseInt(limit, 10) : 20;

        // Fetch media from Cloudinary
        const result = await cloudinary.api.resources({
            type: "upload",
            prefix: `IMG/${sanitizedFolder}/`,
            max_results: maxResults,
        });

        if (!result.resources || result.resources.length === 0) {
            return res.status(404).json({ error: `No media found in the folder: ${sanitizedFolder}` });
        }

        // Map the Cloudinary response to a structured list
        const mediaFiles = result.resources.map((file) => ({
            type: file.resource_type,
            src: cloudinary.url(file.public_id, { quality: 'auto' }),
            alt: file.public_id,
        }));

        console.log('Fetched media files: ', mediaFiles);
        res.json(mediaFiles);
    } catch (error) {
        console.error("Error fetching Cloudinary media:", error);
        res.status(500).json({ error: "Failed to fetch media" });
    }
});

// Start the server
const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});