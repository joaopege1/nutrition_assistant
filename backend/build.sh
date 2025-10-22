#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations if needed
# Uncomment the following lines if you want to use Alembic migrations
# python -m alembic upgrade head

