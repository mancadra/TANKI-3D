import { mat4, vec3, quat } from './lib/gl-matrix-module.js';

export function SetStaticDynamic(gltfLoader) {
    const tla = gltfLoader.loadNode('Plane');
    tla.isStatic = true;

    const plane1 = gltfLoader.loadNode('Plane.001');
    plane1.isStatic = true;

    const plane2 = gltfLoader.loadNode('Plane.002');
    plane2.isStatic = true;

    const plane3 = gltfLoader.loadNode('Plane.003');
    plane3.isStatic = true;

    const plane4 = gltfLoader.loadNode('Plane.004');
    plane4.isStatic = true;

    const plane5 = gltfLoader.loadNode('Plane.005');
    plane5.isStatic = true;
}