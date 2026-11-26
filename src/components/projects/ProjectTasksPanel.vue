
<script setup>
import { computed } from 'vue'

import { RouterLink } from 'vue-router'

import { tasks, formatTaskDate, isTaskOverdue } from '../../data/tasks'
import { canViewTask } from '../../data/auth'

import AppIcon from '../ui/AppIcon.vue'
import FeedbackState from '../ui/FeedbackState.vue'

import TaskStatusBadge from '../tasks/TaskStatusBadge.vue'
import TaskPriorityBadge from '../tasks/TaskPriorityBadge.vue'

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
})

/*
=========================================
TAREAS DEL PROYECTO SELECCIONADO
=========================================
*/

const projectTasks = computed(() => {

  return tasks

    .filter(task => task.projectId === props.project.id && canViewTask(task))

    .map(task => ({

      ...task,

      dueDateLabel: formatTaskDate(task.dueDate),

      isOverdue: isTaskOverdue(task),

    }))

    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))

})

</script>

<template>
  <section class="project-tasks-panel">

    <!-- ENCABEZADO -->
    <header class="project-tasks-panel__header">

      <div>

        <div class="project-tasks-panel__title">

          <AppIcon name="tasks" :size="20"/>

          <h2>Tareas del proyecto</h2>

        </div>

        <p>
          Actividades asociadas a {{ project.name }}.
        </p>

      </div>

      <span class="project-tasks-panel__count">
        {{ projectTasks.length }} tareas
      </span>

    </header>

    <!-- LISTADO -->
    <div
      v-if="projectTasks.length"
      class="project-tasks-list"
    >

      <RouterLink
        v-for="task in projectTasks"
        :key="task.id"
        :to="{
          name: 'task-detail',
          params: { id: task.id },
        }"
        class="project-task-row"
      >

        <div class="project-task-row__main">

          <span class="project-task-row__id">
            {{ task.id }}
          </span>

          <strong>{{ task.title }}</strong>

          <span class="project-task-row__responsible">

            <AppIcon name="user" :size="13"/>

            {{ task.responsibleName }}

          </span>

        </div>

        <div class="project-task-row__right">

          <TaskPriorityBadge
            :priority="task.priority"
          />

          <TaskStatusBadge
            :status="task.status"
          />

          <span
            class="project-task-row__date"
            :class="{
              'project-task-row__date--overdue': task.isOverdue
            }"
          >

            <AppIcon name="calendar" :size="14"/>

            {{ task.dueDateLabel }}

          </span>

          <AppIcon
            name="chevron-right"
            :size="16"
            class="project-task-row__arrow"
          />

        </div>

      </RouterLink>

    </div>

    <!-- ESTADO VACÍO -->
    <FeedbackState
      v-else
      variant="empty"
      icon="tasks"
      title="No hay tareas disponibles"
      description="No hay actividades asociadas a este proyecto que puedas consultar con tu perfil actual."
    />

  </section>
</template>

<style scoped>
.project-tasks-panel {
  padding: 19px;

  border: 1px solid var(--color-border);

  border-radius: var(--radius-lg);

  background: var(--color-surface);
}

/* ENCABEZADO */

.project-tasks-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;

  margin-bottom: 17px;
}

.project-tasks-panel__title {
  display: flex;
  align-items: center;

  gap: 9px;
}

.project-tasks-panel__title svg {
  color: var(--color-red-bright);
}

.project-tasks-panel__title h2 {
  margin: 0;

  color: var(--color-text);

  font-size: 0.94rem;
  font-weight: 750;
}

.project-tasks-panel__header p {
  margin: 5px 0 0;

  color: var(--color-text-secondary);

  font-size: 0.69rem;
}

.project-tasks-panel__count {
  padding: 7px 10px;

  border: 1px solid var(--color-border);

  border-radius: 30px;

  color: var(--color-text-secondary);

  font-size: 0.67rem;
  font-weight: 650;

  white-space: nowrap;
}

/* LISTADO */

.project-tasks-list {
  display: flex;
  flex-direction: column;
}

.project-task-row {
  min-width: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;

  padding: 13px 5px;

  border-bottom: 1px solid rgba(255, 255, 255, 0.07);

  text-decoration: none;

  transition: background var(--transition-fast);
}

.project-task-row:last-child {
  border-bottom: 0;
}

.project-task-row:hover {
  background: rgba(255, 48, 69, 0.035);
}

.project-task-row__main {
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 5px;
}

.project-task-row__id {
  color: var(--color-red-bright);

  font-size: 0.59rem;
  font-weight: 750;
}

.project-task-row__main strong {
  color: var(--color-text);

  font-size: 0.75rem;
  font-weight: 700;
}

.project-task-row__responsible {
  display: flex;
  align-items: center;

  gap: 5px;

  color: var(--color-text-muted);

  font-size: 0.64rem;
}

.project-task-row__right {
  display: flex;
  align-items: center;

  flex-wrap: wrap;

  justify-content: flex-end;

  gap: 8px;
}

.project-task-row__date {
  display: flex;
  align-items: center;

  gap: 5px;

  color: var(--color-text-secondary);

  font-size: 0.63rem;

  white-space: nowrap;
}

.project-task-row__date--overdue {
  color: #ff6877;
}

.project-task-row__arrow {
  color: var(--color-red-bright);

  transition: transform var(--transition-fast);
}

.project-task-row:hover .project-task-row__arrow {
  transform: translateX(3px);
}

/* ESTADO VACÍO */

.project-tasks-empty {
  min-height: 170px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 9px;

  text-align: center;
}

.project-tasks-empty svg {
  color: var(--color-red-bright);
}

.project-tasks-empty strong {
  color: var(--color-text);

  font-size: 0.81rem;
}

.project-tasks-empty p {
  max-width: 350px;

  margin: 0;

  color: var(--color-text-muted);

  font-size: 0.68rem;
  line-height: 1.6;
}

/* RESPONSIVE */

@media (max-width: 800px) {
  .project-task-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .project-task-row__right {
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .project-tasks-panel {
    padding: 13px;
  }

  .project-tasks-panel__header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>

