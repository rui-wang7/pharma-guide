#!/usr/bin/env node
/**
 * list-subtypes.js — 列出所有亚型的 id、名称、所在文件
 *
 * 用法: node scripts/list-subtypes.js
 *       node scripts/list-subtypes.js oncology   （只看肿瘤）
 *       node scripts/list-subtypes.js lung        （只看肺癌）
 */

const fs   = require('fs');
const path = require('path');

const filter  = process.argv[2] || '';
const DATA_DIR = path.join(__dirname, '../src/data');

const oncologyFiles = [
  'lung','breast','colorectal','gastric','cervical',
  'prostate','liver','bladder','esophageal','thyroid','endometrial',
];
const otherFiles = ['immune','metabolic','cardiovascular','neuro'];

function printDisease(disease, fileLabel) {
  if (filter && !fileLabel.includes(filter) && !disease.name_cn.includes(filter)) return;
  console.log(`\n  📁 ${disease.name_cn} (${disease.id}) → ${fileLabel}`);
  for (const sub of (disease.subtypes || [])) {
    const cn  = sub.china?.annual_new_cases;
    const us  = sub.us?.annual_new_cases;
    const cnStr = cn ? `CN ${(cn/1000).toFixed(0)}K` : 'CN —';
    const usStr = us ? `US ${(us/1000).toFixed(0)}K` : 'US —';
    console.log(`    ${sub.id.padEnd(30)} ${sub.name_cn.padEnd(24)} ${cnStr}  ${usStr}`);
  }
}

console.log('═══════════════════ 肿瘤学 Oncology ═══════════════════');
for (const f of oncologyFiles) {
  if (filter && !f.includes(filter)) {
    // still try to match by disease name
  }
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, `oncology/${f}.json`), 'utf8'));
  printDisease(data, `oncology/${f}.json`);
}

for (const f of otherFiles) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, `${f}.json`), 'utf8'));
  if (filter && !f.includes(filter) && !data.name_cn?.includes(filter)) continue;
  console.log(`\n═══════════════════ ${data.name_cn} ═══════════════════`);
  for (const disease of (data.diseases || [])) {
    printDisease(disease, `${f}.json`);
  }
}
