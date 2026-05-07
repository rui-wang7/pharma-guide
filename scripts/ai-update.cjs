#!/usr/bin/env node
/**
 * ai-update.cjs — AI 辅助数据更新（OpenAI GPT-4o）
 *
 * 交互式输入自然语言描述 → GPT-4o 生成符合 schema 的 JSON → 预览确认 → 写入文件
 *
 * 用法:
 *   node scripts/ai-update.cjs            # 交互式
 *   node scripts/ai-update.cjs --dry-run  # 只预览，不写入
 *
 * 环境变量:
 *   OPENAI_API_KEY  可放在项目根目录的 .env 文件，格式: OPENAI_API_KEY=sk-...
 *
 * 无需 npm install，使用 Node.js 内置 https 模块
 */

const fs    = require('fs');
const path  = require('path');
const https = require('https');
const { createInterface } = require('readline');
const vm    = require('vm');

const DRY_RUN  = process.argv.includes('--dry-run');
const DATA_DIR = path.join(__dirname, '../src/data');

// ── 读取 OPENAI_API_KEY ───────────────────────────────────────────────────────

function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
      const m = line.match(/^([A-Z_]+)\s*=\s*(.+)$/);
      if (m) process.env[m[1]] = m[2].trim();
    }
  }
}
loadEnv();

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error('❌ 找不到 OPENAI_API_KEY');
  console.error('   请在项目根目录创建 .env 文件，写入: OPENAI_API_KEY=sk-...');
  process.exit(1);
}

// ── readline helper ───────────────────────────────────────────────────────────

const rl = createInterface({ input: process.stdin, output: process.stdout });

function ask(question, defaultVal) {
  return new Promise((resolve) => {
    const suffix = defaultVal !== undefined ? ` [${defaultVal}]: ` : ': ';
    rl.question(question + suffix, (ans) => {
      const v = ans.trim();
      resolve(v === '' && defaultVal !== undefined ? defaultVal : v);
    });
  });
}

async function askYN(question) {
  while (true) {
    const ans = (await ask(question + ' (y/n)')).toLowerCase();
    if (ans === 'y' || ans === 'yes') return true;
    if (ans === 'n' || ans === 'no')  return false;
    console.log('  请输入 y 或 n');
  }
}

async function askMultiline(prompt) {
  console.log(prompt + ' (多行输入，输入 END 结束):');
  const lines = [];
  while (true) {
    const line = await ask('  >');
    if (line.toUpperCase() === 'END') break;
    lines.push(line);
  }
  return lines.join('\n');
}

// ── 加载数据 ──────────────────────────────────────────────────────────────────

function loadJSON(relPath) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, relPath), 'utf8'));
}

const oncologyFileMap = {
  lung: 'oncology/lung.json', breast: 'oncology/breast.json',
  colorectal: 'oncology/colorectal.json', gastric: 'oncology/gastric.json',
  cervical: 'oncology/cervical.json', prostate: 'oncology/prostate.json',
  liver: 'oncology/liver.json', bladder: 'oncology/bladder.json',
  esophageal: 'oncology/esophageal.json', thyroid: 'oncology/thyroid.json',
  endometrial: 'oncology/endometrial.json',
  lymphoma: 'oncology/lymphoma.json',
  leukemia: 'oncology/leukemia.json',
  myeloma:  'oncology/myeloma.json',

};
const otherFileMap = {
  immune: 'immune.json', metabolic: 'metabolic.json',
  cardiovascular: 'cardiovascular.json', neuro: 'neuro.json',
};
const allFileMap = { ...oncologyFileMap, ...otherFileMap };

function findSubtype(subtypeId) {
  for (const [fileName, relPath] of Object.entries(allFileMap)) {
    const data = loadJSON(relPath);
    const isOncology = !!oncologyFileMap[fileName];
    const diseases = isOncology ? [data] : (data.diseases || []);
    for (const disease of diseases) {
      const sub = (disease.subtypes || []).find(s => s.id === subtypeId);
      if (sub) return { sub, relPath, isOncology, data };
    }
  }
  return null;
}

function findLine(region, lineNum) {
  const lines = region?.treatment_lines || [];
  const target = String(lineNum);
  return lines.find(l => String(l.line) === target);
}

// ── 加载 CLINICAL_ENDPOINTS（用于检查是否已存在）────────────────────────────

