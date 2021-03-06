
import { createApp } from 'vue'
import App from './App.vue'
import { bootstrap } from './bootstrap'
import router from './router'

const app = createApp(App)

bootstrap(app)

router.isReady().then(() => app.mount('#app'))
