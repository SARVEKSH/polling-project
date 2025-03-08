import { createTables } from './src/config/database';
import { App } from './src/app';

/**
 * Initializes and starts the application
 * 1. Creates database tables
 * 2. Initializes the Express application
 * 3. Starts the server on the specified port
 * @throws {Error} If initialization fails
 */
async function bootstrap() {
  try {
    // Create and initialize tables
    await createTables();
    console.log('Database tables initialized');
    // Initialize the application
    const app = new App();
    const port = parseInt(process.env.PORT || '3000', 10);
    // Start the application
    await app.start(port);
    console.log(`Server is running at http://localhost:${port}`);
  } catch (error) {
    console.error('Failed to start application:', error);
    // Ensure we exit with a non-zero code on startup failure
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

bootstrap();

export class PollController {
    public getPolls(req, res) {
        // Logic to retrieve polls
    }

    public createPoll(req, res) {
        // Logic to create a new poll
    }
}