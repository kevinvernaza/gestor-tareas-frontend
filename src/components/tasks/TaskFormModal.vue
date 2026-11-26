<script setup>
import { computed, reactive, ref, watch } from 'vue'

import AppIcon from '../ui/AppIcon.vue'

import { projects } from '../../data/projects'
import { askConfirmation, notify } from '../../data/uiFeedback'

import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  createTask,
  updateTask,
} from '../../data/tasks'

import {
  canCreateTask,
  canManageTask,
} from '../../data/auth'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  task: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'saved'])

function localDateString() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function dateAfterDays(amount) {
  const date = new Date()
  date.setDate(date.getDate() + amount)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function emptyForm() {
  return {
    title: '',
    description: '',
    projectId: '',
    status: 'Pendiente',
    priority: 'Media',
    responsibleName: '',
    dueDate: dateAfterDays(7),
  }
}

const form = reactive(emptyForm())
const errors = reactive({})
const formError = ref('')
const isSaving = ref(false)

const isEditing = computed(() => Boolean(props.task))

const availableProjects = computed(() =>
  projects.filter(project => {
    const isCurrentTaskProject = Boolean(
      isEditing.value && props.task?.projectId === project.id && canManageTask(props.task)
    )

    return canCreateTask(project) || isCurrentTaskProject
  })
)

const selectedProject = computed(() =>
  projects.find(project => project.id === form.projectId) || null
)

const availableMembers = computed(() =>
  selectedProject.value?.members || []
)

const minimumDueDate = computed(() => {
  const dates = [
    props.task?.createdAt || localDateString(),
    selectedProject.value?.startDate,
  ].filter(Boolean)

  return dates.sort().at(-1) || localDateString()
})

watch(
  () => form.projectId,
  () => {
    const project = selectedProject.value

    if (!project) {
      form.responsibleName = ''
      return
    }

    const currentMemberExists = project.members.some(
      member => member.name === form.responsibleName
    )

    if (!currentMemberExists) {
      form.responsibleName = project.members[0]?.name || ''
    }

    if (project.startDate && form.dueDate < project.startDate) {
      form.dueDate = project.startDate
    }

    if (project.dueDate && form.dueDate > project.dueDate) {
      form.dueDate = project.dueDate
    }
  }
)

function clearErrors() {
  Object.keys(errors).forEach(key => delete errors[key])
  formError.value = ''
}

function initializeForm() {
  clearErrors()

  if (props.task) {
    Object.assign(form, {
      title: props.task.title,
      description: props.task.description,
      projectId: props.task.projectId,
      status: props.task.status,
      priority: props.task.priority,
      responsibleName: props.task.responsibleName,
      dueDate: props.task.dueDate,
    })
  } else {
    Object.assign(form, emptyForm())
    const firstProject = availableProjects.value[0]
    if (firstProject) {
      form.projectId = firstProject.id
      form.responsibleName = firstProject.members[0]?.name || ''
      if (firstProject.startDate && form.dueDate < firstProject.startDate) {
        form.dueDate = firstProject.startDate
      }
      if (firstProject.dueDate && form.dueDate > firstProject.dueDate) {
        form.dueDate = firstProject.dueDate
      }
    }
  }
}

watch(
  () => [props.show, props.task],
  ([isOpen]) => {
    if (isOpen) initializeForm()
  },
  { immediate: true }
)

function validateForm() {
  clearErrors()

  if (props.task && !canManageTask(props.task)) {
    formError.value = 'Tu perfil no tiene permiso para editar esta tarea.'
    return false
  }

  if (!props.task && !canCreateTask(selectedProject.value)) {
    formError.value = 'Solo puedes crear tareas en proyectos que tienes a cargo.'
    return false
  }

  if (!form.title.trim()) errors.title = 'Escribe el título de la tarea.'
  else if (form.title.trim().length < 3) errors.title = 'Utiliza al menos 3 caracteres.'

  if (!form.description.trim()) errors.description = 'Escribe una descripción.'

  if (!form.projectId) errors.projectId = 'Selecciona el proyecto asociado.'
  if (!form.status) errors.status = 'Selecciona el estado.'
  if (!form.priority) errors.priority = 'Selecciona la prioridad.'
  if (!form.responsibleName) errors.responsibleName = 'Selecciona un responsable.'
  if (!form.dueDate) errors.dueDate = 'Selecciona la fecha límite.'

  const project = selectedProject.value

  if (project && project.status === 'Completado' && (!props.task || props.task.projectId !== project.id)) {
    errors.projectId = 'No puedes agregar tareas a un proyecto completado.'
  }

  if (project && form.dueDate) {
    const createdAt = props.task?.createdAt || localDateString()

    if (form.dueDate < createdAt) {
      errors.dueDate = 'La fecha límite no puede ser anterior a la fecha de creación.'
    }

    if (project.startDate && form.dueDate < project.startDate) {
      errors.dueDate = 'La fecha límite no puede ser anterior al inicio del proyecto.'
    }

    if (project.dueDate && form.dueDate > project.dueDate) {
      errors.dueDate = 'La fecha límite no puede superar la entrega del proyecto.'
    }

    const responsibleExists = project.members.some(
      member => member.name === form.responsibleName
    )

    if (form.responsibleName && !responsibleExists) {
      errors.responsibleName =
        'El responsable debe pertenecer al proyecto seleccionado.'
    }
  }

  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (isSaving.value || !validateForm()) return

  isSaving.value = true

  try {
    if (props.task && form.projectId !== props.task.projectId) {
      const accepted = await askConfirmation({
        title: 'Cambiar proyecto asociado',
        message: 'Esta tarea pasará a formar parte de otro proyecto. ¿Deseas continuar?',
        confirmText: 'Sí, cambiar proyecto',
        cancelText: 'Cancelar',
        tone: 'warning',
      })

      if (!accepted) return
    }

    if (form.status === 'Completada' && props.task?.status !== 'Completada') {
      const accepted = await askConfirmation({
        title: 'Completar tarea',
        message: `¿Confirmas que la tarea "${form.title.trim()}" ya fue terminada?`,
        confirmText: 'Sí, completar',
        cancelText: 'Seguir editando',
        tone: 'success',
      })

      if (!accepted) return
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
    }

    // Simula el tiempo de respuesta de la futura API REST.
    await new Promise(resolve => window.setTimeout(resolve, 450))

    const result = props.task
      ? updateTask(props.task.id, payload)
      : createTask(payload)

    if (!result.ok) {
      formError.value = result.message
      notify({
        type: 'error',
        title: 'No se pudo guardar la tarea',
        message: result.message,
      })
      return
    }

    emit('saved', result.task)
    emit('close')
  } catch (error) {
    console.error('Error al guardar tarea:', error)
    formError.value = 'Ocurrió un error inesperado. Revisa los datos e inténtalo nuevamente.'
    notify({
      type: 'error',
      title: 'Error al guardar',
      message: 'No fue posible completar el registro de la tarea.',
    })
  } finally {
    isSaving.value = false
  }
}

function closeModal() {
  if (isSaving.value) return
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="form-modal-backdrop"
      @click.self="closeModal"
      @keydown.esc="closeModal"
    >
      <section
        class="form-modal task-form-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
      >
        <header class="form-modal__header">
          <div class="form-modal__heading">
            <div class="form-modal__icon">
              <AppIcon :name="isEditing ? 'edit' : 'tasks'" :size="21" />
            </div>

            <div>
              <span class="form-modal__eyebrow">GESTIÓN DE ACTIVIDADES</span>
              <h2 id="task-form-title">
                {{ isEditing ? 'Editar tarea' : 'Crear nueva tarea' }}
              </h2>
              <p>
                {{
                  isEditing
                    ? 'Actualiza los datos y la asignación de esta tarea.'
                    : 'Registra una actividad y asígnala a un proyecto.'
                }}
              </p>
            </div>
          </div>

          <button
            type="button"
            class="form-modal__close"
            aria-label="Cerrar formulario"
            :disabled="isSaving"
            @click="closeModal"
          >
            <AppIcon name="x" :size="19" />
          </button>
        </header>

        <form
          class="form-modal__body"
          :class="{ 'is-saving': isSaving }"
          :aria-busy="isSaving"
          @submit.prevent="handleSubmit"
        >
          <div class="form-grid">
            <label class="form-field form-field--full">
              <span>Título de la tarea <b>*</b></span>
              <input
                v-model="form.title"
                type="text"
                maxlength="120"
                placeholder="Ej. Diseñar pantalla de inicio"
                required
              />
              <small v-if="errors.title" class="field-error">{{ errors.title }}</small>
            </label>

            <label class="form-field form-field--full">
              <span>Descripción <b>*</b></span>
              <textarea
                v-model="form.description"
                rows="3"
                maxlength="600"
                placeholder="Describe qué se debe realizar..."
                required
              ></textarea>
              <small v-if="errors.description" class="field-error">{{ errors.description }}</small>
            </label>

            <label class="form-field form-field--full">
              <span>Proyecto asociado <b>*</b></span>
              <select v-model="form.projectId" required>
                <option value="" disabled>Selecciona un proyecto</option>
                <option
                  v-for="project in availableProjects"
                  :key="project.id"
                  :value="project.id"
                >
                  {{ project.name }}{{ project.status === 'Completado' ? ' (completado)' : '' }}
                </option>
              </select>
              <small v-if="errors.projectId" class="field-error">{{ errors.projectId }}</small>
            </label>

            <label class="form-field">
              <span>Estado <b>*</b></span>
              <select v-model="form.status" required>
                <option v-for="status in TASK_STATUSES" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
              <small v-if="errors.status" class="field-error">{{ errors.status }}</small>
            </label>

            <label class="form-field">
              <span>Prioridad <b>*</b></span>
              <select v-model="form.priority" required>
                <option
                  v-for="priority in TASK_PRIORITIES"
                  :key="priority"
                  :value="priority"
                >
                  {{ priority }}
                </option>
              </select>
              <small v-if="errors.priority" class="field-error">{{ errors.priority }}</small>
            </label>

            <label class="form-field">
              <span>Responsable <b>*</b></span>
              <select
                v-model="form.responsibleName"
                :disabled="!selectedProject || !availableMembers.length"
                required
              >
                <option value="" disabled>Selecciona un integrante</option>
                <option
                  v-for="member in availableMembers"
                  :key="member.name"
                  :value="member.name"
                >
                  {{ member.name }}
                </option>
              </select>
              <small v-if="errors.responsibleName" class="field-error">
                {{ errors.responsibleName }}
              </small>
              <small v-else class="form-field__hint">
                Solo aparecen integrantes del proyecto seleccionado.
              </small>
            </label>

            <label class="form-field">
              <span>Fecha límite <b>*</b></span>
              <input
                v-model="form.dueDate"
                type="date"
                :min="minimumDueDate"
                :max="selectedProject?.dueDate || undefined"
                required
              />
              <small v-if="errors.dueDate" class="field-error">{{ errors.dueDate }}</small>
            </label>
          </div>

          <div v-if="selectedProject" class="task-project-context">
            <AppIcon name="folder" :size="17" />
            <span>
              Proyecto: <strong>{{ selectedProject.name }}</strong>
              · Entrega: {{ selectedProject.dueDate }}
            </span>
          </div>

          <div class="form-note">
            <AppIcon name="calendar" :size="15" />
            <span>
              Fecha de creación: {{ props.task?.createdAt || localDateString() }}.
              La fecha de creación se conserva al editar.
            </span>
          </div>

          <div v-if="formError" class="form-error-banner" role="alert">
            <AppIcon name="flag" :size="17" />
            {{ formError }}
          </div>

          <footer class="form-modal__footer">
            <button
              type="button"
              class="form-button form-button--secondary"
              :disabled="isSaving"
              @click="closeModal"
            >
              Cancelar
            </button>

            <button
              type="submit"
              class="form-button form-button--primary"
              :disabled="isSaving"
            >
              <span v-if="isSaving" class="form-button__spinner"></span>
              <AppIcon v-else :name="isEditing ? 'check' : 'plus'" :size="17" />
              {{
                isSaving
                  ? 'Guardando...'
                  : (isEditing ? 'Guardar cambios' : 'Crear tarea')
              }}
            </button>
          </footer>
        </form>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.form-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 300;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 22px;

  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
}

.form-modal {
  width: min(100%, 720px);
  max-height: min(92vh, 850px);
  overflow: hidden;

  display: flex;
  flex-direction: column;

  border: 1px solid rgba(255, 48, 69, 0.24);
  border-radius: 17px;

  background:
    radial-gradient(ellipse at 100% 0%, rgba(255, 48, 69, 0.09), transparent 40%),
    #111114;

  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.62), 0 0 30px rgba(255, 48, 69, 0.08);
}

