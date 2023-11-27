import { vec3,mat2, mat3, mat4 } from './lib/gl-matrix-module.js';

import * as WebGPU from './common/engine/WebGPU.js';

import { Camera } from './common/engine/core.js';

import {
    getLocalModelMatrix,
    getGlobalModelMatrix,
    getGlobalViewMatrix,
    getProjectionMatrix,
    getModels,
} from './common/engine/core/SceneUtils.js';

import { BaseRenderer } from './common/engine/renderers/BaseRenderer.js';

import { Light } from './Light.js';

const vertexBufferLayout = {
    arrayStride: 32,
    attributes: [
        {
            name: 'position',
            shaderLocation: 0,
            offset: 0,
            format: 'float32x3',
        },
        {
            name: 'texcoords',
            shaderLocation: 1,
            offset: 12,
            format: 'float32x2',
        },
        {
            name: 'normal',
            shaderLocation: 2,
            offset: 20,
            format: 'float32x3',
        },
    ],
};

export class Renderer extends BaseRenderer {

    constructor(canvas) {
        super(canvas);
    }

    async initialize() {
        await super.initialize();

        const code = await fetch(new URL('shader.wgsl', import.meta.url))
            .then(response => response.text());
        const module = this.device.createShaderModule({ code });

        this.pipeline = await this.device.createRenderPipelineAsync({
            layout: 'auto',
            vertex: {
                module,
                entryPoint: 'vertex',
                buffers: [ vertexBufferLayout ],
            },
            fragment: {
                module,
                entryPoint: 'fragment',
                targets: [{ format: this.format }],
            },
            depthStencil: {
                format: 'depth24plus',
                depthWriteEnabled: true,
                depthCompare: 'less',
            },
        });

        this.recreateDepthTexture();
        


    }

    recreateDepthTexture() {
        this.depthTexture?.destroy();
        this.depthTexture = this.device.createTexture({
            format: 'depth24plus',
            size: [this.canvas.width, this.canvas.height],
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });
    }

    prepareNode(node) {
        if (this.gpuObjects.has(node)) {
            return this.gpuObjects.get(node);
        }

        const modelUniformBuffer = this.device.createBuffer({
            size: 128,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const modelBindGroup = this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(1),
            entries: [
                { binding: 0, resource: { buffer: modelUniformBuffer } },
            ],
        });

        const gpuObjects = { modelUniformBuffer, modelBindGroup };
        this.gpuObjects.set(node, gpuObjects);
        return gpuObjects;
    }

    prepareCamera(camera) {
        if (this.gpuObjects.has(camera)) {
            return this.gpuObjects.get(camera);
        }

        const cameraUniformBuffer = this.device.createBuffer({
            size: 128,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const cameraBindGroup = this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                { binding: 0, resource: { buffer: cameraUniformBuffer } },
            ],
        });

