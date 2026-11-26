
<script setup>
import { computed, ref } from 'vue'

import { useRoute, RouterLink } from 'vue-router'

import { projects, formatProjectDate } from '../data/projects'
import { getProjectTaskStats } from '../data/tasks'
import { canViewProject, canManageProject } from '../data/auth'
import ProjectFormModal from '../components/projects/ProjectFormModal.vue'

import AppIcon from '../components/ui/AppIcon.vue'

import ProjectStatusBadge from '../components/projects/ProjectStatusBadge.vue'

import ProjectTasksPanel from '../components/projects/ProjectTasksPanel.vue'
import { notify } from '../data/uiFeedback'

/*
=========================================
OBTENER PROYECTO SELECCIONADO
=========================================
*/

const route = useRoute()

const showProjectForm = ref(false)
const formFeedback = ref('')

function handleProjectSaved(savedProject) {
  formFeedback.value = `La información de "${savedProject.name}" se actualizó correctamente.`

  notify({
    type: 'success',
    title: 'Proyecto actualizado',
    message: `Se guardaron los cambios de "${savedProject.name}".`,
  })
}

const project = computed(() => {
  const found = projects.find(
    item => item.id === String(route.params.id)
  )

  return found && canViewProject(found) ? found : null
})

const canEditProject = computed(() =>
  Boolean(project.value && canManageProject(project.value))
)

const projectTaskStats = computed(() =>
  project.value
    ? getProjectTaskStats(project.value.id)
    : { total: 0, completed: 0, progress: 0 }
)

const projectProgress = computed(() => projectTaskStats.value.progress)

/*
=========================================
CLASE DE PRIORIDAD
=========================================
*/

const priorityClass = computed(() => {

  if (!project.value) return ''

  return project.value.priority.toLowerCase()

})

</script>

