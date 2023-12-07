/*import { Transform } from './common/engine/core/Transform.js';
import { ImageLoader } from './common/engine/loaders/ImageLoader.js';

export class mapRenderer {

    constructor(node, domElement, {
        width = 100, // Adjust the width of the grid
        height = 100, // Adjust the height of the grid
        scale = 0.1, // Adjust the scale of the terrain
    } = {}) {
        this.node = node;
        this.domElement = domElement;
        //this.image = image;

        this.width = width;
        this.height = height;
        this.scale = scale;

        // Corrected: Call the method to load the grayscale image
        this.loadGrayscaleImage();
    }
    
        
        async loadGrayscaleImage() {
            // Corrected: Fetch the image using the correct path
            const bitmap = new ImageLoader();
            await bitmap.load('./common/images/h1.png');
    
            // Create a canvas element
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
    
            // Set the canvas size to match the image size
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
    
            // Draw the ImageBitmap onto the canvas
            context.drawImage(bitmap, 0, 0);
    
            // Get the pixel data
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
    
            // Now 'imageData' is a one-dimensional array containing grayscale values for each pixel
            console.log(imageData);
            //return imageData;
        }
     
        

    // Function to generate vertices and indices
    generateTerrainVerticesAndIndices() {
        const vertices = [];
        const indices = [];

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                // Calculate the x, y, and z coordinates based on the image data
                const x = i * scale;
                const y = getHeightFromImage(i, j); // Implement this function based on your image data
                const z = j * scale;

                // Add the vertex coordinates to the array
                vertices.push(x, y, z);
            }
        }

        // Generate indices to form triangles
        for (let i = 0; i < width - 1; i++) {
            for (let j = 0; j < height - 1; j++) {
                const topLeft = j + i * height;
                const topRight = j + (i + 1) * height;
                const bottomLeft = j + 1 + i * height;
                const bottomRight = j + 1 + (i + 1) * height;

                // Add indices to form two triangles for each grid cell
                indices.push(topLeft, topRight, bottomLeft);
                indices.push(topRight, bottomRight, bottomLeft);
            }
        }

        return { vertices, indices };
    }

    // Function to get the height value from your image data
    getHeightFromImage(x, y) {
        return imageData[x + y * width] / 255.0; 
    }

    

    getInterpolatedHeight(x, y, terrainWidth, terrainHeight, heights) {
        // Calculate grid coordinates
        const xCoord = Math.floor(x / scale);
        const yCoord = Math.floor(y / scale);

        // Calculate local position within the grid
        const localX = (x / scale) - xCoord;
        const localY = (y / scale) - yCoord;

        // Get heights of the four corners of the cell
        const topLeft = heights[yCoord * terrainWidth + xCoord];
        const topRight = heights[yCoord * terrainWidth + (xCoord + 1)];
        const bottomLeft = heights[(yCoord + 1) * terrainWidth + xCoord];
        const bottomRight = heights[(yCoord + 1) * terrainWidth + (xCoord + 1)];

        // Interpolate height using bilinear interpolation
        const topInterpolation = (1 - localX) * topLeft + localX * topRight;
        const bottomInterpolation = (1 - localX) * bottomLeft + localX * bottomRight;

        return (1 - localY) * topInterpolation + localY * bottomInterpolation;
    }


    update(t, dt) {
        const transform = this.node.getComponentOfType(Transform);
        if (!transform) {
            return;
        }
    
        // Get the current position of the tank
        const currentX = transform.translation[0];
        const currentZ = transform.translation[2];
    
        // Use the getInterpolatedHeight function to get the new height at the current position
        const newHeight = this.getInterpolatedHeight(currentX, currentZ, this.width, this.height, imageData);
    
        // Update the tank's y-coordinate to the new height
        transform.translation[1] = newHeight;
    
        // Apply the updated transformation
        transform.translation = transform.translation;
    }
    
}*/