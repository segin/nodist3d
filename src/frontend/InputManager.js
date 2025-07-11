import { Events } from './constants.js';

export class InputManager {
    constructor(eventBus) {
        this.eventBus = eventBus;
        window.addEventListener('keydown', this.onKeyDown.bind(this));
    }

    onKeyDown(event) {
        switch (event.key) {
            case 'z':
                if (event.ctrlKey || event.metaKey) {
                    this.eventBus.publish(Events.UNDO);
                }
                break;
            case 'y':
                if (event.ctrlKey || event.metaKey) {
                    this.eventBus.publish(Events.REDO);
                }
                break;
            case 'Delete':
            case 'Backspace':
                this.eventBus.publish(Events.DELETE_OBJECT);
                break;
        }
    }
}
