/*function generateVerticesFromHeightmap(imagePath, minHeight, maxHeight) {
    const image = new Image();
    image.src = imagePath;
  
    return new Promise((resolve, reject) => {
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
  
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, image.width, image.height);
  
        const imageData = context.getImageData(0, 0, image.width, image.height).data;
        const vertices = [];
  
        for (let y = 0; y < image.height; y++) {
          for (let x = 0; x < image.width; x++) {
            const index = y * image.width + x;
            const grayscaleValue = imageData[index] / 255;
            const normalizedHeight = grayscaleValue * (maxHeight - minHeight) + minHeight;
  
            // Normalize coordinates to range [-1, 1]
            const normalizedX = (x / image.width) * 2 - 1;
            const normalizedY = (y / image.height) * 2 - 1;
  
            // Add the vertex coordinates to the array
            vertices.push(normalizedX, normalizedHeight, normalizedY);
          }
        }
  
        resolve(vertices);
      };
  
      image.onerror = (error) => {
        reject(error);
      };
    });
  }
  
  // Example usage:
  const minHeight = 0; // Replace with the minimum height value in your heightmap
  const maxHeight = 100; // Replace with the maximum height value in your heightmap
  const imagePath = './common/images/h1.png'; 

  generateVerticesFromHeightmap(imagePath, minHeight, maxHeight)
    .then((vertices) => {
      console.log('Vertices:', vertices);
      // Now you can use the vertices in your WebGL rendering code
    })
    .catch((error) => {
      console.error('Error generating vertices from heightmap:', error);
    });*/

    // Constants
const width = 100; // Adjust the width of the grid
const height = 100; // Adjust the height of the grid
const scale = 0.1; // Adjust the scale of the terrain

// Function to generate vertices and indices
function generateTerrainVerticesAndIndices() {
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
function getHeightFromImage(x, y) {
    // Implement this function based on your image data
    // You may need to access the pixel data from your heightmap image
    // and convert it to a height value
    return imageData[x + y * width] / 255.0;
    /*
    const index = (y * imageData.width + x) * 4; // Assuming 4 channels (RGBA) per pixel
    const grayscaleValue = imageData.data[index];
    return grayscaleValue / 255.0;*/

    // For now, return a placeholder value
    return 0;
}

// Call the function to get the vertices and indices
const { vertices, indices } = generateTerrainVerticesAndIndices();

// Output the results to the console
console.log('Vertices:', vertices);
console.log('Indices:', indices);



function getInterpolatedHeight(x, y, terrainWidth, terrainHeight, heights) {
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
