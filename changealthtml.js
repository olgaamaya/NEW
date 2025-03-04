const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Function to recursively walk through directories
function walkDirectory(directory, callback) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error(`Error reading directory: ${err}`);
            return;
        }

        files.forEach(file => {
            const fullPath = path.join(directory, file);

            fs.stat(fullPath, (err, stats) => {
                if (err) {
                    console.error(`Error getting stats of file: ${err}`);
                    return;
                }

                if (stats.isDirectory()) {
                    // Recurse into subdirectories
                    walkDirectory(fullPath, callback);
                } else if (file === 'index.html') {
                    // If it's an index.html file, call the callback
                    callback(fullPath, directory);
                }
            });
        });
    });
}

// Function to update the alt attribute of images in an HTML file
function updateImageAlts(filePath, subfolderName) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error(`Error reading file ${filePath}: ${err}`);
            return;
        }

        const $ = cheerio.load(data);

        // Find all image tags and update their alt attribute
        $('img').each((index, img) => {
            // Get the path of the image
            const imgSrc = $(img).attr('src');

            // Extract the subfolder name from the image path (before IMG folder)
            const subfolderPath = imgSrc.split(path.sep); // split based on file system separator
            const folderName = subfolderPath[subfolderPath.length - 2]; // second to last element is the subfolder

            // Update the alt tag to 'Subfolder_1', 'Subfolder_2', etc.
            const newAlt = `${folderName}_${index + 1}`;
            $(img).attr('alt', newAlt);
        });

        // Determine the new file path for index_2.html
        const newFilePath = filePath.replace('index.html', 'index_2.html');

        // Write the updated content back to the new index_2.html file
        fs.writeFile(newFilePath, $.html(), 'utf-8', (err) => {
            if (err) {
                console.error(`Error writing to file ${newFilePath}: ${err}`);
            } else {
                console.log(`Updated alt tags and saved as: ${newFilePath}`);
            }
        });
    });
}

// Main function to start processing
function processHTMLFiles(rootDir) {
    walkDirectory(rootDir, (filePath, directory) => {
        const subfolderName = path.basename(directory); // Get the name of the subfolder
        updateImageAlts(filePath, subfolderName);
    });
}

// Specify the root folder (C:\Users\leotr\Documents\GitHub\olgaamaya)
const exampleFolder = 'C:\\Users\\leotr\\Documents\\GitHub\\olgaamaya'; // Update to your folder path

processHTMLFiles(exampleFolder);