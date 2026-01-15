#!/bin/bash

# Moodily Setup Script
# This script helps you set up the development environment

set -e

echo "🎭 Welcome to Moodily Setup!"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. You have $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm $(npm -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Dependencies installed!"
echo ""

# Set up environment file
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
    echo "✅ .env.local created from .env.example"
    echo ""
    echo "⚠️  IMPORTANT: You need to configure your Supabase credentials!"
    echo ""
    echo "1. Go to https://supabase.com and create a project"
    echo "2. Get your project URL and anon key from Settings → API"
    echo "3. Edit .env.local and add your credentials:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo ""
else
    echo "✅ .env.local already exists"
    echo ""
fi

# Check for Supabase CLI
echo "🔍 Checking for Supabase CLI..."
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI not found. To install it, run:"
    echo "   npm install -g supabase"
    echo ""
else
    echo "✅ Supabase CLI detected"
    echo ""
fi

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure .env.local with your Supabase credentials"
echo "2. Apply database migrations (see supabase/README.md)"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Open http://localhost:3000"
echo ""
echo "For detailed instructions, see README.md"
echo ""
