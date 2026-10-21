import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
  publicDir: false,
  plugins: [
    react(),
    dts({
      include: ['src/lib/**/*', 'src/components/**/*'],
      outDir: 'dist/lib',
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist/lib',
    lib: {
      entry: path.resolve(__dirname, 'src/lib/index.ts'),
      name: 'AlgoXAI',
      formats: ['es', 'umd'],
      fileName: (format) => (format === 'es' ? 'algoxai.js' : 'algoxai.umd.cjs'),
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
