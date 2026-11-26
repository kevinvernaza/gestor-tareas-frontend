<script setup>
import { computed, ref } from 'vue'

import AppIcon from '../components/ui/AppIcon.vue'

import {
  currentUser,
  userProfiles,
  ROLE_LABELS,
  ROLE_DESCRIPTIONS,
  getRolePermissions,
  setCurrentUser,
} from '../data/auth'

import { notify } from '../data/uiFeedback'

const feedback = ref('')

const permissions = computed(() =>
  getRolePermissions(currentUser.value.role)
)

function activateProfile(user) {
  const result = setCurrentUser(user.id)

  feedback.value = result.message

  notify({
    type: result.ok ? 'success' : 'error',
    title: result.ok ? 'Perfil cambiado' : 'No se pudo cambiar el perfil',
    message: result.message,
  })
}
</script>

<template>
  <main class="profile-page">
    <header class="profile-page__heading">
      <div>
        <span class="profile-page__kicker">CUENTA Y ACCESOS</span>
        <h1>Mi <span>perfil</span></h1>
        <p>Consulta el perfil activo y prueba los distintos niveles de acceso de la aplicación.</p>
      </div>
      <div class="profile-page__heading-icon">
        <AppIcon name="user" :size="25"/>
      </div>
    </header>

    <div v-if="feedback" class="profile-feedback" role="status">
      <AppIcon name="check" :size="16"/>
      {{ feedback }}
    </div>

    <section class="profile-current-card">
      <div class="profile-current-card__identity">
        <div class="profile-avatar-large">{{ currentUser.initials }}</div>
        <div>
          <span class="profile-current-card__eyebrow">PERFIL ACTIVO</span>
          <h2>{{ currentUser.name }}</h2>
          <p>{{ currentUser.position }}</p>
        </div>
      </div>

      <span class="profile-role-badge" :class="`role--${currentUser.role}`">
        {{ ROLE_LABELS[currentUser.role] }}
      </span>

      <div class="profile-current-card__details">
        <div>
          <span>Correo electrónico</span>
          <strong>{{ currentUser.email }}</strong>
        </div>
        <div>
          <span>Área</span>
          <strong>{{ currentUser.department }}</strong>
        </div>
        <div>
          <span>Identificador</span>
          <strong>{{ currentUser.id }}</strong>
        </div>
      </div>
    </section>

    <section class="profile-permissions">
      <header>
        <div>
          <span class="profile-page__kicker">PERMISOS DEL ROL</span>
          <h2>¿Qué puedes hacer?</h2>
        </div>
        <AppIcon name="settings" :size="21"/>
      </header>

      <p>{{ ROLE_DESCRIPTIONS[currentUser.role] }}</p>

      <ul>
        <li v-for="permission in permissions" :key="permission">
          <AppIcon name="check" :size="16"/>
          {{ permission }}
        </li>
      </ul>
    </section>

    <section class="profile-switcher">
      <header>
        <div>
          <span class="profile-page__kicker">MODO DE DEMOSTRACIÓN</span>
          <h2>Cambiar perfil de usuario</h2>
          <p>Selecciona un usuario para comprobar cómo cambian sus permisos y la información visible.</p>
        </div>
      </header>

      <div class="profile-user-grid">
        <article
          v-for="user in userProfiles"
          :key="user.id"
          class="profile-user-card"
          :class="{ 'profile-user-card--active': currentUser.id === user.id }"
        >
          <div class="profile-user-card__top">
            <div class="profile-avatar">{{ user.initials }}</div>
            <span class="profile-role-badge" :class="`role--${user.role}`">
              {{ ROLE_LABELS[user.role] }}
            </span>
          </div>

          <strong>{{ user.name }}</strong>
          <span>{{ user.position }}</span>

          <button
            type="button"
            :disabled="currentUser.id === user.id"
            @click="activateProfile(user)"
          >
            {{ currentUser.id === user.id ? 'Perfil activo' : 'Usar este perfil' }}
          </button>
        </article>
      </div>
    </section>

    <div class="profile-demo-note">
      <AppIcon name="help" :size="17"/>
      <p>
        Esta selección de usuario es una simulación local para demostrar los roles.
        No es un sistema de inicio de sesión ni reemplaza la autenticación del Backend.
      </p>
    </div>
  </main>
</template>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-page__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.profile-page__kicker {
  color: var(--color-red-bright);
  font-size: 0.63rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.profile-page__heading h1 {
  margin: 6px 0 4px;
  color: var(--color-text);
  font-size: clamp(1.8rem, 3vw, 2.3rem);
  font-weight: 800;
  letter-spacing: -0.06em;
}

.profile-page__heading h1 span {
  color: var(--color-red-bright);
}

.profile-page__heading p,
.profile-switcher header p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.76rem;
  line-height: 1.6;
}

