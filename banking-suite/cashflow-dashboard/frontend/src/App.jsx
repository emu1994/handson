import React, { useEffect, useMemo, useState } from 'react'
import AccountCards from './components/AccountCards.jsx'
import CashflowTable from './components/CashflowTable.jsx'

const API_BASE = 'http://localhost:8081/api'

function formatDate(date) {
  return date.toISOString().slice(0, 10)
}

function MiniChart({ data }) {
  const maxAbs = Math.max(
    1,
    ...data.map((item) => Math.abs(Number(item.inflow ?? 0) - Number(item.outflow ?? 0)))
  )
  return (
    <div className="flex gap-1 h-32 items-end">
      {data.map((item) => {
        const net = Number(item.inflow ?? 0) - Number(item.outflow ?? 0)
        const height = Math.round((Math.abs(net) / maxAbs) * 100)
        const positive = net >= 0
        return (
          <div key={`${item.id}-${item.date}`} className="flex flex-col items-center flex-1">
            <div
              className={`w-3 rounded-t ${positive ? 'bg-emerald-400' : 'bg-rose-400'}`}
              style={{ height: `${height}%` }}
              title={`${item.date} : ${net.toLocaleString('ja-JP')}`}
            />
            <span className="text-[10px] text-slate-400 mt-1">{item.date.slice(5)}</span>
          </div>
        )
      })}
    </div>
  )
}

function App() {
  const [accounts, setAccounts] = useState([])
  const [cashflow, setCashflow] = useState([])
  const [from, setFrom] = useState(() => formatDate(new Date(Date.now() - 7 * 86400000)))
  const [to, setTo] = useState(() => formatDate(new Date()))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API_BASE}/accounts`)
      .then((res) => res.json())
      .then(setAccounts)
      .catch((e) => console.error(e))
  }, [])

  const loadCashflow = () => {
    setLoading(true)
    setError('')
    fetch(`${API_BASE}/cashflow?from=${from}&to=${to}`)
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status)
        return res.json()
      })
      .then(setCashflow)
      .catch((e) => {
        console.error(e)
        setError('キャッシュフローの取得に失敗しました')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadCashflow()
  }, [])

  const summary = useMemo(() => {
    const inflow = cashflow.reduce((sum, item) => sum + Number(item.inflow ?? 0), 0)
    const outflow = cashflow.reduce((sum, item) => sum + Number(item.outflow ?? 0), 0)
    return { inflow, outflow, net: inflow - outflow }
  }, [cashflow])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="px-6 py-4 border-b border-slate-800 bg-slate-900/50">
        <h1 className="text-sm font-semibold">② 法人向け資金繰りダッシュボード</h1>
        <p className="text-[11px] text-slate-400">Spring Boot + PostgreSQL + React + Tailwind</p>
      </header>

      <main className="p-6 space-y-6">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">口座一覧</h2>
            <div className="text-[11px] text-slate-400">合計 {accounts.length} 口座</div>
          </div>
          <AccountCards accounts={accounts} />
        </section>

        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-4">
          <div className="flex flex-wrap gap-3 items-end text-[12px]">
            <label className="flex flex-col gap-1">
              From
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col gap-1">
              To
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded px-2 py-1"
              />
            </label>
            <button
              type="button"
              onClick={loadCashflow}
              className="px-4 py-1.5 rounded bg-sky-600 text-white text-[12px] hover:bg-sky-500"
            >
              更新
            </button>
            {loading && (
              <span className="text-xs text-sky-300">読み込み中...</span>
            )}
            {error && (
              <span className="text-xs text-red-400">{error}</span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-[12px]">
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <p className="text-slate-400">入金</p>
              <p className="text-2xl text-emerald-300 font-mono">
                {summary.inflow.toLocaleString('ja-JP')} 円
              </p>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <p className="text-slate-400">出金</p>
              <p className="text-2xl text-rose-300 font-mono">
                {summary.outflow.toLocaleString('ja-JP')} 円
              </p>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <p className="text-slate-400">純額</p>
              <p className="text-2xl text-sky-300 font-mono">
                {summary.net.toLocaleString('ja-JP')} 円
              </p>
            </div>
          </div>

          <MiniChart data={cashflow} />

          <CashflowTable data={cashflow} />
        </section>
      </main>
    </div>
  )
}

export default App
