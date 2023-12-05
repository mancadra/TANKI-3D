import { GUI } from './lib/dat.gui.module.js';
import { mat4 } from './lib/gl-matrix-module.js';

import {
    Camera,
    Material,
    Model,
    Node,
    Primitive,
    Sampler,
    Texture,
    Transform,
} from './common/engine/core.js';

import * as WebGPU from './common/engine/WebGPU.js';
import { ResizeSystem } from './common/engine/systems/ResizeSystem.js';
import { UpdateSystem } from './common/engine/systems/UpdateSystem.js';
import { ImageLoader } from './common/engine/loaders/ImageLoader.js';
import { JSONLoader } from './common/engine/loaders/JSONLoader.js';
import { GLTFLoader } from './common/engine/loaders/GLTFLoader.js';
import { UnlitRenderer } from './common/engine/renderers/UnlitRenderer.js';

import { FirstPersonController } from './common/engine/controllers/FirstPersonController.js';
import { Controller } from './Controller.js';

const canvas = document.querySelector('canvas');
const renderer = new UnlitRenderer(canvas);
await renderer.initialize();

const gltfLoader = new GLTFLoader();
await gltfLoader.load('./common/models/tank.gltf');


const scene2 = gltfLoader.loadScene(gltfLoader.defaultScene);
const camera = scene2.find(node => node.getComponentOfType(Camera));
const model = scene2.find(node => node.getComponentOfType(Model));


const scene = new Node();
scene.addChild(model);

//const camera = new Node();
camera.addComponent(new Transform({
    translation: [0, 1, 0],
}));
camera.addComponent(new Camera({
    near: 0.1,
    far: 100,
}));
//camera.addComponent(new FirstPersonController(camera, canvas));
//camera.addComponent(new Controller(camera, canvas));
scene.addChild(camera);
model.addChild(camera);

/*
// MAP IMPORT
const gltfLoader2 = new GLTFLoader();
await gltfLoader2.load('./common/models/map.gltf');
const floor = gltfLoader2.loadNode('Plane');
*/
const floor = new Node();
floor.addComponent(new Transform({
    scale: [10, 1, 10],
}));
floor.addComponent(new Model({
    primitives: [
        new Primitive({
            mesh: await new JSONLoader().loadMesh('./common/models/floor.json'),
            material: new Material({
                baseTexture: new Texture({
                    image: await new ImageLoader().load('./common/images/grass.png'),
                    sampler: new Sampler({
                        minFilter: 'nearest',
                        magFilter: 'nearest',
                        addressModeU: 'repeat',
                        addressModeV: 'repeat',
                    }),
                }),
            }),
        }),
    ],
}));
scene.addChild(floor);

function update(t, dt) {
    scene.traverse(node => {
        for (const component of node.components) {
            component.update?.(t, dt);
        }
    });
}

function render() {
    renderer.render(scene, camera);
}

function resize({ displaySize: { width, height }}) {
    camera.getComponentOfType(Camera).aspect = width / height;
}

new ResizeSystem({ canvas, resize }).start();
new UpdateSystem({ update, render }).start();

/*
const gui = new GUI();
const controller = camera.getComponentOfType(FirstPersonController);
//const controller = camera.getComponentOfType(Controller);
gui.add(controller, 'pointerSensitivity', 0.0001, 0.01);
gui.add(controller, 'maxSpeed', 0, 10);
gui.add(controller, 'decay', 0, 1);
gui.add(controller, 'acceleration', 1, 100);*/
