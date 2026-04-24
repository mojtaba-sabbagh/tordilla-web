import fs from 'fs';
import path from 'path';

// Define supported image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];

interface SliderImage {
  path: string;
  filename: string;
}

function getImagesFromFolder(folderPath: string): string[] {
  // Check if folder exists
  if (!fs.existsSync(folderPath)) {
    throw new Error(`Folder does not exist: ${folderPath}`);
  }

  // Read all files in the folder
  const files = fs.readdirSync(folderPath);
  
  // Filter and map image files
  const imagePaths = files
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return IMAGE_EXTENSIONS.includes(ext);
    })
    .map(file => path.join(folderPath, file))
    .sort(); // Optional: sort alphabetically

  return imagePaths;
}

// Usage example:
function generateSliderImages(folderPath: string): string[] {
  try {
    const imagePaths = getImagesFromFolder(folderPath);
    
    if (imagePaths.length === 0) {
      console.warn(`No images found in folder: ${folderPath}`);
      return [];
    }
    
    return imagePaths;
    
  } catch (error) {
    console.error('Error reading images:', error);
    return [];
  }
}

export { getImagesFromFolder, generateSliderImages, IMAGE_EXTENSIONS };