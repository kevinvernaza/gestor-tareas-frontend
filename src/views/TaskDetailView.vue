
<script setup>
import { computed, ref } from 'vue'

import { useRoute, RouterLink } from 'vue-router'

import { projects } from '../data/projects'
import { canViewTask, canChangeTaskStatus, canManageTask, canAssignTask } from '../data/auth'

import {
  tasks,
  TASK_STATUSES,
  getTaskById,
  formatTaskDate,
  isTaskOverdue,
  updateTaskStatus,
  assignTask,
} from '../data/tasks'

import AppIcon from '../components/ui/AppIcon.vue'

import TaskStatusBadge from '../components/tasks/TaskStatusBadge.vue'
import TaskPriorityBadge from '../components/tasks/TaskPriorityBadge.vue'
import TaskFormModal from '../components/tasks/TaskFormModal.vue'
import { askConfirmation, notify } from '../data/uiFeedback'

/*
=========================================
OBTENER IDENTIFICADOR DE LA RUTA
=========================================
*/

const route = useRoute()

/*
=========================================
BUSCAR TAREA Y PROYECTO
=========================================
*/

const task = computed(() => {
  const found = getTaskById(route.params.id)

  return found && canViewTask(found) ? found : null
})

const canUpdateStatus = computed(() =>
  Boolean(task.value && canChangeTaskStatus(task.value))
)

const canEditCurrentTask = computed(() =>
  Boolean(task.value && canManageTask(task.value))
)

const canAssignCurrentTask = computed(() =>
  Boolean(task.value && canAssignTask(task.value))
)

const project = computed(() => {

  if (!task.value) return null

  return projects.find(
    item => item.id === task.value.projectId
  ) || null

})

/*
=========================================
FECHAS
=========================================
*/

const createdDate = computed(() => {

  return task.value
    ? formatTaskDate(task.value.createdAt)
    : ''

})

const dueDate = computed(() => {

  return task.value
    ? formatTaskDate(task.value.dueDate)
    : ''

})

const overdue = computed(() => {

  return task.value
    ? isTaskOverdue(task.value)
    : false

})

/*
=========================================
MENSAJES DE CONFIRMACIÓN
=========================================
*/

const feedback = ref({
  type: '',
  message: '',
})

const showTaskForm = ref(false)

function handleTaskSaved(savedTask) {
  feedback.value = {
    type: 'success',
    message: `La tarea "${savedTask.title}" se actualizó correctamente.`,
  }

  notify({
    type: 'success',
    title: 'Tarea actualizada',
    message: `Se guardaron los cambios de "${savedTask.title}".`,
  })
}

/*
=========================================
CAMBIAR ESTADO
=========================================
*/

async function handleStatusChange(event) {
  const nextStatus = event.target.value

  if (!task.value || !canChangeTaskStatus(task.value)) {
    event.target.value = task.value?.status || ''
    notify({
      type: 'error',
      title: 'Acción no permitida',
      message: 'Tu perfil no tiene permiso para cambiar el estado de esta tarea.',
    })
    return
  }

  if (nextStatus === task.value.status) return

  // La selección vuelve al valor anterior hasta que se confirme el cambio.
  event.target.value = task.value.status

  if (nextStatus === 'Completada') {
    const accepted = await askConfirmation({
      title: 'Completar tarea',
      message: `¿Confirmas que la tarea "${task.value.title}" ya fue terminada?`,
      confirmText: 'Sí, completar',
      cancelText: 'Cancelar',
      tone: 'success',
    })

    if (!accepted) return
  }

  const result = updateTaskStatus(task.value.id, nextStatus)

  feedback.value = {
    type: result.ok ? 'success' : 'error',
    message: result.ok
      ? 'El estado de la tarea se actualizó correctamente.'
      : result.message,
  }

  notify({
    type: result.ok ? 'success' : 'error',
    title: result.ok ? 'Estado actualizado' : 'No se pudo actualizar',
    message: result.ok
      ? `La tarea ahora está "${result.task.status}".`
      : result.message,
  })
}

/*
=========================================
CAMBIAR RESPONSABLE
=========================================
*/

