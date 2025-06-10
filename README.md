# Task Management API

A secure, production-ready RESTful API for managing tasks, built with Node.js, Express.js, and Keycloak for authentication. This project serves as a learning resource for building modern, scalable back-end applications with industry-standard practices.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Configure Environment Variables](#3-configure-environment-variables)
  - [4. Set Up Keycloak](#4-set-up-keycloak)
  - [5. Set Up PostgreSQL](#5-set-up-postgresql)
  - [6. Run Database Migrations and Seeders](#6-run-database-migrations-and-seeders)
  - [7. Start the Application](#7-start-the-application)
- [API Documentation](#api-documentation)
- [Usage](#usage)
  - [Authentication Flow](#authentication-flow)
  - [CSRF Token](#csrf-token)
  - [Example API Requests](#example-api-requests)
- [Testing](#testing)
- [Deployment](#deployment)
  - [Local Deployment with Docker](#local-deployment-with-docker)
  - [Cloud Deployment (AWS)](#cloud-deployment-aws)
- [Contributing](#contributing)
- [License](#license)

## Project Overview
The Task Management API allows users to create, read, update, and delete tasks, with secure authentication and authorization powered by Keycloak. The API is designed with a layered architecture (controllers, services, models) for maintainability and scalability, incorporating modern security practices like JWT-based authentication, CSRF protection, and input validation. It serves as a hands-on project to learn Node.js back-end development, covering authentication, database management, testing, and deployment.

## Features
- **User Authentication**: JWT-based authentication via Keycloak with role-based authorization (admin, user).
- **Task Management**: CRUD operations for tasks (create, read, update, delete).
- **Security**:
  - CSRF protection with double CSRF tokens.
  - Helmet for secure HTTP headers.
  - Rate limiting to prevent brute-force attacks.
  - Input validation with `express-validator`.
  - Encrypted task notes using `crypto-js`.
- **Database**: PostgreSQL with Sequelize ORM, including migrations and seeders.
- **API Documentation**: Interactive Swagger/OpenAPI documentation.
- **Testing**: Unit and integration tests with Jest and Supertest.
- **Deployment**: Containerized with Docker and deployable to AWS.

## Technologies
- **Runtime**: Node.js v20.x or later
- **Framework**: Express.js
- **Authentication**: Keycloak
- **Database**: PostgreSQL with Sequelize
- **Session Management**: `express-session` with `MemoryStore`
- **Security**: Helmet, `express-rate-limit`, `csrf-csrf`, `crypto-js`
- **Validation**: `express-validator`
- **Documentation**: Swagger/OpenAPI with `swagger-ui-express`
- **Testing**: Jest, Supertest
- **Deployment**: Docker, AWS (optional)
- **Other**: `dotenv`, `yamljs`, `cookie-parser`

## Project Structure
```
task-management-api/
├── src/
│   ├── config/
│   │   ├── database.js       # Sequelize configuration
│   │   ├── keycloak.js       # Keycloak configuration
│   │   └── swagger.yaml      # Swagger API documentation
│   ├── controllers/
│   │   └── task.js           # Task-related business logic
│   ├── middlewares/
│   │   ├── security.js       # Security middleware (Helmet, rate limiting, CSRF)
│   │   └── validation.js     # Input validation middleware
│   ├── models/
│   │   ├── user.js           # User model
│   │   └── task.js           # Task model
│   ├── routes/
│   │   └── task.js           # Task API routes
│   ├── services/
│   │   └── task.js           # Task service layer
│   ├── utils/
│   │   └── encryption.js     # Encryption utilities
│   └── index.js              # Application entry point
├── tests/
│   └── task.test.js          # Unit and integration tests
├── migrations/               # Sequelize migrations
├── seeders/                  # Sequelize seeders
├── .env                      # Environment variables
├── Dockerfile                # Docker configuration
├── docker-compose.yml        # Docker Compose configuration
├── package.json              # Project dependencies and scripts
└── README.md                 # Project documentation
```

## Prerequisites
- **Node.js**: v20.x or later
- **PostgreSQL**: v15 or later
- **Keycloak**: v22 or later (local or hosted)
- **Docker**: For containerized deployment (optional)
- **Git**: For cloning the repository
- **NPM**: For dependency management

## Setup Instructions
Follow these steps to set up the project locally.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/task-management-api.git
cd task-management-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root and add the following configuration:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_management
DB_USER=postgres
DB_PASSWORD=your_secure_password

# Keycloak
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=task-management
KEYCLOAK_CLIENT_ID=task-api
KEYCLOAK_CLIENT_SECRET=your_client_secret

# Session
SESSION_SECRET=your_session_secret

# Server
PORT=3000
```
- Replace `your_secure_password` and `your_client_secret` with secure values.
- Ensure `KEYCLOAK_URL` matches your Keycloak server address.

### 4. Set Up Keycloak
1. **Run Keycloak**:
   - Locally via Docker:
     ```bash
     docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev
     ```
   - Or use a hosted Keycloak instance.
2. **Configure Keycloak**:
   - Access the admin console at `http://localhost:8080`.
   - Create a realm named `task-management`.
   - Create a client named `task-api` with:
     - Client type: Confidential
     - Valid redirect URIs: `*` (for development)
   - Create roles: `admin`, `user`.
   - Obtain the client secret from the client’s credentials tab and update `.env`.
   - Create test users and assign roles.

### 5. Set Up PostgreSQL
1. **Install PostgreSQL**:
   - On macOS: `brew install postgresql`
   - On Ubuntu: `sudo apt-get install postgresql`
   - Or use Docker (included in `docker-compose.yml`).
2. **Create Database**:
   ```bash
   createdb task_management
   ```
3. **Verify Connection**:
   Ensure the `DB_*` variables in `.env` match your PostgreSQL setup.

### 6. Run Database Migrations and Seeders
1. **Initialize Sequelize CLI**:
   ```bash
   npx sequelize-cli init
   ```
   Note: Migrations and seeders are already provided in `migrations/` and `seeders/`.
2. **Run Migrations**:
   ```bash
   npm run migrate
   ```
3. **Run Seeders**:
   ```bash
   npm run seed
   ```

### 7. Start the Application
```bash
npm run dev
```
- The server will start at `http://localhost:3000`.
- Access API documentation at `http://localhost:3000/api-docs`.

## API Documentation
The API is documented using Swagger/OpenAPI. Access the interactive documentation at `http://localhost:3000/api-docs` to explore endpoints, schemas, and authentication details.

Key endpoints:
- `POST /tasks`: Create a task
- `GET /tasks`: Get all tasks
- `GET /tasks/:id`: Get a task by ID
- `PUT /tasks/:id`: Update a task
- `DELETE /tasks/:id`: Delete a task
- `GET /csrf-token`: Retrieve a CSRF token for mutating requests

## Usage
### Authentication Flow
1. **Obtain a JWT Token**:
   - Use Keycloak’s token endpoint:
     ```bash
     curl -X POST http://localhost:8080/realms/task-management/protocol/openid-connect/token \
       -H "Content-Type: application/x-www-form-urlencoded" \
       -d "grant_type=client_credentials&client_id=task-api&client_secret=<your_client_secret>"
     ```
   - Response: `{ "access_token": "<jwt_token>", ... }`
   - For user login, use Keycloak’s login page or authorization code flow.

2. **Use the JWT**:
   - Include the token in the `Authorization` header: `Bearer <jwt_token>`.

### CSRF Token
Mutating endpoints (`POST`, `PUT`, `DELETE`) require a CSRF token:
1. **Fetch CSRF Token**:
   ```bash
   curl -H "Authorization: Bearer <jwt_token>" http://localhost:3000/csrf-token
   ```
   - Response: `{ "csrfToken": "<csrf_token>" }`
2. **Include CSRF Token**:
   - Add `X-CSRF-Token: <csrf_token>` header to mutating requests.

### Example API Requests
**Create a Task**:
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer <jwt_token>" \
  -H "X-CSRF-Token: <csrf_token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","description":"Test Description","status":"pending","notes":"Test Notes"}'
```

**Get All Tasks**:
```bash
curl -H "Authorization: Bearer <jwt_token>" http://localhost:3000/tasks
```

## Testing
Run unit and integration tests with:
```bash
npm test
```
- Tests are located in `tests/task.test.js`.
- Uses Jest and Supertest to verify API functionality.
- Mock Keycloak tokens are used for testing (update as needed).

## Deployment
### Local Deployment with Docker
1. **Ensure Docker is Installed**:
   Install Docker Desktop or Docker CLI.
2. **Run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```
   - Starts the app, PostgreSQL, and Keycloak.
   - Access the app at `http://localhost:3000`.

### Cloud Deployment (AWS)
1. **Push Docker Image to Amazon ECR**:
   - Create an ECR repository.
   - Build and push the image:
     ```bash
     docker build -t task-management-api .
     aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account_id>.dkr.ecr.<region>.amazonaws.com
     docker tag task-management-api:latest <account_id>.dkr.ecr.<region>.amazonaws.com/task-management-api:latest
     docker push <account_id>.dkr.ecr.<region>.amazonaws.com/task-management-api:latest
     ```
2. **Deploy with ECS or EKS**:
   - Create an ECS cluster or EKS cluster.
   - Configure a task definition with the ECR image.
   - Set environment variables (from `.env`) in the task definition.
   - Deploy with a load balancer.
3. **Set Up RDS and ElastiCache**:
   - Use Amazon RDS for PostgreSQL.
   - Use ElastiCache for Redis (if reverting to Redis-based sessions).
4. **Update Keycloak**:
   - Host Keycloak on AWS or use a managed service.
   - Update `KEYCLOAK_URL` in environment variables.

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m "Add your feature"`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.
