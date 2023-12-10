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

export async function CreateBullet( glava, top_glava, scene, power, trk) {
    const gltfLoader = new GLTFLoader();
    await gltfLoader.load('common/models/tank.gltf');
    
    if (Bullet.bulletFired()){ // Check if a new bullet can be fired
            console.log("Creating a bullet");

            const bullet = gltfLoader.loadNode('Sphere'); 
            
            bullet.isDynamic = true;
            bullet.aabb = {
                min: [-0.24, -0.2, -0.2],
                max: [0.2, 0.2, 0.2],
            }

            

            

            const globalTransform = getGlobalModelMatrix(top_glava);
            //console.log(getGlobalModelMatrix(top_glava));
            const globalTranslation = vec3.create();
            const globalRotation = quat.create();
            mat4.getTranslation(globalTranslation, globalTransform);
            mat4.getRotation(globalRotation, globalTransform);

                // Calculate the bullet's initial position at the tip of the cannon
            // Assuming the tip of the cannon is offset along the cannon's local Z-axis
            const cannonTipOffset = vec3.fromValues(0, 0, 0); // Adjust this vector based on your model
            vec3.transformQuat(cannonTipOffset, cannonTipOffset, globalRotation);
            vec3.add(globalTranslation, globalTranslation, cannonTipOffset);


            const bTransform = bullet.getComponentsOfType(Transform)[0]; // Accessing the first Transform component

            // Apply the calculated global transformation to the bullet's Transform component
            if (bTransform) {
                bTransform.translation = globalTranslation;
                bTransform.rotation = globalRotation;
            }


            // Set the bullet's initial velocity in the direction of the cannon
            const initialVelocity = vec3.create();
            vec3.scale(initialVelocity, cannonTipOffset, power); // 'power' determines the bullet's speed
            bullet.velocity = initialVelocity;
            //bullet.translation=bTransform;

            console.log("Bullet koordinate", bTransform.translation);


            bullet.addComponent(new Bullet(bullet, scene,  document.body, globalRotation));
            bullet.addComponent(new BulletCollision(bullet, scene, trk));
            scene.addChild(bullet);

            bullet.onRemove = () => Bullet.bulletRemoved();  //mogoče treba prestavit v Bullet.js
            // return true;
        
    };
} 
    


