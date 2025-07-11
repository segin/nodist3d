import { Events } from './constants.js';

export class History {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.undoStack = [];
        this.redoStack = [];
        this.transformControls = null;

        this.eventBus.subscribe(Events.HISTORY_CHANGE, (command) => this.add(command));
    }

    setTransformControls(controls) {
        this.transformControls = controls;
    }

    add(command) {
        this.undoStack.push(command);
        this.redoStack = []; // Clear the redo stack
    }

    undo() {
        if (this.transformControls) {
            this.transformControls.detach();
        }
        const command = this.undoStack.pop();
        if (command) {
            command.undo();
            this.redoStack.push(command);
        }
    }

    redo() {
        if (this.transformControls) {
            this.transformControls.detach();
        }
        const command = this.redoStack.pop();
        if (command) {
            command.execute();
            this.undoStack.push(command);
        }
    }
}
