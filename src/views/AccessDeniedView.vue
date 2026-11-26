<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AppIcon from '../components/ui/AppIcon.vue'

const route = useRoute()
const requestedPath = computed(() => route.query.redirect || '')
</script>

<template>
  <main class="system-state-page">
    <section class="system-state-card">
      <div class="system-state-icon">
        <AppIcon name="flag" :size="32"/>
      </div>

      <span class="system-state-kicker">ACCESO RESTRINGIDO</span>
      <h1>No tienes permiso para entrar</h1>
      <p>Tu perfil actual no cuenta con los permisos necesarios para consultar esta sección. Si necesitas acceder, solicita autorización al administrador.</p>

      <small v-if="requestedPath">
        Ruta solicitada: {{ requestedPath }}
      </small>

      <RouterLink to="/" class="system-state-button">
        <AppIcon name="arrow-left" :size="16"/>
        Volver al Dashboard
      </RouterLink>
    </section>
  </main>
</template>

<style scoped>
.system-state-page {
  min-height: 65vh;
  display: grid;
  place-items: center;
  padding: 25px;
}

.system-state-card {
  width: min(100%, 520px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36px 28px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background:
    radial-gradient(ellipse at 50% 0%, rgba(255, 48, 69, 0.08), transparent 55%),
    var(--color-surface);
  text-align: center;
}

.system-state-icon {
  width: 68px;
  height: 68px;
  display: grid;
  place-items: center;
  margin-bottom: 18px;
  border: 1px solid var(--color-border-red);
  border-radius: 19px;
  background: var(--color-red-soft);
  color: var(--color-red-bright);
}

.system-state-kicker {
  color: var(--color-red-bright);
  font-size: 0.63rem;
  font-weight: 800;
  letter-spacing: 0.15em;
}

.system-state-card h1 {
  margin: 9px 0;
  color: var(--color-text);
  font-size: clamp(1.35rem, 4vw, 1.8rem);
  font-weight: 800;
}

.system-state-card p {
  max-width: 420px;
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.76rem;
  line-height: 1.7;
}

.system-state-card small {
  margin-top: 13px;
  color: var(--color-text-muted);
  font-size: 0.64rem;
  overflow-wrap: anywhere;
}

.system-state-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 23px;
  padding: 11px 15px;
  border: 1px solid var(--color-border-red);
  border-radius: 9px;
  background: var(--color-red-soft);
  color: var(--color-red-bright);
  font-size: 0.72rem;
  font-weight: 750;
  text-decoration: none;
}

.system-state-button:hover {
  background: rgba(255, 48, 69, 0.18);
}
</style>
