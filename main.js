import { ResizeSystem } from './common/engine/systems/ResizeSystem.js';
import { UpdateSystem } from './common/engine/systems/UpdateSystem.js';

import { GLTFLoader } from './common/engine/loaders/GLTFLoader.js';

import { OrbitController } from './common/engine/controllers/OrbitController.js';
import { RotateAnimator } from './common/engine/animators/RotateAnimator.js';
import { LinearAnimator } from './common/engine/animators/LinearAnimator.js';

import { StartUI } from './StartUI.js';

import {
    Camera,
    Model,
    Node,
    Transform,
} from './common/engine/core.js';

import { Renderer } from './Renderer.js';
import { Light } from './Light.js';


document.addEventListener('DOMContentLoaded', () => {
    // Create and show the start UI
    const startUI = new StartUI(startGame);
    startUI.show();
});


async function startGame() {
    // Logic to start the game, such as initializing the Renderer and starting the game loop
    const canvas = document.querySelector('canvas');

    const renderer = new Renderer(canvas);
    await renderer.initialize();

    const gltfLoader = new GLTFLoader();
    await gltfLoader.load('common/models/monkey.gltf');

    const scene = gltfLoader.loadScene(gltfLoader.defaultScene);

    const camera = scene.find(node => node.getComponentOfType(Camera));
    camera.addComponent(new OrbitController(camera, document.body, {
        distance: 8,
    }));

    const model = scene.find(node => node.getComponentOfType(Model));

    const light = new Node();
    light.addComponent(new Transform({
        translation: [3, 3, 3],
    }));
    light.addComponent(new Light({
        ambient: 0.1,
    }));
    light.addComponent(new LinearAnimator(light, {
        startPosition: [3, 3, 3],
        endPosition: [-3, -3, -3],
        duration: 10,
        loop: true,
    }));
    scene.addChild(light);


    let startTime = Date.now();
let frameCount = 0;
let u_resolution = [0, 0];

function update(time, dt) {
    scene.traverse(node => {
        for (const component of node.components) {
            component.update?.(time, dt);
        }
    });

    
}

function render() {
    let elapsedTime = (Date.now() - startTime) / 1000; // seconds
    frameCount = frameCount +1;
    renderer.render(scene, camera, u_resolution, elapsedTime, frameCount);
}

function resize({ displaySize: { width, height }}) {
    camera.getComponentOfType(Camera).aspect = width / height;
    u_resolution = [width, height];
}

new ResizeSystem({ canvas, resize }).start();
new UpdateSystem({ update, render }).start();


}


