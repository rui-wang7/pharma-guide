export default function MarketStats({ data, currency }) {
  if (!data) return null;

  const isCN = currency === 'CN';
  const cases = data.annual_new_cases;
  const tam = isCN ? data.tam_rmb_bn : data.tam_usd_bn;
  const tamLabel = isCN ? `¥${tam}亿` : `$${tam}B`;
  const flagLabel = isCN ? '🇨🇳 中国' : '🇺🇸 美国';

  return (
    <div className="market-stats">
      <div className="market-stat-card">
        <div className="stat-icon">🏥</div>
        <div className="stat-body">
          <div className="stat-value">{cases?.toLocaleString()}</div>
          <div className="stat-label">{flagLabel} 每年新增确诊</div>
          {data.annual_new_cases_note && (
            <div className="stat-note">{data.annual_new_cases_note}</div>
          )}
        </div>
      </div>

      <div className="market-stat-card">
        <div className="stat-icon">💊</div>
        <div className="stat-body">
          <div className="stat-value">{tamLabel}</div>
          <div className="stat-label">{flagLabel} 医药市场 TAM</div>
        </div>
      </div>
    </div>
  );
}
