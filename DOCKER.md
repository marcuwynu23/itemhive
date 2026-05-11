# Docker Setup for ItemHive

This guide explains how to run ItemHive using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Start

### Production Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd itemhive
   ```

2. **Start the application**

   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Application: http://localhost:3000
   - MongoDB Admin: http://localhost:8081 (username: admin, password: admin123)

4. **Seed the database** (optional)
   ```bash
   docker-compose exec app npm run db:seed
   ```

### Development Setup

1. **Start development environment**

   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Access the application**
   - Application: http://localhost:3000 (with hot reloading)
   - MongoDB Admin: http://localhost:8081

## Docker Files Overview

### Core Files

- **`Dockerfile`** - Multi-stage production build
- **`Dockerfile.dev`** - Development build with hot reloading
- **`docker-compose.yml`** - Production environment
- **`docker-compose.dev.yml`** - Development environment
- **`.dockerignore`** - Files excluded from Docker build context

### Support Files

- **`DOCKER.md`** - This documentation file

## Services

### Application Service (`app`)

- **Image**: Built from Dockerfile
- **Port**: 3000
- **Environment**: Production optimized
- **Health Check**: HTTP endpoint monitoring
- **Dependencies**: MongoDB service

### MongoDB Service (`mongodb`)

- **Image**: mongo:7.0
- **Port**: 27017
- **Authentication**: admin/password123 (change in production)
- **Persistence**: Named volume for data
- **Initialization**: Automatic database setup

### MongoDB Admin (`mongo-express`)

- **Image**: mongo-express:1.0.0
- **Port**: 8081
- **Access**: admin/admin123
- **Profile**: Optional service (use `--profile admin`)

## Environment Variables

### Required Variables

```env
DATABASE_URL=mongodb://admin:password123@mongodb:27017/itemhive?authSource=admin
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Optional Variables

```env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000
```

## Commands

### Production Commands

```bash
# Start all services
docker-compose up -d

# Start with MongoDB admin interface
docker-compose --profile admin up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild and start
docker-compose up -d --build
```

### Development Commands

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View development logs
docker-compose -f docker-compose.dev.yml logs -f app-dev

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# Rebuild development image
docker-compose -f docker-compose.dev.yml up -d --build
```

### Database Commands

```bash
# Seed database
docker-compose exec app npm run db:seed

# Access MongoDB shell
docker-compose exec mongodb mongosh -u admin -p password123

# Backup database
docker-compose exec mongodb mongodump --uri="mongodb://admin:password123@localhost:27017/itemhive?authSource=admin" --out=/tmp/backup

# Restore database
docker-compose exec mongodb mongorestore --uri="mongodb://admin:password123@localhost:27017/itemhive?authSource=admin" /tmp/backup/itemhive
```

### Application Commands

```bash
# Execute commands in app container
docker-compose exec app npm run lint
docker-compose exec app npm run build

# Access app container shell
docker-compose exec app sh

# View app logs
docker-compose logs -f app
```

## Volumes

### Production Volumes

- **`mongodb_data`** - MongoDB data persistence
- **`./uploads`** - Application file uploads (if any)

### Development Volumes

- **`mongodb_dev_data`** - Development MongoDB data
- **`.:/app`** - Source code mounting for hot reloading
- **`/app/node_modules`** - Node modules isolation
- **`/app/.next`** - Next.js build cache isolation

## Networks

- **`itemhive-network`** - Production network
- **`itemhive-dev-network`** - Development network

## Health Checks

### Application Health Check

- **Endpoint**: `http://localhost:3000/api/health`
- **Interval**: 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3

### MongoDB Health Check

- **Command**: `mongosh --eval "db.adminCommand('ping')"`
- **Interval**: 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3

## Security Considerations

### Production Security

1. **Change default passwords**

   ```bash
   # Update in docker-compose.yml
   MONGO_INITDB_ROOT_PASSWORD=your-secure-password
   ```

2. **Use environment files**

   ```bash
   # Create .env file
   cp .env.example .env
   # Edit .env with secure values
   ```

3. **Limit network exposure**

   ```yaml
   # Remove port mappings for internal services
   # mongodb:
   #   ports:
   #     - "27017:27017"  # Remove this line
   ```

4. **Use secrets management**
   ```yaml
   # Use Docker secrets or external secret management
   secrets:
     mongodb_password:
       external: true
   ```

### Development Security

- Development setup uses weak passwords for convenience
- Never use development configuration in production
- Regularly update base images for security patches

## Troubleshooting

### Common Issues

1. **Port conflicts**

   ```bash
   # Check if ports are in use
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :27017
   ```

2. **Permission issues**

   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

3. **Database connection issues**

   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb

   # Test connection
   docker-compose exec app npm run db:seed
   ```

4. **Build issues**
   ```bash
   # Clean build
   docker-compose down
   docker system prune -f
   docker-compose up -d --build
   ```

### Logs and Debugging

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs app
docker-compose logs mongodb

# Follow logs in real-time
docker-compose logs -f

# View last 100 lines
docker-compose logs --tail=100
```

## Performance Optimization

### Production Optimizations

1. **Multi-stage builds** - Smaller final image
2. **Non-root user** - Security best practice
3. **Health checks** - Container monitoring
4. **Resource limits** - Prevent resource exhaustion

### Development Optimizations

1. **Volume mounting** - Fast code changes
2. **Hot reloading** - Instant feedback
3. **Separate networks** - Isolation from production

## Monitoring

### Container Monitoring

```bash
# View container stats
docker stats

# View container processes
docker-compose top

# Inspect containers
docker-compose ps
```

### Application Monitoring

- Health check endpoints
- Application logs
- MongoDB metrics via mongo-express

## Backup and Recovery

### Database Backup

```bash
# Create backup
docker-compose exec mongodb mongodump --uri="mongodb://admin:password123@localhost:27017/itemhive?authSource=admin" --out=/tmp/backup

# Copy backup to host
docker cp itemhive-mongodb:/tmp/backup ./backup
```

### Database Recovery

```bash
# Copy backup to container
docker cp ./backup itemhive-mongodb:/tmp/backup

# Restore database
docker-compose exec mongodb mongorestore --uri="mongodb://admin:password123@localhost:27017/itemhive?authSource=admin" /tmp/backup/itemhive
```

## Scaling

### Horizontal Scaling

```yaml
# Scale application instances
docker-compose up -d --scale app=3
```

### Load Balancing

```yaml
# Add nginx load balancer
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
  depends_on:
    - app
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Docker Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and test
        run: |
          docker-compose -f docker-compose.dev.yml up -d
          docker-compose -f docker-compose.dev.yml exec -T app npm test
          docker-compose -f docker-compose.dev.yml down
```

## Support

For Docker-related issues:

1. Check this documentation
2. Review Docker logs
3. Consult Docker documentation
4. Create an issue in the repository

---

**Note**: This Docker setup is designed for both development and production use. Always review and customize the configuration for your specific deployment requirements.
