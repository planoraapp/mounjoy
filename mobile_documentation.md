# Mounjoy Mobile - Documentação de Transição e Telas

Este documento serve como referência técnica detalhada sobre a transição do Mounjoy da versão Web (React + Vite + TailwindCSS) para a versão Mobile (React Native + Expo Go), documentando a arquitetura geral, estratégias de design, componentes e a implementação específica de cada tela.

---

## 1. Arquitetura e Estratégia de Transição

Para portar a experiência interativa e premium do Mounjoy para dispositivos móveis, escolhemos a plataforma **Expo + React Native**, que nos fornece:
- **Hot Reloading rápido** via Expo Go para iterar rapidamente no visual.
- **Acesso nativo** a recursos de hardware (como `ImagePicker` para fotos de evolução).
- **Paridade estilística**: Embora o React Native use `StyleSheet` (baseado em Flexbox) ao invés do TailwindCSS do Web, reproduzimos detalhadamente a paleta de cores (laranja de marca `#EA580C`/`#F97316`, fundos suaves `#FAF7F2`), tipografia (`Outfit` do Google Fonts) e bordas altamente arredondadas (`border-radius: 40`).

### 1.1 Sincronização de Dados
Ambos os ambientes compartilham a estrutura lógica das informações do usuário. O estado do usuário é gerenciado globalmente na raiz (`App.js`) e repassado para as sub-telas. As alterações são despachadas por meio do callback `setUser(newData)`, mantendo os dados sincronizados em tempo real.

---

## 2. Detalhes das Telas Mobile

### 2.1 Landing Page (`NativeLandingPage.jsx`)
- **Objetivo**: Ponto de entrada do aplicativo.
- **Funcionalidades**: Apresenta a marca com um visual limpo e moderno, oferecendo duas opções claras de rota: "Começar Configuração" (onboarding) e "Já tenho conta" (login).

### 2.2 Onboarding (`NativeOnboarding.jsx`)
- **Objetivo**: Configuração guiada passo a passo (passos de 0 a 5) do perfil e protocolo do paciente.
- **Funcionalidades**:
  - Captura nome, peso inicial, altura e meta de peso.
  - **Filtro de Medicamentos (Passo 4)**: Interface otimizada que filtra substâncias por via de administração (injetável, comprimido) e objetivo (perda de peso, diabetes), com sub-seleção de marcas.
  - Integração de sliders interativos para peso e altura.

### 2.3 Home/Dashboard (`NativeDashboard.jsx`)
- **Objetivo**: Painel central diário com resumo de peso, aplicação e metas de consumo.
- **Funcionalidades**:
  - **Resumo de Progresso de Peso**: Exibição em duas colunas (Evolução de fotos com proporção fixa `320px` livre de distorções e Card de Peso com mini barras de proteína e água).
  - **Banner de Ciclo de Medicação**: Alerta dinâmico de pico de efeito da dose ou redução de nível (Food Noise), sugerindo ações inteligentes.
  - **Botão Físico 3D "Injetar"**: Botão personalizado com relevo tátil que simula uma aplicação quando pressionado.
  - **Metas do Dia**: Carrossel horizontal com cards interativos de consumo (Água, Proteína, Fibra) com mascotinhos animados e botões de adição rápida.

### 2.4 Diário (`NativeLogs.jsx`)
- **Objetivo**: Registro de sintomas e efeitos colaterais diários.
- **Funcionalidades**: Permite aos usuários marcar níveis de náusea, dor de cabeça, fadiga e registrar pensamentos em um campo de texto, salvando no histórico do dia selecionado.

### 2.5 Agenda/Calendário (`NativeCalendar.jsx`)
- **Objetivo**: Visualização em calendário da jornada.
- **Funcionalidades**:
  - Exibe um calendário mensal interativo.
  - Destaca os dias de dose aplicada e mapeia o local corporal utilizado para fácil alternância (evitando cicatrizes e lipodistrofia).

### 2.6 Dados/Evolução (`NativeEvolution.jsx`)
- **Objetivo**: Painel analítico de perda de peso e controle glicêmico.
- **Funcionalidades**:
  - **Gráfico de Linha**: Visualização gráfica bezier estilizada com os últimos registros de peso ou glicose.
  - **Comparador Visual de Fotos**: Permite selecionar até 4 registros históricos diferentes para exibi-los lado a lado em cards de aspecto `3/4`, calculando a diferença exata de peso (ex: `-1.5kg`) entre as datas selecionadas.
  - **Modal Fullscreen**: Visualização lado a lado em tela cheia com fundo ambientado (blur) e badge flutuante contendo o total de peso eliminado.

