import { Node, Transform } from './common/engine/core.js'; // Adjust the path as necessary
import { Light } from './Light.js';

export class SunLight {
    constructor(scene, position = [0, 0, 0], ambient ) {
        this.lightNode = new Node();
        this.lightNode.addComponent(new Transform({ translation: position }));
        this.lightNode.addComponent(new Light({ ambient: ambient }));
        scene.addChild(this.lightNode);
    }

    // Add additional methods as necessary, such as for changing light properties
}
