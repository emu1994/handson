'use client'

import { useEffect, useState } from 'react'
import TransferList from '../../components/TransferList.jsx'

const API_BASE = 'http://localhost:8082/api'

export default function TransfersPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchTransfers = async (status) => {
    setLoading(true)
    const query = status ? `?status=${status}` : ''
    const res = await fetch(`${API_BASE}/transfers${query}`)
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchTransfers()
  }, [])

  return (
    <main className="p-6 space-y-6">
      <header>
        <p className="text-xs text-slate-400">Next.js + Tailwind</p>
        <h1 className="text-xl font-semibold">③ 振込予約一覧</h1>
      </header>
      <TransferList
        items={items}
        loading={loading}
        onFilter={(status) => fetchTransfers(status)}
      />
    </main>
  )
}
