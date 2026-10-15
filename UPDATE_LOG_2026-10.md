# 数据更新日志 — 2026-10-15

覆盖时间：2026-07 至 2026-10-15（接续上次 ASCO 2026 更新）。每条均经 ≥2 个独立来源交叉核实（FDA / 公司新闻稿 / OncLive / Targeted Oncology 等）。

## 新获批（FDA）

| 日期 | 药物 | 适应症 | 关键数据 | 文件 / 位置 |
|---|---|---|---|---|
| 2026-07-14 | Gedatolisib（Revtorpyk）+ 氟维司群 ± 哌柏西利 | HR+/HER2- PIK3CA野生型，≥1线内分泌后 | VIKTORIA-1 PFS 9.3 vs 2.0m（HR 0.24） | breast.json › bc_hrpos › US 新增二线 |
| 2026-08-06 | RP1（Tudriqev）+ 纳武利尤单抗（加速） | 抗PD-1进展后皮肤黑色素瘤 | IGNYTE ORR 33.6%（CR 15%） | melanoma.json › BRAF › US 新增二线 |
| 2026-08-13 | Iberdomide（Zenbexus）+ Dara SC + Dex（加速） | R/R MM ≥1线 | MRD阴性CR 41% vs 21% | myeloma.json › US 二线 option；pipeline 改为仅 Mezigdomide |
| 2026-08-25 | Zanidatamab（Ziihera）± 替雷利珠单抗 + 化疗 | 一线HER2+ 胃/GEJ/食管腺癌 | PFS 12.4 vs 8.1m，OS 26.4 vs 19.2m | gastric.json › HER2+ US一线 option + 中国 pipeline；esophageal.json US pipeline |
| 2026-09-04 | Camizestrant（Etcamah）+ CDK4/6i（加速） | 一线中ctDNA出现ESR1突变时换药 | SERENA-6 PFS 16.0 vs 9.2m（HR 0.44） | breast.json › bc_hrpos › US一线 option；中国 pipeline 状态 |
| 2026-09-18 | Imlunestrant（Inluriyo）+ 阿贝西利 | ESR1突变 ER+/HER2-，≥1线内分泌后 | EMBER-3 亚组 PFS 11.1 vs 5.5m | breast.json › bc_hrpos › US 新增二线 |
| 2026-10-02 | Pirtobrutinib（Jaypirca）一线 | 初治CLL/SLL，无17p缺失 | BRUIN CLL-313 PFS HR 0.20 | leukemia.json › CLL › US一线 option；中国 pipeline 状态 |

## 试验进展（未获批）

| 药物 | 试验 | 进展 | 文件 |
|---|---|---|---|
| 赛沃替尼 + 奥希替尼 | SAFFRON（III期） | 2026-08 topline：奥希替尼耐药 MET高 NSCLC，PFS+OS 均优于化疗（HR 未公布） | lung.json › nsclc_egfr › 中/美 二线 pipeline |
| Intismeran（mRNA-4157/V940）+ K药 | INTerpath-001（III期） | 2026-08 达到 RFS 主要终点 + DMFS；详细数据 ESMO 2026-10-24 LBA1 | melanoma.json › BRAF › 中/美 一线 pipeline |

## 修正的已有错误

- gastric.json HER2+：Zanidatamab 公司误写为"礼来"，改为 Jazz / Zymeworks / 百济神州。
- gastric.json HER2阴性：删除误放于此的 Zanidatamab（HER2+ 药物）条目，信息合并到 HER2+ subtype。

## 刻意未更新（需你决定）

- **Sevabertinib（Hyrnuo）HER2突变 NSCLC**：2026-09-09 FDA扩展至一线，NMPA 2026年已批二线。数据里没有"NSCLC HER2突变"subtype，需新建（可用 `scripts/add-subtype.cjs`）。
- **NMPA 2026年7–10月获批**：搜索未找到可靠汇总，**中国侧本次未新增获批**，建议以 NMPA 药品批准公告核对后补充。
- **价格**：新增药物 annual_cost 均为 null（无可靠公开价格，不臆造）。
- **ESMO 2026（10-23~27）**：INTerpath-001、TroFuse-005、HARMONi-GI1 等数据尚未公布，会后应再更新一次。
- 未覆盖的瘤种（胰腺 daraxonrasib、GEP-NET 等）不在现有数据范围内。

## 校验

- `node scripts/validate.cjs` ✅ 全部通过
- `npm run build` ✅ 成功
- `eslint`：17 个原有错误，与本次 JSON 改动无关

---

# 第二轮：非肿瘤病种 + Dashboard 数字检查（2026-10-15）

## 非肿瘤病种更新

