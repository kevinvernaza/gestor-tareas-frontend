
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import AppIcon from '../ui/AppIcon.vue'

import { projects } from '../../data/projects'
import { tasks } from '../../data/tasks'

import {
  currentUser,
  userProfiles,
  ROLE_LABELS,
  setCurrentUser,
  hasRoleAccess,
  canViewProject,
  canViewTask,
} from '../../data/auth'

import { notify } from '../../data/uiFeedback'

const emit = defineEmits(['toggle-sidebar'])

const route = useRoute()
const router = useRouter()

const searchQuery = ref('')
const searchInput = ref(null)
const activePopover = ref(null)

const searchResults = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('es')

  if (!query) return []

  const projectResults = projects
    .filter(project => canViewProject(project))
    .filter(project => [
      project.name,
      project.description,
      project.category,
      project.owner,
    ].some(value => String(value || '').toLocaleLowerCase('es').includes(query)))
    .map(project => ({
      id: `project-${project.id}`,
      title: project.name,
      description: `Proyecto · ${project.status}`,
      icon: 'folder',
      to: { name: 'project-detail', params: { id: project.id } },
    }))

  const taskResults = tasks
    .filter(task => canViewTask(task))
    .filter(task => {
      const projectName = projects.find(project => project.id === task.projectId)?.name || ''
      return [
        task.id,
        task.title,
        task.description,
        task.responsibleName,
        projectName,
      ].some(value => String(value || '').toLocaleLowerCase('es').includes(query))
    })
    .map(task => ({
      id: `task-${task.id}`,
      title: task.title,
      description: `Tarea ${task.id} · ${task.status}`,
      icon: 'tasks',
      to: { name: 'task-detail', params: { id: task.id } },
    }))

  const visibleMemberNames = new Set(
    projects
      .filter(project => canViewProject(project))
      .flatMap(project => project.members.map(member => member.name))
  )

  const memberResults = currentUser.value.role === 'admin' || currentUser.value.role === 'coordinator'
    ? userProfiles
        .filter(user =>
          (currentUser.value.role === 'admin' || visibleMemberNames.has(user.name)) &&
          [
            user.name,
            user.position,
            ROLE_LABELS[user.role],
          ].some(value => String(value || '').toLocaleLowerCase('es').includes(query))
        )
        .map(user => ({
          id: `member-${user.id}`,
          title: user.name,
          description: `Integrante · ${ROLE_LABELS[user.role]}`,
          icon: 'users',
          to: { name: 'team' },
        }))
    : []

  return [...projectResults, ...taskResults, ...memberResults].slice(0, 8)
})

function togglePopover(name) {
  activePopover.value = activePopover.value === name ? null : name
}

function closePopover() {
  activePopover.value = null
}

function closeSearch() {
  searchQuery.value = ''
}

function switchProfile(user) {
  const result = setCurrentUser(user.id)

  if (!result.ok) {
    notify({
      type: 'error',
      title: 'No se pudo cambiar el perfil',
      message: result.message,
    })
    return
  }

  notify({
    type: 'success',
    title: 'Perfil cambiado',
    message: `Ahora estás utilizando el perfil de ${user.name}.`,
  })

  closePopover()
  closeSearch()

  if (route.meta.roles && !hasRoleAccess(route.meta.roles)) {
    router.replace({
      name: 'access-denied',
      query: { redirect: route.fullPath },
    })
    return
  }

  if (route.name === 'project-detail') {
    const project = projects.find(item => item.id === String(route.params.id))
    if (!project || !canViewProject(project)) {
      router.replace('/')
      return
    }
  }

  if (route.name === 'task-detail') {
    const task = tasks.find(item => item.id === String(route.params.id))
    if (!task || !canViewTask(task)) {
      router.replace('/')
    }
  }
}