function loadSupplemental() {
  const suppText = fs.readFileSync(path.join(DATA_DIR, 'supplemental.js'), 'utf8');
  const suppCJS  = suppText.replace(/^export const /gm, 'const ')
    + '\nmodule.exports = { EU_SURVIVAL, CLINICAL_ENDPOINTS, PIPELINE_ENDPOINTS };';
  const suppMod  = { exports: {} };
  vm.runInNewContext(suppCJS, { module: suppMod, console });
  return suppMod.exports;
}

// ── OpenAI API 调用 ───────────────────────────────────────────────────────────

function callOpenAI(systemPrompt, userContent) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      temperature: 0.1,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userContent },
      ],
    });

    const options = {
      hostname: 'api.openai.com',
      path:     '/v1/chat/completions',
      method:   'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) return reject(new Error(parsed.error.message));
          const content = parsed.choices?.[0]?.message?.content;
          resolve(JSON.parse(content));
        } catch (e) {
          reject(new Error('GPT-4o 返回的内容无法解析为 JSON:\n' + data.slice(0, 500)));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── System prompts ────────────────────────────────────────────────────────────

const DRUG_OPTION_SCHEMA = `你是医药数据结构化助手。根据用户提供的信息，生成一个符合以下 schema 的 JSON 对象。
只返回 JSON，不要解释，不要 markdown 代码块。

Schema（已批准药物 drug option）:
{
  "type": "drug",
  "name_cn": "药品中文名（含商品名括号）",
  "name_en": "药品英文名",
  "manufacturer": "厂商（中文名 英文名）",
  "annual_cost_rmb": 数字或null,
  "annual_cost_usd": 数字或null,
  "market_share": "XX%",
  "selling_points": ["3-5条要点，每条含关键数字或试验名"]
}

规则：
- annual_cost_rmb 和 annual_cost_usd 其中一个必须为 null
- 中国药物用 annual_cost_rmb，美国药物用 annual_cost_usd
- market_share：中国未获批填 "0%"，已获批但未知填 "—"
- selling_points 每条 15-30 字，包含试验名、OS/PFS 数据、批准机构`;

const PIPELINE_SCHEMA = `你是医药数据结构化助手。根据用户提供的信息，生成一个符合以下 schema 的 JSON 对象。
只返回 JSON，不要解释，不要 markdown 代码块。

Schema（在研管线药物 pipeline entry）:
{
  "name_cn": "药品中文名",
  "name_en": "药品英文名",
  "company": "公司（中文名 英文名）",
  "stage": "Phase X 或 已上市（国家）",
  "trial": "试验名称",
  "status": "一句话描述当前状态和亮点数据"
}`;

const ENDPOINT_SCHEMA = `你是医药数据结构化助手。根据用户提供的信息，提取临床终点数据，生成符合以下 schema 的 JSON 对象。
只返回 JSON，不要解释，不要 markdown 代码块。

Schema（临床终点 CLINICAL_ENDPOINTS 条目）:
{
  "key": "和 name_cn 完全一致的字符串",
  "os": "OS 数据如 '15.0m' 或 null",
  "os_hr": "HR 数字如 '0.62' 或 null",
  "pfs": "PFS 数据如 '7.1m' 或 null",
  "pfs_hr": "PFS HR 或 null",
  "orr": "ORR 如 '58%' 或 null",
  "trial": "试验名和简要描述"
}

规则：
- 只填有实际数据的字段，没有数据的填 null
- 数字统一用字符串格式，如 "15.0m"、"0.62"、"58%"`;

// ── 写入 JSON 文件中的某个位置 ────────────────────────────────────────────────

function writeToJSON(relPath, subtypeId, regionKey, lineNum, arrayKey, newItem, isOncology) {
  const filePath = path.join(DATA_DIR, relPath);
  const data     = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const diseases = isOncology ? [data] : (data.diseases || []);

  let wrote = false;
  for (const disease of diseases) {
    const sub = (disease.subtypes || []).find(s => s.id === subtypeId);
    if (!sub) continue;
    const region = sub[regionKey];
    if (!region) continue;
    const line = findLine(region, lineNum);
    if (!line) { console.log(`  ⚠️  找不到 line ${lineNum}`); return false; }
    line[arrayKey].push(newItem);
    wrote = true;
    break;
  }

  if (!wrote) { console.log('  ⚠️  未找到目标位置，未写入'); return false; }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  return true;
}

// ── 写入 supplemental.js 的 CLINICAL_ENDPOINTS ───────────────────────────────

function appendEndpoint(key, endpointData) {
  const suppPath = path.join(DATA_DIR, 'supplemental.js');
  let text = fs.readFileSync(suppPath, 'utf8');

  // 找到 PIPELINE_ENDPOINTS 的开始位置，在它之前插入
  const marker = 'export const PIPELINE_ENDPOINTS';
  const idx = text.indexOf(marker);
  if (idx === -1) {
    console.log('  ⚠️  找不到 PIPELINE_ENDPOINTS，请手动添加到 supplemental.js');
    return false;
  }

  // 构造新条目字符串
  const fields = ['os','os_hr','pfs','pfs_hr','orr','trial']
    .filter(k => endpointData[k] != null)
    .map(k => `${k}: '${endpointData[k]}'`)
    .join(', ');
  const entry = `  '${key}': { ${fields} },\n`;

  // 在 marker 前找最后一个 },  并在其后插入
  const before  = text.slice(0, idx).trimEnd();
  const after   = text.slice(idx);
  const newText = before + '\n' + entry + after;
  fs.writeFileSync(suppPath, newText, 'utf8');
  return true;
}

// ── 操作1：添加已批准药物 ─────────────────────────────────────────────────────

async function opAddDrug() {
  const subtypeId = await ask('亚型 ID（不知道请运行 list-subtypes）');
  const found = findSubtype(subtypeId);
  if (!found) {
    console.log(`  ❌ 找不到 id="${subtypeId}"，请运行 node scripts/list-subtypes.cjs 确认`);
    return;
  }
  const { sub, relPath, isOncology } = found;

  const regionKey = await ask('地区 (china/us)', 'china');
  const region    = sub[regionKey];
  if (!region) { console.log(`  ❌ 该亚型没有 ${regionKey} 数据`); return; }

  // 显示当前治疗线
  console.log(`\n  当前治疗线:`);
  for (const line of (region.treatment_lines || [])) {
    const opts = (line.options || []).map(o => o.name_cn).filter(Boolean).join(' | ');
    console.log(`    line ${line.line} (${line.label_cn}): ${opts || '（空）'}`);
  }

  const lineNum = await ask('Line 编号');
  const line    = findLine(region, lineNum);
  if (!line) { console.log(`  ❌ 找不到 line ${lineNum}`); return; }

  const currentDrugs = (line.options || []).map(o => o.name_cn).filter(Boolean).join(' | ');
  console.log(`\n  当前已有: ${currentDrugs || '（空）'}`);

  const rawInfo = await askMultiline('\n输入新药的原始信息（自然语言）');

  console.log('\n  ⏳ 调用 GPT-4o...');
  const systemPrompt = DRUG_OPTION_SCHEMA + `\n\n当前已有药物（避免重复）：${currentDrugs}`;
  let result;
  try {
    result = await callOpenAI(systemPrompt, rawInfo);
  } catch (e) {
    console.log('  ❌ API 调用失败:', e.message);
    return;
  }

  console.log('\n── 生成结果预览 ──────────────────────────────────');
  console.log(JSON.stringify(result, null, 2));
  console.log('─────────────────────────────────────────────────');

  if (DRY_RUN) { console.log('\n[dry-run] 未写入'); }
  else {
    const ok = await askYN(`\n写入到 ${relPath}？`);
    if (ok) {
      if (writeToJSON(relPath, subtypeId, regionKey, lineNum, 'options', result, isOncology)) {
        console.log('  ✅ 写入成功');
        await maybeSaveEndpoint(result.name_cn, rawInfo);
      }
    } else {
      console.log('  已取消');
    }
  }
}

// ── 操作2：添加 pipeline 在研药物 ────────────────────────────────────────────

async function opAddPipeline() {
  const subtypeId = await ask('亚型 ID');
  const found = findSubtype(subtypeId);
  if (!found) { console.log(`  ❌ 找不到 id="${subtypeId}"`); return; }
  const { sub, relPath, isOncology } = found;

  const regionKey = await ask('地区 (china/us)', 'china');
  const region    = sub[regionKey];
  if (!region) { console.log(`  ❌ 该亚型没有 ${regionKey} 数据`); return; }

  console.log(`\n  当前治疗线:`);
  for (const line of (region.treatment_lines || [])) {
    const pipes = (line.pipeline || []).map(p => p.name_cn).filter(Boolean).join(' | ');
    console.log(`    line ${line.line} (${line.label_cn}): pipeline = ${pipes || '（空）'}`);
  }

  const lineNum = await ask('Line 编号');
  const line    = findLine(region, lineNum);
  if (!line) { console.log(`  ❌ 找不到 line ${lineNum}`); return; }

  const rawInfo = await askMultiline('\n输入在研药物的原始信息（自然语言）');

  console.log('\n  ⏳ 调用 GPT-4o...');
  let result;
  try {
    result = await callOpenAI(PIPELINE_SCHEMA, rawInfo);
  } catch (e) {
    console.log('  ❌ API 调用失败:', e.message);
    return;
  }

  console.log('\n── 生成结果预览 ──────────────────────────────────');
  console.log(JSON.stringify(result, null, 2));
  console.log('─────────────────────────────────────────────────');

  if (DRY_RUN) { console.log('\n[dry-run] 未写入'); return; }
  const ok = await askYN(`\n写入到 ${relPath}？`);
  if (ok) {
    if (writeToJSON(relPath, subtypeId, regionKey, lineNum, 'pipeline', result, isOncology)) {
      console.log('  ✅ 写入成功');
    }
  }
}

// ── 操作3：添加 CLINICAL_ENDPOINTS 临床终点 ───────────────────────────────────

async function opAddEndpoint() {
  const drugName = await ask('药品 name_cn（和 JSON 里的完全一致）');
  const rawInfo  = await askMultiline('\n输入试验数据（OS、PFS、ORR、试验名等，自然语言）');

  // 检查是否已存在
  const { CLINICAL_ENDPOINTS } = loadSupplemental();
  if (CLINICAL_ENDPOINTS[drugName]) {
    console.log(`  ⚠️  CLINICAL_ENDPOINTS 里已有 "${drugName}" 的数据：`);
    console.log(' ', JSON.stringify(CLINICAL_ENDPOINTS[drugName]));
    const overwrite = await askYN('  是否覆盖？（会追加新条目，旧条目不删除）');
    if (!overwrite) return;
  }

  console.log('\n  ⏳ 调用 GPT-4o...');
  let result;
  try {
    result = await callOpenAI(ENDPOINT_SCHEMA, `药品名称：${drugName}\n\n${rawInfo}`);
  } catch (e) {
    console.log('  ❌ API 调用失败:', e.message);
    return;
  }

  const key = result.key || drugName;
  delete result.key;

  console.log('\n── 生成结果预览 ──────────────────────────────────');
  console.log(`  '${key}': ${JSON.stringify(result)}`);
  console.log('─────────────────────────────────────────────────');

  if (DRY_RUN) { console.log('\n[dry-run] 未写入'); return; }
  const ok = await askYN('\n追加到 supplemental.js？');
  if (ok) {
    if (appendEndpoint(key, result)) console.log('  ✅ 写入成功');
  }
}

// ── 操作4：更新某药物的 selling_points ───────────────────────────────────────

async function opUpdateSellingPoints() {
  const subtypeId = await ask('亚型 ID');
  const found = findSubtype(subtypeId);
  if (!found) { console.log(`  ❌ 找不到 id="${subtypeId}"`); return; }
  const { sub, relPath, isOncology } = found;

  const regionKey = await ask('地区 (china/us)', 'china');
  const region    = sub[regionKey];
  if (!region) { console.log(`  ❌ 该亚型没有 ${regionKey} 数据`); return; }

  const lineNum = await ask('Line 编号');
  const line    = findLine(region, lineNum);
  if (!line) { console.log(`  ❌ 找不到 line ${lineNum}`); return; }

  console.log('\n  当前 options:');
  (line.options || []).forEach((opt, i) => {
    console.log(`    ${i + 1}. ${opt.name_cn}`);
    if (opt.selling_points?.length) {
      opt.selling_points.forEach(p => console.log(`       - ${p}`));
    }
  });

  const idx = parseInt(await ask('\n修改第几个 option（序号）')) - 1;
  if (isNaN(idx) || idx < 0 || idx >= (line.options || []).length) {
    console.log('  ❌ 序号无效'); return;
  }
  const opt    = line.options[idx];
  const rawInfo = await askMultiline(`\n关于 "${opt.name_cn}" 的最新数据`);

  console.log('\n  ⏳ 调用 GPT-4o...');
  const sp_prompt = `根据以下信息，生成 3-5 条 selling_points 数组，每条 15-30 字，含试验名和关键数字。
返回 JSON: { "selling_points": [...] }`;
  let result;
  try {
    result = await callOpenAI(sp_prompt, `药品：${opt.name_cn}\n\n${rawInfo}`);
  } catch (e) {
    console.log('  ❌ API 调用失败:', e.message);
    return;
  }

  console.log('\n── 新 selling_points 预览 ─────────────────────────');
  (result.selling_points || []).forEach(p => console.log(`  - ${p}`));
  console.log('─────────────────────────────────────────────────');

  if (DRY_RUN) { console.log('\n[dry-run] 未写入'); return; }
  const ok = await askYN('\n确认更新？');
  if (!ok) return;

  const filePath = path.join(DATA_DIR, relPath);
  const data     = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const diseases = isOncology ? [data] : (data.diseases || []);
  for (const disease of diseases) {
    const s = (disease.subtypes || []).find(s => s.id === subtypeId);
    if (!s) continue;
    const l = findLine(s[regionKey], lineNum);
    if (!l) continue;
    l.options[idx].selling_points = result.selling_points;
    break;
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log('  ✅ 写入成功');
}

// ── 可选：顺带保存临床终点 ───────────────────────────────────────────────────

async function maybeSaveEndpoint(name_cn, rawInfo) {
  const { CLINICAL_ENDPOINTS } = loadSupplemental();
  if (CLINICAL_ENDPOINTS[name_cn]) return;  // 已存在，跳过

  const save = await askYN(`\n是否同时提取 "${name_cn}" 的临床终点数据到 supplemental.js?`);
  if (!save) return;

  console.log('  ⏳ 提取临床数据...');
  let result;
  try {
    result = await callOpenAI(ENDPOINT_SCHEMA, `药品名称：${name_cn}\n\n${rawInfo}`);
  } catch (e) {
    console.log('  ⚠️  提取失败:', e.message);
    return;
  }
  const key = result.key || name_cn;
  delete result.key;
  console.log(`  '${key}': ${JSON.stringify(result)}`);

  if (!DRY_RUN) {
    const ok = await askYN('  追加到 supplemental.js？');
    if (ok && appendEndpoint(key, result)) console.log('  ✅ 写入成功');
  }
}

// ── 主菜单 ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║    AI 数据更新工具  GPT-4o                  ║');
  if (DRY_RUN) console.log('║    [dry-run 模式：不会写入任何文件]        ║');
  console.log('╚════════════════════════════════════════════╝\n');

  console.log('操作类型:');
  console.log('  1. 添加新药 option（已批准药物）');
  console.log('  2. 添加 pipeline 在研药物');
  console.log('  3. 添加 CLINICAL_ENDPOINTS 临床终点数据');
  console.log('  4. 更新某药物的 selling_points');
  console.log('  q. 退出\n');

  while (true) {
    const choice = await ask('选择操作');
    if (choice === 'q' || choice === 'Q') break;

    console.log('');
    if      (choice === '1') await opAddDrug();
    else if (choice === '2') await opAddPipeline();
    else if (choice === '3') await opAddEndpoint();
    else if (choice === '4') await opUpdateSellingPoints();
    else { console.log('  请输入 1-4 或 q'); continue; }

    if (!DRY_RUN) {
      // 每次操作后自动 validate
      const { spawnSync } = require('child_process');
      const r = spawnSync('/usr/local/bin/node', [path.join(__dirname, 'validate.cjs')], { stdio: 'pipe' });
      if (r.status !== 0) {
        console.log('\n⚠️  validate 检测到问题:');
        console.log(r.stdout?.toString() || '');
        console.log(r.stderr?.toString() || '');
      }
    }

    console.log('\n────────────────────────────────────────────');
    const cont = await askYN('继续下一个操作?');
    if (!cont) break;
    console.log('');
  }

  console.log('\n再见！\n');
  rl.close();
}

main().catch((e) => { console.error(e); rl.close(); process.exit(1); });
