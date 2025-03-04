const fs = require('fs');
const path = require('path');

// Path to the root folder where subfolders are located
const rootFolderPath = 'C:/Users/leotr/Documents/GitHub/olgaamaya/IMG_upload';

// Function to rename files inside subfolders
function renameFilesInSubfolders() {
    // Read the contents of the root folder
    fs.readdirSync(rootFolderPath).forEach((subfolderName) => {
        const subfolderPath = path.join(rootFolderPath, subfolderName);

        // Check if it's a directory (subfolder)
        if (fs.statSync(subfolderPath).isDirectory()) {
            console.log(`Processing folder: ${subfolderName}`);
            renameFilesInFolder(subfolderPath, subfolderName);
        }
    });
}

// Function to rename files inside a specific folder
function renameFilesInFolder(folderPath, folderName) {
    // Read the files inside the subfolder
    const files = fs.readdirSync(folderPath);

    // Initialize counters for each file type
    let jpgCounter = 1;
    let pngCounter = 1;
    let gifCounter = 1;
    let mp4Counter = 1;

    // Loop through all files in the folder
    files.forEach((fileName) => {
        const filePath = path.join(folderPath, fileName);

        // Get the file extension
        const ext = path.extname(fileName).toLowerCase();

        // Check if it's a valid image or video type
        if (['.jpg', '.jpeg', '.png', '.gif', '.mp4'].includes(ext)) {
            // Determine the new file name based on the folder name and file type
            let newFileName;
            if (ext === '.jpg' || ext === '.jpeg') {
                newFileName = `${folderName}_${jpgCounter++}.jpg`;
            } else if (ext === '.png') {
                newFileName = `${folderName}_${pngCounter++}.png`;
            } else if (ext === '.gif') {
                newFileName = `${folderName}_${gifCounter++}.gif`;
            } else if (ext === '.mp4') {
                newFileName = `${folderName}_${mp4Counter++}.mp4`;
            }

            // Create the new file path
            const newFilePath = path.join(folderPath, newFileName);

            // Rename the file
            fs.renameSync(filePath, newFilePath);
            console.log(`Renamed: ${fileName} -> ${newFileName}`);
        }
    });
}

// Call the function to start renaming
renameFilesInSubfolders();