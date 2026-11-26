
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'

import {
  projects,
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
} from '../data/projects'
import { getProjectProgress } from '../data/tasks'

import {
  canCreateProject,
  canViewProject,
} from '../data/auth'

import AppIcon from '../components/ui/AppIcon.vue'
import SearchFilters from '../components/ui/SearchFilters.vue'
import ProjectCard from '../components/projects/ProjectCard.vue'
import ProjectFormModal from '../components/projects/ProjectFormModal.vue'
import FeedbackState from '../components/ui/FeedbackState.vue'
import { notify } from '../data/uiFeedback'

const showProjectForm = ref(false)
const isLoading = ref(true)
let loadingTimer = null

onMounted(() => {
  // Simula una consulta inicial a la API para demostrar el estado de carga.
  loadingTimer = window.setTimeout(() => {
    isLoading.value = false
  }, 350)
})

onUnmounted(() => {
  if (loadingTimer) window.clearTimeout(loadingTimer)
})

const filters = reactive({
  query: '',
  status: '',
  priority: '',
})

const availableProjects = computed(() =>
  projects.filter(project => canViewProject(project))
)

const filteredProjects = computed(() => {
  const query = filters.query.trim().toLocaleLowerCase('es')

  return availableProjects.value.filter(project => {
    const matchesQuery = !query || [
      project.name,
      project.description,
      project.category,
      project.owner,
      ...project.members.map(member => member.name),
    ].some(value => String(value || '').toLocaleLowerCase('es').includes(query))

    const matchesStatus = !filters.status || project.status === filters.status
    const matchesPriority = !filters.priority || project.priority === filters.priority

    return matchesQuery && matchesStatus && matchesPriority
  })
})

function updateFilters(nextFilters) {
  Object.assign(filters, nextFilters)
}

function clearFilters() {
  Object.assign(filters, {
    query: '',
    status: '',
    priority: '',
  })
}

function handleProjectSaved(project) {
  notify({
    type: 'success',
    title: 'Proyecto guardado',
    message: `El proyecto "${project.name}" se guardó correctamente.`,
  })
}

/*
=========================================
INDICADORES DEL PERFIL ACTUAL
=========================================
*/

const activeProjects = computed(() =>
  availableProjects.value.filter(project =>
    !['Completado', 'Pausado'].includes(project.status)
  )
)

const completedProjects = computed(() =>
  availableProjects.value.filter(project => project.status === 'Completado')
)

const averageProgress = computed(() => {
  if (!availableProjects.value.length) return 0

  const total = availableProjects.value.reduce(
    (sum, project) => sum + getProjectProgress(project.id),
    0
  )

  return Math.round(total / availableProjects.value.length)
})

const summaryCards = computed(() => [
  {
    id: 1,
    label: 'Proyectos visibles',
    value: availableProjects.value.length,
    icon: 'layers',
    tone: 'red',
  },
  {
    id: 2,
    label: 'Proyectos activos',
    value: activeProjects.value.length,
    icon: 'briefcase',
    tone: 'red',
  },
  {
    id: 3,
    label: 'Proyectos completados',
    value: completedProjects.value.length,
    icon: 'check',
    tone: 'green',
  },
  {
    id: 4,
    label: 'Avance promedio',
    value: `${averageProgress.value}%`,
    icon: 'chart',
    tone: 'amber',
  },
])

const projectFilters = computed(() => [
  {
    key: 'status',
    label: 'Estado',
    placeholder: 'Todos los estados',
    options: PROJECT_STATUSES.map(value => ({ value, label: value })),
  },
  {
    key: 'priority',
    label: 'Prioridad',
    placeholder: 'Todas las prioridades',
    options: PROJECT_PRIORITIES.map(value => ({ value, label: value })),
  },
])
</script>

