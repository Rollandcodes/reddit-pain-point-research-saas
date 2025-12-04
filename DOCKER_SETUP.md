# Docker Setup Guide - PainPointRadar

Complete guide to building, running, and managing Docker containers for local development and production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Architecture](#architecture)
4. [Configuration](#configuration)
5. [Building Containers](#building-containers)
6. [Running Containers](#running-containers)
7. [Development Workflow](#development-workflow)
8. [Troubleshooting](#troubleshooting)
9. [Production Deployment](#production-deployment)

---

## Prerequisites

### Required
- **Docker** (v20.10+): https://www.docker.com/products/docker-desktop
- **Docker Compose** (v1.29+): Included with Docker Desktop
- **Git**: For cloning the repository

### Verify Installation

```bash
docker --version
# Docker version 20.10+

docker-compose --version
# Docker Compose version 1.29+
```

---

## Quick Start

### 1. Clone and Navigate

```bash
git clone https://github.com/Rollandcodes/reddit-pain-point-research-saas.git
cd reddit-pain-point-research-saas
```

### 2. Create Environment File

Copy `.env.example` to `.env.local` (root and app folder):

```bash
cp .env.example .env.local
cp app/.env.example app/.env.local
```

Edit `.env.local` with your credentials:
```env
# Database
DB_USER=painpointradar
DB_PASSWORD=dev_password
DB_NAME=painpointradar_dev

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret

# Resend Email
RESEND_API_KEY=your_resend_key
EMAIL_FROM_ADDRESS="PainPointRadar <noreply@painpointradar.com>"
```

### 3. Start All Services

```bash
docker-compose up -d
```

**Output:**
```
Creating painpointradar-postgres ... done
Creating painpointradar-redis    ... done
Creating painpointradar-backend  ... done
Creating painpointradar-frontend ... done
Creating painpointradar-pgadmin  ... done
```

### 4. Access Services

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Next.js app |
| Backend API | http://localhost:8000 | FastAPI/uvicorn |
| PgAdmin | http://localhost:5050 | Database management |
| Redis | localhost:6379 | Cache & job queue |
| PostgreSQL | localhost:5432 | Database |

### 5. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f postgres
```

### 6. Stop Services

```bash
docker-compose down

# Also remove volumes (WARNING: deletes data)
docker-compose down -v
```

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│         Docker Compose Network                      │
│         (painpointradar-network)                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐    ┌──────────────┐              │
│  │  Frontend    │    │  Backend     │              │
│  │  (Next.js)   │    │  (FastAPI)   │              │
│  │  :3000       │    │  :8000       │              │
│  └───────┬──────┘    └──────┬───────┘              │
│          │                  │                      │
│  ┌───────────────────────────────────────┐         │
│  │   Data Layer                          │         │
│  ├─────────────────────────────────────┤         │
│  │  PostgreSQL  │  Redis        │ PgAdmin │       │
│  │  :5432       │  :6379        │ :5050   │       │
│  │  (Data)      │  (Cache/Q)    │ (UI)    │       │
│  └───────────────────────────────────────┘         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Services

- **Frontend (Next.js)**: React app with Server-Side Rendering
- **Backend (FastAPI)**: Python REST API with uvicorn
- **PostgreSQL**: Relational database (Prisma ORM)
- **Redis**: In-memory cache and job queue (BullMQ)
- **PgAdmin**: Web UI for PostgreSQL management (optional)

---

## Configuration

### Environment Variables

Create `.env.local` in the root directory. Docker-compose will load it automatically.

```bash
# Database
DB_USER=painpointradar
DB_PASSWORD=dev_password
DB_NAME=painpointradar_dev
DB_PORT=5432

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Stripe Payment
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Resend Email
RESEND_API_KEY=re_xxx
EMAIL_FROM_ADDRESS="Your Brand <noreply@yourdomain.com>"

# Backend
BACKEND_PORT=8000
NODE_ENV=development

# Frontend
FRONTEND_PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: PgAdmin
PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=admin
PGADMIN_PORT=5050

# Redis (optional password)
REDIS_PORT=6379
REDIS_PASSWORD=
```

### Volume Mounts

The `docker-compose.yml` includes live-reload volumes:

```yaml
# Frontend: Changes to /app update in real-time
volumes:
  - ./app:/app
  - /app/node_modules

# Backend: Changes to Python files reload uvicorn
volumes:
  - .:/app
  - /app/__pycache__
```

---

## Building Containers

### Build All Images

```bash
docker-compose build
```

### Build Specific Service

```bash
docker-compose build backend
docker-compose build frontend
```

### Build with No Cache

```bash
docker-compose build --no-cache
```

### Build and Push to Registry (Production)

```bash
# Tag images
docker tag painpointradar-backend:latest myregistry/backend:latest
docker tag painpointradar-frontend:latest myregistry/frontend:latest

# Push
docker push myregistry/backend:latest
docker push myregistry/frontend:latest
```

---

## Running Containers

### Start All Services (Detached)

```bash
docker-compose up -d
```

### Start All Services (Foreground, See Logs)

```bash
docker-compose up
```

### Start Specific Service

```bash
docker-compose up -d frontend
docker-compose up -d backend
docker-compose up -d postgres
```

### Scale Services (if applicable)

```bash
docker-compose up -d --scale backend=3
```

### Stop Services

```bash
# Stop without removing
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove everything including volumes
docker-compose down -v
```

### Restart Services

```bash
docker-compose restart

# Restart specific service
docker-compose restart backend
```

---

## Development Workflow

### 1. Run Initial Setup

```bash
# Start containers
docker-compose up -d

# Wait for postgres to be healthy
docker-compose ps

# Run database migrations (if needed)
docker-compose exec backend python -m alembic upgrade head

# Or with Next.js Prisma:
docker-compose exec frontend npm run db:push
```

### 2. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/docs (Swagger UI)
- **Database UI**: http://localhost:5050 (PgAdmin)

### 3. Make Code Changes

Edit files in your local editor. Changes automatically reload:
- **Frontend**: Hot reload via Next.js dev server
- **Backend**: Uvicorn reload on Python file changes

### 4. View Real-Time Logs

```bash
# Watch all logs
docker-compose logs -f

# Watch specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Follow logs for multiple services
docker-compose logs -f frontend backend postgres
```

### 5. Execute Commands Inside Container

```bash
# Backend: Run Python commands
docker-compose exec backend python -m pytest

# Backend: Run scripts
docker-compose exec backend python scripts/seed.py

# Frontend: Run npm commands
docker-compose exec frontend npm install
docker-compose exec frontend npm run build

# Frontend: Start worker
docker-compose exec frontend npm run worker
```

### 6. Access Database

#### Via PgAdmin (Web UI)
- Go to http://localhost:5050
- Login with PGADMIN_EMAIL / PGADMIN_PASSWORD
- Add server: Host = `postgres`, Port = `5432`

#### Via psql (CLI)
```bash
docker-compose exec postgres psql -U painpointradar -d painpointradar_dev
```

#### Via Docker exec
```bash
docker-compose exec postgres psql -U ${DB_USER} -d ${DB_NAME}
```

### 7. Manage Redis Cache

```bash
# Connect to Redis CLI
docker-compose exec redis redis-cli

# Common Redis commands:
# KEYS *              - List all keys
# FLUSHDB             - Clear current database
# FLUSHALL            - Clear all databases
# MONITOR             - Watch Redis operations in real-time
```

---

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs backend

# Common issues:
# - Port already in use: Change port in .env.local
# - Database connection: Wait for postgres healthcheck
# - Memory: Increase Docker memory allocation
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3000      # Frontend
lsof -i :8000      # Backend
lsof -i :5432      # PostgreSQL

# Kill process
kill -9 <PID>

# Or change port in .env.local
FRONTEND_PORT=3001
BACKEND_PORT=8001
DB_PORT=5433
```

### Database Connection Errors

```bash
# Check if postgres is healthy
docker-compose ps

# Manually test connection
docker-compose exec postgres psql -U painpointradar -d painpointradar_dev -c "SELECT 1"

# Reset database
docker-compose down -v
docker-compose up -d postgres
# Wait 10 seconds, then start other services
```

### Frontend Build Errors

```bash
# Clear Next.js cache
docker-compose exec frontend rm -rf .next

# Reinstall dependencies
docker-compose exec frontend rm -rf node_modules package-lock.json
docker-compose exec frontend npm install

# Rebuild
docker-compose exec frontend npm run build
```

### Backend Import Errors

```bash
# Reinstall Python dependencies
docker-compose exec backend pip install -r requirements.txt

# Update packages
docker-compose exec backend pip install --upgrade -r requirements.txt
```

### Out of Disk Space

```bash
# Remove unused images/containers/volumes
docker system prune -a

# Prune only volumes (WARNING: deletes data)
docker volume prune
```

### Memory/Performance Issues

```bash
# Check Docker resource usage
docker stats

# Increase Docker memory limit:
# Docker Desktop → Settings → Resources → Memory (increase value)
# Default: 2GB - Recommended: 4GB+ for this stack
```

---

## Production Deployment

### Docker Compose for Production

For production, create a `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    image: myregistry/backend:1.0.0
    environment:
      NODE_ENV: production
      PORT: 8000
    restart: always
    networks:
      - painpointradar-network

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    image: myregistry/frontend:1.0.0
    environment:
      NODE_ENV: production
      PORT: 3000
    restart: always
    networks:
      - painpointradar-network

  postgres:
    image: postgres:16-alpine
    restart: always
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - painpointradar-network

  redis:
    image: redis:7-alpine
    restart: always
    volumes:
      - redis_data:/data
    networks:
      - painpointradar-network

volumes:
  postgres_data:
  redis_data:

networks:
  painpointradar-network:
```

### Deploy to Cloud

#### Render.com
```bash
# Push to GitHub
git push origin main

# Connect Render to GitHub repo
# Create Web Service → Select repo
# Build Command: docker-compose build
# Start Command: docker-compose up
```

#### AWS ECS
```bash
# Create ECR repository
aws ecr create-repository --repository-name painpointradar

# Push images
docker tag painpointradar-backend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/painpointradar:backend
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/painpointradar:backend
```

#### DigitalOcean App Platform
```bash
# Create app.yaml
# Push Docker Compose to DigitalOcean
doctl apps create --spec app.yaml
```

---

## Useful Commands Reference

```bash
# View running containers
docker-compose ps

# View all containers (including stopped)
docker-compose ps -a

# View detailed container info
docker-compose logs <service>

# Execute command in container
docker-compose exec <service> <command>

# Build specific service
docker-compose build <service>

# Restart service
docker-compose restart <service>

# Remove and recreate container
docker-compose up -d --force-recreate <service>

# View resource usage
docker stats

# Inspect network
docker network inspect painpointradar-network

# View volumes
docker volume ls

# Clean up everything
docker system prune -a --volumes
```

---

## Security Notes

### Development vs. Production

| Item | Dev | Prod |
|------|-----|------|
| Database Password | `dev_password` | Strong, random |
| Environment Variables | Committed (`.env.example`) | Secrets manager |
| Image Build | With debugging tools | Optimized, lean |
| Restart Policy | No | `always` |
| Resource Limits | None | CPU/Memory limits |

### Best Practices

1. **Never commit `.env.local`** — Use `.env.example` for templates
2. **Use secrets manager** — For production (AWS Secrets, Render secrets, etc.)
3. **Scan images** — `docker scan myimage:latest`
4. **Run as non-root** — Both Dockerfiles use unprivileged users
5. **Keep images small** — Multi-stage builds reduce final size
6. **Use health checks** — All services include HEALTHCHECK

---

## Support

- Docker Docs: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- Common Issues: See Troubleshooting section above

For issues with the application, check the respective documentation:
- Backend: See `backend/README.md`
- Frontend: See `app/README.md`
- Email: See `app/EMAIL_SETUP.md`
