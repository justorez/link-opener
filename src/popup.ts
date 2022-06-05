import { createApp } from 'vue'
import App from './views/popup.vue'
import './utils/reload/page'
import myComponents from './components'

createApp(App)
    .use(myComponents)
    .mount('#app')
