import React, { useMemo } from 'react'

export default function CashflowTable({ data }) {
  const rows = useMemo(() => {
    let balance = 0
    return data.map((item) => {
      balance += Number(item.inflow ?? 0) - Number(item.outflow ?? 0)
      return { ...item, running: balance }
    })
  }, [data])

  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden">
      <table className="w-full text-[12px]">
        <thead className="bg-slate-900/70 text-slate-300">
          <tr>
            <th className="px-3 py-2 text-left">日付</th>
            <th className="px-3 py-2 text-right">入金</th>
            <th className="px-3 py-2 text-right">出金</th>
            <th className="px-3 py-2 text-right">純額</th>
            <th className="px-3 py-2 text-right">累計純額</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {rows.map((row) => {
            const net = Number(row.inflow ?? 0) - Number(row.outflow ?? 0)
            return (
              <tr key={`${row.id}-${row.date}`} className="bg-slate-950/60">
                <td className="px-3 py-2">{row.date}</td>
                <td className="px-3 py-2 text-right text-emerald-300">
                  {Number(row.inflow ?? 0).toLocaleString('ja-JP')}
                </td>
                <td className="px-3 py-2 text-right text-rose-300">
                  {Number(row.outflow ?? 0).toLocaleString('ja-JP')}
                </td>
                <td className="px-3 py-2 text-right font-mono">
                  {net.toLocaleString('ja-JP')}
                </td>
                <td className="px-3 py-2 text-right font-mono text-sky-300">
                  {row.running.toLocaleString('ja-JP')}
                </td>
              </tr>
            )
          })}
          {rows.length === 0 && (
            <tr>
              <td className="px-3 py-4 text-center text-slate-400" colSpan={5}>
                対象期間のデータがありません。
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
