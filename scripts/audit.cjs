#!/usr/bin/env node
/**
 * audit.cjs — 结构一致性审计（只读）
 *
 * validate.cjs 检查数据是否完整；audit.cjs 检查条目是否"放对了地方"。
 *
 * 规则:
 *   R1 地区不符     中国线里的"已获批选项"只有 FDA 批准（或反之）
 *   R2 治疗阶段不符 辅助/新辅助/围手术期条目放在转移性线；名字写"一线"却在二线等
 *   R3 已上市仍在管线  管线条目的阶段显示在本地区已获批
 *   R4 重复         同一线内选项重复，或同一药同时出现在选项和管线
 *   R5 市场份额     同一线份额合计 > 100%
 *   R6 缺字段       选项缺名称/厂商；管线缺设计思路/进展/格局点评
 *   R7 获批日期冲突  同一药同一监管机构出现不同获批时间
 *
 * 用法:
 *   node scripts/audit.cjs            # 报告所有问题，有 ERROR 时退出码 1
 *   node scripts/audit.cjs --sales    # 另外列出每个药匹配到的销售额产品，供人工核对
 */
const fs = require('fs');
const path = require('path');
const DATA = path.join(__dirname, '../src/data');
const load = (p) => JSON.parse(fs.readFileSync(path.join(DATA, p), 'utf8'));

const onc = ['lung', 'breast', 'colorectal', 'gastric', 'cervical', 'prostate', 'liver', 'bladder',
  'esophageal', 'thyroid', 'endometrial', 'melanoma', 'lymphoma', 'leukemia', 'myeloma'];
const subs = [
  ...onc.flatMap((f) => load(`oncology/${f}.json`).subtypes.map((s) => ({ s, file: `oncology/${f}.json` }))),
  ...['immune', 'metabolic', 'cardiovascular', 'neuro'].flatMap((f) =>
    load(`${f}.json`).diseases.flatMap((d) => d.subtypes.map((s) => ({ s, file: `${f}.json` })))),
];

const out = { ERROR: [], WARN: [] };
const add = (lvl, rule, where, msg) => out[lvl].push(`[${rule}] ${where} — ${msg}`);

const EARLY = /辅助|新辅助|围手术期|术后|术前|adjuvant|perioperative|neoadjuvant/i;
const txt = (o) => `${o.name_cn || ''} ${o.name_en || ''}`;
const approvedByRegion = {}; // key: agency|drug → Set(values)

