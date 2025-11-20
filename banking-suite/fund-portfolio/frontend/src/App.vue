<template>
  <div class="min-h-screen p-6 space-y-6">
    <header>
      <p class="text-xs text-slate-400">Spring Boot + Vue + Tailwind</p>
      <h1 class="text-xl font-semibold">⑤ 投資信託ポートフォリオトラッカー</h1>
    </header>

    <section class="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-4">
      <FilterBar
        v-model="filters"
        :asset-classes="assetClasses"
        :risk-levels="riskLevels"
        @clear="resetFilters"
      />
      <div v-if="error" class="text-sm text-red-400">{{ error }}</div>
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-4 text-[12px]">
        <div class="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <p class="text-slate-400">評価額合計</p>
          <p class="text-2xl text-sky-300 font-mono">{{ formatNumber(summary.totalValuation) }} 円</p>
        </div>
        <div class="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <p class="text-slate-400">含み損益</p>
          <p :class="[
            'text-2xl font-mono',
            summary.totalProfit >= 0 ? 'text-emerald-300' : 'text-rose-300'
          ]">
            {{ formatNumber(summary.totalProfit) }} 円
          </p>
        </div>
        <div class="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <p class="text-slate-400">ファンド数</p>
          <p class="text-2xl text-slate-100 font-mono">{{ filteredHoldings.length }}</p>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div class="xl:col-span-2 space-y-4">
        <HoldingTable :holdings="filteredHoldings" />
      </div>
      <RankingList :holdings="filteredHoldings" />
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import HoldingTable from './components/HoldingTable.vue'
import FilterBar from './components/FilterBar.vue'
import RankingList from './components/RankingList.vue'

const API_BASE = 'http://localhost:8084/api'

const funds = ref([])
const holdings = ref([])
const error = ref('')
const filters = reactive({ assetClass: 'ALL', riskLevel: 'ALL' })

onMounted(async () => {
  try {
    const [fundRes, holdingRes] = await Promise.all([
      fetch(`${API_BASE}/funds`),
      fetch(`${API_BASE}/holdings`)
    ])
    if (!fundRes.ok || !holdingRes.ok) throw new Error('HTTP error')
    funds.value = await fundRes.json()
    holdings.value = await holdingRes.json()
  } catch (e) {
    console.error(e)
    error.value = 'データ取得に失敗しました'
  }
})

const enrichedHoldings = computed(() =>
  holdings.value.map((h) => ({
    ...h,
    fund: funds.value.find((f) => f.id === h.fund?.id || f.id === h.fund_id) || h.fund
  }))
)

const filteredHoldings = computed(() =>
  enrichedHoldings.value.filter((h) => {
    const assetOk =
      filters.assetClass === 'ALL' || h.fund?.assetClass === filters.assetClass
    const riskOk = filters.riskLevel === 'ALL' || h.fund?.riskLevel === filters.riskLevel
    return assetOk && riskOk
  })
)

const assetClasses = computed(() => [...new Set(funds.value.map((f) => f.assetClass))])
const riskLevels = computed(() => [...new Set(funds.value.map((f) => f.riskLevel))])

const summary = computed(() => {
  return filteredHoldings.value.reduce(
    (acc, h) => {
      const units = Number(h.units ?? 0)
      const latestNav = Number(h.latestNav ?? 0)
      const averagePrice = Number(h.averagePrice ?? 0)
      acc.totalValuation += units * latestNav
      acc.totalProfit += units * (latestNav - averagePrice)
      return acc
    },
    { totalValuation: 0, totalProfit: 0 }
  )
})

function resetFilters() {
  filters.assetClass = 'ALL'
  filters.riskLevel = 'ALL'
}

function formatNumber(value) {
  return Number(value ?? 0).toLocaleString('ja-JP', { maximumFractionDigits: 0 })
}
</script>