<template>
  <main class="projects-page">

    <!-- =================================
         ENCABEZADO
    ================================== -->

    <header class="projects-heading">

      <div class="projects-heading__content">

        <span class="projects-kicker">
          GESTIÓN DE PROYECTOS
        </span>

        <h1>
          Todos los <span>proyectos</span>
        </h1>

        <p>
          Organiza, supervisa y controla el avance de tus proyectos.
        </p>

      </div>

      <div class="projects-heading__action">

        <button
          v-if="canCreateProject()"
          type="button"
          class="new-project-button"
          @click="showProjectForm = true"
        >
          <AppIcon name="plus" :size="18"/>
          Nuevo proyecto
        </button>

      </div>

    </header>


    <!-- =================================
         INDICADORES
    ================================== -->

    <section
      class="projects-summary"
      aria-label="Resumen de proyectos"
    >

      <article
        v-for="item in summaryCards"
        :key="item.id"
        class="summary-card"
        :class="`summary-card--${item.tone}`"
      >

        <div class="summary-card__icon">
          <AppIcon :name="item.icon" :size="21"/>
        </div>

        <div class="summary-card__information">

          <strong>{{ item.value }}</strong>

          <span>{{ item.label }}</span>

        </div>

      </article>

    </section>

    <!-- =================================
         LISTADO DE PROYECTOS
    ================================== -->

    <section class="projects-section">

      <header class="projects-section__header">

        <div>

          <h2>Proyectos registrados</h2>

          <p>
            Consulta la información y el avance de cada proyecto.
          </p>

        </div>

        <span class="projects-total">
          {{ filteredProjects.length }} de {{ availableProjects.length }} proyectos
        </span>

      </header>

      <SearchFilters
        :model-value="filters"
        :filters="projectFilters"
        placeholder="Buscar por nombre, descripción, categoría, responsable o integrante..."
        :result-count="filteredProjects.length"
        :total-count="availableProjects.length"
        @update:model-value="updateFilters"
        @clear="clearFilters"
      />

      <!-- ESTADO DE CARGA -->
      <FeedbackState
        v-if="isLoading"
        variant="loading"
        title="Cargando proyectos"
        description="Estamos preparando los proyectos disponibles para tu perfil."
      />

      <!-- CUADRÍCULA DE RESULTADOS -->
      <div
        v-else-if="filteredProjects.length"
        class="projects-grid"
      >
        <ProjectCard
          v-for="project in filteredProjects"
          :key="project.id"
          :project="project"
        />
      </div>

      <!-- ESTADO VACÍO -->
      <FeedbackState
        v-else
        variant="empty"
        :icon="availableProjects.length ? 'search' : 'folder'"
        :title="availableProjects.length ? 'No encontramos proyectos' : 'No tienes proyectos disponibles'"
        :description="availableProjects.length
          ? 'No hay proyectos que coincidan con tu búsqueda o con los filtros seleccionados.'
          : 'Tu perfil todavía no está asociado a ningún proyecto.'"
        :action-label="availableProjects.length ? 'Limpiar búsqueda y filtros' : ''"
        @action="clearFilters"
      />

      <!-- NOTA INFORMATIVA -->
      <div class="projects-information">
        <AppIcon name="check" :size="16"/>
        <p>
          Puedes combinar la búsqueda con los filtros de estado y prioridad.
          Los resultados se actualizan automáticamente según tu perfil.
        </p>
      </div>

    </section>

    <ProjectFormModal
      v-if="canCreateProject()"
      :show="showProjectForm"
      @close="showProjectForm = false"
      @saved="handleProjectSaved"
    />

  </main>
</template>

<style scoped>
/* =====================================
   PÁGINA PRINCIPAL
===================================== */

.projects-page {
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 23px;
}

/* =====================================
   ENCABEZADO
===================================== */

.projects-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;
}

.projects-heading__content {
  min-width: 0;
}

.projects-kicker {
  color: var(--color-red-bright);

  font-size: 0.68rem;
  font-weight: 800;

  letter-spacing: 0.15em;
}

.projects-heading h1 {
  margin: 6px 0 4px;

  color: var(--color-text);

  font-size: clamp(1.8rem, 3vw, 2.3rem);

  font-weight: 800;

  letter-spacing: -0.06em;
}

.projects-heading h1 span {
  color: var(--color-red-bright);
}

.projects-heading p {
  margin: 0;

  color: var(--color-text-secondary);

  font-size: 0.83rem;
}

/* BOTÓN PREPARADO */

