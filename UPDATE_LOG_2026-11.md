# 数据更新日志 — 2026-11-14

覆盖范围：全部 52 个亚型（新增 1 个）、19 个数据文件。检索截止 2026-11-14。
来源：FDA 新药/适应症批准页、各公司 FY2025 年报与 10-K、ESMO 2026 / AHA 2026 / ASH 2026 摘要、公司新闻稿、NMPA 公告。

## 这次改了什么

| 项目 | 改动前 | 改动后 |
|---|---|---|
| 亚型数 | 51 | 52（新增 HER2 突变 NSCLC） |
| 已获批治疗选项 | 441 | 600，其中 115 个带 🆕 获批标记（`approved`） |
| 在研管线条目 | 232 | 340，全部带「设计思路 / 进展 / 格局点评」（已获批药物与格局评论已从管线移出，见下方 Audit） |
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
| 2026-02 | 宗格替尼一线（加速）/ 康奈非尼三联常规批准 | HER2m NSCLC；BRAF V600E 肠癌 | lung › nsclc_her2m；colorectal › crc_other › 美国一线（BRAF V600E） |
| 2026-04 | Orforglipron（Foundayo） | 肥胖 | metabolic › obesity |
| 2026-05 | Sonrotoclax（Beqalzi） | R/R MCL | lymphoma › mcl |
| 2026-05 | Vepdegestrant（Veppanu） | ESR1m 乳腺癌（首个 PROTAC） | breast › bc_hrpos |
| 2026-05-15 | T-DXd 新辅助 / 辅助 | 早期 HER2+ 乳腺癌（中国：新辅助 2026-03 附条件、辅助 2026-09） | breast › bc_her2pos |
| 2026-05-22 / 06-24 | Dato-DXd；戈沙妥珠单抗（± K 药） | 一线 TNBC | breast › bc_tnbc › 美国一线 |
| 2026-06-12 / 07-31 / 10 | 卡匹色替、Pluvicto、他拉唑帕利 | mHSPC | prostate › 美国 mHSPC 线 |
| 2026-07 | Enlicitide（Lipfendra） | 口服 PCSK9 | cardiovascular › 高胆固醇 |
| 2025-11-21 / 2026-07-10 | EV + K 药（不适合顺铂 → 全人群） | 围手术期 MIBC。**更正**：度伐利尤 + EV（VOLGA）尚未获批（sBLA 优先审评，预计 2026 Q4 决定），已移回管线 | bladder › 美国围手术期线 |
| 2026-09 | Sevabertinib 一线 | HER2m NSCLC | lung › nsclc_her2m |
| 2026-03-26 / 09-24 | 周制剂胰岛素 icodec / efsitora | 2 型糖尿病 | metabolic › t2dm |
| 2026-10-08 / 10-19 | 阿替利珠 + FOLFOX 辅助；多塔利单抗（加速） | III 期 dMMR 结肠癌 / 局部晚期 dMMR 直肠癌 | colorectal › crc_other › 美国新增早期线 |
| 2026（NMPA，具体日期未核实） | 巴托利单抗 | 重症肌无力 | immune › gmg |

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

## 🔍 全库 Audit（2026-11-15）

起因：Moderna 的个体化 mRNA 疫苗（intismeran）是术后**辅助**治疗，却被放在美国「一线治疗（转移性）」下。据此对 52 个亚型、209 条治疗线、600 个选项、340 条管线做了一次全库核查。

### 为什么会放错

1. **没有合适的线就塞进最近的线**。美国 BRAF 黑色素瘤当时只有「一线 / 二线」，没有辅助线；我没有新建辅助线，而是把条目放进了一线。同类问题共 10 处（如 MATTERHORN 围手术期方案放在胃癌 / 食管癌一线、ATOMIC 辅助方案和多塔利单抗直肠癌方案放在转移性结直肠癌一线、卡博替尼二线放在甲状腺癌一线）。
2. **中美两边复制同一条目**，没有分别核对两国的获批状态。结果是美国已批、中国未批的药被列为中国选项（PATINA 方案、图卡替尼、卡博替尼 MTC），或中国早已获批的药仍挂在中国管线里（埃万妥单抗、Pluvicto、宗格替尼一线、EV + K 药等）。
3. **把管线区当成备注区**，写入了已上市药物和格局评论（「Humira 生物类似药替代」「口服 gepant 竞争格局」等），共约 40 条。
4. **部分事实凭记忆写入**，没有逐条检索核实（见下方更正表）。
5. **校验脚本只查流行病学数字**，不查条目放在哪里，所以这些错误都能通过 `validate.cjs`。