function handleGlobalKeydown(event) {
  const isSearchShortcut =
    (event.ctrlKey || event.metaKey) &&
    event.key.toLowerCase() === 'k'

  if (isSearchShortcut) {
    event.preventDefault()
    closePopover()
    searchInput.value?.focus()
  }

  if (event.key === 'Escape') {
    closePopover()
    closeSearch()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<template>
  <header class="app-topbar">

    <!-- BOTÓN MÓVIL -->
    <button
      type="button"
      class="mobile-menu-button"
      aria-label="Abrir menú de navegación"
      @click="emit('toggle-sidebar')"
    >
      <AppIcon name="menu" :size="21" />
    </button>

    <!-- BUSCADOR -->
    <div class="topbar-search">

      <div class="search-field">

        <AppIcon name="search" :size="19" />

        <input
          ref="searchInput"
          v-model="searchQuery"
          type="search"
          placeholder="Buscar proyectos, tareas o miembros..."
          aria-label="Buscar proyectos, tareas o miembros"
          autocomplete="off"
          @focus="closePopover"
        />

        <kbd>Ctrl + K</kbd>

      </div>

      <div
        v-if="searchQuery.trim()"
        class="topbar-search-results"
      >
        <div class="topbar-search-results__heading">
          <span>RESULTADOS DE BÚSQUEDA</span>
          <small>{{ searchResults.length }} encontrados</small>
        </div>

        <RouterLink
          v-for="result in searchResults"
          :key="result.id"
          :to="result.to"
          class="topbar-search-result"
          @click="closeSearch"
        >
          <span class="topbar-search-result__icon">
            <AppIcon :name="result.icon" :size="16"/>
          </span>
          <span class="topbar-search-result__copy">
            <strong>{{ result.title }}</strong>
            <small>{{ result.description }}</small>
          </span>
          <AppIcon name="arrow-right" :size="15"/>
        </RouterLink>

        <div v-if="!searchResults.length" class="topbar-search-results__empty">
          No hay resultados disponibles para tu perfil.
        </div>
      </div>

    </div>

    <!-- ACCIONES -->
    <div class="topbar-actions">

      <!-- NOTIFICACIONES -->
      <div class="popover-anchor">

        <button
          type="button"
          class="topbar-icon-button"
          :class="{ 'is-open': activePopover === 'notifications' }"
          aria-label="Notificaciones"
          :aria-expanded="activePopover === 'notifications'"
          @click="togglePopover('notifications')"
        >

          <AppIcon name="bell" :size="21" />

          <span class="notification-count">1</span>

        </button>

        <div
          v-if="activePopover === 'notifications'"
          class="topbar-popover notifications-popover"
        >

          <div class="popover-heading">
            <div>
              <strong>Notificaciones</strong>
              <span>Actividad reciente</span>
            </div>

            <span class="popover-counter">1 nueva</span>
          </div>

          <div class="notification-entry">

            <span class="notification-marker"></span>

            <div>
              <strong>Revisa tus tareas pendientes</strong>

              <p>
                Mantén actualizado el progreso de tus proyectos.
              </p>

              <small>Notificación de demostración</small>
            </div>

          </div>

          <div class="popover-footer">
            Panel de notificaciones
          </div>

        </div>

      </div>

      <!-- AYUDA -->
      <div class="popover-anchor">

        <button
          type="button"
          class="topbar-icon-button"
          :class="{ 'is-open': activePopover === 'help' }"
          aria-label="Ayuda"
          :aria-expanded="activePopover === 'help'"
          @click="togglePopover('help')"
        >
          <AppIcon name="help" :size="21" />
        </button>

        <div
          v-if="activePopover === 'help'"
          class="topbar-popover help-popover"
        >

          <div class="popover-heading">
            <div>
              <strong>Centro de ayuda</strong>
              <span>Gestor de Tareas y Proyectos</span>
            </div>
          </div>

          <p class="help-description">
            Utiliza el menú lateral para navegar entre
            las diferentes secciones de la plataforma.
          </p>

          <div class="help-tip">
            <AppIcon name="search" :size="17" />

            <span>
              Consejo: utiliza Ctrl + K para acceder
              rápidamente al buscador.
            </span>
          </div>

        </div>

      </div>

      <!-- PERFIL -->
      <div class="popover-anchor profile-anchor">

        <button
          type="button"
          class="profile-trigger"
          :aria-expanded="activePopover === 'profile'"
          @click="togglePopover('profile')"
        >

          <div class="profile-avatar">
            {{ currentUser.initials }}
          </div>

          <div class="profile-information">
            <strong>{{ currentUser.name }}</strong>
            <span>{{ ROLE_LABELS[currentUser.role] }}</span>
          </div>

          <AppIcon
            name="chevron-down"
            :size="16"
            class="profile-chevron"
          />

        </button>

        <div
          v-if="activePopover === 'profile'"
          class="topbar-popover profile-popover"
        >

          <div class="profile-popover-header">

            <div class="profile-avatar profile-avatar--large">
              {{ currentUser.initials }}
            </div>

            <div>
              <strong>{{ currentUser.name }}</strong>
              <span>{{ ROLE_LABELS[currentUser.role] }}</span>
            </div>

          </div>

          <div class="popover-divider"></div>

          <div class="profile-switcher-heading">
            Cambiar perfil de demostración
          </div>

          <div class="profile-switcher-list">
            <button
              v-for="user in userProfiles"
              :key="user.id"
              type="button"
              class="profile-switcher-option"
              :class="{ 'is-current': currentUser.id === user.id }"
              :disabled="currentUser.id === user.id"
              @click="switchProfile(user)"
            >
              <span class="profile-switcher-avatar">{{ user.initials }}</span>
              <span class="profile-switcher-copy">
                <strong>{{ user.name }}</strong>
                <small>{{ ROLE_LABELS[user.role] }}</small>
              </span>
              <AppIcon
                v-if="currentUser.id === user.id"
                name="check"
                :size="15"
              />
            </button>
          </div>

          <div class="popover-divider"></div>

          <RouterLink
            to="/perfil"
            class="profile-menu-link"
            @click="closePopover"
          >
            <AppIcon name="user" :size="17" />
            Mi perfil y permisos
          </RouterLink>

        </div>

      </div>

    </div>

  </header>
</template>

<style scoped>
.app-topbar {
  position: sticky;

  top: 0;

  z-index: 50;

  height: var(--topbar-height);

  display: flex;
  align-items: center;

  gap: 18px;

  padding: 0 22px;

  background: rgba(10, 10, 12, 0.91);

  border-bottom: 1px solid var(--color-border);

  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

/* BUSCADOR */

.topbar-search {
  position: relative;
  width: min(100%, 480px);
  flex: 1;
}

.search-field {
  height: 39px;

  display: flex;
  align-items: center;

  gap: 11px;

  padding: 0 11px;

  border: 1px solid rgba(255, 255, 255, 0.13);

  border-radius: 9px;

  background: rgba(255, 255, 255, 0.025);

  color: var(--color-text-muted);

  transition:
    border-color var(--transition-normal),
    box-shadow var(--transition-normal),
    background var(--transition-normal);
}

.search-field:focus-within {
  border-color: var(--color-border-red);

  background: rgba(255, 48, 69, 0.035);

  box-shadow:
    0 0 0 3px rgba(255, 48, 69, 0.07);
}

.search-field input {
  width: 100%;
  min-width: 0;

  border: 0;
  outline: 0;

  background: transparent;

  color: var(--color-text);

  font-size: 0.79rem;
}

.search-field input::placeholder {
  color: var(--color-text-muted);
}

.search-field kbd {
  flex-shrink: 0;

  padding: 3px 7px;

  border: 1px solid var(--color-border);

  border-radius: 5px;

  color: var(--color-text-secondary);

  font-family: var(--font-family);
  font-size: 0.65rem;
}

.topbar-search-results {
  position: absolute;
  top: calc(100% + 9px);
  left: 0;
  right: 0;
  z-index: 80;

  max-height: min(430px, 65vh);
  overflow-y: auto;

  padding: 8px;

  border: 1px solid var(--color-border);
  border-radius: 11px;

  background: #17171b;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.55);
}

.topbar-search-results__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 8px 10px;
  color: var(--color-text-muted);
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.topbar-search-results__heading small {
  color: var(--color-text-secondary);
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0;
}

.topbar-search-result {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px;
  border-radius: 8px;
  color: var(--color-text-secondary);
  transition: background var(--transition-fast);
}

.topbar-search-result:hover {
  background: rgba(255, 255, 255, 0.055);
  color: var(--color-text);
}

.topbar-search-result > svg:last-child {
  margin-left: auto;
  flex-shrink: 0;
  color: var(--color-text-muted);
}

.topbar-search-result__icon {
  width: 31px;
  height: 31px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: var(--color-red-soft);
  color: var(--color-red-bright);
}

.topbar-search-result__copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.topbar-search-result__copy strong {
  overflow: hidden;
  color: var(--color-text);
  font-size: 0.69rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.topbar-search-result__copy small {
  color: var(--color-text-muted);
  font-size: 0.61rem;
}

.topbar-search-results__empty {
  padding: 15px 9px;
  color: var(--color-text-muted);
  font-size: 0.68rem;
  text-align: center;
}

/* ACCIONES */

.topbar-actions {
  display: flex;
  align-items: center;

  gap: 13px;

  margin-left: auto;
}

.popover-anchor {
  position: relative;
}

/* BOTONES DE ICONOS */

.topbar-icon-button {
  position: relative;

  width: 38px;
  height: 38px;

  display: grid;
  place-items: center;

  border: 1px solid transparent;
  border-radius: 9px;

  color: var(--color-text-secondary);

  background: transparent;

  transition:
    color var(--transition-fast),
    background var(--transition-fast),
    border-color var(--transition-fast);
}

.topbar-icon-button:hover,
.topbar-icon-button.is-open {
  color: #ffffff;

  background: rgba(255, 255, 255, 0.06);

  border-color: var(--color-border);
}

.notification-count {
  position: absolute;

  top: 1px;
  right: 0;

  min-width: 15px;
  height: 15px;

  display: grid;
  place-items: center;

  padding: 0 3px;

  border-radius: 50px;

  color: #ffffff;

  background: var(--color-red-bright);

  box-shadow:
    0 0 9px rgba(255, 48, 69, 0.55);

  font-size: 0.58rem;
  font-weight: 800;
}

/* PERFIL */

.profile-trigger {
  display: flex;
  align-items: center;

  gap: 10px;

  padding: 4px 0 4px 8px;

  border: 0;

  background: transparent;

  color: var(--color-text);

  text-align: left;
}

.profile-avatar {
  width: 36px;
  height: 36px;

  display: grid;
  place-items: center;

  flex-shrink: 0;

  border: 2px solid var(--color-red-bright);

  border-radius: 50%;

  background:
    linear-gradient(
      135deg,
      #5b1824,
      #1b1014
    );

  color: #ffffff;

  box-shadow:
    0 0 12px rgba(255, 48, 69, 0.23);

  font-size: 0.69rem;
  font-weight: 800;
}

.profile-information {
  display: flex;
  flex-direction: column;

  gap: 1px;
}

.profile-information strong {
  font-size: 0.76rem;
  font-weight: 700;
}

.profile-information span {
  color: var(--color-text-muted);

  font-size: 0.66rem;
}

.profile-chevron {
  color: var(--color-text-muted);
}

/* MENÚS DESPLEGABLES */

.topbar-popover {
  position: absolute;

  top: calc(100% + 13px);
  right: 0;

  z-index: 60;

  width: 300px;

  padding: 16px;

  border: 1px solid rgba(255, 255, 255, 0.12);

  border-radius: 12px;

  background: #17171b;

  box-shadow:
    0 15px 45px rgba(0, 0, 0, 0.55),
    0 0 20px rgba(255, 48, 69, 0.06);

  animation: popover-enter 160ms ease;
}

@keyframes popover-enter {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.popover-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 10px;

  padding-bottom: 13px;

  border-bottom: 1px solid var(--color-border);
}

.popover-heading > div {
  display: flex;
  flex-direction: column;

  gap: 3px;
}

.popover-heading strong {
  color: var(--color-text);

  font-size: 0.88rem;
}

.popover-heading span {
  color: var(--color-text-muted);

  font-size: 0.68rem;
}

.popover-heading .popover-counter {
  color: var(--color-red-bright);

  font-weight: 700;
}

/* NOTIFICACIONES */

.notification-entry {
  display: flex;

  gap: 11px;

  padding: 16px 0;
}

.notification-marker {
  width: 9px;
  height: 9px;

  flex-shrink: 0;

  margin-top: 5px;

  border-radius: 50%;

  background: var(--color-red-bright);

  box-shadow:
    0 0 9px var(--color-red-glow);
}

.notification-entry strong {
  color: var(--color-text);

  font-size: 0.76rem;
}

.notification-entry p {
  margin: 5px 0;

  color: var(--color-text-secondary);

  font-size: 0.7rem;
  line-height: 1.6;
}

.notification-entry small {
  color: var(--color-text-muted);

  font-size: 0.64rem;
}

.popover-footer {
  padding-top: 11px;

  border-top: 1px solid var(--color-border);

  color: var(--color-text-muted);

  font-size: 0.68rem;
}

/* AYUDA */

.help-description {
  margin: 15px 0;

  color: var(--color-text-secondary);

  font-size: 0.75rem;
  line-height: 1.7;
}

.help-tip {
  display: flex;

  align-items: flex-start;

  gap: 9px;

  padding: 11px;

  border: 1px solid rgba(255, 48, 69, 0.17);

  border-radius: 8px;

  background: rgba(255, 48, 69, 0.06);

  color: var(--color-text-secondary);

  font-size: 0.69rem;
  line-height: 1.6;
}

.help-tip svg {
  flex-shrink: 0;

  color: var(--color-red-bright);
}

/* PERFIL DESPLEGABLE */

.profile-popover-header {
  display: flex;
  align-items: center;

  gap: 11px;
}

.profile-avatar--large {
  width: 42px;
  height: 42px;
}

.profile-popover-header > div:last-child {
  display: flex;
  flex-direction: column;

  gap: 3px;
}

.profile-popover-header strong {
  font-size: 0.8rem;
}

.profile-popover-header span {
  color: var(--color-text-muted);

  font-size: 0.68rem;
}

.popover-divider {
  height: 1px;
  margin: 14px 0;
  background: var(--color-border);
}

.profile-switcher-heading {
  margin-bottom: 8px;
  color: var(--color-text-muted);
  font-size: 0.61rem;
  font-weight: 750;
  letter-spacing: 0.04em;
}

.profile-switcher-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 240px;
  overflow-y: auto;
}

.profile-switcher-option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 7px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-secondary);
  text-align: left;
  cursor: pointer;
}

.profile-switcher-option:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.055);
}

