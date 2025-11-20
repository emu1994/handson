import React, { useMemo, useState } from 'react'

function riskClass(score) {
  const v = Number(score ?? 0)
  if (v >= 70) return 'badge-risk badge-risk-high'
  if (v >= 50) return 'badge-risk badge-risk-mid'
  return 'badge-risk badge-risk-low'
}

export default function CustomerList({
  customers,
  loading,
  error,
  selectedId,
  onSelect
}) {
  const [filters, setFilters] = useState({
    keyword: '',
    segment: '',
    rating: ''
  })
  const [sortBalance, setSortBalance] = useState(null)

  const handleChange = (field) => (e) => {
    setFilters((prev) => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const toggleSortBalance = () => {
    setSortBalance((prev) => {
      if (prev === null) return 'DESC'
      if (prev === 'DESC') return 'ASC'
      return null
    })
  }

  const resetFilters = () => {
    setFilters({
      keyword: '',
      segment: '',
      rating: ''
    })
    setSortBalance(null)
  }

  const filtered = useMemo(() => {
    const kw = filters.keyword.trim().toLowerCase()
    const seg = filters.segment
    const rating = filters.rating

    return customers.filter((c) => {
      let ok = true
      if (kw) {
        const name = (c.name || '').toLowerCase()
        const code = (c.customerCode || '').toLowerCase()
        ok = ok && (name.includes(kw) || code.includes(kw))
      }
      if (seg) {
        ok = ok && c.segment === seg
      }
      if (rating) {
        ok = ok && c.rating === rating
      }
      return ok
    })
  }, [customers, filters])

  const visible = useMemo(() => {
    const arr = [...filtered]
    if (sortBalance === 'ASC') {
      arr.sort(
        (a, b) => Number(a.totalExposure) - Number(b.totalExposure)
      )
    } else if (sortBalance === 'DESC') {
      arr.sort(
        (a, b) => Number(b.totalExposure) - Number(a.totalExposure)
      )
    }
    return arr
  }, [filtered, sortBalance])

  return (
    <div>
      <div className="filters-row">
        <label>
          顧客名・コード
          <input
            type="text"
            value={filters.keyword}
            onChange={handleChange('keyword')}
            placeholder="例）東京精密 / CUST-1001"
          />
        </label>
        <label>
          セグメント
          <select
            value={filters.segment}
            onChange={handleChange('segment')}
          >
            <option value="">（すべて）</option>
            <option value="SME">SME</option>
            <option value="LARGE">LARGE</option>
            <option value="GLOBAL">GLOBAL</option>
          </select>
        </label>
        <label>
          格付
          <select
            value={filters.rating}
            onChange={handleChange('rating')}
          >
            <option value="">（すべて）</option>
            <option value="A">A</option>
            <option value="BBB">BBB</option>
            <option value="BB">BB</option>
            <option value="B">B</option>
            <option value="CCC">CCC</option>
          </select>
        </label>
        <button type="button" onClick={toggleSortBalance}>
          債権残高ソート
        </button>
        <button
          type="button"
          className="secondary"
          onClick={resetFilters}
        >
          条件クリア
        </button>
      </div>

      {loading && <div>読み込み中...</div>}
      {!loading && error && (
        <div style={{ color: '#fca5a5', fontSize: 12 }}>{error}</div>
      )}

      {!loading && !error && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>顧客名 / コード</th>
                <th>セグメント</th>
                <th>格付</th>
                <th>リスク</th>
                <th>債権残高</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => onSelect(c.id)}
                  style={{
                    backgroundColor:
                      c.id === selectedId
                        ? 'rgba(37,99,235,0.25)'
                        : 'transparent'
                  }}
                >
                  <td>{c.id}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{c.name}</div>
                    <div
                      style={{ fontSize: 11, color: '#9ca3af' }}
                    >
                      {c.customerCode}
                    </div>
                  </td>
                  <td>{c.segment}</td>
                  <td>
                    <span className="rating-pill">{c.rating}</span>
                  </td>
                  <td>
                    <span className={riskClass(c.riskScore)}>
                      {c.riskScore}
                    </span>
                  </td>
                  <td className="amount-cell">
                    {Number(c.totalExposure ?? 0).toLocaleString(
                      'ja-JP'
                    )}{' '}
                    円
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: 'center',
                      color: '#9ca3af'
                    }}
                  >
                    条件に一致する顧客がありません。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
