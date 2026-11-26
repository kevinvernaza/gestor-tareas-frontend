
<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },

  size: {
    type: [Number, String],
    default: 20,
  },

  strokeWidth: {
    type: Number,
    default: 1.8,
  },
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >

    <g v-if="name === 'brand'">
      <path d="M12 2.8L21 8L12 13.2L3 8L12 2.8Z"/>
      <path d="M3 12L12 17.2L21 12"/>
      <path d="M3 16.5L12 21.7L21 16.5"/>
    </g>

    <g v-else-if="name === 'dashboard'">
      <rect x="3" y="3" width="8" height="8" rx="1.5"/>
      <rect x="13" y="3" width="8" height="5" rx="1.5"/>
      <rect x="13" y="10" width="8" height="11" rx="1.5"/>
      <rect x="3" y="13" width="8" height="8" rx="1.5"/>
    </g>

    <g v-else-if="name === 'folder'">
      <path d="M3 7.5C3 6.4 3.9 5.5 5 5.5H9L11 7.5H19C20.1 7.5 21 8.4 21 9.5V18.5C21 19.6 20.1 20.5 19 20.5H5C3.9 20.5 3 19.6 3 18.5V7.5Z"/>
    </g>

    <g v-else-if="name === 'tasks'">
      <circle cx="12" cy="12" r="9"/>
      <path d="M8 12L10.5 14.5L16.5 9"/>
    </g>

    <g v-else-if="name === 'users'">
      <circle cx="9" cy="8" r="3.5"/>
      <path d="M2.5 20C2.5 16.5 5.2 14 9 14C12.8 14 15.5 16.5 15.5 20"/>
      <path d="M16 5.2C18.1 5.7 19.2 7 19.2 8.8C19.2 10.4 18.3 11.6 16.8 12.2"/>
      <path d="M17 15C19.5 15.6 21 17.3 21.5 19.5"/>
    </g>

    <g v-else-if="name === 'chart'">
      <path d="M3 3V21H21"/>
      <path d="M7 16V11"/>
      <path d="M12 16V6"/>
      <path d="M17 16V9"/>
    </g>

    <g v-else-if="name === 'user'">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 21C4 16.8 7.4 14 12 14C16.6 14 20 16.8 20 21"/>
    </g>

    <g v-else-if="name === 'search'">
      <circle cx="10.8" cy="10.8" r="7.3"/>
      <path d="M16.2 16.2L21 21"/>
    </g>

    <g v-else-if="name === 'bell'">
      <path d="M18 8C18 4.7 15.7 2.5 12 2.5C8.3 2.5 6 4.7 6 8C6 15 3.5 16 3.5 18H20.5C20.5 16 18 15 18 8Z"/>
      <path d="M10 21H14"/>
    </g>

    <g v-else-if="name === 'help'">
      <circle cx="12" cy="12" r="9"/>
      <path d="M9.5 9A2.6 2.6 0 0 1 12 7.3C13.7 7.3 15 8.4 15 10C15 11.5 13.8 12.2 12.8 13C12.2 13.5 12 14 12 14.7"/>
      <path d="M12 17.5H12.01"/>
    </g>

    <g v-else-if="name === 'chevron-down'">
      <path d="M6 9L12 15L18 9"/>
    </g>

    <g v-else-if="name === 'chevron-right'">
      <path d="M9 18L15 12L9 6"/>
    </g>

    <g v-else-if="name === 'menu'">
      <path d="M3 6H21"/>
      <path d="M3 12H21"/>
      <path d="M3 18H21"/>
    </g>

    <g v-else-if="name === 'calendar'">
      <rect x="3" y="5" width="18" height="16" rx="2"/>
      <path d="M16 3V7"/>
      <path d="M8 3V7"/>
      <path d="M3 10H21"/>
      <path d="M8 14H8.01M12 14H12.01M16 14H16.01"/>
    </g>

    <g v-else-if="name === 'target'">
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="5"/>
      <circle cx="12" cy="12" r="1"/>
      <path d="M12 12L21 3"/>
      <path d="M16 3H21V8"/>
    </g>

    <g v-else-if="name === 'flag'">
      <path d="M5 21V4"/>
      <path d="M5 5C10 2 14 9 20 5V15C14 19 10 12 5 16"/>
    </g>

    <g v-else-if="name === 'check'">
      <circle cx="12" cy="12" r="9"/>
      <path d="M7.5 12L10.5 15L16.5 9"/>
    </g>

    <g v-else-if="name === 'code'">
      <path d="M8 8L4 12L8 16"/>
      <path d="M16 8L20 12L16 16"/>
      <path d="M14 5L10 19"/>
    </g>

    <g v-else-if="name === 'mobile'">
      <rect x="6" y="2" width="12" height="20" rx="2"/>
      <path d="M10 18.5H14"/>
    </g>

    <g v-else-if="name === 'monitor'">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21H16"/>
      <path d="M12 17V21"/>
    </g>

    <g v-else-if="name === 'bolt'">
      <path d="M13 2L4 13H11L10 22L20 10H13L13 2Z"/>
    </g>

    <g v-else-if="name === 'plus'">
      <path d="M12 5V19"/>
      <path d="M5 12H19"/>
    </g>

    <g v-else-if="name === 'cube'">
      <path d="M12 2L21 7L12 12L3 7L12 2Z"/>
      <path d="M3 7V17L12 22L21 17V7"/>
      <path d="M12 12V22"/>
    </g>

    <!-- NUEVOS ICONOS PARA PROYECTOS -->

    <g v-else-if="name === 'briefcase'">
      <rect x="3" y="7" width="18" height="14" rx="2"/>
      <path d="M8 7V4H16V7"/>
      <path d="M3 12H21"/>
      <path d="M10 12V14H14V12"/>
    </g>

    <g v-else-if="name === 'layers'">
      <path d="M12 2L22 7L12 12L2 7L12 2Z"/>
      <path d="M2 12L12 17L22 12"/>
      <path d="M2 17L12 22L22 17"/>
    </g>

    <g v-else-if="name === 'database'">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M3 5V19C3 20.7 7 22 12 22C17 22 21 20.7 21 19V5"/>
      <path d="M3 12C3 13.7 7 15 12 15C17 15 21 13.7 21 12"/>
    </g>

    <g v-else-if="name === 'palette'">
      <path d="M12 3C6.5 3 2 7.2 2 12.5C2 17.8 6 21 10 21H12C13.7 21 14.5 20 14.5 18.8C14.5 17.8 13.5 17 13.5 16C13.5 14.7 14.5 14 16 14H18C20.5 14 22 12.2 22 10C22 6.2 17.5 3 12 3Z"/>
      <circle cx="7.5" cy="11" r="1"/>
      <circle cx="11" cy="7.5" r="1"/>
      <circle cx="16" cy="8" r="1"/>
    </g>

    <g v-else-if="name === 'globe'">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12H22"/>
      <path d="M12 2C15 5 16 8 16 12C16 16 15 19 12 22"/>
      <path d="M12 2C9 5 8 8 8 12C8 16 9 19 12 22"/>
    </g>

    <g v-else-if="name === 'arrow-left'">
      <path d="M19 12H5"/>
      <path d="M12 19L5 12L12 5"/>
    </g>

    <g v-else-if="name === 'arrow-right'">
      <path d="M5 12H19"/>
      <path d="M12 5L19 12L12 19"/>
    </g>

    <g v-else-if="name === 'clock'">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7V12L15 14"/>
    </g>

    <g v-else-if="name === 'edit'">
      <path d="M12 20H21"/>
      <path d="M16.5 3.5C17.3 2.7 18.7 2.7 19.5 3.5C20.3 4.3 20.3 5.7 19.5 6.5L8 18L3 19L4 14L16.5 3.5Z"/>
    </g>

    <g v-else-if="name === 'settings'">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15A1.7 1.7 0 0 0 19.8 17L20 17.2L17.2 20L17 19.8A1.7 1.7 0 0 0 15 19.4L14.7 19.5L14 22H10L9.3 19.5L9 19.4A1.7 1.7 0 0 0 7 19.8L6.8 20L4 17.2L4.2 17A1.7 1.7 0 0 0 4.6 15L4.5 14.7L2 14V10L4.5 9.3L4.6 9A1.7 1.7 0 0 0 4.2 7L4 6.8L6.8 4L7 4.2A1.7 1.7 0 0 0 9 4.6L9.3 4.5L10 2H14L14.7 4.5L15 4.6A1.7 1.7 0 0 0 17 4.2L17.2 4L20 6.8L19.8 7A1.7 1.7 0 0 0 19.4 9L19.5 9.3L22 10V14L19.5 14.7L19.4 15Z"/>
    </g>

    <g v-else-if="name === 'external-link'">
      <path d="M14 4H20V10"/>
      <path d="M20 4L11 13"/>
      <path d="M18 13V19C18 20.1 17.1 21 16 21H5C3.9 21 3 20.1 3 19V8C3 6.9 3.9 6 5 6H11"/>
    </g>

    <g v-else-if="name === 'x'">
      <path d="M18 6L6 18"/>
      <path d="M6 6L18 18"/>
    </g>

  </svg>
</template>
