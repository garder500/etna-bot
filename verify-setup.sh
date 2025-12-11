#!/usr/bin/env bash
# Quick setup verification script

# Add Bun to PATH if it exists
export PATH="$HOME/.bun/bin:$PATH"

echo "🔍 Verifying etna-bot setup..."
echo ""

# Check if Bun is installed
if command -v bun &> /dev/null; then
    echo "✅ Bun is installed: $(bun --version)"
else
    echo "❌ Bun is not installed. Please install it from https://bun.sh"
    exit 1
fi

# Check if dependencies are installed
if [ -d "node_modules" ]; then
    echo "✅ Dependencies are installed"
else
    echo "❌ Dependencies not found. Run: bun install (or npm install)"
    exit 1
fi

# Check if .env file exists
if [ -f ".env" ]; then
    echo "✅ .env file exists"
else
    echo "⚠️  .env file not found. Copy .env.example to .env and configure your bot token"
fi

# Check TypeScript
echo "🔍 Checking TypeScript code..."
if bunx tsc --noEmit; then
    echo "✅ TypeScript code is valid"
else
    echo "❌ TypeScript errors found"
    exit 1
fi

# Check Prisma schema
echo "🔍 Validating Prisma schema..."
if DATABASE_URL="file:./dev.db" bunx prisma validate; then
    echo "✅ Prisma schema is valid"
else
    echo "❌ Prisma schema validation failed"
    exit 1
fi

# Check if database exists
if [ -f "./dev.db" ]; then
    echo "✅ Database file exists"
else
    echo "⚠️  Database not initialized. Run: bun run db:migrate"
fi

echo ""
echo "✨ Setup verification complete!"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env and add your Discord bot token"
echo "2. Run: bun run dev"
