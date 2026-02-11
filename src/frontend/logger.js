
/**
 * Simple logger and toast notification system.
 */

const levels = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  SILENT: 5
};

let currentLevel = levels.INFO;

const log = {
  levels,
  setLevel: (level) => {
    if (typeof level === 'string' && levels[level.toUpperCase()] !== undefined) {
      currentLevel = levels[level.toUpperCase()];
    } else if (typeof level === 'number') {
      currentLevel = level;
    }
  },
  trace: (...args) => {
    if (currentLevel <= levels.TRACE) console.trace(...args);
  },
  debug: (...args) => {
    if (currentLevel <= levels.DEBUG) console.debug(...args);
  },
  info: (...args) => {
    if (currentLevel <= levels.INFO) console.info(...args);
  },
  warn: (...args) => {
    if (currentLevel <= levels.WARN) console.warn(...args);
  },
  error: (...args) => {
    if (currentLevel <= levels.ERROR) console.error(...args);
  }
};

/**
 * Manages toast notifications in the UI.
 */
export class ToastManager {
  constructor() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
      `;
      document.body.appendChild(this.container);
    }
  }

  /**
   * Shows a toast notification.
   * @param {string} message - The message to show.
   * @param {string} type - The type of toast (info, success, warn, error).
   * @param {number} duration - How long to show the toast in ms.
   */
  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    const colors = {
      info: '#2196F3',
      success: '#4CAF50',
      warn: '#FFC107',
      error: '#F44336'
    };

    toast.style.cssText = `
      background: ${colors[type] || colors.info};
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      font-family: sans-serif;
      font-size: 14px;
      min-width: 200px;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    toast.textContent = message;

    this.container.appendChild(toast);
    
    // Trigger fade in
    setTimeout(() => {
      toast.style.opacity = '1';
    }, 10);

    // Fade out and remove
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentNode) {
          this.container.removeChild(toast);
        }
      }, 300);
    }, duration);
  }
}

export const toast = new ToastManager();
export default log;
