#!/usr/bin/env node
/**
 * check-coverage.cjs — 覆盖率报告
 *
 * 扫描所有亚型，报告：
 *   1. 缺 pipeline 的 treatment lines（pipeline 数组为空）
 *   2. 缺临床终点数据的已批准药物（不在 CLINICAL_ENDPOINTS 里）
 *
 * 用法:
 *   node scripts/check-coverage.cjs              # 两项都报告
 *   node scripts/check-coverage.cjs pipeline     # 只看 pipeline 缺失
 *   node scripts/check-coverage.cjs endpoints    # 只看临床终点缺失
 */

const fs   = require('fs');
const path = require('path');
const vm   = require('vm');

const filter   = process.argv[2] || 'all';   // 'pipeline' | 'endpoints' | 'all'
const DATA_DIR = path.join(__dirname, '../src/data');

// ── 加载数据（复用 validate.cjs 逻辑）────────────────────────────────────────

function loadJSON(relPath) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, relPath), 'utf8'));
}

const oncologyFiles = [
  'lung','breast','colorectal','gastric','cervical',
  'prostate','liver','bladder','esophageal','thyroid','endometrial','melanoma',
  'lymphoma', 'leukemia', 'myeloma',
];

// 扁平化所有 disease 对象（含 categoryLabel 方便展示）
const allDiseases = [
  ...oncologyFiles.map(f => ({ ...loadJSON(`oncology/${f}.json`), _cat: '肿瘤' })),
  ...loadJSON('immune.json').diseases.map(d => ({ ...d, _cat: '免疫' })),
  ...loadJSON('metabolic.json').diseases.map(d => ({ ...d, _cat: '代谢' })),
  ...loadJSON('cardiovascular.json').diseases.map(d => ({ ...d, _cat: '心血管' })),
  ...loadJSON('neuro.json').diseases.map(d => ({ ...d, _cat: '神经' })),
];

// 加载 supplemental → CLINICAL_ENDPOINTS
const suppText = fs.readFileSync(path.join(DATA_DIR, 'supplemental.js'), 'utf8');
const suppCJS  = suppText.replace(/^export const /gm, 'const ')
  + '\nmodule.exports = { EU_SURVIVAL, CLINICAL_ENDPOINTS, PIPELINE_ENDPOINTS };';
const suppMod  = { exports: {} };
vm.runInNewContext(suppCJS, { module: suppMod, console });
const { CLINICAL_ENDPOINTS } = suppMod.exports;
const clinSet = new Set(Object.keys(CLINICAL_ENDPOINTS));

// ── 扫描 ──────────────────────────────────────────────────────────────────────

const missingPipeline  = [];   // { label, region, lineNum, lineName }
const missingEndpoints = [];   // { label, region, lineNum, drugName }

for (const disease of allDiseases) {
  for (const sub of (disease.subtypes || [])) {
    const label = `[${sub.id}] ${sub.name_cn}`;

    for (const region of ['china', 'us']) {
      const r = sub[region];
      if (!r?.treatment_lines) continue;

      for (const line of r.treatment_lines) {
        // 检查1：pipeline 为空
        if (!line.pipeline || line.pipeline.length === 0) {
          missingPipeline.push({
            label,
            region,
            lineNum:  line.line,
            lineName: line.label_cn || `line ${line.line}`,
          });
        }

        // 检查2：drug option 缺临床终点
        for (const opt of (line.options || [])) {
          if (opt.type === 'drug' && opt.name_cn && !clinSet.has(opt.name_cn)) {
            missingEndpoints.push({
              label,
              region,
              lineNum:  line.line,
              lineName: line.label_cn || `line ${line.line}`,
              drugName: opt.name_cn,
            });
          }
        }
      }
    }
  }
}

// ── 输出 ──────────────────────────────────────────────────────────────────────

const W = (s) => process.stdout.write(s);

W('\n══════════════════════════════════════════\n');
W('           覆盖率报告 Coverage Report\n');
W('══════════════════════════════════════════\n\n');

// ─ Pipeline 缺失报告 ─
if (filter === 'all' || filter === 'pipeline') {
  W(`📋 缺 pipeline 的 treatment lines（共 ${missingPipeline.length} 处）\n`);
  if (missingPipeline.length === 0) {
    W('   ✅ 全部 treatment lines 都有 pipeline 数据\n');
  } else {
    // 按 label 分组
    const grouped = new Map();
    for (const item of missingPipeline) {
      if (!grouped.has(item.label)) grouped.set(item.label, []);
      grouped.get(item.label).push(item);
    }
    for (const [lbl, items] of grouped) {
      W(`\n  ${lbl}\n`);
      for (const it of items) {
        W(`    ${it.region.padEnd(6)} line ${it.lineNum} (${it.lineName}) — pipeline 为空\n`);
      }
    }
  }
  W('\n');
}

// ─ 临床终点缺失报告 ─
if (filter === 'all' || filter === 'endpoints') {
  W(`💊 缺临床终点数据的已批药物（共 ${missingEndpoints.length} 个）\n`);
  if (missingEndpoints.length === 0) {
    W('   ✅ 所有已批药物都有 OS/PFS 等临床终点数据\n');
  } else {
    const grouped = new Map();
    for (const item of missingEndpoints) {
      if (!grouped.has(item.label)) grouped.set(item.label, []);
      grouped.get(item.label).push(item);
    }
    for (const [lbl, items] of grouped) {
      W(`\n  ${lbl}\n`);
      for (const it of items) {
        W(`    ${it.region.padEnd(6)} line ${it.lineNum}: ${it.drugName}\n`);
      }
    }
  }
  W('\n');
}

// ─ 汇总行 ─
W('──────────────────────────────────────────\n');
if (filter === 'all') {
  W(`总计：${missingPipeline.length} 处缺 pipeline，${missingEndpoints.length} 个药缺临床终点数据\n`);
} else if (filter === 'pipeline') {
  W(`总计：${missingPipeline.length} 处缺 pipeline\n`);
} else {
  W(`总计：${missingEndpoints.length} 个药缺临床终点数据\n`);
}
W('\n');
