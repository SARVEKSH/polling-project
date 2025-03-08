import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { KafkaService, WebSocketService } from './services';
import { pollRouter } from './routes/polls';
import { leaderboardRouter } from './routes/leaderboard';
import { errorHandler, DatabaseError, KafkaError } from './utils/errorHandler';
import { pool } from './config/database';

/**
 * Main application class that initializes and configures the Express server,
 * WebSocket connections, Kafka services, and database connections.
 */
export class App {
  public app: express.Application;
  public server: ReturnType<typeof createServer>;
  private kafkaService: KafkaService;
  private websocketService: WebSocketService;

  /**
   * Initializes the application by setting up Express, HTTP server,
   * Kafka service, and WebSocket service.
   */
  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.kafkaService = new KafkaService();
    this.websocketService = new WebSocketService(this.server);

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeWebSocket();
    this.initializeErrorHandling();
  }

  /**
   * Sets up Express middleware for CORS, JSON parsing, URL encoding,
   * and request logging.
   */
  private initializeMiddlewares(): void {
    this.app.use(cors({ origin: '*' }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use((req, _res, next) => {
      console.log(`${req.method} ${req.url}`);
      next();
    });
  }

  /**
   * Configures API routes including health check endpoint,
   * poll routes, and leaderboard routes.
   */
  private initializeRoutes(): void {
    // Add health check endpoint
    this.app.get('/health', (_, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Register routes
    this.app.use('/polls', pollRouter(this.kafkaService));
    this.app.use('/leaderboard', leaderboardRouter(this.kafkaService, this.websocketService));
  }

  /**
   * Initializes WebSocket connections and sets up event handlers for
   * client connections, disconnections, errors, and messages.
   */
  private initializeWebSocket(): void {
    this.websocketService.initialize();
  }

  /**
   * Sets up global error handling middleware.
   */
  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  /**
   * Starts the Express server on the specified port.
   * @param port - Port number to start the server on
   */
  public async start(port: number): Promise<void> {
    this.server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}