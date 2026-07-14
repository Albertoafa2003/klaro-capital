# Klaro Capital

Aplicação local-first de educação financeira, simulações e organização de investimentos para Klerton, CFP®.

## O que está incluído

- página inicial responsiva, modo claro/escuro e navegação acessível;
- biblioteca de artigos com busca e filtros;
- calculadoras de juros simples, compostos, valor presente real, comparação, rentabilidade e metas;
- carteira privada com IndexedDB, exportação/importação JSON, exportação CSV e histórico;
- gráficos com Chart.js e relatórios PDF gerados no navegador com jsPDF;
- política de privacidade, termos e aviso legal em texto-base;
- metadados, Open Graph, manifest, robots, sitemap, 404 e favicon;
- testes unitários das fórmulas e workflow de GitHub Pages.

## Desenvolvimento

Requisitos: Node.js 22 ou superior.

```bash
npm ci
npm run dev
```

## Testes

```bash
npm test
```

## Build para GitHub Pages

```bash
npm run build:github
```

Os arquivos finais serão gerados em `dist-github/`. Todos os caminhos são relativos e funcionam em subdiretório.

## Publicação

1. Crie um repositório no GitHub e envie estes arquivos para a branch `main`.
2. Em **Settings → Pages**, selecione **GitHub Actions** como fonte.
3. O workflow `.github/workflows/deploy.yml` executará testes, build e publicação.
4. Troque `seu-usuario` nos arquivos `app/layout.tsx`, `public/robots.txt` e `public/sitemap.xml` pelo usuário ou domínio correto.

## Privacidade e backup

A carteira é armazenada no IndexedDB do navegador, com fallback local. Não há login nem sincronização em nuvem. O usuário deve exportar backups JSON periodicamente. A limpeza do navegador pode remover dados locais.

## Locais que Klerton deve preencher

- `components/KlaroApp.tsx`: biografia, formação, experiência, foto, contato e links sociais;
- revisar os seis artigos marcados como conteúdo editorial de exemplo;
- validar juridicamente os textos de privacidade, termos e aviso legal;
- confirmar o uso público da certificação CFP® e demais informações profissionais;
- substituir o domínio provisório nos arquivos citados em “Publicação”;
- revisar a frase atribuída a Klerton na página inicial;
- incluir canais de atendimento verdadeiros, sem inserir dados sensíveis no código.

## Estrutura

- `components/KlaroApp.tsx`: interface e interações;
- `lib/finance.ts`: funções financeiras puras;
- `lib/storage.ts`: persistência desacoplada;
- `app/`: entrada da versão hospedada;
- `github/` e `vite.github.config.ts`: build estático para GitHub Pages;
- `public/assets/`: identidade visual;
- `FORMULAS.md`: memória das fórmulas;
- `tests/`: testes automatizados.

## Checklist antes de publicar

- [ ] Substituir todos os placeholders e revisar os artigos.
- [ ] Validar textos legais e uso da marca CFP®.
- [ ] Atualizar domínio, sitemap e metadados.
- [ ] Executar `npm test` e `npm run build:github`.
- [ ] Testar carteira, recarga, backup, restauração e exclusão em celular e desktop.
- [ ] Testar PDF completo com uma carteira real de homologação.
- [ ] Conferir navegação por teclado, foco, contraste e leitor de tela.
- [ ] Confirmar que nenhum dado pessoal, segredo ou credencial foi incluído.
- [ ] Verificar textos e tributação conforme regras vigentes na data de publicação.

Consulte também [FORMULAS.md](FORMULAS.md) para as premissas matemáticas.
