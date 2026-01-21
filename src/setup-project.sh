#!/bin/bash

# Script para setup completo do projeto MAGOTECH
echo "🚀 Configurando projeto MAGOTECH..."

# Criar estrutura de diretórios
mkdir -p magotech-store/{components/{ui,figma},hooks,utils/supabase,styles,supabase/functions/server,guidelines}

cd magotech-store

# Criar package.json
cat > package.json << 'EOF'
{
  "name": "magotech-store",
  "version": "1.0.0",
  "description": "Loja virtual de tecnologia MAGOTECH",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-visually-hidden": "^1.1.1",
    "lucide-react": "^0.487.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "@tailwindcss/vite": "^4.0.0-alpha.11"
  }
}
EOF

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

echo "✅ Projeto MAGOTECH configurado com sucesso!"
echo "📁 Entre na pasta: cd magotech-store"
echo "🚀 Execute: npm run dev"
EOF