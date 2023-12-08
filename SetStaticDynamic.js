import { mat4, vec3, quat } from './lib/gl-matrix-module.js';

export function SetStaticDynamic(gltfLoader) {

    const okolje = gltfLoader.loadNode('Okolje');
    okolje.isStatic = true;

    const kocka = gltfLoader.loadNode('Cube.001');
    kocka.name = "target";
    kocka.isStatic = true;

    const ograja = gltfLoader.loadNode('Ograja');
    ograja.isStatic = true;


}