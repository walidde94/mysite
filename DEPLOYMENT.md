# 🚀 Deployment Guide

This guide covers deployment options for the EcoStep application.

## Table of Contents

1. [Environment Setup](#environment-setup)
2. [Docker Deployment](#docker-deployment)
3. [Cloud Deployment](#cloud-deployment)
4. [Mobile App Deployment](#mobile-app-deployment)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Monitoring & Maintenance](#monitoring--maintenance)

## Environment Setup

### Required Environment Variables

#### Backend (.env)
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-mongo-url/ecostep
JWT_SECRET=your-super-secret-jwt-key
AI_SERVICE_URL=http://ai-service:8000
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
OPENWEATHER_API_KEY=your-key
MAPBOX_API_KEY=your-key
FRONTEND_URL=https://yourdomain.com
```

#### AI Service (.env)
```bash
PORT=8000
HOST=0.0.0.0
DEBUG=False
```

#### Frontend (.env)
```bash
VITE_API_URL=https://api.yourdomain.com/api/v1
```

## Docker Deployment

### 1. Build Images

```bash
# Build all services
docker-compose build

# Or build individually
docker build -t ecostep-backend ./backend
docker build -t ecostep-ai-service ./ai-service
docker build -t ecostep-frontend ./frontend
```

### 2. Run with Docker Compose

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Production Configuration

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  backend:
    image: ecostep-backend:latest
    restart: always
    environment:
      NODE_ENV: production
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1'
          memory: 512M
```

Run:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Cloud Deployment

### AWS Deployment

#### 1. Using AWS ECS (Elastic Container Service)

**Prerequisites:**
- AWS CLI installed
- Docker images pushed to ECR

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ECR_URL

# Tag images
docker tag ecostep-backend:latest YOUR_ECR_URL/ecostep-backend:latest

# Push to ECR
docker push YOUR_ECR_URL/ecostep-backend:latest
```

**ECS Task Definition:**
```json
{
  "family": "ecostep-backend",
  "taskRoleArn": "arn:aws:iam::ACCOUNT_ID:role/ecsTaskRole",
  "executionRoleArn": "arn:aws:iam::ACCOUNT_ID:role/ecsTaskExecutionRole",
  "networkMode": "awsvpc",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "YOUR_ECR_URL/ecostep-backend:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "MONGODB_URI",
          "valueFrom": "arn:aws:secretsmanager:region:account-id:secret:mongodb-uri"
        }
      ]
    }
  ],
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512"
}
```

#### 2. Using AWS Elastic Beanstalk

```bash
# Initialize EB
eb init -p node.js ecostep-backend

# Create environment
eb create ecostep-prod

# Deploy
eb deploy
```

#### 3. MongoDB Atlas Setup

1. Create cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Whitelist your application IPs
3. Create database user
4. Get connection string
5. Update `MONGODB_URI` in environment

### Google Cloud Platform (GCP)

#### Using Cloud Run

```bash
# Build and push to GCR
gcloud builds submit --tag gcr.io/PROJECT_ID/ecostep-backend

# Deploy to Cloud Run
gcloud run deploy ecostep-backend \
  --image gcr.io/PROJECT_ID/ecostep-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Heroku Deployment

```bash
# Login to Heroku
heroku login

# Create app
heroku create ecostep-backend

# Add MongoDB
heroku addons:create mongolab

# Set environment variables
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

### DigitalOcean

#### Using App Platform

1. Connect GitHub repository
2. Select branch and build settings
3. Add environment variables
4. Deploy

#### Using Droplets

```bash
# SSH into droplet
ssh root@your-droplet-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Clone repository
git clone https://github.com/yourusername/ecostep.git
cd ecostep

