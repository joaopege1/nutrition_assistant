#!/usr/bin/env bash
# Frontend build script for Render

set -o errexit

# Install dependencies
npm install

# Create .env file with API URL from environment
echo "VITE_API_URL=${VITE_API_URL}" > .env.production

# Build the application
npm run build

echo "Frontend build completed successfully"

