import type { TopicName } from "./topics.js";

type Handler<T> = (payload: T) => void | Promise<void>;

export class KafkaMock {
  private listeners = new Map<TopicName, Set<Handler<unknown>>>();

  subscribe<T>(topic: TopicName, handler: Handler<T>) {
    const set = this.listeners.get(topic) ?? new Set();
    set.add(handler as Handler<unknown>);
    this.listeners.set(topic, set);

    return () => {
      const current = this.listeners.get(topic);
      current?.delete(handler as Handler<unknown>);
    };
  }

  async publish<T>(topic: TopicName, payload: T) {
    const set = this.listeners.get(topic);
    if (!set?.size) return;
    await Promise.all(Array.from(set).map((h) => h(payload)));
  }
}