for (const { s, file } of subs) {
  for (const region of ['china', 'us']) {
    const lines = s[region]?.treatment_lines || [];
    lines.forEach((L, i) => {
      const where = `${file} › ${s.id} › ${region}[${i}] ${L.label_cn}`;
      const label = `${L.label_cn || ''} ${L.label_en || ''}`;
      const lineIsEarly = L.line === 'early' || EARLY.test(label) || /mHSPC|MIBC|基础|初始|症状性|可切除|局部晚期|resectable|locally advanced/i.test(label);
      const opts = L.options || [];
      const pipe = L.pipeline || [];

      // R1
      for (const o of opts) {
        const a = o.approved || '';
        if (region === 'china' && /FDA/.test(a) && !/NMPA/.test(a)) add('ERROR', 'R1', where, `选项「${o.name_cn}」只有 FDA 批准（${a}），不应列为中国已获批选项`);
        if (region === 'us' && /NMPA/.test(a) && !/FDA/.test(a)) add('ERROR', 'R1', where, `选项「${o.name_cn}」只有 NMPA 批准（${a}），不应列为美国已获批选项`);
        if (region === 'china' && /美国|中国审评|中国未/.test(o.market_share || '')) add('ERROR', 'R1', where, `选项「${o.name_cn}」份额栏为「${o.market_share}」，疑似未在中国获批`);
        if (a) {
          for (const part of a.split('/')) {
            const m = part.match(/(FDA|NMPA)\s*([0-9]{4}(?:-[0-9]{2}| Q[1-4])?)/);
            if (!m) continue;
            const key = `${m[1]}|${file}|${(o.name_en || o.name_cn).toLowerCase()}|${L.line}`;
            (approvedByRegion[key] ||= new Map()).set(m[2], where);
          }
        }
      }

      // R2
      for (const [kind, arr] of [['选项', opts], ['管线', pipe]]) {
        for (const o of arr) {
          const t = txt(o);
          if (!lineIsEarly && EARLY.test(t) && !/进展后|经治|post-neoadjuvant 后/.test(t)) add('ERROR', 'R2', where, `${kind}「${o.name_cn}」是辅助/围手术期治疗，却放在非早期线`);
          const says1 = /一线[）)]|\b1L\b|— 一线/.test(t); const says2 = /二线[）)]|\b2L\b|— 二线/.test(t);
          if (says1 && typeof L.line === 'number' && L.line >= 2) add('ERROR', 'R2', where, `${kind}「${o.name_cn}」名称标注一线，却放在 ${L.line} 线`);
          if (says2 && L.line === 1) add('ERROR', 'R2', where, `${kind}「${o.name_cn}」名称标注二线，却放在一线`);
        }
      }

      // R2b 管线的设计思路写明是术后辅助，却放在非早期线
      for (const p of pipe) {
        if (!lineIsEarly && /^(术后)?辅助|术后辅助/.test(p.design || '')) add('ERROR', 'R2', where, `管线「${p.name_cn}」的设计为辅助治疗（${p.design}），却放在非早期线`);
      }

      // R3
      for (const p of pipe) {
        const st = p.stage || '';
        const cnApproved = !/未核实/.test(st) && ((/中国已(上市|获批|批)|NMPA\s*已?批|已上市（中国/.test(st) && !/中国(审评|申报|未|Phase|III)/.test(st.replace(/中国已(上市|获批|批)[^/]*/, ''))) || (/^已(上市|获批)/.test(st) && !/美|欧|FDA/.test(st)));
        const usApproved = /^已(上市|获批)|美国已(批|上市|获批)|FDA\s*已?批准|已上市（(美国|FDA|20)/.test(st);
        const partial = /后线|适应症拓展|拓展|探索|Phase|审评|申报|部分|诊断/.test(st);
        if (region === 'china' && cnApproved) add(partial ? 'WARN' : 'ERROR', 'R3', where, `管线「${p.name_cn}」阶段为「${st}」，在中国已获批，应移到已获批选项`);
        if (region === 'us' && usApproved) add(partial ? 'WARN' : 'ERROR', 'R3', where, `管线「${p.name_cn}」阶段为「${st}」，在美国已获批，应移到已获批选项`);
      }

      // R4
      const seen = new Set();
      for (const o of opts) { const k = (o.name_en || o.name_cn || '').toLowerCase(); if (seen.has(k)) add('ERROR', 'R4', where, `选项重复：${o.name_cn}`); seen.add(k); }
      for (const p of pipe) { const k = (p.name_en || p.name_cn || '').toLowerCase(); if (seen.has(k)) add('ERROR', 'R4', where, `「${p.name_cn}」同时出现在选项和管线`); }
      const pseen = new Set();
      for (const p of pipe) { const k = (p.name_en || p.name_cn || '').toLowerCase(); if (pseen.has(k)) add('ERROR', 'R4', where, `管线重复：${p.name_cn}`); pseen.add(k); }

      // R5
      const total = opts.reduce((a, o) => a + (parseFloat(o.market_share) || 0), 0);
      // 联合用药线（心衰四联、基础治疗等）各药并用，份额不互斥，不做合计校验
      if (total > 100.5 && !/GDMT|四联|基础/.test(label)) add('WARN', 'R5', where, `市场份额合计 ${total}% > 100%`);

      // R6
      for (const o of opts) {
        if (!o.name_cn || (!o.manufacturer && o.type !== 'surgery')) add('ERROR', 'R6', where, `选项缺名称或厂商：${o.name_en || o.name_cn}`);
        if (o.type === 'drug' && !o.name_en) add('WARN', 'R6', where, `选项缺英文名：${o.name_cn}`);
      }
      for (const p of pipe) {
        const miss = ['company', 'stage', 'status', 'design', 'impact'].filter((k) => !p[k] || p[k] === '—');
        if (miss.length) add('WARN', 'R6', where, `管线「${p.name_cn}」缺 ${miss.join('/')}`);
      }
    });
  }
}

// R7
for (const [key, vals] of Object.entries(approvedByRegion)) {
  if (vals.size > 1) add('WARN', 'R7', key, `同一药同一线出现不同获批时间：${[...vals.keys()].join(' vs ')}`);
}

for (const lvl of ['ERROR', 'WARN']) {
  console.log(`\n${lvl === 'ERROR' ? '❌' : '⚠️ '} ${lvl}（${out[lvl].length}）`);
  out[lvl].forEach((m) => console.log('  ' + m));
}

if (process.argv.includes('--sales')) {
  const src = fs.readFileSync(path.join(DATA, 'sales.js'), 'utf8')
    .replace(/^export const /gm, 'const ').replace(/^export function /gm, 'function ') + '\nmodule.exports = { matchSales };';
  const m = { exports: {} };
  require('vm').runInNewContext(src, { module: m });
  const map = new Map();
  for (const { s } of subs) for (const r of ['china', 'us']) for (const L of s[r].treatment_lines) for (const o of L.options || []) {
    if (o.type !== 'drug') continue;
    const hit = m.exports.matchSales(o).map((x) => x.brand).join(', ');
    map.set(`${o.name_en || o.name_cn}`, hit);
  }
  console.log('\n💵 销售额匹配（药名 → 产品）');
  [...map].sort().forEach(([k, v]) => console.log(`  ${k}  →  ${v || '（无）'}`));
}

console.log(`\n共 ${subs.length} 个亚型；${out.ERROR.length} 个错误，${out.WARN.length} 个警告`);
if (out.ERROR.length) process.exit(1);
