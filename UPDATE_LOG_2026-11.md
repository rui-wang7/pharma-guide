# 数据更新日志 — 2026-11-14

覆盖范围：全部 52 个亚型（新增 1 个）、19 个数据文件。检索截止 2026-11-14。
来源：FDA 新药/适应症批准页、各公司 FY2025 年报与 10-K、ESMO 2026 / AHA 2026 / ASH 2026 摘要、公司新闻稿、NMPA 公告。

## 这次改了什么

| 项目 | 改动前 | 改动后 |
|---|---|---|
| 亚型数 | 51 | 52（新增 HER2 突变 NSCLC） |
| 已获批治疗选项 | 441 | 544，其中 86 个带 🆕 获批标记（`approved`） |
| 在研管线条目 | 232 | 382，其中 381 个带「设计思路 / 进展 / 格局点评」 |
| 产品级销售额 | 无 | `src/data/sales.js`：约 130 个产品的 FY2025 全球 / 美国 / 中国销售额 |
| Dashboard | TAM 来源为 2023–2024 | 20 个亚型 TAM 按 FY2025 实际销售重估；新增「药品年销售额：中美对比」表；脚注更新 |

### 新字段（schema）

- 治疗选项：`approved`（如 `"FDA 2026-10"`，页面显示 🆕 徽章）、`impact`（💡 格局点评）
- 管线：`design`（🧪 设计思路）、`status`（📈 进展，原有字段）、`impact`（💡 格局点评）
- 销售额不写进各 JSON，而是由 `sales.js` 按药名子串匹配，一处维护、全站生效

### 页面

- `DrugCard.jsx`：销售额行（🇺🇸 / 🇨🇳 / 🌐）、获批徽章、格局点评
- `PipelineCard.jsx`：三行洞察；新增「申报 / 审评 / 临床前 / 失败 / 终止」阶段配色
- `Dashboard.jsx`：销售额表（可搜索、按全球 / 美国 / 中国排序）
- `MarketStats.jsx`：**修正原有 bug** —— 中国 TAM 字段单位是十亿元，页面却直接标「亿」，少了 10 倍（如骨髓瘤显示 ¥5亿，实为 ¥50亿）

## 重点新获批（已写入对应亚型）

| 日期 | 药物 | 适应症 | 位置 |
|---|---|---|---|
| 2025-12 | T-DXd + 帕妥珠单抗 | 一线 HER2+ 乳腺癌（DB-09，PFS 40.7 vs 26.9m） | breast › bc_her2pos › 美国新增一线 |
| 2026-02 | 阿可替尼 + 维奈克拉 | 一线 CLL 固定疗程（AMPLIFY） | leukemia › cll |
| 2026-03 | 特立妥单抗 + 达雷妥尤单抗 | R/R MM ≥1 线（MajesTEC-3，HR 0.17） | myeloma › mm |
| 2026-03 | 纳武利尤单抗 + AVD | 一线 cHL | lymphoma › hodgkin |
| 2026 Q1 | 宗格替尼一线 / 康奈非尼三联常规批准 | HER2m NSCLC；BRAF V600E 肠癌 | lung › nsclc_her2m；colorectal › crc_other |
| 2026-04 | Orforglipron（Foundayo） | 肥胖 | metabolic › obesity |
| 2026-05 | Sonrotoclax（Beqalzi） | R/R MCL | lymphoma › mcl |
| 2026-05 | Vepdegestrant（Veppanu） | ESR1m 乳腺癌（首个 PROTAC） | breast › bc_hrpos |
| 2026-05 | T-DXd 新辅助 / 辅助 | 早期 HER2+ 乳腺癌 | breast › bc_her2pos |
| 2026 Q2 | Dato-DXd、戈沙妥珠单抗（± K 药） | 一线 TNBC | breast › bc_tnbc › 美国新增一线 |
| 2026-06 / Q3 / 10 | 卡匹色替、Pluvicto、他拉唑帕利 | mHSPC | prostate › 美国新增 mHSPC 线 |
| 2026-07 | Enlicitide（Lipfendra） | 口服 PCSK9 | cardiovascular › 高胆固醇 |
| 2026-07 / 11 | EV + K 药；度伐利尤 + EV（VOLGA） | 围手术期 MIBC | bladder › 美国新增围手术期线 |
| 2026-09 | Sevabertinib 一线 | HER2m NSCLC | lung › nsclc_her2m |
| 2026-03 / 09 | 周制剂胰岛素 icodec / efsitora | 2 型糖尿病 | metabolic › t2dm |
| 2026-10 | 阿替利珠 + FOLFOX 辅助；多塔利单抗 | dMMR 结肠癌 / 直肠癌 | colorectal › crc_other |
| 2026-10（NMPA） | 巴托利单抗 | 重症肌无力 | immune › gmg |

## 重点临床读出

DeLLphi-305（塔拉妥单抗一线维持 SCLC，OS HR 0.42）、Krascendo 1（divarasib 头对头，PFS HR 0.58）、SAFFRON、PANKU-Lung01（iza-bren，PFS HR 0.40）、INTerpath-001（mRNA 疫苗，RFS HR 0.58）、TroFuse-005（sac-TMT 内膜癌，OS HR 0.68）、KEYNOTE-C93、CLARITY-Gastric01（CLDN18.2 ADC，OS HR 0.47）、CERVINO（etentamig）、Lp(a)HORIZON（pelacarsen，MACE 中性）、REDEFINE-4（CagriSema 未达非劣效）。

