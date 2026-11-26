
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'

import { projects } from '../data/projects'

import {
  tasks,
  TASK_PRIORITIES,
  TASK_STATUSES,
  formatTaskDate,
  isTaskOverdue,
  updateTaskStatus,
} from '../data/tasks'

import {
  canChangeTaskStatus,
  canCreateTask,
  canViewProject,
  canViewTask,
} from '../data/auth'

import AppIcon from '../components/ui/AppIcon.vue'
import SearchFilters from '../components/ui/SearchFilters.vue'
import TaskCard from '../components/tasks/TaskCard.vue'
import TaskFormModal from '../components/tasks/TaskFormModal.vue'
import FeedbackState from '../components/ui/FeedbackState.vue'
import { notify, askConfirmation } from '../data/uiFeedback'

const showTaskForm = ref(false)
const isLoading = ref(true)
let loadingTimer = null

onMounted(() => {
  // Simula la consulta inicial de tareas que posteriormente realizará el Backend.
  loadingTimer = window.setTimeout(() => {
    isLoading.value = false
  }, 350)
})

onUnmounted(() => {
  if (loadingTimer) window.clearTimeout(loadingTimer)
})

const filters = reactive({
  query: '',
  status: '',
  priority: '',
  projectId: '',
  responsibleName: '',
  dueDateFrom: '',
  dueDateTo: '',
})

const availableTasks = computed(() =>
  tasks.filter(task => canViewTask(task))
)

const availableProjects = computed(() =>
  projects.filter(project => canViewProject(project))
)

const invalidDueDateRange = computed(() =>
  Boolean(
    filters.dueDateFrom &&
    filters.dueDateTo &&
    filters.dueDateFrom > filters.dueDateTo
  )
)

/*
=========================================
PREPARAR TARJETAS VISIBLES
=========================================
*/

