const STAGE_COLOR = {
  'Phase 1': '#f59e0b',
  'Phase 1/2': '#f59e0b',
  'Phase 2': '#f97316',
  'Phase 2/3': '#ea580c',
  'Phase 3': '#dc2626',
  '已上市': '#16a34a',
  '已申报NDA': '#7c3aed',
  'FDA拒绝': '#6b7280',
};

function stageColor(stage) {
  for (const [key, val] of Object.entries(STAGE_COLOR)) {
    if (stage && stage.includes(key)) return val;
  }
  return '#9ca3af';
}

function ClinicalBadge({ label, value, color }) {
  if (!value) return null;
  return (
    <div className="clinical-badge" style={{ borderColor: color + '44', background: color + '11' }}>
      <span className="clinical-badge-label" style={{ color }}>{label}</span>
      <span className="clinical-badge-value">{value}</span>
    </div>
  );
}

export default function PipelineCard({ drug, focused, dimmed }) {
  const color = stageColor(drug.stage);
  const cd = drug.clinical_data;

  return (
    <div className={`pipeline-card ${focused ? 'focused' : ''} ${dimmed ? 'dimmed' : ''}`}>
      <div className="pipeline-indicator" style={{ background: color }} />
      <div className="pipeline-body">
        <div className="pipeline-header">
          <div className="pipeline-name">
            <span className="pipeline-name-cn">{drug.name_cn}</span>
            {drug.name_en && drug.name_en !== drug.name_cn && (
              <span className="pipeline-name-en">{drug.name_en}</span>
            )}
          </div>
          <span className="pipeline-stage" style={{ background: color + '22', color }}>
            {drug.stage}
          </span>
        </div>

        <div className="pipeline-meta">
          {drug.company && <span className="pipeline-company">🏢 {drug.company}</span>}
          {drug.trial && <span className="pipeline-trial">📋 {drug.trial}</span>}
        </div>

        {drug.status && (
          <p className="pipeline-status">{drug.status}</p>
        )}

        {/* Clinical trial data */}
        {cd && (
          <div className="clinical-section pipeline-clinical">
            {cd.trial && (
              <div className="clinical-trial-label">🔬 {cd.trial}</div>
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
      </div>
    </div>
  );
}
