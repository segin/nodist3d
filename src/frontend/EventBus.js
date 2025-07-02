class EventBus {
    constructor() {
        this.eventListeners = {};
    }

    on(eventName, listener) {
        if (!this.eventListeners[eventName]) {
            this.eventListeners[eventName] = [];
        }
        this.eventListeners[eventName].push(listener);
    }

    emit(eventName, data) {
        if (this.eventListeners[eventName]) {
            this.eventListeners[eventName].forEach(listener => listener(data));
        }
    }

    off(eventName, listener) {
        if (this.eventListeners[eventName]) {
            this.eventListeners[eventName] = this.eventListeners[eventName].filter(
                existingListener => existingListener !== listener
            );
        }
    }
}

export default EventBus;