
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import AppIcon from '../components/ui/AppIcon.vue'

const route = useRoute()

const pageTitle = computed(() => {
  return route.meta.title || 'Sección'
})

const pageDescription = computed(() => {
  return route.meta.description || ''
})

const pageIcon = computed(() => {
  return route.meta.icon || 'folder'
})

const plannedStage = computed(() => {
  return route.meta.stage || 'PRÓXIMAMENTE'
})
</script>

<template>
  <section class="placeholder-page">

    <header class="placeholder-heading">

      <span class="placeholder-kicker">
        ESPACIO DE TRABAJO
      </span>

      <h1>{{ pageTitle }}</h1>

      <p>{{ pageDescription }}</p>

    </header>

    <section class="placeholder-card">

      <div class="placeholder-icon">
        <AppIcon :name="pageIcon" :size="34" />
      </div>

      <span class="placeholder-stage">
        {{ plannedStage }}
      </span>

      <h2>
        Estamos preparando esta sección
      </h2>

      <p>
        La estructura de navegación está lista.
        Aquí incorporaremos las funcionalidades
        correspondientes a esta sección durante
        el desarrollo del proyecto.
      </p>

      <div class="placeholder-status">

        <span class="status-dot status-dot--red"></span>

        Sección en desarrollo

      </div>

    </section>

  </section>
</template>

<style scoped>
.placeholder-page {
  display: flex;
  flex-direction: column;

  gap: 28px;
}

.placeholder-heading {
  padding: 4px 2px;
}

.placeholder-kicker {
  color: var(--color-red-bright);

  font-size: 0.68rem;
  font-weight: 800;

  letter-spacing: 0.16em;
}

.placeholder-heading h1 {
  margin: 8px 0;

  color: var(--color-text);

  font-size: clamp(1.7rem, 4vw, 2.2rem);

  font-weight: 800;
  letter-spacing: -0.055em;
}

.placeholder-heading p {
  margin: 0;

  color: var(--color-text-secondary);

  font-size: 0.88rem;
  line-height: 1.7;
}

.placeholder-card {
  position: relative;

  min-height: 380px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: 35px 22px;

  overflow: hidden;

  text-align: center;

  border: 1px solid var(--color-border);

  border-radius: var(--radius-lg);

  background:
    radial-gradient(
      ellipse at 50% 40%,
      rgba(227, 38, 54, 0.09),
      transparent 50%
    ),
    var(--color-surface);
}

.placeholder-card::before {
  content: "";

  position: absolute;

  width: 250px;
  height: 250px;

  top: -180px;
  right: -100px;

  border-radius: 50%;

  background: rgba(227, 38, 54, 0.14);

  filter: blur(65px);
}

.placeholder-icon {
  width: 76px;
  height: 76px;

  display: grid;
  place-items: center;

  margin-bottom: 20px;

  border: 1px solid var(--color-border-red);

  border-radius: 20px;

  background: var(--color-red-soft);

  color: var(--color-red-bright);

  box-shadow: var(--shadow-red);
}

.placeholder-stage {
  color: var(--color-red-bright);

  font-size: 0.64rem;
  font-weight: 800;

  letter-spacing: 0.14em;
}

.placeholder-card h2 {
  margin: 11px 0;

  color: var(--color-text);

  font-size: 1.35rem;
  font-weight: 750;
}

.placeholder-card > p {
  max-width: 480px;

  margin: 0;

  color: var(--color-text-secondary);

  font-size: 0.82rem;
  line-height: 1.8;
}

.placeholder-status {
  display: flex;
  align-items: center;

  gap: 9px;

  margin-top: 26px;

  padding: 9px 14px;

  border: 1px solid var(--color-border);

  border-radius: var(--radius-full);

  background: rgba(255, 255, 255, 0.025);

  color: var(--color-text-secondary);

  font-size: 0.73rem;
}
</style>