| 病种 | 变更 | 依据 |
|---|---|---|
| 银屑病 | 新增 US 一线：**Icotrokinra（Icotyde）**，首个口服 IL-23R 肽，2026-03-18 FDA 批准；中国 pipeline 新增 | ICONIC-ADVANCE 头对头优于 deucravacitinib |
| gMG | **Nipocalimab（Imaavy，2025-04）**、**Inebilizumab（Uplizna，2025-12）** 从 pipeline 移到 US 已上市 | 原数据仍写 "Phase 3 / BLA"，已过时 |
| 特应性皮炎 | Amlitelimab：Phase 3 阳性（COAST-1/2、SHORE，2026-01），准备申报 | 注明 COAST-2 部分 EU 终点未达显著 |
| 溃疡性结肠炎 | Obefazimod：ABTECT 阳性，计划 2026 年底前提交 NDA | Abivax pre-NDA 公告 |
| 多发性硬化 | Tolebrutinib：2025-12 FDA CRL（nrSPMS），复发型 MS III 期未优于特立氟胺 | 原写 "Phase 3" |
| 2 型糖尿病 | 玛仕度肽：2025-09 NMPA 批准 T2D（原写 "Phase 3（中国）"） | 信达公告 |
| 肥胖 | CagriSema（US）：FDA 审评中，预计 2026 Q4 决定 | 2025-12 递交，按标准审评周期推算 |
| 高胆固醇 | 新增 US：**Enlicitide（Lipfendra）**，首个口服 PCSK9，2026-07 FDA 批准；Obicetrapib 状态更新（欧盟 CHMP 积极意见） | CORALreef Lipids LDL-C −57.1% |
| HFrEF | **删除 Aficamten**：它是梗阻性 HCM 药物（2025-12 获批），不适用于 HFrEF | 归类错误 |
| 阿尔茨海默、偏头痛、抑郁 | **无变更**：未找到可核实的 2026-07 以来关键进展 | — |

未采纳：Retatrutide "BLA 推迟到 2027 Q1"只见于第三方网站，未见礼来官方来源，保留原文。

## Dashboard 数字检查：发现并修复的问题

**数据错误**
1. **食管癌（中国）新发 > 患病**：新发 32 万（旧 GLOBOCAN 2020 口径），而患病只有 30 万。按国家癌症中心 2022 数据改为 **22.4 万**。
2. **胃癌（中国）亚型合计 43.5 万 > 实际总数 35.87 万（NCC 2022）**：按原有 HER2+ 比例重算为 HER2+ 7.0 万、HER2− 28.9 万，患病数同步调整。
3. **高胆固醇（中国）患病 3.3 亿**：这是全部血脂异常人群，但该亚型是"高 CV 风险"，按文件自己的注释改为 **8000 万**（与美国 3000 万口径一致）。

**代码 bug**
4. **validate.cjs 漏检**：只检查 JSON 里的 prevalence，而 prevalence 大多放在 supplemental.js，所以第 1 条错误一直没有报出来。已改为检查合并后的值；用旧数据验证，确实能报出该错误。
5. **汇总行 Sales/Patient 口径不一致**：亚型行对慢性病用"患病人数"做分母，疾病/大类/总计行却一律用"新发"。已统一为 ΣTAM / Σ各行实际分母。
6. **HER2-low 患者被重复计数**：HER2-low 是 HR+ 和 TNBC 的子集，乳腺癌小计和总计里患者被加了两次。已在患者数汇总中排除（TAM 仍计入）。
7. **小于 $500 的 Sales/Patient 显示为 "—"**：看起来像缺数据（例如中国总计约 $50/人）。现在小于 $1K 按美元整数显示。

**只标记、未修改（需要你判断口径）**
- **MDD 美国**：新发 = 患病 = 2100 万（两项都填了 12 个月患病率），导致隐含生存 1 年、分母用"新发"；中国则是新发 950 万、患病 9500 万，两边口径不一致。
- **子宫内膜癌"晚期"**：美国新发 6.7 万 ≈ 全部子宫内膜癌发病（晚期约占 25–30%），分母偏大。
- **MS 美国**：患病 100 万 / 新发 1.2 万，隐含生存 83 年；新发可能偏低。
- **黑色素瘤 BRAF（中国）**：新发 1500 例，分母小，Sales/Patient（$28K）明显高于同类。
- **跨病种总计**：T2DM、肥胖、高胆固醇人群高度重叠，总计里的患者数（中国 7.5 亿）是简单相加，不是去重人数。

## 校验
- `validate.cjs` ✅；`npm run build` ✅；本地预览 Dashboard 无 NaN/Infinity/控制台报错；改动文件无新增 lint 问题。
