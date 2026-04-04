# Deploy on Nipa Cloud

This guide shows a simple way to run this project on a Nipa Cloud VM with Docker.

## 0. Set up the VM

Create a VM with Ubuntu, then connect with SSH.

Install basic tools:

```bash
sudo apt update
sudo apt install -y git ca-certificates curl gnupg
```

Install Docker and Docker Compose:

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Check that Docker is ready:

```bash
docker --version
docker compose version
```

## What you need

- 1 Ubuntu VM
- Docker and Docker Compose
- Git
- A PostgreSQL database

## 1. Clone the project

```bash
git clone <your-repository-url>
cd Pomo-smart-task
```

## 2. Create environment files

Create the frontend environment file:

```bash
cp .env.production.example .env.production
```

Edit `.env.production`

```env
NEXT_PUBLIC_BACKEND_URL=http://<your-server-ip>:8080/api/v1
NEXT_PUBLIC_ALLOW_INSECURE_BACKEND=true
```

Create the backend environment file:

```bash
cp backend/.env.production.example backend/.env.production
```

Edit `backend/.env.production`

```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
PORT=8080
JWT_SECRET=your-secret-key-with-at-least-32-characters
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URL=http://<your-server-ip>:8080/api/v1/auth/google/callback
FRONTEND=http://<your-server-ip>:3000
APP_ENV=local
CORS_ALLOWED_ORIGINS=http://<your-server-ip>:3000
```

## 3. Start the project

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

## 4. Check that it is running

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml ps
```

View logs:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f
```

## 5. Open the app

- Frontend: `http://<your-server-ip>:3000`
- Backend: `http://<your-server-ip>:8080`

## Notes

- This setup is for practice or testing.
- It uses server IP and HTTP first, so it is easy to start.
- For real production use, add Nginx, a domain, and HTTPS later.
- Do not commit `.env.production` or `backend/.env.production`

## Optional: Set up Nginx

You can add Nginx later if you want to use a domain name.

Install Nginx:

```bash
sudo apt update
sudo apt install -y nginx
```

Example frontend config:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Example backend config:

```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

After that, reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

If you want HTTPS, add a domain first and install SSL later.
