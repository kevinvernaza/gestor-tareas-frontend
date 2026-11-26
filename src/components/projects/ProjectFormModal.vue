<script setup>
import { computed, reactive, ref, watch } from 'vue'

import AppIcon from '../ui/AppIcon.vue'

import {
  PROJECT_ICONS,
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
  createProject,
  getProjectTeamMembers,
  updateProject,
} from '../../data/projects'

import {
  tasks,
  validateProjectCompletion,
  synchronizeProjectStatus,
} from '../../data/tasks'
import { askConfirmation, notify } from '../../data/uiFeedback'
import {
  currentUser,
  isCoordinator,
  canCreateProject,
  canManageProject,
} from '../../data/auth'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  project: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'saved'])

const today = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const addDays = (dateValue, amount) => {
  const [year, month, day] = dateValue.split('-').map(Number)
  const date = new Date(year, month - 1, day, 12)
  date.setDate(date.getDate() + amount)

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}

const createEmptyForm = () => ({
  name: '',
  description: '',
  category: '',
  status: 'Planificación',
  priority: 'Media',
  startDate: today(),
  dueDate: addDays(today(), 30),
  owner: '',
  memberNames: [],
  icon: 'code',
})

const form = reactive(createEmptyForm())
const errors = reactive({})
const formError = ref('')
const isSaving = ref(false)

const isEditing = computed(() => Boolean(props.project))

const teamMembers = computed(() => getProjectTeamMembers())

const selectedOwnerOptions = computed(() => {
  const selected = teamMembers.value.filter(member =>
    form.memberNames.includes(member.name)
  )

  if (isCoordinator()) {
    return selected.filter(member => member.name === currentUser.value.name)
  }

  return selected
})

const relatedTasks = computed(() => {
  if (!props.project) return []

  return tasks.filter(task => task.projectId === props.project.id)
})

const lockedMemberNames = computed(() =>
  [...new Set(relatedTasks.value.map(task => task.responsibleName))]
)

function clearErrors() {
  Object.keys(errors).forEach(key => delete errors[key])
  formError.value = ''
}

function initializeForm() {
  clearErrors()

  if (props.project) {
    Object.assign(form, {
      name: props.project.name,
      description: props.project.description,
      category: props.project.category,
      status: props.project.status,
      priority: props.project.priority,
      startDate: props.project.startDate,
      dueDate: props.project.dueDate,
      owner: props.project.owner,
      memberNames: props.project.members.map(member => member.name),
      icon: props.project.icon,
    })
  } else {
    const initialForm = createEmptyForm()
    initialForm.owner = currentUser.value.name
    initialForm.memberNames = [currentUser.value.name]
    Object.assign(form, initialForm)
  }
}

watch(
  () => [props.show, props.project],
  ([isOpen]) => {
    if (isOpen) initializeForm()
  },
  { immediate: true }
)

function toggleMember(memberName, checked) {
  if (checked) {
    if (!form.memberNames.includes(memberName)) {
      form.memberNames.push(memberName)
    }
    return
  }

  if (isCoordinator() && memberName === currentUser.value.name) return
  if (lockedMemberNames.value.includes(memberName)) return

  form.memberNames = form.memberNames.filter(name => name !== memberName)

  if (form.owner === memberName) {
    form.owner = ''
  }
}

