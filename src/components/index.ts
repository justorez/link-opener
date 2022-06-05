import { App } from 'vue'
import {
    ElConfigProvider,
    ElLoading,
    ElLink,
    ElIcon,
    ElSpace
} from 'element-plus'

export default {
    install(app: App) {
        app.use(ElConfigProvider)
        app.use(ElLoading)
        app.use(ElLink)
        app.use(ElIcon)
        app.use(ElSpace)
    }
}
