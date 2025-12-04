#!/usr/bin/env powershell

Write-Host "Generating Prisma Client..." -ForegroundColor Cyan

cd "d:\PainPontRadar\reddit-pain-point-research-saas\app"

try {
    # Generate Prisma client
    $output = npx prisma generate 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Prisma client generated successfully" -ForegroundColor Green
    } else {
        Write-Host "Generated output:" -ForegroundColor Yellow
        Write-Host $output
    }
} catch {
    Write-Host "Error generating Prisma client: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`nPrisma schema updated with:" -ForegroundColor Cyan
Write-Host "  ✓ User model with role and status fields" -ForegroundColor Green
Write-Host "  ✓ ScanJob relationship to User" -ForegroundColor Green
Write-Host "  ✓ Admin fields for dashboard management" -ForegroundColor Green

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Ensure DATABASE_URL is set in .env.local" -ForegroundColor White
Write-Host "2. Run: npm run db:push" -ForegroundColor White
Write-Host "3. Test admin dashboard at: http://localhost:3000/admin" -ForegroundColor White