async function handleAssigneeChange(event) {
  const nextResponsible = event.target.value

  if (!task.value || !canAssignTask(task.value)) {
    event.target.value = task.value?.responsibleName || ''
    notify({
      type: 'error',
      title: 'Acción no permitida',
      message: 'Tu perfil no tiene permiso para reasignar esta tarea.',
    })
    return
  }

  if (nextResponsible === task.value.responsibleName) return

  event.target.value = task.value.responsibleName

  const accepted = await askConfirmation({
    title: 'Reasignar tarea',
    message: `¿Deseas asignar "${task.value.title}" a ${nextResponsible}?`,
    confirmText: 'Sí, reasignar',
    cancelText: 'Cancelar',
    tone: 'warning',
  })

  if (!accepted) return

  const result = assignTask(task.value.id, nextResponsible)

  feedback.value = {
    type: result.ok ? 'success' : 'error',
    message: result.ok
      ? 'El responsable de la tarea se actualizó correctamente.'
      : result.message,
  }

  notify({
    type: result.ok ? 'success' : 'error',
    title: result.ok ? 'Responsable actualizado' : 'No se pudo reasignar',
    message: result.ok
      ? `La tarea fue asignada a ${nextResponsible}.`
      : result.message,
  })
}
</script>

<template>
  <main
    v-if="task && project"
    class="task-detail-page"
  >

    <!-- =================================
         NAVEGACIÓN
    ================================== -->

    <nav class="task-detail-breadcrumb">

      <RouterLink to="/tareas">

        <AppIcon name="arrow-left" :size="16"/>

        Volver a tareas

      </RouterLink>

      <AppIcon
        name="chevron-right"
        :size="14"
      />

      <span>{{ task.id }}</span>

    </nav>

    <!-- =================================
         ENCABEZADO
    ================================== -->

    <header class="task-detail-hero">

      <div class="task-detail-hero__main">

        <span class="task-detail-id">
          {{ task.id }}
        </span>

        <h1>{{ task.title }}</h1>

        <p>
          {{ task.description }}
        </p>

        <div class="task-detail-badges">

          <TaskStatusBadge
            :status="task.status"
          />

          <TaskPriorityBadge
            :priority="task.priority"
          />

          <span
            v-if="overdue"
            class="task-detail-overdue"
          >
            <AppIcon name="clock" :size="14"/>
            Vencida
          </span>

        </div>

      </div>

      <div class="task-detail-hero__actions">
        <button
          v-if="canEditCurrentTask"
          type="button"
          class="task-detail-edit-button"
          @click="showTaskForm = true"
        >
          <AppIcon name="edit" :size="16"/>
          Editar tarea
        </button>

        <div class="task-detail-icon">
          <AppIcon name="tasks" :size="31"/>
        </div>
      </div>

    </header>

    <!-- =================================
         CONTENIDO
    ================================== -->

    <section class="task-detail-grid">

      <!-- INFORMACIÓN Y CONTROLES -->
      <article class="task-detail-panel">

        <header class="task-detail-panel__heading">

          <AppIcon name="settings" :size="19"/>

          <h2>Administración de la tarea</h2>

        </header>

        <p class="task-detail-panel__description">
          Modifica el estado y el responsable de esta actividad.
        </p>

        <!-- ESTADO -->
        <div class="task-control">
          <label for="task-status">Estado de la tarea</label>

          <select
            v-if="canUpdateStatus"
            id="task-status"
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

          <div v-else class="task-readonly-value">
            <TaskStatusBadge :status="task.status"/>
            <span>Tu perfil puede consultar esta tarea, pero no modificar su estado.</span>
          </div>

          <span v-if="canUpdateStatus">
            El cambio se refleja automáticamente en el listado.
          </span>
        </div>

        <!-- RESPONSABLE -->
        <div class="task-control">
          <label for="task-responsible">Responsable asignado</label>

          <select
            v-if="canAssignCurrentTask"
            id="task-responsible"
            :value="task.responsibleName"
            @change="handleAssigneeChange"
          >
            <option
              v-for="member in project.members"
              :key="member.initials"
              :value="member.name"
            >
              {{ member.name }}
            </option>
          </select>

          <div v-else class="task-readonly-value">
            <strong>{{ task.responsibleName }}</strong>
            <span>La asignación solo puede modificarla un administrador o el coordinador del proyecto.</span>
          </div>

          <span v-if="canAssignCurrentTask">
            Solamente puedes asignar integrantes pertenecientes a {{ project.name }}.
          </span>
        </div>

        <!-- CONFIRMACIÓN -->
        <div
          v-if="feedback.message"
          class="task-detail-feedback"
          :class="`task-detail-feedback--${feedback.type}`"
          role="status"
          aria-live="polite"
        >

          <AppIcon
            :name="feedback.type === 'success' ? 'check' : 'flag'"
            :size="17"
          />

          {{ feedback.message }}

        </div>

      </article>

      <!-- INFORMACIÓN GENERAL -->
      <aside class="task-detail-panel">

        <header class="task-detail-panel__heading">

          <AppIcon name="briefcase" :size="19"/>

          <h2>Información general</h2>

        </header>

        <div class="task-general-information">

          <div class="task-general-row">

            <span>Proyecto asociado</span>

            <RouterLink
              :to="{
                name: 'project-detail',
                params: { id: project.id },
              }"
            >
              {{ project.name }}
            </RouterLink>

          </div>

          <div class="task-general-row">

            <span>Identificador</span>

            <strong>{{ task.id }}</strong>

          </div>

          <div class="task-general-row">

            <span>Prioridad</span>

            <TaskPriorityBadge
              :priority="task.priority"
            />

          </div>

          <div class="task-general-row">

            <span>Fecha de creación</span>

            <strong>{{ createdDate }}</strong>

          </div>

          <div class="task-general-row">

            <span>Fecha límite</span>

            <strong
              :class="{
                'task-deadline-overdue': overdue
              }"
            >
              {{ dueDate }}
            </strong>

          </div>

          <div class="task-general-row">

            <span>Última actualización</span>

            <strong>
              {{ formatTaskDate(task.updatedAt) }}
            </strong>

          </div>

          <div
            v-if="task.completedAt"
            class="task-general-row"
          >

            <span>Fecha de finalización</span>

            <strong>
              {{ formatTaskDate(task.completedAt) }}
            </strong>

          </div>

        </div>

      </aside>

    </section>

    <!-- =================================
         INFORMACIÓN DEL PROYECTO
    ================================== -->

    <section class="task-related-project">

      <div class="task-related-project__icon">

        <AppIcon
          :name="project.icon"
          :size="23"
        />

      </div>

      <div class="task-related-project__information">

        <span>PERTENECE AL PROYECTO</span>

        <strong>{{ project.name }}</strong>

        <p>
          Responsable general: {{ project.owner }}
        </p>

      </div>

      <RouterLink
        :to="{
          name: 'project-detail',
          params: { id: project.id },
        }"
        class="task-related-project__link"
      >

        Ver proyecto

        <AppIcon name="arrow-right" :size="16"/>

      </RouterLink>

    </section>

    <TaskFormModal
      v-if="canEditCurrentTask"
      :show="showTaskForm"
      :task="task"
      @close="showTaskForm = false"
      @saved="handleTaskSaved"
    />

  </main>

  <!-- =================================
       TAREA NO ENCONTRADA
  ================================== -->

  <section
    v-else
    class="task-not-found"
  >

    <AppIcon name="tasks" :size="35"/>

    <h1>Tarea no encontrada</h1>

    <p>
      La tarea no existe o tu perfil no tiene permiso para consultarla.
    </p>

    <RouterLink to="/tareas">
      <AppIcon name="arrow-left" :size="16"/>
      Volver a tareas
    </RouterLink>

  </section>
