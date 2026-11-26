
<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import AppIcon from '../ui/AppIcon.vue'
import CircularGoal from '../ui/CircularGoal.vue'
import { currentUser } from '../../data/auth'
import { monthlyGoalProgress, monthlyTaskCount } from '../../data/dashboard'

defineProps({
  mobileOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const navigationItems = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    to: '/',
  },
  {
    label: 'Proyectos',
    icon: 'folder',
    to: '/proyectos',
  },
  {
    label: 'Tareas',
    icon: 'tasks',
    to: '/tareas',
  },
  {
    label: 'Mi equipo',
    icon: 'users',
    to: '/equipo',
    roles: ['admin', 'coordinator'],
  },
  {
    label: 'Reportes',
    icon: 'chart',
    to: '/reportes',
    roles: ['admin', 'coordinator'],
  },
  {
    label: 'Mi perfil',
    icon: 'user',
    to: '/perfil',
  },
 ]

const visibleNavigationItems = computed(() =>
  navigationItems.filter(item =>
    !item.roles || item.roles.includes(currentUser.value.role)
  )
)
</script>

<template>
  <aside
    class="app-sidebar"
    :class="{ 'is-open': mobileOpen }"
    aria-label="Navegación principal"
  >

    <!-- IDENTIDAD -->
    <RouterLink
      to="/"
      class="sidebar-brand"
      @click="emit('close')"
    >

      <div class="sidebar-brand__logo">
        <AppIcon name="brand" :size="37" :stroke-width="2" />
      </div>

      <div class="sidebar-brand__copy">
        <strong>Gestor</strong>
        <span>Tareas y Proyectos</span>
      </div>

    </RouterLink>

    <!-- NAVEGACIÓN -->
    <div class="sidebar-section-label">
      MENÚ PRINCIPAL
    </div>

    <nav class="sidebar-nav">

      <RouterLink
        v-for="item in visibleNavigationItems"
        :key="item.to"
        :to="item.to"
        class="sidebar-link"
        active-class="is-active"
        exact-active-class="is-active"
        @click="emit('close')"
      >

        <AppIcon :name="item.icon" :size="19" />

        <span>{{ item.label }}</span>

      </RouterLink>

    </nav>

    <!-- PARTE INFERIOR -->
    <div class="sidebar-lower">

      <!-- FIGURA GEOMÉTRICA -->
      <div class="sidebar-graphic" aria-hidden="true">

        <svg
          viewBox="0 0 204 72"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0 62L45 42L77 57L117 15L154 44L204 20"
            stroke="#E32636"
            stroke-width="1.1"
            opacity="0.75"
          />

          <path
            d="M0 69L45 49L77 64L117 22L154 51L204 27"
            stroke="#FF3045"
            stroke-width="0.7"
            opacity="0.45"
          />

          <path
            d="M77 57L117 15L154 44"
            stroke="#FF3045"
            stroke-width="1"
            opacity="0.8"
          />

          <path
            d="M117 15L117 72"
            stroke="#E32636"
            stroke-width="0.6"
            opacity="0.35"
          />

          <circle
            cx="117"
            cy="15"
            r="3"
            fill="#FF3045"
          />
        </svg>

      </div>

      <!-- META MENSUAL -->
      <CircularGoal :progress="monthlyGoalProgress" :label="monthlyTaskCount ? 'COMPLETADO' : 'SIN TAREAS'" />

      <!-- PIE -->
      <footer class="sidebar-footer">
        <span>© 2026 Gestor</span>
        <span>v1.0</span>
      </footer>

    </div>

  </aside>
</template>

<style scoped>
.app-sidebar {
  position: fixed;

  top: 0;
  left: 0;
  bottom: 0;

  z-index: 100;

  width: var(--sidebar-width);

  display: flex;
  flex-direction: column;

  padding: 16px 11px 12px;

  overflow-y: auto;
  overflow-x: hidden;

  background:
    radial-gradient(
      ellipse at 0% 95%,
      rgba(153, 27, 43, 0.12),
      transparent 38%
    ),
    linear-gradient(
      180deg,
      #0b0b0d,
      #101013
    );

  border-right: 1px solid var(--color-border);

  box-shadow:
    8px 0 35px rgba(0, 0, 0, 0.22);

  transition:
    transform var(--transition-normal);
}

