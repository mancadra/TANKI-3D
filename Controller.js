import { quat, vec3, mat4 } from './lib/gl-matrix-module.js';

import { Transform } from './common/engine/core/Transform.js';
import { CreateBullet } from './CreateBullet.js'; // Import the CreateBullet function
import { Bullet } from './Bullet.js'; // Import the CreateBullet function



export class Controller {

    constructor(node, domElement, {
        distance = 5, //oddaljenost od kamere
        pitch = 0,
        yaw = 0, // nihanje
        velocity = [0, 0, 0], // hitrost
        acceleration = 50, // pospešek
        maxSpeed = 200,
        decay = 0.99999,
        //pointerSensitivity = 0.002,
        baseRotationSpeed = 0.006,
    } = {}) {
        this.node = node;
        this.domElement = domElement;

        this.keys = {};

        this.distance = distance;
        this.pitch = pitch;
        this.yaw = yaw;

        this.velocity = velocity;
        this.acceleration = acceleration;
        this.maxSpeed = maxSpeed;
        this.decay = decay;
        //this.pointerSensitivity = pointerSensitivity;
        this.baseRotationSpeed = baseRotationSpeed;

        this.initHandlers();
    }

    initHandlers() {
        this.keydownHandler = this.keydownHandler.bind(this); // pritisk na tipko
        this.keyupHandler = this.keyupHandler.bind(this); // spust tipke

        const element = this.domElement;
        const doc = element.ownerDocument;

        doc.addEventListener('keydown', this.keydownHandler);
        doc.addEventListener('keyup', this.keyupHandler);

    }

    update(t, dt) {
        //console.log(dt, t);
        const rotation = quat.create();
        const twopi = Math.PI * 2;   

        const cos = Math.cos(this.yaw);
        const sin = Math.sin(this.yaw);
        const forward = [-sin, 0, -cos];
        const right = [cos, 0, -sin];

        const acc = vec3.create()
        if (this.keys['KeyW']) {
            // console.log("W pressed");
            vec3.sub(acc, acc, forward);
        }
        if (this.keys['KeyS']) {
            // console.log("S pressed");
            vec3.add(acc, acc, forward);
        }
        if (this.keys['KeyD']) {
            // console.log("D pressed");
            //vec3.sub(acc, acc, right);
            this.yaw -= 1 * this.baseRotationSpeed;
        }
        if (this.keys['KeyA']) {
            // console.log("A pressed");
            //vec3.add(acc, acc, right);
            this.yaw += 1 * this.baseRotationSpeed;
        }

        vec3.scaleAndAdd(this.velocity, this.velocity, acc, dt * this.acceleration);

        // If there is no user input apply decay
        if (!this.keys['KeyW'] &&
            !this.keys['KeyS'] &&
            !this.keys['KeyD'] &&
            !this.keys['KeyA'])
        {
            const decay = Math.exp(dt * Math.log(1 - this.decay));
            vec3.scale(this.velocity, this.velocity, decay);
        }

        // Limit speed to prevent accelerating to infinity and beyond.
        const speed = vec3.length(this.velocity);
        if (speed > this.maxSpeed) {
            vec3.scale(this.velocity, this.velocity, this.maxSpeed / speed);
        }

        // Update translation based on velocity.
        const transform = this.node.getComponentOfType(Transform);
        if (!transform) {
            return;
        }
        vec3.scaleAndAdd(transform.translation, transform.translation, this.velocity, dt);

        this.yaw = ((this.yaw % twopi) + twopi) % twopi;
        quat.rotateY(rotation, rotation, this.yaw);
        //quat.rotateX(rotation, rotation, this.pitch);
        transform.rotation = rotation;
    }

    
    // Controller.js
    
    keydownHandler(e) {
        this.keys[e.code] = true;

       /* if (e.code === 'Space') {
            CreateBullet( top_glava, scene, trk); // Modify this call to pass necessary parameters
        }*/
    }


    keyupHandler(e) {
        this.keys[e.code] = false;
    }

}