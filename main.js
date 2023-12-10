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

import { SunLight } from './light_sun.js';

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

import { StartUI } from '/StartUI.js';
import { GameUI } from './GameUI.js';
import { EndUI } from './EndUI.js';



document.addEventListener('DOMContentLoaded', () => {
    // Create and show the start UI
    const startUI = new StartUI(startGame);
    startUI.show();

});


async function startGame() {

    const canvas = document.querySelector('canvas');
    const renderer = new Renderer(canvas);
    await renderer.initialize();

    const gltfLoader = new GLTFLoader();
    await gltfLoader.load('common/models/tank.gltf');

    const scene = gltfLoader.loadScene(gltfLoader.defaultScene);
    SetStaticDynamic(gltfLoader);

    //const backgroundMusic = document.getElementById('backgroundMusic');

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
    glava.addComponent(new CevController(glava, top_glava, document.body,scene));
    const camera = scene.find(node => node.getComponentOfType(Camera));
    glava.addChild(camera);

    //const bullet = gltfLoader.loadNode('Sphere');
    //scene.removeChild(bullet);
    //bullet.addComponent(new CreateBullet(gltfLoader, top_glava, scene));


    const light = new Node();
    light.addComponent(new Transform({
        translation: [3, 3, 3],
    }));
    light.addComponent(new Light({
        ambient: 0.7,
    }));
    scene.addChild(light);

    
    //sun
    //const sunLightPosition = [100, 100, 0]; // Adjust the position as needed
   // const sunLight = new SunLight(scene, sunLightPosition, 0.5);
   // scene.addChild(sunLight);

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

    //CreateBullet(gltfLoader, top_glava, scene, trk);



    //DOT_Shader spremenljivke
    let startTime = Date.now();
    let frameCount = 0;
    let u_resolution = [0, 0];

    ////GameUI
    const gameUI = new GameUI();

    // Example: Update sections
    gameUI.updateSection('Health', '100%');
    gameUI.updateSection('Targets', '6')        //posodabljanje ko se zadane tarca...


    ///EndUI
    const endUI = new EndUI();



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
        let currentTime = Date.now();
        let elapsedTime = (Date.now() - startTime) / 1000; // seconds
        frameCount = frameCount +1;

        let remainingTime = Math.max(0, 12 - elapsedTime);
        gameUI.updateTimer(remainingTime);

        //const backgroundMusic = document.getElementById('backgroundMusic');
       // backgroundMusic.play();
        if (remainingTime <= 0) {
           // backgroundMusic.pause();
            endUI.show(remainingTime);
        }
        //console.log("Frame:" + frameCount);
        renderer.render(scene, camera,u_resolution, elapsedTime, frameCount);
    }

    function resize({ displaySize: { width, height }}) {
        camera.getComponentOfType(Camera).aspect = width / height;
        u_resolution = [width, height];
    }

    new ResizeSystem({ canvas, resize }).start();
    new UpdateSystem({ update, render }).start();

    const gui = new GUI();
    const controller = tank.getComponentOfType(Controller);
    gui.add(controller, 'baseRotationSpeed', 0.0001, 0.01);
    gui.add(controller, 'maxSpeed', 0, 200);
    gui.add(controller, 'decay', 0, 1);
    gui.add(controller, 'acceleration', 1, 100);


}


