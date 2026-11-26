<script setup>
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'empty',
    validator: value => ['empty', 'loading', 'error', 'info', 'success'].includes(value),
  },
  icon: { type: String, default: '' },
  title: { type: String, default: 'No hay información disponible' },
  description: { type: String, default: '' },
  actionLabel: { type: String, default: '' },
})

defineEmits(['action'])

const defaultIcon = computed(() => {
  if (props.icon) return props.icon

  return {
    empty: 'search',
    loading: 'clock',
    error: 'flag',
    info: 'help',
    success: 'check',
  }[props.variant]
})
</script>

<template>
  <section
    class="feedback-state"
    :class="`feedback-state--${variant}`"
    :role="variant === 'error' ? 'alert' : 'status'"
    :aria-live="variant === 'error' ? 'assertive' : 'polite'"
    :aria-busy="variant === 'loading'"
  >
    <div class="feedback-state__icon">
      <span v-if="variant === 'loading'" class="feedback-state__spinner"></span>
      <AppIcon v-else :name="defaultIcon" :size="28"/>
    </div>

    <h3>{{ title }}</h3>
    <p v-if="description">{{ description }}</p>

    <button
      v-if="actionLabel"
      type="button"
      class="feedback-state__action"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </button>
  </section>
</template>

<style scoped>
.feedback-state {
  min-height: 205px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 25px;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-lg);
  background:
    radial-gradient(ellipse at 50% 0%, rgba(255, 48, 69, 0.045), transparent 60%),
    var(--color-surface);
  text-align: center;
}

.feedback-state__icon {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  border: 1px solid var(--color-border-red);
  border-radius: 15px;
  background: var(--color-red-soft);
  color: var(--color-red-bright);
}

.feedback-state--error .feedback-state__icon {
  border-color: rgba(255, 48, 69, 0.35);
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.feedback-state--success .feedback-state__icon {
  border-color: rgba(34, 197, 94, 0.3);
  background: var(--color-success-soft);
  color: var(--color-success);
}

.feedback-state--info .feedback-state__icon {
  border-color: rgba(96, 165, 250, 0.3);
  background: var(--color-info-soft);
  color: var(--color-info);
}

.feedback-state h3 {
  margin: 3px 0 0;
  color: var(--color-text);
  font-size: 0.88rem;
  font-weight: 750;
}

.feedback-state p {
  max-width: 480px;
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.7rem;
  line-height: 1.6;
}

.feedback-state__action {
  margin-top: 7px;
  padding: 9px 13px;
  border: 1px solid var(--color-border-red);
  border-radius: 8px;
  background: var(--color-red-soft);
  color: var(--color-red-bright);
  font-size: 0.68rem;
  font-weight: 750;
}

.feedback-state__action:hover {
  background: rgba(255, 48, 69, 0.18);
}

.feedback-state__spinner {
  width: 25px;
  height: 25px;
  border: 2px solid rgba(255, 48, 69, 0.2);
  border-top-color: var(--color-red-bright);
  border-radius: 50%;
  animation: feedback-spin 700ms linear infinite;
}

@keyframes feedback-spin {
  to { transform: rotate(360deg); }
}
</style>
