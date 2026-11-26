
<script setup>
import { RouterLink } from 'vue-router'

import AppIcon from '../ui/AppIcon.vue'
import FeedbackState from '../ui/FeedbackState.vue'

defineProps({
  projects: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <section class="dashboard-panel projects-panel">

    <header class="panel-header">

      <div class="panel-title">
        <AppIcon name="brand" :size="19" />

        <h2>Proyectos recientes</h2>
      </div>

      <RouterLink
        to="/proyectos"
        class="view-all-link"
      >
        Ver todos <span>→</span>
      </RouterLink>

    </header>

    <div v-if="projects.length" class="project-list">

      <article
        v-for="project in projects"
        :key="project.id"
        class="project-row"
      >

        <div class="project-icon">
          <AppIcon :name="project.icon" :size="20" />
        </div>

        <div class="project-information">

          <strong>{{ project.name }}</strong>

          <span class="project-members">
            <AppIcon name="users" :size="12" />
            {{ project.members }} miembros
          </span>

        </div>

        <div class="project-progress">

          <div
            class="progress-track"
            role="progressbar"
            :aria-valuenow="project.progress"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-label="`Avance de ${project.name}`"
          >
            <div
              class="progress-fill"
              :style="{ width: `${project.progress}%` }"
            ></div>
          </div>

        </div>

        <span class="project-percentage">
          {{ project.progress }}%
        </span>

      </article>

    </div>

    <FeedbackState
      v-else
      variant="empty"
      icon="folder"
      title="No hay proyectos recientes"
      description="Los proyectos asociados a tu perfil aparecerán en este panel."
    />

  </section>
</template>

<style scoped>
.dashboard-panel {
  min-width: 0;
  min-height: 170px;

  padding: 13px 15px;

  border: 1px solid var(--color-border);

  border-radius: var(--radius-lg);

  background: var(--color-surface);

  box-shadow: var(--shadow-sm);
}

/* ENCABEZADO */

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 10px;

  margin-bottom: 11px;
}

.panel-title {
  display: flex;
  align-items: center;

  gap: 9px;

  min-width: 0;
}

.panel-title svg {
  flex-shrink: 0;

  color: var(--color-red-bright);
}

.panel-title h2 {
  margin: 0;

  color: var(--color-text);

  font-size: 0.91rem;
  font-weight: 750;

  letter-spacing: -0.025em;
}

.view-all-link {
  display: flex;
  align-items: center;

  gap: 6px;

  padding: 5px 10px;

  border: 1px solid var(--color-red);

  border-radius: 30px;

  color: var(--color-red-bright);

  font-size: 0.66rem;
  font-weight: 650;

  white-space: nowrap;

  transition:
    background var(--transition-fast),
    box-shadow var(--transition-fast);
}

.view-all-link:hover {
  background: var(--color-red-soft);

  box-shadow: var(--shadow-red);
}

/* FILAS */

.project-list {
  display: flex;
  flex-direction: column;
}

.project-row {
  min-width: 0;

  display: grid;

  grid-template-columns: 39px minmax(125px, 1.2fr) minmax(70px, 1fr) 35px;

  align-items: center;

  gap: 10px;

  padding: 7px 0;

  border-bottom: 1px solid rgba(255, 255, 255, 0.055);
}

.project-row:last-child {
  border-bottom: 0;
}

/* ICONO */

.project-icon {
  width: 37px;
  height: 37px;

  display: grid;
  place-items: center;

  border: 1px solid rgba(255, 48, 69, 0.18);

  border-radius: 10px;

  color: var(--color-red-bright);

  background:
    linear-gradient(
      145deg,
      rgba(255, 48, 69, 0.14),
      rgba(255, 48, 69, 0.035)
    );
}

/* INFORMACIÓN */

.project-information {
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 2px;
}

.project-information strong {
  overflow: hidden;

  color: var(--color-text);

  font-size: 0.74rem;
  font-weight: 650;

  white-space: nowrap;
  text-overflow: ellipsis;
}

.project-members {
  display: flex;
  align-items: center;

  gap: 5px;

  color: var(--color-text-muted);

  font-size: 0.63rem;
}

.project-members svg {
  flex-shrink: 0;
}

/* PROGRESO */

.project-progress {
  min-width: 0;
}

.progress-track {
  width: 100%;
  height: 7px;

  overflow: hidden;

  border-radius: var(--radius-full);

  background: rgba(255, 255, 255, 0.10);
}

.progress-fill {
  height: 100%;

  border-radius: inherit;

  background:
    linear-gradient(
      90deg,
      #d91f35,
      #ff4659
    );

  box-shadow:
    0 0 9px rgba(255, 48, 69, 0.4);

  transition: width 500ms ease;
}

.project-percentage {
  color: var(--color-text);

  font-size: 0.7rem;
  font-weight: 650;

  text-align: right;
}

/* RESPONSIVE */

@media (max-width: 520px) {
  .project-row {
    grid-template-columns: 36px minmax(0, 1fr) 34px;

    gap: 8px;
  }

  .project-progress {
    grid-column: 2 / 3;

    grid-row: 2;

    margin-top: -3px;
  }

  .project-percentage {
    grid-column: 3;
    grid-row: 1;
  }

  .project-icon {
    grid-row: 1 / 3;
  }
}
</style>
