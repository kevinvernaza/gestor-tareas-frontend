
<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
})

/*
=========================================
CLASE SEGÚN EL ESTADO DE LA TAREA
=========================================
*/

const statusClass = computed(() => {

  const statusMap = {
    'Pendiente': 'pending',
    'En progreso': 'progress',
    'En revisión': 'review',
    'Completada': 'completed',
  }

  return statusMap[props.status] || 'pending'

})
</script>

<template>
  <span
    class="task-status"
    :class="`task-status--${statusClass}`"
  >
    <span class="task-status__indicator"></span>

    {{ status }}
  </span>
</template>

<style scoped>
/* =====================================
   ESTILO GENERAL
===================================== */

.task-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 7px;

  width: fit-content;

  padding: 6px 10px;

  border: 1px solid transparent;

  border-radius: 30px;

  font-size: 0.66rem;
  font-weight: 750;

  white-space: nowrap;

  transition:
    background var(--transition-fast),
    border-color var(--transition-fast);
}

/* INDICADOR */

.task-status__indicator {
  width: 7px;
  height: 7px;

  flex-shrink: 0;

  border-radius: 50%;

  background: currentColor;

  box-shadow: 0 0 7px currentColor;
}

/* =====================================
   PENDIENTE
===================================== */

.task-status--pending {
  color: #fbbf24;

  background: rgba(245, 158, 11, 0.10);

  border-color: rgba(245, 158, 11, 0.22);
}

/* =====================================
   EN PROGRESO
===================================== */

.task-status--progress {
  color: #ff5266;

  background: rgba(255, 48, 69, 0.11);

  border-color: rgba(255, 48, 69, 0.24);
}

/* =====================================
   EN REVISIÓN
===================================== */

.task-status--review {
  color: #60a5fa;

  background: rgba(59, 130, 246, 0.11);

  border-color: rgba(59, 130, 246, 0.24);
}

/* =====================================
   COMPLETADA
===================================== */

.task-status--completed {
  color: #4ade80;

  background: rgba(34, 197, 94, 0.11);

  border-color: rgba(34, 197, 94, 0.24);
}
</style>
