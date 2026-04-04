# Deploy Pomo Smart Task on Nipa Cloud

This project is ready to deploy on a Nipa Cloud VM with Docker and Docker Compose.

## Recommended Architecture

- 1 Linux VM on Nipa Cloud
- Docker Engine + Docker Compose plugin
- PostgreSQL managed outside the VM, or on another VM
- Nginx reverse proxy with HTTPS
- 2 subdomains:
  - `app.your-domain.com` for Next.js frontend
  - `api.your-domain.com` for Go backend

## Files Added for Production

- `docker-compose.prod.yml`
- `.env.production.example`
- `backend/.env.production.example`

## 1. Prepare the Server

Use Ubuntu 22.04 or 24.04 on Nipa Cloud.

Install Docker:

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
```

Reconnect SSH after running `usermod`.

## 2. Upload Project to the VM

Example:

```bash
git clone <your-repository-url>
cd Pomo-smart-task
```

## 3. Create Production Environment Files

Create root environment file for the frontend build:

```bash
cp .env.production.example .env.production
```

Set:

```env
NEXT_PUBLIC_BACKEND_URL=https://api.your-domain.com/api/v1
NEXT_PUBLIC_ALLOW_INSECURE_BACKEND=false
```

If you deploy temporarily without HTTPS and use a server IP instead of a domain, you can use:

```env
NEXT_PUBLIC_BACKEND_URL=http://<server-ip>:8080/api/v1
NEXT_PUBLIC_ALLOW_INSECURE_BACKEND=true
```

Create backend production environment file:

```bash
cp backend/.env.production.example backend/.env.production
```

Set:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
PORT=8080
JWT_SECRET=<random-secret-at-least-32-characters>
GOOGLE_CLIENT_ID=<google-client-id>
GOOGLE_CLIENT_SECRET=<google-client-secret>
GOOGLE_REDIRECT_URL=https://api.your-domain.com/api/v1/auth/google/callback
FRONTEND=https://app.your-domain.com
APP_ENV=production
CORS_ALLOWED_ORIGINS=https://app.your-domain.com
```

## 4. Start the Application

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

Check status:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml ps
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f
```

At this stage:

- frontend listens on port `3000`
- backend listens on port `8080`

## 5. Put Nginx in Front of the Containers

Install Nginx:

```bash
sudo apt install -y nginx
```

Frontend config:

```nginx
server {
    server_name app.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

Backend config:

```nginx
server {
    server_name api.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

Important:

- `X-Forwarded-Proto https` is required because the backend rejects non-HTTPS traffic when `APP_ENV=production`
- frontend and backend should both be accessed through HTTPS domains, not raw public IPs

## 6. Enable HTTPS

If your Nipa Cloud VM is public-facing, point DNS first:

- `app.your-domain.com` -> VM public IP
- `api.your-domain.com` -> VM public IP

Then install certificates with Let's Encrypt:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d app.your-domain.com -d api.your-domain.com
```

## 7. Google OAuth Configuration

In Google Cloud Console, update:

- Authorized JavaScript origins:
  - `https://app.your-domain.com`
  - `https://api.your-domain.com`
- Authorized redirect URI:
  - `https://api.your-domain.com/api/v1/auth/google/callback`

## 8. Security Notes

- Do not commit `.env.production` or `backend/.env.production`
- Use a new `JWT_SECRET` with at least 32 characters
- Rotate any secret that was previously committed to the repository
- Restrict VM firewall to ports `80` and `443`
- Do not expose `3000` and `8080` directly to the internet once Nginx is working

## 9. Useful Commands

Restart:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

Stop:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml down
```

Logs:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f backend
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f frontend
```

## Notes for This Project

- Frontend needs `NEXT_PUBLIC_BACKEND_URL` at build time, so it is passed as a Docker build arg in `docker-compose.prod.yml`
- Backend production mode requires HTTPS URLs for `FRONTEND` and `GOOGLE_REDIRECT_URL`
- The backend trusts `X-Forwarded-Proto`, so Nginx must pass that header correctly
