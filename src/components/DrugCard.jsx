export default function DrugCard({ drug, currency, focused, dimmed }) {
  const costLabel = currency === 'CN'
    ? (drug.annual_cost_rmb != null ? `¥${drug.annual_cost_rmb.toLocaleString()}/年` : '—')
    : (drug.annual_cost_usd != null ? `$${drug.annual_cost_usd.toLocaleString()}/yr` : '—');

  return (
    <div className={`drug-card ${focused ? 'focused' : ''} ${dimmed ? 'dimmed' : ''}`}>
      <div className="drug-header">
        <div className="drug-name">
          <span className="drug-name-cn">{drug.name_cn}</span>
          {drug.name_en && drug.name_en !== drug.name_cn && (
            <span className="drug-name-en">{drug.name_en}</span>
          )}
        </div>
        {drug.market_share && (
          <span className="drug-share">{drug.market_share}</span>
        )}
      </div>

      <div className="drug-meta">
        {drug.manufacturer && (
          <span className="drug-meta-item">🏭 {drug.manufacturer}</span>
        )}
        <span className="drug-meta-item drug-cost">💰 {costLabel}</span>
      </div>

      {drug.selling_points && drug.selling_points.length > 0 && (
        <ul className="drug-points">
          {drug.selling_points.map((pt, i) => (
            <li key={i}>{pt}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
