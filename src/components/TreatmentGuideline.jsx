import { useState } from 'react';
import DrugCard from './DrugCard.jsx';
import PipelineCard from './PipelineCard.jsx';

const LINE_META = {
  early:  { label: '早期/辅助', label_en: 'Early/Adjuvant', color: '#0ea5e9', icon: '🔬' },
  1:      { label: '一线治疗', label_en: '1st Line', color: '#10b981', icon: '1️⃣' },
  2:      { label: '二线治疗', label_en: '2nd Line', color: '#f59e0b', icon: '2️⃣' },
  3:      { label: '三线+', label_en: '3rd Line+', color: '#ef4444', icon: '3️⃣' },
};

export default function TreatmentGuideline({ subtype, currency }) {
  const [focusedCard, setFocusedCard] = useState(null); // 'drug-lineIdx-drugIdx' or 'pipe-lineIdx-pipeIdx'

  const regionData = currency === 'CN' ? subtype.china : subtype.us;
  if (!regionData) return <div className="no-data">暂无该地区数据</div>;

  const { diagnosis_steps, treatment_lines } = regionData;

  return (
    <div className="guideline">
      {/* Diagnosis Steps */}
      {diagnosis_steps && diagnosis_steps.length > 0 && (
        <section className="diag-section">
          <h3 className="section-title">
            <span className="section-icon">🔍</span> 诊断步骤 Diagnosis
          </h3>
          <ol className="diag-steps">
            {diagnosis_steps.map((step, i) => (
              <li key={i} className="diag-step">
                <span className="diag-num">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Treatment Lines */}
      {treatment_lines && treatment_lines.map((line, lineIdx) => {
        const meta = LINE_META[line.line] || { label: `${line.line}线`, label_en: '', color: '#6b7280', icon: '💊' };

        return (
          <section key={lineIdx} className="line-section">
            <div className="line-header" style={{ borderLeftColor: meta.color }}>
              <span className="line-icon">{meta.icon}</span>
              <div>
                <span className="line-label" style={{ color: meta.color }}>{line.label_cn || meta.label}</span>
                <span className="line-label-en">{line.label_en || meta.label_en}</span>
              </div>
            </div>

            {/* Approved drugs */}
            {line.options && line.options.length > 0 && (
              <div className="cards-section">
                <div className="cards-subtitle">✅ 已获批药物 / 治疗选项</div>
                <div className="cards-grid">
                  {line.options.map((opt, optIdx) => {
                    const key = `drug-${lineIdx}-${optIdx}`;
                    if (opt.type === 'surgery') {
                      return (
                        <div
                          key={optIdx}
                          className={`surgery-card ${focusedCard && focusedCard !== key ? 'dimmed' : ''} ${focusedCard === key ? 'focused' : ''}`}
                          onMouseEnter={() => setFocusedCard(key)}
                          onMouseLeave={() => setFocusedCard(null)}
                        >
                          <span className="surgery-icon">🔪</span>
                          <div>
                            <div className="surgery-name">{opt.name_cn || '手术治疗'}</div>
                            {opt.description && <div className="surgery-desc">{opt.description}</div>}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div
                        key={optIdx}
                        onMouseEnter={() => setFocusedCard(key)}
                        onMouseLeave={() => setFocusedCard(null)}
                      >
                        <DrugCard
                          drug={opt}
                          currency={currency}
                          focused={focusedCard === key}
                          dimmed={focusedCard !== null && focusedCard !== key}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pipeline drugs */}
            {line.pipeline && line.pipeline.length > 0 && (
              <div className="cards-section pipeline-section">
                <div className="cards-subtitle pipeline-subtitle">🔬 在研管线 Pipeline (未获批)</div>
                <div className="cards-grid">
                  {line.pipeline.map((pipe, pipeIdx) => {
                    const key = `pipe-${lineIdx}-${pipeIdx}`;
                    return (
                      <div
                        key={pipeIdx}
                        onMouseEnter={() => setFocusedCard(key)}
                        onMouseLeave={() => setFocusedCard(null)}
                      >
                        <PipelineCard
                          drug={pipe}
                          focused={focusedCard === key}
                          dimmed={focusedCard !== null && focusedCard !== key}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
