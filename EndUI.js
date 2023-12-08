// EndUI.js
export class EndUI {
    constructor() {
        // Create end screen elements
        
    }

    show() {
        this.endScreen = document.createElement('div');
        this.endScreen.id = 'end-screen';
        this.endScreen.style.position = 'absolute';
        this.endScreen.style.top = '0';
        this.endScreen.style.width = '100%';
        this.endScreen.style.height = '100%';
        this.endScreen.style.display = 'flex';
        this.endScreen.style.flexDirection = 'column';
        this.endScreen.style.justifyContent = 'center';
        this.endScreen.style.alignItems = 'center';
        this.endScreen.style.backgroundColor = 'black';
        this.endScreen.style.color = 'white';
        this.endScreen.style.fontSize = '2em';
        this.endScreen.style.cursor = 'none'; // Hide mouse cursor


        // Title
        const title = document.createElement('h1');
        title.textContent = 'The end;)';
        this.endScreen.appendChild(title);
        // Text
        const text = document.createElement('p');
        text.textContent = 'Press Enter to try again';
        text.style.fontSize = '1em';
        text.style.opacity = '1';
        this.endScreen.appendChild(text);

        // Flashing effect
        setInterval(() => {
            text.style.opacity = text.style.opacity === '1' ? '0' : '1';
        }, 1000); // Change opacity every second

        // Append to body
        document.body.appendChild(this.endScreen);

        // Key event listener
        this.keyHandler = this.handleKeyPress.bind(this);
        document.addEventListener('keydown', this.keyHandler);
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            window.location.reload();
        }
    }

    // Cleanup to prevent memory leaks
    destroy() {
        document.removeEventListener('keydown', this.keyHandler);
    }
}