### 怎么修的

- **新增 13 条治疗线**：美国 — 可切除 NSCLC、黑色素瘤辅助、dMMR 结直肠癌早期、BRAF V600E 肠癌一线、胃癌围手术期、食管癌围手术期 / 辅助、甲状腺癌二线、特应性皮炎外用；中国 — dMMR 结直肠癌早期、BRAF V600E 肠癌一线、胃癌围手术期、前列腺癌 mHSPC、肢端 / 黏膜黑色素瘤辅助。
- **约 45 条已获批药物从管线移到选项**，并写明获批时间与适应症；**约 12 条格局评论**并入对应药物的点评后从管线删除。
- **Intismeran**：美国条目移到新建的辅助线；补入 NSCLC 辅助 III 期（INTerpath-002，写在美国可切除 NSCLC 线）和膀胱癌（INTerpath-005 / -011，写在美国围手术期线）；肾癌 II 期（INTerpath-004）因库内没有肾癌亚型，只写在黑色素瘤条目的进展里。
- **新增 `scripts/audit.cjs`**，7 条规则：R1 地区不符、R2 治疗阶段不符、R3 已获批仍在管线、R4 重复、R5 份额合计超 100%、R6 缺字段、R7 同一药获批时间冲突。修复前 56 个错误 / 41 个警告，修复后 **0 / 0**。以后每次更新都应运行 `node scripts/audit.cjs`。
- **56 个新增选项的市场份额数字**没有来源，已改为「新获批」或「未统计」。

### 事实更正（均经网络检索核实）

| 条目 | 原写法 | 更正 |
|---|---|---|
| 度伐利尤 + EV（VOLGA） | FDA 2026-11-13 已批 | **未获批**：sBLA 优先审评，预计 2026 Q4 决定 |
| Anktiva 乳头状 NMIBC | FDA 2026-10-14 已批 | **未获批**：sBLA 审评中，PDUFA 2027-01-06（原 CIS 适应症 2024-04 获批） |
| HRS9531（恒瑞） | 预计 2026 年中国获批 | NDA 2025-09 受理，截至 2026-11 未见获批 |
| 塞普替尼 MTC 常规批准 | FDA 2026 Q3 | FDA 2024-09-27 |
| EV + K 药围手术期 | FDA 2026-07 | 不适合顺铂 2025-11-21；全人群 2026-07-10 |
| 纳武利尤 + AVD | 卖点写「FDA 2024 批准」 | FDA 2026-03-20 |
| Inqovi + 维奈克拉 | FDA 2026-06 | FDA 2026-05-13 |
| Efsitora | FDA 2026-09-23 | FDA 2026-09-24 |
| 塔拉妥单抗（中国） | NMPA 2026-05 | NMPA 2026-04-10 |
| CEPHEUS（D-VRd 非移植） | FDA 2026 Q1 批准 | 获批未能核实，改为「III 期阳性」 |
| CagriSema REDEFINE-4 | 20.2% vs 23.6% | 疗效估计目标 23.0% vs 25.5% |
| 多塔利单抗直肠癌 | 常规批准 | 加速批准（AZUR-1，N=154） |
| 卡米司群、RP1、宗格替尼一线、sevabertinib 一线 | 未注明 | 均为加速批准 |
| 膀胱癌中国一线 | 选项名「帕博利珠 + 仑伐替尼」/ 英文却是 EV-302 | 删除；EV + K 药（NMPA 2025-01）与维迪西妥 + 特瑞普利（NMPA 2026-05）列为选项 |
| 呋喹替尼 + 紫杉醇（胃癌二线） | 已获批语气 | NDA 2023-04 受理，未见获批公告（OS 未达显著） |
| 卡博替尼（中国 MTC） | 中国选项 | 中国大陆未见获批，移到管线；补入安罗替尼、普拉替尼 |
| 西达基奥仑赛（中国） | 「赛凯泽，NMPA 2023，中国首个」 | 商品名卡卫荻，NMPA 2024-08；国内首个 BCMA CAR-T 是伊基奥仑赛（2023-06） |
| 贝福替尼 | 厂商恒瑞、商品名贝美纳、对照吉非替尼 | 贝达 / 益方，赛美纳，对照埃克替尼 |
| 卡度尼利单抗（宫颈癌二线） | 「卡度利尼（依达可来）」「授权 Summit」 | 卡度尼利单抗（开坦尼），AK104-201 |
| 芦康沙妥珠单抗（TNBC） | 试验 EVER-132-001、合作方阿斯利康 | OptiTROP-Breast01、默沙东，NMPA 2024-11 |
| 替雷利珠单抗食管癌 | FDA 2023 批准 | FDA 2024-03（二线）/ 2025-03（一线，PD-L1≥1） |
| 商品名 | 乌帕替尼「瑞纳卡」、氘可来昔替尼「苯环喹诺」、伏美替尼「Furclairza」、安罗替尼「Foretinib」 | 瑞福、颂狄多、Ivesa、Focus V |
| 销售额匹配 | 卡瑞利珠单抗 → Ultomiris；多奈哌齐 → Kisunla；糖尿病司美格鲁肽 → Wegovy | 已修正匹配词 |

