// GameUI.js
export class GameUI {
    constructor() {
        this.overlay = this.createOverlay();
    }

    createOverlay() {
        // Create the overlay container
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.bottom = '0';
        overlay.style.width = '100%';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'space-around';
        overlay.style.backgroundColor = 'rgba(128, 128, 128, 0.5)'; // Semi-transparent gray

        // Add sections
        this.addSection(overlay, 'Health');
        this.addSection(overlay, 'Gas');
        this.addSection(overlay, 'Power');

        // Append to body
        document.body.appendChild(overlay);

        return overlay;
    }

    addSection(parent, title) {
        const section = document.createElement('div');
        section.style.padding = '10px';
        section.style.color = 'white';

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
    
}