.profile-page__heading-icon {
  width: 55px;
  height: 55px;
  display: grid;
  place-items: center;
  border: 1px solid var(--color-border-red);
  border-radius: 14px;
  background: var(--color-red-soft);
  color: var(--color-red-bright);
}

.profile-feedback {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 11px 13px;
  border: 1px solid rgba(34, 197, 94, 0.22);
  border-radius: 9px;
  background: rgba(34, 197, 94, 0.07);
  color: #4ade80;
  font-size: 0.7rem;
}

.profile-current-card,
.profile-permissions,
.profile-switcher {
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
}

.profile-current-card {
  background:
    radial-gradient(ellipse at 0% 0%, rgba(255, 48, 69, 0.11), transparent 48%),
    var(--color-surface);
}

.profile-current-card__identity {
  display: flex;
  align-items: center;
  gap: 14px;
}

.profile-avatar-large,
.profile-avatar {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border: 2px solid var(--color-red-bright);
  border-radius: 50%;
  background: linear-gradient(135deg, #5b1824, #1b1014);
  color: #fff;
  font-size: 0.83rem;
  font-weight: 800;
  box-shadow: 0 0 12px rgba(255, 48, 69, 0.18);
}

.profile-current-card__eyebrow {
  color: var(--color-red-bright);
  font-size: 0.59rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.profile-current-card h2 {
  margin: 3px 0;
  color: var(--color-text);
  font-size: 1.12rem;
}

.profile-current-card p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.7rem;
}

.profile-role-badge {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 5px 9px;
  border: 1px solid transparent;
  border-radius: 30px;
  font-size: 0.62rem;
  font-weight: 750;
  white-space: nowrap;
}

.role--admin {
  border-color: rgba(255, 48, 69, 0.28);
  background: rgba(255, 48, 69, 0.11);
  color: #ff6575;
}

.role--coordinator {
  border-color: rgba(96, 165, 250, 0.25);
  background: rgba(96, 165, 250, 0.10);
  color: #7db7ff;
}

.role--collaborator {
  border-color: rgba(34, 197, 94, 0.23);
  background: rgba(34, 197, 94, 0.09);
  color: #4ade80;
}

.profile-current-card > .profile-role-badge {
  margin-top: 15px;
}

.profile-current-card__details {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 15px;
  margin-top: 19px;
  padding-top: 17px;
  border-top: 1px solid var(--color-border);
}

.profile-current-card__details div {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.profile-current-card__details span {
  color: var(--color-text-muted);
  font-size: 0.63rem;
}

.profile-current-card__details strong {
  overflow-wrap: anywhere;
  color: var(--color-text);
  font-size: 0.69rem;
}

.profile-permissions header,
.profile-switcher header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.profile-permissions header > svg {
  color: var(--color-red-bright);
}

.profile-permissions h2,
.profile-switcher h2 {
  margin: 5px 0 0;
  color: var(--color-text);
  font-size: 0.98rem;
}

.profile-permissions > p {
  margin: 12px 0;
  color: var(--color-text-secondary);
  font-size: 0.72rem;
  line-height: 1.6;
}

.profile-permissions ul {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 18px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.profile-permissions li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: var(--color-text-secondary);
  font-size: 0.68rem;
  line-height: 1.5;
}

.profile-permissions li svg {
  flex-shrink: 0;
  margin-top: 1px;
  color: #4ade80;
}

.profile-user-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 17px;
}

.profile-user-card {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 9px;
  padding: 14px;
  border: 1px solid var(--color-border);
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.018);
  transition: border-color var(--transition-fast), transform var(--transition-fast);
}

.profile-user-card--active {
  border-color: var(--color-border-red);
  background: rgba(255, 48, 69, 0.045);
}

.profile-user-card__top {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.profile-user-card .profile-avatar {
  width: 39px;
  height: 39px;
  font-size: 0.65rem;
}

.profile-user-card > strong {
  color: var(--color-text);
  font-size: 0.75rem;
}

.profile-user-card > span:not(.profile-role-badge) {
  color: var(--color-text-muted);
  font-size: 0.64rem;
}

.profile-user-card button {
  width: 100%;
  min-height: 34px;
  margin-top: 3px;
  border: 1px solid var(--color-border-red);
  border-radius: 8px;
  background: var(--color-red-soft);
  color: var(--color-red-bright);
  font-size: 0.65rem;
  font-weight: 750;
}

.profile-user-card button:disabled {
  border-color: var(--color-border);
  background: rgba(255, 255, 255, 0.035);
  color: var(--color-text-muted);
  cursor: default;
}

.profile-demo-note {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.018);
}

.profile-demo-note svg {
  flex-shrink: 0;
  color: var(--color-red-bright);
}

.profile-demo-note p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.67rem;
  line-height: 1.6;
}

@media (max-width: 850px) {
  .profile-user-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .profile-current-card__details,
  .profile-permissions ul,
  .profile-user-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
