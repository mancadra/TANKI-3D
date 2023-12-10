// GameUI.js
export class GameUI {
    constructor() {
        this.overlay = this.createOverlay();
        this.timerElement = this.createTimerElement();
    }

    createOverlay() {
        // Create the overlay container
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0'; // Set left property to 0 for top-left corner
        overlay.style.width = '30%'; // Adjust the width as desired
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'space-around';
        overlay.style.backgroundColor = 'rgba(230, 255, 255, 0.5)'; // Semi-transparent gray
        overlay.style.borderRadius = '10px';

    
        this.addSection(overlay, 'Health');
        this.addSection(overlay, 'Targets hit:');

        // Append to body
        document.body.appendChild(overlay);

        return overlay;
    }

    createTimerElement() {
        const timer = document.createElement('div');
        timer.style.color = 'white';
        timer.style.fontSize = '1em';
        this.overlay.appendChild(timer);
        return timer;
    }

    addSection(parent, title) {
        const section = document.createElement('div');
        section.style.padding = '10px';
        section.style.color = 'white';
        section.style.textAlign = 'center';

        const header = document.createElement('h3');
        header.textContent = title;
        section.appendChild(header);

        parent.appendChild(section);
    }

    // Method to update a specific section
    updateSection(title, value) {
        const sections = this.overlay.querySelectorAll('div');
        sections.forEach(section => {
            const header = section.querySelector('h3');
            if (header && header.textContent === title) {
                // Check if there's an existing value element
                let valueElem = section.querySelector('span');
                if (!valueElem) {
                    // If not, create it
                    valueElem = document.createElement('span');
                    section.appendChild(valueElem);
                }
                // Update the value text
                valueElem.textContent = `${value}`;
            }
        });
    }
    updateTimer(timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
      // Clear the previous content
    this.timerElement.innerHTML = '';

    // Create the "Time:" element
    const timeLabel = document.createElement('div');
    timeLabel.textContent = 'Time:';;
    timeLabel.style.paddingTop = '30px'; // Adjust the spacing between the lines
    timeLabel.style.color = 'white';
    timeLabel.style.textAlign = 'center';
    this.timerElement.appendChild(timeLabel);

    // Create the countdown time element
    const countdownTime = document.createElement('div');
    countdownTime.textContent = `${minutes}:${seconds}`;

    countdownTime.style.color = 'white';
    countdownTime.style.textAlign = 'center';
    this.timerElement.appendChild(countdownTime);
}
   /* updateTimer(timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        this.timerElement.textContent = `Time: ${minutes}:${seconds}`;
    }*/
    
}
