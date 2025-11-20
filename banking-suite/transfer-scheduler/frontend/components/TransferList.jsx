'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function TransferList({ items, loading, onFilter }) {
  const [status, setStatus] = useState('ALL')

  const handleChange = (value) => {
    setStatus(value)
    onFilter(value === 'ALL' ? undefined : value)
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-4">
      <div className="flex flex-wrap gap-3 items-center text-[12px]">
        <label className="flex items-center gap-2">
          ステータス
          <select
            value={status}
            onChange={(e) => handleChange(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded px-2 py-1"
          >
            <option value="ALL">ALL</option>
            <option value="PENDING">PENDING</option>
            <option value="EXECUTED">EXECUTED</option>
            <option value="FAILED">FAILED</option>
          </select>
        </label>
        {loading && <span className="text-xs text-sky-300">読み込み中...</span>}
        <Link
          href="/transfers/new"
          className="ml-auto px-4 py-1.5 text-sm rounded bg-sky-600 text-white hover:bg-sky-500"
        >
          新規作成
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead className="text-slate-300">
            <tr>
              <th className="text-left px-3 py-2">受取人</th>
              <th className="text-left px-3 py-2">銀行</th>
              <th className="text-left px-3 py-2">日付</th>
              <th className="text-right px-3 py-2">金額</th>
              <th className="text-left px-3 py-2">ステータス</th>
              <th className="text-left px-3 py-2">メモ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {items.map((order) => (
              <tr key={order.id} className="bg-slate-950/70">
                <td className="px-3 py-2">{order.beneficiary?.name}</td>
                <td className="px-3 py-2 text-slate-400">
                  {order.beneficiary?.bankName} / {order.beneficiary?.branchName}
                </td>
                <td className="px-3 py-2">{order.scheduledDate}</td>
                <td className="px-3 py-2 text-right font-mono">
                  {Number(order.amount ?? 0).toLocaleString('ja-JP')} 円
                </td>
                <td className="px-3 py-2">
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 border border-slate-700 text-[11px]">
                    {order.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-slate-400">{order.description}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-center text-slate-400">
                  データがありません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
