import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import compression from 'vite-plugin-compression'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const baseApi = env.VUE_APP_BASE_API || '/gdmercury-api/network-cms'
  const target = 'http://10.107.2.244'

  return {
    base: env.VUE_APP_PATH || '/',
    envPrefix: ['VITE_', 'VUE_APP_'],
    define: {
      'process.env.VUE_APP_BASE_API': JSON.stringify(env.VUE_APP_BASE_API),
      'process.env.VUE_APP_BASE_API_CMDB': JSON.stringify(env.VUE_APP_BASE_API_CMDB || '/gdmercury-api'),
      'process.env.VUE_APP_PATH': JSON.stringify(env.VUE_APP_PATH || '/'),
      'process.env.VUE_APP_TITLE': JSON.stringify(env.VUE_APP_TITLE || '后台管理系统'),
      'process.env.NODE_ENV': JSON.stringify(mode)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      },
      extensions: ['.ts', '.js', '.vue', '.json', '.mjs']
    },
    server: {
      host: '127.0.0.1',
      port: 8081,
      open: true,
      proxy: {
        [baseApi]: {
          target,
          changeOrigin: true
        },
        '/gdmercury-api': {
          target,
          changeOrigin: true
        },
        '/digest-api': {
          target,
          changeOrigin: true
        }
      }
    },
    plugins: [
      vue(),
      // element-ui 是 Vue 2 组件库，内部使用 import Vue from 'vue'（Vue 2 默认导出），
      // 与 Vue 3 的 ESM 命名导出不兼容。该插件将 element-ui 内部的 vue 导入重定向到兼容 shim。
      {
        name: 'element-ui-vue-compat',
        enforce: 'pre',
        resolveId(source, importer) {
          if (source === 'vue' && importer && importer.includes('element-ui')) {
            return path.resolve(__dirname, 'src/shims/vue-default.ts')
          }
          return null
        }
      },
      createSvgIconsPlugin({
        iconDirs: [path.resolve(__dirname, 'src/assets/icons/svg')],
        symbolId: 'icon-[name]'
      }),
      compression({
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
        deleteOriginFile: false
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'static',
      sourcemap: false,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks: {
            'chunk-libs': ['vue', 'vue-router', 'pinia', 'axios'],
            'chunk-antd': ['ant-design-vue', '@ant-design/icons-vue']
          }
        }
      }
    }
  }
})
