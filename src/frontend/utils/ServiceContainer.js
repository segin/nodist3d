/**
 * ServiceContainer for Dependency Injection.
 * Manages the registration and retrieval of services (managers, utilities, etc.).
 */
export class ServiceContainer {
  constructor() {
    this.services = new Map();
  }

  /**
   * Registers a service instance.
   * @param {string} name - The unique name of the service.
   * @param {object} instance - The service instance.
   * @throws {Error} If a service with the same name is already registered.
   */
  register(name, instance) {
    if (this.services.has(name)) {
      throw new Error(`Service '${name}' is already registered.`);
    }
    this.services.set(name, instance);
  }

  /**
   * Retrieves a registered service.
   * @param {string} name - The name of the service to retrieve.
   * @returns {object} The service instance.
   * @throws {Error} If the service is not found.
   */
  get(name) {
    if (!this.services.has(name)) {
      throw new Error(`Service '${name}' not found.`);
    }
    return this.services.get(name);
  }
}
