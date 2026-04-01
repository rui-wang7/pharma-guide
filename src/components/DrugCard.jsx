function ClinicalBadge({ label, value, color }) {
  if (!value) return null;
  return (
    <div className="clinical-badge" style={{ borderColor: color + '44', background: color + '11' }}>
      <span className="clinical-badge-label" style={{ color }}>{label}</span>
      <span className="clinical-badge-value">{value}</span>
    </div>
  );
}

export default function DrugCard({ drug, currency, focused, dimmed }) {
  const costLabel = currency === 'CN'
    ? (drug.annual_cost_rmb != null ? `¥${drug.annual_cost_rmb.toLocaleString()}/年` : '—')
    : (drug.annual_cost_usd != null ? `$${drug.annual_cost_usd.toLocaleString()}/yr` : '—');

  const cd = drug.clinical_data;

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

      {/* Clinical Endpoints */}
      {cd && (
        <div className="clinical-section">
          {cd.trial && (
            <div className="clinical-trial-label">📋 {cd.trial}</div>
          )}
          <div className="clinical-grid">
            <ClinicalBadge label="OS" value={cd.os} color="#6366f1" />
            <ClinicalBadge label="OS HR" value={cd.os_hr} color="#6366f1" />
            <ClinicalBadge label="PFS" value={cd.pfs} color="#10b981" />
            <ClinicalBadge label="PFS HR" value={cd.pfs_hr} color="#10b981" />
            <ClinicalBadge label="ORR" value={cd.orr} color="#f59e0b" />
          </div>
        </div>
      )}

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
