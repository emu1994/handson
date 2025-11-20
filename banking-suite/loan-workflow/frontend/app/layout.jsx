import './globals.css'

export const metadata = {
  title: 'Loan Workflow',
  description: '④ ローン申込・審査フロー管理'
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
