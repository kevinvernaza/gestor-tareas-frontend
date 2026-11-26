import {
  createRouter,
  createWebHistory,
} from 'vue-router'

import DashboardView from '../views/DashboardView.vue'

import ProjectsView from '../views/ProjectsView.vue'
import ProjectDetailView from '../views/ProjectDetailView.vue'

import TasksView from '../views/TasksView.vue'
import TaskDetailView from '../views/TaskDetailView.vue'

import TeamView from '../views/TeamView.vue'
import ProfileView from '../views/ProfileView.vue'
import PlaceholderView from '../views/PlaceholderView.vue'
import AccessDeniedView from '../views/AccessDeniedView.vue'
import NotFoundView from '../views/NotFoundView.vue'

import { hasRoleAccess } from '../data/auth'
import { notify } from '../data/uiFeedback'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
    meta: { title: 'Dashboard' },
  },
  {
    path: '/proyectos',
    name: 'projects',
    component: ProjectsView,
    meta: { title: 'Proyectos' },
  },
  {
    path: '/proyectos/:id',
    name: 'project-detail',
    component: ProjectDetailView,
    meta: { title: 'Detalle del proyecto' },
  },
  {
    path: '/tareas',
    name: 'tasks',
    component: TasksView,
    meta: { title: 'Tareas' },
  },
  {
    path: '/tareas/:id',
    name: 'task-detail',
    component: TaskDetailView,
    meta: { title: 'Detalle de la tarea' },
  },
  {
    path: '/equipo',
    name: 'team',
    component: TeamView,
    meta: {
      title: 'Mi equipo',
      roles: ['admin', 'coordinator'],
    },
  },
  {
    path: '/reportes',
    name: 'reports',
    component: PlaceholderView,
    meta: {
      title: 'Reportes',
      description: 'Consulta información sobre el rendimiento y avance del trabajo.',
      icon: 'chart',
      stage: 'DESARROLLO POSTERIOR',
      roles: ['admin', 'coordinator'],
    },
  },
  {
    path: '/perfil',
    name: 'profile',
    component: ProfileView,
    meta: { title: 'Mi perfil' },
  },
  {
    path: '/acceso-denegado',
    name: 'access-denied',
    component: AccessDeniedView,
    meta: { title: 'Acceso restringido' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { title: 'Página no encontrada' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  if (to.meta.roles && !hasRoleAccess(to.meta.roles)) {
    notify({
      type: 'warning',
      title: 'Acceso restringido',
      message: 'Tu perfil no tiene permiso para consultar esa sección.',
    })

    return {
      name: 'access-denied',
      query: { redirect: to.fullPath },
    }
  }

  return true
})

router.afterEach((to) => {
  const title = to.meta.title || 'Gestor'
  document.title = `${title} | Tareas y Proyectos`
})

router.onError((error) => {
  console.error('Error de navegación:', error)

  notify({
    type: 'error',
    title: 'Error de navegación',
    message: 'No fue posible cargar la página solicitada. Intenta nuevamente.',
  })
})

export default router
