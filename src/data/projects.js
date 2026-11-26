import { reactive } from 'vue'

/*
================================================
CATÁLOGOS DEL MÓDULO DE PROYECTOS
================================================
*/

export const PROJECT_STATUSES = [
  'Planificación',
  'En progreso',
  'En revisión',
  'Completado',
  'Pausado',
]

export const PROJECT_PRIORITIES = [
  'Alta',
  'Media',
  'Baja',
]

export const PROJECT_ICONS = [
  { value: 'code', label: 'Desarrollo web' },
  { value: 'mobile', label: 'Aplicación móvil' },
  { value: 'monitor', label: 'Sitio web' },
  { value: 'database', label: 'Base de datos' },
  { value: 'palette', label: 'Diseño' },
  { value: 'globe', label: 'Portal web' },
]

/*
================================================
BASE DE DATOS SIMULADA DE PROYECTOS
================================================

Las fechas se almacenan como YYYY-MM-DD para que
sean compatibles con los formularios HTML y con
la futura API REST.
================================================
*/

export const projects = reactive([
  {
    id: '1',
    name: 'Plataforma Académica',
    description:
      'Desarrollo de una plataforma para centralizar los procesos académicos y facilitar el seguimiento estudiantil.',
    category: 'Desarrollo web',
    status: 'En progreso',
    startDate: '2026-11-02',
    dueDate: '2026-12-15',
    owner: 'Carlos Méndez',
    priority: 'Alta',
    icon: 'code',
    members: [
      { name: 'Carlos Méndez', initials: 'CM' },
      { name: 'Ana Torres', initials: 'AT' },
      { name: 'Laura Gómez', initials: 'LG' },
      { name: 'Andrés Ruiz', initials: 'AR' },
    ],
  },
  {
    id: '2',
    name: 'App Móvil Institucional',
    description:
      'Diseño y desarrollo de una aplicación móvil para mejorar la comunicación y los servicios institucionales.',
    category: 'Aplicación móvil',
    status: 'En progreso',
    startDate: '2026-11-05',
    dueDate: '2026-12-20',
    owner: 'Ana Torres',
    priority: 'Alta',
    icon: 'mobile',
    members: [
      { name: 'Ana Torres', initials: 'AT' },
      { name: 'Carlos Méndez', initials: 'CM' },
      { name: 'David López', initials: 'DL' },
      { name: 'María Rojas', initials: 'MR' },
      { name: 'Laura Gómez', initials: 'LG' },
    ],
  },
  {
    id: '3',
    name: 'Sitio Web Corporativo',
    description:
      'Construcción de un sitio web corporativo moderno, adaptable y orientado a mejorar la presencia digital.',
    category: 'Desarrollo web',
    status: 'En progreso',
    startDate: '2026-11-10',
    dueDate: '2026-12-28',
    owner: 'Laura Gómez',
    priority: 'Media',
    icon: 'monitor',
    members: [
      { name: 'Laura Gómez', initials: 'LG' },
      { name: 'Andrés Ruiz', initials: 'AR' },
      { name: 'Carlos Méndez', initials: 'CM' },
      { name: 'María Rojas', initials: 'MR' },
    ],
  },
  {
    id: '4',
    name: 'Sistema de Inventario',
    description:
      'Implementación de una solución para organizar productos, controlar existencias y consultar movimientos.',
    category: 'Gestión empresarial',
    status: 'En revisión',
    startDate: '2026-11-01',
    dueDate: '2026-12-18',
    owner: 'Andrés Ruiz',
    priority: 'Media',
    icon: 'database',
    members: [
      { name: 'Andrés Ruiz', initials: 'AR' },
      { name: 'Ana Torres', initials: 'AT' },
      { name: 'David López', initials: 'DL' },
    ],
  },
  {
    id: '5',
    name: 'Rediseño de Identidad Visual',
    description:
      'Planificación de una nueva identidad visual con lineamientos gráficos y elementos de comunicación.',
    category: 'Diseño',
    status: 'Planificación',
    startDate: '2026-11-20',
    dueDate: '2026-12-30',
    owner: 'María Rojas',
    priority: 'Baja',
    icon: 'palette',
    members: [
      { name: 'María Rojas', initials: 'MR' },
      { name: 'Laura Gómez', initials: 'LG' },
      { name: 'Ana Torres', initials: 'AT' },
    ],
  },
  {
    id: '6',
    name: 'Portal de Atención al Cliente',
    description:
      'Implementación de un portal digital para facilitar la atención, consulta y comunicación con los usuarios.',
    category: 'Desarrollo web',
    status: 'Completado',
    startDate: '2026-10-01',
    dueDate: '2026-11-15',
    owner: 'Carlos Méndez',
    priority: 'Alta',
    icon: 'globe',
    members: [
      { name: 'Carlos Méndez', initials: 'CM' },
      { name: 'David López', initials: 'DL' },
      { name: 'María Rojas', initials: 'MR' },
    ],
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

export function formatProjectDate(dateValue) {
  if (!dateValue) return 'Sin fecha'

  const [year, month, day] = dateValue.split('-').map(Number)

  if (!year || !month || !day) return dateValue

  const date = new Date(year, month - 1, day, 12)

  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
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

/*
================================================
CONSULTAS DE PROYECTOS
================================================
*/

export function getProjectById(projectId) {
  return projects.find(project => project.id === String(projectId)) || null
}

export function getProjectTeamMembers() {
  const membersByName = new Map()

  projects.forEach(project => {
    project.members.forEach(member => {
      if (!membersByName.has(member.name)) {
        membersByName.set(member.name, { ...member })
      }
    })
  })

  return [...membersByName.values()].sort((a, b) =>
    a.name.localeCompare(b.name, 'es')
  )
}

/*
================================================
VALIDACIÓN DE PROYECTOS
================================================
*/

function validateProjectData(data, currentProjectId = null) {
  const name = String(data.name || '').trim()
  const description = String(data.description || '').trim()
  const category = String(data.category || '').trim()
  const owner = String(data.owner || '').trim()
  const memberNames = Array.isArray(data.memberNames)
    ? [...new Set(data.memberNames.map(name => String(name).trim()).filter(Boolean))]
    : []

  if (!name) {
    return { ok: false, message: 'El nombre del proyecto es obligatorio.' }
  }

  if (name.length < 3) {
    return { ok: false, message: 'El nombre debe tener al menos 3 caracteres.' }
  }

  if (!description) {
    return { ok: false, message: 'La descripción del proyecto es obligatoria.' }
  }

  if (!category) {
    return { ok: false, message: 'La categoría del proyecto es obligatoria.' }
  }

  if (!isValidISODate(data.startDate) || !isValidISODate(data.dueDate)) {
    return { ok: false, message: 'Selecciona fechas de inicio y entrega válidas.' }
  }

  if (data.dueDate < data.startDate) {
    return {
      ok: false,
      message: 'La fecha de entrega no puede ser anterior a la fecha de inicio.',
    }
  }

  if (!PROJECT_STATUSES.includes(data.status)) {
    return { ok: false, message: 'Selecciona un estado válido.' }
  }

  if (!currentProjectId && data.status === 'Completado') {
    return {
      ok: false,
      message: 'Un proyecto nuevo no puede crearse como completado. Primero registra y completa sus tareas.',
    }
  }

  if (!PROJECT_PRIORITIES.includes(data.priority)) {
    return { ok: false, message: 'Selecciona una prioridad válida.' }
  }

  if (!PROJECT_ICONS.some(icon => icon.value === data.icon)) {
    return { ok: false, message: 'Selecciona un icono válido.' }
  }

  if (!memberNames.length) {
    return { ok: false, message: 'Selecciona al menos un integrante para el proyecto.' }
  }

  if (!owner || !memberNames.includes(owner)) {
    return {
      ok: false,
      message: 'El responsable debe estar incluido entre los integrantes del proyecto.',
    }
  }

  const duplicatedName = projects.some(project =>
    project.id !== currentProjectId &&
    project.name.toLocaleLowerCase('es') === name.toLocaleLowerCase('es')
  )

  if (duplicatedName) {
    return { ok: false, message: 'Ya existe un proyecto con ese nombre.' }
  }

  const availableMembers = getProjectTeamMembers()
  const members = memberNames.map(memberName =>
    availableMembers.find(member => member.name === memberName)
  )

  if (members.some(member => !member)) {
    return {
      ok: false,
      message: 'Uno de los integrantes seleccionados no está disponible.',
    }
  }

  return {
    ok: true,
    data: {
      name,
      description,
      category,
      status: data.status,
      priority: data.priority,
      startDate: data.startDate,
      dueDate: data.dueDate,
      owner,
      icon: data.icon,
      members: members.map(member => ({ ...member })),
    },
  }
}

/*
================================================
GENERAR IDENTIFICADOR
================================================
*/

function generateProjectId() {
  const numericIds = projects
    .map(project => Number(project.id))
    .filter(Number.isFinite)

  const nextId = Math.max(0, ...numericIds) + 1

  return String(nextId)
}

/*
================================================
CREAR PROYECTO
================================================
*/

export function createProject(payload) {
  const validation = validateProjectData(payload)

  if (!validation.ok) return validation

  const project = {
    id: generateProjectId(),
    ...validation.data,
  }

  projects.push(project)

  return {
    ok: true,
    project,
    message: 'El proyecto se creó correctamente.',
  }
}

/*
================================================
ACTUALIZAR PROYECTO
================================================
*/

export function updateProject(projectId, payload) {
  const project = getProjectById(projectId)

  if (!project) {
    return { ok: false, message: 'No se encontró el proyecto que deseas editar.' }
  }

  const validation = validateProjectData(payload, project.id)

  if (!validation.ok) return validation

  Object.assign(project, validation.data)

  return {
    ok: true,
    project,
    message: 'El proyecto se actualizó correctamente.',
  }
}