function validateForm() {
  clearErrors()

  if (props.project && !canManageProject(props.project)) {
    formError.value = 'Tu perfil no tiene permiso para editar este proyecto.'
    return false
  }

  if (!props.project && !canCreateProject()) {
    formError.value = 'Tu perfil no tiene permiso para crear proyectos.'
    return false
  }

  if (isCoordinator()) {
    form.owner = currentUser.value.name
    if (!form.memberNames.includes(currentUser.value.name)) {
      form.memberNames.push(currentUser.value.name)
    }
  }

  if (!form.name.trim()) errors.name = 'Escribe el nombre del proyecto.'
  else if (form.name.trim().length < 3) errors.name = 'Utiliza al menos 3 caracteres.'

  if (!form.description.trim()) errors.description = 'Escribe una descripción.'
  if (!form.category.trim()) errors.category = 'Escribe o selecciona una categoría.'
  if (!form.startDate) errors.startDate = 'Selecciona la fecha de inicio.'
  if (!form.dueDate) errors.dueDate = 'Selecciona la fecha de entrega.'

  if (form.startDate && form.dueDate && form.dueDate < form.startDate) {
    errors.dueDate = 'La entrega no puede ser anterior al inicio.'
  }

  if (!form.memberNames.length) {
    errors.members = 'Selecciona al menos un integrante.'
  }

  if (!form.owner) {
    errors.owner = 'Selecciona un responsable.'
  } else if (!form.memberNames.includes(form.owner)) {
    errors.owner = 'El responsable debe pertenecer al equipo seleccionado.'
  }

  if (form.status === 'Completado') {
    if (!props.project) {
      errors.status = 'Primero crea el proyecto, registra sus tareas y complétalas antes de marcarlo como finalizado.'
    } else {
      const completion = validateProjectCompletion(props.project.id)
      if (!completion.ok) errors.status = completion.message
    }
  }

  if (props.project && relatedTasks.value.length) {
    const earliestTaskCreation = relatedTasks.value
      .map(task => task.createdAt)
      .sort()[0]

    const latestTaskDeadline = relatedTasks.value
      .map(task => task.dueDate)
      .sort()
      .at(-1)

    if (form.startDate > earliestTaskCreation) {
      errors.startDate =
        'No puedes mover el inicio después de la creación de una tarea existente.'
    }

    if (form.dueDate < latestTaskDeadline) {
      errors.dueDate =
        'La entrega del proyecto no puede quedar antes de una tarea ya registrada.'
    }
  }

  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (isSaving.value || !validateForm()) return

  isSaving.value = true

  try {
    if (
      props.project &&
      form.status === 'Completado' &&
      props.project.status !== 'Completado'
    ) {
      const accepted = await askConfirmation({
        title: 'Marcar proyecto como completado',
        message: `¿Confirmas que el proyecto "${props.project.name}" ha finalizado?`,
        confirmText: 'Sí, completar',
        cancelText: 'Seguir editando',
        tone: 'success',
      })

      if (!accepted) return
    }

    const payload = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      memberNames: [...form.memberNames],
    }

    // Simula el tiempo de respuesta que tendrá la futura API REST.
    await new Promise(resolve => window.setTimeout(resolve, 450))

    const result = props.project
      ? updateProject(props.project.id, payload)
      : createProject(payload)

    if (!result.ok) {
      formError.value = result.message
      notify({
        type: 'error',
        title: 'No se pudo guardar el proyecto',
        message: result.message,
      })
      return
    }

    if (props.project) synchronizeProjectStatus(result.project.id)

    emit('saved', result.project)
    emit('close')
  } catch (error) {
    console.error('Error al guardar proyecto:', error)
    formError.value = 'Ocurrió un error inesperado. Revisa los datos e inténtalo nuevamente.'
    notify({
      type: 'error',
      title: 'Error al guardar',
      message: 'No fue posible completar el registro del proyecto.',
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
        class="form-modal project-form-modal"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="'project-form-title'"
      >
        <header class="form-modal__header">
          <div class="form-modal__heading">
            <div class="form-modal__icon">
              <AppIcon :name="isEditing ? 'edit' : 'folder'" :size="21" />
            </div>

            <div>
              <span class="form-modal__eyebrow">GESTIÓN DE PROYECTOS</span>
              <h2 id="project-form-title">
                {{ isEditing ? 'Editar proyecto' : 'Crear nuevo proyecto' }}
              </h2>
              <p>
                {{
                  isEditing
                    ? 'Actualiza la información y el equipo del proyecto.'
                    : 'Completa la información para registrar un proyecto.'
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
              <span>Nombre del proyecto <b>*</b></span>
              <input
                v-model="form.name"
                type="text"
                maxlength="80"
                placeholder="Ej. Plataforma de gestión académica"
                required
              />
              <small v-if="errors.name" class="field-error">{{ errors.name }}</small>
            </label>

            <label class="form-field form-field--full">
              <span>Descripción <b>*</b></span>
              <textarea
                v-model="form.description"
                rows="3"
                maxlength="500"
                placeholder="Describe brevemente el objetivo del proyecto..."
                required
              ></textarea>
              <small v-if="errors.description" class="field-error">{{ errors.description }}</small>
            </label>

            <label class="form-field">
              <span>Categoría <b>*</b></span>
              <input
                v-model="form.category"
                type="text"
                maxlength="60"
                list="project-categories"
                placeholder="Ej. Desarrollo web"
                required
              />
              <datalist id="project-categories">
                <option value="Desarrollo web" />
                <option value="Aplicación móvil" />
                <option value="Gestión empresarial" />
                <option value="Diseño" />
              </datalist>
              <small v-if="errors.category" class="field-error">{{ errors.category }}</small>
            </label>

            <label class="form-field">
              <span>Icono del proyecto</span>
              <select v-model="form.icon">
                <option
                  v-for="icon in PROJECT_ICONS"
                  :key="icon.value"
                  :value="icon.value"
                >
                  {{ icon.label }}
                </option>
              </select>
            </label>

            <label class="form-field">
              <span>Estado <b>*</b></span>
              <select v-model="form.status" required>
                <option v-for="status in PROJECT_STATUSES" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
              <small v-if="errors.status" class="field-error">{{ errors.status }}</small>
              <small v-else class="form-field__hint">Un proyecto solo puede completarse cuando todas sus tareas estén finalizadas.</small>
            </label>

            <label class="form-field">
              <span>Prioridad <b>*</b></span>
              <select v-model="form.priority" required>
                <option
                  v-for="priority in PROJECT_PRIORITIES"
                  :key="priority"
                  :value="priority"
                >
                  {{ priority }}
                </option>
              </select>
            </label>

            <label class="form-field">
              <span>Fecha de inicio <b>*</b></span>
              <input v-model="form.startDate" type="date" :max="form.dueDate || undefined" required />
              <small v-if="errors.startDate" class="field-error">{{ errors.startDate }}</small>
            </label>

            <label class="form-field">
              <span>Fecha de entrega <b>*</b></span>
              <input v-model="form.dueDate" type="date" :min="form.startDate || undefined" required />
              <small v-if="errors.dueDate" class="field-error">{{ errors.dueDate }}</small>
            </label>
          </div>

          <section class="form-team-section">
            <div class="form-section-heading">
              <div>
                <h3>Integrantes del proyecto <b>*</b></h3>
                <p>Selecciona quiénes formarán parte del equipo.</p>
              </div>
              <span>{{ form.memberNames.length }} seleccionados</span>
            </div>

            <div class="form-member-grid">
              <label
                v-for="member in teamMembers"
                :key="member.name"
                class="form-member-option"
                :class="{ 'form-member-option--selected': form.memberNames.includes(member.name) }"
              >
                <input
                  type="checkbox"
                  :checked="form.memberNames.includes(member.name)"
                  :disabled="lockedMemberNames.includes(member.name) || (isCoordinator() && member.name === currentUser.name)"
                  @change="toggleMember(member.name, $event.target.checked)"
                />

                <span class="form-member-avatar">{{ member.initials }}</span>

                <span class="form-member-name">{{ member.name }}</span>

                <AppIcon
                  v-if="form.memberNames.includes(member.name)"
                  name="check"
                  :size="16"
                />

                <small
                  v-if="lockedMemberNames.includes(member.name)"
                  class="form-member-lock"
                >
                  Tiene tareas asignadas
                </small>
              </label>
            </div>

            <small v-if="errors.members" class="field-error">{{ errors.members }}</small>
            <p v-if="isEditing && lockedMemberNames.length" class="form-note">
              Los integrantes que tienen tareas asignadas no se pueden retirar del proyecto.
              Primero debes reasignar esas tareas.
            </p>
          </section>

          <label class="form-field">
            <span>Responsable del proyecto <b>*</b></span>
            <select v-model="form.owner" required>
              <option value="" disabled>Selecciona un integrante</option>
              <option
                v-for="member in selectedOwnerOptions"
                :key="member.name"
                :value="member.name"
              >
                {{ member.name }}
              </option>
            </select>
            <small v-if="errors.owner" class="field-error">{{ errors.owner }}</small>
          </label>

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
                  : (isEditing ? 'Guardar cambios' : 'Crear proyecto')
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
  width: min(100%, 780px);
  max-height: min(92vh, 900px);
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

.form-field b,
.form-section-heading b {
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

.field-error {
  color: #ff7583;
  font-size: 0.64rem;
  line-height: 1.4;
}

.form-team-section {
  margin: 21px 0;
  padding: 16px;

  border: 1px solid var(--color-border);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.018);
}

.form-section-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;

  margin-bottom: 13px;
}

.form-section-heading h3 {
  margin: 0 0 4px;
  color: var(--color-text);
  font-size: 0.78rem;
}

.form-section-heading p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.65rem;
}

.form-section-heading > span {
  color: var(--color-red-bright);
  font-size: 0.64rem;
  font-weight: 700;
  white-space: nowrap;
}

.form-member-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.form-member-option {
  position: relative;
  min-width: 0;

  display: flex;
  align-items: center;
  gap: 9px;

  padding: 9px;

  border: 1px solid var(--color-border);
  border-radius: 9px;

  background: rgba(255, 255, 255, 0.018);

  cursor: pointer;
}

.form-member-option--selected {
  border-color: rgba(255, 48, 69, 0.35);
  background: rgba(255, 48, 69, 0.065);
}

.form-member-option input {
  width: 14px;
  height: 14px;
  accent-color: var(--color-red-bright);
}

.form-member-avatar {
  width: 29px;
  height: 29px;
  flex-shrink: 0;

  display: grid;
  place-items: center;

  border-radius: 50%;
  background: #54242e;
  color: #ffffff;

  font-size: 0.57rem;
  font-weight: 800;
}

.form-member-name {
  min-width: 0;
  overflow: hidden;

  color: var(--color-text-secondary);
  font-size: 0.66rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.form-member-option > svg {
  margin-left: auto;
  flex-shrink: 0;
  color: var(--color-red-bright);
}

.form-member-option:has(input:disabled) {
  cursor: not-allowed;
  opacity: 0.78;
}

.form-member-lock {
  position: absolute;
  right: 8px;
  bottom: -15px;

  color: var(--color-text-muted);
  font-size: 0.52rem;
}

.form-note {
  margin: 12px 0 0;
  color: var(--color-text-muted);
  font-size: 0.62rem;
  line-height: 1.5;
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

  .form-grid,
  .form-member-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .form-modal__footer {
    position: sticky;
    bottom: 0;
    background: #111114;
  }
}

 .form-modal__body.is-saving .form-grid,
.form-modal__body.is-saving .form-team-section,
.form-modal__body.is-saving > .form-field {
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
