import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const page = (path) =>
  fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: page('./index.html'),
        form: page('./src/pages/form.html'),
        level: page('./src/pages/level.html'),
        game: page('./src/pages/game.html'),
        wins: page('./src/pages/wins.html')
      }
    }
  }
});
