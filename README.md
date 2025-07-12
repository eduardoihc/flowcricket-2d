# Sistema de Aprovação de Peças - grilo

Sistema web responsivo para aprovação de peças criativas desenvolvido para a agência **grilo**.

## Funcionalidades

### Acesso e Autenticação
- **Admin (grilo)**: Acesso completo ao sistema
- **Cliente**: Acesso restrito às suas peças
- Login simples com nome e cliente (sem senha)

### Gestão de Projetos e Peças
- Criação e edição de projetos
- Upload de múltiplos arquivos (imagens, vídeos, GIFs, PDFs)
- Organização por cliente e projeto
- Legendas opcionais para peças

### Sistema de Aprovação
- Interface inspirada em redes sociais
- Visualização tipo Instagram (posts, stories, carrossel)
- Botões de **Aprovar** e **Solicitar Alterações**
- Status visual das peças

### Sistema de Comentários
- Marcadores visuais clicáveis nas imagens
- Comentários agrupados por marcador
- Contagem de comentários
- Encerramento de marcadores

### Dashboard Admin
- Métricas em tempo real
- Status de todas as peças
- Contagem de comentários
- Filtros por cliente e data

### Recursos Técnicos
- Interface responsiva (desktop e mobile)
- Armazenamento local em JSON
- Log completo de ações
- Estrutura modular para expansão

## Como Executar

1. **Instalar dependências:**
\`\`\`bash
npm install
\`\`\`

2. **Executar em desenvolvimento:**
\`\`\`bash
npm run dev
\`\`\`

3. **Acessar o sistema:**
\`\`\`
http://localhost:3000
\`\`\`

## Estrutura do Projeto

\`\`\`
/
├── app/
│   ├── page.tsx              # Página principal
│   ├── layout.tsx            # Layout base
│   └── globals.css           # Estilos globais
├── components/
│   ├── auth/
│   │   └── login-form.tsx    # Formulário de login
│   ├── admin/
│   │   ├── admin-dashboard.tsx
│   │   ├── upload-modal.tsx
│   │   └── project-modal.tsx
│   ├── client/
│   │   └── client-view.tsx   # Interface do cliente
│   └── shared/
│       └── piece-view.tsx    # Visualização de peças
├── hooks/
│   ├── use-auth.ts           # Hook de autenticação
│   └── use-data.ts           # Hook de dados
├── types/
│   └── index.ts              # Definições de tipos
└── README.md
\`\`\`

## Dados de Teste

O sistema inclui dados mockados para demonstração:

### Usuários de Teste
- **Admin**: Nome qualquer + "Admin (grilo)"
- **Cliente**: Nome qualquer + Cliente (ex: "Coca-Cola")

### Projetos Exemplo
- Campanha Verão 2024 (Coca-Cola)
- Lançamento Produto (Nike)

## Migração Futura

O sistema foi desenvolvido com estrutura modular para facilitar migração para Firebase:

1. **Autenticação**: Substituir localStorage por Firebase Auth
2. **Banco de Dados**: Migrar JSON local para Firestore
3. **Storage**: Implementar Firebase Storage para arquivos
4. **Real-time**: Adicionar listeners em tempo real

## Tecnologias

- **Frontend**: Next.js 14, React, TypeScript
- **UI**: Tailwind CSS, Radix UI, shadcn/ui
- **Ícones**: Lucide React
- **Armazenamento**: localStorage (temporário)

## Próximos Passos

1. Implementar autenticação com senha
2. Adicionar notificações em tempo real
3. Relatórios e analytics
4. Integração com ferramentas de design
5. API para integrações externas
