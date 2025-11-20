import React, { useMemo, useState } from 'react'

function formatDateTime(s) {
  if (!s) return '-'
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return s
  return d.toLocaleString('ja-JP')
}

export default function TransactionList({ account, transactions, loading, error }) {
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [minAmount, setMinAmount] = useState('')

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      let ok = true
      if (typeFilter !== 'ALL') {
        ok = ok && t.type === typeFilter
      }
      if (minAmount !== '') {
        const min = Number(minAmount)
        const amount = Number(t.amount ?? 0)
        if (!Number.isNaN(min)) {
          ok = ok && Math.abs(amount) >= min
        }
      }
      return ok
    })
  }, [transactions, typeFilter, minAmount])

  return (
    <div className="bg-slate-900/60 rounded-xl border border-slate-800 shadow-xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">
            入出金明細
          </h2>
          <p className="text-[11px] text-slate-400">
            {account
              ? `${account.holderName} / ${account.accountNumber}`
              : '左の口座一覧から口座を選択してください'}
          </p>
        </div>
        {loading && (
          <span className="text-xs text-sky-400 animate-pulse">
            読み込み中...
          </span>
        )}
      </div>

      {error && (
        <div className="text-xs text-red-400 mb-2">
          {error}
        </div>
      )}

      {account && (
        <div className="flex flex-wrap gap-3 mb-3 items-end text-[11px]">
          <label className="flex flex-col gap-1">
            種別
            <select
              className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-[11px]"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">ALL</option>
              <option value="DEPOSIT">DEPOSIT（入金）</option>
              <option value="WITHDRAWAL">WITHDRAWAL（出金）</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            最低金額（絶対値）
            <input
              type="number"
              className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-[11px] w-28"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              min={0}
            />
          </label>
          <button
            type="button"
            className="ml-auto px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px]"
            onClick={() => {
              setTypeFilter('ALL')
              setMinAmount('')
            }}
          >
            条件クリア
          </button>
        </div>
      )}

      <div className="flex-1 overflow-hidden rounded-lg border border-slate-800">
        <table className="w-full text-[11px]">
          <thead className="bg-slate-900/80 border-b border-slate-800">
            <tr>
              <th className="px-3 py-2 text-left">日時</th>
              <th className="px-3 py-2 text-left">種別</th>
              <th className="px-3 py-2 text-right">金額</th>
              <th className="px-3 py-2 text-left">内容</th>
            </tr>
          </thead>
          <tbody className="bg-slate-950/60 divide-y divide-slate-800 max-h-[360px] overflow-y-auto">
            {filtered.map((t) => (
              <tr key={t.id}>
                <td className="px-3 py-2 whitespace-nowrap">
                  {formatDateTime(t.occurredAt)}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={
                      'inline-flex items-center rounded-full px-2 py-0.5 border ' +
                      (t.type === 'DEPOSIT'
                        ? 'border-emerald-500/60 text-emerald-300'
                        : 'border-rose-500/60 text-rose-300')
                    }
                  >
                    {t.type}
                  </span>
                </td>
                <td className="px-3 py-2 text-right font-mono">
                  {Number(t.amount ?? 0).toLocaleString('ja-JP')} 円
                </td>
                <td className="px-3 py-2">{t.description}</td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-3 text-center text-slate-400"
                >
                  明細がありません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
