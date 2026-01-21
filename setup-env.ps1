# Script para adicionar variáveis de ambiente no Vercel
Write-Host "Configurando variáveis de ambiente no Vercel..." -ForegroundColor Green

# Adicionar VITE_SUPABASE_URL
Write-Host "Adicionando VITE_SUPABASE_URL..." -ForegroundColor Cyan
vercel env add VITE_SUPABASE_URL

# Adicionar VITE_SUPABASE_ANON_KEY
Write-Host "Adicionando VITE_SUPABASE_ANON_KEY..." -ForegroundColor Cyan
vercel env add VITE_SUPABASE_ANON_KEY

Write-Host "Pronto! Variáveis de ambiente adicionadas com sucesso!" -ForegroundColor Green
Write-Host "Agora faça redeploy do seu projeto no Vercel." -ForegroundColor Yellow