</template>

<style scoped>
/* =====================================
   CONTENEDOR
===================================== */

.task-detail-page {
  display: flex;
  flex-direction: column;

  gap: 20px;
}

/* =====================================
   NAVEGACIÓN
===================================== */

.task-detail-breadcrumb {
  display: flex;
  align-items: center;

  gap: 9px;

  color: var(--color-text-muted);

  font-size: 0.71rem;
}

.task-detail-breadcrumb a {
  display: flex;
  align-items: center;

  gap: 7px;

  color: var(--color-red-bright);

  font-weight: 650;

  text-decoration: none;
}

/* =====================================
   ENCABEZADO
===================================== */

.task-detail-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  padding: 23px;

  border: 1px solid var(--color-border);

  border-radius: var(--radius-lg);

  background:
    radial-gradient(
      ellipse at 0% 0%,
      rgba(255, 48, 69, 0.10),
      transparent 60%
    ),
    var(--color-surface);
}

.task-detail-hero__main {
  min-width: 0;
}

.task-detail-id {
  color: var(--color-red-bright);

  font-size: 0.66rem;
  font-weight: 800;

  letter-spacing: 0.12em;
}

.task-detail-hero h1 {
  margin: 7px 0;

  color: var(--color-text);

  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;

  letter-spacing: -0.04em;
}

