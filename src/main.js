import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/estilos.css'
import './composables/useTema.js' // aplica o tema guardado antes de montar a app

createApp(App).use(router).mount('#app')
