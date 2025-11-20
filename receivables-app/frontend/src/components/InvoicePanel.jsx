import React, { useEffect, useMemo, useState } from 'react'

const STATUS_LIST = ['OPEN', 'PAID', 'OVERDUE', 'DISPUTED']

function formatDate(s) {
  if (!s) return '-'
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return s
  return d.toLocaleDateString('ja-JP')
}

function formatAmount(n) {
  const v = Number(n ?? 0)
  return v.toLocaleString('ja-JP')
}

function statusClass(status) {
  return `badge-status badge-status-${status}`
}

function agingBucket(daysOverdue) {
  const v = Number(daysOverdue ?? 0)
  if (v <= 0) return 'CURRENT'
  if (v <= 30) return '1-30'
  if (v <= 60) return '31-60'
  if (v <= 90) return '61-90'
  return '90+'
}

export default function InvoicePanel({ customerId, customers }) {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [filters, setFilters] = useState({
    flaggedOnlyOverdue: false,
    minAmount: '',
    statuses: new Set(STATUS_LIST),
    aging: 'ALL'
  })

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === customerId) || null,
    [customerId, customers]
  )

  useEffect(() => {
    const loadInvoices = async () => {
      if (!customerId) {
        setInvoices([])
        return
      }
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`/api/customers/${customerId}/invoices`)
        if (!res.ok) {
          throw new Error('HTTP ' + res.status)
        }
        const data = await res.json()
        setInvoices(data)
      } catch (e) {
        console.error(e)
        setError('請求一覧の取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }
    loadInvoices()
  }, [customerId])

  const toggleStatus = (status) => {
    setFilters((prev) => {
      const next = new Set(prev.statuses)
      if (next.has(status)) {
        next.delete(status)
      } else {
        next.add(status)
      }
      return { ...prev, statuses: next }
    })
  }

  const handleFilterChange = (field) => (e) => {
    const value =
      field === 'flaggedOnlyOverdue'
        ? e.target.checked
        : e.target.value
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const resetFilters = () => {
    setFilters({
      flaggedOnlyOverdue: false,
      minAmount: '',
      statuses: new Set(STATUS_LIST),
      aging: 'ALL'
    })
  }

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      let ok = true
      if (!filters.statuses.has(inv.status)) {
        ok = false
      }

      const bucket = agingBucket(inv.daysOverdue)
      if (filters.aging !== 'ALL' && bucket !== filters.aging) {
        ok = false
      }

      if (filters.flaggedOnlyOverdue) {
        if (inv.status !== 'OVERDUE') ok = false
      }

      if (filters.minAmount !== '') {
        const min = Number(filters.minAmount)
        const amt = Number(inv.amount ?? 0)
        if (!Number.isNaN(min)) {
          if (Math.abs(amt) < min) ok = false
        }
      }

      return ok
    })
  }, [invoices, filters])

  const summary = useMemo(() => {
    const total = invoices.length
    const overdueItems = invoices.filter(
      (inv) => inv.status === 'OVERDUE'
    )
    const overdueCount = overdueItems.length
    const totalAmount = invoices.reduce((sum, inv) => {
      const v = Number(inv.amount ?? 0)
      return sum + (Number.isNaN(v) ? 0 : v)
    }, 0)
    const overdueAmount = overdueItems.reduce((sum, inv) => {
      const v = Number(inv.amount ?? 0)
      return sum + (Number.isNaN(v) ? 0 : v)
    }, 0)
    return { total, overdueCount, totalAmount, overdueAmount }
  }, [invoices])

  return (
    <div>
      <div className="tx-header">
        <div>
          <h2>請求一覧</h2>
          <div className="tx-account-label">
            {selectedCustomer ? (
              <>
                {selectedCustomer.name} /{' '}
                {selectedCustomer.customerCode}
              </>
            ) : (
              <>顧客を選択してください</>
            )}
          </div>
        </div>
        <div>
          {summary.total > 0 && (
            <div style={{ fontSize: 11, textAlign: 'right' }}>
              <div>
                件数: {summary.total} / 延滞:{' '}
                {summary.overdueCount} 件
              </div>
              <div>
                総額: {formatAmount(summary.totalAmount)} 円 / 延滞:{' '}
                {formatAmount(summary.overdueAmount)} 円
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedCustomer && (
        <div className="tx-filters">
          <label>
            <input
              type="checkbox"
              checked={filters.flaggedOnlyOverdue}
              onChange={handleFilterChange('flaggedOnlyOverdue')}
            />
            延滞のみ
          </label>

          <label>
            最低金額（絶対値, 円）
            <input
              type="number"
              value={filters.minAmount}
              onChange={handleFilterChange('minAmount')}
              min={0}
            />
          </label>

          <label>
            エイジング
            <select
              value={filters.aging}
              onChange={handleFilterChange('aging')}
            >
              <option value="ALL">ALL</option>
              <option value="CURRENT">CURRENT</option>
              <option value="1-30">1-30</option>
              <option value="31-60">31-60</option>
              <option value="61-90">61-90</option>
              <option value="90+">90+</option>
            </select>
          </label>

          <div className="status-group">
            {STATUS_LIST.map((st) => (
              <label key={st}>
                <input
                  type="checkbox"
                  checked={filters.statuses.has(st)}
                  onChange={() => toggleStatus(st)}
                />
                {st}
              </label>
            ))}
          </div>

          <button
            type="button"
            className="secondary"
            onClick={resetFilters}
          >
            条件クリア
          </button>
        </div>
      )}

      {loading && <div>読み込み中...</div>}
      {!loading && error && (
        <div style={{ color: '#fca5a5', fontSize: 12 }}>{error}</div>
      )}

      {!loading && !error && selectedCustomer && (
        <div className="tx-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>請求番号</th>
                <th>発行日</th>
                <th>期日</th>
                <th>金額</th>
                <th>ステータス</th>
                <th>延滞日数</th>
                <th>エイジング</th>
                <th>備考</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => {
                const bucket = agingBucket(inv.daysOverdue)
                return (
                  <tr key={inv.id}>
                    <td>{inv.invoiceNumber}</td>
                    <td>{formatDate(inv.issueDate)}</td>
                    <td>{formatDate(inv.dueDate)}</td>
                    <td className="amount-cell">
                      {formatAmount(inv.amount)} {inv.currency}
                    </td>
                    <td>
                      <span className={statusClass(inv.status)}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {inv.daysOverdue}
                    </td>
                    <td>
                      <span className="badge-aging">{bucket}</span>
                    </td>
                    <td>{inv.note}</td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="tx-empty">
                    条件に一致する請求データがありません。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {!selectedCustomer && (
        <div className="tx-empty">
          左の顧客一覧から顧客を選択してください。
        </div>
      )}
    </div>
  )
}
