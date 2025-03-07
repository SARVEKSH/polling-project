# Polling System

A high-concurrency polling system built with Node.js, TypeScript, Kafka, and PostgreSQL. The system supports real-time updates via WebSocket and includes a leaderboard feature.

### Configuration Files

1.`docker-compose.yml`

- Defines services: Node.js server, Kafka, Zookeeper, PostgreSQL
- Configures networking, volumes, and health checks
- Sets environment variables and service dependencies

2.`src/config/database.ts`

- PostgreSQL connection pool configuration
- Database table definitions
- Connection parameters and optimization settings

3.`src/config/kafka.ts`

- Kafka client configuration
- Topic definitions
- Connection retry logic

### Core Services

1.`src/services/pollService.ts`

- Poll creation and management
- Poll expiration handling
- Poll retrieval and updates

2.`src/services/voteService.ts`

- Vote processing with race condition prevention
- Transaction management
- Vote validation and counting

3.`src/services/leaderboardService.ts`

- Real-time leaderboard calculations
- Caching implementation
- WebSocket updates

4.`src/services/websocketService.ts`

- WebSocket connection management
- Real-time updates broadcasting
- Connection error handling

## Setup and Deployment

### Prerequisites

- Docker and Docker Compose
- Node.js 18+
- PostgreSQL 14+
- Kafka 2.8+

### Environment Variables

```env
NODE_ENV=production
PORT=3000
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=poleparty
POSTGRES_PASSWORD=poleparty
POSTGRES_DB=poleparty
KAFKA_BROKERS=kafka:29092
KAFKA_CLIENT_ID=polling-app
KAFKA_GROUP_ID=polling-group
```

### Running the Application

1.Development:

```bash
npm install
npm run dev
```

2.Production:

```bash
docker-compose up -d
```

## Architecture Highlights

- **High Concurrency Support**: Optimized database connections and Kafka integration
- **Real-time Updates**: WebSocket implementation for live poll results
- **Data Integrity**: Transaction
