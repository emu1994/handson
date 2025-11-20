import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-3">
      <p className="text-xs text-slate-400">Spring Boot + Next.js + Tailwind</p>
      <h1 className="text-2xl font-semibold">④ ローン申込・審査フロー</h1>
      <Link
        href="/loans"
        className="px-5 py-2 rounded-full bg-indigo-600 text-white text-sm hover:bg-indigo-500"
      >
        申込一覧へ
      </Link>
    </main>
  )
}
