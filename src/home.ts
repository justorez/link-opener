import { createApp } from 'vue'
import App from './views/home.vue'
import myComponents from './components'
import myDirectives from './directives'
import './utils/reload/page'


createApp(App)
    .use(myComponents)
    .use(myDirectives)
    .mount('#app')
