import { quat, vec3, mat4 } from './lib/gl-matrix-module.js';

import { Transform } from './common/engine/core/Transform.js';

export class Controller {

    constructor(node, domElement, {
        distance = 5, //oddaljenost od kamere
        pitch = 0,
        yaw = 0, // nihanje
        velocity = [0, 0, 0], // hitrost
        acceleration = 50, // pospešek
        maxSpeed = 5,
        decay = 0.99999,
        pointerSensitivity = 0.002,
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
        this.pointerSensitivity = pointerSensitivity;

        this.initHandlers();
    }

    initHandlers() {
        this.pointermoveHandler = this.pointermoveHandler.bind(this); // spremlja miško
        this.keydownHandler = this.keydownHandler.bind(this); // pritisk na tipko
        this.keyupHandler = this.keyupHandler.bind(this); // spust tipke

        const element = this.domElement;
        const doc = element.ownerDocument;

        doc.addEventListener('keydown', this.keydownHandler);
        doc.addEventListener('keyup', this.keyupHandler);

        element.addEventListener('click', e => element.requestPointerLock());
        doc.addEventListener('pointerlockchange', e => {
            if (doc.pointerLockElement === element) {
                doc.addEventListener('pointermove', this.pointermoveHandler);
            } else {
                doc.removeEventListener('pointermove', this.pointermoveHandler);
            }
        });
    }

    update(t, dt) {
        //console.log(dt, t);
        

        const cos = Math.cos(this.yaw);
        const sin = Math.sin(this.yaw);
        const forward = [-sin, 0, -cos];
        const right = [cos, 0, -sin];

        const acc = vec3.create()
        if (this.keys['KeyW']) {
            console.log("W pressed");
            vec3.add(acc, acc, forward);
        }
        if (this.keys['KeyS']) {
            console.log("S pressed");
            vec3.sub(acc, acc, forward);
        }
        if (this.keys['KeyD']) {
            console.log("D pressed");
            vec3.add(acc, acc, right);
        }
        if (this.keys['KeyA']) {
            console.log("A pressed");
            vec3.sub(acc, acc, right);
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

        // Update rotation based on the Euler angles.
        const rotation = quat.create();
        quat.rotateY(rotation, rotation, this.yaw);
        quat.rotateX(rotation, rotation, this.pitch);
        transform.rotation = rotation;

        const translation = [0, 0, this.distance];
        vec3.rotateX( translation,  translation, [0, 0, 0], this.pitch);
        vec3.rotateY( translation,  translation, [0, 0, 0], this.yaw);

        transform.translation = translation;
    }

    pointermoveHandler(e) {
        const dx = e.movementX;
        const dy = e.movementY;

        this.pitch -= dy * this.pointerSensitivity;
        this.yaw   -= dx * this.pointerSensitivity;

        const twopi = Math.PI * 2;
        const halfpi = Math.PI / 2;

        this.pitch = Math.min(Math.max(this.pitch, -halfpi), halfpi);
        this.yaw = ((this.yaw % twopi) + twopi) % twopi;
    }

    keydownHandler(e) {
        this.keys[e.code] = true;
    }

    keyupHandler(e) {
        this.keys[e.code] = false;
    }

}