# Run with Docker Compose
docker-compose up -d
```

## Mobile App Deployment

### iOS (App Store)

1. **Prepare for Release**
```bash
cd mobile/ios
pod install
```

2. **Configure App Store Connect**
- Create app in App Store Connect
- Set up App ID and certificates
- Configure provisioning profiles

3. **Build for Release**
- Open `ios/EcoStepMobile.xcworkspace` in Xcode
- Select "Any iOS Device"
- Product → Archive
- Validate and upload to App Store Connect

4. **Submit for Review**
- Add screenshots and descriptions
- Complete App Store metadata
- Submit for review

### Android (Google Play)

1. **Generate Signing Key**
```bash
cd mobile/android/app
keytool -genkeypair -v -storetype PKCS12 -keystore ecostep-release.keystore -alias ecostep-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. **Configure Gradle**

Edit `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            storeFile file('ecostep-release.keystore')
            storePassword 'your-password'
            keyAlias 'ecostep-key-alias'
            keyPassword 'your-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

3. **Build Release APK**
```bash
cd android
./gradlew assembleRelease
```

4. **Upload to Google Play Console**
- Create app in Google Play Console
- Upload APK/AAB
- Complete store listing
- Submit for review

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy EcoStep

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run backend tests
        run: |
          cd backend
          npm install
          npm test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to AWS ECS
        uses: aws-actions/amazon-ecs-deploy-task-definition@v1
        with:
          task-definition: task-definition.json
          service: ecostep-backend
          cluster: ecostep-cluster

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and deploy
        run: |
          cd frontend
          npm install
          npm run build
          
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        with:
          args: deploy --prod
```

### GitLab CI/CD

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

test-backend:
  stage: test
  script:
    - cd backend
    - npm install
    - npm test

build-docker:
  stage: build
  script:
    - docker build -t ecostep-backend ./backend
    - docker push registry.gitlab.com/username/ecostep-backend

deploy-production:
  stage: deploy
  script:
    - kubectl apply -f k8s/
  only:
    - main
```

## Monitoring & Maintenance

### Health Checks

All services include health check endpoints:
- Backend: `GET /health`
- AI Service: `GET /health`
- Frontend: `GET /`

### Monitoring Tools

#### 1. Application Monitoring (APM)
```bash
# Install New Relic
npm install newrelic

# Or Datadog
npm install dd-trace
```

#### 2. Log Management
- **AWS CloudWatch**
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Sentry** for error tracking

#### 3. Uptime Monitoring
- UptimeRobot
- Pingdom
- AWS CloudWatch Alarms

### Backup Strategy

#### MongoDB Backups
```bash
# Automated daily backups
mongodump --uri="mongodb://user:pass@host/ecostep" --out=/backups/$(date +%Y%m%d)

# Restore from backup
mongorestore --uri="mongodb://user:pass@host/ecostep" /backups/20250105
```

#### S3 Backups (AWS)
```bash
aws s3 sync /backups s3://ecostep-backups
```

### Scaling

#### Horizontal Scaling
```bash
# Scale backend replicas
docker-compose up --scale backend=3

# Or with Kubernetes
kubectl scale deployment ecostep-backend --replicas=5
```

#### Database Scaling
- Enable MongoDB replica sets
- Use MongoDB sharding for large datasets
- Implement read replicas

### Security Checklist

- ✅ Use HTTPS/TLS certificates (Let's Encrypt)
- ✅ Enable rate limiting
- ✅ Regular security updates
- ✅ Database backups
- ✅ Environment secrets in secret manager
- ✅ Enable CORS properly
- ✅ Implement CSP headers
- ✅ Use helmet.js
- ✅ SQL/NoSQL injection protection
- ✅ XSS protection

### Performance Optimization

1. **Enable Caching**
```javascript
// Redis caching
const redis = require('redis');
const client = redis.createClient();
```

2. **CDN for Static Assets**
- CloudFront (AWS)
- Cloudflare
- Fastly

3. **Database Indexing**
```javascript
// Add indexes in MongoDB
userSchema.index({ email: 1 });
challengeSchema.index({ category: 1, isActive: 1 });
```

4. **Load Balancing**
- AWS ELB
- Nginx
- HAProxy

## Support

For deployment issues:
- 📧 Email: devops@ecostep.app
- 📖 Docs: [docs.ecostep.app/deployment](https://docs.ecostep.app/deployment)
- 💬 Discord: [Join our community](https://discord.gg/ecostep)

---

**Last Updated**: January 2025
