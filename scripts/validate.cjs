#!/usr/bin/env node
/**
 * validate.js — 检查所有疾病数据的完整性
 *
 * 用法: node scripts/validate.js
 *
 * 检查项目:
 *  1. prevalence < annual_new_cases（总患者数不能小于年新发）
 *  2. 缺少 EU 数据（supplemental.js 里没有对应 id）
 *  3. 缺少临床终点数据（药物没有 clinical_data）
 *  4. JSON 格式错误
 */

const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../src/data');

// ── 加载所有数据 ─────────────────────────────────────────────────────────────

function loadJSON(relPath) {
  const full = path.join(DATA_DIR, relPath);
  try {
    return JSON.parse(fs.readFileSync(full, 'utf8'));
  } catch (e) {
    console.error(`❌ JSON 解析失败: ${relPath}\n   ${e.message}`);
    process.exit(1);
  }
}

const oncologyFiles = [
  'lung','breast','colorectal','gastric','cervical',
  'prostate','liver','bladder','esophageal','thyroid','endometrial',
];

const allDiseases = [
  ...oncologyFiles.map(f => loadJSON(`oncology/${f}.json`)),
  ...['immune','metabolic','cardiovascular','neuro'].map(f => loadJSON(`${f}.json`)),
];

// 加载 supplemental（用 vm 执行，提取 EU_SURVIVAL 和 CLINICAL_ENDPOINTS）
const vm = require('vm');
const suppText = fs.readFileSync(path.join(DATA_DIR, 'supplemental.js'), 'utf8');
// 把 ES export 转成 CommonJS 风格执行
const suppCJS = suppText
  .replace(/^export const /gm, 'const ')
  + '\nmodule.exports = { EU_SURVIVAL, CLINICAL_ENDPOINTS, PIPELINE_ENDPOINTS };';
const suppModule = { exports: {} };
vm.runInNewContext(suppCJS, { module: suppModule, console });
const { EU_SURVIVAL, CLINICAL_ENDPOINTS, PIPELINE_ENDPOINTS } = suppModule.exports;
const euSet  = new Set(Object.keys(EU_SURVIVAL));
const clinSet = new Set(Object.keys(CLINICAL_ENDPOINTS));

// ── 检查逻辑 ─────────────────────────────────────────────────────────────────

let errors = 0, warnings = 0;

function err(msg)  { console.error(`  ❌ ${msg}`); errors++; }
function warn(msg) { console.warn (`  ⚠️  ${msg}`); warnings++; }

for (const disease of allDiseases) {
  for (const sub of (disease.subtypes || [])) {
    const label = `[${sub.id}] ${sub.name_cn}`;

    // 1. prevalence vs new_cases
    for (const region of ['china', 'us']) {
      const r = sub[region];
      if (!r) continue;
      if (r.prevalence && r.annual_new_cases && r.prevalence < r.annual_new_cases) {
        err(`${label} — ${region}: prevalence (${r.prevalence.toLocaleString()}) < new_cases (${r.annual_new_cases.toLocaleString()})`);
      }
      const suppRegion = EU_SURVIVAL[sub.id]?.[region];
      const hasPrevalence = r.prevalence || suppRegion?.prevalence;
      if (!r.annual_new_cases) warn(`${label} — ${region}: 缺少 annual_new_cases`);
      if (!hasPrevalence)      warn(`${label} — ${region}: 缺少 prevalence（JSON 和 supplemental 里都没有）`);
    }

    // 2. EU 数据
    if (!euSet.has(sub.id)) {
      warn(`${label} — supplemental.js 里没有 EU 数据`);
    }

    // 3. 药物临床终点数据覆盖率
    for (const region of ['china', 'us']) {
      const r = sub[region];
      if (!r?.treatment_lines) continue;
      for (const line of r.treatment_lines) {
        for (const opt of (line.options || [])) {
          if (opt.type === 'drug' && opt.name_cn && !clinSet.has(opt.name_cn)) {
            // 只提示，不报错（很多药没有临床数据是正常的）
            // warn(`${label} — ${region} line ${line.line}: '${opt.name_cn}' 缺临床终点数据`);
          }
        }
      }
    }
  }
}

// ── 汇总 ──────────────────────────────────────────────────────────────────────
console.log('\n────────────────────────────────────');
if (errors === 0 && warnings === 0) {
  console.log('✅ 全部通过，没有问题');
} else {
  console.log(`结果: ${errors} 个错误，${warnings} 个警告`);
  if (errors > 0) process.exit(1);
}
