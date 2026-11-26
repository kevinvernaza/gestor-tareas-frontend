
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const accessNotice = computed(() => route.query.acceso === 'restringido')

import {
  dashboardStats,
  recentProjects,
  taskDistribution,
  totalTasks,
  upcomingTasks,
  recentActivities,
  dashboardPeriodLabel,
} from '../data/dashboard'

// Componentes del Dashboard
import StatCard from '../components/dashboard/StatCard.vue'
import ProjectList from '../components/dashboard/ProjectList.vue'
import TaskDistribution from '../components/dashboard/TaskDistribution.vue'
import UpcomingTasks from '../components/dashboard/UpcomingTasks.vue'
import RecentActivity from '../components/dashboard/RecentActivity.vue'

import AppIcon from '../components/ui/AppIcon.vue'
</script>

<template>
  <main class="dashboard-page">

    <!-- =================================
         ENCABEZADO
    ================================== -->

    <header class="dashboard-heading">

      <div class="dashboard-heading__content">

        <span class="dashboard-kicker">
          DASHBOARD
        </span>

        <h1>
          Resumen <span>general</span>
        </h1>

        <p>
          Estado actual de tus proyectos, tareas y equipo.
        </p>

      </div>

      <!-- PERIODO -->
      <div class="dashboard-period">

        <AppIcon name="calendar" :size="17" />

        <span>
          {{ dashboardPeriodLabel }}
        </span>

        <AppIcon
          name="chevron-down"
          :size="14"
          class="period-chevron"
        />

      </div>

    </header>

    <div v-if="accessNotice" class="dashboard-access-notice" role="status">
      <AppIcon name="help" :size="17"/>
      Tu perfil no tiene permiso para acceder a esa sección. Se te ha redirigido al Dashboard.
    </div>

    <!-- =================================
         INDICADORES PRINCIPALES
    ================================== -->

    <section
      class="dashboard-stats"
      aria-label="Indicadores principales"
    >

      <StatCard
        v-for="stat in dashboardStats"
        :key="stat.id"
        :stat="stat"
      />

    </section>

    <!-- =================================
         PRIMERA FILA
         PROYECTOS Y DISTRIBUCIÓN
    ================================== -->

    <section class="dashboard-grid dashboard-grid--top">

      <ProjectList
        :projects="recentProjects"
      />

      <TaskDistribution
        :items="taskDistribution"
        :total="totalTasks"
      />

    </section>

    <!-- =================================
         SEGUNDA FILA
         TAREAS Y ACTIVIDAD
    ================================== -->

    <section class="dashboard-grid dashboard-grid--bottom">

      <UpcomingTasks
        :tasks="upcomingTasks"
      />

      <RecentActivity
        :activities="recentActivities"
      />

    </section>

  </main>
</template>

<style scoped>
/* =====================================
   CONTENEDOR PRINCIPAL
===================================== */

.dashboard-page {
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 14px;
}

/* =====================================
   ENCABEZADO
===================================== */

.dashboard-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  margin-bottom: 1px;
}

.dashboard-heading__content {
  min-width: 0;
}

.dashboard-kicker {
  color: var(--color-red-bright);

  font-size: 0.68rem;
  font-weight: 800;

  letter-spacing: 0.15em;
}

.dashboard-heading h1 {
  margin: 5px 0 3px;

  color: var(--color-text);

  font-size: clamp(1.8rem, 3vw, 2.3rem);

  font-weight: 800;

  letter-spacing: -0.06em;
}

.dashboard-heading h1 span {
  color: var(--color-red-bright);

  text-shadow:
    0 0 25px rgba(255, 48, 69, 0.13);
}

.dashboard-heading p {
  margin: 0;

  color: var(--color-text-secondary);

  font-size: 0.82rem;
}

/* =====================================
   SELECTOR DE PERIODO
===================================== */

.dashboard-period {
  min-height: 42px;

  display: flex;
  align-items: center;

  gap: 9px;

  padding: 0 12px;

  border: 1px solid var(--color-border);

  border-radius: 9px;

  background: var(--color-surface);

  color: var(--color-text-secondary);

  font-size: 0.72rem;
  font-weight: 550;

  white-space: nowrap;
}

.dashboard-period svg:first-child {
  color: var(--color-red-bright);
}

.period-chevron {
  color: var(--color-text-muted);
}

/* =====================================
   TARJETAS ESTADÍSTICAS
===================================== */

.dashboard-stats {
  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: 12px;
}

/* =====================================
   DISTRIBUCIÓN DE PANELES
===================================== */

.dashboard-grid {
  display: grid;

  gap: 14px;

  min-width: 0;
}

.dashboard-grid--top {
  grid-template-columns:
    minmax(0, 1.28fr)
    minmax(0, 0.92fr);
}

.dashboard-grid--bottom {
  grid-template-columns:
    minmax(0, 1.08fr)
    minmax(0, 1fr);
}

/* =====================================
   EFECTO DE APARICIÓN
===================================== */

.dashboard-page > * {
  animation: dashboard-enter 350ms ease both;
}

.dashboard-page > *:nth-child(2) {
  animation-delay: 50ms;
}

.dashboard-page > *:nth-child(3) {
  animation-delay: 100ms;
}

.dashboard-page > *:nth-child(4) {
  animation-delay: 150ms;
}

@keyframes dashboard-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* =====================================
   RESPONSIVE
===================================== */

@media (max-width: 1150px) {
  .dashboard-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dashboard-grid--top,
  .dashboard-grid--bottom {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 650px) {
  .dashboard-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .dashboard-period {
    max-width: 100%;
  }
}

@media (max-width: 420px) {
  .dashboard-stats {
    grid-template-columns: minmax(0, 1fr);
  }

  .dashboard-period {
    width: 100%;
    justify-content: space-between;

    font-size: 0.66rem;
  }
}

.dashboard-access-notice {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 11px 13px;
  border: 1px solid rgba(245, 158, 11, 0.24);
  border-radius: 9px;
  background: rgba(245, 158, 11, 0.07);
  color: #fbbf24;
  font-size: 0.7rem;
  line-height: 1.5;
}

.dashboard-access-notice svg {
  flex-shrink: 0;
}
</style>
