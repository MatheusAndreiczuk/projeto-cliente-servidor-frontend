
## Projeto — Cliente-Servidor (Frontend)

Este repositório contém a parte frontend de um projeto React + Vite. Este README descreve como começar a partir de um arquivo .zip (que não inclui arquivos ignorados pelo `.gitignore`, como `node_modules`) e como rodar o projeto no Windows (PowerShell).

## Pré-requisitos

- Node.js 18.14.0 ou superior (verificado no `package.json`). Verifique sua versão com:

```powershell
node -v
```

- npm (vem com o Node) ou outro gerenciador compatível (pnpm/yarn não documentados aqui). Recomendado usar o npm incluído.

## O que esperar do .zip

Se você baixou o projeto como um `.zip`, ele normalmente NÃO conterá os arquivos listados em `.gitignore`. Itens comuns omitidos:

- `node_modules/` (dependências) — você precisa rodar `npm install`.
- `dist/` (builds) — gerado pela etapa de build.
- Arquivos locais/IDE (`.vscode/`, etc.).

Por isso o primeiro passo após extrair o zip é instalar dependências.

## Passos para rodar (Windows PowerShell)

1) Extraia o `.zip` em uma pasta, por exemplo `C:\projetos\meu-app`.

2) Abra PowerShell e entre na pasta do projeto:

```powershell
cd C:\caminho\para\a\pasta\do\projeto
```

3) Instale as dependências (o `node_modules` não vem no zip):

```powershell
npm install
```

4) Rodar em modo desenvolvimento (vite com hot-reload):

```powershell
npm run dev
```

Após `npm run dev` o Vite normalmente abrirá o servidor em `http://localhost:5173`. O terminal exibirá a URL exata.

## Build e preview

- Para gerar o build de produção:

```powershell
npm run build
```

## Scripts úteis (definidos em `package.json`)

- `npm run dev` — inicia o servidor de desenvolvimento (Vite).
- `npm run build` — cria a versão de produção na pasta `dist`.
- `npm run preview` — serve a pasta `dist` localmente para testes.

## Configuração da conexão com o servidor backend

Este frontend configura a `baseURL` das requisições HTTP dinamicamente a partir do estado do aplicativo (armazenado em `localStorage`). Mais detalhes:

- O cliente HTTP está em `src/services/axios.ts`. Ele define `config.baseURL` usando os valores armazenados em `src/store/connectionData.ts`.
- Por padrão o projeto usa `localhost:3000` (valores padrão definidos em `src/store/connectionData.ts`).

Como ajustar a conexão:

- Pela interface do aplicativo: existe uma página de conexão acessível por meio de um botão flutuante no canto direito inferior onde você será direcionado pode informar o IP e a porta do servidor. Após salvar, o app atualiza o `localStorage` e passa a usar essa URL para as requisições.
- Manualmente: edite `localStorage` no browser (chaves `server-ip` e `server-port`), ou altere os valores padrão em `src/store/connectionData.ts` se quiser mudar por código.

Exemplo de URL formada pelo app:

```
http://<ip>:<port>
```

## Variáveis de ambiente

Este projeto não depende de variáveis de ambiente via `import.meta.env` para a `baseURL` — o endereço é lido via store/localStorage. Se você planeja usar variáveis de ambiente (por exemplo `VITE_API_URL`), adapte `src/services/axios.ts` conforme necessário.

## Problemas comuns e soluções

- Erro: "module not found" / "Cannot find module" — verifique se rodou `npm install` após extrair o zip.
- Versão do Node incompatível — instale uma versão >= 18.14.0. No Windows, use o instalador oficial ou `nvm-windows` para gerenciar versões.
- Porta em uso — se `5173` (Vite) ou `3000` (backend) estiverem ocupadas, libere a porta ou configure outra porta (para Vite é possível usar `--port` ou configurar em `vite.config.js`).
- Problemas de CORS com backend — verifique se o backend permite requisições da origem do frontend.

## Dicas rápidas de debugging

- Verifique o console do navegador para erros de frontend.
- Observe os logs no terminal onde `npm run dev` está rodando (Vite mostra erros de compilação).
- As chamadas de API exibem no console uma linha como `Fazendo requisição para: http://<ip>:<port><url>` (veja `src/services/axios.ts`).

---

README gerado automaticamente com instruções para iniciar o projeto no Windows (PowerShell). Ajuste as instruções conforme seu fluxo de trabalho ou políticas internas.