.form-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;

  padding: 22px 24px;

  border-bottom: 1px solid var(--color-border);
}

.form-modal__heading {
  display: flex;
  align-items: center;
  gap: 14px;
}

.form-modal__icon {
  width: 46px;
  height: 46px;
  flex-shrink: 0;

  display: grid;
  place-items: center;

  border: 1px solid var(--color-border-red);
  border-radius: 12px;

  background: var(--color-red-soft);
  color: var(--color-red-bright);
}

.form-modal__eyebrow {
  color: var(--color-red-bright);
  font-size: 0.61rem;
  font-weight: 800;
  letter-spacing: 0.13em;
}

.form-modal__header h2 {
  margin: 4px 0;
  color: var(--color-text);
  font-size: 1.18rem;
  font-weight: 800;
}

.form-modal__header p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.7rem;
}

.form-modal__close {
  width: 35px;
  height: 35px;
  flex-shrink: 0;

  display: grid;
  place-items: center;

  border: 1px solid var(--color-border);
  border-radius: 9px;

  background: rgba(255, 255, 255, 0.035);
  color: var(--color-text-secondary);

  transition: all var(--transition-fast);
}

.form-modal__close:hover {
  border-color: var(--color-border-red);
  background: var(--color-red-soft);
  color: var(--color-red-bright);
}

