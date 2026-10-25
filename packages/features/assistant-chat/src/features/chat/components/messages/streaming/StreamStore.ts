type Listener = (chunk: string, done: boolean) => void;

class StreamStore {
  private buffers = new Map<string, string>();

  private listeners = new Map<string, Set<Listener>>();

  emit(id: string, chunk: string, finished: boolean) {
    const current = this.buffers.get(id) ?? "";

    this.buffers.set(id, current + chunk);

    this.listeners.get(id)?.forEach((listener) => {
      listener(chunk, finished);
    });
  }

  getText(id: string) {
    return this.buffers.get(id) ?? "";
  }

  clear(id: string) {
    this.buffers.delete(id);
    this.listeners.delete(id);
  }

  subscribe(id: string, listener: Listener) {
    if (!this.listeners.has(id)) {
      this.listeners.set(id, new Set());
    }

    this.listeners.get(id)!.add(listener);

    return () => {
      this.listeners.get(id)?.delete(listener);
    };
  }
}

export const streamStore = new StreamStore();