<template>
  <main
    v-if="project"
    class="project-detail-page"
  >

    <!-- =================================
         NAVEGACIÓN
    ================================== -->

    <nav class="detail-breadcrumb">

      <RouterLink to="/proyectos">

        <AppIcon name="arrow-left" :size="17"/>

        Volver a proyectos

      </RouterLink>

      <AppIcon
        name="chevron-right"
        :size="14"
        class="breadcrumb-separator"
      />

      <span>{{ project.name }}</span>

    </nav>

    <!-- =================================
         ENCABEZADO
    ================================== -->

    <header class="detail-hero">

      <div class="detail-identity">

        <div class="detail-project-icon">

          <AppIcon
            :name="project.icon"
            :size="29"
          />

        </div>

        <div class="detail-identity__information">

          <span class="detail-category">
            {{ project.category }}
          </span>

          <h1>{{ project.name }}</h1>

          <p>{{ project.description }}</p>

          <div class="detail-badges">

            <ProjectStatusBadge
              :status="project.status"
            />

            <span
              class="detail-priority"
              :class="`detail-priority--${priorityClass}`"
            >
              Prioridad {{ project.priority }}
            </span>

          </div>

        </div>

      </div>

      <div class="detail-actions">

        <button
          v-if="canEditProject"
          type="button"
          class="detail-edit-button"
          @click="showProjectForm = true"
        >
          <AppIcon name="edit" :size="16"/>
          Editar proyecto
        </button>

      </div>

    </header>

    <div v-if="formFeedback" class="detail-form-feedback" role="status">
      <AppIcon name="check" :size="16"/>
      {{ formFeedback }}
      <button type="button" aria-label="Cerrar mensaje" @click="formFeedback = ''">
        <AppIcon name="x" :size="14"/>
      </button>
    </div>

    <!-- =================================
         AVANCE E INFORMACIÓN
    ================================== -->

    <section class="detail-summary">

      <!-- PROGRESO -->
      <article class="detail-progress-panel">

        <div class="detail-panel-heading">

          <div>

            <span class="detail-kicker">
              SEGUIMIENTO
            </span>

            <h2>Progreso del proyecto</h2>

          </div>

          <strong>{{ projectProgress }}%</strong>

        </div>

        <div
          class="detail-progress-track"
          role="progressbar"
          :aria-valuenow="projectProgress"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="`Avance de ${project.name}`"
        >

          <div
            class="detail-progress-fill"
            :style="{ width: `${projectProgress}%` }"
          ></div>

        </div>

        <p v-if="projectTaskStats.total">
          Se han completado {{ projectTaskStats.completed }} de
          {{ projectTaskStats.total }} tareas registradas.
        </p>
        <p v-else>
          Este proyecto todavía no tiene tareas. El avance permanecerá en 0% hasta que se registren actividades.
        </p>

      </article>

      <!-- INFORMACIÓN BÁSICA -->
      <article class="detail-information-panel">

        <div class="detail-information-item">

          <div class="information-icon">
            <AppIcon name="calendar" :size="19"/>
          </div>

          <div>
            <span>Fecha de inicio</span>
            <strong>{{ formatProjectDate(project.startDate) }}</strong>
          </div>

        </div>

        <div class="detail-information-item">

          <div class="information-icon">
            <AppIcon name="flag" :size="19"/>
          </div>

          <div>
            <span>Fecha de entrega</span>
            <strong>{{ formatProjectDate(project.dueDate) }}</strong>
          </div>

        </div>

        <div class="detail-information-item">

          <div class="information-icon">
            <AppIcon name="user" :size="19"/>
          </div>

          <div>
            <span>Responsable</span>
            <strong>{{ project.owner }}</strong>
          </div>

        </div>

        <div class="detail-information-item">

          <div class="information-icon">
            <AppIcon name="layers" :size="19"/>
          </div>

          <div>
            <span>Categoría</span>
            <strong>{{ project.category }}</strong>
          </div>

        </div>

      </article>

    </section>

    <!-- =================================
         EQUIPO E INFORMACIÓN GENERAL
    ================================== -->

    <section class="detail-bottom-grid">

      <!-- EQUIPO -->
      <article class="detail-panel">

        <header class="detail-section-heading">

          <div>

            <AppIcon name="users" :size="19"/>

            <h2>Equipo del proyecto</h2>

          </div>

          <span>
            {{ project.members.length }} integrantes
          </span>

        </header>

        <div class="team-list">

          <div
            v-for="member in project.members"
            :key="member.initials"
            class="team-member"
          >

            <div class="team-member__avatar">
              {{ member.initials }}
            </div>

            <div class="team-member__information">

              <strong>{{ member.name }}</strong>

              <span>
                {{
                  member.name === project.owner
                    ? 'Responsable del proyecto'
                    : 'Integrante del equipo'
                }}
              </span>

            </div>

            <span
              v-if="member.name === project.owner"
              class="owner-indicator"
            >
              Responsable
            </span>

          </div>

        </div>

      </article>

      <!-- INFORMACIÓN GENERAL -->
      <article class="detail-panel">

        <header class="detail-section-heading">

          <div>

            <AppIcon name="briefcase" :size="19"/>

            <h2>Información general</h2>

          </div>

        </header>

        <div class="general-information">

          <div class="general-information__row">

            <span>Nombre del proyecto</span>

            <strong>{{ project.name }}</strong>

          </div>

          <div class="general-information__row">

            <span>Identificador</span>

            <strong>#{{ project.id }}</strong>

          </div>

          <div class="general-information__row">

            <span>Estado actual</span>

            <ProjectStatusBadge :status="project.status"/>

          </div>

          <div class="general-information__row">

            <span>Prioridad</span>

            <strong>{{ project.priority }}</strong>

          </div>

          <div class="general-information__row">

            <span>Integrantes</span>

            <strong>{{ project.members.length }} personas</strong>

          </div>

        </div>

      </article>

    </section>

    <!-- =================================
         NUEVO: TAREAS DEL PROYECTO
    ================================== -->

    <ProjectTasksPanel
      :project="project"
    />

    <ProjectFormModal
      v-if="canEditProject"
      :show="showProjectForm"
      :project="project"
      @close="showProjectForm = false"
      @saved="handleProjectSaved"
    />

  </main>

  <!-- =================================
       PROYECTO NO ENCONTRADO
  ================================== -->

  <section
    v-else
    class="project-not-found"
  >

    <div class="not-found-icon">

      <AppIcon name="folder" :size="32"/>

    </div>

    <h1>Proyecto no encontrado</h1>

    <p>
      El proyecto no existe o tu perfil no tiene permiso para consultarlo.
    </p>

    <RouterLink to="/proyectos">

      <AppIcon name="arrow-left" :size="16"/>

      Volver a proyectos

    </RouterLink>

  </section>
</template>

<style scoped>
/* =====================================
   CONTENEDOR
===================================== */

.project-detail-page {
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 20px;
}

/* =====================================
   NAVEGACIÓN
===================================== */

.detail-breadcrumb {
  display: flex;
  align-items: center;

  flex-wrap: wrap;

  gap: 9px;

  color: var(--color-text-muted);

  font-size: 0.71rem;
}

.detail-breadcrumb a {
  display: flex;
  align-items: center;

  gap: 7px;

  color: var(--color-red-bright);

  text-decoration: none;
  font-weight: 650;
}

.detail-breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  color: var(--color-text-muted);
}

/* =====================================
   ENCABEZADO
===================================== */

