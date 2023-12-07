import { mat4, vec3, quat } from './lib/gl-matrix-module.js';

export function SetStaticDynamic(gltfLoader) {

    const tla = gltfLoader.loadNode('Tla');
    tla.isStatic = true;

    const stena1 = gltfLoader.loadNode('Stena1');
    stena1.isStatic = true;

    const stena2 = gltfLoader.loadNode('Stena2');
    stena2.isStatic = true;

    const stena3 = gltfLoader.loadNode('Stena3');
    stena3.isStatic = true;

    const stena4 = gltfLoader.loadNode('Stena4');
    stena4.isStatic = true;

    const stena5 = gltfLoader.loadNode('Stena5');
    stena5.isStatic = true;

    const kocka = gltfLoader.loadNode('Cube');
    kocka.isStatic = true;
}