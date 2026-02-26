# ---------- Lightweight Base ----------
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy only backend package files first (better layer caching)
COPY backend/package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy backend source code
COPY backend/ .

# Copy frontend into container
COPY frontend/ ./frontend/

# Expose backend port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
