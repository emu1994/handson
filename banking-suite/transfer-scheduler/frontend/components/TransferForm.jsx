'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const API_BASE = 'http://localhost:8082/api'

export default function TransferForm() {
  const [beneficiaries, setBeneficiaries] = useState([])
  const [form, setForm] = useState({
    beneficiaryId: '',
    amount: '',
    scheduledDate: '',
    description: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch(`${API_BASE}/beneficiaries`)
      .then((res) => res.json())
      .then(setBeneficiaries)
      .catch((e) => {
        console.error(e)
        setError('受取人の取得に失敗しました')
      })
  }, [])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/transfers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beneficiaryId: Number(form.beneficiaryId),
          amount: Number(form.amount),
          scheduledDate: form.scheduledDate,
          description: form.description
        })
      })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      router.push('/transfers')
    } catch (err) {
      console.error(err)
      setError('登録に失敗しました')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
        <label className="flex flex-col gap-1">
          受取人
          <select
            required
            value={form.beneficiaryId}
            onChange={(e) => handleChange('beneficiaryId', e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded px-3 py-2"
          >
            <option value="">選択してください</option>
            {beneficiaries.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} / {b.bankName}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          金額（円）
          <input
            type="number"
            min="1"
            required
            value={form.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          予定日
          <input
            type="date"
            required
            value={form.scheduledDate}
            onChange={(e) => handleChange('scheduledDate', e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          メモ
          <input
            type="text"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded px-3 py-2"
          />
        </label>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 rounded bg-sky-600 text-white text-sm disabled:opacity-50"
        >
          {submitting ? '送信中...' : '登録'}
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded border border-slate-600 text-sm"
          onClick={() => router.back()}
        >
          キャンセル
        </button>
      </div>
    </form>
  )
}
