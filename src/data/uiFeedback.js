import { reactive } from 'vue'

let nextToastId = 1

export const toastMessages = reactive([])

export function dismissToast(id) {
  const index = toastMessages.findIndex(item => item.id === id)
  if (index !== -1) toastMessages.splice(index, 1)
}

export function notify(options = {}) {
  const { type = 'success', title = '', message = '', duration = 4200 } = options
  const id = nextToastId++

  const defaultTitles = {
    success: 'Operación completada',
    error: 'No se pudo completar',
    warning: 'Atención',
    info: 'Información',
  }

  toastMessages.push({
    id,
    type,
    title: title || defaultTitles[type] || 'Notificación',
    message: String(message),
  })

  if (duration > 0 && typeof window !== 'undefined') {
    window.setTimeout(() => dismissToast(id), duration)
  }

  return id
}

export const confirmationState = reactive({
  visible: false,
  title: 'Confirmar acción',
  message: '¿Deseas continuar?',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  tone: 'warning',
})

let confirmationResolver = null

export function askConfirmation(options = {}) {
  if (confirmationResolver) {
    confirmationResolver(false)
    confirmationResolver = null
  }

  Object.assign(confirmationState, {
    visible: true,
    title: options.title || 'Confirmar acción',
    message: options.message || '¿Deseas continuar?',
    confirmText: options.confirmText || 'Confirmar',
    cancelText: options.cancelText || 'Cancelar',
    tone: options.tone || 'warning',
  })

  return new Promise(resolve => {
    confirmationResolver = resolve
  })
}

export function resolveConfirmation(accepted) {
  const resolver = confirmationResolver
  confirmationResolver = null
  confirmationState.visible = false
  resolver?.(Boolean(accepted))
}
