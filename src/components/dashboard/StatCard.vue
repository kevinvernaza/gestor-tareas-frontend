
<script setup>
import AppIcon from '../ui/AppIcon.vue'

defineProps({
  stat: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article
    class="stat-card"
    :class="`stat-card--${stat.tone}`"
  >

    <div class="stat-card__icon">
      <AppIcon :name="stat.icon" :size="21" />
    </div>

    <div class="stat-card__information">

      <strong>{{ stat.value }}</strong>

      <span>{{ stat.label }}</span>

    </div>

    <!-- LÍNEA DECORATIVA -->
    <svg
      class="stat-card__sparkline"
      viewBox="0 0 110 35"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 29C15 29 18 18 29 20C39 22 42 30 53 23C64 16 68 5 78 10C89 16 96 18 108 3"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>

  </article>
</template>

<style scoped>
.stat-card {
  position: relative;

  min-width: 0;
  min-height: 96px;

  display: flex;
  align-items: center;

  gap: 13px;

  padding: 14px;

  overflow: hidden;

  border: 1px solid var(--color-border);

  border-radius: var(--radius-lg);

  background:
    linear-gradient(
      125deg,
      rgba(255, 255, 255, 0.025),
      transparent 70%
    ),
    var(--color-surface);

  transition:
    transform var(--transition-normal),
    border-color var(--transition-normal),
    box-shadow var(--transition-normal);
}

.stat-card:hover {
  transform: translateY(-2px);

  border-color: var(--color-border-hover);

  box-shadow: var(--shadow-md);
}

/* ICONO */

.stat-card__icon {
  width: 43px;
  height: 43px;

  display: grid;
  place-items: center;

  flex-shrink: 0;

  border: 1px solid currentColor;

  border-radius: 11px;

  background: rgba(255, 255, 255, 0.025);
}

.stat-card__information {
  position: relative;
  z-index: 1;

  display: flex;
  flex-direction: column;

  gap: 1px;

  min-width: 0;
}

.stat-card__information strong {
  color: #ffffff;

  font-size: 1.55rem;
  font-weight: 800;

  line-height: 1.1;

  letter-spacing: -0.045em;
}

.stat-card__information span {
  color: var(--color-text-secondary);

  font-size: 0.73rem;
  font-weight: 550;
}

/* GRÁFICA DECORATIVA */

.stat-card__sparkline {
  position: absolute;

  right: 7px;
  bottom: 5px;

  width: 95px;
  height: 32px;

  opacity: 0.85;

  pointer-events: none;
}

/* COLORES */

.stat-card--red {
  color: var(--color-red-bright);
}

.stat-card--amber {
  color: var(--color-warning);
}

.stat-card--green {
  color: var(--color-success);
}

.stat-card--red .stat-card__icon {
  background: var(--color-red-soft);
}

.stat-card--amber .stat-card__icon {
  background: var(--color-warning-soft);
}

.stat-card--green .stat-card__icon {
  background: var(--color-success-soft);
}
</style>