### 2.7 Perfil (`NativeProfile.jsx`)
- **Objetivo**: Ajustes de metas, protocolo e privacidade.
- **Funcionalidades**:
  - **Configurador de Protocolo**: Modal completo para trocar o medicamento (Ozempic, Wegovy, Mounjaro, Rybelsus) e a dosagem de forma simples.
  - **Metas de Saúde**: Controles rápidos na tela para incrementar/decrementar as metas diárias de ingestão de proteínas, água e fibras.
  - **Registro de Aplicação**: Modal com lista tátil destacando locais sugeridos e permitindo registrar a injeção manualmente.
  - **Lembretes e Exclusão Segura**: Interruptor de notificações e fluxo duplo de segurança para eliminação definitiva de dados.
  - **Foto de Perfil**: Integração com a câmera ou galeria do aparelho para atualizar a foto de avatar em tempo real.

---

## 3. Desafios de Gestos e Soluções Customizadas

### 3.1 Captura de Gestos nos Sliders (`NativeUI.jsx`)
- **Problema**: O `PanResponder` dos sliders de peso/altura falhava ou travava quando inserido dentro de telas com scroll (`ScrollView`), pois o scroll nativo "roubava" os gestos.
- **Solução**: 
  1. Adicionado o comando `evt.currentTarget.requestDisallowInterceptTouchEvent(true)` nos manipuladores `onPanResponderGrant` e `onPanResponderMove`. Isso bloqueia temporariamente a rolagem do `ScrollView` enquanto o usuário ajusta o slider.
  2. Substituído o cálculo baseado em `locationX` (que é relativo ao elemento tocado e causa saltos no slider se o usuário tocar na bolinha) por `pageX` absoluto. Ao obter a largura e a coordenada X inicial da barra (cados obtidos dinamicamente na primeira montagem com `ref` e `onLayout`), conseguimos uma precisão de arrasto de 100% livre de bugs de renderização.

### 3.2 Livre Movimentação na Rolagem de Páginas
- **Problema**: O uso excessivo de interceptadores de toque (`onStartShouldSetResponder={() => true}`) em containers de modais e carrosséis travava a rolagem vertical natural do aplicativo caso o usuário tocasse ou iniciasse o movimento com o dedo posicionado acima destes elementos.
- **Solução**: Removemos as declarações de responder invasivas de todos os wrappers de cartões e modais na home e no calendário, devolvendo a prioridade ao `ScrollView` raiz e garantindo uma navegação fluida em todo o app.

---

## 4. Seletor de Local de Aplicação Nativo (`NativeBodySelector.jsx`)

Para garantir paridade com a versão Web, o aplicativo mobile foi atualizado para utilizar um mapa corporal totalmente interativo desenvolvido em SVG (`react-native-svg`):
- **Visualização Humana**: Renderização de caminhos SVG correspondentes aos Braços, Abdômen e Coxas do paciente.
- **Interatividade Tátil**: Cada região responde individualmente ao toque (`onPress` nas tags `Path` do SVG), atualizando instantaneamente o local selecionado.
- **Destaque Visual Dinâmico**: O componente diferencia as cores dos membros baseando-se no estado: laranja para o local atualmente selecionado e esmeralda para a recomendação gerada pelo algoritmo de rotação inteligente.
- **Integração Consistente**: O seletor visual foi integrado aos fluxos de registro de aplicação no Dashboard e no Perfil do usuário.

---

## 5. Status de Lançamento (iOS + Android)

Levantamento feito em 2026-08-21. O backend já migrou de Firebase para Supabase
(`src/supabaseClient.js`); as `firestore.rules` foram removidas nessa migração
— restam só dois comentários stale mencionando "Firestore" em
`src/App.jsx:55` e `src/components/Dashboard.jsx:250`, sem efeito funcional,
que valem uma limpeza de texto quando alguém mexer nesses arquivos.

### Bloqueadores para rodar/testar localmente
- [ ] **Sem `.env`/`.env.local` no projeto.** `supabaseClient.js` exige
  `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY`; sem isso o
  app não conecta a nada. Recriar o arquivo local com as credenciais do
  Supabase antes de qualquer teste funcional.
