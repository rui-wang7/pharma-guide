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
