<script setup>
import { computed } from 'vue'

import AppIcon from './AppIcon.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  filters: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Buscar...',
  },
  resultCount: {
    type: Number,
    default: 0,
  },
  totalCount: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['update:modelValue', 'clear'])

const hasActiveFilters = computed(() =>
  Boolean(props.modelValue.query) ||
  props.filters.some(filter => Boolean(props.modelValue[filter.key]))
)

function updateField(key, value) {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value,
  })
}

function clearAll() {
  emit('clear')
}
</script>

<template>
  <section class="search-filters" aria-label="Búsqueda y filtros">
    <div class="search-filters__top">
      <label class="search-filters__search">
        <AppIcon name="search" :size="18"/>
        <input
          type="search"
          :value="modelValue.query || ''"
          :placeholder="placeholder"
          aria-label="Buscar registros"
          @input="updateField('query', $event.target.value)"
        />
        <kbd>Buscar</kbd>
      </label>

      <button
        v-if="hasActiveFilters"
        type="button"
        class="search-filters__clear"
        @click="clearAll"
      >
        <AppIcon name="x" :size="15"/>
        Limpiar filtros
      </button>
    </div>

    <div v-if="filters.length" class="search-filters__selects">
      <label
        v-for="filter in filters"
        :key="filter.key"
        class="search-filters__field"
      >
        <span>{{ filter.label }}</span>
        <input
          v-if="filter.type === 'date'"
          type="date"
          :value="modelValue[filter.key] || ''"
          :aria-label="filter.label"
          :min="filter.minKey ? (modelValue[filter.minKey] || undefined) : undefined"
          :max="filter.maxKey ? (modelValue[filter.maxKey] || undefined) : undefined"
          @input="updateField(filter.key, $event.target.value)"
        />
        <select
          v-else
          :value="modelValue[filter.key] || ''"
          @change="updateField(filter.key, $event.target.value)"
        >
          <option value="">
            {{ filter.placeholder || 'Todos' }}
          </option>
          <option
            v-for="option in filter.options || []"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>
    </div>

    <div class="search-filters__footer">
      <span>
        Mostrando <strong>{{ resultCount }}</strong> de
        <strong>{{ totalCount }}</strong> resultados
      </span>
      <span v-if="hasActiveFilters" class="search-filters__active">
        <AppIcon name="check" :size="13"/>
        Filtros aplicados
      </span>
    </div>
  </section>
</template>

<style scoped>
.search-filters {
  display: flex;
  flex-direction: column;
  gap: 12px;

  padding: 15px;

  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
}

.search-filters__top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-filters__search {
  min-width: 0;
  flex: 1;

  height: 41px;

  display: flex;
  align-items: center;
  gap: 10px;

  padding: 0 11px;

  border: 1px solid var(--color-border);
  border-radius: 9px;

  background: #0b0b0e;
  color: var(--color-text-muted);

  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.search-filters__search:focus-within {
  border-color: var(--color-border-red);
  box-shadow: 0 0 0 3px rgba(255, 48, 69, 0.07);
}

.search-filters__search input {
  width: 100%;
  min-width: 0;

  border: 0;
  outline: 0;

  background: transparent;
  color: var(--color-text);

  font-family: inherit;
  font-size: 0.74rem;
}

.search-filters__search input::placeholder {
  color: var(--color-text-muted);
}

.search-filters__search kbd {
  flex-shrink: 0;

  padding: 3px 6px;

  border: 1px solid var(--color-border);
  border-radius: 5px;

  color: var(--color-text-muted);
  font-size: 0.6rem;
}

.search-filters__clear {
  min-height: 38px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  padding: 0 10px;

  border: 1px solid var(--color-border);
  border-radius: 8px;

  background: rgba(255, 255, 255, 0.025);
  color: var(--color-text-secondary);

  font-size: 0.67rem;
  white-space: nowrap;
}

.search-filters__clear:hover {
  border-color: var(--color-border-red);
  color: var(--color-red-bright);
}

.search-filters__selects {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.search-filters__field {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.search-filters__field > span {
  color: var(--color-text-secondary);
  font-size: 0.65rem;
  font-weight: 700;
}

.search-filters__field select,
.search-filters__field input[type="date"] {
  width: 100%;
  min-width: 0;
  height: 37px;

  padding: 0 9px;

  border: 1px solid var(--color-border);
  border-radius: 8px;

  outline: none;
  background: #0b0b0e;
  color: var(--color-text);

  font-family: inherit;
  font-size: 0.68rem;
}

.search-filters__field select:focus,
.search-filters__field input[type="date"]:focus {
  border-color: var(--color-red-bright);
}

.search-filters__field input[type="date"] {
  color-scheme: dark;
  color: var(--color-text);
  font-family: inherit;
  font-size: 0.68rem;
}

.search-filters__field option {
  background: #171719;
  color: #fff;
}

.search-filters__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  color: var(--color-text-muted);
  font-size: 0.64rem;
}

.search-filters__footer strong {
  color: var(--color-text);
}

.search-filters__active {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #4ade80;
}

@media (max-width: 900px) {
  .search-filters__selects {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .search-filters__top {
    align-items: stretch;
    flex-direction: column;
  }

  .search-filters__clear {
    align-self: flex-start;
  }

  .search-filters__selects {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
