<script setup>
import { confirmationState, resolveConfirmation } from '../../data/uiFeedback'
import AppIcon from './AppIcon.vue'
</script>

<template>
  <Teleport to="body">
    <Transition name="confirm">
      <div
        v-if="confirmationState.visible"
        class="confirm-backdrop"
        role="presentation"
        @click.self="resolveConfirmation(false)"
        @keydown.esc.window="resolveConfirmation(false)"
      >
        <section
          class="confirm-dialog"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-message"
          tabindex="-1"
        >
          <div
            class="confirm-dialog__icon"
            :class="`confirm-dialog__icon--${confirmationState.tone}`"
          >
            <AppIcon
              :name="confirmationState.tone === 'success' ? 'check' : 'flag'"
              :size="25"
            />
          </div>

          <h2 id="confirm-title">{{ confirmationState.title }}</h2>
          <p id="confirm-message">{{ confirmationState.message }}</p>

          <footer class="confirm-dialog__actions">
            <button
              type="button"
              class="confirm-button confirm-button--cancel"
              @click="resolveConfirmation(false)"
            >
              {{ confirmationState.cancelText }}
            </button>

            <button
              type="button"
              class="confirm-button confirm-button--accept"
              :class="`confirm-button--${confirmationState.tone}`"
              @click="resolveConfirmation(true)"
            >
              {{ confirmationState.confirmText }}
            </button>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.confirm-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1300;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(6px);
}

.confirm-dialog {
  width: min(100%, 410px);
  padding: 25px;
  border: 1px solid var(--color-border-red);
  border-radius: 16px;
  background:
    radial-gradient(ellipse at 50% 0%, rgba(255, 48, 69, 0.10), transparent 48%),
    #141417;
  box-shadow: 0 25px 75px rgba(0, 0, 0, 0.58);
  text-align: center;
}

.confirm-dialog__icon {
  width: 54px;
  height: 54px;
  margin: 0 auto 15px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: 15px;
  background: var(--color-warning-soft);
  color: var(--color-warning);
}

.confirm-dialog__icon--success {
  border-color: rgba(34, 197, 94, 0.25);
  background: var(--color-success-soft);
  color: var(--color-success);
}

.confirm-dialog__icon--danger {
  border-color: rgba(255, 48, 69, 0.3);
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.confirm-dialog h2 {
  margin: 0 0 8px;
  color: var(--color-text);
  font-size: 1.05rem;
  font-weight: 800;
}

.confirm-dialog p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.75rem;
  line-height: 1.65;
}

.confirm-dialog__actions {
  display: flex;
  justify-content: center;
  gap: 9px;
  margin-top: 23px;
}

.confirm-button {
  min-height: 39px;
  padding: 9px 15px;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 750;
  transition: all var(--transition-fast);
}

.confirm-button--cancel {
  border-color: var(--color-border);
  background: rgba(255, 255, 255, 0.04);
  color: var(--color-text-secondary);
}

.confirm-button--cancel:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-text);
}

.confirm-button--accept {
  border-color: rgba(245, 158, 11, 0.4);
  background: rgba(245, 158, 11, 0.16);
  color: #fbbf24;
}

.confirm-button--success {
  border-color: rgba(34, 197, 94, 0.35);
  background: rgba(34, 197, 94, 0.16);
  color: #4ade80;
}

.confirm-button--danger {
  border-color: rgba(255, 48, 69, 0.4);
  background: linear-gradient(135deg, #c91d32, #f03348);
  color: #ffffff;
}

.confirm-enter-active,
.confirm-leave-active { transition: opacity 180ms ease; }

.confirm-enter-active .confirm-dialog,
.confirm-leave-active .confirm-dialog { transition: transform 180ms ease; }

.confirm-enter-from,
.confirm-leave-to { opacity: 0; }

.confirm-enter-from .confirm-dialog,
.confirm-leave-to .confirm-dialog {
  transform: translateY(10px) scale(0.98);
}

@media (max-width: 480px) {
  .confirm-dialog { padding: 21px; }
  .confirm-dialog__actions { flex-direction: column-reverse; }
  .confirm-button { width: 100%; }
}
</style>
