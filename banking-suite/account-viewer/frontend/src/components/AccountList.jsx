import React from 'react'

export default function AccountList({
  accounts,
  selectedAccountId,
  onSelect,
  loading,
  error,
}) {
  return (
    <div className="bg-slate-900/60 rounded-xl border border-slate-800 shadow-xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-100">
          口座一覧
        </h2>
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

      <div className="overflow-hidden rounded-lg border border-slate-800">
        <table className="w-full text-xs">
          <thead className="bg-slate-900/80 border-b border-slate-800">
            <tr>
              <th className="px-3 py-2 text-left">口座番号</th>
              <th className="px-3 py-2 text-left">名義</th>
              <th className="px-3 py-2 text-left">種別</th>
              <th className="px-3 py-2 text-right">残高</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-950/60">
            {accounts.map((a) => (
              <tr
                key={a.id}
                className={
                  'cursor-pointer hover:bg-slate-800/60 transition-colors ' +
                  (a.id === selectedAccountId
                    ? 'bg-sky-900/40'
                    : '')
                }
                onClick={() => onSelect(a.id)}
              >
                <td className="px-3 py-2">{a.accountNumber}</td>
                <td className="px-3 py-2">{a.holderName}</td>
                <td className="px-3 py-2">
                  <span className="inline-flex items-center rounded-full border border-slate-700 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                    {a.accountType}
                  </span>
                </td>
                <td className="px-3 py-2 text-right font-mono">
                  {Number(a.balance ?? 0).toLocaleString('ja-JP')} 円
                </td>
              </tr>
            ))}
            {accounts.length === 0 && !loading && (
              <tr>
                <td
                  className="px-3 py-3 text-center text-slate-400"
                  colSpan={4}
                >
                  口座データがありません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
