import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react() as any,
    dts({
      include: ["src"],
      outDir: "dist",
      rollupTypes: true,
      insertTypesEntry: true,
      tsconfigPath: './tsconfig.json'
    }) as any
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'neutrix',
      formats: ['es', 'umd'],
      fileName: (format) => `neutrix.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})