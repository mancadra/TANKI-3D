import { GUI } from './lib/dat.gui.module.js';
import { mat4 } from './lib/gl-matrix-module.js';

import { ResizeSystem } from './common/engine/systems/ResizeSystem.js';
import { UpdateSystem } from './common/engine/systems/UpdateSystem.js';

import { GLTFLoader } from './common/engine/loaders/GLTFLoader.js';

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

import { Controller } from './Controller.js';
import { CevController } from './CevController.js';

import {
    calculateAxisAlignedBoundingBox,
    mergeAxisAlignedBoundingBoxes,
} from './common/engine/core/MeshUtils.js';
import { Physics } from './Physics.js';
import { CreateBullet } from './CreateBullet.js';
import { SetStaticDynamic } from './SetStaticDynamic.js';
import { BulletCollision } from './BulletCollision.js';

const canvas = document.querySelector('canvas');
const renderer = new Renderer(canvas);
await renderer.initialize();

const gltfLoader = new GLTFLoader();
await gltfLoader.load('common/models/tank.gltf');

const scene = gltfLoader.loadScene(gltfLoader.defaultScene);
SetStaticDynamic(gltfLoader);


// TANK
const tank = gltfLoader.loadNode('telo');
tank.isDynamic = true;
tank.aabb = {
    min: [-0.24, -0.2, -0.2],
    max: [0.2, 0.2, 0.2],
}
tank.addComponent(new Controller(tank, document.body, {
    distance: 2,
}));
const glava = gltfLoader.loadNode('glava');
const top_glava = gltfLoader.loadNode('top_glava');
glava.addComponent(new CevController(glava, top_glava, document.body));
const camera = scene.find(node => node.getComponentOfType(Camera));
glava.addChild(camera);

const bullet = gltfLoader.loadNode('Sphere');
scene.removeChild(bullet);
//bullet.addComponent(new CreateBullet(gltfLoader, top_glava, scene));


const light = new Node();
light.addComponent(new Transform({
    translation: [3, 3, 3],
}));
light.addComponent(new Light({
    ambient: 0.7,
}));
scene.addChild(light);

const physics = new Physics(scene);

scene.traverse(node => {
    const model = node.getComponentOfType(Model);
    if (!model) {
        return;
    }

    const boxes = model.primitives.map(primitive => calculateAxisAlignedBoundingBox(primitive.mesh));
    node.aabb = mergeAxisAlignedBoundingBoxes(boxes);
});


//const cB = new CreateBullet(gltfLoader, top_glava, scene);
let trk = { // naredimo object
    boolTrk: false
}

let nrTrk = 0;

CreateBullet(gltfLoader, top_glava, scene, trk);

function update(time, dt) {
    scene.traverse(node => {
        for (const component of node.components) {
            component.update?.(time, dt);
            if (trk.boolTrk == true) {
                nrTrk++;
                console.log("WOOOOOO", nrTrk);
            }
            trk.boolTrk = false;
        }
    });
    physics.update(time, dt);
    //cB.update(time, dt);
    //createBullet(bullet, top_glava, scene);
    
}

function render() {
    renderer.render(scene, camera);
}

function resize({ displaySize: { width, height }}) {
    camera.getComponentOfType(Camera).aspect = width / height;
}

new ResizeSystem({ canvas, resize }).start();
new UpdateSystem({ update, render }).start();

const gui = new GUI();
const controller = tank.getComponentOfType(Controller);
gui.add(controller, 'baseRotationSpeed', 0.0001, 0.01);
gui.add(controller, 'maxSpeed', 0, 200);
gui.add(controller, 'decay', 0, 1);
gui.add(controller, 'acceleration', 1, 100);