const taskCards = computed(() =>
  availableTasks.value
    .map(task => {
      const project = projects.find(item => item.id === task.projectId)

      return {
        ...task,
        projectName: project?.name || 'Proyecto no disponible',
        dueDateLabel: formatTaskDate(task.dueDate),
        isOverdue: isTaskOverdue(task),
        canChangeStatus: canChangeTaskStatus(task),
      }
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
)

const filteredTaskCards = computed(() => {
  if (invalidDueDateRange.value) return []

  const query = filters.query.trim().toLocaleLowerCase('es')

  return taskCards.value.filter(task => {
    const matchesQuery = !query || [
      task.id,
      task.title,
      task.description,
      task.projectName,
      task.responsibleName,
    ].some(value => String(value || '').toLocaleLowerCase('es').includes(query))

    const matchesStatus = !filters.status || task.status === filters.status
    const matchesPriority = !filters.priority || task.priority === filters.priority
    const matchesProject = !filters.projectId || task.projectId === filters.projectId
    const matchesResponsible =
      !filters.responsibleName || task.responsibleName === filters.responsibleName
    const matchesDueDateFrom = !filters.dueDateFrom || task.dueDate >= filters.dueDateFrom
    const matchesDueDateTo = !filters.dueDateTo || task.dueDate <= filters.dueDateTo

    return (
      matchesQuery &&
      matchesStatus &&
      matchesPriority &&
      matchesProject &&
      matchesResponsible &&
      matchesDueDateFrom &&
      matchesDueDateTo
    )
  })
})

function updateFilters(nextFilters) {
  Object.assign(filters, nextFilters)
}

function clearFilters() {
  Object.assign(filters, {
    query: '',
    status: '',
    priority: '',
    projectId: '',
    responsibleName: '',
    dueDateFrom: '',
    dueDateTo: '',
  })
}

/*
=========================================
FILTROS DISPONIBLES
=========================================
*/

const taskFilters = computed(() => {
  const responsibleNames = [
    ...new Set(availableTasks.value.map(task => task.responsibleName)),
  ].sort((a, b) => a.localeCompare(b, 'es'))

  return [
    {
      key: 'status',
      label: 'Estado',
      placeholder: 'Todos los estados',
      options: TASK_STATUSES.map(value => ({ value, label: value })),
    },
    {
      key: 'priority',
      label: 'Prioridad',
      placeholder: 'Todas las prioridades',
      options: TASK_PRIORITIES.map(value => ({ value, label: value })),
    },
    {
      key: 'projectId',
      label: 'Proyecto',
      placeholder: 'Todos los proyectos',
      options: availableProjects.value.map(project => ({
        value: project.id,
        label: project.name,
      })),
    },
    {
      key: 'responsibleName',
      label: 'Responsable',
      placeholder: 'Todos los responsables',
      options: responsibleNames.map(name => ({ value: name, label: name })),
    },
    {
      key: 'dueDateFrom',
      type: 'date',
      label: 'Vence desde',
      maxKey: 'dueDateTo',
    },
    {
      key: 'dueDateTo',
      type: 'date',
      label: 'Vence hasta',
      minKey: 'dueDateFrom',
    },
  ]
})

/*
=========================================
INDICADORES DEL PERFIL ACTUAL
=========================================
*/

const summaryCards = computed(() => [
  {
    id: 1,
    label: 'Tareas visibles',
    value: availableTasks.value.length,
    icon: 'tasks',
    tone: 'red',
  },
  {
    id: 2,
    label: 'Tareas pendientes',
    value: availableTasks.value.filter(task => task.status === 'Pendiente').length,
    icon: 'clock',
    tone: 'amber',
  },
  {
    id: 3,
    label: 'En progreso o revisión',
    value: availableTasks.value.filter(task =>
      ['En progreso', 'En revisión'].includes(task.status)
    ).length,
    icon: 'chart',
    tone: 'red',
  },
  {
    id: 4,
    label: 'Tareas vencidas',
    value: availableTasks.value.filter(task => isTaskOverdue(task)).length,
    icon: 'flag',
    tone: 'green',
  },
])

const completedCount = computed(() =>
  availableTasks.value.filter(task => task.status === 'Completada').length
)

/*
=========================================
MENSAJES Y ACCIONES
=========================================
*/

function handleTaskSaved(task) {
  notify({
    type: 'success',
    title: 'Tarea guardada',
    message: `La tarea "${task.title}" se guardó correctamente.`,
  })
}

async function handleStatusChange(payload) {
  const task = availableTasks.value.find(item => item.id === payload.taskId)

  if (!task || !canChangeTaskStatus(task)) {
    notify({
      type: 'error',
      title: 'Acción no permitida',
      message: 'Tu perfil no tiene permiso para cambiar esta tarea.',
    })
    return
  }

  if (task.status === payload.status) return

  if (payload.status === 'Completada') {
    const accepted = await askConfirmation({
      title: 'Completar tarea',
      message: `¿Confirmas que la tarea "${task.title}" ya fue terminada?`,
      confirmText: 'Sí, completar',
      cancelText: 'Seguir trabajando',
      tone: 'success',
    })

    if (!accepted) return
  }

  const result = updateTaskStatus(payload.taskId, payload.status)

  notify({
    type: result.ok ? 'success' : 'error',
    title: result.ok ? 'Estado actualizado' : 'No se pudo actualizar',
    message: result.ok
      ? `La tarea ${payload.taskId} ahora está "${result.task.status}".`
      : result.message,
  })
}
</script>

<template>
  <main class="tasks-page">

    <!-- =================================
         ENCABEZADO
    ================================== -->

    <header class="tasks-heading">

      <div class="tasks-heading__content">

        <span class="tasks-kicker">
          GESTIÓN DE ACTIVIDADES
        </span>

        <h1>
          Todas las <span>tareas</span>
        </h1>

        <p>
          Organiza actividades, asigna responsables y controla
          el cumplimiento de tus proyectos.
        </p>

      </div>

      <div class="tasks-heading__action">

        <button
          v-if="canCreateTask()"
          type="button"
          class="new-task-button"
          @click="showTaskForm = true"
        >
          <AppIcon name="plus" :size="18"/>
          Nueva tarea
        </button>

      </div>

    </header>


    <!-- =================================
         INDICADORES
    ================================== -->

    <section class="tasks-summary">

      <article
        v-for="item in summaryCards"
        :key="item.id"
        class="tasks-summary-card"
        :class="`tasks-summary-card--${item.tone}`"
      >

        <div class="tasks-summary-card__icon">

          <AppIcon
            :name="item.icon"
            :size="21"
          />

        </div>

        <div class="tasks-summary-card__information">

          <strong>{{ item.value }}</strong>

          <span>{{ item.label }}</span>

        </div>

      </article>

    </section>

    <!-- =================================
         LISTADO GENERAL
    ================================== -->

    <section class="tasks-section">

      <header class="tasks-section__header">

        <div>

          <h2>Tareas registradas</h2>

          <p>
            Consulta y actualiza el estado de las actividades.
          </p>

        </div>

        <div class="tasks-section__counters">

          <span>
            {{ filteredTaskCards.length }} de {{ availableTasks.length }} tareas
          </span>

          <span class="completed-counter">
            {{ completedCount }} completadas
          </span>

        </div>

      </header>

      <SearchFilters
        :model-value="filters"
        :filters="taskFilters"
        placeholder="Buscar por título, descripción, código, proyecto o responsable..."
        :result-count="filteredTaskCards.length"
        :total-count="availableTasks.length"
        @update:model-value="updateFilters"
        @clear="clearFilters"
      />

      <!-- ESTADO DE CARGA -->
      <FeedbackState
        v-if="isLoading"
        variant="loading"
        title="Cargando tareas"
        description="Estamos preparando las actividades disponibles para tu perfil."
      />

      <FeedbackState
        v-else-if="invalidDueDateRange"
        variant="error"
        icon="calendar"
        title="Rango de fechas no válido"
        description="La fecha inicial no puede ser posterior a la fecha final. Ajusta las fechas o limpia los filtros."
        action-label="Limpiar filtros"
        @action="clearFilters"
      />

      <!-- TARJETAS -->
      <div
        v-else-if="filteredTaskCards.length"
        class="tasks-list"
      >
        <TaskCard
          v-for="task in filteredTaskCards"
          :key="task.id"
          :task="task"
          :can-change-status="task.canChangeStatus"
          @status-change="handleStatusChange"
        />
      </div>

      <!-- ESTADO VACÍO -->
      <FeedbackState
        v-else
        variant="empty"
        :icon="availableTasks.length ? 'search' : 'tasks'"
        :title="availableTasks.length ? 'No encontramos tareas' : 'No tienes tareas asignadas'"
        :description="availableTasks.length
          ? 'No hay tareas que coincidan con tu búsqueda o con los filtros seleccionados.'
          : 'Cuando te asignen actividades, aparecerán en este listado.'"
        :action-label="availableTasks.length ? 'Limpiar búsqueda y filtros' : ''"
        @action="clearFilters"
      />

      <!-- INFORMACIÓN -->
      <div class="tasks-information">

        <AppIcon name="check" :size="16"/>

        <p>
          Puedes combinar búsqueda, estado, prioridad, proyecto y responsable.
          Las acciones disponibles dependen del perfil activo.
        </p>

      </div>

    </section>

    <TaskFormModal
      v-if="canCreateTask()"
      :show="showTaskForm"
      @close="showTaskForm = false"
      @saved="handleTaskSaved"
    />

  </main>
</template>

<style scoped>
/* =====================================
   CONTENEDOR PRINCIPAL
===================================== */

.tasks-page {
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 22px;
}

/* =====================================
   ENCABEZADO
===================================== */

.tasks-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;
}

.tasks-heading__content {
  min-width: 0;
}

.tasks-kicker {
  color: var(--color-red-bright);

  font-size: 0.68rem;
  font-weight: 800;

  letter-spacing: 0.15em;
}

.tasks-heading h1 {
  margin: 6px 0 4px;

  color: var(--color-text);

  font-size: clamp(1.8rem, 3vw, 2.3rem);

  font-weight: 800;

  letter-spacing: -0.06em;
}

.tasks-heading h1 span {
  color: var(--color-red-bright);
}

.tasks-heading p {
  max-width: 650px;

  margin: 0;

  color: var(--color-text-secondary);

  font-size: 0.81rem;
  line-height: 1.6;
}

/* BOTÓN */

.tasks-heading__action {
  display: flex;
  flex-direction: column;

  align-items: flex-end;

  gap: 6px;
}

.new-task-button {
  display: flex;
  align-items: center;

  gap: 8px;

  padding: 11px 15px;

  border: 1px solid rgba(255, 48, 69, 0.3);

  border-radius: 9px;

  background: var(--color-red-soft);

  color: var(--color-red-bright);

  font-family: inherit;

  font-size: 0.76rem;
  font-weight: 700;

  opacity: 1;

  cursor: pointer;

  transition: all var(--transition-fast);
}

.tasks-heading__action > span {
  color: var(--color-text-muted);

  font-size: 0.62rem;
}

.new-task-button:hover {
  border-color: var(--color-border-red);
  background: rgba(255, 48, 69, 0.18);
  box-shadow: 0 0 16px rgba(255, 48, 69, 0.08);
}


/* =====================================
   INDICADORES
===================================== */

.tasks-summary {
  display: grid;

  grid-template-columns: repeat(4, minmax(0, 1fr));

  gap: 12px;
}

.tasks-summary-card {
  min-width: 0;
  min-height: 91px;

  display: flex;
  align-items: center;

  gap: 13px;

  padding: 15px;

  border: 1px solid var(--color-border);

  border-radius: var(--radius-lg);

  background: var(--color-surface);

  transition:
    transform var(--transition-normal),
    border-color var(--transition-normal);
}

.tasks-summary-card:hover {
  transform: translateY(-2px);

  border-color: var(--color-border-hover);
}

.tasks-summary-card__icon {
  width: 43px;
  height: 43px;

  display: grid;
  place-items: center;

  flex-shrink: 0;

  border: 1px solid currentColor;

  border-radius: 11px;
}

.tasks-summary-card__information {
  display: flex;
  flex-direction: column;

  gap: 4px;

  min-width: 0;
}

.tasks-summary-card__information strong {
  color: var(--color-text);

  font-size: 1.5rem;
  font-weight: 800;

  line-height: 1.1;
}

.tasks-summary-card__information span {
  color: var(--color-text-secondary);

  font-size: 0.68rem;
  font-weight: 550;
}

/* COLORES */

.tasks-summary-card--red {
  color: var(--color-red-bright);
}

.tasks-summary-card--red .tasks-summary-card__icon {
  background: var(--color-red-soft);
}

.tasks-summary-card--amber {
  color: var(--color-warning);
}

.tasks-summary-card--amber .tasks-summary-card__icon {
  background: var(--color-warning-soft);
}

.tasks-summary-card--green {
  color: var(--color-success);
}

.tasks-summary-card--green .tasks-summary-card__icon {
  background: var(--color-success-soft);
}

/* =====================================
   LISTADO
===================================== */

.tasks-section {
  display: flex;
  flex-direction: column;

  gap: 15px;
}

.tasks-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;
}

