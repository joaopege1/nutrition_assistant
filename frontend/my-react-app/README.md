# RCU App - Frontend

Uma aplicação React moderna e responsiva para gerenciamento de entradas de comida, conectada com uma API FastAPI.

## 🚀 Funcionalidades

### Autenticação
- **Login**: Sistema de autenticação com JWT
- **Cadastro**: Criação de contas de usuário e administrador
- **Proteção de rotas**: Acesso controlado baseado em autenticação
- **Logout**: Encerramento seguro de sessão

### Gerenciamento de Entradas
- **Visualização**: Lista todas as entradas de comida
- **Criação**: Adicionar novas entradas (apenas admins)
- **Edição**: Modificar entradas existentes (apenas admins)
- **Exclusão**: Remover entradas (apenas admins)
- **Controle de segurança**: Marcar entradas como seguras/inseguras (apenas admins)

### Interface Responsiva
- **Mobile-first**: Otimizado para dispositivos móveis
- **Tablet**: Layout adaptado para tablets
- **Desktop**: Interface completa para desktop
- **Design moderno**: Interface limpa e intuitiva

## 🛠️ Tecnologias Utilizadas

- **React 19** - Framework principal
- **TypeScript** - Tipagem estática
- **React Router** - Navegação
- **Axios** - Cliente HTTP
- **Vite** - Build tool
- **Context API** - Gerenciamento de estado

## 📱 Responsividade

A aplicação é totalmente responsiva e se adapta a diferentes tamanhos de tela:

- **Mobile** (≤ 480px): Layout em coluna única, botões maiores para touch
- **Tablet** (481px - 768px): Layout híbrido com 2 colunas
- **Desktop** (≥ 769px): Layout completo com múltiplas colunas

## 🔧 Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Backend FastAPI rodando na porta 8000

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
```

### Build para produção
```bash
npm run build
```

### Preview da build
```bash
npm run preview
```

## 🔗 Conexão com Backend

A aplicação se conecta com os seguintes endpoints do FastAPI:

### Autenticação
- `POST /auth/tokens` - Login
- `POST /auth/` - Cadastro
- `GET /users/` - Dados do usuário atual

### Entradas de Comida
- `GET /foods/` - Listar entradas
- `POST /food_entry/` - Criar entrada
- `PUT /food_entry/{id}` - Atualizar entrada
- `DELETE /food_entry/{id}` - Deletar entrada

### Admin (apenas para administradores)
- `GET /auth/admin/foods/` - Todas as entradas
- `PUT /auth/admin/food_entry/{id}` - Atualizar segurança
- `DELETE /auth/admin/food_entry/{id}` - Deletar entrada

## 👥 Tipos de Usuário

### Usuário Comum
- Visualizar entradas de comida
- Ver estatísticas básicas

### Administrador
- Todas as funcionalidades do usuário comum
- Criar, editar e deletar entradas
- Controlar status de segurança das entradas
- Acesso a todas as entradas do sistema

## 🎨 Design System

### Cores
- **Primária**: #667eea (azul)
- **Sucesso**: #28a745 (verde)
- **Perigo**: #dc3545 (vermelho)
- **Info**: #17a2b8 (ciano)
- **Neutro**: #6c757d (cinza)

### Tipografia
- **Fonte**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **Tamanhos responsivos**: 14px (mobile), 15px (tablet), 16px (desktop)

### Componentes
- **Cards**: Bordas arredondadas, sombras suaves
- **Botões**: Estados hover, disabled, loading
- **Formulários**: Validação em tempo real
- **Tabelas**: Scroll horizontal em mobile

## 🔒 Segurança

- **JWT Tokens**: Autenticação baseada em tokens
- **Interceptors**: Inclusão automática de tokens nas requisições
- **Proteção de rotas**: Verificação de autenticação
- **Controle de acesso**: Diferentes permissões por tipo de usuário

## 📊 Funcionalidades por Tela

### Login
- Formulário de autenticação
- Validação de campos
- Estados de loading
- Tratamento de erros

### Cadastro
- Formulário completo de registro
- Seleção de tipo de usuário
- Validação de senhas
- Confirmação de dados

### Dashboard
- Estatísticas em tempo real
- Lista de entradas em tabela
- Ações contextuais por tipo de usuário
- Modais para criação/edição

## 🚀 Deploy

Para fazer deploy da aplicação:

1. Execute o build: `npm run build`
2. Os arquivos estáticos estarão na pasta `dist/`
3. Configure seu servidor web para servir os arquivos da pasta `dist/`
4. Certifique-se de que a API backend esteja acessível

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.