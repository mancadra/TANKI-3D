import { vec3, mat4 } from './lib/gl-matrix-module.js';
import { getGlobalModelMatrix } from './common/engine/core/SceneUtils.js';
import { Transform } from './common/engine/core.js';

import { Bullet, TargetsHit } from './Bullet.js'; // Make sure to import Bullet and TargetsHit

export class BulletCollision {

    constructor(bullet, scene, trk) {
        this.bullet = bullet;
        this.scene = scene;
        this.trk = trk;
    }

    update(t, dt) {
        this.scene.traverse(other => {
            if (this.bullet !== other && other.isStatic) {
                const isColliding = this.resolveCollision(this.bullet, other);
                if (isColliding) {
                    console.log("Collision!!!!!!!!!!");
                    this.trk.stTrk++;
                    
                    if (other.name === "Cube") { // Check if the name of the collided object is "Cube"
                        console.log("Target hit!!!");
                        this.scene.removeChild(other); // Remove the target
                        TargetsHit++; // Increment the number of targets hit
                        this.trk.stTrk++;
                    }
                    this.removeBullet(); // Remove the bullet in both cases
                }
            }
        });
    }

    removeBullet() {
        // const transform = this.bullet.getComponentOfType(Transform);
        // if (transform) {
        //     vec3.set(transform.translation, 0, 0, 0);
        // }
        this.scene.removeChild(this.bullet);
    }

    collisionWithTarget

    intervalIntersection(min1, max1, min2, max2) {
        return !(min1 > max2 || min2 > max1);
    }

    aabbIntersection(aabb1, aabb2) {
        return this.intervalIntersection(aabb1.min[0], aabb1.max[0], aabb2.min[0], aabb2.max[0])
            && this.intervalIntersection(aabb1.min[1], aabb1.max[1], aabb2.min[1], aabb2.max[1])
            && this.intervalIntersection(aabb1.min[2], aabb1.max[2], aabb2.min[2], aabb2.max[2]);
    }

    getTransformedAABB(node) {
        // Transform all vertices of the AABB from local to global space.
        const matrix = getGlobalModelMatrix(node);
        const { min, max } = node.aabb;
        const vertices = [
            [min[0], min[1], min[2]],
            [min[0], min[1], max[2]],
            [min[0], max[1], min[2]],
            [min[0], max[1], max[2]],
            [max[0], min[1], min[2]],
            [max[0], min[1], max[2]],
            [max[0], max[1], min[2]],
            [max[0], max[1], max[2]],
        ].map(v => vec3.transformMat4(v, v, matrix));

        // Find new min and max by component.
        const xs = vertices.map(v => v[0]);
        const ys = vertices.map(v => v[1]);
        const zs = vertices.map(v => v[2]);
        const newmin = [Math.min(...xs), Math.min(...ys), Math.min(...zs)];
        const newmax = [Math.max(...xs), Math.max(...ys), Math.max(...zs)];
        return { min: newmin, max: newmax };
    }

    resolveCollision(a, b) {
        // Get global space AABBs.
        const aBox = this.getTransformedAABB(a);
        const bBox = this.getTransformedAABB(b);

        // Check if there is collision.
        const isColliding = this.aabbIntersection(aBox, bBox);
        if (!isColliding) {
            return false;
        }
        return true;
    }

}


