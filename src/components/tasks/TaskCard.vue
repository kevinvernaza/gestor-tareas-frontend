
<script setup>
import { RouterLink } from 'vue-router'

import AppIcon from '../ui/AppIcon.vue'

import TaskStatusBadge from './TaskStatusBadge.vue'
import TaskPriorityBadge from './TaskPriorityBadge.vue'

import { TASK_STATUSES } from '../../data/tasks'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  canChangeStatus: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits([
  'status-change',
])

function handleStatusChange(event) {
  const nextStatus = event.target.value

  // Si el padre cancela la confirmación, el control conserva el estado real.
  event.target.value = props.task.status

  emit('status-change', {
    taskId: props.task.id,
    status: nextStatus,
  })
}
</script>

<template>
  <article class="task-card">

    <!-- INFORMACIÓN PRINCIPAL -->
    <div class="task-card__main">

      <div class="task-card__heading">

        <div class="task-card__identity">

          <span class="task-card__id">
            {{ task.id }}
          </span>

          <RouterLink
            :to="{
              name: 'task-detail',
              params: { id: task.id },
            }"
            class="task-card__title"
          >
            {{ task.title }}
          </RouterLink>

        </div>

        <div class="task-card__badges">

          <TaskPriorityBadge
            :priority="task.priority"
          />

          <TaskStatusBadge
            :status="task.status"
          />

        </div>

      </div>

      <p class="task-card__description">
        {{ task.description }}
      </p>

      <!-- METADATOS -->
      <div class="task-card__metadata">

        <RouterLink
          :to="{
            name: 'project-detail',
            params: { id: task.projectId },
          }"
          class="task-card__metadata-item task-card__project"
        >

          <AppIcon name="folder" :size="15"/>

          {{ task.projectName }}

        </RouterLink>

        <span class="task-card__metadata-item">

          <AppIcon name="user" :size="15"/>

          {{ task.responsibleName }}

        </span>

        <span class="task-card__metadata-item">

          <AppIcon name="calendar" :size="15"/>

          {{ task.dueDateLabel }}

        </span>

        <span
          v-if="task.isOverdue"
          class="task-card__overdue"
        >

          <AppIcon name="clock" :size="14"/>

          Vencida

        </span>

      </div>

    </div>

    <!-- CONTROLES -->
    <div class="task-card__controls">

      <template v-if="canChangeStatus">
        <label :for="`status-${task.id}`">
          Actualizar estado
        </label>

        <select
          :id="`status-${task.id}`"
          :value="task.status"
          @change="handleStatusChange"
        >
          <option
            v-for="status in TASK_STATUSES"
            :key="status"
            :value="status"
          >
            {{ status }}
          </option>
        </select>
      </template>

      <div v-else class="task-card__permission-note">
        <AppIcon name="user" :size="14"/>
        Solo consulta
      </div>

      <RouterLink
        :to="{
          name: 'task-detail',
          params: { id: task.id },
        }"
        class="task-card__details"
      >

        Ver detalles

        <AppIcon name="arrow-right" :size="15"/>

      </RouterLink>

    </div>

  </article>
</template>

<style scoped>
.task-card {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 22px;

  padding: 17px;

  border: 1px solid var(--color-border);

  border-radius: var(--radius-lg);

  background: var(--color-surface);

  transition:
    border-color var(--transition-normal),
    transform var(--transition-normal),
    box-shadow var(--transition-normal);
}

.task-card:hover {
  transform: translateY(-2px);

  border-color: rgba(255, 48, 69, 0.35);

  box-shadow: var(--shadow-sm);
}

/* INFORMACIÓN */

.task-card__main {
  flex: 1;
  min-width: 0;
}

.task-card__heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 14px;
}

.task-card__identity {
  display: flex;
  flex-direction: column;

  gap: 5px;

  min-width: 0;
}

.task-card__id {
  color: var(--color-red-bright);

  font-size: 0.62rem;
  font-weight: 750;

  letter-spacing: 0.07em;
}

.task-card__title {
  color: var(--color-text);

  font-size: 0.92rem;
  font-weight: 750;

  text-decoration: none;
}

.task-card__title:hover {
  color: var(--color-red-bright);
}

.task-card__badges {
  display: flex;
  align-items: center;

  flex-wrap: wrap;

  gap: 7px;
}

.task-card__description {
  max-width: 750px;

  margin: 10px 0 13px;

  color: var(--color-text-secondary);

  font-size: 0.72rem;
  line-height: 1.6;
}

/* METADATOS */

.task-card__metadata {
  display: flex;
  align-items: center;

  flex-wrap: wrap;

  gap: 15px;
}

.task-card__metadata-item {
  display: inline-flex;
  align-items: center;

  gap: 6px;

  color: var(--color-text-muted);

  font-size: 0.66rem;

  text-decoration: none;
}

.task-card__metadata-item svg {
  flex-shrink: 0;

  color: var(--color-red-bright);
}

.task-card__project:hover {
  color: var(--color-red-bright);
}

.task-card__overdue {
  display: inline-flex;
  align-items: center;

  gap: 5px;

  color: #ff6877;

  font-size: 0.66rem;
  font-weight: 750;
}

/* CONTROLES */

.task-card__controls {
  width: 155px;

  display: flex;
  flex-direction: column;

  flex-shrink: 0;

  gap: 8px;
}

.task-card__controls label {
  color: var(--color-text-muted);

  font-size: 0.63rem;
  font-weight: 650;
}

.task-card__controls select {
  width: 100%;

  padding: 9px;

  border: 1px solid var(--color-border);

  border-radius: 8px;

  background: var(--color-surface);

  color: var(--color-text);

  font-family: inherit;

  font-size: 0.68rem;

  outline: none;
  cursor: pointer;
}

.task-card__controls select:focus {
  border-color: var(--color-red-bright);
}

.task-card__controls select option {
  background: #171719;
  color: #ffffff;
}

.task-card__details {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding-top: 5px;

  color: var(--color-red-bright);

  font-size: 0.68rem;
  font-weight: 700;

  text-decoration: none;
}

.task-card__details svg {
  transition: transform var(--transition-fast);
}

.task-card__details:hover svg {
  transform: translateX(4px);
}

/* RESPONSIVE */

@media (max-width: 850px) {
  .task-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .task-card__controls {
    width: 100%;

    display: grid;

    grid-template-columns: 1fr 1fr;
    align-items: center;
  }

  .task-card__controls label {
    grid-column: 1 / -1;
  }

  .task-card__details {
    justify-content: center;

    gap: 8px;
  }
}

@media (max-width: 520px) {
  .task-card__heading {
    flex-direction: column;
  }

  .task-card__metadata {
    align-items: flex-start;
    flex-direction: column;

    gap: 9px;
  }

  .task-card__controls {
    grid-template-columns: minmax(0, 1fr);
  }
}

.task-card__permission-note {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-muted);
  font-size: 0.64rem;
}
</style>
