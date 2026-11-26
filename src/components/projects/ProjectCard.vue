
<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import AppIcon from '../ui/AppIcon.vue'
import ProjectStatusBadge from './ProjectStatusBadge.vue'
import { formatProjectDate } from '../../data/projects'
import { getProjectTaskStats } from '../../data/tasks'

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
})

const taskStats = computed(() => getProjectTaskStats(props.project.id))
const progress = computed(() => taskStats.value.progress)
</script>

<template>
  <RouterLink
    :to="{
      name: 'project-detail',
      params: { id: project.id },
    }"
    class="project-card"
    :aria-label="`Ver detalles de ${project.name}`"
  >

    <!-- ENCABEZADO -->
    <div class="project-card__header">

      <div class="project-card__icon">
        <AppIcon :name="project.icon" :size="23" />
      </div>

      <ProjectStatusBadge :status="project.status" />

    </div>

    <!-- INFORMACIÓN -->
    <div class="project-card__information">

      <span class="project-card__category">
        {{ project.category }}
      </span>

      <h3>{{ project.name }}</h3>

      <p>{{ project.description }}</p>

    </div>

    <!-- PROGRESO -->
    <div class="project-card__progress">

      <div class="project-card__progress-heading">

        <span>Progreso general</span>

        <strong>{{ progress }}%</strong>

      </div>

      <div
        class="project-card__progress-track"
        role="progressbar"
        :aria-valuenow="progress"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="`Progreso de ${project.name}`"
      >
        <div
          class="project-card__progress-fill"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>

      <span class="project-card__progress-detail" v-if="taskStats.total">
        {{ taskStats.completed }} de {{ taskStats.total }} tareas completadas
      </span>
      <span v-else class="project-card__progress-detail">
        Sin tareas registradas
      </span>

    </div>

    <!-- PIE DE TARJETA -->
    <div class="project-card__footer">

      <div class="project-card__team">

        <div class="project-card__avatars">

          <span
            v-for="member in project.members.slice(0, 3)"
            :key="member.initials"
            class="project-card__avatar"
            :title="member.name"
          >
            {{ member.initials }}
          </span>

          <span
            v-if="project.members.length > 3"
            class="project-card__avatar project-card__avatar--extra"
          >
            +{{ project.members.length - 3 }}
          </span>

        </div>

        <span>
          {{ project.members.length }} miembros
        </span>

      </div>

      <div class="project-card__date">

        <AppIcon name="calendar" :size="14"/>

        <span>{{ formatProjectDate(project.dueDate) }}</span>

      </div>

    </div>

    <!-- ACCESO A DETALLES -->
    <div class="project-card__action">

      <span>Ver detalles del proyecto</span>

      <AppIcon name="arrow-right" :size="17"/>

    </div>

  </RouterLink>
</template>

<style scoped>
.project-card {
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 17px;

  padding: 17px;

  border: 1px solid var(--color-border);

  border-radius: var(--radius-lg);

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.025),
      transparent 65%
    ),
    var(--color-surface);

  color: var(--color-text);

  text-decoration: none;

  box-shadow: var(--shadow-sm);

  transition:
    transform var(--transition-normal),
    border-color var(--transition-normal),
    box-shadow var(--transition-normal);
}

.project-card:hover {
  transform: translateY(-4px);

  border-color: rgba(255, 48, 69, 0.42);

  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.22),
    0 0 18px rgba(255, 48, 69, 0.07);
}

.project-card:focus-visible {
  outline: 2px solid var(--color-red-bright);
  outline-offset: 3px;
}

/* ENCABEZADO */

.project-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 10px;
}

.project-card__icon {
  width: 48px;
  height: 48px;

  display: grid;
  place-items: center;

  border: 1px solid rgba(255, 48, 69, 0.25);

  border-radius: 13px;

  background: var(--color-red-soft);

  color: var(--color-red-bright);

  box-shadow: 0 0 15px rgba(255, 48, 69, 0.06);
}

/* INFORMACIÓN */

.project-card__information {
  min-width: 0;
}

.project-card__category {
  color: var(--color-red-bright);

  font-size: 0.65rem;
  font-weight: 750;

  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.project-card__information h3 {
  margin: 6px 0;

  color: var(--color-text);

  font-size: 1.02rem;
  font-weight: 750;

  letter-spacing: -0.025em;
}

.project-card__information p {
  display: -webkit-box;

  min-height: 40px;

  margin: 0;

  overflow: hidden;

  color: var(--color-text-secondary);

  font-size: 0.74rem;
  line-height: 1.65;

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;

  /* Propiedad estándar para compatibilidad */
  line-clamp: 2;
}

/* PROGRESO */

.project-card__progress {
  display: flex;
  flex-direction: column;

  gap: 9px;
}

.project-card__progress-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-card__progress-heading span {
  color: var(--color-text-secondary);

  font-size: 0.7rem;
}

.project-card__progress-heading strong {
  color: var(--color-text);

  font-size: 0.78rem;
  font-weight: 750;
}

.project-card__progress-detail {
  color: var(--color-text-muted);
  font-size: 0.62rem;
}

.project-card__progress-track {
  width: 100%;
  height: 7px;

  overflow: hidden;

  border-radius: 30px;

  background: rgba(255, 255, 255, 0.10);
}

.project-card__progress-fill {
  height: 100%;

  border-radius: inherit;

  background: linear-gradient(
    90deg,
    #d91f35,
    #ff4659
  );

  box-shadow: 0 0 9px rgba(255, 48, 69, 0.4);

  transition: width 500ms ease;
}

/* EQUIPO Y FECHA */

.project-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  flex-wrap: wrap;

  gap: 10px;

  padding-top: 13px;

  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.project-card__team {
  display: flex;
  align-items: center;

  gap: 8px;
}

.project-card__avatars {
  display: flex;
  align-items: center;
}

.project-card__avatar {
  width: 27px;
  height: 27px;

  display: grid;
  place-items: center;

  margin-left: -6px;

  border: 2px solid var(--color-surface);

  border-radius: 50%;

  background: #54242e;

  color: #ffffff;

  font-size: 0.55rem;
  font-weight: 750;
}

.project-card__avatar:first-child {
  margin-left: 0;

  background: #75303d;
}

.project-card__avatar:nth-child(2) {
  background: #34435c;
}

.project-card__avatar:nth-child(3) {
  background: #51412d;
}

.project-card__avatar--extra {
  background: #29292f;
}

.project-card__team > span {
  color: var(--color-text-muted);

  font-size: 0.64rem;
}

.project-card__date {
  display: flex;
  align-items: center;

  gap: 5px;

  color: var(--color-text-secondary);

  font-size: 0.64rem;

  white-space: nowrap;
}

.project-card__date svg {
  color: var(--color-red-bright);
}

/* ACCESO */

.project-card__action {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding-top: 10px;

  border-top: 1px solid rgba(255, 255, 255, 0.045);

  color: var(--color-red-bright);

  font-size: 0.7rem;
  font-weight: 700;
}

.project-card__action svg {
  transition: transform var(--transition-fast);
}

.project-card:hover .project-card__action svg {
  transform: translateX(4px);
}
</style>
