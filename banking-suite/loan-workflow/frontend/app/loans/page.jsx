'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const API_BASE = 'http://localhost:8083/api'

const statuses = ['ALL', 'APPLIED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED']

export default function LoansPage() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(false)

  const fetchLoans = async (status) => {
    setLoading(true)
    const query = status && status !== 'ALL' ? `?status=${status}` : ''
    const res = await fetch(`${API_BASE}/loans${query}`)
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchLoans(filter)
  }, [filter])

  return (
    <main className="p-6 space-y-6">
      <header>
        <p className="text-xs text-slate-400">Loan pipeline overview</p>
        <h1 className="text-xl font-semibold">申込一覧</h1>
      </header>

      <div className="flex flex-wrap gap-3 text-[12px] items-center">
        <label className="flex items-center gap-2">
          ステータス
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded px-3 py-1"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        {loading && <span className="text-xs text-sky-300">読み込み中...</span>}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-[12px]">
          <thead className="bg-slate-900/60 text-slate-300">
            <tr>
              <th className="px-3 py-2 text-left">申込者</th>
              <th className="px-3 py-2 text-left">年収</th>
              <th className="px-3 py-2 text-left">希望額</th>
              <th className="px-3 py-2 text-left">期間</th>
              <th className="px-3 py-2 text-left">ステータス</th>
              <th className="px-3 py-2 text-left">スコア</th>
              <th className="px-3 py-2 text-left">詳細</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {items.map((loan) => (
              <tr key={loan.id} className="bg-slate-950/70">
                <td className="px-3 py-2">{loan.applicantName}</td>
                <td className="px-3 py-2">
                  {Number(loan.annualIncome ?? 0).toLocaleString('ja-JP')} 円
                </td>
                <td className="px-3 py-2">
                  {Number(loan.requestedAmount ?? 0).toLocaleString('ja-JP')} 円
                </td>
                <td className="px-3 py-2">{loan.termMonths} ヶ月</td>
                <td className="px-3 py-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-slate-700">
                    {loan.status}
                  </span>
                </td>
                <td className="px-3 py-2">{loan.score ?? '-'} pts</td>
                <td className="px-3 py-2">
                  <Link
                    href={`/loans/${loan.id}`}
                    className="text-sky-400 hover:underline"
                  >
                    詳細
                  </Link>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-4 text-center text-slate-400">
                  データがありません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}
