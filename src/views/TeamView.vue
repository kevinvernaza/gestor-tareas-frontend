<script setup>
import { computed } from 'vue'

import AppIcon from '../components/ui/AppIcon.vue'

import {
  currentUser,
  userProfiles,
  ROLE_LABELS,
  getVisibleProjects,
  getVisibleTasks,
} from '../data/auth'

const visibleProjectList = computed(() => getVisibleProjects())
const visibleTaskList = computed(() => getVisibleTasks())

const teamUsers = computed(() => {
  if (currentUser.value.role === 'admin') {
    return userProfiles
  }

  const names = new Set([
    currentUser.value.name,
    ...visibleProjectList.value.flatMap(project =>
      project.members.map(member => member.name)
    ),
  ])

  return userProfiles.filter(user => names.has(user.name))
})

function userProjectCount(user) {
  return visibleProjectList.value.filter(project =>
    project.members.some(member => member.name === user.name)
  ).length
}

function userTaskCount(user) {
  return visibleTaskList.value.filter(task =>
    task.responsibleName === user.name
  ).length
}
</script>

<template>
  <main class="team-page">
    <header class="team-heading">
      <div>
        <span class="team-kicker">COLABORACIÓN</span>
        <h1>Mi <span>equipo</span></h1>
        <p>Consulta los integrantes y los perfiles que participan en los proyectos visibles para tu cuenta.</p>
      </div>
      <div class="team-heading__icon">
        <AppIcon name="users" :size="25"/>
      </div>
    </header>

    <section class="team-summary">
      <article>
        <AppIcon name="users" :size="20"/>
        <div><strong>{{ teamUsers.length }}</strong><span>Integrantes visibles</span></div>
      </article>
      <article>
        <AppIcon name="folder" :size="20"/>
        <div><strong>{{ visibleProjectList.length }}</strong><span>Proyectos visibles</span></div>
      </article>
      <article>
        <AppIcon name="tasks" :size="20"/>
        <div><strong>{{ visibleTaskList.length }}</strong><span>Tareas del equipo</span></div>
      </article>
    </section>

    <section class="team-grid">
      <article v-for="user in teamUsers" :key="user.id" class="team-card">
        <div class="team-card__top">
          <div class="team-avatar">{{ user.initials }}</div>
          <span class="team-role" :class="`role--${user.role}`">
            {{ ROLE_LABELS[user.role] }}
          </span>
        </div>
        <h2>{{ user.name }}</h2>
        <p>{{ user.position }}</p>
        <div class="team-card__meta">
          <span><AppIcon name="briefcase" :size="14"/> {{ userProjectCount(user) }} proyectos</span>
          <span><AppIcon name="tasks" :size="14"/> {{ userTaskCount(user) }} tareas asignadas</span>
        </div>
        <div class="team-card__email">{{ user.email }}</div>
      </article>
    </section>

    <div class="team-note">
      <AppIcon name="help" :size="17"/>
      <p>Directorio de demostración. Los integrantes y sus roles se utilizan para probar la experiencia de acceso de cada tipo de usuario.</p>
    </div>
  </main>
</template>

<style scoped>
.team-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.team-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.team-kicker {
  color: var(--color-red-bright);
  font-size: 0.63rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.team-heading h1 {
  margin: 6px 0 4px;
  color: var(--color-text);
  font-size: clamp(1.8rem, 3vw, 2.3rem);
  font-weight: 800;
  letter-spacing: -0.06em;
}

.team-heading h1 span {
  color: var(--color-red-bright);
}

.team-heading p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.76rem;
  line-height: 1.6;
}

.team-heading__icon {
  width: 55px;
  height: 55px;
  display: grid;
  place-items: center;
  border: 1px solid var(--color-border-red);
  border-radius: 14px;
  background: var(--color-red-soft);
  color: var(--color-red-bright);
}

.team-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.team-summary article {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
}

.team-summary article > svg {
  color: var(--color-red-bright);
}

.team-summary article div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.team-summary strong {
  color: var(--color-text);
  font-size: 1.3rem;
}

.team-summary span {
  color: var(--color-text-secondary);
  font-size: 0.67rem;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 13px;
}

.team-card {
  min-width: 0;
  padding: 17px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  transition: transform var(--transition-normal), border-color var(--transition-normal);
}

.team-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-border-hover);
}

.team-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 9px;
}

.team-avatar {
  width: 43px;
  height: 43px;
  display: grid;
  place-items: center;
  border: 2px solid var(--color-red-bright);
  border-radius: 50%;
  background: linear-gradient(135deg, #5b1824, #1b1014);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 800;
}

.team-role {
  padding: 5px 8px;
  border: 1px solid transparent;
  border-radius: 30px;
  font-size: 0.59rem;
  font-weight: 750;
  white-space: nowrap;
}

.team-role.role--admin {
  border-color: rgba(255, 48, 69, 0.28);
  background: rgba(255, 48, 69, 0.11);
  color: #ff6575;
}

.team-role.role--coordinator {
  border-color: rgba(96, 165, 250, 0.25);
  background: rgba(96, 165, 250, 0.10);
  color: #7db7ff;
}

.team-role.role--collaborator {
  border-color: rgba(34, 197, 94, 0.23);
  background: rgba(34, 197, 94, 0.09);
  color: #4ade80;
}

.team-card h2 {
  margin: 13px 0 3px;
  color: var(--color-text);
  font-size: 0.86rem;
}

.team-card > p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.67rem;
}

.team-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

.team-card__meta span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--color-text-secondary);
  font-size: 0.63rem;
}

.team-card__meta svg {
  color: var(--color-red-bright);
}

.team-card__email {
  margin-top: 11px;
  overflow-wrap: anywhere;
  color: var(--color-text-muted);
  font-size: 0.62rem;
}

.team-note {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.018);
}

.team-note svg {
  flex-shrink: 0;
  color: var(--color-red-bright);
}

.team-note p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.67rem;
  line-height: 1.6;
}

@media (max-width: 900px) {
  .team-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .team-summary,
  .team-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
