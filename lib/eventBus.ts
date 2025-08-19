type EventCallback = (...args: unknown[]) => void;

class EventBus {
  private events: { [key: string]: EventCallback[] } = {};

  on(event: string, callback: EventCallback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event: string, callback: EventCallback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  emit(event: string, ...args: unknown[]) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(...args));
  }
}

// Create a singleton instance
export const eventBus = new EventBus();

// Event types
export const EVENTS = {
  RESTAURANT_ADDED: 'restaurant_added',
  REVIEW_DELETED: 'review_deleted',
  REVIEW_ADDED: 'review_added',
  DATA_REFRESH: 'data_refresh'
} as const;
