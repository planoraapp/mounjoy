import { defineConfig } from 'vitest/config';

// Sem plugin de React: tests/unit cobre só módulos .js puros (services/utils),
// não componentes .jsx, então não há JSX para transformar aqui.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.js'],
  },
});
