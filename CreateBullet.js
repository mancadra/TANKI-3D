import { mat4, vec3, quat } from './lib/gl-matrix-module.js';
import { GLTFLoader } from './common/engine/loaders/GLTFLoader.js';
import { Transform } from './common/engine/core.js';
import { Bullet } from './Bullet.js';
import { BulletCollision } from './BulletCollision.js';

export function createBullet(model, glava, scene, gltfLoader) {
    const bullet = gltfLoader.loadNode('Sphere');
    bullet.isDynamic = true;
    bullet.aabb = {
        min: [-0.24, -0.2, -0.2],
        max: [0.2, 0.2, 0.2],
    }
    scene.removeChild(bullet);

    window.addEventListener('keydown', (event) => {
        if (event.key === " ") {
            
            glava.addChild(bullet);
            
            bullet.addComponent(new Bullet(bullet, glava, scene,  document.body));
            bullet.addComponent(new BulletCollision(bullet, scene));

        }
    });
}
