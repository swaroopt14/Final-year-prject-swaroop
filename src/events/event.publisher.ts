import { eventBus } from "./index.js";
import type { TopicName } from "./topics.js";

export async function publish<T>(topic: TopicName, payload: T) {
  await eventBus.publish(topic, payload);
}

