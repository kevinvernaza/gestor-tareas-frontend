<script setup>
import { toastMessages, dismissToast } from '../../data/uiFeedback'
import AppIcon from './AppIcon.vue'

function iconFor(type) {
  return {
    success: 'check',
    error: 'flag',
    warning: 'clock',
    info: 'help',
  }[type] || 'help'
}
</script>

<template>
  <Teleport to="body">
    <TransitionGroup
      name="toast"
      tag="section"
      class="toast-stack"
      aria-label="Notificaciones"
      aria-live="polite"
      aria-relevant="additions"
    >
      <article
        v-for="item in toastMessages"
        :key="item.id"
        class="app-toast"
        :class="`app-toast--${item.type}`"
        role="status"
      >
        <span class="app-toast__icon">
          <AppIcon :name="iconFor(item.type)" :size="19" />
        </span>

        <div class="app-toast__content">
          <strong>{{ item.title }}</strong>
          <p>{{ item.message }}</p>
        </div>

        <button
          type="button"
          class="app-toast__close"
          aria-label="Cerrar notificación"
          @click="dismissToast(item.id)"
        >
          <AppIcon name="x" :size="15" />
        </button>
      </article>
    </TransitionGroup>
  </Teleport>
</template>

<style scoped>
.toast-stack {
  position: fixed;
  top: calc(var(--topbar-height) + 14px);
  right: 22px;
  z-index: 1200;
  width: min(390px, calc(100vw - 28px));
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.app-toast {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  padding: 13px;
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-info);
  border-radius: 11px;
  background: rgba(19, 19, 23, 0.97);
  box-shadow: 0 15px 38px rgba(0, 0, 0, 0.38);
  backdrop-filter: blur(12px);
  pointer-events: auto;
}

.app-toast--success { border-left-color: var(--color-success); }
.app-toast--error { border-left-color: var(--color-danger); }
.app-toast--warning { border-left-color: var(--color-warning); }
.app-toast--info { border-left-color: var(--color-info); }

.app-toast__icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: var(--color-info-soft);
  color: var(--color-info);
}

.app-toast--success .app-toast__icon {
  background: var(--color-success-soft);
  color: var(--color-success);
}

.app-toast--error .app-toast__icon {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.app-toast--warning .app-toast__icon {
  background: var(--color-warning-soft);
  color: var(--color-warning);
}

.app-toast__content { min-width: 0; flex: 1; }

.app-toast__content strong {
  display: block;
  margin: 1px 0 4px;
  color: var(--color-text);
  font-size: 0.73rem;
}

.app-toast__content p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.67rem;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.app-toast__close {
  width: 25px;
  height: 25px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-muted);
}

.app-toast__close:hover {
  background: rgba(255, 255, 255, 0.07);
  color: var(--color-text);
}

.toast-enter-active,
.toast-leave-active,
.toast-move { transition: all 220ms ease; }

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(18px);
}

.toast-leave-active {
  position: absolute;
  right: 0;
}

@media (max-width: 560px) {
  .toast-stack { top: 12px; right: 14px; }
}
</style>
