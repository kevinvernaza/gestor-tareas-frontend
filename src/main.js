import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import { notify } from './data/uiFeedback'

// Sistema de diseño
import './styles/tokens.css'
import './styles/global.css'
import './styles/effects.css'

const app = createApp(App)

/*
================================================
MANEJO GLOBAL DE ERRORES DE VUE
================================================
*/

app.config.errorHandler = (error, instance, info) => {
  console.error('Error inesperado en la interfaz:', error, info)

  notify({
    type: 'error',
    title: 'Ocurrió un error inesperado',
    message: 'La interfaz encontró un problema. Actualiza la página si el problema continúa.',
    duration: 6500,
  })
}

// Inicialización
app.use(router)
app.mount('#app')
