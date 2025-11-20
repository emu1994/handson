import React from 'react'

export default function AccountCards({ accounts }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {accounts.map((acc) => (
        <div
          key={acc.id}
          className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 shadow"
        >
          <p className="text-[11px] text-slate-400">{acc.bankName}</p>
          <h3 className="text-sm font-semibold">{acc.accountNumber}</h3>
          <p className="text-[11px] uppercase text-slate-400">{acc.accountType}</p>
          <p className="text-lg font-mono text-sky-300">
            {Number(acc.balance ?? 0).toLocaleString('ja-JP')} 円
          </p>
        </div>
      ))}
      {accounts.length === 0 && (
        <div className="col-span-full text-sm text-slate-400 py-4 text-center">
          口座データがありません
        </div>
      )}
    </div>
  )
}