阴性 / 撤回也已写入：fianlimab 黑色素瘤、SKYSCRAPER-08、firmonertinib exon20、I-DXd BLA 撤回、Zepzelca 二线撤回、阿达格拉西布 + 西妥昔单抗撤回、HER3-DXd BLA 撤回、REL-1017、EVOKE。

## Dashboard TAM 调整（单位：美国 $B / 中国 十亿元）

| 亚型 | 美国 | 中国 | 依据 |
|---|---|---|---|
| EGFR NSCLC | 5.5 → 4.0 | 18 → 22 | Tagrisso 美国 $3.06B；国产三代 TKI 放量 |
| ALK / KRAS / SCLC | 1.8→1.3 / 0.8→0.5 / 1.0→1.3 | — | Lorbrena、Lumakras、Imdelltra 实际销售 |
| HR+ 乳腺癌 | 14 → 11 | — | Ibrance 下滑，Verzenio / Kisqali 美国销售 |
| CLL / MM / mUC | 6→8 / 18→19 / 2.5→3.0 | CLL 2→4 | Brukinsa、Calquence、Darzalex、Padcev |
| RA / AD / 银屑病 | 28→16 / 8→10 / 15→20 | — | Humira 仿制化；Dupixent、Skyrizi 增长 |
| MS / gMG | 15→13 / 3.5→5.0 | — | 口服药仿制；Vyvgart $4.2B |
| 2 型糖尿病 / 肥胖 / MASH | 40→45 / 35→21.5 / 1.5→1.0 | 肥胖 8→3.5 | 取 FY2025 **实际**销售（Zepbound $13.5B + Wegovy 美国约 $7.7B；Rezdiffra $0.96B） |
| HFrEF / 降脂 / AD / 偏头痛 | 10→7 / 18→5 / 3.0→1.2 / 5→6 | — | Entresto 仿制；降脂只计品牌非他汀药；Leqembi + Kisunla 仍小 |

## ⚠️ 不确定与待核实（请重点复核）

1. **依沃西单抗 FDA 决定**：PDUFA 日就是今天（2026-11-14），检索时尚无结果，暂记为「审评中」。
2. **中国销售额多为估算**：跨国药企基本不披露单品中国销售，页面以「≈」标注；`cn: null` 显示「未披露」，没有编造。
3. **TAM 按适应症拆分是我的判断**，不是直接披露的数字，误差约 ±20%；肥胖美国从 35 降到 21.5 是口径变化（原值更像 2026 年预测），不是市场萎缩。
4. **部分条目来自背景知识、未逐条二次核实**，主要是：
   - 若干 NMPA 获批时间（依沃西一线单药、sac-TMT 的 EGFRm 适应症、宗格替尼、瑞康曲妥珠单抗、司普奇拜单抗、妥拉美替尼、多奈单抗、卡度尼利宫颈癌一线、埃万妥单抗中国获批、维迪西妥 + 特瑞普利 UC）
   - 部分 III 期试验代号（如 HARMONi-GI3 / -BC1 / -8、ROSETTA 编号、FOURLIGHT-3、OptiTROP 编号、CELESTIAL-TNMCL）
   - KEYNOTE-905 与 KEYNOTE-B15 两个围手术期适应症的获批先后
5. **HER2 突变 NSCLC 的流行病学与 TAM**（中国 2 万例 / ¥8亿，美国 5000 例 / $0.3B）为估算。
6. **药价**：新增选项的 `annual_cost_*` 一律留空（null），没有编造价格。

## 本次未做

- **没有对应亚型、因此未收录的 2026 新药**：daraxonrasib（胰腺癌）、baxdrostat（高血压）、asundexian（卒中预防）、tavapadon（帕金森）、atacicept（IgAN）、rusfertide（PV）、oveporexton（发作性睡病）、brepocitinib（皮肌炎）、bepirovirsen（乙肝）、belzutifan 系列（肾癌）、pimicotinib（TGCT）、头颈癌、卵巢癌。需要的话可以新增亚型。
- `CLINICAL_ENDPOINTS` / `PIPELINE_ENDPOINTS`（supplemental.js）未扩充——新药的关键数据已直接写在卖点和进展里。
- 脚本已知 bug 未修（`ai-update` 的 `appendEndpoint` 会写坏 supplemental.js；`add-subtype` 插入标记不匹配；硬编码 `/usr/local/bin/node`；`find-subtype` 查不到非肿瘤亚型）。
- 16 处空管线全部是基础治疗线（MTX、NSAIDs、二甲双胍等），属正常。

## 校验

- `node scripts/validate.cjs`：✅ 全部通过
- `npm run build`：✅ 通过
- `eslint`：18 个问题，与改动前完全一致（均为原有，非本次引入）
- 浏览器实测：指南页（骨髓瘤）销售额行、获批徽章、管线三行洞察正常；Dashboard 图表、销售额表、脚注正常；控制台无报错
