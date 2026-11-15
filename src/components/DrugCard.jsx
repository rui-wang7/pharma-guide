function ClinicalBadge({ label, value, color }) {
  if (!value) return null;
  return (
    <div className="clinical-badge" style={{ borderColor: color + '44', background: color + '11' }}>
      <span className="clinical-badge-label" style={{ color }}>{label}</span>
      <span className="clinical-badge-value">{value}</span>
    </div>
  );
}

const fmtUS = (v) => (v >= 1 ? `$${v.toFixed(1)}B` : `$${Math.round(v * 1000)}M`);
const fmtCN = (v) => `¥${v >= 10 ? Math.round(v) : v.toFixed(1)}亿`;

// Product-level annual sales (all indications). "≈" marks estimates not disclosed in filings.
function SalesRow({ s }) {
  const est = (k) => ((s.est || []).includes(k) ? '≈' : '');
  return (
    <div className="sales-row" title={s.src || ''}>
      <span className="sales-brand">{s.brand}</span>
      <span className="sales-chip sales-us">🇺🇸 {s.us != null ? `${est('us')}${fmtUS(s.us)}` : '未披露'}</span>
      <span className="sales-chip sales-cn">🇨🇳 {s.cn != null ? `${est('cn')}${fmtCN(s.cn)}` : '未披露'}</span>
      {s.global != null && <span className="sales-chip sales-gl">🌐 {est('global')}{fmtUS(s.global)}</span>}
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
        <div className="drug-badges">
          {drug.approved && <span className="drug-new-badge">🆕 {drug.approved}</span>}
          {drug.market_share && (
            <span className="drug-share">{drug.market_share}</span>
          )}
        </div>
      </div>

      <div className="drug-meta">
        {drug.manufacturer && (
          <span className="drug-meta-item">🏭 {drug.manufacturer}</span>
        )}
        <span className="drug-meta-item drug-cost">💰 {costLabel}</span>
      </div>

      {/* Annual product sales, US vs China */}
      {drug.sales && drug.sales.length > 0 && (
        <div className="sales-section">
          <div className="sales-title">💵 {drug.sales[0].year} 年销售额（产品全适应症合计）</div>
          {drug.sales.map((s) => <SalesRow key={s.brand} s={s} />)}
        </div>
      )}

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
      {drug.impact && (
        <div className="insight-row insight-impact"><span className="insight-tag">💡 格局点评</span>{drug.impact}</div>
      )}
    </div>
  );
}