- [ ] **CRÍTICO — build web nunca recebe as env vars, mesmo com `.env.local`
  correto.** Verificado em 2026-08-21 rodando `npm run dev` com um
  `.env.local` válido: `vite.config.js:13` faz
  `define: { 'process.env': env }`, mas essa substituição **não é aplicada**
  pelo servidor de dev do Vite — `curl http://localhost:5173/src/supabaseClient.js`
  mostra o literal `process.env[...]` sem nenhuma troca, e o app quebra
  sempre com `Uncaught Error: supabaseUrl is required` ao carregar, mesmo
  com credenciais válidas no arquivo. Ou seja: hoje a versão web do Mounjoy
  está inoperante em qualquer ambiente (não é só falta de configurar
  localmente — é a mecânica de injeção de env que está quebrada). Caminho
  de correção recomendado: trocar `getEnv()` em `src/supabaseClient.js` para
  ler `import.meta.env.VITE_SUPABASE_URL` no lado Vite/web (o mecanismo
  nativo do Vite, que sempre funciona) mantendo o fallback
  `process.env.EXPO_PUBLIC_SUPABASE_URL` só para o lado Expo/Metro nativo, e
  remover o `define: {'process.env': env}` de `vite.config.js` — hoje ele
  também expõe **todo o `process.env` do SO** (não só as chaves do app) para
  o bundle do navegador, que é o aviso que o próprio Vite imprime no boot
  ("The `define` option contains an object with 'PATH'... This poses a
  security risk"). Corrigir os dois problemas juntos.
- [ ] CSP em `index.html` ainda restringe `script-src`/`worker-src` a
  domínios do Firebase (`*.firebaseapp.com`, `apis.google.com`) — bloqueia o
  Web Worker que o `@supabase/supabase-js` usa para sessão/realtime
  (`Creating a worker from 'blob:...' violates ... script-src`). Precisa
  atualizar a CSP para os domínios do Supabase (ou do worker-src correto)
  como parte da limpeza pós-migração.

### Pendências para build de loja (App Store / Play Store)
- [ ] `app.json` sem `ios.bundleIdentifier` e sem `android.package`
  (obrigatórios para gerar build assinado).
- [ ] `app.json` sem `icon` e sem `splash` configurados — cai no ícone padrão
  do Expo.
- [ ] `app.json` sem `android.versionCode` / `ios.buildNumber`.
- [ ] Sem `eas.json` — falta a configuração de build/submit via EAS
  (caminho padrão do Expo para gerar `.ipa`/`.aab` e submeter às lojas).
- [ ] Sem termos de uso / política de privacidade publicados — exigidos por
  ambas as lojas no cadastro do app antes da submissão.
- [ ] Sem metadados de loja preparados (descrição, categoria, screenshots,
  classificação etária).

### Cobertura de testes
- [x] Suíte de testes criada em 2026-08-21 (unit + E2E web), inspirada no
  padrão em camadas do projeto Tour Sinop mas reescrita do zero para a stack
  real do Mounjoy (Supabase/Vite/`react-native-web`), já que o código de
  testes do Tour Sinop era específico daquele stack (Firestore + Vercel
  Functions + Asaas) e não era reaproveitável diretamente. Ver
  [tests/README de uso](#) e a seção 6 abaixo.
- [ ] Suíte ainda não rodou de ponta a ponta contra um projeto Supabase de
  teste de verdade (o projeto ainda não foi criado) — só a camada `unit`
  (14 testes, sem rede) foi executada e está passando. A camada `e2e` está
  bloqueada pelo bug de env vars acima: mesmo os specs que só usam o modo
  convidado (sem Supabase) não sobem, porque a página inteira quebra no
  boot por causa do `process.env` — corrigir o bug de env é pré-requisito
  para rodar qualquer teste de navegador, não só os que tocam Supabase.
- [ ] Sem cobertura E2E de build nativa real (simulador iOS / emulador
  Android). Ferramenta recomendada se isso virar prioridade: Maestro (mais
  simples que Detox para Expo).

### Já resolvido
- [x] Repositório local sincronizado com `origin/main` (estava 14 commits
  atrás).
- [x] Migração de Firebase para Supabase concluída no código (`firestore.rules`
  removido, `supabaseClient.js` em uso).

---

## 6. Suíte de Testes (unit + E2E)

Criada em 2026-08-21. Três partes:

- **`tests/unit/`** (Vitest, sem rede) — `securityUtils.test.js` e
  `userService.test.js`, este último contra um fake em memória do query
  builder do `supabase-js` (`tests/helpers/supabase-fake.js`). Rodar com
  `npm run test:unit`.
- **`tests/e2e/`** (Playwright, navegador real contra `npm run dev`) — 5
  jornadas: onboarding como convidado, login com conta seedada, metas
  diárias, registrar dose, e convidado virando conta (migração
  localStorage → Supabase). Precisa de um **projeto Supabase de TESTE
  separado** (nunca produção) — rodar `supabase/schema.sql` nele, colar
  `EXPO_PUBLIC_SUPABASE_URL`/`EXPO_PUBLIC_SUPABASE_ANON_KEY`/
  `SUPABASE_SERVICE_ROLE_KEY` em `.env.test.local` (gitignored), depois
  `npm run test:e2e:seed` e `npm run test:e2e`.
- **`data-testid`** foi adicionado nos elementos-chave de Login, Onboarding,
  App (nav + banner de convidado) e Dashboard, já que o app não usa router
  (troca de tela é só `useState`, sem URL) e não tinha nenhum seletor
  estável antes.

Bloqueador atual: o bug de `process.env`/`define` descrito acima impede
qualquer teste de navegador de rodar até ser corrigido, mesmo os que não
tocam Supabase.
