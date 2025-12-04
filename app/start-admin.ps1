# Environment setup script for PainPointRadar admin dashboard
# This script sets up all necessary environment variables and can start the dev server

param(
    [switch]$Dev,
    [switch]$Seed,
    [switch]$Migrate,
    [switch]$ResetDb
)

$appPath = "d:\PainPontRadar\reddit-pain-point-research-saas\app"
$envLocalPath = "$appPath\.env.local"

# Define the database connection strings
$neonDbUrl = "postgresql://neondb_owner:npg_GFJyASEUb0r5@ep-square-dawn-ae1gx64p-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

Write-Host "🔧 PainPointRadar Environment Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Check if .env.local exists
if (-not (Test-Path $envLocalPath)) {
    Write-Host "❌ .env.local not found at $envLocalPath" -ForegroundColor Red
    exit 1
}

# Load existing .env.local content
$envContent = Get-Content $envLocalPath -Raw

# Update or add DATABASE_URL
if ($envContent -match 'DATABASE_URL=') {
    $envContent = $envContent -replace 'DATABASE_URL=.*', "DATABASE_URL=`"$neonDbUrl`""
} else {
    $envContent = $envContent + "`nDATABASE_URL=`"$neonDbUrl`""
}

# Write back to .env.local
Set-Content -Path $envLocalPath -Value $envContent
Write-Host "✅ DATABASE_URL configured" -ForegroundColor Green

# Set environment variable for current session
$env:DATABASE_URL = $neonDbUrl
Write-Host "✅ Environment variable set for this session" -ForegroundColor Green

# Handle migrations
if ($Migrate) {
    Write-Host "`n📦 Running Prisma migrations..." -ForegroundColor Cyan
    cd $appPath
    npx prisma db push --skip-generate
    Write-Host "✅ Migrations completed" -ForegroundColor Green
}

# Handle database reset
if ($ResetDb) {
    Write-Host "`n⚠️  Resetting database..." -ForegroundColor Yellow
    cd $appPath
    npx prisma db push --force-reset --skip-generate
    Write-Host "✅ Database reset completed" -ForegroundColor Green
}

# Handle seeding
if ($Seed) {
    Write-Host "`n🌱 Seeding database with test data..." -ForegroundColor Cyan
    cd $appPath
    npx tsx prisma/seed.ts
    Write-Host "✅ Database seeding completed" -ForegroundColor Green
}

# Handle dev server
if ($Dev) {
    Write-Host "`n🚀 Starting development server..." -ForegroundColor Cyan
    Write-Host "📍 Admin dashboard: http://localhost:3000/admin" -ForegroundColor Green
    Write-Host "   (or http://localhost:3001/admin if port 3000 is in use)" -ForegroundColor Green
    Write-Host "" -ForegroundColor Green
    
    cd $appPath
    npm run dev
}

# If no flags provided, just show setup summary
if (-not ($Dev -or $Seed -or $Migrate -or $ResetDb)) {
    Write-Host "`n📋 Quick Reference:" -ForegroundColor Cyan
    Write-Host "  Database: Neon PostgreSQL" -ForegroundColor Green
    Write-Host "  Connection: ep-square-dawn-ae1gx64p-pooler.c-2.us-east-2.aws.neon.tech" -ForegroundColor Green
    Write-Host "" -ForegroundColor White
    Write-Host "  Available commands:" -ForegroundColor Cyan
    Write-Host "  .\start-admin.ps1 -Dev              # Start dev server" -ForegroundColor Green
    Write-Host "  .\start-admin.ps1 -Migrate          # Run migrations" -ForegroundColor Green
    Write-Host "  .\start-admin.ps1 -Seed             # Seed test data" -ForegroundColor Green
    Write-Host "  .\start-admin.ps1 -ResetDb          # Reset database" -ForegroundColor Green
    Write-Host "  .\start-admin.ps1 -Dev -Seed        # Seed & start dev" -ForegroundColor Green
    Write-Host "" -ForegroundColor White
    Write-Host "📚 API Endpoints:" -ForegroundColor Cyan
    Write-Host "  GET  /api/admin/stats               # Dashboard statistics" -ForegroundColor Green
    Write-Host "  GET  /api/admin/users               # List all users" -ForegroundColor Green
    Write-Host "  GET  /api/admin/scans               # List all scans" -ForegroundColor Green
    Write-Host "  GET  /api/admin/analytics           # Analytics data" -ForegroundColor Green
    Write-Host "  POST /api/admin/users/[id]/action   # User management" -ForegroundColor Green
    Write-Host "  POST /api/admin/scans/[id]/action   # Scan management" -ForegroundColor Green
}