.tasks-section__header h2 {
  margin: 0 0 4px;

  color: var(--color-text);

  font-size: 1.02rem;
  font-weight: 750;
}

.tasks-section__header p {
  margin: 0;

  color: var(--color-text-secondary);

  font-size: 0.73rem;
}

.tasks-section__counters {
  display: flex;
  align-items: center;

  flex-wrap: wrap;

  gap: 8px;
}

.tasks-section__counters span {
  padding: 7px 10px;

  border: 1px solid var(--color-border);

  border-radius: 30px;

  color: var(--color-text-secondary);

  font-size: 0.66rem;
  font-weight: 650;

  white-space: nowrap;
}

.tasks-section__counters .completed-counter {
  border-color: rgba(34, 197, 94, 0.20);

  background: rgba(34, 197, 94, 0.07);

  color: #4ade80;
}

/* TARJETAS */

.tasks-list {
  display: flex;
  flex-direction: column;

  gap: 12px;
}

/* INFORMACIÓN */

.tasks-information {
  display: flex;
  align-items: flex-start;

  gap: 9px;

  padding: 12px 14px;

  border: 1px solid var(--color-border);

  border-radius: 9px;

  background: rgba(255, 255, 255, 0.018);
}

.tasks-information svg {
  flex-shrink: 0;

  color: var(--color-success);
}

.tasks-information p {
  margin: 0;

  color: var(--color-text-muted);

  font-size: 0.68rem;
  line-height: 1.6;
}


/* =====================================
   RESPONSIVE
===================================== */

@media (max-width: 1050px) {
  .tasks-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 650px) {
  .tasks-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .tasks-heading__action {
    align-items: flex-start;
  }

  .tasks-section__header {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 420px) {
  .tasks-summary {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
