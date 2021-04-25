import vue from '@vitejs/plugin-vue'
import { UserConfig } from 'vite'
import { alias } from './build/vite/alias'

// https://vitejs.dev/config/
export default (): UserConfig => {
  return {
    resolve: {
      alias: alias([
        ['/@', 'src']
      ])
    },
    plugins: [vue()]
  }
}
