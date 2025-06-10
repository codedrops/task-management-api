import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import express from 'express';
import cookieParser from 'cookie-parser';
import { keycloak, session, memoryStore } from './config/keycloak.js';
import taskRouter from './routes/task.js';
import { securityMiddleware, generateCsrfToken } from './middlewares/security.js'; // Import generateCsrfToken
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve .env path
const envPath = path.resolve(__dirname, '../.env');
console.log('Attempting to load .env from:', envPath);

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.error('Error: .env file not found at:', envPath);
  process.exit(1);
}

// Load .env file
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error('Failed to load .env file:', result.error);
  process.exit(1);
}
console.log('Environment variables loaded:', result.parsed);

// Validate required environment variables
const requiredVars = [
  'REDIS_HOST',
  'REDIS_PORT',
  'KEYCLOAK_URL',
  'KEYCLOAK_REALM',
  'KEYCLOAK_CLIENT_ID',
  'KEYCLOAK_CLIENT_SECRET',
  'SESSION_SECRET',
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'PORT',
];
const missingVars = requiredVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerDocument = YAML.load(path.resolve(__dirname, './config/swagger.yaml'));

app.use(express.json());
app.use(cookieParser()); // Parse cookies first
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: memoryStore, // Redis store
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Match CSRF cookie settings
    sameSite: 'strict',
    httpOnly: true,
  },
}));

app.use(securityMiddleware); // Includes doubleCsrfProtection

// CSRF token endpoint
app.get('/csrf-token', (req, res) => {
  if (!req.sessionID) {
    return res.status(500).json({ error: 'Session not initialized' });
  }
  const csrfToken = generateCsrfToken(req, res);
  res.json({ csrfToken });
});

app.use(keycloak.middleware());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/tasks', taskRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Task Management API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});