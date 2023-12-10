/*import { Transform } from './common/engine/core/Transform.js';
import { ImageLoader } from './common/engine/loaders/ImageLoader.js';

export class mapRenderer {

    constructor(node, domElement, {
        width = 100, 
        height = 100, 
        scale = 0.1, 
    } = {}) {
        this.node = node;
        this.domElement = domElement;
        //this.image = image;

        this.width = width;
        this.height = height;
        this.scale = scale;

        this.loadGrayscaleImage();
    }
    
        
        async loadGrayscaleImage() {
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
    
            console.log(imageData);
            //return imageData;
        }
     
        

    // Function to generate vertices and indices
    generateTerrainVerticesAndIndices() {
        const vertices = [];
        const indices = [];

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const x = i * scale;
                const y = getHeightFromImage(i, j); 
                const z = j * scale;

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
    
        const newHeight = this.getInterpolatedHeight(currentX, currentZ, this.width, this.height, imageData);
    
        transform.translation[1] = newHeight;

        transform.translation = transform.translation;
    }
    
}*/