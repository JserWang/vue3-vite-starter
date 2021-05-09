import { App } from '@vue/runtime-core'
import { setupRouter } from './router'

export const bootstrap = (app: App) => {
  setupRouter(app)
}
