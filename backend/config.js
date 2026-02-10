require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT || '3001', 10),
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  zmqMatchingEndpoint: process.env.ZMQ_MATCHING_ENDPOINT || 'tcp://localhost:5555',
  databasePath: process.env.DATABASE_PATH || './data/app.json',
  matchingServiceUrl: process.env.MATCHING_SERVICE_URL || 'http://localhost:5000',
};
