import { computed, ref } from 'vue'

import { projects } from './projects'
import { tasks } from './tasks'

/*
================================================
PERFILES SIMULADOS
================================================
Los perfiles son demostrativos. No representan
autenticación ni seguridad real de servidor.
================================================
*/

export const ROLE_LABELS = {
  admin: 'Administrador',
  coordinator: 'Líder de proyecto',
  collaborator: 'Integrante del equipo',
}

export const ROLE_DESCRIPTIONS = {
  admin: 'Administra toda la plataforma, los proyectos, las tareas y los perfiles de demostración.',
  coordinator: 'Lidera los proyectos que tiene a cargo, organiza integrantes y supervisa las tareas del equipo.',
  collaborator: 'Consulta los proyectos a los que pertenece y actualiza el estado de las tareas que tiene asignadas.',
}

export const userProfiles = [
  {
    id: 'USR-001',
    name: 'Carlos Méndez',
    initials: 'CM',
    email: 'carlos.mendez@gestor.demo',
    position: 'Administrador general',
    department: 'Administración',
    role: 'admin',
  },
  {
    id: 'USR-002',
    name: 'Ana Torres',
    initials: 'AT',
    email: 'ana.torres@gestor.demo',
    position: 'Coordinadora de proyectos',
    department: 'Desarrollo',
    role: 'coordinator',
  },
  {
    id: 'USR-003',
    name: 'Laura Gómez',
    initials: 'LG',
    email: 'laura.gomez@gestor.demo',
    position: 'Coordinadora de proyectos',
    department: 'Diseño y desarrollo',
    role: 'coordinator',
  },
  {
    id: 'USR-004',
    name: 'Andrés Ruiz',
    initials: 'AR',
    email: 'andres.ruiz@gestor.demo',
    position: 'Analista de sistemas',
    department: 'Tecnología',
    role: 'collaborator',
  },
  {
    id: 'USR-005',
    name: 'David López',
    initials: 'DL',
    email: 'david.lopez@gestor.demo',
    position: 'Desarrollador',
    department: 'Tecnología',
    role: 'collaborator',
  },
  {
    id: 'USR-006',
    name: 'María Rojas',
    initials: 'MR',
    email: 'maria.rojas@gestor.demo',
    position: 'Diseñadora',
    department: 'Diseño',
    role: 'collaborator',
  },
]

const activeUserId = ref('USR-001')

export const currentUser = computed(() =>
  userProfiles.find(user => user.id === activeUserId.value) || userProfiles[0]
)

export function setCurrentUser(userId) {
  const user = userProfiles.find(item => item.id === userId)

  if (!user) {
    return {
      ok: false,
      message: 'No se encontró el perfil seleccionado.',
    }
  }

  activeUserId.value = user.id

  return {
    ok: true,
    user,
    message: `Ahora estás utilizando el perfil de ${user.name}.`,
  }
}

export function getUserByName(name) {
  return userProfiles.find(user => user.name === name) || null
}

/*
================================================
PERMISOS POR ROL
================================================
*/

export function isAdmin() {
  return currentUser.value.role === 'admin'
}

export function isCoordinator() {
  return currentUser.value.role === 'coordinator'
}

export function isCollaborator() {
  return currentUser.value.role === 'collaborator'
}

export function hasRoleAccess(allowedRoles = []) {
  if (!allowedRoles.length) return true
  return allowedRoles.includes(currentUser.value.role)
}

export function canCreateProject() {
  return isAdmin() || isCoordinator()
}

export function canViewProject(project) {
  if (!project) return false
  if (isAdmin()) return true

  const isMember = project.members?.some(
    member => member.name === currentUser.value.name
  )

  if (isCoordinator()) {
    return project.owner === currentUser.value.name || isMember
  }

  return Boolean(isMember)
}

export function canManageProject(project) {
  if (!project) return false
  if (isAdmin()) return true

  return isCoordinator() && project.owner === currentUser.value.name
}

export function canViewTask(task) {
  if (!task) return false
  if (isAdmin()) return true

  if (isCollaborator()) {
    return task.responsibleName === currentUser.value.name
  }

  const project = projects.find(item => item.id === task.projectId)

  return Boolean(project && canViewProject(project))
}

export function canCreateTask(project = null) {
  if (project) {
    if (project.status === 'Completado') return false
    if (isAdmin()) return true
    return isCoordinator() && project.owner === currentUser.value.name
  }

  if (isAdmin()) {
    return projects.some(item => item.status !== 'Completado')
  }

  if (!isCoordinator()) return false

  return projects.some(item =>
    item.owner === currentUser.value.name && item.status !== 'Completado'
  )
}

export function canManageTask(task) {
  if (!task) return false
  if (isAdmin()) return true
  if (!isCoordinator()) return false

  const project = projects.find(item => item.id === task.projectId)

  return Boolean(project && project.owner === currentUser.value.name)
}

export function canChangeTaskStatus(task) {
  if (!task) return false
  if (isAdmin()) return true
  if (isCoordinator()) return canManageTask(task)

  return isCollaborator() && task.responsibleName === currentUser.value.name
}

export function canAssignTask(task) {
  return canManageTask(task)
}

export function getVisibleProjects() {
  return projects.filter(project => canViewProject(project))
}

export function getVisibleTasks() {
  return tasks.filter(task => canViewTask(task))
}

/*
================================================
RESUMEN DE PERMISOS PARA EL PERFIL ACTUAL
================================================
*/

export function getRolePermissions(role = currentUser.value.role) {
  if (role === 'admin') {
    return [
      'Consultar todos los proyectos y tareas.',
      'Crear, editar y administrar proyectos.',
      'Crear, editar y asignar tareas.',
      'Cambiar el estado de cualquier tarea.',
      'Consultar el equipo y los reportes.',
      'Cambiar entre perfiles de demostración.',
    ]
  }

  if (role === 'coordinator') {
    return [
      'Consultar los proyectos en los que participa.',
      'Crear proyectos y administrar los que tiene a cargo como líder.',
      'Crear y editar tareas de sus propios proyectos.',
      'Asignar tareas a integrantes de sus proyectos.',
      'Supervisar las actividades de sus equipos.',
      'Consultar el equipo y los reportes.',
    ]
  }

  return [
    'Consultar los proyectos a los que pertenece.',
    'Consultar las tareas que tiene asignadas.',
    'Cambiar el estado de sus propias tareas.',
    'Consultar y actualizar la información de su perfil.',
  ]
}
