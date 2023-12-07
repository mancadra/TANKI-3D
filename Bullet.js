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
    constructor(node, scene, domElement, {
        bulletSpeed = 40, // initial bullet speed at
        velocity = [0, 0, bulletSpeed],
        gravity = 9.81,
        resistance = 0.0,
    } = {}) {
        this.node = node;
        this.scene = scene;
        this.domElement = domElement;
       
        this.bulletSpeed = bulletSpeed;
        this.velocity = velocity;
        this.gravity = gravity;
        this.resistance = resistance;
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
       // console.log(transform.translation[1]);
        // if (transform.translation[1] < -10) { 
        //      this.removeBullet(transform);
        //     /*this.velocity = [0, 0, this.bulletSpeed];
        //     this.glava.removeChild(this.node);

        //     //ponastavimo pozicijo bulleta
        //     vec3.set(transform.translation, 0, 0, 0);
        //     this.glava.addChild(this.node);*/
        // }
    
    }

    removeBullet(transform) {
        this.velocity = [0, 0, this.bulletSpeed];
        //this.glava.removeChild(this.node);

        //ponastavimo pozicijo bulleta
        vec3.set(transform.translation, 0, 0, 0);
        this.scene.removeChild(this.node);
        //this.glava.addChild(this.node);
    }
}


/*
Kot node bomo podasli bullet, 
naš vektor premika se bo posodabljal p' = p + hitrost * spremembaCasa
hitrost se bo spreminjala hitrost' = hitrost + pospešek * spremembaCasa

??? kako spreminjamo smer vektorja

če bo z v vektorju pod našim basom se node izbriše


*/



// 1. Prvi iztrelek je drugačen ker imamo v blenderju kroglo izrisano pred cevjo, tu pa jo ponastavimo v izhodišče koordinatnega sistema

// 2. Ko premaknemo tank med tem ko smo že izstrelili se hkrati premakne tudi izstreljini metek(je še vedno child glave)

// 3. Krogle se če premaknemo naklon cevi, izbrišejo prekmalu