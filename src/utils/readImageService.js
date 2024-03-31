import fs from 'fs';
import path from 'path';

const readImageFile = async (filePath) => {
    try {
        // Check if file exists
        await fs.promises.access(filePath, fs.constants.F_OK);
        
        // Read file asynchronously
        const data = await fs.promises.readFile(filePath);

        // Get file extension
        const extension = path.extname(filePath).slice(1).toLowerCase();
        
        // Determine appropriate content type based on file extension
        let contentType;
        if (extension === 'jpg' || extension === 'jpeg') {
            contentType = 'image/jpeg';
        } else if (extension === 'png') {
            contentType = 'image/png';
        } else if (extension === 'gif') {
            contentType = 'image/gif';
        } else {
            throw new Error('Unsupported file format');
        }

        // Construct image data object
        const imageData = {
            contentType: contentType,
            data: data.toString('base64')
        };

        return imageData;
    } catch (error) {
        throw new Error('Error reading file: ' + error.message);
    }
};

export default readImageFile;
