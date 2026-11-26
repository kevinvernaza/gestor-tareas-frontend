import { computed } from 'vue'

import {
  isTaskOverdue,
  formatTaskDate,
  getProjectProgress,
} from './tasks'
import { getVisibleProjects, getVisibleTasks } from './auth'

function currentMonthKey() {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
}

function formatDashboardPeriod() {
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1, 12)
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0, 12)
  const formatter = new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  return `${formatter.format(firstDay)} – ${formatter.format(lastDay)}`
}

export const dashboardPeriodLabel = computed(() => formatDashboardPeriod())

/* INDICADORES PRINCIPALES SEGÚN EL PERFIL ACTIVO */
export const dashboardStats = computed(() => {
  const visibleProjects = getVisibleProjects()
  const visibleTasks = getVisibleTasks()

  return [
    {
      id: 1,
      label: 'Proyectos activos',
      value: visibleProjects.filter(project =>
        !['Completado', 'Pausado'].includes(project.status)
      ).length,
      icon: 'folder',
      tone: 'red',
    },
    {
      id: 2,
      label: 'Tareas pendientes',
      value: visibleTasks.filter(task => task.status === 'Pendiente').length,
      icon: 'tasks',
      tone: 'red',
    },
    {
      id: 3,
      label: 'Tareas vencidas',
      value: visibleTasks.filter(task => isTaskOverdue(task)).length,
      icon: 'flag',
      tone: 'amber',
    },
    {
      id: 4,
      label: 'Tareas completadas',
      value: visibleTasks.filter(task => task.status === 'Completada').length,
      icon: 'check',
      tone: 'green',
    },
  ]
})

export const recentProjects = computed(() =>
  getVisibleProjects()
    .slice(0, 3)
    .map(project => ({
      id: project.id,
      name: project.name,
      members: project.members.length,
      progress: getProjectProgress(project.id),
      icon: project.icon,
    }))
)

export const taskDistribution = computed(() => {
  const visibleTasks = getVisibleTasks()
  const total = visibleTasks.length

  if (!total) {
    return [
      { id: 1, label: 'En curso', value: 0, color: '#FF3045' },
      { id: 2, label: 'Pendientes', value: 0, color: '#F59E0B' },
      { id: 3, label: 'Completadas', value: 0, color: '#22C55E' },
    ]
  }

  const inProgress = visibleTasks.filter(task =>
    ['En progreso', 'En revisión'].includes(task.status)
  ).length
  const pending = visibleTasks.filter(task => task.status === 'Pendiente').length
  const completed = visibleTasks.filter(task => task.status === 'Completada').length

  const inProgressPercentage = Math.round((inProgress / total) * 100)
  const pendingPercentage = Math.round((pending / total) * 100)
  const completedPercentage = Math.max(0, 100 - inProgressPercentage - pendingPercentage)

  return [
    { id: 1, label: 'En curso', value: inProgressPercentage, color: '#FF3045' },
    { id: 2, label: 'Pendientes', value: pendingPercentage, color: '#F59E0B' },
    { id: 3, label: 'Completadas', value: completedPercentage, color: '#22C55E' },
  ]
})

export const totalTasks = computed(() => getVisibleTasks().length)

export const upcomingTasks = computed(() =>
  getVisibleTasks()
    .filter(task => task.status !== 'Completada')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4)
    .map(task => ({
      id: task.id,
      title: task.title,
      priority: task.priority,
      responsibleName: task.responsibleName,
      projectId: task.projectId,
      dueDate: formatTaskDate(task.dueDate),
      completed: task.status === 'Completada',
    }))
)

/*
El indicador lateral representa el porcentaje de tareas visibles
con fecha límite en el mes actual que ya están completadas.
No utiliza un porcentaje decorativo fijo.
*/
export const monthlyTaskCount = computed(() =>
  getVisibleTasks().filter(task => task.dueDate?.slice(0, 7) === currentMonthKey()).length
)

export const monthlyGoalProgress = computed(() => {
  const monthlyTasks = getVisibleTasks().filter(
    task => task.dueDate?.slice(0, 7) === currentMonthKey()
  )

  if (!monthlyTasks.length) return 0

  const completed = monthlyTasks.filter(task => task.status === 'Completada').length
  return Math.round((completed / monthlyTasks.length) * 100)
})

/* Actividad derivada de las tareas visibles, no de eventos ficticios. */
export const recentActivities = computed(() =>
  getVisibleTasks()
    .slice()
    .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
    .slice(0, 3)
    .map(task => ({
      id: task.id,
      actor: task.responsibleName,
      action: `Estado: ${task.status}`,
      target: task.title,
      time: `Actualizada el ${formatTaskDate(task.updatedAt)}`,
      icon: task.status === 'Completada' ? 'check' : 'tasks',
    }))
)
