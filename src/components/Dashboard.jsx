import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell, ReferenceLine,
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

const FMT_B = (v) => v == null ? '—' : `$${v.toFixed(1)}B`;
const FMT_K = (v) => v == null ? '—' : `$${v.toLocaleString()}K`;
const FMT_N = (v) => v == null ? '—' : v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}K` : v.toLocaleString();

const METRICS = [
  { key: 'tam',        label: 'Drug Sales TAM ($B)',           cnKey: 'cn_tam_usd',    usKey: 'us_tam_usd',    euKey: 'eu_tam_usd',    fmt: (v) => v?.toFixed(2) },
  { key: 'new_cases',  label: '年新增确诊 Annual New Cases',    cnKey: 'cn_new_cases',  usKey: 'us_new_cases',  euKey: 'eu_new_cases',  fmt: (v) => v?.toLocaleString() },
  { key: 'prevalence', label: '患病人数 Prevalence',            cnKey: 'cn_prevalence', usKey: 'us_prevalence', euKey: 'eu_prevalence', fmt: (v) => v?.toLocaleString() },
  { key: 'spp',        label: 'Sales/Patient ($K/yr)',         cnKey: 'cn_spp',        usKey: 'us_spp',        euKey: 'eu_spp',        fmt: (v) => v?.toLocaleString() },
];

// Custom tooltip for bar chart
function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="db-tooltip">
      <div className="db-tooltip-title">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="db-tooltip-row" style={{ color: p.color }}>
          <span>{p.name}:</span>
          <span>{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}</span>
        </div>
      ))}
    </div>
  );
}

// Custom tooltip for bubble chart
function BubbleTooltip({ active, payload }) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="db-tooltip">
      <div className="db-tooltip-title">{d.name_cn}</div>
      <div className="db-tooltip-row"><span>TAM ($B):</span><span>{d.x?.toFixed(2)}</span></div>
      <div className="db-tooltip-row"><span>New Cases:</span><span>{d.y?.toLocaleString()}</span></div>
      <div className="db-tooltip-row"><span>Sales/Patient:</span><span>${d.z?.toLocaleString()}K</span></div>
      <div className="db-tooltip-row" style={{ color: '#94a3b8', fontSize: 11 }}><span>{d.market?.toUpperCase()}</span></div>
    </div>
  );
}

export default function Dashboard() {
  const allData = useMemo(() => getDashboardData(), []);

  // ── Filters ──
  const [selectedMetric, setSelectedMetric] = useState('tam');
  const [selectedMarkets, setSelectedMarkets] = useState({ cn: true, us: true, eu: true });
  const [selectedCategories, setSelectedCategories] = useState(
    Object.fromEntries(['oncology', 'immune', 'metabolic', 'cardiovascular', 'neuro'].map((c) => [c, true]))
  );
  const [selectedIds, setSelectedIds] = useState(() => {
    // Default: top 15 by total TAM
    const top = allData.slice(0, 15).map((d) => d.id);
    return new Set(top);
  });
  const [chartType, setChartType] = useState('bar'); // 'bar' | 'bubble'
  const [sortCol, setSortCol] = useState('total_tam_usd');
  const [sortDir, setSortDir] = useState('desc');
  const [tableSearch, setTableSearch] = useState('');

  const metric = METRICS.find((m) => m.key === selectedMetric);

  // Filtered + sorted table data
  const tableData = useMemo(() => {
    let rows = allData.filter((d) => {
      if (!selectedCategories[d.categoryId]) return false;
      if (tableSearch) {
        const q = tableSearch.toLowerCase();
        return d.name_cn.toLowerCase().includes(q) || d.name_en.toLowerCase().includes(q) || d.diseaseName_cn.toLowerCase().includes(q);
      }
      return true;
    });
    rows = [...rows].sort((a, b) => {
      const av = a[sortCol] ?? -Infinity;
      const bv = b[sortCol] ?? -Infinity;
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return rows;
  }, [allData, selectedCategories, tableSearch, sortCol, sortDir]);

  // Chart data: only selected IDs
  const chartData = useMemo(() => {
    return tableData
      .filter((d) => selectedIds.has(d.id))
      .map((d) => ({
        ...d,
        shortName: d.name_cn.length > 14 ? d.name_cn.slice(0, 13) + '…' : d.name_cn,
        cn: d[metric.cnKey],
        us: d[metric.usKey],
        eu: d[metric.euKey],
      }));
  }, [tableData, selectedIds, metric]);

  // Bubble data
  const bubbleData = useMemo(() => {
    const pts = [];
    chartData.forEach((d) => {
      const markets = [
        { market: 'cn', tam: d.cn_tam_usd, cases: d.cn_new_cases, spp: d.cn_spp, color: MARKET_COLORS.cn },
        { market: 'us', tam: d.us_tam_usd, cases: d.us_new_cases, spp: d.us_spp, color: MARKET_COLORS.us },
        { market: 'eu', tam: d.eu_tam_usd, cases: d.eu_new_cases, spp: d.eu_spp, color: MARKET_COLORS.eu },
      ];
      markets.forEach(({ market, tam, cases, spp, color }) => {
        if (!selectedMarkets[market] || !tam || !cases) return;
        pts.push({ ...d, x: tam, y: cases, z: spp || 1, market, color });
      });
    });
    return pts;
  }, [chartData, selectedMarkets]);

  const toggleId = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === tableData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(tableData.map((d) => d.id)));
    }
  };

  const handleSort = (col) => {
    if (sortCol === col) setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    else { setSortCol(col); setSortDir('desc'); }
  };

  const SortIcon = ({ col }) => sortCol === col ? (sortDir === 'desc' ? ' ↓' : ' ↑') : ' ↕';

  return (
    <div className="dashboard">
      {/* ── HEADER ── */}
      <div className="db-header">
        <div>
          <h1 className="db-title">市场总览 Market Dashboard</h1>
          <p className="db-subtitle">选择病种加入图表对比 · Select diseases to compare across CN / US / EU</p>
        </div>
      </div>

      {/* ── CONTROL BAR ── */}
      <div className="db-controls">
        {/* Metric selector */}
        <div className="db-control-group">
          <span className="db-control-label">指标 Metric</span>
          <div className="db-pills">
            {METRICS.map((m) => (
              <button key={m.key} className={`db-pill ${selectedMetric === m.key ? 'active' : ''}`}
                onClick={() => setSelectedMetric(m.key)}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Market toggles */}
        <div className="db-control-group">
          <span className="db-control-label">市场 Market</span>
          <div className="db-pills">
            {[['cn', '🇨🇳 中国'], ['us', '🇺🇸 美国'], ['eu', '🇪🇺 欧洲']].map(([k, label]) => (
              <button key={k} className={`db-pill ${selectedMarkets[k] ? 'active' : ''}`}
                style={selectedMarkets[k] ? { background: MARKET_COLORS[k] + '22', borderColor: MARKET_COLORS[k], color: MARKET_COLORS[k] } : {}}
                onClick={() => setSelectedMarkets((p) => ({ ...p, [k]: !p[k] }))}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div className="db-control-group">
          <span className="db-control-label">疾病类别</span>
          <div className="db-pills">
            {[
              ['oncology', '🎗️ 肿瘤'],
              ['immune', '🛡️ 免疫'],
              ['metabolic', '⚗️ 代谢'],
              ['cardiovascular', '❤️ 心血管'],
              ['neuro', '🧠 神经'],
            ].map(([k, label]) => (
              <button key={k} className={`db-pill ${selectedCategories[k] ? 'active' : ''}`}
                style={selectedCategories[k] ? { background: CATEGORY_COLORS[k] + '22', borderColor: CATEGORY_COLORS[k], color: CATEGORY_COLORS[k] } : {}}
                onClick={() => setSelectedCategories((p) => ({ ...p, [k]: !p[k] }))}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart type */}
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
            <div className="db-chart-title">
              {metric.label} — {chartData.length} 个病种已选入图表
            </div>
            {chartData.length === 0 ? (
              <div className="db-empty">请在下方表格勾选病种</div>
            ) : (
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={chartData} margin={{ top: 8, right: 24, left: 8, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="shortName" angle={-40} textAnchor="end" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip content={<BarTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  {selectedMarkets.cn && <Bar dataKey="cn" name="🇨🇳 中国" fill={MARKET_COLORS.cn} radius={[3, 3, 0, 0]} maxBarSize={28} />}
                  {selectedMarkets.us && <Bar dataKey="us" name="🇺🇸 美国" fill={MARKET_COLORS.us} radius={[3, 3, 0, 0]} maxBarSize={28} />}
                  {selectedMarkets.eu && <Bar dataKey="eu" name="🇪🇺 欧洲" fill={MARKET_COLORS.eu} radius={[3, 3, 0, 0]} maxBarSize={28} />}
                </BarChart>
              </ResponsiveContainer>
            )}
          </>
        )}

        {chartType === 'bubble' && (
          <>
            <div className="db-chart-title">
              气泡图：X = TAM ($B) · Y = 年新增确诊 · 气泡大小 = Sales/Patient
              <span className="db-chart-subtitle">气泡越大 = 每个患者的年用药费用越高</span>
            </div>
            {bubbleData.length === 0 ? (
              <div className="db-empty">请在下方表格勾选病种，并确保选中至少一个市场</div>
            ) : (
              <ResponsiveContainer width="100%" height={420}>
                <ScatterChart margin={{ top: 16, right: 32, left: 8, bottom: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" dataKey="x" name="TAM ($B)" unit="B" tick={{ fontSize: 11 }} label={{ value: 'TAM ($B)', position: 'insideBottom', offset: -4, fontSize: 11 }} />
                  <YAxis type="number" dataKey="y" name="New Cases" tick={{ fontSize: 11 }}
                    tickFormatter={(v) => v >= 1e6 ? `${(v / 1e6).toFixed(0)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}K` : v}
                    label={{ value: '年新增确诊', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11 }} />
                  <ZAxis type="number" dataKey="z" range={[80, 1800]} />
                  <Tooltip content={<BubbleTooltip />} />
                  <Scatter data={bubbleData} name="diseases">
                    {bubbleData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} fillOpacity={0.72} stroke={entry.color} strokeWidth={1} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            )}
            <div className="db-bubble-legend">
              {[['cn', '🇨🇳 中国'], ['us', '🇺🇸 美国'], ['eu', '🇪🇺 欧洲']].map(([k, label]) => (
                <span key={k} className="db-bubble-legend-item">
                  <span className="db-bubble-legend-dot" style={{ background: MARKET_COLORS[k] }} />
                  {label}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── DATA TABLE ── */}
      <div className="db-table-card">
        <div className="db-table-header">
          <div className="db-table-title">
            数据表 · {tableData.length} 个病种
            <span className="db-table-subtitle">勾选病种加入图表</span>
          </div>
          <div className="db-table-controls">
            <input
              className="db-search"
              type="text"
              placeholder="搜索病种..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
            />
            <button className="db-btn-sm" onClick={toggleAll}>
              {selectedIds.size === tableData.length ? '取消全选' : `全选 (${tableData.length})`}
            </button>
          </div>
        </div>

        <div className="db-table-wrapper">
          <table className="db-table">
            <thead>
              <tr>
                <th className="db-th-check">图表</th>
                <th className="db-th-name">病种</th>
                <th className="db-th-cat">类别</th>
                {/* CN */}
                <th className="db-th sortable cn" onClick={() => handleSort('cn_new_cases')}>🇨🇳 新发<SortIcon col="cn_new_cases" /></th>
                <th className="db-th sortable cn" onClick={() => handleSort('cn_prevalence')}>🇨🇳 患者数<SortIcon col="cn_prevalence" /></th>
                <th className="db-th sortable cn" onClick={() => handleSort('cn_tam_usd')}>🇨🇳 TAM<SortIcon col="cn_tam_usd" /></th>
                <th className="db-th sortable cn" onClick={() => handleSort('cn_spp')}>🇨🇳 $/患者<SortIcon col="cn_spp" /></th>
                {/* US */}
                <th className="db-th sortable us" onClick={() => handleSort('us_new_cases')}>🇺🇸 新发<SortIcon col="us_new_cases" /></th>
                <th className="db-th sortable us" onClick={() => handleSort('us_prevalence')}>🇺🇸 患者数<SortIcon col="us_prevalence" /></th>
                <th className="db-th sortable us" onClick={() => handleSort('us_tam_usd')}>🇺🇸 TAM<SortIcon col="us_tam_usd" /></th>
                <th className="db-th sortable us" onClick={() => handleSort('us_spp')}>🇺🇸 $/患者<SortIcon col="us_spp" /></th>
                {/* EU */}
                <th className="db-th sortable eu" onClick={() => handleSort('eu_new_cases')}>🇪🇺 新发<SortIcon col="eu_new_cases" /></th>
                <th className="db-th sortable eu" onClick={() => handleSort('eu_tam_usd')}>🇪🇺 TAM<SortIcon col="eu_tam_usd" /></th>
                <th className="db-th sortable eu" onClick={() => handleSort('eu_spp')}>🇪🇺 $/患者<SortIcon col="eu_spp" /></th>
                {/* Total */}
                <th className="db-th sortable total" onClick={() => handleSort('total_tam_usd')}>总TAM<SortIcon col="total_tam_usd" /></th>
                <th className="db-th">存活期</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => {
                const checked = selectedIds.has(row.id);
                return (
                  <tr key={row.id} className={`db-row ${checked ? 'selected' : ''}`} onClick={() => toggleId(row.id)}>
                    <td className="db-td-check">
                      <input type="checkbox" checked={checked} onChange={() => toggleId(row.id)} onClick={(e) => e.stopPropagation()} />
                    </td>
                    <td className="db-td-name">
                      <div className="db-row-name">{row.name_cn}</div>
                      <div className="db-row-name-en">{row.name_en}</div>
                    </td>
                    <td className="db-td-cat">
                      <span className="db-cat-badge" style={{ background: CATEGORY_COLORS[row.categoryId] + '22', color: CATEGORY_COLORS[row.categoryId] }}>
                        {row.categoryIcon} {row.categoryName}
                      </span>
                    </td>
                    <td className="db-td cn">{FMT_N(row.cn_new_cases)}</td>
                    <td className="db-td cn">{FMT_N(row.cn_prevalence)}</td>
                    <td className="db-td cn num">{FMT_B(row.cn_tam_usd)}</td>
                    <td className="db-td cn num">{FMT_K(row.cn_spp)}</td>
                    <td className="db-td us">{FMT_N(row.us_new_cases)}</td>
                    <td className="db-td us">{FMT_N(row.us_prevalence)}</td>
                    <td className="db-td us num">{FMT_B(row.us_tam_usd)}</td>
                    <td className="db-td us num">{FMT_K(row.us_spp)}</td>
                    <td className="db-td eu">{FMT_N(row.eu_new_cases)}</td>
                    <td className="db-td eu num">{FMT_B(row.eu_tam_usd)}</td>
                    <td className="db-td eu num">{FMT_K(row.eu_spp)}</td>
                    <td className="db-td total num">{FMT_B(row.total_tam_usd)}</td>
                    <td className="db-td survival">
                      {row.us_survival ? `${row.us_survival}yr` : row.cn_survival ? `${row.cn_survival}yr` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
