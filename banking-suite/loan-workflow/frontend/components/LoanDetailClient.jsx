'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const API_BASE = 'http://localhost:8083/api'

export default function LoanDetailClient({ loan }) {
  const router = useRouter()
  const [status, setStatus] = useState(loan.status)
  const [score, setScore] = useState(loan.score ?? '')
  const [remark, setRemark] = useState(loan.remark ?? '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch(`${API_BASE}/loans/${loan.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, score: score === '' ? null : Number(score), remark })
      })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      setMessage('更新しました')
      router.refresh()
    } catch (err) {
      console.error(err)
      setMessage('更新に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[13px]">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-400">申込者</p>
          <p className="text-lg">{loan.applicantName}</p>
          <p className="text-xs text-slate-500">{loan.birthDate}</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-400">希望額 / 期間</p>
          <p className="text-lg">
            {Number(loan.requestedAmount ?? 0).toLocaleString('ja-JP')} 円
          </p>
          <p className="text-xs text-slate-500">{loan.termMonths} ヶ月</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-400">年収</p>
          <p className="text-lg">
            {Number(loan.annualIncome ?? 0).toLocaleString('ja-JP')} 円
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex flex-col gap-1 text-[13px]">
            ステータス
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded px-3 py-2"
            >
              <option value="APPLIED">APPLIED</option>
              <option value="UNDER_REVIEW">UNDER_REVIEW</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[13px]">
            スコア
            <input
              type="number"
              min="0"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-[13px]">
            備考
            <input
              type="text"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded px-3 py-2"
            />
          </label>
        </div>
        {message && <p className="text-sm text-slate-300">{message}</p>}
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 rounded bg-indigo-600 text-white text-sm disabled:opacity-50"
        >
          {saving ? '保存中...' : '更新'}
        </button>
      </form>
    </section>
  )
}
