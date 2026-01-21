# 🛒 MAGOTECH - Loja Virtual de Tecnologia

<div align="center">
  <img src="https://i.postimg.cc/BZYqNzjQ/Logo-Mago-teech.png" alt="MAGOTECH Logo" width="200"/>
  
  ### 🚀 Loja Virtual Moderna de Produtos Tecnológicos
  
  **Desenvolvido com React + TypeScript + Supabase**
  
  [![Deploy com Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mirianramosdev/-magotech-loja-)
  
</div>

---

## 📋 Sobre o Projeto

**MAGOTECH** é uma loja virtual completa e moderna especializada em produtos tecnológicos, desenvolvida com as melhores práticas de desenvolvimento web. O sistema inclui catálogo de produtos, carrinho de compras persistente, autenticação de clientes e um painel administrativo completo para gerenciamento.

### ✨ Destaques

- 🎨 **Design Moderno** - Interface clean com identidade visual em preto e verde
- 📱 **100% Responsivo** - Funciona perfeitamente em desktop, tablet e mobile
- ⚡ **Performance Otimizada** - Carregamento rápido e experiência fluida
- 🔐 **Sistema de Autenticação** - Login seguro para clientes e administradores
- 🛒 **Carrinho Persistente** - Seus produtos ficam salvos mesmo após fechar o navegador
- 📊 **Painel Admin Completo** - Gerencie produtos, pedidos, clientes e veja relatórios em tempo real
- 🌐 **Backend Real** - Integração com Supabase para persistência de dados
- 📱 **WhatsApp Integration** - Finalização de pedidos via WhatsApp

---

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática para maior segurança
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS V4** - Framework CSS moderno e customizável

### Backend & Database
- **Supabase** - Backend as a Service
  - Banco de dados PostgreSQL
  - Edge Functions (Hono)
  - Storage para imagens
  - Autenticação real

### UI Components
- **Shadcn/ui** - Componentes acessíveis e customizáveis
- **Lucide React** - Ícones modernos
- **Recharts** - Gráficos e visualizações
- **Sonner** - Notificações toast elegantes

### Outras Ferramentas
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **date-fns** - Manipulação de datas
- **bcryptjs** - Hash de senhas

---

## 📦 Funcionalidades

### 🏪 Loja Virtual

#### Para Clientes:
- ✅ Catálogo de produtos com fotos e descrições detalhadas
- ✅ Filtro por categorias (Celulares, Notebooks, Tablets, Gamer, Acessórios)
- ✅ Carrinho de compras com cálculo automático de total
- ✅ Ajuste de quantidades e remoção de itens
- ✅ Sistema de cadastro e login
- ✅ Perfil do cliente com histórico de pedidos
- ✅ Finalização de pedidos via WhatsApp
- ✅ Indicadores visuais (Novo, Em Promoção)
- ✅ Avaliações e reviews de produtos
- ✅ Informações de estoque em tempo real

#### Para Visitantes:
- ✅ Navegação sem necessidade de cadastro
- ✅ Visualização de produtos e preços
- ✅ Adição de produtos ao carrinho
- ✅ Cadastro opcional para finalizar compra

### 👨‍💼 Painel Administrativo

#### Dashboard:
- 📊 Visão geral com métricas em tempo real
- 💰 Faturamento total e mensal
- 📦 Total de pedidos e status
- 👥 Total de clientes ativos
- 📈 Gráficos de vendas e categorias
- 🏆 Produtos mais vendidos
- 🔔 Notificações de novos pedidos

#### Gestão de Produtos:
- ➕ Adicionar novos produtos com fotos
- ✏️ Editar informações e preços
- 🗑️ Remover produtos
- 📦 Controle de estoque
- 🏷️ Gerenciar categorias
- 💰 Preços originais e promoções
- ⭐ Sistema de avaliações

#### Gestão de Pedidos:
- 📋 Lista completa de todos os pedidos
- 🔄 Atualização de status (Pendente, Confirmado, Enviado, Entregue)
- 👁️ Visualização detalhada de cada pedido
- 📱 Informações de contato do cliente
- 📍 Endereço de entrega
- 💳 Método de pagamento
- 📝 Observações do cliente

#### Gestão de Clientes:
- 👥 Lista de todos os clientes cadastrados
- 📊 Histórico de compras por cliente
- 💰 Total gasto por cliente
- 📧 Informações de contato
- ✏️ Edição de dados cadastrais
- 🔍 Busca e filtros

#### Relatórios:
- 📈 Análise de vendas por período
- 📊 Produtos mais vendidos
- 👥 Clientes mais ativos
- 💰 Faturamento detalhado
- 📥 Exportação de dados (JSON)

#### Configurações:
- 🏢 Informações da empresa
- 📱 WhatsApp comercial
- 📧 Email de contato
- 📍 Endereço físico da loja
- 🎨 Personalização de cores (futuro)

---

## 🎯 Diferenciais

### 🔒 Segurança
- Senhas criptografadas com bcrypt
- Validação de dados no frontend e backend
- Proteção contra SQL injection
- Tokens seguros de autenticação

### ⚡ Performance
- Lazy loading de imagens
- Code splitting automático
- Cache inteligente
- Otimização de bundle

### 🎨 UX/UI
- Design intuitivo e moderno
- Feedback visual em todas as ações
- Loading states
- Mensagens de erro amigáveis
- Animações suaves

### 📱 Responsividade
- Mobile-first design
- Breakpoints otimizados
- Menu hambúrguer em mobile
- Cards adaptáveis
- Grids responsivos

### 💾 Persistência de Dados
- Sistema híbrido Supabase + LocalStorage
- Fallback automático para modo offline
- Sincronização quando online
- Backup local dos dados

---

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js 18+ instalado
- Git instalado
- Conta no GitHub
- Conta no Supabase (gratuita)

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/Mirianramosdev/-magotech-loja-.git
cd -magotech-loja-
```

### 2️⃣ Instalar Dependências

```bash
npm install
```

### 3️⃣ Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_publica_do_supabase
```

Para obter as credenciais do Supabase:
1. Acesse: https://supabase.com/dashboard
2. Crie um novo projeto (ou use existente)
3. Vá em **Settings** → **API**
4. Copie a **URL** e a **anon public key**

### 4️⃣ Rodar o Projeto Localmente

```bash
npm run dev
```

O projeto estará disponível em: `http://localhost:5173`

---

## 🚀 Deploy

### Deploy no Vercel (Recomendado)

[![Deploy com Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Mirianramosdev/-magotech-loja-)

#### Passo a Passo:

1. **Acesse:** https://vercel.com
2. **Faça login** com sua conta do GitHub
3. Clique em **"Import Project"**
4. Selecione o repositório: `Mirianramosdev/-magotech-loja-`
5. **Configure as variáveis de ambiente:**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Clique em **"Deploy"**

⏱️ **Tempo de deploy:** 2-3 minutos

📄 **Guia completo:** Veja `VERCEL-DEPLOY.md`

### Configurar Domínio Personalizado

Para usar seu domínio `magotec.com.br`:

1. No Vercel, vá em **Settings** → **Domains**
2. Adicione: `magotec.com.br` e `www.magotec.com.br`
3. Configure os DNS no seu provedor

📄 **Guia completo:** Veja `INSTRUCOES-DNS-DOMINIO.md`

---

## 📂 Estrutura do Projeto

```
magotech-loja/
├── components/              # Componentes React
│   ├── AdminDashboard.tsx   # Dashboard administrativo
│   ├── AdminPanel.tsx       # Painel admin principal
│   ├── Cart.tsx             # Carrinho de compras
│   ├── Header.tsx           # Cabeçalho
│   ├── Footer.tsx           # Rodapé
│   ├── ProductCard.tsx      # Card de produto
│   ├── CustomerAuth.tsx     # Autenticação de cliente
│   └── ui/                  # Componentes UI (45 arquivos)
│
├── hooks/                   # React Hooks customizados
│   └── useAPI.tsx           # Hook para API/Supabase
│
├── supabase/                # Configuração backend
│   └── functions/server/    # Edge Functions
│       ├── index.tsx        # Servidor Hono
│       └── kv_store.tsx     # Store de dados
│
├── styles/                  # Estilos globais
│   └── globals.css          # Tailwind CSS V4
│
├── utils/                   # Utilitários
│   └── supabase/info.tsx    # Config Supabase
│
├── App.tsx                  # Componente principal
├── main.tsx                 # Entry point
├── package.json             # Dependências
├── vite.config.ts           # Config Vite
└── tsconfig.json            # Config TypeScript
```

---

## 🔑 Credenciais de Acesso

### Painel Administrativo

Para acessar o painel admin:

```
URL: /admin ou clique no ícone de escudo no footer
Email: ceo@magotech.com.br
Senha: 0052MT?@*
```

### Teste de Cliente

Você pode criar uma conta de cliente diretamente no site ou usar:

```
Criar conta → Preencher formulário → Login
```

---

## 📱 Integração WhatsApp

O sistema permite finalizar pedidos via WhatsApp com mensagem formatada:

```
🛒 NOVO PEDIDO - MAGOTECH

📋 Pedido Nº: 1001A
👤 Cliente: João Silva
📱 Telefone: (79) 99999-9999
📧 Email: joao@email.com

🛍️ ITENS DO PEDIDO:
━━━━━━━━━━━━━━━━━━━━

1x iPhone 15 Pro Max 256GB
💰 R$ 8.999,00

1x AirPods Pro (3ª Geração)
💰 R$ 1.999,00

━━━━━━━━━━━━━━━━━━━━
💵 TOTAL: R$ 10.998,00

📍 Endereço de Entrega:
Rua das Flores, 123 - São Paulo, SP

📝 Observações:
Cliente solicitou entrega rápida

---
Pedido realizado via site MAGOTECH
```

Configure o número do WhatsApp nas **Configurações** do painel admin.

---

## 🎨 Identidade Visual

### Cores Principais

```css
/* Preto MAGOTECH */
--primary: #000000

/* Verde MAGOTECH */
--accent: #10B981

/* Cinza Claro */
--background: #F9FAFB

/* Texto */
--foreground: #111827
```

### Tipografia

- **Fonte Principal:** System UI (Inter, Roboto, Arial)
- **Títulos:** Font-weight 600-700
- **Corpo:** Font-weight 400

### Logo

Logo oficial hospedada em:
```
https://i.postimg.cc/BZYqNzjQ/Logo-Mago-teech.png
```

---

## 📊 Dados e Persistência

### Sistema Híbrido

O MAGOTECH usa um sistema inteligente de dados:

```
1. Tenta usar SUPABASE (prioridade)
   ↓
2. Se falhar: usa LOCALSTORAGE (backup)
   ↓
3. Sincroniza quando volta online
```

### Limpeza de Dados

Para limpar dados de teste locais:

```javascript
// No console do navegador (F12):
localStorage.clear();
location.reload();
```

Para limpar dados no Supabase, veja: `DADOS-REAIS-MAGOTECH.md`

---

## 📚 Documentação Completa

O projeto inclui guias detalhados:

| Arquivo | Conteúdo |
|---------|----------|
| **VERCEL-DEPLOY.md** | Deploy completo no Vercel |
| **INSTRUCOES-DNS-DOMINIO.md** | Configurar domínio personalizado |
| **DADOS-REAIS-MAGOTECH.md** | Gerenciar dados e produtos |
| **GITHUB-EXPORT.md** | Exportar projeto para GitHub |
| **COMANDOS-GIT-TERMINAL.md** | Comandos Git essenciais |
| **SETUP-COMPLETO.md** | Setup detalhado do projeto |

---

## 🐛 Troubleshooting

### Problema: "Erro ao conectar com Supabase"

**Solução:** Verifique as variáveis de ambiente no arquivo `.env`

---

### Problema: "Produtos não aparecem"

**Solução:** 
1. Acesse o painel admin
2. Vá em "Produtos"
3. Adicione produtos manualmente

---

### Problema: "Erro no push do Git"

**Solução:** Use um Personal Access Token em vez da senha do GitHub
- Criar em: https://github.com/settings/tokens

---

### Problema: "Deploy falhou no Vercel"

**Solução:**
1. Verifique se as variáveis de ambiente estão configuradas
2. Veja os logs de build no Vercel
3. Consulte `VERCEL-DEPLOY.md`

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

---

## 📝 Roadmap

### Próximas Features

- [ ] 💳 Integração com gateways de pagamento (Stripe, PagSeguro)
- [ ] 📧 Sistema de emails transacionais
- [ ] 🔍 Busca avançada de produtos
- [ ] ⭐ Sistema de favoritos
- [ ] 📦 Rastreamento de pedidos
- [ ] 💬 Chat ao vivo com clientes
- [ ] 📱 App mobile (React Native)
- [ ] 🌍 Multi-idioma (PT, EN, ES)
- [ ] 🎁 Sistema de cupons de desconto
- [ ] 📊 Analytics avançado

---

## 👥 Autor

**Mirian Ramos**  
Desenvolvedora Full Stack

- GitHub: [@mirianramosdev](https://github.com/mirianramosdev)
- Email: mirianksr67@gmail.com

---

## 🏢 MAGOTECH

**Mago Tech - Assistência Técnica e Soluções Tecnológicas**

📍 **Endereço:**  
Av. Josias de Carvalho  
Salgado, SE - CEP: 49390-000  
Brasil

📧 **Contato:**  
Email: ceo@magotech.com.br

🌐 **Links:**
- Site: Em breve no `magotec.com.br`
- GitHub: [mirianramosdev/-magotech-loja-](https://github.com/mirianramosdev/-magotech-loja-)
- Supabase: [Dashboard](https://supabase.com/dashboard/project/iytnisowaqccipvrknbz)

---

## 📄 Licença

Este projeto é privado e proprietário da **MAGOTECH**.  
Todos os direitos reservados © 2025

---

## 🙏 Agradecimentos

- **React Team** - Pela incrível biblioteca
- **Vercel** - Pelo hosting gratuito e deploy automático
- **Supabase** - Pelo backend completo e gratuito
- **Shadcn/ui** - Pelos componentes de alta qualidade
- **Tailwind CSS** - Pelo framework CSS moderno
- **Unsplash** - Pelas imagens de alta qualidade

---

## 📈 Status do Projeto

```
✅ MVP Completo
✅ Design Responsivo
✅ Backend Integrado
✅ Painel Admin Funcional
✅ Sistema de Autenticação
✅ Carrinho Persistente
✅ Documentação Completa
🚀 Pronto para Produção!
```

---

## 🎯 Métricas

- **Linhas de Código:** ~15.000
- **Componentes React:** 48
- **Páginas de Documentação:** 14
- **Tempo de Desenvolvimento:** 2 semanas
- **Cobertura de Testes:** Em desenvolvimento
- **Performance Score:** 95/100 (Lighthouse)

---

<div align="center">

### 🌟 Se este projeto foi útil, considere dar uma estrela! ⭐

**Desenvolvido com 💚 por Mirian Ramos para MAGOTECH**

**[⬆ Voltar ao topo](#-magotech---loja-virtual-de-tecnologia)**

</div>

---

**Última atualização:** Outubro 2025  
**Versão:** 1.0.0  
**Status:** ✅ Produção
