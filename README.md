<div align="center">

# UTF Jobs - Portal de Vagas

### Plataforma completa de gestão de vagas e candidaturas com interface moderna e responsiva

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[Ver Demonstração](#demonstração) • [Funcionalidades](#funcionalidades) • [Tecnologias](#tecnologias) • [Instalação](#instalação)

</div>

---

## Limitações e Contexto Técnico

Apesar de totalmente funcional, o projeto ainda passará por melhorias tanto na interface quanto no backend.

Este projeto foi desenvolvido considerando as limitações de infraestrutura dos laboratórios da UTFPR, onde será apresentado:

### Restrições do Ambiente

- **Node.js 18.14.0:** Versão fixa instalada nos laboratórios, impedindo o uso de recursos mais recentes
- **Sem Banco de Dados:** Ausência de SGBD (MySQL, PostgreSQL, MongoDB) instalados
- **Sem Docker:** Impossibilidade de containerização e orquestração de serviços
- **Hardware Limitado:** Recursos computacionais restritos para execução de serviços pesados

### Decisões Arquiteturais

Devido às limitações acima, o projeto foi estruturado com:

- **Utilização do SQLite como banco de dados:** Dados armazenados com SQLite que independe de instalação prévia nos computadores dos laboratórios
- **Tecnologias Leves:** Escolha de bibliotecas e frameworks com baixo overhead
- **Compatibilidade com Node 18.14:** Código e dependências compatíveis com versões antigas do Node.js
- **Sem Containerização:** Não utilização de Docker/Kubernetes

### Considerações

Em um ambiente de produção real, as seguintes melhorias seriam implementadas:

- Migração para banco de dados relacional mais robusto e escalável (PostgreSQL) ou NoSQL (MongoDB)
- Containerização com Docker para facilitar deploy e escalabilidade
- Utilização de Node.js mais recente com recursos modernos
- Implementação de cache com Redis
- Possível deploy em plataformas cloud (AWS, Azure, GCP)
- CI/CD automatizado com testes integrados

---

## Demonstração


### Vídeo de demonstração básica do projeto

https://github.com/user-attachments/assets/1ea9d4f6-875f-4a24-9ee1-787101c23ca2

---

## Sobre o Projeto

O **UTF Jobs** é uma aplicação web completa desenvolvida como projeto acadêmico da disciplina de Cliente-Servidor, que simula um portal profissional de vagas de emprego. A plataforma conecta empresas que desejam divulgar oportunidades com candidatos em busca de sua próxima posição.

### Design Responsivo

O projeto garante uma experiência fluida em todos os dispositivos:

- **Mobile:** Interface otimizada com menus hambúrguer e cards verticais
- **Desktop:** Layout em grid com múltiplas colunas e filtros laterais
- **Tablet:** Adaptação inteligente entre layouts mobile e desktop

---

## Funcionalidades

### Para Candidatos

- **Cadastro e Autenticação:** Sistema completo de registro e login com validação
- **Busca Avançada:** Filtros por título, área, localização e faixa salarial
- **Candidaturas:** Aplicação para vagas com confirmação via modal
- **Feedback:** Recebimento de retorno das empresas sobre candidaturas
- **Perfil Personalizável:** Gerenciamento de dados pessoais, experiência e formação

### Para Empresas

- **Gestão de Vagas:** Criação, edição e exclusão de oportunidades
- **Visualização de Candidatos:** Acesso completo aos perfis dos candidatos
- **Dashboard de Vagas:** Gerenciamento centralizado de todas as publicações
- **Sistema de Feedback:** Envio de retorno personalizado para cada candidato
- **Perfil Corporativo:** Informações da empresa, localização e ramo de atuação

### Recursos Gerais

- **Configuração Dinâmica:** Conexão customizável com servidor backend via interface
- **Rotas Protegidas:** Sistema de autenticação com JWT e controle de acesso
- **Responsivo:** Interface adaptável para mobile, tablet e desktop
- **UI Moderna:** Componentes estilizados com Tailwind CSS e Lucide Icons

---

## Tecnologias

### Core

- **[React 18.2](https://reactjs.org/)** 
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Vite 5.4](https://vitejs.dev/)**
- **[React Router 6](https://reactrouter.com/)** 

### Gerenciamento de Estado

- **[Zustand](https://github.com/pmndrs/zustand)** - State management leve e performático
- **[React Hook Form](https://react-hook-form.com/)** - Formulários com validação eficiente
- **[Zod](https://zod.dev/)** - Schema validation com TypeScript

### UI/UX

- **[Tailwind CSS 4.1](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Lucide React](https://lucide.dev/)** - Biblioteca de ícones moderna
- **[React Select](https://react-select.com/)** - Componente de seleção customizável

### Comunicação

- **[Axios](https://axios-http.com/)** - Cliente HTTP com interceptors personalizados

---

## Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── AlertDialog.tsx     # Diálogos de confirmação
│   ├── Button.tsx          # Componente de botão customizado
│   ├── Input.tsx           # Input com validação integrada
│   ├── JobCard.tsx         # Card de vaga
│   ├── Navbar.tsx          # Barra de navegação responsiva
│   └── ConfirmModal.tsx    # Modais de confirmação
├── pages/               # Páginas da aplicação
│   ├── Home/              # Listagem de vagas com filtros
│   ├── Login/             # Autenticação
│   ├── Register/          # Cadastro de usuários/empresas
│   ├── Profile/           # Visualização e edição de perfil
│   ├── Job/               # Detalhes, candidatura e gestão de vagas
│   ├── Applications/      # Candidaturas do usuário
│   └── Connection/        # Configuração do servidor
├── context/             # Context API
│   └── AuthContext.tsx    # Contexto de autenticação
├── schemas/             # Schemas de validação Zod
│   ├── userSchema.ts      # Validação de usuários
│   ├── companySchema.ts   # Validação de empresas
│   └── jobSchema.ts       # Validação de vagas
├── services/            # Serviços externos
│   └── axios.ts           # Configuração do Axios
├── store/               # Zustand stores
│   ├── connectionData.ts  # Estado da conexão
│   └── editing.ts         # Estado de edição
└── utils/               # Utilitários
    └── parseJwt.ts        # Decodificação de JWT
```

---

## Instalação

### Pré-requisitos

- **Node.js** 18.14.0 ou superior ([Download](https://nodejs.org/))
- **Backend** do projeto rodando ([Repositório Backend](https://github.com/MatheusAndreiczuk/projeto-cliente-servidor-backend))

### Passo a Passo

1. **Clone o repositório**

```powershell
git clone https://github.com/MatheusAndreiczuk/projeto-cliente-servidor-frontend.git
cd projeto-cliente-servidor-frontend
```

2. **Instale as dependências**

```powershell
npm install
```

3. **Inicie o servidor de desenvolvimento**

```powershell
npm run dev
```

4. **Acesse a aplicação**

Abra seu navegador em: `http://localhost:5173`

### Scripts Disponíveis

```powershell
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Gera build de produção
```

---

## Configuração

### Conexão com Backend

A aplicação permite configurar dinamicamente o endereço do servidor backend:

1. **Via Interface:**
   - Clique no botão flutuante no canto inferior direito
   - Informe o IP e porta do servidor
   - As configurações são salvas no `localStorage`

2. **Configuração Manual:**

Edite o arquivo `src/store/connectionData.ts`:

```typescript
const serverIp = localStorage.getItem('server-ip') || 'localhost'
const serverPort = localStorage.getItem('server-port') || '3000'
```

### Variáveis de Ambiente (Opcional)

Para usar variáveis de ambiente, crie um arquivo `.env`:

```env
VITE_API_URL=http://localhost:3000
```

E adapte `src/services/axios.ts` para usar `import.meta.env.VITE_API_URL`.

---

## Funcionalidades Técnicas Destacadas

### 1. Sistema de Autenticação Robusto

- JWT armazenado em `localStorage`
- Context API para gerenciamento global do estado de autenticação
- Rotas protegidas com `ProtectedRoute` component
- Decodificação automática do token para identificar role (user/company)

### 2. Validação de Formulários

- Schemas Zod para validação tipada
- React Hook Form para performance otimizada
- Feedback em tempo real de erros

### 3. Estado Persistente

- Zustand para gerenciamento leve e performático
- Persistência automática no `localStorage`
- Sincronização entre abas do navegador

---

## Fluxo de Usuário

### Fluxo do Candidato

```
Registro → Login → Buscar Vagas → Filtrar → 
Ver Detalhes → Candidatar-se → Acompanhar Status → 
Receber Feedback
```

### Fluxo da Empresa

```
Registro → Login → Criar Vaga → Publicar → 
Visualizar Candidatos → Analisar Perfis → 
Enviar Feedback
```

---

## Responsividade

| Dispositivo | Resolução | Layout |
|------------|-----------|--------|
| Mobile | < 640px | 1 coluna, menus hambúrguer, cards verticais |
| Tablet | 640px - 1024px | 2 colunas, menus expandidos |
| Desktop | > 1024px | 3 colunas, filtros laterais, grid completo |

---

## Licença

Este projeto foi desenvolvido para fins acadêmicos como parte da disciplina de Cliente-Servidor.

---

## Autor

**Matheus Andreiczuk**

- GitHub: [@MatheusAndreiczuk](https://github.com/MatheusAndreiczuk)
- LinkedIn: [Matheus Andreiczuk](www.linkedin.com/in/matheus-andreiczuk-b4a843274)

---

<div align="center">

### Se gostou deste projeto, considere dar uma estrela!

</div>

