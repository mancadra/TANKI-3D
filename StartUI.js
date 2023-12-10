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
        startButton.style.fontSize = '2em';
        startButton.style.padding = '20px 40px';
        startButton.style.marginTop = '10%';
        startButton.style.backgroundColor = '#FFFFFF';
        startButton.style.color = '#000000';
        startButton.style.border = '2px solid #000000';
        startButton.style.cursor = 'pointer';
        startButton.onclick = () => {
            titleScreen.style.display = 'none';
            this.startCallback();
        };
        titleScreen.appendChild(startButton);

        // Instructions button
        const instructionsButton = document.createElement('button');
        instructionsButton.textContent = 'Instructions';
        instructionsButton.style.fontSize = '1.5em';
        instructionsButton.style.padding = '20px 40px';
        instructionsButton.style.marginTop = '40px';
        instructionsButton.style.marginBottom = '50px'; 
        instructionsButton.style.backgroundColor = '#FFFFFF';
        instructionsButton.style.color = '#000000';
        instructionsButton.style.border = '2px solid #000000';
        instructionsButton.style.cursor = 'pointer';
        instructionsButton.onclick = () => {
            // Create larger pop-up modal
            const popup = document.createElement('div');
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.backgroundColor = '#FFFFFF';
            popup.style.padding = '40px';
            popup.style.border = '2px solid #000000';
            popup.style.zIndex = '1000';

            const instructionsText = document.createElement('p');
            instructionsText.textContent = 'Tvoja naloga je da poskušaš v čim krajšem času zadeti vse tarče. Tarč je 6. Po polju se lahko premikaš s tipkami awsd z miško pa rotiraš glavo. Space uporabi za streljanje';
            popup.appendChild(instructionsText);

            // Cancel button inside the pop-up
            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.style.marginTop = '20px';
            cancelButton.style.backgroundColor = '#FFFFFF';
            cancelButton.style.color = '#000000';
            cancelButton.style.border = '2px solid #000000';
            cancelButton.style.cursor = 'pointer';
            cancelButton.onclick = () => {
                document.body.removeChild(popup);
            };
            popup.appendChild(cancelButton);

            document.body.appendChild(popup);
        };

        titleScreen.appendChild(instructionsButton);

        // Append to body
        document.body.appendChild(titleScreen);
    }
}