.form-modal__body {
  overflow-y: auto;
  padding: 22px 24px 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.form-field {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-field--full {
  grid-column: 1 / -1;
}

.form-field > span {
  color: var(--color-text);
  font-size: 0.7rem;
  font-weight: 700;
}

.form-field b {
  color: var(--color-red-bright);
}

.form-field input,
.form-field textarea,
.form-field select {
  width: 100%;
  min-width: 0;

  padding: 11px 12px;

  border: 1px solid var(--color-border);
  border-radius: 9px;

  outline: none;

  background: #0b0b0e;
  color: var(--color-text);

  font-family: inherit;
  font-size: 0.73rem;

  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.form-field textarea {
  min-height: 86px;
  resize: vertical;
}

.form-field input:focus,
.form-field textarea:focus,
.form-field select:focus {
  border-color: var(--color-red-bright);
  box-shadow: 0 0 0 3px rgba(255, 48, 69, 0.09);
}

.form-field input::placeholder,
.form-field textarea::placeholder {
  color: var(--color-text-muted);
}

.form-field select option {
  background: #171719;
  color: #ffffff;
}

.form-field__hint {
  color: var(--color-text-muted);
  font-size: 0.62rem;
}

.field-error {
  color: #ff7583;
  font-size: 0.64rem;
  line-height: 1.4;
}

.task-project-context,
.form-note {
  display: flex;
  align-items: flex-start;
  gap: 9px;

  margin-top: 17px;
  padding: 11px 12px;

  border: 1px solid var(--color-border);
  border-radius: 9px;

  background: rgba(255, 255, 255, 0.025);
  color: var(--color-text-secondary);

  font-size: 0.66rem;
  line-height: 1.5;
}

.task-project-context svg,
.form-note svg {
  flex-shrink: 0;
  color: var(--color-red-bright);
}

.task-project-context strong {
  color: var(--color-text);
}

.form-error-banner {
  display: flex;
  align-items: flex-start;
  gap: 9px;

  margin-top: 17px;
  padding: 11px 12px;

  border: 1px solid rgba(255, 48, 69, 0.25);
  border-radius: 9px;

  background: rgba(255, 48, 69, 0.08);
  color: #ff7583;

  font-size: 0.68rem;
  line-height: 1.5;
}

.form-error-banner svg {
  flex-shrink: 0;
}

.form-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  margin-top: 22px;
  padding-top: 17px;

  border-top: 1px solid var(--color-border);
}

.form-button {
  min-height: 40px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 10px 15px;

  border: 1px solid transparent;
  border-radius: 9px;

  font-size: 0.7rem;
  font-weight: 750;

  transition: all var(--transition-fast);
}

.form-button--secondary {
  border-color: var(--color-border);
  background: rgba(255, 255, 255, 0.035);
  color: var(--color-text-secondary);
}

.form-button--secondary:hover {
  border-color: var(--color-border-hover);
  background: rgba(255, 255, 255, 0.07);
}

.form-button--primary {
  border-color: rgba(255, 48, 69, 0.5);
  background: linear-gradient(135deg, #d91f35, #ff3045);
  color: #ffffff;
  box-shadow: 0 5px 16px rgba(255, 48, 69, 0.18);
}

.form-button--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 7px 20px rgba(255, 48, 69, 0.28);
}

@media (max-width: 620px) {
  .form-modal-backdrop {
    align-items: flex-end;
    padding: 0;
  }

  .form-modal {
    width: 100%;
    max-height: 94vh;
    border-radius: 17px 17px 0 0;
  }

  .form-modal__header,
  .form-modal__body {
    padding-left: 17px;
    padding-right: 17px;
  }

  .form-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .form-modal__footer {
    position: sticky;
    bottom: 0;
    background: #111114;
  }
}

 .form-modal__body.is-saving .form-grid {
  pointer-events: none;
  opacity: 0.62;
}

.form-button:disabled,
.form-modal__close:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}

.form-button__spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: form-spin 650ms linear infinite;
}

@keyframes form-spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .form-modal *,
  .form-modal *::before,
  .form-modal *::after {
    transition: none !important;
  }
}
</style>
