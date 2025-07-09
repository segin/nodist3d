// src/frontend/EventBus.js

class EventBus {
    constructor() {
        this.events = {};
    }

    subscribe(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    unsubscribe(event, callback) {
        if (!this.events[event]) return;

        this.events[event] = this.events[event].filter(
            (existingCallback) => existingCallback !== callback
        );
    }

    publish(event, data) {
        if (!this.events[event]) return;

        this.events[event].forEach((callback) => {
            callback(data);
        });
    }
}

export default new EventBus();