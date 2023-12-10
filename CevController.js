import { quat, vec3, mat4 } from './lib/gl-matrix-module.js';
import { CreateBullet } from './CreateBullet.js'; // Import the CreateBullet function

import { Transform } from './common/engine/core/Transform.js';

export class CevController {

    constructor(node, top_glava, domElement, scene, trk, {
        pitch = 0,
        yaw = 0,
        velocity = [0, 0, 0],
        acceleration = 50,
        maxSpeed = 5,
        decay = 0.99999,
        pointerSensitivity = 0.002,
    } = {}) {
        this.node = node;
        this.top_glava = top_glava;
        this.domElement = domElement;
        this.trk = trk;

        this.scene = scene;
        
        this.keys = {};

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
        this.pointermoveHandler = this.pointermoveHandler.bind(this);
        
        const element = this.domElement;
        const doc = element.ownerDocument;

        element.addEventListener('click', e => element.requestPointerLock());
        doc.addEventListener('pointerlockchange', e => {
            if (doc.pointerLockElement === element) {
                doc.addEventListener('pointermove', this.pointermoveHandler);
            } else {
                doc.removeEventListener('pointermove', this.pointermoveHandler);
            }
        });

        this.keydownHandler = this.keydownHandler.bind(this); // pritisk na tipko
        this.keyupHandler = this.keyupHandler.bind(this); // spust tipke

        doc.addEventListener('keydown', this.keydownHandler);
        doc.addEventListener('keyup', this.keyupHandler);
    }

    update(t, dt) {

        const transform = this.node.getComponentOfType(Transform);
        if (transform) {
           
            // Update rotation based on the Euler angles.
            // Blocking the max/min pitch for the rotation of glava
            if (this.pitch > 0.3) this.pitch = 0.3;
            if (this.pitch < -0.296) this.pitch = -0.296;

            // Applying the rotation
            const rotation = quat.create();
            quat.rotateY(rotation, rotation, this.yaw);
            quat.rotateX(rotation, rotation, this.pitch);
            transform.rotation = rotation;
        }
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

     // Controller.js
     keydownHandler(e) {
        this.keys[e.code] = true;
        let power = 5;

        if (e.code === 'Space') {
            CreateBullet( this.node, this.top_glava, this.scene, power, this.trk); // Modify this call to pass necessary parameters
        }
    }

    keyupHandler(e) {
        this.keys[e.code] = false;
    }

}