.detail-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  padding: 22px;

  border: 1px solid var(--color-border);

  border-radius: var(--radius-lg);

  background:
    radial-gradient(
      ellipse at 0% 0%,
      rgba(255, 48, 69, 0.09),
      transparent 55%
    ),
    var(--color-surface);
}

.detail-identity {
  display: flex;
  align-items: flex-start;

  gap: 17px;

  min-width: 0;
}

.detail-project-icon {
  width: 61px;
  height: 61px;

  display: grid;
  place-items: center;

  flex-shrink: 0;

  border: 1px solid var(--color-border-red);

  border-radius: 15px;

  background: var(--color-red-soft);

  color: var(--color-red-bright);

  box-shadow: var(--shadow-red);
}

.detail-identity__information {
  min-width: 0;
}

.detail-category {
  color: var(--color-red-bright);

  font-size: 0.66rem;
  font-weight: 800;

  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.detail-identity h1 {
  margin: 5px 0;

  color: var(--color-text);

  font-size: clamp(1.5rem, 3vw, 2rem);

  font-weight: 800;
  letter-spacing: -0.045em;
}

.detail-identity p {
  max-width: 650px;

  margin: 0;

  color: var(--color-text-secondary);

  font-size: 0.78rem;
  line-height: 1.7;
}

.detail-badges {
  display: flex;
  align-items: center;

  flex-wrap: wrap;

  gap: 9px;

  margin-top: 13px;
}

.detail-priority {
  padding: 6px 10px;

  border-radius: 30px;

  font-size: 0.67rem;
  font-weight: 700;
}

.detail-priority--alta {
  color: #ff6877;
  background: rgba(255, 48, 69, 0.13);
}

.detail-priority--media {
  color: #fbbf24;
  background: rgba(245, 158, 11, 0.12);
}

.detail-priority--baja {
  color: #4ade80;
  background: rgba(34, 197, 94, 0.12);
}

/* EDICIÓN */

.detail-actions {
  display: flex;
  flex-direction: column;

  align-items: flex-end;

  gap: 7px;

  flex-shrink: 0;
}

.detail-edit-button {
  display: flex;
  align-items: center;

  gap: 8px;

  padding: 10px 13px;

  border: 1px solid var(--color-border);

  border-radius: 9px;

  background: rgba(255, 255, 255, 0.035);

  color: var(--color-text-secondary);

  font-size: 0.73rem;
  font-weight: 650;

  opacity: 1;

  cursor: pointer;

  transition: all var(--transition-fast);
}

.detail-actions > span {
  color: var(--color-text-muted);

  font-size: 0.62rem;
}

.detail-edit-button:hover {
  border-color: var(--color-border-red);
  background: var(--color-red-soft);
  color: var(--color-red-bright);
}

.detail-form-feedback {
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

.detail-form-feedback > button {
  margin-left: auto;

  display: grid;
  place-items: center;

  border: 0;
  background: transparent;
  color: inherit;
}

/* =====================================
   RESUMEN
===================================== */

.detail-summary {
  display: grid;

  grid-template-columns:
    minmax(0, 0.9fr)
    minmax(0, 1.1fr);

  gap: 15px;
}

.detail-progress-panel,
.detail-information-panel,
.detail-panel {
  min-width: 0;

  padding: 19px;

  border: 1px solid var(--color-border);

  border-radius: var(--radius-lg);

  background: var(--color-surface);
}

/* PROGRESO */

.detail-panel-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 12px;

  margin-bottom: 23px;
}

.detail-kicker {
  color: var(--color-red-bright);

  font-size: 0.62rem;
  font-weight: 800;

  letter-spacing: 0.14em;
}

.detail-panel-heading h2 {
  margin: 5px 0 0;

  color: var(--color-text);

  font-size: 0.94rem;
  font-weight: 750;
}

.detail-panel-heading > strong {
  color: var(--color-red-bright);

  font-size: 2rem;
  font-weight: 850;
}

.detail-progress-track {
  width: 100%;
  height: 10px;

  overflow: hidden;

  border-radius: 30px;

  background: rgba(255, 255, 255, 0.10);
}

.detail-progress-fill {
  height: 100%;

  border-radius: inherit;

  background: linear-gradient(
    90deg,
    #d91f35,
    #ff4659
  );

  box-shadow: 0 0 12px rgba(255, 48, 69, 0.4);

  transition: width 500ms ease;
}

.detail-progress-panel > p {
  margin: 17px 0 0;

  color: var(--color-text-secondary);

  font-size: 0.72rem;
  line-height: 1.7;
}

/* INFORMACIÓN BÁSICA */

.detail-information-panel {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 20px;
}

.detail-information-item {
  display: flex;
  align-items: center;

  gap: 11px;

  min-width: 0;
}

.information-icon {
  width: 39px;
  height: 39px;

  display: grid;
  place-items: center;

  flex-shrink: 0;

  border: 1px solid rgba(255, 48, 69, 0.17);

  border-radius: 10px;

  background: rgba(255, 48, 69, 0.08);

  color: var(--color-red-bright);
}

.detail-information-item > div:last-child {
  display: flex;
  flex-direction: column;

  gap: 4px;

  min-width: 0;
}

.detail-information-item span {
  color: var(--color-text-muted);

  font-size: 0.64rem;
}

.detail-information-item strong {
  overflow: hidden;

  color: var(--color-text);

  font-size: 0.72rem;
  font-weight: 700;

  text-overflow: ellipsis;
}

/* =====================================
   EQUIPO E INFORMACIÓN GENERAL
===================================== */

.detail-bottom-grid {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 15px;
}

.detail-section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 10px;

  margin-bottom: 16px;
}

