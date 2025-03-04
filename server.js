const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

// ✅ Enable CORS for local frontend (Modify for production)
app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"], // Allow both 127.0.0.1 and localhost
    methods: "GET",
    allowedHeaders: "Content-Type"
}));

// ✅ Ensure Cloudinary credentials are set
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error("❌ Missing Cloudinary credentials in .env file!");
    process.exit(1); // Stop the server if credentials are missing
}

// ✅ Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ API to get Cloudinary media files from a folder
app.get('/api/get-cloudinary-media', async(req, res) => {
    try {
        const folder = req.query.folder;
        if (!folder) {
            return res.status(400).json({ error: '❌ Folder parameter is required' });
        }

        console.log(`📂 Fetching media from folder: IMG/${folder}/`);

        // ✅ Fetch media from Cloudinary (Original Prefix)
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: `IMG/${folder}/`, // **Your original structure**
            max_results: 100
        });

        console.log('✅ Cloudinary API Response:', result);

        if (!result.resources || result.resources.length === 0) {
            return res.status(404).json({ message: `❌ No media found in IMG/${folder}/` });
        }

        // ✅ Format the response
        const mediaFiles = result.resources.map(resource => ({
            type: resource.resource_type, // 'image' or 'video'
            src: resource.secure_url
        }));

        res.json(mediaFiles);
    } catch (error) {
        console.error('❌ Cloudinary API Error:', error.message);
        res.status(500).json({ error: '❌ Failed to fetch media from Cloudinary' });
    }
});

// ✅ Start the server
app.listen(port, () => {
    console.log(`✅ Server running at: http://localhost:${port}`);
});