### 仍然存在的限制（如实说明）

- **逐条检索核实过的**：所有带获批标记的 2025–2026 年新批准（FDA 与 NMPA）、全部「中国已批 / 美国已批」的地区归属、上表各项。
- **核实不到、已改为保守表述的**：约 20 条管线的中国状态标为「中国状态未核实」；古塞奇尤单抗中国 CD / UC 适应症（单一来源）、泊那替尼中国获批（单一来源）、巴托利单抗 / 索托克拉 / 莫妥珠单抗 / 阿思尼布一线的中国获批**日期**未能确认，只写「已获批」。
- **没有逐条复核的**：第一轮写入的 III 期管线进展文字（会议摘要编号、PDUFA 日期等）；原库沿用下来的约 440 个老选项的药价、市场份额、卖点——这次只做了结构检查和抽查，抽查中发现并改正了上表后半部分的错误，剩余部分可能还有类似问题。
- 市场份额是估算值，原库就没有来源；合计超过 100% 的线已处理，但数字本身不应当作精确数据引用。

## ⚠️ 不确定与待核实（请重点复核）

1. **依沃西单抗 FDA 决定**：PDUFA 日为 2026-11-14，11-15 复查仍未检索到结果，暂记为「审评中」。
2. **中国销售额多为估算**：跨国药企基本不披露单品中国销售，页面以「≈」标注；`cn: null` 显示「未披露」，没有编造。
3. **TAM 按适应症拆分是我的判断**，不是直接披露的数字，误差约 ±20%；肥胖美国从 35 降到 21.5 是口径变化（原值更像 2026 年预测），不是市场萎缩。
4. **第一轮中凭背景知识写入的 NMPA 获批时间等，已在 11-15 的 Audit 中逐条检索核实或改为保守表述**，详见上方「全库 Audit」。仍未复核的是部分 III 期试验代号（如 HARMONi-GI3 / -BC1 / -8、ROSETTA 编号、FOURLIGHT-3、CELESTIAL-TNMCL）。
5. **HER2 突变 NSCLC 的流行病学与 TAM**（中国 2 万例 / ¥8亿，美国 5000 例 / $0.3B）为估算。
6. **药价**：新增选项的 `annual_cost_*` 一律留空（null），没有编造价格。

## 本次未做

- **没有对应亚型、因此未收录的 2026 新药**：daraxonrasib（胰腺癌）、baxdrostat（高血压）、asundexian（卒中预防）、tavapadon（帕金森）、atacicept（IgAN）、rusfertide（PV）、oveporexton（发作性睡病）、brepocitinib（皮肌炎）、bepirovirsen（乙肝）、belzutifan 系列（肾癌）、pimicotinib（TGCT）、头颈癌、卵巢癌。需要的话可以新增亚型。
- `CLINICAL_ENDPOINTS` / `PIPELINE_ENDPOINTS`（supplemental.js）未扩充——新药的关键数据已直接写在卖点和进展里。
- 脚本已知 bug 未修（`ai-update` 的 `appendEndpoint` 会写坏 supplemental.js；`add-subtype` 插入标记不匹配；硬编码 `/usr/local/bin/node`；`find-subtype` 查不到非肿瘤亚型）。
- 16 处空管线全部是基础治疗线（MTX、NSAIDs、二甲双胍等），属正常。

## 校验

- `node scripts/validate.cjs`：✅ 全部通过
- `node scripts/audit.cjs`：✅ 0 个错误 / 0 个警告（修复前 56 / 41）
- `npm run build`：✅ 通过
- `eslint`：18 个问题，与改动前完全一致（均为原有，非本次引入）
- 浏览器实测：指南页（骨髓瘤）销售额行、获批徽章、管线三行洞察正常；Dashboard 图表、销售额表、脚注正常；控制台无报错
