import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell,
} from 'recharts';
import { getDashboardData } from '../data/index.js';

const CATEGORY_COLORS = {
  oncology:       '#ef4444',
  immune:         '#8b5cf6',
  metabolic:      '#f59e0b',
  cardiovascular: '#3b82f6',
  neuro:          '#10b981',
};

const MARKET_COLORS = { cn: '#ef4444', us: '#3b82f6', eu: '#10b981' };

const FMT_B  = (v) => v == null || v === 0 ? '—' : `$${v.toFixed(1)}B`;
const FMT_K  = (v) => v == null || v === 0 ? '—' : `$${Math.round(v).toLocaleString()}K`;
const FMT_N  = (v) => v == null || v === 0 ? '—' : v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}K` : v.toLocaleString();
const spp    = (tam, cases) => (tam && cases) ? Math.round((tam * 1e9) / cases / 1000) : null;
const sumF   = (rows, k) => { const v = rows.reduce((a, r) => a + (r[k] || 0), 0); return v || null; };

const METRICS = [
  { key: 'tam',        label: 'Drug Sales TAM ($B)', cnKey: 'cn_tam_usd',    usKey: 'us_tam_usd',    euKey: 'eu_tam_usd'    },
  { key: 'new_cases',  label: '年新增确诊',           cnKey: 'cn_new_cases',  usKey: 'us_new_cases',  euKey: 'eu_new_cases'  },
  { key: 'prevalence', label: '患病人数',             cnKey: 'cn_prevalence', usKey: 'us_prevalence', euKey: 'eu_prevalence' },
  { key: 'spp',        label: 'Sales/Patient ($K)',   cnKey: 'cn_spp',        usKey: 'us_spp',        euKey: 'eu_spp'        },
];

// ── Aggregation helper ──────────────────────────────────────────────────────
function aggregate(rows, overrides = {}) {
  const cn_tam = sumF(rows, 'cn_tam_usd');
  const us_tam = sumF(rows, 'us_tam_usd');
  const eu_tam = sumF(rows, 'eu_tam_usd');
  const cn_cases = sumF(rows, 'cn_new_cases');
  const us_cases = sumF(rows, 'us_new_cases');
  const eu_cases = sumF(rows, 'eu_new_cases');
  return {
    cn_new_cases:  cn_cases,
    us_new_cases:  us_cases,
    eu_new_cases:  eu_cases,
    cn_prevalence: sumF(rows, 'cn_prevalence'),
    us_prevalence: sumF(rows, 'us_prevalence'),
    eu_prevalence: sumF(rows, 'eu_prevalence'),
    cn_tam_usd: cn_tam,
    us_tam_usd: us_tam,
    eu_tam_usd: eu_tam,
    total_tam_usd: (cn_tam || 0) + (us_tam || 0) + (eu_tam || 0),
    cn_spp: spp(cn_tam, cn_cases),
    us_spp: spp(us_tam, us_cases),
    eu_spp: spp(eu_tam, eu_cases),
    ...overrides,
  };
}

// ── Custom Tooltips ─────────────────────────────────────────────────────────
function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="db-tooltip">
      <div className="db-tooltip-title">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="db-tooltip-row" style={{ color: p.color }}>
          <span>{p.name}:</span>
          <span className="db-tooltip-val">{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}</span>
        </div>
      ))}
    </div>
  );
}

function BubbleTooltip({ active, payload }) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="db-tooltip">
      <div className="db-tooltip-title">{d.name_cn}</div>
      <div className="db-tooltip-row"><span>TAM ($B):</span><span className="db-tooltip-val">{d.x?.toFixed(2)}</span></div>
      <div className="db-tooltip-row"><span>New Cases:</span><span className="db-tooltip-val">{FMT_N(d.y)}</span></div>
      <div className="db-tooltip-row"><span>Sales/Patient:</span><span className="db-tooltip-val">${d.z?.toLocaleString()}K</span></div>
      <div className="db-tooltip-row" style={{ color: '#94a3b8', fontSize: 11 }}><span>{d.market?.toUpperCase()}</span></div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const allData = useMemo(() => getDashboardData(), []);

  const [selectedMetric, setSelectedMetric]       = useState('tam');
  const [selectedMarkets, setSelectedMarkets]     = useState({ cn: true, us: true, eu: true });
  const [selectedCategories, setSelectedCategories] = useState(
    Object.fromEntries(['oncology', 'immune', 'metabolic', 'cardiovascular', 'neuro'].map((c) => [c, true]))
  );
  const [selectedIds, setSelectedIds] = useState(() => new Set(allData.slice(0, 15).map((d) => d.id)));
  const [chartType, setChartType]     = useState('bar');
  const [groupBy, setGroupBy]         = useState('subtype'); // 'subtype' | 'disease' | 'category'
  const [sortCol, setSortCol]         = useState('total_tam_usd');
  const [sortDir, setSortDir]         = useState('desc');
  const [tableSearch, setTableSearch] = useState('');

  const metric = METRICS.find((m) => m.key === selectedMetric);

  // ── Base filtered data (always subtype level) ──
  const filteredSubtypes = useMemo(() => {
    return allData.filter((d) => {
      if (!selectedCategories[d.categoryId]) return false;
      if (tableSearch) {
        const q = tableSearch.toLowerCase();
        return (
          d.name_cn.toLowerCase().includes(q) ||
          (d.name_en || '').toLowerCase().includes(q) ||
          d.diseaseName_cn.toLowerCase().includes(q) ||
          d.categoryName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allData, selectedCategories, tableSearch]);

  // ── Disease-level aggregation ──
  const diseaseRows = useMemo(() => {
    const map = new Map();
    for (const d of filteredSubtypes) {
      if (!map.has(d.diseaseId)) {
        map.set(d.diseaseId, { id: d.diseaseId, name_cn: d.diseaseName_cn, name_en: '', categoryId: d.categoryId, categoryName: d.categoryName, categoryIcon: d.categoryIcon, _rows: [] });
      }
      map.get(d.diseaseId)._rows.push(d);
    }
    return [...map.values()].map((g) => ({ ...g, ...aggregate(g._rows) }));
  }, [filteredSubtypes]);

  // ── Category-level aggregation ──
  const categoryRows = useMemo(() => {
    const map = new Map();
    for (const d of filteredSubtypes) {
      if (!map.has(d.categoryId)) {
        map.set(d.categoryId, { id: d.categoryId, name_cn: d.categoryName, name_en: '', categoryId: d.categoryId, categoryName: d.categoryName, categoryIcon: d.categoryIcon, _rows: [] });
      }
      map.get(d.categoryId)._rows.push(d);
    }
    return [...map.values()].map((g) => ({ ...g, ...aggregate(g._rows) }));
  }, [filteredSubtypes]);

  // ── Grand total ──
  const grandTotal = useMemo(() => ({
    id: '__total__',
    name_cn: '全部合计',
    name_en: 'Grand Total',
    ...aggregate(filteredSubtypes),
  }), [filteredSubtypes]);

  // ── Sort helper ──
  const sorted = (rows) => [...rows].sort((a, b) => {
    const av = a[sortCol] ?? -Infinity;
    const bv = b[sortCol] ?? -Infinity;
    return sortDir === 'asc' ? av - bv : bv - av;
  });

  // ── Table rows by groupBy mode ──
  const tableRows = useMemo(() => {
    if (groupBy === 'subtype')  return sorted(filteredSubtypes);
    if (groupBy === 'disease')  return sorted(diseaseRows);
    return sorted(categoryRows);
  }, [groupBy, filteredSubtypes, diseaseRows, categoryRows, sortCol, sortDir]);

  // ── Chart data ──
  const chartData = useMemo(() => {
    const source =
      groupBy === 'subtype'  ? tableRows.filter((d) => selectedIds.has(d.id)) :
      groupBy === 'disease'  ? tableRows :
                               tableRows;
    return source.map((d) => ({
      ...d,
      shortName: d.name_cn.length > 12 ? d.name_cn.slice(0, 11) + '…' : d.name_cn,
      cn: d[metric.cnKey],
      us: d[metric.usKey],
      eu: d[metric.euKey],
    }));
  }, [tableRows, selectedIds, metric, groupBy]);

  // ── Bubble data ──
  const bubbleData = useMemo(() => {
    const pts = [];
    chartData.forEach((d) => {
      [
        { market: 'cn', tam: d.cn_tam_usd, cases: d.cn_new_cases, sppV: d.cn_spp },
        { market: 'us', tam: d.us_tam_usd, cases: d.us_new_cases, sppV: d.us_spp },
        { market: 'eu', tam: d.eu_tam_usd, cases: d.eu_new_cases, sppV: d.eu_spp },
      ].forEach(({ market, tam, cases, sppV }) => {
        if (!selectedMarkets[market] || !tam || !cases) return;
        pts.push({ ...d, x: tam, y: cases, z: sppV || 1, market, color: MARKET_COLORS[market] });
      });
    });
    return pts;
  }, [chartData, selectedMarkets]);

  const toggleId = (id) => setSelectedIds((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const toggleAll = () => {
    if (selectedIds.size === filteredSubtypes.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredSubtypes.map((d) => d.id)));
  };

  const handleSort = (col) => {
    if (sortCol === col) setSortDir((d) => d === 'desc' ? 'asc' : 'desc');
    else { setSortCol(col); setSortDir('desc'); }
  };
  const SortIcon = ({ col }) => sortCol === col ? (sortDir === 'desc' ? ' ↓' : ' ↑') : ' ↕';

  // ── Subtypes grouped under each disease (for subtype mode indented display) ──
  // Build disease subtotals to show inline when groupBy=subtype
  const diseaseSubtotalMap = useMemo(() => {
    if (groupBy !== 'subtype') return new Map();
    const map = new Map();
    for (const d of filteredSubtypes) {
      if (!map.has(d.diseaseId)) map.set(d.diseaseId, { name_cn: d.diseaseName_cn, categoryId: d.categoryId, categoryIcon: d.categoryIcon, _rows: [] });
      map.get(d.diseaseId)._rows.push(d);
    }
    map.forEach((v, k) => { map.set(k, { ...v, ...aggregate(v._rows) }); });
    return map;
  }, [filteredSubtypes, groupBy]);

  // Build flat table with disease subtotal rows inserted
  const tableWithSubtotals = useMemo(() => {
    if (groupBy !== 'subtype') return tableRows;
    // Group subtypes by disease, preserving sort order of first subtype in each disease
    const diseaseOrder = [];
    const diseaseGroups = new Map();
    for (const row of tableRows) {
      if (!diseaseGroups.has(row.diseaseId)) {
        diseaseOrder.push(row.diseaseId);
        diseaseGroups.set(row.diseaseId, []);
      }
      diseaseGroups.get(row.diseaseId).push(row);
    }
    const flat = [];
    for (const did of diseaseOrder) {
      const rows = diseaseGroups.get(did);
      const sub = diseaseSubtotalMap.get(did);
      if (rows.length > 1 && sub) {
        // Insert disease subtotal row first, then indented subtypes
        flat.push({ ...sub, id: `__dis__${did}`, _type: 'disease_sub', _children: rows.length });
        rows.forEach((r) => flat.push({ ...r, _type: 'subtype', _indent: true }));
      } else {
        rows.forEach((r) => flat.push({ ...r, _type: 'subtype' }));
      }
    }
    // Category subtotals
    const catOrder = [];
    const catGroups = new Map();
    for (const row of flat) {
      const cid = row.categoryId;
      if (!catGroups.has(cid)) { catOrder.push(cid); catGroups.set(cid, []); }
      catGroups.get(cid).push(row);
    }
    const withCat = [];
    for (const cid of catOrder) {
      const crows = catGroups.get(cid);
      const catData = categoryRows.find((c) => c.id === cid);
      if (catData && catOrder.length > 1) {
        withCat.push({ ...catData, id: `__cat__${cid}`, _type: 'cat_sub' });
      }
      crows.forEach((r) => withCat.push(r));
    }
    return withCat;
  }, [groupBy, tableRows, diseaseSubtotalMap, categoryRows]);

  const showCheckbox = groupBy === 'subtype';

  return (
    <div className="dashboard">
      {/* ── HEADER ── */}
      <div className="db-header">
        <h1 className="db-title">市场总览 Market Dashboard</h1>
        <p className="db-subtitle">按子病种 / 疾病 / 大类汇总 · CN / US / EU 三市场对比</p>
      </div>

      {/* ── CONTROL BAR ── */}
      <div className="db-controls">
        <div className="db-control-group">
          <span className="db-control-label">分组 Group By</span>
          <div className="db-pills">
            {[['subtype','🔬 子病种'],['disease','🦠 疾病'],['category','📂 大类']].map(([k,l]) => (
              <button key={k} className={`db-pill ${groupBy === k ? 'active' : ''}`} onClick={() => setGroupBy(k)}>{l}</button>
            ))}
          </div>
        </div>

        <div className="db-control-group">
          <span className="db-control-label">指标 Metric</span>
          <div className="db-pills">
            {METRICS.map((m) => (
              <button key={m.key} className={`db-pill ${selectedMetric === m.key ? 'active' : ''}`}
                onClick={() => setSelectedMetric(m.key)}>{m.label}</button>
            ))}
          </div>
        </div>

        <div className="db-control-group">
          <span className="db-control-label">市场 Market</span>
          <div className="db-pills">
            {[['cn','🇨🇳 中国'],['us','🇺🇸 美国'],['eu','🇪🇺 欧洲']].map(([k,l]) => (
              <button key={k} className={`db-pill ${selectedMarkets[k] ? 'active' : ''}`}
                style={selectedMarkets[k] ? { background: MARKET_COLORS[k]+'22', borderColor: MARKET_COLORS[k], color: MARKET_COLORS[k] } : {}}
                onClick={() => setSelectedMarkets((p) => ({ ...p, [k]: !p[k] }))}>{l}</button>
            ))}
          </div>
        </div>

        <div className="db-control-group">
          <span className="db-control-label">疾病类别</span>
          <div className="db-pills">
            {[['oncology','🎗️ 肿瘤'],['immune','🛡️ 免疫'],['metabolic','⚗️ 代谢'],['cardiovascular','❤️ 心血管'],['neuro','🧠 神经']].map(([k,l]) => (
              <button key={k} className={`db-pill ${selectedCategories[k] ? 'active' : ''}`}
                style={selectedCategories[k] ? { background: CATEGORY_COLORS[k]+'22', borderColor: CATEGORY_COLORS[k], color: CATEGORY_COLORS[k] } : {}}
                onClick={() => setSelectedCategories((p) => ({ ...p, [k]: !p[k] }))}>{l}</button>
            ))}
          </div>
        </div>

        <div className="db-control-group">
          <span className="db-control-label">图表类型</span>
          <div className="db-pills">
            <button className={`db-pill ${chartType === 'bar' ? 'active' : ''}`} onClick={() => setChartType('bar')}>📊 柱状图</button>
            <button className={`db-pill ${chartType === 'bubble' ? 'active' : ''}`} onClick={() => setChartType('bubble')}>🫧 气泡图</button>
          </div>
        </div>
      </div>

      {/* ── CHART ── */}
      <div className="db-chart-card">
        {chartType === 'bar' && (
          <>
            <div className="db-chart-title">{metric.label} — {chartData.length} 项已入图
              {groupBy === 'subtype' && <span className="db-chart-hint">（子病种模式：勾选下方表格行加入图表）</span>}
            </div>
            {chartData.length === 0
              ? <div className="db-empty">请在下方表格勾选病种</div>
              : <ResponsiveContainer width="100%" height={360}>
                  <BarChart data={chartData} margin={{ top: 8, right: 24, left: 8, bottom: 90 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="shortName" angle={-40} textAnchor="end" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip content={<BarTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    {selectedMarkets.cn && <Bar dataKey="cn" name="🇨🇳 中国" fill={MARKET_COLORS.cn} radius={[3,3,0,0]} maxBarSize={28} />}
                    {selectedMarkets.us && <Bar dataKey="us" name="🇺🇸 美国" fill={MARKET_COLORS.us} radius={[3,3,0,0]} maxBarSize={28} />}
                    {selectedMarkets.eu && <Bar dataKey="eu" name="🇪🇺 欧洲" fill={MARKET_COLORS.eu} radius={[3,3,0,0]} maxBarSize={28} />}
                  </BarChart>
                </ResponsiveContainer>
            }
          </>
        )}

        {chartType === 'bubble' && (
          <>
            <div className="db-chart-title">气泡图：X = TAM ($B) · Y = 年新增确诊 · 气泡大小 = Sales/Patient</div>
            {bubbleData.length === 0
              ? <div className="db-empty">请勾选病种并确保选中至少一个市场</div>
              : <ResponsiveContainer width="100%" height={420}>
                  <ScatterChart margin={{ top: 16, right: 32, left: 8, bottom: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" dataKey="x" name="TAM" unit="B" tick={{ fontSize: 11 }} label={{ value: 'TAM ($B)', position: 'insideBottom', offset: -4, fontSize: 11 }} />
                    <YAxis type="number" dataKey="y" name="New Cases" tick={{ fontSize: 11 }}
                      tickFormatter={(v) => v >= 1e6 ? `${(v/1e6).toFixed(0)}M` : v >= 1e3 ? `${(v/1e3).toFixed(0)}K` : v}
                      label={{ value: '年新增确诊', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11 }} />
                    <ZAxis type="number" dataKey="z" range={[80, 1800]} />
                    <Tooltip content={<BubbleTooltip />} />
                    <Scatter data={bubbleData}>
                      {bubbleData.map((e, i) => <Cell key={i} fill={e.color} fillOpacity={0.72} stroke={e.color} strokeWidth={1} />)}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
            }
            <div className="db-bubble-legend">
              {[['cn','🇨🇳 中国'],['us','🇺🇸 美国'],['eu','🇪🇺 欧洲']].map(([k,l]) => (
                <span key={k} className="db-bubble-legend-item">
                  <span className="db-bubble-legend-dot" style={{ background: MARKET_COLORS[k] }} />{l}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── DATA TABLE ── */}
      <div className="db-table-card">
        <div className="db-table-header">
          <div>
            <div className="db-table-title">数据表</div>
            <div className="db-table-subtitle">
              {groupBy === 'subtype' && '子病种视图：勾选加入图表；疾病小计自动展示'}
              {groupBy === 'disease' && '疾病汇总视图：各子病种数据加总'}
              {groupBy === 'category' && '大类汇总视图：各疾病数据加总'}
            </div>
          </div>
          <div className="db-table-controls">
            <input className="db-search" type="text" placeholder="搜索..." value={tableSearch} onChange={(e) => setTableSearch(e.target.value)} />
            {showCheckbox && (
              <button className="db-btn-sm" onClick={toggleAll}>
                {selectedIds.size === filteredSubtypes.length ? '取消全选' : `全选 (${filteredSubtypes.length})`}
              </button>
            )}
          </div>
        </div>

        <div className="db-table-wrapper">
          <table className="db-table">
            <thead>
              <tr>
                {showCheckbox && <th className="db-th-check">图表</th>}
                <th className="db-th-name db-th sortable" onClick={() => handleSort('name_cn')}>病种 / 疾病 / 大类<SortIcon col="name_cn" /></th>
                {groupBy === 'subtype' && <th className="db-th-cat">类别</th>}
                <th className="db-th sortable cn" onClick={() => handleSort('cn_new_cases')}>🇨🇳 新发<SortIcon col="cn_new_cases" /></th>
                <th className="db-th sortable cn" onClick={() => handleSort('cn_prevalence')}>🇨🇳 患者数<SortIcon col="cn_prevalence" /></th>
                <th className="db-th sortable cn" onClick={() => handleSort('cn_tam_usd')}>🇨🇳 TAM<SortIcon col="cn_tam_usd" /></th>
                <th className="db-th sortable cn" onClick={() => handleSort('cn_spp')}>🇨🇳 $/患者<SortIcon col="cn_spp" /></th>
                <th className="db-th sortable us" onClick={() => handleSort('us_new_cases')}>🇺🇸 新发<SortIcon col="us_new_cases" /></th>
                <th className="db-th sortable us" onClick={() => handleSort('us_prevalence')}>🇺🇸 患者数<SortIcon col="us_prevalence" /></th>
                <th className="db-th sortable us" onClick={() => handleSort('us_tam_usd')}>🇺🇸 TAM<SortIcon col="us_tam_usd" /></th>
                <th className="db-th sortable us" onClick={() => handleSort('us_spp')}>🇺🇸 $/患者<SortIcon col="us_spp" /></th>
                <th className="db-th sortable eu" onClick={() => handleSort('eu_new_cases')}>🇪🇺 新发<SortIcon col="eu_new_cases" /></th>
                <th className="db-th sortable eu" onClick={() => handleSort('eu_tam_usd')}>🇪🇺 TAM<SortIcon col="eu_tam_usd" /></th>
                <th className="db-th sortable eu" onClick={() => handleSort('eu_spp')}>🇪🇺 $/患者<SortIcon col="eu_spp" /></th>
                <th className="db-th sortable total" onClick={() => handleSort('total_tam_usd')}>总TAM<SortIcon col="total_tam_usd" /></th>
                <th className="db-th sortable" onClick={() => handleSort('cn_implied_survival')}>🇨🇳 隐含存活<SortIcon col="cn_implied_survival" /></th>
                <th className="db-th sortable" onClick={() => handleSort('us_implied_survival')}>🇺🇸 隐含存活<SortIcon col="us_implied_survival" /></th>
              </tr>
            </thead>
            <tbody>
              {tableWithSubtotals.map((row) => {
                const isCatSub  = row._type === 'cat_sub';
                const isDisSub  = row._type === 'disease_sub';
                const isIndent  = row._type === 'subtype' && row._indent;
                const checked   = showCheckbox && selectedIds.has(row.id);
                const clickable = showCheckbox && row._type === 'subtype';

                const rowClass = [
                  'db-row',
                  isCatSub  ? 'db-row-cat'  : '',
                  isDisSub  ? 'db-row-dis'  : '',
                  isIndent  ? 'db-row-indent': '',
                  checked   ? 'selected'     : '',
                ].filter(Boolean).join(' ');

                return (
                  <tr key={row.id} className={rowClass} onClick={clickable ? () => toggleId(row.id) : undefined}
                    style={clickable ? { cursor: 'pointer' } : undefined}>
                    {showCheckbox && (
                      <td className="db-td-check">
                        {row._type === 'subtype' && (
                          <input type="checkbox" checked={checked} onChange={() => toggleId(row.id)} onClick={(e) => e.stopPropagation()} />
                        )}
                      </td>
                    )}
                    <td className="db-td-name">
                      <div className={isCatSub ? 'db-row-cat-name' : isDisSub ? 'db-row-dis-name' : 'db-row-name'}>
                        {isCatSub && <span className="db-row-cat-icon">{row.categoryIcon}</span>}
                        {row.name_cn}
                        {isDisSub && <span className="db-row-sub-count">{row._children}个子类</span>}
                      </div>
                      {row.name_en && !isCatSub && !isDisSub && <div className="db-row-name-en">{row.name_en}</div>}
                    </td>
                    {groupBy === 'subtype' && (
                      <td className="db-td-cat">
                        {!isDisSub && !isCatSub && (
                          <span className="db-cat-badge" style={{ background: CATEGORY_COLORS[row.categoryId]+'22', color: CATEGORY_COLORS[row.categoryId] }}>
                            {row.categoryIcon} {row.categoryName}
                          </span>
                        )}
                      </td>
                    )}
                    <td className="db-td cn">{FMT_N(row.cn_new_cases)}</td>
                    <td className="db-td cn">{FMT_N(row.cn_prevalence)}</td>
                    <td className="db-td cn num">{FMT_B(row.cn_tam_usd)}</td>
                    <td className="db-td cn num">
                      {FMT_K(row.cn_spp)}
                      {row.cn_spp_denom && <span className="db-spp-denom">{row.cn_spp_denom === 'prev' ? '/存量' : '/新发'}</span>}
                    </td>
                    <td className="db-td us">{FMT_N(row.us_new_cases)}</td>
                    <td className="db-td us">{FMT_N(row.us_prevalence)}</td>
                    <td className="db-td us num">{FMT_B(row.us_tam_usd)}</td>
                    <td className="db-td us num">
                      {FMT_K(row.us_spp)}
                      {row.us_spp_denom && <span className="db-spp-denom">{row.us_spp_denom === 'prev' ? '/存量' : '/新发'}</span>}
                    </td>
                    <td className="db-td eu">{FMT_N(row.eu_new_cases)}</td>
                    <td className="db-td eu num">{FMT_B(row.eu_tam_usd)}</td>
                    <td className="db-td eu num">{FMT_K(row.eu_spp)}</td>
                    <td className="db-td total num">{FMT_B(row.total_tam_usd)}</td>
                    <td className="db-td survival num">
                      {row.cn_implied_survival != null ? `${row.cn_implied_survival}yr` : '—'}
                    </td>
                    <td className="db-td survival num">
                      {row.us_implied_survival != null ? `${row.us_implied_survival}yr` : '—'}
                    </td>
                  </tr>
                );
              })}

              {/* ── GRAND TOTAL ROW ── */}
              <tr className="db-row db-row-total">
                {showCheckbox && <td className="db-td-check" />}
                <td className="db-td-name"><div className="db-row-total-name">🌐 全部合计 Grand Total</div></td>
                {groupBy === 'subtype' && <td className="db-td-cat" />}
                <td className="db-td cn">{FMT_N(grandTotal.cn_new_cases)}</td>
                <td className="db-td cn">{FMT_N(grandTotal.cn_prevalence)}</td>
                <td className="db-td cn num">{FMT_B(grandTotal.cn_tam_usd)}</td>
                <td className="db-td cn num">{FMT_K(grandTotal.cn_spp)}</td>
                <td className="db-td us">{FMT_N(grandTotal.us_new_cases)}</td>
                <td className="db-td us">{FMT_N(grandTotal.us_prevalence)}</td>
                <td className="db-td us num">{FMT_B(grandTotal.us_tam_usd)}</td>
                <td className="db-td us num">{FMT_K(grandTotal.us_spp)}</td>
                <td className="db-td eu">{FMT_N(grandTotal.eu_new_cases)}</td>
                <td className="db-td eu num">{FMT_B(grandTotal.eu_tam_usd)}</td>
                <td className="db-td eu num">{FMT_K(grandTotal.eu_spp)}</td>
                <td className="db-td total num" style={{ fontSize: '1.05em' }}>{FMT_B(grandTotal.total_tam_usd)}</td>
                <td className="db-td" />
                <td className="db-td" />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── FOOTNOTES ── */}
      <div className="db-footnotes">
        <div className="db-fn-title">数据来源 Data Sources</div>
        <div className="db-fn-grid">
          <div className="db-fn-section">
            <div className="db-fn-heading">📊 Drug Sales TAM</div>
            <ul>
              <li><strong>US:</strong> IQVIA <em>Global Use of Medicines 2024</em>; EvaluatePharma <em>World Preview 2024</em>; 公司年报 (AZ, Roche, Pfizer, J&J, Novo Nordisk, AbbVie 2023AR)</li>
              <li><strong>CN:</strong> IQVIA China 2023; 国家医保局NRDL谈判披露; PDB医院用药数据库; 米内网2023. 注：经NRDL谈判降幅50-80%，实际sales远低于美国</li>
              <li><strong>EU:</strong> EvaluatePharma World Preview 2024; EFPIA <em>Pharmaceutical Industry in Figures 2023</em></li>
              <li><strong>FX:</strong> USD/CNY 7.2；USD/EUR 0.91（IMF 2023年均）</li>
            </ul>
          </div>
          <div className="db-fn-section">
            <div className="db-fn-heading">🏥 流行病学数据</div>
            <ul>
              <li><strong>CN:</strong> GLOBOCAN 2022 (IARC/WHO)；中国国家癌症中心<em>2024年癌症统计</em>；中华医学会各专科指南</li>
              <li><strong>US:</strong> SEER Database 2023；ACS <em>Cancer Facts &amp; Figures 2024</em>；CDC National Diabetes Statistics 2024</li>
              <li><strong>EU:</strong> ECIS (European Cancer Information System) 2022；Eurostat Health Statistics</li>
            </ul>
          </div>
          <div className="db-fn-section">
            <div className="db-fn-heading">⚠️ 重要说明</div>
            <ul>
              <li>TAM为<strong>药品销售额</strong>，非市场潜力预测；合计行为各子项加总</li>
              <li>Sales/Patient = TAM ÷ 年新增确诊人数（$K/人）</li>
              <li>MASH(CN)、obesity(CN/EU) 等新兴市场2023-2024年仍处起步阶段</li>
              <li>数据截止：2023年（部分2024Q1-Q3估算）；误差±20%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