        const gpuObjects = { cameraUniformBuffer, cameraBindGroup };
        this.gpuObjects.set(camera, gpuObjects);
        return gpuObjects;
    }

    prepareLight(light) {
        if (this.gpuObjects.has(light)) {
            return this.gpuObjects.get(light);
        }

        const lightUniformBuffer = this.device.createBuffer({
            size: 16 + 24,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });


        // Check and prepare customUniformBuffer
        const customUniformBuffer = this.device.createBuffer({
                size: 24, // Size of customUniforms struct
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
            });

        // Create the bind group with both light and custom uniform buffers
        const lightBindGroup = this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(3),
            entries: [
                { binding: 0, resource: { buffer: lightUniformBuffer } },
                { binding: 1, resource: { buffer: customUniformBuffer } },
            ],
        });

        const gpuObjects = { lightUniformBuffer, lightBindGroup, customUniformBuffer};
        this.gpuObjects.set(light, gpuObjects);
        return gpuObjects;
    }

  /*defineFragmentUniforms() {
       // Create a buffer for FragmentUniforms
       this.fragmentUniformBuffer = this.device.createBuffer({
        size: 6 * 4, // Size in bytes (vec2<f32> + vec2<f32> + f32 + f32)
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    // Create a bind group for FragmentUniforms
    this.fragmentBindGroup = this.device.createBindGroup({
        layout: this.pipeline.getBindGroupLayout(3),
        entries: [
            { binding: 1, resource: { buffer: this.fragmentUniformBuffer } },
        ],
    });

    return { fragmentUniformBuffer: this.fragmentUniformBuffer, fragmentBindGroup: this.fragmentBindGroup };
    }*/

    prepareMaterial(material) {
        if (this.gpuObjects.has(material)) {
            return this.gpuObjects.get(material);
        }

        const baseTexture = this.prepareImage(material.baseTexture.image).gpuTexture;
        const baseSampler = this.prepareSampler(material.baseTexture.sampler).gpuSampler;

        const materialUniformBuffer = this.device.createBuffer({
            size: 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const materialBindGroup = this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(2),
            entries: [
                { binding: 0, resource: { buffer: materialUniformBuffer } },
                { binding: 1, resource: baseTexture.createView() },
                { binding: 2, resource: baseSampler },
            ],
        });

        const gpuObjects = { materialUniformBuffer, materialBindGroup };
        this.gpuObjects.set(material, gpuObjects);
        return gpuObjects;
    }

    setUniform(u_resolution, u_mouse, u_time, u_frame, buffer) {
        // Create or get the buffer for customUniforms
        let customUniformBuffer = buffer;


        let converted_u_resolution = this.logAndConvertData(u_resolution, 'vec2f', 8);
        let converted_u_mouse = this.logAndConvertData(u_mouse, 'vec2f', 8);
        let converted_u_time = this.logAndConvertData(u_time, 'f32', 4);
        let converted_u_frame = this.logAndConvertData(u_frame, 'f32', 4);
       
        // Update the buffer with new data
        //this.device.queue.writeBuffer(customUniformBuffer, 0, new Float32Array([...u_resolution, ...u_mouse, u_time, u_frame]));
        this.device.queue.writeBuffer(customUniformBuffer, 0, converted_u_resolution);
        this.device.queue.writeBuffer(customUniformBuffer, 8, converted_u_mouse);
        this.device.queue.writeBuffer(customUniformBuffer, 16, converted_u_time);
        this.device.queue.writeBuffer(customUniformBuffer, 20, converted_u_frame);
    
    }

    logAndConvertData(data, expectedType, expectedByteSize) {
        //console.log(`Data: ${data}, Type: ${typeof data}, Expected Type: ${expectedType}, Size: ${expectedByteSize} bytes`);
        if (expectedType === 'vec2f' && expectedByteSize === 8) {
            return new Float32Array([data[0], data[1]]);
        } else if (expectedType === 'f32' && expectedByteSize === 4) {
            return new Float32Array([data]);
        } else {
            console.error(`Unexpected data type or byte size. Data: ${data}, Type: ${typeof data}`);
            return null;
        }
    }

    ///debuging cutsom uniforms
    async logUniforms(buffer) {
        let customUniformBuffer = buffer;
        if (!customUniformBuffer) {
            console.error("customUniformBuffer is not initialized.");
            return;
        }
        const readbackBuffer = this.device.createBuffer({
            size: 24, // Size of the buffer to read back
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
        });
    
        // Copy the data from the uniform buffer to the readback buffer
        const commandEncoder = this.device.createCommandEncoder();
        commandEncoder.copyBufferToBuffer(customUniformBuffer, 0, readbackBuffer, 0, 24);
        this.device.queue.submit([commandEncoder.finish()]);
    
        // Wait for the GPU to finish and map the buffer
        await readbackBuffer.mapAsync(GPUMapMode.READ);
        const arrayBuffer = readbackBuffer.getMappedRange();
        const data = new Float32Array(arrayBuffer);
    
        // Log the data
        console.log("Uniforms from GPU:", data);
    
        // Cleanup
        readbackBuffer.unmap();
    }
    
    

   

    render(scene, camera, u_resolution, u_time, u_frame) {
        if (this.depthTexture.width !== this.canvas.width || this.depthTexture.height !== this.canvas.height) {
            this.recreateDepthTexture();
        }

        const encoder = this.device.createCommandEncoder();
        this.renderPass = encoder.beginRenderPass({
            colorAttachments: [
                {
                    view: this.context.getCurrentTexture().createView(),
                    clearValue: [1, 1, 1, 1],
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ],
            depthStencilAttachment: {
                view: this.depthTexture.createView(),
                depthClearValue: 1,
                depthLoadOp: 'clear',
                depthStoreOp: 'discard',
            },
        });
        this.renderPass.setPipeline(this.pipeline);
       
        const cameraComponent = camera.getComponentOfType(Camera);
        const viewMatrix = getGlobalViewMatrix(camera);
        const projectionMatrix = getProjectionMatrix(camera);
        const { cameraUniformBuffer, cameraBindGroup } = this.prepareCamera(cameraComponent);
        this.device.queue.writeBuffer(cameraUniformBuffer, 0, viewMatrix);
        this.device.queue.writeBuffer(cameraUniformBuffer, 64, projectionMatrix);
        this.renderPass.setBindGroup(0, cameraBindGroup);

        const light = scene.find(node => node.getComponentOfType(Light));
        const lightComponent = light.getComponentOfType(Light);
        const lightMatrix = getGlobalModelMatrix(light);
        const lightPosition = mat4.getTranslation(vec3.create(), lightMatrix);
        const { lightUniformBuffer, lightBindGroup, customUniformBuffer} = this.prepareLight(lightComponent);
        this.device.queue.writeBuffer(lightUniformBuffer, 0, lightPosition);
        this.device.queue.writeBuffer(lightUniformBuffer, 12,
            new Float32Array([lightComponent.ambient]));
        this.setUniform(u_resolution, [3, 3], u_time, u_frame, customUniformBuffer);
        this.renderPass.setBindGroup(3, lightBindGroup);
        
        
        
        
        //this.logUniforms(customUniformBuffer); 
        
        this.renderNode(scene);

        this.renderPass.end();
        this.device.queue.submit([encoder.finish()]);
    }

    renderNode(node, modelMatrix = mat4.create()) {
        const localMatrix = getLocalModelMatrix(node);
        modelMatrix = mat4.multiply(mat4.create(), modelMatrix, localMatrix);

        const { modelUniformBuffer, modelBindGroup } = this.prepareNode(node);
        const normalMatrix = this.mat3tomat4(mat3.normalFromMat4(mat3.create(), modelMatrix));
        this.device.queue.writeBuffer(modelUniformBuffer, 0, modelMatrix);
        this.device.queue.writeBuffer(modelUniformBuffer, 64, normalMatrix);
        this.renderPass.setBindGroup(1, modelBindGroup);

        for (const model of getModels(node)) {
            this.renderModel(model);
        }

        for (const child of node.children) {
            this.renderNode(child, modelMatrix);
        }
    }

    renderModel(model) {
        for (const primitive of model.primitives) {
            this.renderPrimitive(primitive);
        }
    }

    renderPrimitive(primitive) {
        const { materialUniformBuffer, materialBindGroup } = this.prepareMaterial(primitive.material);
        this.device.queue.writeBuffer(materialUniformBuffer, 0, new Float32Array(primitive.material.baseFactor));
        this.renderPass.setBindGroup(2, materialBindGroup);

        const { vertexBuffer, indexBuffer } = this.prepareMesh(primitive.mesh, vertexBufferLayout);
        this.renderPass.setVertexBuffer(0, vertexBuffer);
        this.renderPass.setIndexBuffer(indexBuffer, 'uint32');

        this.renderPass.drawIndexed(primitive.mesh.indices.length);
    }

}