.task-detail-hero p {
  max-width: 750px;

  margin: 0;

  color: var(--color-text-secondary);

  font-size: 0.77rem;
  line-height: 1.7;
}

.task-detail-badges {
  display: flex;
  align-items: center;

  flex-wrap: wrap;

  gap: 9px;

  margin-top: 15px;
}

.task-detail-overdue {
  display: inline-flex;
  align-items: center;

  gap: 6px;

  padding: 6px 10px;

  border-radius: 30px;

  background: rgba(255, 48, 69, 0.12);

  color: #ff6877;

  font-size: 0.66rem;
  font-weight: 750;
}

.task-detail-icon {
  width: 65px;
  height: 65px;

  display: grid;
  place-items: center;

  flex-shrink: 0;

  border: 1px solid var(--color-border-red);

  border-radius: 15px;

  background: var(--color-red-soft);

  color: var(--color-red-bright);

  box-shadow: var(--shadow-red);
}

.task-detail-hero__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.task-detail-edit-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 10px 13px;

  border: 1px solid var(--color-border-red);
  border-radius: 9px;

  background: var(--color-red-soft);
  color: var(--color-red-bright);

  font-size: 0.7rem;
  font-weight: 700;

  transition: all var(--transition-fast);
}

.task-detail-edit-button:hover {
  background: rgba(255, 48, 69, 0.18);
  box-shadow: 0 0 16px rgba(255, 48, 69, 0.08);
}

/* =====================================
   PANELES
===================================== */

.task-detail-grid {
  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    minmax(0, 1fr);

  gap: 15px;
}

.task-detail-panel {
  min-width: 0;

  padding: 20px;

  border: 1px solid var(--color-border);

  border-radius: var(--radius-lg);

  background: var(--color-surface);
}

.task-detail-panel__heading {
  display: flex;
  align-items: center;

  gap: 9px;
}

.task-detail-panel__heading svg {
  color: var(--color-red-bright);
}

.task-detail-panel__heading h2 {
  margin: 0;

  color: var(--color-text);

  font-size: 0.93rem;
  font-weight: 750;
}

.task-detail-panel__description {
  margin: 9px 0 20px;

  color: var(--color-text-secondary);

  font-size: 0.7rem;
  line-height: 1.6;
}

/* =====================================
   CONTROLES
===================================== */

.task-control {
  display: flex;
  flex-direction: column;

  gap: 8px;

  margin-bottom: 19px;
}

.task-control:last-of-type {
  margin-bottom: 0;
}

.task-control label {
  color: var(--color-text);

  font-size: 0.72rem;
  font-weight: 700;
}

.task-control select {
  width: 100%;

  padding: 11px 12px;

  border: 1px solid var(--color-border);

  border-radius: 9px;

  background: var(--color-background);

  color: var(--color-text);

  font-family: inherit;

  font-size: 0.73rem;

  outline: none;
}

.task-control select:focus {
  border-color: var(--color-red-bright);
}

.task-control select option {
  background: #171719;
  color: #ffffff;
}

.task-control > span {
  color: var(--color-text-muted);

  font-size: 0.64rem;
  line-height: 1.5;
}

.task-readonly-value {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 7px;
  min-height: 38px;
  padding: 5px 0;
}

.task-readonly-value > strong {
  color: var(--color-text);
  font-size: 0.73rem;
}

.task-readonly-value > span {
  color: var(--color-text-muted);
  font-size: 0.63rem;
  line-height: 1.5;
}

