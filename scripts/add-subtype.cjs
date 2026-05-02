#!/usr/bin/env node
/**
 * add-subtype.cjs — 交互式向导，新增一个完整的疾病亚型
 *
 * 用法: node scripts/add-subtype.cjs
 *
 * 步骤:
 *   1. 选择目标文件（肿瘤11个文件 或 其他4个类别文件）
 *   2. 填写亚型基本信息（id / 中文名 / 英文名）
 *   3. 填写中国数据（new_cases / tam / 诊断步骤 / 治疗线）
 *   4. 填写美国数据（同上）
 *   5. 预览生成的 JSON
 *   6. 确认写入文件
 *   7. 可选：同时在 supplemental.js 添加 EU + prevalence 数据
 */

const fs   = require('fs');
const path = require('path');
const { createInterface } = require('readline');

const DATA_DIR = path.join(__dirname, '../src/data');

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

async function askNum(question, defaultVal) {
  while (true) {
    const raw = await ask(question, defaultVal !== undefined ? String(defaultVal) : undefined);
    const n = Number(raw);
    if (!isNaN(n) && raw !== '') return n;
    console.log('  请输入数字');
  }
}

async function askLines(prompt) {
  console.log(prompt + ' (每行一条，空行结束):');
  const lines = [];
  while (true) {
    const line = await ask('  >');
    if (line === '') break;
    lines.push(line);
  }
  return lines;
}

async function askYN(question) {
  while (true) {
    const ans = (await ask(question + ' (y/n)')).toLowerCase();
    if (ans === 'y' || ans === 'yes') return true;
    if (ans === 'n' || ans === 'no')  return false;
    console.log('  请输入 y 或 n');
  }
}

// ── 收集一个 drug option ──────────────────────────────────────────────────────

async function collectDrug(region) {
  const isCN = region === 'china';
  const name_cn      = await ask('  药品中文名');
  const name_en      = await ask('  药品英文名', '');
  const manufacturer = await ask('  厂商');
  const cost         = await askNum(`  年费用 (${isCN ? '人民币元' : 'USD'})`);
  const market_share = await ask('  市场份额（如 35%）', '0%');
  const selling_points = await askLines('  卖点');

  return {
    type: 'drug',
    name_cn,
    name_en: name_en || null,
    manufacturer,
    annual_cost_rmb: isCN ? cost : null,
    annual_cost_usd: isCN ? null : cost,
    market_share,
    selling_points,
  };
}

// ── 收集一个 pipeline 条目 ────────────────────────────────────────────────────

async function collectPipeline() {
  const name_cn = await ask('  药品中文名');
  const name_en = await ask('  药品英文名', '');
  const company = await ask('  公司');
  const stage   = await ask('  阶段（如 Phase 3）');
  const trial   = await ask('  试验名称', '');
  const status  = await ask('  状态描述');

  return { name_cn, name_en: name_en || undefined, company, stage, trial: trial || undefined, status };
}

// ── 收集一个 treatment line ───────────────────────────────────────────────────

async function collectLine(region) {
  const lineVal  = await ask('  Line 编号 (1/2/3/early)');
  const line     = isNaN(Number(lineVal)) ? lineVal : Number(lineVal);
  const label_cn = await ask('  中文标签（如：一线治疗）');
  const label_en = await ask('  英文标签（如：1st Line）', '');

  const options  = [];
  const pipeline = [];

  // Options
  let addMore = await askYN('  添加已批准药物 option?');
  while (addMore) {
    console.log('  ── 新药信息 ──');
    options.push(await collectDrug(region));
    addMore = await askYN('  再添加一个 option?');
  }

  // Pipeline
  addMore = await askYN('  添加在研 pipeline 药物?');
  while (addMore) {
    console.log('  ── Pipeline 信息 ──');
    pipeline.push(await collectPipeline());
    addMore = await askYN('  再添加一个 pipeline?');
  }

  return { line, label_cn, label_en: label_en || undefined, options, pipeline };
}

// ── 收集一个 region（china 或 us）────────────────────────────────────────────

async function collectRegion(region) {
  const isCN = region === 'china';
  console.log(`\n── ${isCN ? '🇨🇳 中国数据' : '🇺🇸 美国数据'} ──────────────────────`);

  const annual_new_cases      = await askNum('  年新发病例数');
  const annual_new_cases_note = await ask('  备注说明', '');
  const tam                   = await askNum(`  TAM (${isCN ? '亿元人民币 rmb_bn' : '十亿美元 usd_bn'})`);
  const diagnosis_steps       = await askLines('  诊断步骤');

  const lineCount = await askNum('  治疗线数量', 1);
  const treatment_lines = [];
  for (let i = 0; i < lineCount; i++) {
    console.log(`\n  ── Line ${i + 1} / ${lineCount} ──`);
    treatment_lines.push(await collectLine(region));
  }

  const obj = {
    annual_new_cases,
    ...(annual_new_cases_note ? { annual_new_cases_note } : {}),
    ...(isCN ? { tam_rmb_bn: tam } : { tam_usd_bn: tam }),
    diagnosis_steps,
    treatment_lines,
  };
  return obj;
}

// ── supplemental.js 写入 ──────────────────────────────────────────────────────

