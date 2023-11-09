// Datoteka main.js vsebuje JS kodo za dostop do WebGPU

import { quat, mat4 } from './gl-matrix-module.js';
import { Transform } from './Transform.js';
import { Camera } from './Camera.js';
import { Node } from './Node.js';
import {
    getGlobalModelMatrix,
    getGlobalViewMatrix,
    getProjectionMatrix,
} from './SceneUtils.js';

// Initialize WebGPU
const adapter = await navigator.gpu.requestAdapter(); // predstavlja fizično napravo
const device = await adapter.requestDevice(); // dostop do naprave, ki predstavlja glavno vstopno točko do funkcionalnosti WebGPU
const canvas = document.querySelector('canvas'); //Definiramo platno po katerem bomo izrisovali
const context = canvas.getContext('webgpu'); // podatke za izris bo platno dobilo iz WebGPU
const format = navigator.gpu.getPreferredCanvasFormat();
context.configure({ device, format });

// Create vertex buffer
const vertices = new Float32Array([
    // positions         // colors         // index
    -1, -1, -1,  1,      0,  0,  0,  1,    //   0
    -1, -1,  1,  1,      0,  0,  1,  1,    //   1
    -1,  1, -1,  1,      0,  1,  0,  1,    //   2
    -1,  1,  1,  1,      0,  1,  1,  1,    //   3
     1, -1, -1,  1,      1,  0,  0,  1,    //   4
     1, -1,  1,  1,      1,  0,  1,  1,    //   5
     1,  1, -1,  1,      1,  1,  0,  1,    //   6
     1,  1,  1,  1,      1,  1,  1,  1,    //   7
]);

const vertexBuffer = device.createBuffer({
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
});

device.queue.writeBuffer(vertexBuffer, 0, vertices);

// Create index buffer
const indices = new Uint32Array([
    0, 1, 2,    2, 1, 3,
    4, 0, 6,    6, 0, 2,
    5, 4, 7,    7, 4, 6,
    1, 5, 3,    3, 5, 7,
    6, 2, 7,    7, 2, 3,
    1, 0, 5,    5, 0, 4,
]);

const indexBuffer = device.createBuffer({
    size: indices.byteLength,
    usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
});

device.queue.writeBuffer(indexBuffer, 0, indices);

// Create the depth texture
const depthTexture = device.createTexture({
    size: [canvas.width, canvas.height],
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
});

// Fetch and compile shaders
const code = await fetch('shader.wgsl').then(response => response.text());  // pridobivanje kode senčilnika. iz odgovora strežnika, ki je fetchal kodo izluščimo vsebino
const module = device.createShaderModule({ code }); // senčilnike prevedemo

// Create the pipeline
const vertexBufferLayout = {
    arrayStride: 32,
    attributes: [
        {
            shaderLocation: 0,
            offset: 0,
            format: 'float32x4',
        },
        {
            shaderLocation: 1,
            offset: 16,
            format: 'float32x4',
        },
    ],
};

const pipeline = device.createRenderPipeline({ // senčilnike in obliko vhodnih in izhodnih podatkov doldočimo v pipelinu(cevovodu)
    vertex: {
        module, // koda senčilnika
        entryPoint: 'vertex', // ime vstopne funkcije za senčilnik
        buffers: [vertexBufferLayout], // medpomnilnik, ki vsebuje podatke za npr. točke, barvo
    },
    fragment: {
        module,
        entryPoint: 'fragment', // ime vstopne funkcije za senčilnik
        targets: [{ format }],
    },
    depthStencil: {
        depthWriteEnabled: true,
        depthCompare: 'less',
        format: 'depth24plus',
    },
    layout: 'auto',
});

// Create matrix buffer
const matrixBuffer = device.createBuffer({
    size: 16 * 4,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

// Create the bind group
const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
        { binding: 0, resource: { buffer: matrixBuffer } },
    ]
});

// Create the scene
const model = new Node();
model.addComponent(new Transform());
/*model.addComponent({
    update() {
        const time = performance.now() / 1000;
        const transform = model.getComponentOfType(Transform);
        const rotation = transform.rotation;

        quat.identity(rotation);
        quat.rotateX(rotation, rotation, time * 0.6);
        quat.rotateY(rotation, rotation, time * 0.7);
    }
});*/

const camera = new Node();
camera.addComponent(new Camera());
camera.addComponent(new Transform({
    translation: [0, 0, 5]
}));

const scene = new Node();
scene.addChild(model);
scene.addChild(camera);

// Update all components
function update() {
    scene.traverse(node => {
        for (const component of node.components) {
            component.update?.();
        }
    });
}

function render() {
    // Get the required matrices
    const modelMatrix = getGlobalModelMatrix(model);
    const viewMatrix = getGlobalViewMatrix(camera);
    const projectionMatrix = getProjectionMatrix(camera);

    // Upload the transformation matrix
    const matrix = mat4.create();
    mat4.multiply(matrix, modelMatrix, matrix);
    mat4.multiply(matrix, viewMatrix, matrix);
    mat4.multiply(matrix, projectionMatrix, matrix);

    device.queue.writeBuffer(matrixBuffer, 0, matrix);

    // Render
    const commandEncoder = device.createCommandEncoder();

    // Pred vsakim izrisom moramo platno pobrisati
    //Obhod upodabljanj, Render pass (prva opreacija je torej brisanje platna)
    const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
            view: context.getCurrentTexture().createView(),
            loadOp: 'clear',
            clearValue: [0.7, 0.8, 0.9, 1],
            storeOp: 'store',
        }],
        depthStencilAttachment: {
            view: depthTexture.createView(),
            depthClearValue: 1,
            depthLoadOp: 'clear',
            depthStoreOp: 'discard',
        },
    });
    renderPass.setPipeline(pipeline);
    renderPass.setVertexBuffer(0, vertexBuffer);
    renderPass.setIndexBuffer(indexBuffer, 'uint32');
    renderPass.setBindGroup(0, bindGroup);
    renderPass.drawIndexed(indices.length); 
    renderPass.end();
    device.queue.submit([commandEncoder.finish()]);
}

function frame() {
    update();
    render();
    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
