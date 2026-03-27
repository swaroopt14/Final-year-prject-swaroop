import axios from "axios";
import { env } from "../../config/env.config.js";

export class QLearningService<State extends string, Action extends string> {
  private qTable = new Map<string, number>();

  constructor(
    private readonly alpha = 0.1,
    private readonly gamma = 0.9
  ) {}

  update(state: State, action: Action, reward: number, nextState?: State) {
    const key = `${state}::${action}`;
    const current = this.qTable.get(key) ?? 0;

    const nextMax = nextState ? this.getMaxQ(nextState) : 0;
    const updated = current + this.alpha * (reward + this.gamma * nextMax - current);
    this.qTable.set(key, updated);
  }

  async updateAndSync(state: State, action: Action, reward: number, nextState?: State) {
    this.update(state, action, reward, nextState);
    try {
      await axios.post(
        `${env.ML_SERVICE_BASE_URL}/qlearning/update`,
        {
          state,
          action,
          reward,
          next_state: nextState,
          alpha: this.alpha,
          gamma: this.gamma
        },
        { timeout: 10_000 }
      );
    } catch {
      // Keep local Q-table behavior even when remote RL service is unavailable.
    }
  }

  getBestAction(state: State, actions: readonly Action[]): Action | undefined {
    let best: Action | undefined;
    let bestQ = -Infinity;
    for (const action of actions) {
      const q = this.getQ(state, action);
      if (q > bestQ) {
        bestQ = q;
        best = action;
      }
    }
    return best;
  }

  getQ(state: State, action: Action) {
    return this.qTable.get(`${state}::${action}`) ?? 0;
  }

  private getMaxQ(state: State) {
    let max = 0;
    for (const [key, value] of this.qTable.entries()) {
      if (key.startsWith(`${state}::`)) max = Math.max(max, value);
    }
    return max;
  }
}
