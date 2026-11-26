
<script setup>
import { computed } from 'vue'

import AppIcon from '../ui/AppIcon.vue'
import FeedbackState from '../ui/FeedbackState.vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },

  total: {
    type: Number,
    default: 0,
  },
})

const chartStyle = computed(() => {
  let currentPosition = 0

  const segments = props.items.map((item) => {
    const start = currentPosition

    currentPosition += item.value

    return `${item.color} ${start}% ${currentPosition}%`
  })

  return {
    background: `conic-gradient(from -90deg, ${segments.join(', ')})`,
  }
})
</script>

<template>
  <section class="distribution-panel">

    <header class="distribution-header">

      <div class="distribution-title">
        <AppIcon name="cube" :size="19" />

        <h2>Distribución de tareas</h2>
      </div>

    </header>

    <FeedbackState
      v-if="total === 0"
      variant="empty"
      icon="tasks"
      title="Sin tareas para distribuir"
      description="Cuando tengas tareas disponibles, aquí aparecerá su distribución por estado."
    />

    <div v-else class="distribution-content">

      <!-- GRÁFICO -->
      <div
        class="donut-chart"
        :style="chartStyle"
        role="img"
        :aria-label="`Distribución de ${total} tareas`"
      >

        <div class="donut-center">

          <strong>{{ total }}</strong>

          <span>Tareas</span>

        </div>

      </div>

      <!-- LEYENDA -->
      <div class="distribution-legend">

        <div
          v-for="item in items"
          :key="item.id"
          class="legend-item"
        >

          <span
            class="legend-color"
            :style="{ backgroundColor: item.color }"
          ></span>

          <span class="legend-label">
            {{ item.label }}
          </span>

          <strong>
            {{ item.value }}%
          </strong>

        </div>

      </div>

    </div>

  </section>
</template>

<style scoped>
.distribution-panel {
  min-width: 0;
  min-height: 170px;

  padding: 13px 15px;

  border: 1px solid var(--color-border);

  border-radius: var(--radius-lg);

  background: var(--color-surface);

  box-shadow: var(--shadow-sm);
}

/* ENCABEZADO */

.distribution-header {
  margin-bottom: 13px;
}

.distribution-title {
  display: flex;
  align-items: center;

  gap: 9px;
}

.distribution-title svg {
  color: var(--color-red-bright);
}

.distribution-title h2 {
  margin: 0;

  color: var(--color-text);

  font-size: 0.91rem;
  font-weight: 750;
}

/* CONTENIDO */

.distribution-content {
  min-height: 120px;

  display: flex;
  align-items: center;
  justify-content: space-around;

  gap: 15px;
}

/* DONA */

.donut-chart {
  position: relative;

  width: 120px;
  height: 120px;

  display: grid;
  place-items: center;

  flex-shrink: 0;

  border-radius: 50%;

  filter:
    drop-shadow(0 0 12px rgba(255, 48, 69, 0.10));
}

.donut-center {
  position: absolute;

  inset: 15px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 0;

  border-radius: 50%;

  background:
    radial-gradient(
      circle at 50% 30%,
      #262126,
      #111114 75%
    );

  border: 1px solid rgba(255, 255, 255, 0.07);
}

.donut-center strong {
  color: #ffffff;

  font-size: 1.55rem;
  font-weight: 800;

  letter-spacing: -0.06em;
}

.donut-center span {
  color: var(--color-text-secondary);

  font-size: 0.62rem;
}

/* LEYENDA */

.distribution-legend {
  width: min(100%, 180px);

  display: flex;
  flex-direction: column;

  gap: 14px;
}

.legend-item {
  display: grid;

  grid-template-columns: 10px minmax(0, 1fr) auto;

  align-items: center;

  gap: 8px;
}

.legend-color {
  width: 9px;
  height: 9px;

  border-radius: 50%;

  box-shadow:
    0 0 7px currentColor;
}

.legend-label {
  color: var(--color-text-secondary);

  font-size: 0.73rem;

  white-space: nowrap;
}

.legend-item strong {
  color: var(--color-text);

  font-size: 0.73rem;
  font-weight: 700;
}

/* RESPONSIVE */

@media (max-width: 520px) {
  .distribution-content {
    justify-content: space-evenly;
  }

  .donut-chart {
    width: 105px;
    height: 105px;
  }

  .donut-center {
    inset: 13px;
  }

  .distribution-legend {
    width: auto;
    gap: 11px;
  }
}
</style>
