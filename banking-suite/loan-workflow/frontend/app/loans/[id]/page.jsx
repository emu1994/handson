import LoanDetailClient from '../../../components/LoanDetailClient.jsx'

const API_BASE = 'http://localhost:8083/api'

async function fetchLoan(id) {
  const res = await fetch(`${API_BASE}/loans/${id}`, { cache: 'no-store' })
  if (!res.ok) {
    return null
  }
  return res.json()
}

export default async function LoanDetailPage({ params }) {
  const loan = await fetchLoan(params.id)

  if (!loan) {
    return (
      <main className="p-6">
        <p className="text-sm text-red-400">申込が見つかりませんでした。</p>
      </main>
    )
  }

  return (
    <main className="p-6 space-y-4">
      <div>
        <p className="text-xs text-slate-400">Application detail</p>
        <h1 className="text-xl font-semibold">{loan.applicantName}</h1>
      </div>
      <LoanDetailClient loan={loan} />
    </main>
  )
}
