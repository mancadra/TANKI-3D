import { quat, vec3, mat4 } from './lib/gl-matrix-module.js';

import { Transform } from './common/engine/core/Transform.js';



export class Controller {

    constructor(node, domElement,  {
        distance = 5, //oddaljenost od kamere
        yaw = 0, // rotacija levo/desno
        velocity = [0, 0, 0], // hitrost
        acceleration = 30, // pospešek
        maxSpeed = 40,
        decay = 0.9999999, // pojemek
        baseRotationSpeed = 0.0013, // the speed at which the base of the tank rotates
    } = {}) {
        this.node = node;
        this.domElement = domElement;

        this.keys = {};

        this.distance = distance;
        this.yaw = yaw;

        this.velocity = velocity;
        this.acceleration = acceleration;
        this.maxSpeed = maxSpeed;
        this.decay = decay;
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
        const rotation = quat.create();
        const twopi = Math.PI * 2;   

        const cos = Math.cos(this.yaw);
        const sin = Math.sin(this.yaw);
        const forward = [-sin, 0, -cos];

        const acc = vec3.create()

        // Translation of the tank forward/backward
        if (this.keys['KeyW']) {
            vec3.sub(acc, acc, forward);
        }
        if (this.keys['KeyS']) {
            vec3.add(acc, acc, forward);
        }

        // Rotation of the tank left/right
        if (this.keys['KeyD']) {
            const speed = vec3.length(this.velocity);
            if (speed < 2)
                this.yaw -= 1 * this.baseRotationSpeed;
        }
        if (this.keys['KeyA']) {
            const speed = vec3.length(this.velocity);
            if (speed < 2)
                this.yaw += 1 * this.baseRotationSpeed;
        }

        vec3.scaleAndAdd(this.velocity, this.velocity, acc, dt * this.acceleration);

        // If there is no user input apply decay to stop the tank
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
        transform.rotation = rotation;
    }
    

    // Return true if there was any key pressed/ unpressed
    keydownHandler(e) {
        this.keys[e.code] = true;
    }

    keyupHandler(e) {
        this.keys[e.code] = false;
    }

}