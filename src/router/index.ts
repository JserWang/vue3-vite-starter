import { App } from '@vue/runtime-core'
import { createRouter, createWebHistory } from 'vue-router'
import { setupGuards } from './guards'
import { routes } from './routes'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes
})

export const setupRouter = (app: App) => {
  app.use(router)
  setupGuards(router)
}

export default router