/* MENSAJES */

.task-detail-feedback {
  display: flex;
  align-items: center;

  gap: 8px;

  margin-top: 17px;

  padding: 11px;

  border: 1px solid transparent;

  border-radius: 8px;

  font-size: 0.69rem;
  line-height: 1.5;
}

.task-detail-feedback--success {
  border-color: rgba(34, 197, 94, 0.22);

  background: rgba(34, 197, 94, 0.07);

  color: #4ade80;
}

.task-detail-feedback--error {
  border-color: rgba(255, 48, 69, 0.25);

  background: rgba(255, 48, 69, 0.08);

  color: #ff6877;
}

/* =====================================
   INFORMACIÓN GENERAL
===================================== */

.task-general-information {
  display: flex;
  flex-direction: column;

  margin-top: 15px;
}

.task-general-row {
  min-height: 48px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 12px;

  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.task-general-row:last-child {
  border-bottom: 0;
}

.task-general-row > span {
  color: var(--color-text-muted);

  font-size: 0.68rem;
}

.task-general-row > strong {
  color: var(--color-text);

  font-size: 0.69rem;
  font-weight: 650;

  text-align: right;
}

.task-general-row > a {
  max-width: 65%;

  overflow: hidden;

  color: var(--color-red-bright);

  font-size: 0.68rem;
  font-weight: 700;

  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;

  text-decoration: none;
}

.task-deadline-overdue {
  color: #ff6877 !important;
}

/* =====================================
   PROYECTO RELACIONADO
===================================== */

.task-related-project {
  display: flex;
  align-items: center;

  gap: 14px;

  padding: 16px;

  border: 1px solid var(--color-border);

  border-radius: var(--radius-lg);

  background: var(--color-surface);
}

.task-related-project__icon {
  width: 45px;
  height: 45px;

  display: grid;
  place-items: center;

  flex-shrink: 0;

  border: 1px solid var(--color-border-red);

  border-radius: 11px;

  background: var(--color-red-soft);

  color: var(--color-red-bright);
}

.task-related-project__information {
  display: flex;
  flex-direction: column;

  gap: 4px;

  min-width: 0;
}

.task-related-project__information > span {
  color: var(--color-red-bright);

  font-size: 0.59rem;
  font-weight: 800;

  letter-spacing: 0.1em;
}

.task-related-project__information strong {
  color: var(--color-text);

  font-size: 0.78rem;
}

.task-related-project__information p {
  margin: 0;

  color: var(--color-text-muted);

  font-size: 0.65rem;
}

.task-related-project__link {
  display: flex;
  align-items: center;

  gap: 7px;

  margin-left: auto;

  color: var(--color-red-bright);

  font-size: 0.7rem;
  font-weight: 700;

  text-decoration: none;

  white-space: nowrap;
}

/* =====================================
   NO ENCONTRADA
===================================== */

.task-not-found {
  min-height: 400px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: 25px;

  border: 1px solid var(--color-border);

  border-radius: var(--radius-lg);

  background: var(--color-surface);

  text-align: center;
}

.task-not-found > svg {
  color: var(--color-red-bright);
}

.task-not-found h1 {
  color: var(--color-text);

  font-size: 1.4rem;
}

.task-not-found p {
  color: var(--color-text-secondary);

  font-size: 0.76rem;
}

.task-not-found a {
  display: flex;
  align-items: center;

  gap: 8px;

  color: var(--color-red-bright);

  font-size: 0.75rem;
  font-weight: 700;

  text-decoration: none;
}

/* =====================================
   RESPONSIVE
===================================== */

@media (max-width: 850px) {
  .task-detail-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 520px) {
  .task-detail-hero {
    align-items: flex-start;
  }

  .task-detail-hero__actions {
    align-items: flex-end;
    flex-direction: column-reverse;
  }

  .task-detail-icon {
    width: 48px;
    height: 48px;
  }

  .task-detail-icon svg {
    width: 23px;
    height: 23px;
  }

  .task-related-project {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .task-related-project__link {
    width: 100%;
    margin-left: 59px;
  }

  .task-detail-panel {
    padding: 15px;
  }
}
</style>
