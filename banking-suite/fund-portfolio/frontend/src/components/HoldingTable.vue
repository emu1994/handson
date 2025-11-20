<template>
  <div class="overflow-x-auto rounded-2xl border border-slate-800">
    <table class="w-full text-[12px]">
      <thead class="bg-slate-900/70 text-slate-300">
        <tr>
          <th class="px-3 py-2 text-left">ファンド</th>
          <th class="px-3 py-2 text-left">資産クラス</th>
          <th class="px-3 py-2 text-left">リスク</th>
          <th class="px-3 py-2 text-right">口数</th>
          <th class="px-3 py-2 text-right">平均取得</th>
          <th class="px-3 py-2 text-right">最新基準価額</th>
          <th class="px-3 py-2 text-right">評価額</th>
          <th class="px-3 py-2 text-right">損益</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-800">
        <tr v-for="item in rows" :key="item.id" class="bg-slate-950/60">
          <td class="px-3 py-2">{{ item.fund.name }}</td>
          <td class="px-3 py-2 text-slate-400">{{ item.fund.assetClass }}</td>
          <td class="px-3 py-2">
            <span class="inline-flex items-center rounded-full border border-slate-700 px-2 py-0.5 text-[11px]">
              {{ item.fund.riskLevel }}
            </span>
          </td>
          <td class="px-3 py-2 text-right font-mono">{{ formatNumber(item.units, 4) }}</td>
          <td class="px-3 py-2 text-right">{{ formatNumber(item.averagePrice, 2) }}</td>
          <td class="px-3 py-2 text-right">{{ formatNumber(item.latestNav, 2) }}</td>
          <td class="px-3 py-2 text-right text-sky-300">
            {{ formatNumber(item.valuation, 0) }} 円
          </td>
          <td class="px-3 py-2 text-right" :class="item.profit >= 0 ? 'text-emerald-300' : 'text-rose-300'">
            {{ formatNumber(item.profit, 0) }} 円
          </td>
        </tr>
        <tr v-if="rows.length === 0">
          <td colspan="8" class="px-3 py-4 text-center text-slate-400">
            データがありません。
          </td>
        </tr>
      </tbody>
    </table>
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

const rows = computed(() =>
  props.holdings.map((h) => {
    const units = Number(h.units ?? 0)
    const latestNav = Number(h.latestNav ?? 0)
    const averagePrice = Number(h.averagePrice ?? 0)
    const valuation = units * latestNav
    const profit = units * (latestNav - averagePrice)
    return { ...h, valuation, profit }
  })
)

function formatNumber(value, digits = 0) {
  return Number(value ?? 0).toLocaleString('ja-JP', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })
}
</script>
