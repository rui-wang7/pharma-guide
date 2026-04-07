#!/usr/bin/env node
/**
 * find-subtype.js — 快速定位一个亚型在哪个文件、哪些字段
 *
 * 用法:
 *   node scripts/find-subtype.js nsclc_egfr
 *   node scripts/find-subtype.js gastric_her2neg
 *
 * 输出: 文件路径 + china/us 的 annual_new_cases、prevalence、tam、treatment_lines 摘要
 * 目的: 给 Claude 下指令前，先确认定位，避免改错地方
 */

const fs   = require('fs');
const path = require('path');

const targetId = process.argv[2];
if (!targetId) {
  console.log('用法: node scripts/find-subtype.js <subtype_id>');
  console.log('例如: node scripts/find-subtype.js nsclc_egfr');
  process.exit(0);
}

const DATA_DIR = path.join(__dirname, '../src/data');

const oncologyFiles = [
  'lung','breast','colorectal','gastric','cervical',
  'prostate','liver','bladder','esophageal','thyroid','endometrial',
];
const otherFiles = ['immune','metabolic','cardiovascular','neuro'];

function search(filePath, relLabel) {
  const text = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(text);

  const subtypes = data.subtypes || [];
  for (const sub of subtypes) {
    if (sub.id !== targetId) continue;

    console.log(`\n✅ 找到: ${sub.name_cn} (${sub.name_en || ''})`);
    console.log(`   文件: src/data/${relLabel}`);
    console.log(`   ID:   ${sub.id}`);

    for (const region of ['china', 'us']) {
      const r = sub[region];
      if (!r) { console.log(`\n   [${region}] 无数据`); continue; }
      console.log(`\n   [${region}]`);
      console.log(`     annual_new_cases: ${r.annual_new_cases?.toLocaleString() || '—'}`);
      console.log(`     prevalence:       ${r.prevalence?.toLocaleString() || '—'} (来自JSON)`);
      console.log(`     tam:              ${r.tam_rmb_bn ? r.tam_rmb_bn + 'B RMB' : r.tam_usd_bn ? r.tam_usd_bn + 'B USD' : '—'}`);
      if (r.treatment_lines) {
        console.log(`     treatment_lines:`);
        for (const line of r.treatment_lines) {
          const opts = (line.options || []).map(o => o.name_cn || o.description || '').filter(Boolean);
          const pipes = (line.pipeline || []).map(p => p.name_cn || '').filter(Boolean);
          console.log(`       line ${line.line} (${line.label_cn}):`);
          if (opts.length)  console.log(`         options:  ${opts.join(' | ')}`);
          if (pipes.length) console.log(`         pipeline: ${pipes.join(' | ')}`);
        }
      }
    }
    return true;
  }
  return false;
}

let found = false;
for (const f of oncologyFiles) {
  if (search(path.join(DATA_DIR, `oncology/${f}.json`), `oncology/${f}.json`)) { found = true; break; }
}
if (!found) {
  for (const f of otherFiles) {
    const filePath = path.join(DATA_DIR, `${f}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (const disease of (data.diseases || [])) {
      if (search(path.join(DATA_DIR, `${f}.json`), `${f}.json`)) { found = true; break; }
    }
    if (found) break;
  }
}

if (!found) {
  console.log(`\n❌ 没有找到 id = "${targetId}" 的亚型`);
  console.log('   提示: 运行 node scripts/list-subtypes.js 查看所有 id');
}
