import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center gap-3">
      <p className="text-xs text-slate-400">Spring Boot + Next.js + Tailwind</p>
      <h1 className="text-2xl font-semibold">③ 振込予約管理システム</h1>
      <Link
        href="/transfers"
        className="px-5 py-2 rounded-full bg-sky-600 text-white text-sm hover:bg-sky-500"
      >
        振込予約一覧へ
      </Link>
    </main>
  )
}
