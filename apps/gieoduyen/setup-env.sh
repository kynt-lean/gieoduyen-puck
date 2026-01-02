#!/bin/bash

# Script to setup .env.local from .env.example
# This script is safe to run multiple times

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_EXAMPLE="$SCRIPT_DIR/.env.example"
ENV_LOCAL="$SCRIPT_DIR/.env.local"

if [ ! -f "$ENV_EXAMPLE" ]; then
    echo "Error: .env.example not found at $ENV_EXAMPLE"
    exit 1
fi

if [ -f "$ENV_LOCAL" ]; then
    echo ".env.local already exists. Skipping..."
    exit 0
fi

cp "$ENV_EXAMPLE" "$ENV_LOCAL"
echo "✓ Created .env.local from .env.example"
echo "  You can edit .env.local to customize your configuration"

