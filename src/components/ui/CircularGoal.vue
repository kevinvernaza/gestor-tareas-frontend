
<script setup>
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  progress: {
    type: Number,
    default: 0,
  },
  label: {
    type: String,
    default: 'COMPLETADO',
  },
})

const normalizedProgress = computed(() => {
  return Math.min(100, Math.max(0, props.progress))
})

const ringStyle = computed(() => ({
  '--progress-angle': `${normalizedProgress.value * 3.6}deg`,
}))
</script>

<template>
  <section class="monthly-goal">

    <div class="monthly-goal__heading">
      <AppIcon name="target" :size="18" />

      <span>Meta del mes</span>
    </div>

    <div
      class="goal-ring"
      :style="ringStyle"
      role="img"
      :aria-label="label === 'SIN TAREAS' ? 'No hay tareas con fecha límite en el mes actual' : `Tareas con fecha límite este mes completadas al ${normalizedProgress}%`"
    >

      <div class="goal-ring__inner">

        <strong>{{ normalizedProgress }}%</strong>

        <span>{{ label }}</span>

      </div>

    </div>

  </section>
</template>

<style scoped>
.monthly-goal {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 17px;

  padding: 8px 0;
}

.monthly-goal__heading {
  display: flex;
  align-items: center;

  gap: 8px;

  color: var(--color-text);

  font-size: 0.82rem;
  font-weight: 650;
}

.monthly-goal__heading svg {
  color: var(--color-red-bright);

  filter: drop-shadow(
    0 0 6px var(--color-red-glow)
  );
}

.goal-ring {
  position: relative;

  width: 112px;
  height: 112px;

  display: grid;
  place-items: center;

  flex-shrink: 0;

  border-radius: 50%;

  background:
    conic-gradient(
      from -90deg,
      var(--color-red-bright) 0deg,
      var(--color-red-bright) var(--progress-angle),
      rgba(255, 255, 255, 0.09) var(--progress-angle),
      rgba(255, 255, 255, 0.09) 360deg
    );

  box-shadow:
    0 0 14px rgba(255, 48, 69, 0.22),
    0 0 30px rgba(255, 48, 69, 0.10);
}

.goal-ring::before {
  content: "";

  position: absolute;

  inset: 3px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle at 50% 35%,
      rgba(255, 48, 69, 0.13),
      transparent 70%
    );

  pointer-events: none;
}

.goal-ring__inner {
  position: absolute;

  inset: 9px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 3px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle at 50% 35%,
      #282025,
      #111114 75%
    );

  border: 1px solid rgba(255, 255, 255, 0.08);
}

.goal-ring__inner strong {
  color: #ffffff;

  font-size: 1.7rem;
  font-weight: 800;

  letter-spacing: -0.06em;

  text-shadow:
    0 0 12px rgba(255, 48, 69, 0.35);
}

.goal-ring__inner span {
  color: var(--color-text-muted);

  font-size: 0.48rem;
  font-weight: 800;

  letter-spacing: 0.12em;
}
</style>
