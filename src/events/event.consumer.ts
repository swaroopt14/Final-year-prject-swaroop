import { eventBus } from "./index.js";
import type { TopicName } from "./topics.js";

export function subscribe<T>(topic: TopicName, handler: (payload: T) => void | Promise<void>) {
  return eventBus.subscribe(topic, handler);
}