async function appendSupplemental(subtypeId) {
  console.log('\n── supplemental.js EU + Prevalence 数据 ──────────────────────');
  const eu_cases    = await askNum('  EU 年新发病例数');
  const eu_tam      = await askNum('  EU TAM (十亿欧元)');
  const eu_prev     = await askNum('  EU prevalence (总患病人数)');
  const cn_prev     = await askNum('  China prevalence');
  const cn_surv     = await askNum('  China 中位生存年数', 2);
  const us_prev     = await askNum('  US prevalence');
  const us_surv     = await askNum('  US 中位生存年数', 2);

  const entry = `  ${subtypeId}: {\n` +
    `    eu: { annual_new_cases: ${eu_cases}, tam_eur_bn: ${eu_tam}, prevalence: ${eu_prev} },\n` +
    `    china: { prevalence: ${cn_prev}, median_survival_years: ${cn_surv} },\n` +
    `    us:    { prevalence: ${us_prev}, median_survival_years: ${us_surv} },\n` +
    `  },`;

  const suppPath = path.join(DATA_DIR, 'supplemental.js');
  let text = fs.readFileSync(suppPath, 'utf8');

  // 找到 EU_SURVIVAL 对象的末尾（最后一个 "};" 前插入）
  // 策略：找 "// ── CLINICAL_ENDPOINTS" 注释行之前的位置
  const insertMarker = '// ─── CLINICAL_ENDPOINTS';
  const markerIdx = text.indexOf(insertMarker);
  if (markerIdx === -1) {
    console.log('  ⚠️  找不到插入位置，请手动添加到 supplemental.js 的 EU_SURVIVAL 对象中');
    console.log('\n  需要添加的内容:');
    console.log(entry);
    return;
  }

  // 找到 marker 前最后一个非空行的末尾
  const before = text.slice(0, markerIdx).trimEnd();
  const after  = text.slice(markerIdx);
  const newText = before + '\n' + entry + '\n' + after;
  fs.writeFileSync(suppPath, newText, 'utf8');
  console.log('  ✅ 已追加到 supplemental.js');
}

// ── 写入 JSON 文件 ────────────────────────────────────────────────────────────

function writeToFile(filePath, newSubtype, isOncology) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (isOncology) {
    // oncology 文件顶层就是一个 disease 对象，有 subtypes 数组
    data.subtypes.push(newSubtype);
  } else {
    // immune / metabolic 等文件有 diseases 数组，需要选择哪个 disease
    // 简化：追加到第一个 disease 的 subtypes（实际使用时可扩展）
    if (data.diseases?.[0]?.subtypes) {
      data.diseases[0].subtypes.push(newSubtype);
    } else if (data.subtypes) {
      data.subtypes.push(newSubtype);
    }
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// ── 主流程 ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║      新增疾病亚型 add-subtype         ║');
  console.log('╚══════════════════════════════════════╝\n');

  // 步骤1：选择文件
  const oncologyOpts = ['lung','breast','colorectal','gastric','cervical','prostate','liver','bladder','esophageal','thyroid','endometrial','hematologic_malignancies'];
  const otherOpts    = ['immune','metabolic','cardiovascular','neuro'];
  console.log('肿瘤文件:', oncologyOpts.join(' / '));
  console.log('其他文件:', otherOpts.join(' / '));
  let fileName = await ask('\n目标文件名（不含路径和扩展名）');
  while (![...oncologyOpts, ...otherOpts].includes(fileName)) {
    console.log('  未找到该文件，请重新输入');
    fileName = await ask('目标文件名');
  }
  const isOncology = oncologyOpts.includes(fileName);
  const filePath   = isOncology
    ? path.join(DATA_DIR, `oncology/${fileName}.json`)
    : path.join(DATA_DIR, `${fileName}.json`);
  console.log(`  → 目标文件: src/data/${isOncology ? 'oncology/' : ''}${fileName}.json`);

  // 步骤2：基本信息
  console.log('\n── 基本信息 ────────────────────────────────────');
  const id      = await ask('亚型 ID（英文下划线，如 gastric_claudin）');
  const name_cn = await ask('中文名称');
  const name_en = await ask('英文名称', '');

  // 检查 ID 是否已存在
  const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const subtypesArr = isOncology ? (existing.subtypes || []) : (existing.diseases?.[0]?.subtypes || []);
  if (subtypesArr.find(s => s.id === id)) {
    console.log(`\n⚠️  ID "${id}" 已存在于 ${fileName}.json，请使用不同的 ID`);
    rl.close();
    process.exit(1);
  }

  // 步骤3&4：收集两个 region 的数据
  const china = await collectRegion('china');
  const us    = await collectRegion('us');

  // 组装完整亚型对象
  const newSubtype = {
    id,
    name_cn,
    ...(name_en ? { name_en } : {}),
    china,
    us,
  };

  // 步骤5：预览
  console.log('\n── JSON 预览 ────────────────────────────────────');
  console.log(JSON.stringify(newSubtype, null, 2));

  // 步骤6：确认写入
  console.log(`\n将追加到 src/data/${isOncology ? 'oncology/' : ''}${fileName}.json 的 subtypes 数组末尾`);
  const confirmed = await askYN('确认写入?');
  if (!confirmed) {
    console.log('已取消，未写入任何文件');
    rl.close();
    return;
  }

  writeToFile(filePath, newSubtype, isOncology);
  console.log('✅ 写入成功');

  // 步骤7：supplemental.js
  const addSupp = await askYN('\n是否同时添加 supplemental.js 的 EU + prevalence 数据?');
  if (addSupp) await appendSupplemental(id);

  // 自动跑 validate
  console.log('\n── 运行数据验证 ─────────────────────────────────');
  const { spawnSync } = require('child_process');
  const result = spawnSync('/usr/local/bin/node', [path.join(__dirname, 'validate.cjs')], { stdio: 'inherit' });
  if (result.status !== 0) {
    console.log('\n⚠️  validate 报告了问题，请检查后 git push');
  } else {
    console.log('\n🎉 全部完成！可以 git push 了');
  }

  rl.close();
}

main().catch((e) => { console.error(e); rl.close(); process.exit(1); });
