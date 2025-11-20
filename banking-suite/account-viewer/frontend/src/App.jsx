import React, { useEffect, useState } from 'react'
import AccountList from './components/AccountList.jsx'
import TransactionList from './components/TransactionList.jsx'

function App() {
  const [accounts, setAccounts] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  const [loadingAccounts, setLoadingAccounts] = useState(false)
  const [accountError, setAccountError] = useState('')

  const [transactions, setTransactions] = useState([])
  const [loadingTx, setLoadingTx] = useState(false)
  const [txError, setTxError] = useState('')

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoadingAccounts(true)
      setAccountError('')
      try {
        const res = await fetch('http://localhost:8080/api/accounts')
        if (!res.ok) throw new Error('HTTP ' + res.status)
        const data = await res.json()
        setAccounts(data)
        if (data.length > 0 && selectedId == null) {
          setSelectedId(data[0].id)
        }
      } catch (e) {
        console.error(e)
        setAccountError('口座一覧の取得に失敗しました')
      } finally {
        setLoadingAccounts(false)
      }
    }
    fetchAccounts()
  }, [selectedId])

  useEffect(() => {
    const fetchTx = async () => {
      if (!selectedId) {
        setTransactions([])
        return
      }
      setLoadingTx(true)
      setTxError('')
      try {
        const res = await fetch(
          `http://localhost:8080/api/accounts/${selectedId}/transactions`
        )
        if (!res.ok) throw new Error('HTTP ' + res.status)
        const data = await res.json()
        setTransactions(data)
      } catch (e) {
        console.error(e)
        setTxError('入出金明細の取得に失敗しました')
      } finally {
        setLoadingTx(false)
      }
    }
    fetchTx()
  }, [selectedId])

  const selectedAccount =
    accounts.find((a) => a.id === selectedId) ?? null

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <header className="border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold text-slate-50">
            Bank Account Viewer
          </h1>
          <p className="text-[11px] text-slate-400">
            Spring Boot + PostgreSQL + React + Tailwind
          </p>
        </div>
        <div className="text-[11px] text-slate-400">
          ① 個人向け口座残高・入出金ビューア
        </div>
      </header>

      <main className="flex-1 px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          <AccountList
            accounts={accounts}
            selectedAccountId={selectedId}
            onSelect={setSelectedId}
            loading={loadingAccounts}
            error={accountError}
          />
          <TransactionList
            account={selectedAccount}
            transactions={transactions}
            loading={loadingTx}
            error={txError}
          />
        </div>
      </main>
    </div>
  )
}

export default App
