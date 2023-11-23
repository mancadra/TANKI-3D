


let depthTexture;


export async function initGPU() {
    // Check if WebGPU is supported
    if (!navigator.gpu) {
        console.error("WebGPU is not supported. Please use a compatible browser.");
        return;
    }

    // Get a GPU device
    const adapter = await navigator.gpu.requestAdapter();
    const device = await adapter.requestDevice();

    // Get the canvas and context
    const canvas = document.querySelector("#webgpu-canvas");
    const context = canvas.getContext("webgpu");

    // Define swap chain format and configure the canvas context
    const swapChainFormat = "bgra8unorm";
    context.configure({
        device: device,
        format: swapChainFormat,
    });

    
    return { device, context, swapChainFormat };
}



export async function createCube({ device, context, swapChainFormat }) {
    // ... Vertex and Index Buffer setup (same as previous example)
     // Vertex data for a cube
     const vertices = new Float32Array([
        // Front face
        -1.0, -1.0,  1.0, // v0
         1.0, -1.0,  1.0, // v1
         1.0,  1.0,  1.0, // v2
        -1.0,  1.0,  1.0, // v3
        // Back face
        -1.0, -1.0, -1.0, // v4
         1.0, -1.0, -1.0, // v5
         1.0,  1.0, -1.0, // v6
        -1.0,  1.0, -1.0, // v7
    ]);

    // Index data for the cube
    const indices = new Uint16Array([
        0, 1, 2, 2, 3, 0, // Front
        4, 5, 6, 6, 7, 4, // Back
        // ... add other faces indices
    ]);

    // Create a vertex buffer and index buffer
    const vertexBuffer = device.createBuffer({
        size: vertices.byteLength,
        usage: GPUBufferUsage.VERTEX,
        mappedAtCreation: true,
    });
    new Float32Array(vertexBuffer.getMappedRange()).set(vertices);
    vertexBuffer.unmap();

    const indexBuffer = device.createBuffer({
        size: indices.byteLength,
        usage: GPUBufferUsage.INDEX,
        mappedAtCreation: true,
    });
    new Uint16Array(indexBuffer.getMappedRange()).set(indices);
    indexBuffer.unmap();



    const shaderCode = await loadShader('shaders/cubeShaderCode.wgsl');

    const shaderModule = device.createShaderModule({
        code: shaderCode, // Loaded from an external file
    });

    // Define the render pipeline
    const pipeline = device.createRenderPipeline({
        vertex: {
            module: shaderModule,
            entryPoint: 'vs_main',
            buffers: [{
                arrayStride: 3 * 4, // 3 components per vertex, 4 bytes per component
                attributes: [{
                    shaderLocation: 0,
                    offset: 0,
                    format: 'float32x3'
                }]
            }],
        },
        fragment: {
            module: shaderModule,
            entryPoint: 'fs_main',
            targets: [{
                format: swapChainFormat,
            }],
        },
        primitive: {
            topology: 'triangle-list',
            cullMode: 'back',
        },
        depthStencil: {
            format: 'depth24plus-stencil8',
            depthWriteEnabled: true,
            depthCompare: 'less',
        },
    });

    // Function to create a depth texture
    function createDepthTexture(device, context) {
        depthTexture = device.createTexture({
            size: {
                width: context.canvas.width,
                height: context.canvas.height,
                depthOrArrayLayers: 1,
            },
            format: 'depth24plus-stencil8',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
        });
    }

    // Call to create the depth texture
    createDepthTexture(device, context);

    // Animation loop
    function render() {
        // Create a view of the depth texture for the current frame
        const depthTextureView = depthTexture.createView();

        const commandEncoder = device.createCommandEncoder();
        const textureView = context.getCurrentTexture().createView();

        const renderPassDescriptor = {
            colorAttachments: [{
                view: textureView,
                clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                loadOp: 'clear',
                storeOp: 'store',
            }],
            depthStencilAttachment: {
                view: depthTextureView,
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
            },
        };

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(pipeline);
        passEncoder.setVertexBuffer(0, vertexBuffer);
        passEncoder.setIndexBuffer(indexBuffer, 'uint16');
        passEncoder.drawIndexed(indices.length);
        passEncoder.endPass();

        device.queue.submit([commandEncoder.finish()]);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

function onResize() {
    // Resize your canvas and swap chain as needed
    context.configure({
        device: device,
        format: swapChainFormat,
        size: [canvas.clientWidth, canvas.clientHeight],
    });

    // Recreate the depth texture
    createDepthTexture(device, context);
}

async function loadShader(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load shader: ${url}`);
    }
    return await response.text();
}
window.addEventListener('resize', onResize);
window.addEventListener('resize', () => onResize(context));