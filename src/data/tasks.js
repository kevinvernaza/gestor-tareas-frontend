import { reactive } from 'vue'
import { projects } from './projects'

/*
================================================
ESTADOS Y PRIORIDADES PERMITIDOS
================================================
*/

export const TASK_STATUSES = [
  'Pendiente',
  'En progreso',
  'En revisión',
  'Completada',
]

export const TASK_PRIORITIES = [
  'Alta',
  'Media',
  'Baja',
]

/*
================================================
BASE DE DATOS SIMULADA DE TAREAS
================================================
*/

export const tasks = reactive([
  {
    id: 'T-001',
    title: 'Finalizar módulo de autenticación',
    description:
      'Completar el proceso de autenticación y verificar el acceso de los usuarios a la plataforma académica.',
    projectId: '1',
    status: 'Completada',
    priority: 'Alta',
    responsibleName: 'Carlos Méndez',
    responsibleInitials: 'CM',
    createdAt: '2026-11-10',
    dueDate: '2026-11-27',
    updatedAt: '2026-11-25',
    completedAt: '2026-11-25',
  },
  {
    id: 'T-002',
    title: 'Revisar estructura de base de datos',
    description:
      'Verificar las relaciones entre las entidades y comprobar la organización de la información académica.',
    projectId: '1',
    status: 'Completada',
    priority: 'Alta',
    responsibleName: 'Ana Torres',
    responsibleInitials: 'AT',
    createdAt: '2026-11-12',
    dueDate: '2026-11-24',
    updatedAt: '2026-11-25',
    completedAt: '2026-11-25',
  },
  {
    id: 'T-003',
    title: 'Validar diseño del panel académico',
    description:
      'Revisar la presentación visual del panel y comprobar que sus componentes mantengan la coherencia del diseño.',
    projectId: '1',
    status: 'Completada',
    priority: 'Media',
    responsibleName: 'Laura Gómez',
    responsibleInitials: 'LG',
    createdAt: '2026-11-14',
    dueDate: '2026-11-30',
    updatedAt: '2026-11-25',
    completedAt: '2026-11-25',
  },
  {
    id: 'T-004',
    title: 'Implementar navegación principal',
    description:
      'Desarrollar y verificar la navegación entre las principales secciones de la aplicación móvil institucional.',
    projectId: '2',
    status: 'En progreso',
    priority: 'Alta',
    responsibleName: 'Ana Torres',
    responsibleInitials: 'AT',
    createdAt: '2026-11-11',
    dueDate: '2026-11-29',
    updatedAt: '2026-11-19',
    completedAt: null,
  },
  {
    id: 'T-005',
    title: 'Preparar pruebas de compatibilidad',
    description:
      'Comprobar el comportamiento de la aplicación en diferentes tamaños de pantalla y dispositivos.',
    projectId: '2',
    status: 'Pendiente',
    priority: 'Media',
    responsibleName: 'David López',
    responsibleInitials: 'DL',
    createdAt: '2026-11-16',
    dueDate: '2026-12-02',
    updatedAt: '2026-11-16',
    completedAt: null,
  },
  {
    id: 'T-006',
    title: 'Configurar notificaciones push',
    description:
      'Configurar las notificaciones de la aplicación y verificar su funcionamiento.',
    projectId: '2',
    status: 'Completada',
    priority: 'Media',
    responsibleName: 'Carlos Méndez',
    responsibleInitials: 'CM',
    createdAt: '2026-11-08',
    dueDate: '2026-11-21',
    updatedAt: '2026-11-21',
    completedAt: '2026-11-21',
  },
  {
    id: 'T-007',
    title: 'Optimizar versión móvil',
    description:
      'Mejorar la distribución de los elementos y el rendimiento de la versión móvil del sitio web.',
    projectId: '3',
    status: 'En progreso',
    priority: 'Media',
    responsibleName: 'Andrés Ruiz',
    responsibleInitials: 'AR',
    createdAt: '2026-11-13',
    dueDate: '2026-11-28',
    updatedAt: '2026-11-20',
    completedAt: null,
  },
  {
    id: 'T-008',
    title: 'Validar movimientos de inventario',
    description:
      'Comprobar que los movimientos de entrada y salida de productos se registren correctamente.',
    projectId: '4',
    status: 'En revisión',
    priority: 'Alta',
    responsibleName: 'Andrés Ruiz',
    responsibleInitials: 'AR',
    createdAt: '2026-11-15',
    dueDate: '2026-11-26',
    updatedAt: '2026-11-22',
    completedAt: null,
  },
  {
    id: 'T-009',
    title: 'Crear prototipo de identidad',
    description:
      'Desarrollar una propuesta inicial de identidad visual y sus principales elementos gráficos.',
    projectId: '5',
    status: 'Pendiente',
    priority: 'Baja',
    responsibleName: 'María Rojas',
    responsibleInitials: 'MR',
    createdAt: '2026-11-20',
    dueDate: '2026-12-01',
    updatedAt: '2026-11-20',
    completedAt: null,
  },
  {
    id: 'T-010',
    title: 'Documentar portal de atención',
    description:
      'Organizar la documentación técnica y funcional del portal de atención al cliente.',
    projectId: '6',
    status: 'Completada',
    priority: 'Media',
    responsibleName: 'David López',
    responsibleInitials: 'DL',
    createdAt: '2026-10-28',
    dueDate: '2026-11-15',
    updatedAt: '2026-11-15',
    completedAt: '2026-11-15',
  },
  {
    id: 'T-011',
    title: 'Revisar permisos de usuarios',
    description:
      'Comprobar los permisos de acceso y la separación de funcionalidades de los usuarios.',
    projectId: '1',
    status: 'Completada',
    priority: 'Media',
    responsibleName: 'Carlos Méndez',
    responsibleInitials: 'CM',
    createdAt: '2026-11-13',
    dueDate: '2026-11-23',
    updatedAt: '2026-11-25',
    completedAt: '2026-11-25',
  },
  {
    id: 'T-012',
    title: 'Ajustar componentes visuales',
    description:
      'Realizar los últimos ajustes de presentación y consistencia visual del sitio corporativo.',
    projectId: '3',
    status: 'Completada',
    priority: 'Baja',
    responsibleName: 'Laura Gómez',
    responsibleInitials: 'LG',
    createdAt: '2026-11-12',
    dueDate: '2026-11-22',
    updatedAt: '2026-11-22',
    completedAt: '2026-11-22',
  },
])

