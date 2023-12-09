import { mat4, vec3, quat } from './lib/gl-matrix-module.js';

export function SetStaticDynamic(gltfLoader) {

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

    const Tla = gltfLoader.loadNode('Tla');
    Tla.isStatic = true;

    const tarca1 = gltfLoader.loadNode('Cube.001');
    tarca1.name = "target";
    tarca1.isStatic = true;

    const tarca2 = gltfLoader.loadNode('Cube.002');
    tarca2.name = "target";
    tarca2.isStatic = true;

    const tarca3 = gltfLoader.loadNode('Cube.003');
    tarca3.name = "target";
    tarca3.isStatic = true;

    const tarca4 = gltfLoader.loadNode('Cube.004');
    tarca4.name = "target";
    tarca4.isStatic = true;

    const tarca5 = gltfLoader.loadNode('Cube.005');
    tarca5.name = "target";
    tarca5.isStatic = true;

    const tarca6 = gltfLoader.loadNode('Cube.006');
    tarca6.name = "target";
    tarca6.isStatic = true;

    const ograja1 = gltfLoader.loadNode('ograja1');
    ograja1.isStatic = true;

    const ogr2 = gltfLoader.loadNode('ograja2');
    ogr2.isStatic = true;

    const ograja3 = gltfLoader.loadNode('ograja3');
    ograja3.isStatic = true;

    const ogr4 = gltfLoader.loadNode('ograja4');
    //graja4 isStatic = true;
    //ce odkomentiram da napako:(


}