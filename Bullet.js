import { quat, vec3, mat4 } from './lib/gl-matrix-module.js';

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


export class Bullet {
    static activeBullets = 0; // Static variable to keep track of active bullets
    constructor(node, scene, domElement, top_glava_rotation, trk, {
        bulletSpeed = 40, // initial bullet speed at
        velocity = [0, 0, bulletSpeed],
        gravity = 9.81,
        resistance = 0.0,
    } = {}) {
        this.node = node;
        this.scene = scene;
        this.domElement = domElement;
        this.trk = trk;
       
        this.bulletSpeed = bulletSpeed;

        //Calculate initial velocity based on top_glava rotation
        const forwardDirection = vec3.fromValues(0, -1, 0); // Forward direction
        const initialVelocity = vec3.create()
        
        vec3.transformQuat(initialVelocity, forwardDirection, top_glava_rotation); // Apply top_glava rotation
        vec3.scale(initialVelocity, initialVelocity, bulletSpeed); // Scale by bullet speed
;

        this.velocity = initialVelocity;
        this.gravity = gravity;
        this.resistance = resistance;
    }

     // Call this method when a bullet is fired
     static bulletFired() {
        if (this.activeBullets < 10) {
            this.activeBullets++;
            return true;
        }
        return false; // If there are already 10 bullets, do not fire
    }

     // Call this method when a bullet is removed
     static bulletRemoved() {
        this.activeBullets--;
    }

    update(t, dt) {
        const accelerationDueToGravity = [0, -this.gravity, 0];
        const resistanceForce = vec3.scaleAndAdd([0, 0, 0], [0, 0, 0], this.velocity, -this.resistance);
    
        vec3.scaleAndAdd(this.velocity, this.velocity, accelerationDueToGravity, dt);
        vec3.scaleAndAdd(this.velocity, this.velocity, resistanceForce, dt);
    
        // Update translation based on velocity
        const transform = this.node.getComponentOfType(Transform);
        if (!transform) {
            return;
        }
    
        vec3.scaleAndAdd(transform.translation, transform.translation, this.velocity, dt);
     
    
    }

    removeBullet(transform) {
        this.velocity = [0, 0, this.bulletSpeed];
        //this.glava.removeChild(this.node);

        //ponastavimo pozicijo bulleta
        vec3.set(transform.translation, 0, 0, 0);
        this.scene.removeChild(this.node);
        //this.glava.addChild(this.node);
    }

    handleCollision(hitObject) {
        if (hitObject === "target") {
            // Increase TargetsHit counter
            // Assume TargetsHit is a global variable or part of a game state manager
            TargetsHit++;
            this.trk.stTrk++;
           
            this.removeBullet(this.node.getComponentOfType(Transform));
        } else {
           
            this.removeBullet(this.node.getComponentOfType(Transform));
        }
    }


}


export let TargetsHit = 0;

