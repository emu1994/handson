import TransferForm from '../../../components/TransferForm.jsx'

export const metadata = {
  title: '振込予約作成'
}

export default function NewTransferPage() {
  return (
    <main className="p-6 space-y-4">
      <header>
        <p className="text-xs text-slate-400">Schedule a new transfer</p>
        <h1 className="text-xl font-semibold">新規振込予約</h1>
      </header>
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <TransferForm />
      </div>
    </main>
  )
}