.detail-section-heading > div {
  display: flex;
  align-items: center;

  gap: 9px;
}

.detail-section-heading svg {
  color: var(--color-red-bright);
}

.detail-section-heading h2 {
  margin: 0;

  color: var(--color-text);

  font-size: 0.92rem;
  font-weight: 750;
}

.detail-section-heading > span {
  color: var(--color-text-muted);

  font-size: 0.66rem;
}

/* EQUIPO */

.team-list {
  display: flex;
  flex-direction: column;
}

.team-member {
  display: flex;
  align-items: center;

  gap: 11px;

  padding: 10px 0;

  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.team-member:last-child {
  border-bottom: 0;
}

.team-member__avatar {
  width: 38px;
  height: 38px;

  display: grid;
  place-items: center;

  flex-shrink: 0;

  border: 1px solid rgba(255, 48, 69, 0.23);

  border-radius: 50%;

  background: #54242e;

  color: white;

  font-size: 0.68rem;
  font-weight: 750;
}

.team-member__information {
  display: flex;
  flex-direction: column;

  gap: 3px;

  min-width: 0;
}

.team-member__information strong {
  color: var(--color-text);

  font-size: 0.74rem;
  font-weight: 700;
}

.team-member__information span {
  color: var(--color-text-muted);

  font-size: 0.64rem;
}

.owner-indicator {
  margin-left: auto;

  padding: 5px 8px;

  border-radius: 30px;

  background: var(--color-red-soft);

  color: var(--color-red-bright);

  font-size: 0.6rem;
  font-weight: 700;

  white-space: nowrap;
}

/* INFORMACIÓN GENERAL */

.general-information {
  display: flex;
  flex-direction: column;
}

.general-information__row {
  min-height: 43px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 12px;

  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.general-information__row:last-child {
  border-bottom: 0;
}

.general-information__row > span {
  color: var(--color-text-muted);

  font-size: 0.69rem;
}

.general-information__row > strong {
  color: var(--color-text);

  font-size: 0.7rem;
  font-weight: 650;

  text-align: right;
}

/* =====================================
   PROYECTO NO ENCONTRADO
===================================== */

.project-not-found {
  min-height: 430px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: 25px;

  text-align: center;

  border: 1px solid var(--color-border);

  border-radius: var(--radius-lg);

  background: var(--color-surface);
}

.not-found-icon {
  width: 70px;
  height: 70px;

  display: grid;
  place-items: center;

  border: 1px solid var(--color-border);

  border-radius: 18px;

  background: var(--color-red-soft);

  color: var(--color-red-bright);
}

.project-not-found h1 {
  margin: 18px 0 7px;

  color: var(--color-text);

  font-size: 1.4rem;
}

.project-not-found p {
  color: var(--color-text-secondary);

  font-size: 0.78rem;
}

.project-not-found a {
  display: flex;
  align-items: center;

  gap: 8px;

  margin-top: 13px;

  color: var(--color-red-bright);

  font-size: 0.78rem;
  font-weight: 700;

  text-decoration: none;
}

/* =====================================
   RESPONSIVE
===================================== */

@media (max-width: 900px) {
  .detail-hero {
    align-items: flex-start;
    flex-direction: column;
  }

  .detail-actions {
    align-items: flex-start;
  }

  .detail-summary,
  .detail-bottom-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 600px) {
  .detail-identity {
    flex-direction: column;
  }

  .detail-information-panel {
    grid-template-columns: minmax(0, 1fr);
  }

  .detail-hero,
  .detail-progress-panel,
  .detail-information-panel,
  .detail-panel {
    padding: 15px;
  }

  .owner-indicator {
    display: none;
  }
}
</style>