.profile-switcher-option.is-current {
  border-color: rgba(255, 48, 69, 0.2);
  background: rgba(255, 48, 69, 0.06);
}

.profile-switcher-option:disabled {
  cursor: default;
}

.profile-switcher-avatar {
  width: 29px;
  height: 29px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #54242e;
  color: #fff;
  font-size: 0.56rem;
  font-weight: 800;
}

.profile-switcher-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.profile-switcher-copy strong {
  color: var(--color-text);
  font-size: 0.66rem;
}

.profile-switcher-copy small {
  color: var(--color-text-muted);
  font-size: 0.59rem;
}

.profile-switcher-option > svg {
  margin-left: auto;
  color: #4ade80;
}

.profile-menu-link {
  display: flex;
  align-items: center;

  gap: 10px;

  padding: 9px;

  border-radius: 7px;

  color: var(--color-text-secondary);

  font-size: 0.76rem;

  transition:
    background var(--transition-fast),
    color var(--transition-fast);
}

.profile-menu-link:hover {
  color: #ffffff;

  background: rgba(255, 255, 255, 0.06);
}

/* MENÚ MÓVIL */

.mobile-menu-button {
  display: none;

  width: 38px;
  height: 38px;

  place-items: center;

  border: 1px solid var(--color-border);

  border-radius: 9px;

  background: transparent;

  color: var(--color-text-secondary);
}

/* RESPONSIVE */

@media (max-width: 900px) {
  .mobile-menu-button {
    display: grid;
  }
}

@media (max-width: 600px) {
  .app-topbar {
    gap: 9px;

    padding: 0 12px;
  }

  .topbar-actions {
    gap: 4px;
  }

  .search-field {
    padding: 0 8px;
  }

  .search-field input {
    font-size: 0.7rem;
  }

  .search-field kbd {
    display: none;
  }

  .profile-information,
  .profile-chevron {
    display: none;
  }

  .profile-trigger {
    padding-left: 2px;
  }

  .topbar-popover {
    width: min(290px, calc(100vw - 24px));
  }
}
</style>
