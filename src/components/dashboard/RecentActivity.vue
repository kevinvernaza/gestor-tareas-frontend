
<script setup>
import AppIcon from '../ui/AppIcon.vue'
import FeedbackState from '../ui/FeedbackState.vue'

defineProps({
  activities: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <section class="activity-panel">

    <header class="activity-header">

      <div class="activity-title">
        <AppIcon name="bolt" :size="20" />

        <h2>Actividad reciente</h2>
      </div>

    </header>

    <FeedbackState
      v-if="!activities.length"
      variant="empty"
      icon="bolt"
      title="Sin actividad reciente"
      description="Las actualizaciones de las tareas visibles aparecerán aquí."
    />

    <div v-else class="activity-list">

      <article
        v-for="activity in activities"
        :key="activity.id"
        class="activity-item"
      >

        <!-- LÍNEA DE TIEMPO -->
        <div class="activity-timeline">

          <span class="activity-dot"></span>

        </div>

        <!-- ICONO -->
        <div class="activity-icon">
          <AppIcon :name="activity.icon" :size="17" />
        </div>

        <!-- INFORMACIÓN -->
        <div class="activity-information">

          <p>
            <strong>{{ activity.target }}</strong>
          </p>

          <span>
            {{ activity.action }} · Responsable: {{ activity.actor }} · {{ activity.time }}
          </span>

        </div>

      </article>

    </div>

  </section>
</template>

<style scoped>
.activity-panel {
  min-width: 0;
  min-height: 165px;

  padding: 14px 15px;

  border: 1px solid var(--color-border);

  border-radius: var(--radius-lg);

  background: var(--color-surface);

  box-shadow: var(--shadow-sm);
}

/* ENCABEZADO */

.activity-header {
  margin-bottom: 13px;
}

.activity-title {
  display: flex;
  align-items: center;

  gap: 9px;
}

.activity-title svg {
  color: var(--color-red-bright);
}

.activity-title h2 {
  margin: 0;

  color: var(--color-text);

  font-size: 0.91rem;
  font-weight: 750;
}

/* LISTA */

.activity-list {
  display: flex;
  flex-direction: column;

  gap: 11px;
}

.activity-item {
  position: relative;

  min-width: 0;

  display: grid;

  grid-template-columns: 13px 34px minmax(0, 1fr);

  align-items: center;

  gap: 10px;
}

/* LÍNEA */

.activity-timeline {
  position: relative;

  width: 13px;
  height: 100%;

  display: flex;
  justify-content: center;
}

.activity-timeline::after {
  content: "";

  position: absolute;

  top: 11px;
  bottom: -15px;

  width: 1px;

  background: rgba(255, 48, 69, 0.32);
}

.activity-item:last-child .activity-timeline::after {
  display: none;
}

.activity-dot {
  position: relative;

  z-index: 1;

  width: 9px;
  height: 9px;

  border: 1px solid #ff7884;

  border-radius: 50%;

  background: var(--color-red-bright);

  box-shadow:
    0 0 9px rgba(255, 48, 69, 0.55);
}

/* ICONO */

.activity-icon {
  width: 33px;
  height: 33px;

  display: grid;
  place-items: center;

  border: 1px solid rgba(255, 48, 69, 0.16);

  border-radius: 10px;

  background: rgba(255, 48, 69, 0.08);

  color: var(--color-text);
}

/* INFORMACIÓN */

.activity-information {
  min-width: 0;
}

.activity-information p {
  margin: 0;

  color: var(--color-text-secondary);

  font-size: 0.69rem;
  line-height: 1.55;
}

.activity-information strong {
  color: var(--color-text);

  font-weight: 750;
}

.activity-information b {
  color: var(--color-text);

  font-weight: 650;
}

.activity-information > span {
  display: block;

  margin-top: 2px;

  color: var(--color-text-muted);

  font-size: 0.63rem;
}
</style>
