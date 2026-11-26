
<script setup>
import { computed } from 'vue'

import AppIcon from '../ui/AppIcon.vue'
import FeedbackState from '../ui/FeedbackState.vue'

import {
  getTaskById,
  updateTaskStatus,
} from '../../data/tasks'

import { canChangeTaskStatus } from '../../data/auth'
import { askConfirmation, notify } from '../../data/uiFeedback'

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
})

const taskItems = computed(() => props.tasks)

const completedCount = computed(() =>
  taskItems.value.filter(task => task.completed).length
)

async function toggleTask(id) {
  const task = getTaskById(id)

  if (!task || !canChangeTaskStatus(task)) {
    notify({
      type: 'error',
      title: 'Acción no permitida',
      message: 'No tienes permiso para actualizar esta tarea.',
    })
    return
  }

  const nextStatus = task.status === 'Completada' ? 'Pendiente' : 'Completada'

  if (nextStatus === 'Completada') {
    const accepted = await askConfirmation({
      title: 'Completar tarea',
      message: `¿Confirmas que "${task.title}" ya está terminada?`,
      confirmText: 'Sí, completar',
      cancelText: 'Cancelar',
      tone: 'success',
    })

    if (!accepted) return
  }

  const result = updateTaskStatus(task.id, nextStatus)

  notify({
    type: result.ok ? 'success' : 'error',
    title: result.ok ? 'Tarea actualizada' : 'No se pudo actualizar',
    message: result.ok
      ? `La tarea "${task.title}" ahora está "${nextStatus}".`
      : result.message,
  })
}
</script>

<template>
  <section class="tasks-panel">

    <header class="tasks-header">

      <div class="tasks-title">
        <AppIcon name="calendar" :size="19" />

        <h2>Tareas próximas</h2>
      </div>

      <span class="tasks-count">
        {{ taskItems.length - completedCount }} pendientes
      </span>

    </header>

    <div v-if="taskItems.length" class="tasks-list">

      <article
        v-for="task in taskItems"
        :key="task.id"
        class="task-row"
        :class="{ 'task-row--completed': task.completed }"
      >

        <!-- CHECKBOX -->
        <button
          v-if="canChangeTaskStatus({ id: task.id, responsibleName: task.responsibleName, projectId: task.projectId })"
          type="button"
          class="task-checkbox"
          :class="{ 'is-checked': task.completed }"
          :aria-label="task.completed ? 'Marcar como pendiente' : 'Marcar como completada'"
          :aria-pressed="task.completed"
          @click="toggleTask(task.id)"
        >
          <svg
            v-if="task.completed"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            aria-hidden="true"
          >
            <path d="M5 12L10 17L19 7"/>
          </svg>
        </button>
        <span v-else class="task-checkbox task-checkbox--readonly" aria-hidden="true">
          <AppIcon name="clock" :size="13"/>
        </span>

        <!-- NOMBRE -->
        <span class="task-name">
          {{ task.title }}
        </span>

        <!-- PRIORIDAD -->
        <span
          class="task-priority"
          :class="`priority--${task.priority.toLowerCase()}`"
        >
          {{ task.priority }}
        </span>

        <!-- FECHA -->
        <span class="task-date">
          <AppIcon name="calendar" :size="14" />
          {{ task.dueDate }}
        </span>

      </article>

    </div>

    <FeedbackState
      v-else
      variant="empty"
      icon="calendar"
      title="No tienes tareas próximas"
      description="Las próximas actividades asignadas a tu perfil aparecerán aquí."
    />

  </section>
</template>

<style scoped>
.tasks-panel {
  min-width: 0;
  min-height: 165px;

  padding: 14px 15px;

  border: 1px solid var(--color-border);

  border-radius: var(--radius-lg);

  background: var(--color-surface);

  box-shadow: var(--shadow-sm);
}

/* ENCABEZADO */

.tasks-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 10px;

  margin-bottom: 12px;
}

.tasks-title {
  display: flex;
  align-items: center;

  gap: 9px;
}

.tasks-title svg {
  color: var(--color-red-bright);
}

.tasks-title h2 {
  margin: 0;

  color: var(--color-text);

  font-size: 0.91rem;
  font-weight: 750;
}

.tasks-count {
  color: var(--color-text-muted);

  font-size: 0.65rem;
}

/* LISTA */

.tasks-list {
  display: flex;
  flex-direction: column;
}

.task-row {
  min-height: 40px;

  display: grid;

  grid-template-columns: 20px minmax(0, 1fr) auto 76px;

  align-items: center;

  gap: 10px;

  padding: 6px 0;

  border-bottom: 1px solid rgba(255, 255, 255, 0.055);
}

.task-row:last-child {
  border-bottom: 0;
}

/* CHECKBOX */

.task-checkbox {
  width: 17px;
  height: 17px;

  display: grid;
  place-items: center;

  padding: 0;

  border: 1px solid rgba(255, 255, 255, 0.45);

  border-radius: 4px;

  background: transparent;

  color: white;

  transition:
    background var(--transition-fast),
    border-color var(--transition-fast);
}

.task-checkbox:hover {
  border-color: var(--color-red-bright);

  box-shadow: 0 0 8px var(--color-red-glow);
}

.task-checkbox.is-checked {
  border-color: var(--color-red);

  background: var(--color-red);
}

.task-checkbox svg {
  width: 12px;
  height: 12px;
}

/* NOMBRE */

.task-name {
  min-width: 0;

  overflow: hidden;

  color: var(--color-text);

  font-size: 0.72rem;
  font-weight: 500;

  white-space: nowrap;
  text-overflow: ellipsis;

  transition: color var(--transition-fast);
}

.task-row--completed .task-name {
  color: var(--color-text-muted);

  text-decoration: line-through;
}

/* PRIORIDADES */

.task-priority {
  min-width: 54px;

  padding: 4px 9px;

  border-radius: 30px;

  font-size: 0.64rem;
  font-weight: 700;

  text-align: center;
}

.priority--alta {
  color: #ff6877;

  background: rgba(255, 48, 69, 0.14);
}

.priority--media {
  color: #fbbf24;

  background: rgba(245, 158, 11, 0.12);
}

.priority--baja {
  color: #4ade80;

  background: rgba(34, 197, 94, 0.12);
}

/* FECHAS */

.task-date {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  gap: 6px;

  color: var(--color-text-secondary);

  font-size: 0.67rem;

  white-space: nowrap;
}

.task-date svg {
  color: var(--color-text-muted);
}

/* RESPONSIVE */

@media (max-width: 600px) {
  .task-row {
    grid-template-columns: 20px minmax(0, 1fr) auto;

    gap: 7px;
  }

  .task-date {
    grid-column: 2 / 3;
    justify-content: flex-start;
  }

  .task-priority {
    grid-column: 3;
    grid-row: 1;
  }
}

.task-checkbox--readonly {
  display: grid;
  place-items: center;
  color: var(--color-text-muted);
}
</style>
