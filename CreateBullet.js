import { mat4, vec3, quat } from './lib/gl-matrix-module.js';
import { GLTFLoader } from './common/engine/loaders/GLTFLoader.js';
import { Transform, Node, Model} from './common/engine/core.js';
import { Bullet } from './Bullet.js';
import { BulletCollision } from './BulletCollision.js';
import { Controller } from './Controller.js';
import { getGlobalModelMatrix, getLocalModelMatrix} from './common/engine/core/SceneUtils.js'


// export class CreateBullet {

//     constructor (gltfLoader, top_glava, scene) {
//         this.gltfLoader = gltfLoader;
//         this.top_glava = top_glava;
//         this.scene = scene;
//     }

//     update(t, dt) {   
//         window.addEventListener('keydown', (event) => { 
//             if (event.key === " ") {
//                 console.log("Space key pressed");

//                 const bullet = this.gltfLoader.loadNode('Sphere'); 
                
//                 bullet.isDynamic = true;
//                 bullet.aabb = {
//                     min: [-0.24, -0.2, -0.2],
//                     max: [0.2, 0.2, 0.2],
//                 }

//                 const bTransform = bullet.getComponentsOfType(Transform);

//                 const globalTransform = getGlobalModelMatrix(this.top_glava);
//                 const globalTranslation = vec3.create();
//                 const globalRotation = quat.create();
//                 mat4.getTranslation(globalTranslation, globalTransform);
//                 mat4.getRotation(globalRotation, globalTransform);

//                 bTransform.translation = globalTranslation;
//                 bTransform.rotation = globalRotation;
//                 console.log("Bullet koordinate", bTransform.rotation);
//                 this.scene.addChild(bullet);

//                 bullet.addComponent(new Bullet(bullet, this.scene,  document.body));
//                 bullet.addComponent(new BulletCollision(bullet, this.scene));
//                 // return true;
//             }
//         });
//     }
// }
//}

export function CreateBullet(gltfLoader, top_glava, scene, trk) {
    window.addEventListener('keydown', (event) => { 
        if (event.key === " ") {
            console.log("Space key pressed");

            const bullet = gltfLoader.loadNode('Sphere'); 
            
            bullet.isDynamic = true;
            bullet.aabb = {
                min: [-0.24, -0.2, -0.2],
                max: [0.2, 0.2, 0.2],
            }

            const bTransform = bullet.getComponentsOfType(Transform);

            const globalTransform = getGlobalModelMatrix(top_glava);
            const globalTranslation = vec3.create();
            const globalRotation = quat.create();
            mat4.getTranslation(globalTranslation, globalTransform);
            mat4.getRotation(globalRotation, globalTransform);

            bTransform.translation = globalTranslation;
            bTransform.rotation = globalRotation;
            console.log("Bullet koordinate", bTransform.rotation);
            scene.addChild(bullet);

            bullet.addComponent(new Bullet(bullet, scene,  document.body));
            bullet.addComponent(new BulletCollision(bullet, scene, trk));
            // return true;
        }
    });
} 
    


