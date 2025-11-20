import './globals.css'

export const metadata = {
  title: 'Transfer Scheduler',
  description: '③ 振込予約管理システム'
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
