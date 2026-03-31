import { useState } from 'react';
import { findSubtype } from '../data/index.js';
import MarketStats from './MarketStats.jsx';
import TreatmentGuideline from './TreatmentGuideline.jsx';

export default function DiseaseView({ selected, zoom }) {
  const [currency, setCurrency] = useState('CN');

  if (!selected) {
    return (
      <div className="empty-state">
        <div className="empty-icon">💊</div>
        <h2>选择左侧疾病开始浏览</h2>
        <p>Select a disease from the sidebar</p>
      </div>
    );
  }

  const subtype = findSubtype(selected.categoryId, selected.diseaseId, selected.subtypeId);
  if (!subtype) return <div className="empty-state">未找到数据</div>;

  const regionData = currency === 'CN' ? subtype.china : subtype.us;

  return (
    <main className="disease-view" style={{ fontSize: `${zoom}%` }}>
      {/* Header */}
      <div className="dv-header">
        <div className="dv-titles">
          <h1 className="dv-title-cn">{subtype.name_cn}</h1>
          <h2 className="dv-title-en">{subtype.name_en}</h2>
        </div>

        {/* Country Toggle */}
        <div className="country-toggle">
          <button
            className={`toggle-btn ${currency === 'CN' ? 'active' : ''}`}
            onClick={() => setCurrency('CN')}
          >
            🇨🇳 中国
          </button>
          <button
            className={`toggle-btn ${currency === 'US' ? 'active' : ''}`}
            onClick={() => setCurrency('US')}
          >
            🇺🇸 美国
          </button>
        </div>
      </div>

      {/* Market Stats */}
      {regionData && <MarketStats data={regionData} currency={currency} />}

      {/* Treatment Guideline */}
      <TreatmentGuideline subtype={subtype} currency={currency} />
    </main>
  );
}
