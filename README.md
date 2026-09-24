# Zan Compute Work Order Management System

A learning-oriented full-stack work-order application with React, Spring Boot, MySQL, Docker, and Nginx.

## Features
- Work order CRUD
- Priority and status workflow
- Client, building and device MAC fields
- Technician assignment
- Dashboard statistics
- REST API
- Docker Compose deployment
- Nginx reverse proxy

## Local development

### Backend
Requirements: Java 21, Maven, MySQL.

```bash
cd backend
mvn clean package
java -jar target/workorder-1.0.0.jar
```

Backend: http://localhost:8080

### Frontend
Requirements: Node.js/npm.

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## API endpoints

- GET `/api/work-orders`
- GET `/api/work-orders/{id}`
- GET `/api/work-orders/status/{status}`
- GET `/api/work-orders/priority/{priority}`
- POST `/api/work-orders`
- PUT `/api/work-orders/{id}`
- DELETE `/api/work-orders/{id}`
- GET `/api/dashboard`

Example POST:

```json
{
  "title": "Gateway Offline",
  "description": "Gateway stopped reporting",
  "clientName": "Demo Client",
  "buildingName": "Building A",
  "deviceMacId": "AA:BB:CC:DD:EE:FF",
  "priority": "HIGH",
  "status": "OPEN",
  "assignedTo": "Technician 1"
}
```

## Docker deployment

Build frontend first:

```bash
cd frontend
npm install
npm run build
cd ..
```

Build backend:

```bash
cd backend
mvn clean package
cd ..
```

Then:

```bash
docker compose up -d --build
docker compose ps
```

Open:

http://localhost/

## Important
This starter intentionally keeps authentication permissive so you can first understand the complete integration. For a production deployment, add JWT authentication, role-based authorization, secure secrets, HTTPS, database backups, audit history, file storage, and CI/CD.
