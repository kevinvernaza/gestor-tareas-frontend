
<script setup>
import { computed } from 'vue'

const props = defineProps({
  priority: {
    type: String,
    required: true,
  },
})

const priorityClass = computed(() => {

  const priorityMap = {
    'Alta': 'high',
    'Media': 'medium',
    'Baja': 'low',
  }

  return priorityMap[props.priority] || 'medium'

})
</script>

<template>
  <span
    class="task-priority"
    :class="`task-priority--${priorityClass}`"
  >
    {{ priority }}
  </span>
</template>

<style scoped>
.task-priority {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: fit-content;

  padding: 6px 10px;

  border: 1px solid transparent;

  border-radius: 30px;

  font-size: 0.66rem;
  font-weight: 750;

  white-space: nowrap;
}

/* PRIORIDAD ALTA */

.task-priority--high {
  color: #ff6877;

  background: rgba(255, 48, 69, 0.13);

  border-color: rgba(255, 48, 69, 0.20);
}

/* PRIORIDAD MEDIA */

.task-priority--medium {
  color: #fbbf24;

  background: rgba(245, 158, 11, 0.12);

  border-color: rgba(245, 158, 11, 0.20);
}

/* PRIORIDAD BAJA */

.task-priority--low {
  color: #4ade80;

  background: rgba(34, 197, 94, 0.12);

  border-color: rgba(34, 197, 94, 0.20);
}
</style>