/*
================================================
UTILIDADES DE FECHAS
================================================
*/

export function getLocalDateString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function isValidISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

export function formatTaskDate(dateValue) {
  if (!dateValue) return 'Sin fecha'

  const [year, month, day] = dateValue.split('-').map(Number)
  const date = new Date(year, month - 1, day, 12)

  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/*
================================================
IDENTIFICAR TAREAS VENCIDAS
================================================
*/

export function isTaskOverdue(task, referenceDate = new Date()) {
  if (!task || task.status === 'Completada') return false

  const [year, month, day] = task.dueDate.split('-').map(Number)
  const deadline = new Date(year, month - 1, day, 23, 59, 59, 999)

  return deadline < referenceDate
}

/*
================================================
CONSULTAS DE TAREAS
================================================
*/

export function getTaskById(taskId) {
  return tasks.find(task => task.id === String(taskId)) || null
}

function getProjectById(projectId) {
  return projects.find(project => project.id === String(projectId)) || null
}

/*
================================================
INDICADORES Y ESTADO AUTOMÁTICO DEL PROYECTO
================================================
El avance se calcula únicamente con las tareas reales:
- Sin tareas: 0 %.
- Con tareas: tareas completadas / tareas totales.
No se almacena un porcentaje fijo en el proyecto.
================================================
*/

export function getProjectTaskStats(projectId) {
  const projectTasks = tasks.filter(task => task.projectId === String(projectId))
  const total = projectTasks.length
  const completed = projectTasks.filter(task => task.status === 'Completada').length
  const pending = projectTasks.filter(task => task.status === 'Pendiente').length
  const inProgress = projectTasks.filter(task => task.status === 'En progreso').length
  const inReview = projectTasks.filter(task => task.status === 'En revisión').length

  return {
    total,
    completed,
    pending,
    inProgress,
    inReview,
    remaining: total - completed,
    progress: total === 0 ? 0 : Math.round((completed / total) * 100),
  }
}

export function getProjectProgress(projectId) {
  return getProjectTaskStats(projectId).progress
}

export function validateProjectCompletion(projectId) {
  const stats = getProjectTaskStats(projectId)

  if (stats.total === 0) {
    return {
      ok: false,
      message: 'No puedes completar un proyecto que todavía no tiene tareas registradas.',
      stats,
    }
  }

  if (stats.completed !== stats.total) {
    return {
      ok: false,
      message: `No puedes completar el proyecto: todavía hay ${stats.remaining} de ${stats.total} tareas sin completar.`,
      stats,
    }
  }

  return { ok: true, stats }
}

export function synchronizeProjectStatus(projectId) {
  const project = getProjectById(projectId)
  if (!project) return null

  const stats = getProjectTaskStats(projectId)

  if (stats.total > 0 && stats.completed === stats.total) {
    project.status = 'Completado'
  } else if (project.status === 'Completado') {
    project.status = stats.total > 0 ? 'En progreso' : 'Planificación'
  }

  return project
}

export function synchronizeAllProjectStatuses() {
  projects.forEach(project => synchronizeProjectStatus(project.id))
}

/*
================================================
GENERAR IDENTIFICADOR DE TAREA
================================================
*/

function generateTaskId() {
  const numericIds = tasks
    .map(task => Number(String(task.id).replace('T-', '')))
    .filter(Number.isFinite)

  const nextId = Math.max(0, ...numericIds) + 1

  return `T-${String(nextId).padStart(3, '0')}`
}

/*
================================================
VALIDAR DATOS DE UNA TAREA
================================================
*/

function validateTaskData(payload, existingTask = null) {
  const title = String(payload.title || '').trim()
  const description = String(payload.description || '').trim()
  const projectId = String(payload.projectId || '')
  const responsibleName = String(payload.responsibleName || '').trim()
  const project = getProjectById(projectId)
  const createdAt = existingTask?.createdAt || getLocalDateString()

  if (!title) {
    return { ok: false, message: 'El título de la tarea es obligatorio.' }
  }

  if (title.length < 3) {
    return { ok: false, message: 'El título debe tener al menos 3 caracteres.' }
  }

  if (!description) {
    return { ok: false, message: 'La descripción de la tarea es obligatoria.' }
  }

  if (!project) {
    return { ok: false, message: 'Selecciona un proyecto válido.' }
  }

  if (
    project.status === 'Completado' &&
    (!existingTask || existingTask.projectId !== projectId)
  ) {
    return {
      ok: false,
      message: 'No puedes agregar o mover tareas a un proyecto completado. Reabre una tarea existente o selecciona otro proyecto.',
    }
  }

  if (!TASK_STATUSES.includes(payload.status)) {
    return { ok: false, message: 'Selecciona un estado válido.' }
  }

  if (!TASK_PRIORITIES.includes(payload.priority)) {
    return { ok: false, message: 'Selecciona una prioridad válida.' }
  }

  if (!isValidISODate(payload.dueDate)) {
    return { ok: false, message: 'Selecciona una fecha límite válida.' }
  }

  if (payload.dueDate < createdAt) {
    return {
      ok: false,
      message: 'La fecha límite no puede ser anterior a la fecha de creación.',
    }
  }

  if (project.startDate && payload.dueDate < project.startDate) {
    return {
      ok: false,
      message: 'La fecha límite no puede ser anterior al inicio del proyecto.',
    }
  }

  if (project.dueDate && payload.dueDate > project.dueDate) {
    return {
      ok: false,
      message: 'La fecha límite de la tarea no puede superar la fecha de entrega del proyecto.',
    }
  }

  const member = project.members.find(item => item.name === responsibleName)

  if (!member) {
    return {
      ok: false,
      message: 'El responsable debe pertenecer al proyecto seleccionado.',
    }
  }

  return {
    ok: true,
    data: {
      title,
      description,
      projectId,
      status: payload.status,
      priority: payload.priority,
      responsibleName: member.name,
      responsibleInitials: member.initials,
      createdAt,
      dueDate: payload.dueDate,
    },
  }
}

/*
================================================
CREAR TAREA
================================================
*/

export function createTask(payload) {
  const validation = validateTaskData(payload)

  if (!validation.ok) return validation

  const today = getLocalDateString()

  const task = {
    id: generateTaskId(),
    ...validation.data,
    updatedAt: today,
    completedAt: validation.data.status === 'Completada' ? today : null,
  }

  tasks.push(task)
  synchronizeProjectStatus(task.projectId)

  return {
    ok: true,
    task,
    message: 'La tarea se creó correctamente.',
  }
}

/*
================================================
ACTUALIZAR TAREA
================================================
*/

export function updateTask(taskId, payload) {
  const task = getTaskById(taskId)

  if (!task) {
    return { ok: false, message: 'No se encontró la tarea que deseas editar.' }
  }

  const previousProjectId = task.projectId
  const validation = validateTaskData(payload, task)

  if (!validation.ok) return validation

  const today = getLocalDateString()
  const wasCompleted = Boolean(task.completedAt)

  Object.assign(task, validation.data, {
    updatedAt: today,
    completedAt:
      validation.data.status === 'Completada'
        ? (wasCompleted && previousProjectId === validation.data.projectId ? task.completedAt : today)
        : null,
  })

  synchronizeProjectStatus(previousProjectId)
  synchronizeProjectStatus(task.projectId)

  return {
    ok: true,
    task,
    message: 'La tarea se actualizó correctamente.',
  }
}

/*
================================================
CAMBIAR ESTADO DE UNA TAREA
================================================
*/

export function updateTaskStatus(taskId, newStatus) {
  const task = getTaskById(taskId)

  if (!task) {
    return { ok: false, message: 'No se encontró la tarea.' }
  }

  if (!TASK_STATUSES.includes(newStatus)) {
    return { ok: false, message: 'El estado seleccionado no es válido.' }
  }

  const today = getLocalDateString()

  task.status = newStatus
  task.updatedAt = today
  task.completedAt = newStatus === 'Completada' ? today : null
  synchronizeProjectStatus(task.projectId)

  return {
    ok: true,
    task,
    message: 'El estado de la tarea se actualizó correctamente.',
  }
}

/*
================================================
ASIGNAR INTEGRANTE A UNA TAREA
================================================
*/

export function assignTask(taskId, memberName) {
  const task = getTaskById(taskId)

  if (!task) {
    return { ok: false, message: 'No se encontró la tarea.' }
  }

  const project = getProjectById(task.projectId)

  if (!project) {
    return { ok: false, message: 'El proyecto asociado no existe.' }
  }

  const member = project.members.find(item => item.name === memberName)

  if (!member) {
    return {
      ok: false,
      message:
        'No puedes asignar esta tarea a una persona que no pertenece al proyecto.',
    }
  }

  task.responsibleName = member.name
  task.responsibleInitials = member.initials
  task.updatedAt = getLocalDateString()

  return {
    ok: true,
    task,
    message: 'El responsable se actualizó correctamente.',
  }
}

// Normaliza los estados iniciales para que coincidan con las tareas de demostración.
synchronizeAllProjectStatuses()
