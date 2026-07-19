# Deployment Guide — Sharm Cloud Tours

Complete Docker-based deployment guide for running the platform on a VPS with Cloudflare SSL and Resend email.

---

## Table of Contents

1. [Architecture](#architecture)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Step-by-Step Guide](#step-by-step-guide)
5. [Docker Services](#docker-services)
6. [Health Check](#health-check)
7. [SSL with Cloudflare](#ssl-with-cloudflare)
8. [Email with Resend](#email-with-resend)
9. [Backup & Restore](#backup--restore)
10. [Useful Commands](#useful-commands)
11. [Troubleshooting](#troubleshooting)
12. [Resource Limits](#resource-limits)

---

## Architecture

```
Internet
    │
    ▼
┌─────────────────────────────────┐
│  Cloudflare                     │  SSL, CDN, DDoS protection, DNS
│  ┌───────────────────────────┐  │
│  │  Universal SSL (auto)     │  │  User ↔ Cloudflare
│  │  Origin Cert (manual)     │  │  Cloudflare ↔ VPS
│  └───────────────────────────┘  │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Nginx (:80 → :443)             │  Reverse proxy, caching, security headers
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Next.js App (:3000)            │  Node.js 24, standalone build
│  ┌───────────────────────────┐  │
│  │  Health: /api/health      │  │  DB connectivity check
│  └───────────────────────────┘  │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  PostgreSQL (:5432)             │  Persistent volume, daily backups
│  ┌───────────────────────────┐  │
│  │  Data: /var/lib/pg/data   │  │  Backups: /backups/
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

---

## Prerequisites

### Server Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 1 vCPU | 2 vCPU |
| RAM | 2 GB | 4 GB |
| Storage | 25 GB SSD | 40-80 GB SSD |
| OS | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |

### Recommended VPS

| Provider | Plan | Specs | Price |
|----------|------|-------|-------|
| Hetzner | CPX22 | 2 vCPU / 4GB / 80GB | ~$10/mo |
| Hetzner | CPX11 | 1 vCPU / 4GB / 80GB | ~$5/mo |
| DigitalOcean | Basic | 1 vCPU / 4GB / 80GB | $16/mo |

### Required Services

| Service | Provider | Cost |
|---------|----------|------|
| VPS | Hetzner | $10/mo |
| Domain | Cloudflare | ~$10/yr |
| SSL | Cloudflare | Free |
| CDN | Cloudflare | Free |
| DDoS | Cloudflare | Free |
| Email | Resend | Free (100/day) |
| **Total** | — | **~$11/mo** |

### DNS Configuration (Cloudflare)

Before deploying, add ALL these records in Cloudflare Dashboard → DNS → Records:

| Type | Name | Value | Proxy | Purpose |
|------|------|-------|-------|---------|
| A | `@` | `YOUR_VPS_IP` | DNS only (gray) | Domain → VPS |
| CNAME | `www` | `sharmcloudtours.com` | DNS only (gray) | www redirect |
| TXT | `_dmarc` | `v=DMARC1; p=none;` | DNS only | Resend DMARC |
| TXT | `resend._domainkey` | (provided by Resend) | DNS only | Resend DKIM signing |
| CNAME | `send._domainkey` | (provided by Resend) | DNS only | Resend DKIM verification |

> **Note:** Resend DNS records (rows 3-5) are added after you create your Resend account in the [Email with Resend](#email-with-resend) section. You can add them all at once or later — both work.

**Important:** Start with DNS only (gray cloud) for the A record. Enable proxy (orange cloud) after SSL is verified.

### Firewall Rules

```bash
# Open required ports
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
```

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-repo/sharmcloudtours.git
cd sharmcloudtours

# 2. Configure environment
cp .env.production .env.production.bak
nano .env.production   # Edit ALL values

# 3. Build and launch
docker compose up -d --build

# 4. Run database migration
docker compose exec app npx prisma migrate deploy

# 5. Set up initial admin
docker compose exec app sh -c 'ADMIN_EMAIL=admin@sharmcloudtours.com ADMIN_PASSWORD=YourStrongPassword npx tsx scripts/set-admin-password.ts'

# 6. Verify
curl -s http://localhost:3000/api/health | jq
```

**That's it!** The platform is now running at `https://sharmcloudtours.com`

---

## Step-by-Step Guide

### Step 1 — Server Setup

```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
systemctl enable docker

# Install Docker Compose (if not included)
apt install docker-compose-plugin -y

# Configure firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### Step 2 — Clone & Configure

```bash
# Clone repository
git clone https://github.com/your-repo/sharmcloudtours.git
cd sharmcloudtours

# Create production environment
cp .env.example .env.production
nano .env.production
```

**Critical values to change in `.env.production`:**

| Variable | How to Generate |
|----------|-----------------|
| `POSTGRES_PASSWORD` | `openssl rand -hex 16` |
| `NEXTAUTH_SECRET` | `openssl rand -hex 32` |
| `DATABASE_URL` | Update password to match `POSTGRES_PASSWORD` |
| `GOOGLE_CLIENT_ID` | Google Cloud Console → Credentials |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console → Credentials |
| `RESEND_API_KEY` | Resend dashboard → API Keys |
| `EMAIL_FROM` | Must match verified Resend domain |

### Step 3 — Build & Launch

```bash
# Build all containers (takes 3-5 minutes first time)
docker compose up -d --build

# Check status
docker compose ps

# View logs
docker compose logs -f app
```

### Step 4 — Database Migration

```bash
# Run Prisma migrations
docker compose exec app npx prisma migrate deploy

# Verify database is working
docker compose exec app npx prisma db push
```

### Step 5 — Cloudflare SSL Setup

See [SSL with Cloudflare](#ssl-with-cloudflare) section below.

### Step 6 — Initial Admin Setup

```bash
# Create admin user (set your own strong password)
docker compose exec app sh -c 'ADMIN_EMAIL=admin@sharmcloudtours.com ADMIN_PASSWORD=YourStrongPassword npx tsx scripts/set-admin-password.ts'
```

### Step 7 — Verify Deployment

```bash
# Check health endpoint
curl -s http://localhost:3000/api/health | jq

# Check all containers
docker compose ps

# Check logs for errors
docker compose logs --tail=50
```

---

## Docker Services

### Nginx (`sharmcloudtours-nginx`)

| Property | Value |
|----------|-------|
| Port | 80 (HTTP), 443 (HTTPS) |
| Purpose | Reverse proxy, caching |
| Config | `nginx/nginx.conf` |

**Features:**
- HTTP → HTTPS redirect
- Gzip compression
- Static asset caching (365 days for `_next/static`)
- Security headers (HSTS, X-Frame-Options)
- No caching for `/api/*` routes

### Next.js App (`sharmcloudtours-app`)

| Property | Value |
|----------|-------|
| Port | 3000 (internal only) |
| Purpose | Application server |
| Build | Multi-stage (deps → build → production) |
| Health | `/api/health` (30s interval) |
| Memory | Limit: 1GB, Reserve: 256MB |

**Features:**
- Standalone build (minimal image size)
- Non-root user (`nextjs:1001`)
- Auto-restarts on failure
- Health check monitoring

### PostgreSQL (`sharmcloudtours-db`)

| Property | Value |
|----------|-------|
| Port | 5432 (internal only) |
| Purpose | Database |
| Image | postgres:18-alpine |
| Volume | `pgdata` (persistent) |
| Health | `pg_isready` (10s interval) |
| Memory | Limit: 512MB, Reserve: 128MB |

**Features:**
- Persistent data via Docker volume
- Daily automated backups
- Auto-restarts on failure

---

## Health Check

### Endpoint

```
GET /api/health
```

### Response (Success)

```json
{
  "status": "ok",
  "db": "connected",
  "timestamp": "2026-06-10T12:00:00.000Z"
}
```

### Response (Failure)

```json
{
  "status": "error",
  "db": "disconnected",
  "timestamp": "2026-06-10T12:00:00.000Z"
}
```

- Returns `200` when database is reachable
- Returns `503` when database is unreachable
- Docker health check hits this endpoint every 30 seconds
- Container auto-restarts after 3 consecutive failures

---

## SSL with Cloudflare

### Why Cloudflare?

| Feature | Cloudflare | Certbot |
|---------|-----------|---------|
| Setup | Easy (dashboard) | Moderate (SSH) |
| Auto-renewal | ✅ Automatic | ⚠️ Needs cron |
| DDoS protection | ✅ Free | ❌ None |
| CDN | ✅ Free | ❌ None |
| Cost | Free | Free |

### Step 1: Add Domain to Cloudflare

1. Create account at [cloudflare.com](https://cloudflare.com)
2. Add domain `sharmcloudtours.com`
3. Update nameservers at your registrar to Cloudflare's

### Step 2: Configure DNS

In Cloudflare Dashboard → DNS → Records:

```
Type    Name    Content              Proxy
A       @       YOUR_VPS_IP          DNS only (gray cloud)
CNAME   www     sharmcloudtours.com  DNS only (gray cloud)
```

**Start with DNS only (gray cloud).** Enable proxy after SSL is working.

### Step 3: Create Origin Certificate

1. Go to **SSL/TLS → Origin Server**
2. Click **Create Certificate**
3. Settings:
   - Generate private key and CSR with Cloudflare
   - Hostnames: `sharmcloudtours.com`, `*.sharmcloudtours.com`
   - Validity: 15 years (recommended)
   - Key type: RSA 2048
4. Click **Create**
5. Download:
   - Origin Certificate → Save as `nginx/certs/cert.pem`
   - Private Key → Save as `nginx/certs/key.pem`

### Step 4: Upload to VPS

```bash
# On your local machine
scp nginx/certs/cert.pem root@YOUR_VPS_IP:/opt/sharmcloudtours/nginx/certs/
scp nginx/certs/key.pem root@YOUR_VPS_IP:/opt/sharmcloudtours/nginx/certs/

# On VPS
cd /opt/sharmcloudtours
chmod 600 nginx/certs/key.pem
```

### Step 5: Set SSL Mode

In Cloudflare Dashboard → SSL/TLS → Overview:

```
SSL mode: Full (Strict)
```

This ensures:
- User ↔ Cloudflare: Encrypted (Universal SSL)
- Cloudflare ↔ Your VPS: Encrypted (Origin Certificate)

### Step 6: Enable Proxy

Once SSL is working, enable the orange cloud proxy on your A record:

```
Type    Name    Content              Proxy
A       @       YOUR_VPS_IP          Proxied (orange cloud)
CNAME   www     sharmcloudtours.com  Proxied (orange cloud)
```

### Step 7: Enable HTTPS Rewrites

In Cloudflare Dashboard → SSL/TLS → Edge Certificates:

```
Always Use HTTPS: ON
Automatic HTTPS Rewrites: ON
```

### Nginx SSL Config

The `nginx/nginx.conf` is already configured for SSL:

```nginx
server {
    listen 443 ssl http2;
    server_name sharmcloudtours.com www.sharmcloudtours.com;

    ssl_certificate /etc/nginx/certs/cert.pem;
    ssl_certificate_key /etc/nginx/certs/key.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # ... rest of config
}
```

---

## Email with Resend

### Why Resend?

| Feature | Resend | Gmail SMTP |
|---------|--------|-----------|
| Deliverability | Excellent | Poor (spam) |
| Free tier | 100 emails/day | N/A |
| Setup | Easy | Moderate |
| Analytics | Yes | No |

### Step 1: Create Account

1. Go to [resend.com](https://resend.com)
2. Sign up (free tier: 100 emails/day)
3. Create API key in dashboard

### Step 2: Add Domain

1. In Resend dashboard → Domains → Add Domain
2. Enter: `sharmcloudtours.com`
3. Resend will provide DNS records

### Step 3: Configure DNS (Cloudflare)

Add these records to Cloudflare (already listed in [DNS Configuration](#dns-configuration-cloudflare) above):

| Type | Name | Value | Purpose |
|------|------|-------|---------|
| TXT | `_dmarc` | `v=DMARC1; p=none;` | DMARC policy |
| TXT | `resend._domainkey` | (provided by Resend) | DKIM signing |
| CNAME | `send._domainkey` | (provided by Resend) | DKIM verification |

### Step 4: Verify Domain

- Click "Verify" in Resend dashboard
- DNS propagation takes 5-30 minutes
- Status will change to "Verified"

### Step 5: Update Environment

In `.env.production`:

```env
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@sharmcloudtours.com
```

### Step 6: Rebuild

```bash
docker compose up -d --build
```

### Step 7: Test

```bash
# Check logs for email errors
docker compose logs -f app | grep -i email
```

### Email Types Sent

| Email | Trigger |
|-------|---------|
| Verification | User signs up |
| Password Reset | User requests reset |
| Booking Confirmation | Booking created |
| Booking Status Update | Admin confirms/cancels |
| Review Reply | Admin replies to review |
| Admin Notification | New booking received |

---

## Backup & Restore

### Automated Backups

The backup script runs daily and keeps the last 7 days of backups.

**Setup cron job on host:**

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * cd /opt/sharmcloudtours && docker compose exec -T db sh /usr/local/bin/backup-db.sh >> /var/log/sharmcloudtours-backup.log 2>&1
```

### Manual Backup

```bash
# Run backup manually
docker compose exec db sh /usr/local/bin/backup-db.sh

# Or use pg_dump directly
docker compose exec db pg_dump -U sharmcloudtours_user sharmcloudtours_db | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Restore from Backup

```bash
# Stop the app to prevent writes
docker compose stop app

# Restore from backup
gunzip < backup_20260610.sql.gz | docker compose exec -T db psql -U sharmcloudtours_user -d sharmcloudtours_db

# Restart the app
docker compose start app
```

---

## Useful Commands

### Container Management

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# Rebuild and restart
docker compose up -d --build

# View running containers
docker compose ps

# View logs (all services)
docker compose logs -f

# View logs (specific service)
docker compose logs -f app
docker compose logs -f db
docker compose logs -f nginx
```

### Database

```bash
# Run migrations
docker compose exec app npx prisma migrate deploy

# Push schema changes
docker compose exec app npx prisma db push

# Open Prisma Studio (GUI)
docker compose exec app npx prisma studio

# Access PostgreSQL shell
docker compose exec db psql -U sharmcloudtours_user -d sharmcloudtours_db

# Seed tours
docker compose exec app npx tsx scripts/seed-tours.ts
```

### Application

```bash
# Check health
curl -s http://localhost:3000/api/health | jq

# Run cleanup script
docker compose exec app npx tsx scripts/cleanup-unverified.ts

# Create admin user
docker compose exec app sh -c 'ADMIN_EMAIL=admin@sharmcloudtours.com ADMIN_PASSWORD=YourStrongPassword npx tsx scripts/set-admin-password.ts'
```

### Maintenance

```bash
# Update containers (pull latest images)
docker compose pull
docker compose up -d

# Clean up unused images
docker image prune -a

# Check disk usage
docker system df

# Force recreate containers
docker compose up -d --force-recreate

# View resource usage
docker stats
```

---

## Troubleshooting

### Container Won't Start

```bash
# Check logs for errors
docker compose logs app

# Common issues:
# - DATABASE_URL mismatch with POSTGRES_PASSWORD
# - Missing environment variables in .env.production
# - Port 3000/80/443 already in use
```

### Database Connection Failed

```bash
# Verify PostgreSQL is running
docker compose ps db

# Check database logs
docker compose logs db

# Test connection
docker compose exec db pg_isready -U sharmcloudtours_user

# Reset database
docker compose down -v
docker compose up -d db
docker compose exec app npx prisma migrate deploy
```

### SSL Certificate Issues

```bash
# Check if origin cert is uploaded correctly
ls -la nginx/certs/

# Verify Nginx config
docker compose exec nginx nginx -t

# Check certificate files
docker compose exec nginx cat /etc/nginx/certs/cert.pem | head -5

# Restart nginx after cert changes
docker compose restart nginx
```

### App Build Fails

```bash
# Clean build (no cache)
docker compose build --no-cache app

# Check Node.js version
docker compose exec app node --version

# Verify standalone output exists
docker compose exec app ls -la .next/standalone/
```

### Health Check Failing

```bash
# Test health endpoint manually
docker compose exec app wget -qO- http://localhost:3000/api/health

# Check if app is listening
docker compose exec app netstat -tlnp | grep 3000

# Restart app
docker compose restart app
```

### Email Not Sending

```bash
# Check Resend API key is set
docker compose exec app printenv RESEND_API_KEY

# Check logs for email errors
docker compose logs -f app | grep -i email

# Verify domain is verified in Resend dashboard
```

### High Memory Usage

```bash
# Check resource usage
docker stats

# If app exceeds 1GB limit, increase in docker-compose.yml:
# deploy:
#   resources:
#     limits:
#       memory: 2G
```

---

## Resource Limits

### Docker Compose Resource Limits

| Service | CPU Limit | CPU Reserve | Memory Limit | Memory Reserve |
|---------|-----------|-------------|--------------|----------------|
| app | 1.5 cores | 0.5 cores | 1 GB | 256 MB |
| db | 1 core | 0.25 cores | 512 MB | 128 MB |
| nginx | — | — | — | — |

### Adjusting Limits

Edit `docker-compose.yml` to modify resource limits:

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 2G      # Increase for higher traffic
          cpus: "2"
        reservations:
          memory: 512M
          cpus: "1"
```

### Monitoring

```bash
# Real-time resource usage
docker stats

# Check container health
docker inspect --format='{{.State.Health.Status}}' sharmcloudtours-app

# View health check history
docker inspect sharmcloudtours-app | jq '.[0].State.Health.Log'
```

---

## Security Checklist

Before going live, verify:

- [ ] All environment variables in `.env.production` are set (no placeholder values)
- [ ] `POSTGRES_PASSWORD` is a strong, unique password
- [ ] `NEXTAUTH_SECRET` is generated with `openssl rand -hex 32`
- [ ] Google OAuth credentials are configured
- [ ] Cloudflare SSL is active (Full Strict mode)
- [ ] Origin certificate is installed on VPS
- [ ] `RESEND_API_KEY` is set and domain is verified
- [ ] Firewall only allows ports 22, 80, 443
- [ ] Admin user is created with a strong password
- [ ] Health endpoint returns `200` status
- [ ] Backups are running daily
- [ ] `.env.production` is not committed to version control
- [ ] Cloudflare proxy is enabled (orange cloud)
- [ ] HTTPS rewriting is enabled in Cloudflare

---

## File Structure

```
sharmcloudtours/
├── Dockerfile                    # Multi-stage Next.js build
├── docker-compose.yml            # Service orchestration
├── .dockerignore                 # Build exclusion rules
├── .env.production               # Production environment
├── nginx/
│   ├── Dockerfile               # Custom Nginx image
│   └── nginx.conf               # Reverse proxy config
├── scripts/
│   └── backup-db.sh             # PostgreSQL backup script
├── app/
│   └── api/
│       └── health/
│           └── route.ts         # Health check endpoint
└── docs/
    ├── DEPLOYMENT.md            # This file
    └── RESEND-INTEGRATION.md    # Resend email guide
```

---

## Deployment Checklist

| Step | Task | Time |
|------|------|------|
| 1 | Buy domain on Cloudflare | 5 min |
| 2 | Create Hetzner VPS | 5 min |
| 3 | Set DNS in Cloudflare | 5 min |
| 4 | SSH into VPS, install Docker | 10 min |
| 5 | Clone repo, configure .env | 5 min |
| 6 | Upload Cloudflare origin certs | 5 min |
| 7 | `docker compose up -d --build` | 5 min |
| 8 | Run Prisma migrations | 2 min |
| 9 | Create admin user | 2 min |
| 10 | Set up Resend email | 10 min |
| 11 | Enable Cloudflare proxy | 2 min |
| **Total** | — | **~55 min** |

---

## Next Steps

After deployment:

1. **Verify SSL** — Visit `https://sharmcloudtours.com` and check the padlock
2. **Test booking flow** — Create a test booking end-to-end
3. **Test emails** — Sign up for a test account, verify email arrives
4. **Set up monitoring** — Consider UptimeRobot for uptime monitoring
5. **Configure backups** — Set up the cron job for automated backups
6. **Review logs** — Check for any warnings or errors in the first 24 hours

---

_Last updated: June 2026_
