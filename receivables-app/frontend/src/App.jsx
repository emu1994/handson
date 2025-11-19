import React, { useEffect, useMemo, useState, useCallback } from 'react'
import CustomerList from './components/CustomerList.jsx'
import InvoicePanel from './components/InvoicePanel.jsx'

function App() {
  const [customers, setCustomers] = useState([])
  const [loadingCustomers, setLoadingCustomers] = useState(false)
  const [customerError, setCustomerError] = useState('')
  const [selectedCustomerId, setSelectedCustomerId] = useState(null)

  const loadCustomers = useCallback(async () => {
    setLoadingCustomers(true)
    setCustomerError('')
    try {
      const res = await fetch('/api/customers')
      if (!res.ok) {
        throw new Error('HTTP ' + res.status)
      }
      const data = await res.json()
      setCustomers(data)
      if (data.length > 0 && selectedCustomerId == null) {
        setSelectedCustomerId(data[0].id)
      }
    } catch (e) {
      console.error(e)
      setCustomerError('顧客一覧の取得に失敗しました')
    } finally {
      setLoadingCustomers(false)
    }
  }, [selectedCustomerId])

  useEffect(() => {
    loadCustomers()
  }, [loadCustomers])

  const summary = useMemo(() => {
    const total = customers.length
    const highRisk = customers.filter(c => (c.riskScore ?? 0) >= 70).length
    const totalExposure = customers.reduce((sum, c) => {
      const v = Number(c.totalExposure ?? 0)
      return sum + (isNaN(v) ? 0 : v)
    }, 0)
    return { total, highRisk, totalExposure }
  }, [customers])

  return (
    <div className="app-root">
      <header className="app-header">
        <div>
          <h1>Receivables Dashboard</h1>
          <small>債権・請求管理ダッシュボード（Spring Boot / PostgreSQL / React）</small>
        </div>
        <div>
          <small>⑤ 金融系：顧客別債権モニタリング</small>
        </div>
      </header>

      <main className="app-main">
        <section className="column-left">
          <div className="card">
            <div className="card-title">顧客ポートフォリオ</div>

            <div className="summary-row">
              <div className="summary-chip">
                <span className="label">顧客数</span>
                <span className="value">{summary.total}</span>
              </div>
              <div className="summary-chip">
                <span className="label">ハイリスク（score≧70）</span>
                <span className="value">{summary.highRisk}</span>
              </div>
              <div className="summary-chip">
                <span className="label">総債権残高</span>
                <span className="value">
                  {summary.totalExposure.toLocaleString('ja-JP')} 円
                </span>
              </div>
            </div>

            <CustomerList
              customers={customers}
              loading={loadingCustomers}
              error={customerError}
              selectedId={selectedCustomerId}
              onSelect={setSelectedCustomerId}
            />
          </div>
        </section>

        <section className="column-right">
          <div className="card">
            <InvoicePanel
              customerId={selectedCustomerId}
              customers={customers}
            />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
