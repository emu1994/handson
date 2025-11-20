<template>
  <div class="flex flex-wrap gap-3 text-[12px] items-end">
    <label class="flex flex-col gap-1">
      アセットクラス
      <select v-model="selectedClass" class="bg-slate-950 border border-slate-700 rounded px-3 py-2">
        <option value="ALL">ALL</option>
        <option v-for="c in assetClasses" :key="c" :value="c">{{ c }}</option>
      </select>
    </label>
    <label class="flex flex-col gap-1">
      リスクレベル
      <select v-model="selectedRisk" class="bg-slate-950 border border-slate-700 rounded px-3 py-2">
        <option value="ALL">ALL</option>
        <option v-for="r in riskLevels" :key="r" :value="r">{{ r }}</option>
      </select>
    </label>
    <button
      type="button"
      class="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700"
      @click="$emit('clear')"
    >
      クリア
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  assetClasses: Array,
  riskLevels: Array,
  modelValue: Object
})

const emit = defineEmits(['update:modelValue', 'clear'])

const selectedClass = computed({
  get: () => props.modelValue.assetClass,
  set: (value) => emit('update:modelValue', { ...props.modelValue, assetClass: value })
})

const selectedRisk = computed({
  get: () => props.modelValue.riskLevel,
  set: (value) => emit('update:modelValue', { ...props.modelValue, riskLevel: value })
})
</script>
