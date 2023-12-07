// StartUI.js
export class StartUI {
    constructor(startCallback) {
        this.startCallback = startCallback;
    }

    show() {
        // Create title screen elements
        const titleScreen = document.createElement('div');
        titleScreen.id = 'title-screen';
        titleScreen.style.position = 'absolute';
        titleScreen.style.top = '0';
        titleScreen.style.width = '100%';
        titleScreen.style.height = '100%';
        titleScreen.style.display = 'flex';
        titleScreen.style.flexDirection = 'column';
        titleScreen.style.justifyContent = 'center';
        titleScreen.style.alignItems = 'center';
        titleScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        titleScreen.style.color = 'white';
        titleScreen.style.fontSize = '2em';

        // Title
        const title = document.createElement('h1');
        title.textContent = 'Tanks 3D-ish ;)';
        titleScreen.appendChild(title);

        // Start button
        const startButton = document.createElement('button');
        startButton.textContent = 'Start Game';
        startButton.style.fontSize = '1em';
        startButton.style.padding = '10px 20px';
        startButton.style.cursor = 'pointer';
        startButton.onclick = () => {
            titleScreen.style.display = 'none';
            this.startCallback();
        };
        titleScreen.appendChild(startButton);

        // Append to body
        document.body.appendChild(titleScreen);
    }
}
