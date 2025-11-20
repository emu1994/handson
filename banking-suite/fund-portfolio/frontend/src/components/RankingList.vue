<template>
  <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
    <h3 class="text-sm font-semibold">損益ランキング</h3>
    <ol class="space-y-2">
      <li
        v-for="item in ranking"
        :key="item.id"
        class="flex items-center justify-between text-[12px]"
      >
        <span>{{ item.fund.name }}</span>
        <span :class="item.profit >= 0 ? 'text-emerald-300' : 'text-rose-300'">
          {{ formatNumber(item.profit) }} 円
        </span>
      </li>
      <li v-if="ranking.length === 0" class="text-slate-400 text-sm">
        データがありません。
      </li>
    </ol>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  holdings: {
    type: Array,
    default: () => []
  }
})

const ranking = computed(() =>
  props.holdings
    .map((h) => ({
      ...h,
      profit: Number(h.units ?? 0) * (Number(h.latestNav ?? 0) - Number(h.averagePrice ?? 0))
    }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 5)
)

function formatNumber(value) {
  return Number(value ?? 0).toLocaleString('ja-JP', {
    maximumFractionDigits: 0
  })
}
</script>