.projects-heading__action {
  display: flex;
  flex-direction: column;

  align-items: flex-end;

  gap: 6px;
}

.new-project-button {
  display: flex;
  align-items: center;

  gap: 8px;

  padding: 11px 15px;

  border: 1px solid rgba(255, 48, 69, 0.3);

  border-radius: 9px;

  background: var(--color-red-soft);

  color: var(--color-red-bright);

  font-size: 0.76rem;
  font-weight: 700;

  cursor: pointer;

  transition: all var(--transition-fast);
}

.action-hint {
  color: var(--color-text-muted);

  font-size: 0.62rem;
}

.new-project-button:hover {
  border-color: var(--color-border-red);
  background: rgba(255, 48, 69, 0.18);
  box-shadow: 0 0 16px rgba(255, 48, 69, 0.08);
}

/* =====================================
   INDICADORES
===================================== */

.projects-summary {
  display: grid;

  grid-template-columns: repeat(4, minmax(0, 1fr));

  gap: 12px;
}

.summary-card {
  min-width: 0;
  min-height: 93px;

  display: flex;
  align-items: center;

  gap: 13px;

  padding: 15px;

  border: 1px solid var(--color-border);

  border-radius: var(--radius-lg);

  background: var(--color-surface);

  transition:
    transform var(--transition-normal),
    border-color var(--transition-normal);
}

.summary-card:hover {
  transform: translateY(-2px);

  border-color: var(--color-border-hover);
}

.summary-card__icon {
  width: 43px;
  height: 43px;

  display: grid;
  place-items: center;

  flex-shrink: 0;

  border: 1px solid currentColor;

  border-radius: 11px;
}

.summary-card__information {
  display: flex;
  flex-direction: column;

  gap: 3px;

  min-width: 0;
}

.summary-card__information strong {
  color: var(--color-text);

  font-size: 1.5rem;
  font-weight: 800;

  line-height: 1.1;
}

.summary-card__information span {
  color: var(--color-text-secondary);

  font-size: 0.69rem;
  font-weight: 550;
}

/* COLORES */

.summary-card--red {
  color: var(--color-red-bright);
}

.summary-card--red .summary-card__icon {
  background: var(--color-red-soft);
}

.summary-card--green {
  color: var(--color-success);
}

.summary-card--green .summary-card__icon {
  background: var(--color-success-soft);
}

.summary-card--amber {
  color: var(--color-warning);
}

.summary-card--amber .summary-card__icon {
  background: var(--color-warning-soft);
}

/* =====================================
   SECCIÓN DE PROYECTOS
===================================== */

.projects-section {
  display: flex;
  flex-direction: column;

  gap: 17px;
}

.projects-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;
}

.projects-section__header h2 {
  margin: 0 0 4px;

  color: var(--color-text);

  font-size: 1.02rem;
  font-weight: 750;
}

.projects-section__header p {
  margin: 0;

  color: var(--color-text-secondary);

  font-size: 0.74rem;
}

.projects-total {
  padding: 7px 11px;

  border: 1px solid var(--color-border);

  border-radius: 30px;

  color: var(--color-text-secondary);

  font-size: 0.68rem;
  font-weight: 650;

  white-space: nowrap;
}

/* =====================================
   CUADRÍCULA
===================================== */

.projects-grid {
  display: grid;

  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 15px;
}


/* =====================================
   INFORMACIÓN
===================================== */

.projects-information {
  display: flex;
  align-items: center;

  gap: 9px;

  padding: 12px 14px;

  border: 1px solid var(--color-border);

  border-radius: 9px;

  background: rgba(255, 255, 255, 0.018);
}

.projects-information svg {
  flex-shrink: 0;

  color: var(--color-success);
}

.projects-information p {
  margin: 0;

  color: var(--color-text-muted);

  font-size: 0.69rem;
  line-height: 1.5;
}

/* =====================================
   RESPONSIVE
===================================== */

@media (max-width: 1200px) {
  .projects-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .projects-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .projects-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .projects-heading__action {
    align-items: flex-start;
  }

  .projects-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .projects-section__header {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 420px) {
  .projects-summary {
    grid-template-columns: minmax(0, 1fr);
  }
}

</style>
