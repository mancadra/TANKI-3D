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
        titleScreen.style.backgroundImage = "url('common/models/Tanks3D_titleScreen.png')";
        titleScreen.style.backgroundSize = 'cover';
        titleScreen.style.backgroundPosition = 'center center';
        titleScreen.style.backgroundRepeat = 'no-repeat';

        // Start button
        const startButton = document.createElement('button');
        startButton.textContent = 'Start Game';
        startButton.style.fontSize = '2em'; // Larger font size for better visibility
        startButton.style.padding = '20px 40px'; // Bigger button for better visibility
        startButton.style.margin = 'auto'; // Center button in the screen
        startButton.style.backgroundColor = '#FFFFFF'; // A color that stands out
        startButton.style.color = '#000000'; // Text color that contrasts with the button
        startButton.style.border = '2px solid #000000'; // Add border to enhance visibility
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
