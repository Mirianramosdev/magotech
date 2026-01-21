#!/usr/bin/env node

/**
 * Script automatizado para criar o projeto MAGOTECH completo
 * Execute: node create-project.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Criando projeto MAGOTECH...\n');

// Criar diretório do projeto
const projectDir = 'magotech-store';
if (!fs.existsSync(projectDir)) {
  fs.mkdirSync(projectDir);
}

process.chdir(projectDir);

// Package.json
const packageJson = {
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
};

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

// Criar estrutura de diretórios
const dirs = [
  'components',
  'components/ui',
  'components/figma',
  'hooks',
  'utils',
  'utils/supabase',
  'styles',
  'supabase',
  'supabase/functions',
  'supabase/functions/server',
  'guidelines'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log('📁 Estrutura de pastas criada');

// Instalar dependências
console.log('📦 Instalando dependências... (isso pode demorar alguns minutos)');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependências instaladas com sucesso!');
} catch (error) {
  console.error('❌ Erro ao instalar dependências:', error.message);
  process.exit(1);
}

// Criar arquivos básicos
const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})`;

const tsConfig = `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "App.tsx", "components", "hooks", "utils", "styles"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`;

const indexHtml = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MAGOTECH - Tecnologia que Transforma</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>`;

const mainTsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;

fs.writeFileSync('vite.config.ts', viteConfig);
fs.writeFileSync('tsconfig.json', tsConfig);
fs.writeFileSync('index.html', indexHtml);
fs.writeFileSync('main.tsx', mainTsx);

console.log('📄 Arquivos de configuração criados');

console.log('\n✅ Projeto MAGOTECH criado com sucesso!');
console.log('\n📋 Próximos passos:');
console.log('1. cd magotech-store');
console.log('2. Copie todos os arquivos da estrutura atual para as pastas correspondentes');
console.log('3. npm run dev');
console.log('\n🚀 Acesse: http://localhost:5173');