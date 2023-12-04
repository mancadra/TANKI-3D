import { GUI } from './lib/dat.gui.module.js';
import { mat4 } from './lib/gl-matrix-module.js';

import { ResizeSystem } from './common/engine/systems/ResizeSystem.js';
import { UpdateSystem } from './common/engine/systems/UpdateSystem.js';

import { GLTFLoader } from './common/engine/loaders/GLTFLoader.js';

import { OrbitController } from './common/engine/controllers/OrbitController.js';
import { RotateAnimator } from './common/engine/animators/RotateAnimator.js';
import { LinearAnimator } from './common/engine/animators/LinearAnimator.js';

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

import { Renderer } from './Renderer.js';
import { Light } from './Light.js';
import { ImageLoader } from './common/engine/loaders/ImageLoader.js';
import { JSONLoader } from './common/engine/loaders/JSONLoader.js';

import { Controller } from './Controller.js';
import { CevController } from './CevController.js';

import {
    calculateAxisAlignedBoundingBox,
    mergeAxisAlignedBoundingBoxes,
} from './common/engine/core/MeshUtils.js';
import { Physics } from './Physics.js';

import { Bullet } from './Bullet.js';
//import { FirstPersonController } from './common/engine/controllers/FirstPersonController.js';


const canvas = document.querySelector('canvas');
const renderer = new Renderer(canvas);
await renderer.initialize();

const gltfLoader = new GLTFLoader();
await gltfLoader.load('common/models/tank3.gltf');

const scene = gltfLoader.loadScene(gltfLoader.defaultScene);
/*camera.addComponent(new OrbitController(camera, document.body, {
    distance: 8,
}));*/


//camera.addComponent(new FirstPersonController(camera, canvas));
//scene.addChild(camera);

const model = scene.find(node => node.getComponentOfType(Model));
model.addComponent(new Controller(model, document.body, {
    distance: 2,
}));
const telo = gltfLoader.loadNode('telo');
telo.isDynamic = true;
telo.aabb = {
    min: [-0.24, -0.2, -0.2],
    max: [0.2, 0.2, 0.2],
}

const glava = gltfLoader.loadNode('glava');
glava.addComponent(new CevController(glava, document.body));
/*model.addComponent(new RotateAnimator(model, {
    startRotation: [0, 0, 0, 1],
    endRotation: [0.7071, 0, 0.7071, 0],
    duration: 5,
    loop: true,
}));*/

const camera = scene.find(node => node.getComponentOfType(Camera));
/*camera.addComponent(new Controller(camera, document.body, {
    distance: 20,
}));*/
glava.addChild(camera);


const gltfLoader2 = new GLTFLoader();
await gltfLoader2.load('common/models/cube.gltf');

const kocka = gltfLoader2.loadNode('Cube');
kocka.isStatic = true;
// kocka.addComponent(new RotateAnimator(kocka, {
//     startRotation: [0, 0, 0, 1],
//     endRotation: [0.7071, 0, 0.7071, 0],
//     duration: 5,
//     loop: true,
// }));
// model.addChild(kocka);
scene.addChild(kocka);










const light = new Node();
light.addComponent(new Transform({
    translation: [3, 3, 3],
}));
light.addComponent(new Light({
    ambient: 0.6,
}));
/*light.addComponent(new LinearAnimator(light, {
    startPosition: [3, 3, 3],
    endPosition: [-3, -3, -3],
    duration: 1,
    loop: true,
}));*/
scene.addChild(light);


// LOADING THE FLOOR
const floor = new Node();
floor.addComponent(new Transform({
    scale: [30, 1, 30],
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

//FIRING A BULLET
const bullet = gltfLoader.loadNode('bullet');
bullet.isDynamic = true;
bullet.aabb = {
    min: [-0.24, -0.2, -0.2],
    max: [0.2, 0.2, 0.2],
}
scene.removeChild(bullet);

window.addEventListener('keydown', (event) => {
    if (event.key == " ") {
        //const bullet = gltfLoader.loadNode('bullet'); // na  začetku bomo iz scene odstranili bullet
        glava.addChild(bullet);
        bullet.addComponent(new Bullet(bullet, glava, scene,  document.body));
    }
});
const poz = bullet.getComponentOfType(Transform);


const physics = new Physics(scene);
scene.traverse(node => {
    const model = node.getComponentOfType(Model);
    if (!model) {
        return;
    }

    const boxes = model.primitives.map(primitive => calculateAxisAlignedBoundingBox(primitive.mesh));
    node.aabb = mergeAxisAlignedBoundingBoxes(boxes);
});


function update(time, dt) {
    scene.traverse(node => {
        for (const component of node.components) {
            component.update?.(time, dt);
        }
    });

    physics.update(time, dt);
    scene.traverse(other => {
        if (other !== bullet && other.isStatic) {
           const isColliding = physics.resolveCollision(bullet, other);
           if (isColliding) {
            removeBullet(bullet, glava);
           }
        }
    });
}

function removeBullet(bullet, glava) {
    glava.removeChild(bullet);
    //ponstavimo pozicijo bulleta
    vec3.set(poz.translation, 0, 0, 0); // Reset position
    glava.addChild(bullet);
}

function render() {
    // console.log('Before rendering model');
    renderer.render(scene, camera);
    // console.log('After rendering model');
}

function resize({ displaySize: { width, height }}) {
    camera.getComponentOfType(Camera).aspect = width / height;
}

new ResizeSystem({ canvas, resize }).start();
new UpdateSystem({ update, render }).start();

const gui = new GUI();
const controller = model.getComponentOfType(Controller);
gui.add(controller, 'pointerSensitivity', 0.0001, 0.01);
gui.add(controller, 'maxSpeed', 0, 30);
gui.add(controller, 'decay', 0, 1);
gui.add(controller, 'acceleration', 1, 100);





