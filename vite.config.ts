import { toBoolean } from '@jserwang/utils'
import vue from '@vitejs/plugin-vue'
import { loadEnv, UserConfig } from 'vite'
import { vitePluginFaker } from 'vite-plugin-faker'
import { alias } from './build/vite/alias'

// https://vitejs.dev/config/
export default ({ mode }): UserConfig => {
  const { VITE_USE_MOCK } = loadEnv(mode, process.cwd())
  return {
    resolve: {
      alias: alias([
        ['/@', 'src']
      ])
    },
    plugins: [
      vue(),
      toBoolean(VITE_USE_MOCK) && vitePluginFaker({
        basePath: '/src/api',
        includes: [/^.*Service/],
        mockDir: '/mock',
        watchFile: true
      })
    ]
  }
}
