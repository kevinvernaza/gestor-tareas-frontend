
<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
})

const statusClass = computed(() => {
  const statusMap = {
    'En progreso': 'progress',
    'Planificación': 'planning',
    'En revisión': 'review',
    'Completado': 'completed',
    'Pausado': 'paused',
  }

  return statusMap[props.status] || 'paused'
})
</script>

<template>
  <span
    class="project-status"
    :class="`project-status--${statusClass}`"
  >
    <span class="project-status__dot"></span>

    {{ status }}
  </span>
</template>

<style scoped>
.project-status {
  display: inline-flex;
  align-items: center;

  gap: 7px;

  width: fit-content;

  padding: 6px 10px;

  border: 1px solid transparent;

  border-radius: 30px;

  font-size: 0.67rem;
  font-weight: 700;

  white-space: nowrap;
}

.project-status__dot {
  width: 7px;
  height: 7px;

  flex-shrink: 0;

  border-radius: 50%;

  background: currentColor;
}

/* EN PROGRESO */

.project-status--progress {
  color: #ff5367;

  background: rgba(255, 48, 69, 0.12);

  border-color: rgba(255, 48, 69, 0.20);
}

/* PLANIFICACIÓN */

.project-status--planning {
  color: #60a5fa;

  background: rgba(59, 130, 246, 0.12);

  border-color: rgba(59, 130, 246, 0.20);
}

/* EN REVISIÓN */

.project-status--review {
  color: #fbbf24;

  background: rgba(245, 158, 11, 0.12);

  border-color: rgba(245, 158, 11, 0.20);
}

/* COMPLETADO */

.project-status--completed {
  color: #4ade80;

  background: rgba(34, 197, 94, 0.12);

  border-color: rgba(34, 197, 94, 0.20);
}

/* PAUSADO */

.project-status--paused {
  color: #a1a1aa;

  background: rgba(161, 161, 170, 0.10);

  border-color: rgba(161, 161, 170, 0.18);
}
</style>
