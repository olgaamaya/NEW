const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Define paths
const inputPath = 'C:/Users/leotr/Documents/GitHub/NEW2/index.html'; // Path to original index.html file
const outputFolder = 'C:/Users/leotr/Documents/GitHub/NEW2/save'; // Folder to save the modified file
const outputPath = path.join(outputFolder, 'index2.html'); // Output file name

// Make sure the save folder exists
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
}

// Read the original HTML file
fs.readFile(inputPath, 'utf-8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // Load the HTML content with Cheerio (similar to jQuery)
    const $ = cheerio.load(data);

    // Iterate over each figure element
    $('figure').each((index, figure) => {
        const picture = $(figure).find('picture');

        if (picture.length) {
            let source = picture.find('source');

            if (source.length) {
                // Add the sizes attribute without changing the srcset
                source.attr('sizes', '(max-width: 800px) 800px, 1600px');
            }
        }
    });

    // Write the modified content to a new file
    fs.writeFile(outputPath, $.html(), 'utf-8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log(`Modified HTML saved to ${outputPath}`);
        }
    });
});