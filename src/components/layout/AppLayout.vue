
<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'

import AppSidebar from './AppSidebar.vue'
import AppTopbar from './AppTopbar.vue'
import ToastContainer from '../ui/ToastContainer.vue'
import ConfirmDialog from '../ui/ConfirmDialog.vue'

const sidebarOpen = ref(false)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function closeSidebar() {
  sidebarOpen.value = false
}
</script>

<template>
  <div class="app-shell">

    <!-- MENÚ LATERAL -->
    <AppSidebar
      :mobile-open="sidebarOpen"
      @close="closeSidebar"
    />

    <!-- FONDO OSCURO PARA MENÚ MÓVIL -->
    <button
      v-if="sidebarOpen"
      type="button"
      class="sidebar-backdrop"
      aria-label="Cerrar menú de navegación"
      @click="closeSidebar"
    ></button>

    <!-- CONTENIDO PRINCIPAL -->
    <div class="app-main">

      <!-- BARRA SUPERIOR -->
      <AppTopbar @toggle-sidebar="toggleSidebar" />

      <!-- VISTAS -->
      <main class="app-content">
        <RouterView />
      </main>

    </div>

    <ToastContainer />
    <ConfirmDialog />

  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
}

.app-main {
  min-width: 0;
  min-height: 100vh;

  margin-left: var(--sidebar-width);
}

.app-content {
  width: 100%;
  max-width: calc(var(--content-max-width) + 48px);

  margin: 0 auto;

  padding: 25px 24px 40px;
}

/* FONDO DEL MENÚ MÓVIL */

.sidebar-backdrop {
  display: none;
}

/* RESPONSIVE */

@media (max-width: 900px) {
  .app-main {
    margin-left: 0;
  }

  .sidebar-backdrop {
    position: fixed;

    inset: 0;

    z-index: 90;

    display: block;

    border: 0;

    background: rgba(0, 0, 0, 0.70);

    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
  }

  .app-content {
    padding: 20px 16px 35px;
  }
}

@media (max-width: 480px) {
  .app-content {
    padding: 17px 12px 30px;
  }
}
</style>
