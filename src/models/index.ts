import { Router, Request, Response } from 'express';
import { KafkaService, WebSocketService } from '../services';
import { asyncHandler } from '../utils/errorHandler';

export class Poll {
    constructor(public id: string, public question: string, public options: string[], public votes: number[]) {}

    validate(): boolean {
        if (!this.question || this.options.length === 0) {
            return false;
        }
        return true;
    }

    addVote(optionIndex: number): void {
        if (optionIndex >= 0 && optionIndex < this.votes.length) {
            this.votes[optionIndex]++;
        }
    }

    getResults(): { option: string; votes: number }[] {
        return this.options.map((option, index) => ({
            option,
            votes: this.votes[index],
        }));
    }
}

/**
 * Creates and configures the leaderboard router
 * @param kafkaService - Service for handling Kafka messaging operations
 * @param wss - Service for managing WebSocket connections
 * @returns Express Router configured with leaderboard endpoints
 */
export const leaderboardRouter = (kafkaService: KafkaService, wss: WebSocketService): Router => {
  const router = Router();

  // Health check endpoint
  router.get('/health', (_, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  /**
   * GET /leaderboard
   * Retrieves current leaderboard data and broadcasts updates via WebSocket
   * @route GET /
   * @returns {Promise<Object>} Leaderboard data including poll options and vote counts
   */
  router.get('/', asyncHandler(async (_: Request, res: Response) => {
    const result = await kafkaService.leaderboardConsumerActivity(wss);
    res.json(result);
  }));

  return router;
};