/* MARCA */

.sidebar-brand {
  min-height: 57px;

  display: flex;
  align-items: center;

  gap: 9px;

  padding: 0 7px;

  margin-bottom: 25px;
}

.sidebar-brand__logo {
  width: 38px;
  height: 38px;

  display: grid;
  place-items: center;

  flex-shrink: 0;

  color: var(--color-red-bright);

  filter: drop-shadow(
    0 0 7px rgba(255, 48, 69, 0.35)
  );
}

.sidebar-brand__copy {
  display: flex;
  flex-direction: column;

  min-width: 0;
}

.sidebar-brand__copy strong {
  color: #ffffff;

  font-size: 1.35rem;
  font-weight: 800;

  letter-spacing: -0.055em;
  line-height: 1.1;
}

.sidebar-brand__copy span {
  margin-top: 3px;

  color: var(--color-text-secondary);

  font-size: 0.59rem;
  font-weight: 650;

  letter-spacing: 0.035em;

  white-space: nowrap;
}

/* ETIQUETA DE NAVEGACIÓN */

.sidebar-section-label {
  padding: 0 11px;

  margin-bottom: 11px;

  color: var(--color-text-muted);

  font-size: 0.59rem;
  font-weight: 800;

  letter-spacing: 0.13em;
}

/* ENLACES */

.sidebar-nav {
  display: flex;
  flex-direction: column;

  gap: 5px;
}

.sidebar-link {
  position: relative;

  min-height: 40px;

  display: flex;
  align-items: center;

  gap: 11px;

  padding: 0 12px;

  overflow: hidden;

  color: var(--color-text-secondary);

  border: 1px solid transparent;
  border-radius: 9px;

  font-size: 0.79rem;
  font-weight: 500;

  transition:
    background var(--transition-normal),
    color var(--transition-normal),
    border-color var(--transition-normal);
}

.sidebar-link svg {
  flex-shrink: 0;

  transition:
    color var(--transition-normal),
    filter var(--transition-normal);
}

.sidebar-link:hover {
  color: #ffffff;

  background: rgba(255, 255, 255, 0.045);
}

.sidebar-link.is-active {
  color: #ffffff;

  border-color: rgba(255, 48, 69, 0.24);

  background:
    linear-gradient(
      90deg,
      rgba(227, 38, 54, 0.30),
      rgba(153, 27, 43, 0.12)
    );

  box-shadow:
    inset 0 0 20px rgba(255, 48, 69, 0.05),
    0 0 15px rgba(255, 48, 69, 0.07);
}

.sidebar-link.is-active::before {
  content: "";

  position: absolute;

  top: 0;
  left: 0;
  bottom: 0;

  width: 3px;

  background: var(--color-red-bright);

  box-shadow:
    0 0 12px var(--color-red-bright);
}

.sidebar-link.is-active svg {
  color: var(--color-red-bright);

  filter:
    drop-shadow(0 0 5px rgba(255, 48, 69, 0.5));
}

/* ZONA INFERIOR */

.sidebar-lower {
  margin-top: auto;

  padding-top: 17px;
}

.sidebar-graphic {
  height: 54px;

  margin: 0 -11px 7px;

  opacity: 0.9;

  overflow: hidden;

  background:
    linear-gradient(
      180deg,
      transparent,
      rgba(227, 38, 54, 0.035)
    );
}

.sidebar-graphic svg {
  width: 100%;
  height: 100%;
}

/* PIE */

.sidebar-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 11px 5px 0;

  margin-top: 12px;

  border-top: 1px solid var(--color-border);

  color: var(--color-text-muted);

  font-size: 0.62rem;
}

/* RESPONSIVE */

@media (max-width: 900px) {
  .app-sidebar {
    transform: translateX(-100%);
  }

  .app-sidebar.is-open {
    transform: translateX(0);
  }
}

@media (max-height: 680px) {
  .sidebar-graphic {
    display: none;
  }

  .sidebar-lower {
    padding-top: 8px;
  }

  .monthly-goal {
    gap: 10px;
  }
}
</style>
