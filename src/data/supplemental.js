/**
 * Supplemental data overlay:
 * 1. EU market data + survival stats per subtype
 * 2. Clinical endpoints (OS/PFS/ORR) per drug, keyed by drug name_cn
 *
 * EU currency: EUR billion (€B)
 * Survival: median_survival_years (treated, not untreated)
 */

// ─── EU + SURVIVAL DATA ────────────────────────────────────────────────────
// keyed by subtype id
// EU TAM source: EvaluatePharma World Preview 2024; EFPIA Pharmaceutical Data 2023
// EU prices are ~40-60% of US list prices; ~15-25% of US net after rebates
export const EU_SURVIVAL = {
  // ── LUNG ──
  nsclc_egfr: {
    eu: { annual_new_cases: 60000, tam_eur_bn: 3.0, prevalence: 180000 },
    china: { prevalence: 700000, median_survival_years: 3.2 },
    us:    { prevalence: 240000, median_survival_years: 4.1 },
  },
  nsclc_alk: {
    eu: { annual_new_cases: 10000, tam_eur_bn: 1.0, prevalence: 35000 },
    china: { prevalence: 150000, median_survival_years: 5.5 },
    us:    { prevalence: 38000,  median_survival_years: 6.2 },
  },
  nsclc_kras: {
    eu: { annual_new_cases: 22000, tam_eur_bn: 0.4, prevalence: 60000 },
    china: { prevalence: 80000,  median_survival_years: 1.8 },
    us:    { prevalence: 75000,  median_survival_years: 2.2 },
  },
  nsclc_wildtype: {
    eu: { annual_new_cases: 80000, tam_eur_bn: 5.0, prevalence: 180000 },
    china: { prevalence: 600000, median_survival_years: 1.6 },
    us:    { prevalence: 200000, median_survival_years: 2.0 },
  },
  sclc: {
    eu: { annual_new_cases: 20000, tam_eur_bn: 0.6, prevalence: 40000 },
    china: { prevalence: 180000, median_survival_years: 0.8 },
    us:    { prevalence: 45000,  median_survival_years: 1.0 },
  },
  // ── BREAST ──
  bc_her2pos: {
    eu: { annual_new_cases: 40000, tam_eur_bn: 5.0, prevalence: 180000 },
    china: { prevalence: 280000, median_survival_years: 5.2 },
    us:    { prevalence: 200000, median_survival_years: 6.8 },
  },
  bc_hrpos: {
    eu: { annual_new_cases: 120000, tam_eur_bn: 8.0, prevalence: 650000 },
    china: { prevalence: 600000, median_survival_years: 6.5 },
    us:    { prevalence: 700000, median_survival_years: 8.2 },
  },
  bc_tnbc: {
    eu: { annual_new_cases: 28000, tam_eur_bn: 2.0, prevalence: 90000 },
    china: { prevalence: 130000, median_survival_years: 2.5 },
    us:    { prevalence: 110000, median_survival_years: 3.1 },
  },
  bc_her2low: {
    eu: { annual_new_cases: 100000, tam_eur_bn: 2.5, prevalence: 500000 },
    china: { prevalence: 500000, median_survival_years: 4.8 },
    us:    { prevalence: 550000, median_survival_years: 5.5 },
  },
  // ── COLORECTAL ──
  crc_ras_wt: {
    eu: { annual_new_cases: 60000, tam_eur_bn: 3.0, prevalence: 180000 },
    china: { prevalence: 400000, median_survival_years: 2.5 },
    us:    { prevalence: 200000, median_survival_years: 3.2 },
  },
  // ── GASTRIC ──
  gastric_her2pos: {
    eu: { annual_new_cases: 6000, tam_eur_bn: 0.8, prevalence: 12000 },
    china: { prevalence: 60000,  median_survival_years: 1.4 },
    us:    { prevalence: 8000,   median_survival_years: 1.8 },
  },
  // ── CERVICAL ──
  cervical_advanced: {
    eu: { annual_new_cases: 33000, tam_eur_bn: 0.7, prevalence: 60000 },
    china: { prevalence: 200000, median_survival_years: 1.8 },
    us:    { prevalence: 22000,  median_survival_years: 2.5 },
  },
  // ── PROSTATE ──
  prostate_crpc: {
    eu: { annual_new_cases: 25000, tam_eur_bn: 5.5, prevalence: 120000 },
    china: { prevalence: 80000,  median_survival_years: 3.5 },
    us:    { prevalence: 150000, median_survival_years: 4.5 },
  },
  // ── LIVER ──
  hcc_advanced: {
    eu: { annual_new_cases: 55000, tam_eur_bn: 1.5, prevalence: 80000 },
    china: { prevalence: 400000, median_survival_years: 1.1 },
    us:    { prevalence: 55000,  median_survival_years: 1.8 },
  },
  // ── BLADDER ──
  bladder_metastatic: {
    eu: { annual_new_cases: 55000, tam_eur_bn: 1.5, prevalence: 100000 },
    china: { prevalence: 80000,  median_survival_years: 1.5 },
    us:    { prevalence: 60000,  median_survival_years: 2.2 },
  },
  // ── ESOPHAGEAL ──
  esophageal_advanced: {
    eu: { annual_new_cases: 38000, tam_eur_bn: 0.8, prevalence: 50000 },
    china: { prevalence: 300000, median_survival_years: 1.0 },
    us:    { prevalence: 25000,  median_survival_years: 1.4 },
  },
  // ── THYROID ──
  thyroid_rai_refractory: {
    eu: { annual_new_cases: 5000, tam_eur_bn: 0.4, prevalence: 25000 },
    china: { prevalence: 80000,  median_survival_years: 5.0 },
    us:    { prevalence: 30000,  median_survival_years: 6.0 },
  },
  medullary_thyroid: {
    eu: { annual_new_cases: 800, tam_eur_bn: 0.15, prevalence: 4000 },
    china: { prevalence: 8000,  median_survival_years: 4.5 },
    us:    { prevalence: 3000,  median_survival_years: 5.5 },
  },
  // ── ENDOMETRIAL ──
  endometrial_advanced: {
    eu: { annual_new_cases: 90000, tam_eur_bn: 1.2, prevalence: 130000 },
    china: { prevalence: 60000,  median_survival_years: 2.8 },
    us:    { prevalence: 90000,  median_survival_years: 3.5 },
  },
  // ── IMMUNE ──
  ra_moderate_severe: {
    eu: { annual_new_cases: 200000, tam_eur_bn: 16.0, prevalence: 2800000 },
    china: { prevalence: 5000000, median_survival_years: null },
    us:    { prevalence: 1500000, median_survival_years: null },
  },
  ad_moderate_severe: {
    eu: { annual_new_cases: 2000000, tam_eur_bn: 4.5, prevalence: 12000000 },
    china: { prevalence: 20000000, median_survival_years: null },
    us:    { prevalence: 15000000, median_survival_years: null },
  },
  psoriasis_moderate_severe: {
    eu: { annual_new_cases: 700000, tam_eur_bn: 9.0, prevalence: 6000000 },
    china: { prevalence: 2000000, median_survival_years: null },
    us:    { prevalence: 2000000, median_survival_years: null },
  },
  crohns_disease: {
    eu: { annual_new_cases: 60000, tam_eur_bn: 8.0, prevalence: 800000 },
    china: { prevalence: 150000, median_survival_years: null },
    us:    { prevalence: 700000, median_survival_years: null },
  },
  // ── METABOLIC ──
  t2dm_standard: {
    eu: { annual_new_cases: 2500000, tam_eur_bn: 20.0, prevalence: 32000000 },
    china: { prevalence: 140000000, median_survival_years: null },
    us:    { prevalence: 37000000, median_survival_years: null },
  },
  obesity_pharmacotherapy: {
    eu: { annual_new_cases: 6000000, tam_eur_bn: 6.0, prevalence: 55000000 },
    china: { prevalence: 250000000, median_survival_years: null },
    us:    { prevalence: 100000000, median_survival_years: null },
  },
  mash_fibrosis: {
    eu: { annual_new_cases: 2000000, tam_eur_bn: 0.5, prevalence: 12000000 },
    china: { prevalence: 30000000, median_survival_years: null },
    us:    { prevalence: 16000000, median_survival_years: null },
  },
  // ── CARDIOVASCULAR ──
  hfref: {
    eu: { annual_new_cases: 700000, tam_eur_bn: 6.0, prevalence: 6000000 },
    china: { prevalence: 8900000, median_survival_years: 5.0 },
    us:    { prevalence: 6700000, median_survival_years: 5.5 },
  },
  hypercholesterolemia_high_cv_risk: {
    eu: { annual_new_cases: 4000000, tam_eur_bn: 10.0, prevalence: 80000000 },
    china: { prevalence: 330000000, median_survival_years: null },
    us:    { prevalence: 30000000, median_survival_years: null },
  },
  // ── NEURO ──
  alzheimers_early: {
    eu: { annual_new_cases: 350000, tam_eur_bn: 1.0, prevalence: 8000000 },
    china: { prevalence: 10500000, median_survival_years: 8.0 },
    us:    { prevalence: 7000000, median_survival_years: 9.0 },
  },
  migraine_chronic: {
    eu: { annual_new_cases: 3000000, tam_eur_bn: 2.5, prevalence: 40000000 },
    china: { prevalence: 100000000, median_survival_years: null },
    us:    { prevalence: 39000000, median_survival_years: null },
  },
  mdd_standard: {
    eu: { annual_new_cases: 12000000, tam_eur_bn: 6.0, prevalence: 40000000 },
    china: { prevalence: 95000000, median_survival_years: null },
    us:    { prevalence: 21000000, median_survival_years: null },
  },
};

// ─── CLINICAL ENDPOINTS ───────────────────────────────────────────────────
// keyed by drug name_cn (exact match). Each entry can have:
//   { os, os_hr, pfs, pfs_hr, orr, trial, note }
// All values are strings for display flexibility. null = not applicable / not reported.
export const CLINICAL_ENDPOINTS = {
  // ── NSCLC EGFR ──
  '奥希替尼（泰瑞沙）': { os: '38.6m', os_hr: '0.80', pfs: '18.9m', pfs_hr: '0.46', orr: '80%', trial: 'FLAURA' },
  '阿美替尼（阿美乐）': { os: null, os_hr: null, pfs: '19.3m', pfs_hr: '0.48', orr: '74%', trial: 'AENEAS' },
  '伏美替尼（艾弗沙）': { os: null, os_hr: null, pfs: '20.8m', pfs_hr: '0.44', orr: '77%', trial: 'FURLONG' },
  'Amivantamab + Lazertinib': { os: null, os_hr: '0.75', pfs: '23.7m', pfs_hr: '0.70', orr: '73%', trial: 'MARIPOSA' },
  // ── NSCLC ALK ──
  '阿来替尼（安圣莎）': { os: null, os_hr: '0.67', pfs: '34.8m', pfs_hr: '0.43', orr: '83%', trial: 'ALEX' },
  '洛拉替尼（乐启尼）': { os: null, os_hr: '0.72', pfs: 'NR(>60m)', pfs_hr: '0.27', orr: '76%', trial: 'CROWN' },
  '布加替尼（卫艾宁）': { os: null, os_hr: '0.86', pfs: '24.0m', pfs_hr: '0.49', orr: '74%', trial: 'ALTA-1L' },
  // ── NSCLC KRAS ──
  '索托拉西布（Lumakras）': { os: '10.6m', os_hr: '1.01', pfs: '5.6m', pfs_hr: '0.66', orr: '28%', trial: 'CodeBreaK 200' },
  '阿达格拉西布（Krazati）': { os: '14.6m', os_hr: null, pfs: '6.5m', pfs_hr: null, orr: '43%', trial: 'KRYSTAL-1' },
  // ── NSCLC IO ──
  '帕博利珠单抗（可瑞达）单药': { os: 'NR', os_hr: '0.62', pfs: '10.3m', pfs_hr: '0.50', orr: '45%', trial: 'KEYNOTE-024' },
  '帕博利珠单抗 + 培美曲塞 + 铂类（非鳞）': { os: '22.0m', os_hr: '0.56', pfs: '9.0m', pfs_hr: '0.48', orr: '48%', trial: 'KEYNOTE-189' },
  '卡瑞利珠单抗（艾瑞卡）+ 化疗': { os: '15.9m', os_hr: '0.76', pfs: '8.5m', pfs_hr: '0.60', orr: '45%', trial: 'CameL' },
  '信迪利单抗（达伯舒）+ IBI305 + 化疗': { os: '25.5m', os_hr: '0.63', pfs: '8.9m', pfs_hr: '0.48', orr: '51%', trial: 'ORIENT-11' },
  '替雷利珠单抗（百泽安）单药': { os: '17.2m', os_hr: '0.64', pfs: '9.8m', pfs_hr: '0.52', orr: '22%', trial: 'RATIONALE-303' },
  '替雷利珠单抗 + 化疗': { os: '17.2m', os_hr: '0.66', pfs: '7.6m', pfs_hr: '0.52', orr: '57%', trial: 'RATIONALE-304/307' },
  // ── SCLC ──
  '阿替利珠单抗（泰圣奇）+ EP方案': { os: '12.3m', os_hr: '0.70', pfs: '5.2m', pfs_hr: '0.77', orr: '60%', trial: 'IMpower133' },
  '度伐利尤单抗 + EP方案': { os: '13.0m', os_hr: '0.73', pfs: '5.1m', pfs_hr: '0.78', orr: '68%', trial: 'CASPIAN' },
  // ── BREAST HER2+ ──
  'T-DXd（优赫得）': { os: '29.0m', os_hr: '0.64', pfs: '28.8m', pfs_hr: '0.33', orr: '79%', trial: 'DESTINY-Breast03' },
  'T-DM1（赫赛莱）': { os: '30.9m', os_hr: '0.68', pfs: '9.6m', pfs_hr: '0.50', orr: '44%', trial: 'EMILIA' },
  '图卡替尼（达尔克）+ 曲妥珠单抗 + 卡培他滨': { os: '21.9m', os_hr: '0.66', pfs: '7.8m', pfs_hr: '0.54', orr: '41%', trial: 'HER2CLIMB' },
  // ── BREAST HR+ ──
  '哌柏西利（爱博新）+ 来曲唑/氟维司群': { os: '53.9m', os_hr: '0.81', pfs: '27.6m', pfs_hr: '0.55', orr: '42%', trial: 'PALOMA-2/3' },
  '瑞波西利（利柏恩）+ 内分泌治疗': { os: '63.9m', os_hr: '0.76', pfs: '23.8m', pfs_hr: '0.55', orr: '41%', trial: 'MONALEESA-2/7' },
  '阿贝西利（唯择）+ 内分泌治疗': { os: 'NR', os_hr: '0.75', pfs: '28.2m', pfs_hr: '0.54', orr: '48%', trial: 'MONARCH-2/3' },
  // ── BREAST TNBC ──
  '帕博利珠单抗 + 化疗（nab-紫杉醇/吉西他滨+卡铂）': { os: '23.0m', os_hr: '0.73', pfs: '9.7m', pfs_hr: '0.65', orr: '53%', trial: 'KEYNOTE-355 (CPS≥10)' },
  '戈沙妥珠单抗（Trodelvy）': { os: '12.1m', os_hr: '0.48', pfs: '5.6m', pfs_hr: '0.41', orr: '35%', trial: 'ASCENT' },
  '芦康沙妥单抗（SKB264）': { os: null, os_hr: null, pfs: null, pfs_hr: null, orr: '46.6%', trial: 'EVER-132-001' },
  // ── CRC ──
  'FOLFOX/FOLFIRI + 西妥昔单抗（爱必妥）': { os: '35.4m', os_hr: '0.77', pfs: '12.3m', pfs_hr: '0.65', orr: '68%', trial: 'PARADIGM (left-sided)' },
  // ── GASTRIC ──
  '曲妥珠单抗 + 纳武利尤单抗（欧狄沃）+ 化疗': { os: '15.0m', os_hr: '0.70', pfs: '7.8m', pfs_hr: '0.68', orr: '62%', trial: 'CheckMate-811 (HER2+ CPS≥5)' },
  '曲妥珠单抗 + 化疗（XELOX/FOLFOX）': { os: '13.8m', os_hr: '0.74', pfs: '6.7m', pfs_hr: '0.71', orr: '47%', trial: 'ToGA' },
  // ── CERVICAL ──
  '帕博利珠单抗 + 化疗 ± 贝伐珠单抗（CPS≥1）': { os: '28.6m', os_hr: '0.67', pfs: '10.4m', pfs_hr: '0.62', orr: '68%', trial: 'KEYNOTE-826' },
  '卡度利尼（依达可来）': { os: null, os_hr: null, pfs: null, pfs_hr: null, orr: '33.3%', trial: 'COMPASSION-16 (2L)' },
  // ── PROSTATE ──
  '恩扎鲁胺（安可坦）': { os: '35.3m', os_hr: '0.73', pfs: '20.0m', pfs_hr: '0.32', orr: null, trial: 'PREVAIL' },
  '奥拉帕利（BRCA1/2突变）': { os: '19.1m', os_hr: '0.69', pfs: '7.4m', pfs_hr: '0.34', orr: '33%', trial: 'PROfound (BRCA1/2)' },
  // ── LIVER ──
  '阿替利珠单抗（泰圣奇）+ 贝伐珠单抗（安维汀）': { os: '19.2m', os_hr: '0.66', pfs: '6.8m', pfs_hr: '0.59', orr: '30%', trial: 'IMbrave150' },
  '卡瑞利珠单抗（艾瑞卡）+ 阿帕替尼（艾坦）': { os: '22.1m', os_hr: '0.62', pfs: '5.6m', pfs_hr: '0.52', orr: '25%', trial: 'CARES-310' },
  '信迪利单抗（达伯舒）+ 贝伐珠单抗类似物（达攸同）': { os: 'NR', os_hr: '0.57', pfs: '4.6m', pfs_hr: '0.56', orr: '21%', trial: 'ORIENT-32' },
  '仑伐替尼（乐卫玛）': { os: '13.6m', os_hr: '0.92 (non-inferior)', pfs: '7.3m', pfs_hr: '0.65', orr: '24%', trial: 'REFLECT' },
  // ── BLADDER ──
  '帕博利珠单抗（可瑞达）': { os: '10.3m', os_hr: '0.73', pfs: '2.1m', pfs_hr: '0.96', orr: '21%', trial: 'KEYNOTE-045' },
  '厄达非替尼（Balversa，FGFR2/3突变）': { os: '12.1m', os_hr: '0.64', pfs: '5.6m', pfs_hr: '0.58', orr: '40%', trial: 'THOR (FGFR2/3+)' },
  // ── ESOPHAGEAL ──
  '纳武利尤单抗 + 化疗（ESCC/EAC）': { os: '13.2m', os_hr: '0.74', pfs: '5.8m', pfs_hr: '0.65', orr: '47%', trial: 'CheckMate-648' },
  '帕博利珠单抗 + 化疗（ESCC/EAC）': { os: '12.4m', os_hr: '0.73', pfs: '6.3m', pfs_hr: '0.65', orr: '45%', trial: 'KEYNOTE-590' },
  '卡瑞利珠单抗 + 化疗': { os: '15.3m', os_hr: '0.70', pfs: '6.9m', pfs_hr: '0.56', orr: '55%', trial: 'ESCORT-1st' },
  '替雷利珠单抗 + 化疗': { os: '17.2m', os_hr: '0.66', pfs: '7.3m', pfs_hr: '0.62', orr: '63%', trial: 'RATIONALE-306' },
  // ── THYROID ──
  '仑伐替尼（乐卫玛，甲状腺）': { os: null, os_hr: '0.73', pfs: '18.3m', pfs_hr: '0.21', orr: '65%', trial: 'SELECT' },
  '索拉非尼（多吉美）': { os: null, os_hr: '0.80', pfs: '10.8m', pfs_hr: '0.59', orr: '12%', trial: 'DECISION' },
  // ── ENDOMETRIAL ──
  '帕博利珠单抗 + 仑伐替尼（pMMR）': { os: '18.3m', os_hr: '0.65', pfs: '7.2m', pfs_hr: '0.60', orr: '32%', trial: 'KEYNOTE-775 (pMMR)' },
  '多塔利单抗（Jemperli）+ 化疗': { os: null, os_hr: '0.32 (dMMR)', pfs: null, pfs_hr: '0.28 (dMMR)', orr: '69%', trial: 'RUBY (dMMR)' },
  // ── RA ──
  '阿达木单抗（修美乐）': { os: null, os_hr: null, pfs: null, pfs_hr: null, orr: 'ACR50: 36%', trial: 'ARMADA' },
  'Upadacitinib（瑞纳卡）': { os: null, os_hr: null, pfs: null, pfs_hr: null, orr: 'ACR50: 45%', trial: 'SELECT-COMPARE' },
  '巴瑞替尼（艾乐明）': { os: null, os_hr: null, pfs: null, pfs_hr: null, orr: 'ACR50: 40%', trial: 'RA-BEAM' },
  // ── AD ──
  '度普利尤单抗（达必妥）': { os: null, os_hr: null, pfs: null, pfs_hr: null, orr: 'IGA 0/1: 39%', trial: 'LIBERTY AD SOLO 1&2' },
  'Upadacitinib（瑞纳卡，AD）': { os: null, os_hr: null, pfs: null, pfs_hr: null, orr: 'IGA 0/1: 40%', trial: 'Measure Up 1&2' },
  // ── PSORIASIS ──
  '司库奇尤单抗（可善挺）': { os: null, os_hr: null, pfs: null, pfs_hr: null, orr: 'PASI90: 68%', trial: 'ERASURE/FIXTURE' },
  '古赛奇尤单抗（特诺雅）': { os: null, os_hr: null, pfs: null, pfs_hr: null, orr: 'PASI90: 73%', trial: 'VOYAGE 1&2' },
  // ── T2DM ──
  '司美格鲁肽（诺和泰/wegovy）': { os: null, os_hr: '0.80 (MACE)', pfs: null, pfs_hr: null, orr: 'HbA1c: -1.5%', trial: 'SUSTAIN-6' },
  '达格列净（安达唐）': { os: null, os_hr: '0.83 (CV death)', pfs: null, pfs_hr: null, orr: 'HbA1c: -0.9%', trial: 'DAPA-HF / DECLARE' },
  // ── OBESITY ──
  '司美格鲁肽2.4mg（诺和盈）': { os: null, os_hr: '0.80 (MACE/SELECT)', pfs: null, pfs_hr: null, orr: 'Weight: -14.9%', trial: 'STEP-1 / SELECT' },
  '替西帕肽4mg/8mg/12mg': { os: null, os_hr: null, pfs: null, pfs_hr: null, orr: 'Weight: -20.9%', trial: 'SURMOUNT-1' },
  // ── HF ──
  'ARNI：沙库巴曲缬沙坦（诺欣妥）': { os: null, os_hr: '0.84 (CV death+HF hosp)', pfs: null, pfs_hr: null, orr: null, trial: 'PARADIGM-HF' },
  '达格列净（安达唐，心衰）': { os: null, os_hr: '0.74 (CV death+worsening HF)', pfs: null, pfs_hr: null, orr: null, trial: 'DAPA-HF' },
  // ── ALZHEIMER ──
  '仑卡奈单抗（乐意保）': { os: null, os_hr: null, pfs: null, pfs_hr: null, orr: 'CDR-SB: -27%', trial: 'CLARITY AD' },
  // ── MDD ──
  '艾司氯胺酮（TRD）': { os: null, os_hr: null, pfs: null, pfs_hr: null, orr: 'Response: 70%', trial: 'TRANSFORM-2' },
  '祖拉诺酮（Zurzuvae）': { os: null, os_hr: null, pfs: null, pfs_hr: null, orr: 'HAMD-17: -17.2 vs -13.8', trial: 'LANDSCAPE' },
  // ── MASH ──
  '雷美替隆（Resmetirom/Rezdiffra）': { os: null, os_hr: null, pfs: null, pfs_hr: null, orr: 'Fibrosis ≥1: 26% vs 14%', trial: 'MAESTRO-NASH' },
  // ── LIPIDS ──
  '依洛尤单抗（瑞百安）': { os: null, os_hr: '0.85 (MACE)', pfs: null, pfs_hr: null, orr: 'LDL-C: -59%', trial: 'FOURIER' },
  '阿利西尤单抗（波立达）': { os: null, os_hr: '0.85 (MACE)', pfs: null, pfs_hr: null, orr: 'LDL-C: -54%', trial: 'ODYSSEY OUTCOMES' },
};

// ─── PIPELINE CLINICAL ENDPOINTS ────────────────────────────────────────────
// Latest trial data for investigational drugs, keyed by pipeline drug name_cn
export const PIPELINE_ENDPOINTS = {
  // ── NSCLC EGFR ──
  'Amivantamab + Lazertinib': { pfs: '23.7m', pfs_hr: '0.70', orr: '73%', trial: 'MARIPOSA (1L vs osimertinib)' },
  'Patritumab deruxtecan (HER3-DXd)': { orr: '29.8%', pfs: '5.5m', pfs_hr: null, trial: 'HERTHENA-Lung01 (2L+ HER3+)' },
  'Patritumab Deruxtecan (HER3-DXd)': { orr: '29.8%', pfs: '5.5m', pfs_hr: null, trial: 'HERTHENA-Lung01 (2L+ HER3+)' },
  'Zipalertinib': { orr: '50%', pfs: '6.7m', pfs_hr: null, trial: 'ZEAL-1L (exon20ins)' },
  // ── NSCLC KRAS ──
  'Adagrasib + 帕博利珠单抗': { orr: '49%', pfs: '10.1m', pfs_hr: null, trial: 'KRYSTAL-7 (1L KRAS G12C PD-L1≥50%)' },
  'Adagrasib + Pembrolizumab': { orr: '49%', pfs: '10.1m', pfs_hr: null, trial: 'KRYSTAL-7 (1L KRAS G12C PD-L1≥50%)' },
  'Glecirasib (JAB-21822)': { orr: '44.4%', pfs: '8.3m', pfs_hr: null, trial: 'Phase 2 (2L KRAS G12C)' },
  'D-1553': { orr: '51.6%', pfs: null, pfs_hr: null, trial: 'Phase 1/2 (KRAS G12C)' },
  'Sotorasib + Panitumumab': { orr: '26%', pfs: '5.6m', pfs_hr: '0.49', trial: 'CodeBreaK 300 (CRC 3L KRAS G12C)' },
  // ── SCLC ──
  'Tarlatamab (AMG 757)': { os: '14.3m', os_hr: null, orr: '40%', pfs: '4.9m', pfs_hr: null, trial: 'DeLLphi-301 (2L+)' },
  'Tarlatamab': { os: '14.3m', os_hr: null, orr: '40%', pfs: '4.9m', pfs_hr: null, trial: 'DeLLphi-301 (2L+)' },
  'Ifinatamab deruxtecan (I-DXd)': { orr: '35.7%', pfs: '5.6m', pfs_hr: null, trial: 'B-SIMPLE4 (2L+)' },
  'Ifinatamab Deruxtecan': { orr: '35.7%', pfs: '5.6m', pfs_hr: null, trial: 'B-SIMPLE4 (2L+)' },
  // ── NSCLC IO (Ivonescimab) ──
  '依沃西单抗（AK112）★ 头对头打败K药': { os_hr: '0.67', pfs: '11.14m', pfs_hr: '0.51', orr: '50%', trial: 'HARMONi-A (1L PD-L1≥1% vs pembrolizumab)' },
  '依沃西单抗（AK112）+ 化疗': { pfs: '8.8m', pfs_hr: '0.45', orr: '71%', trial: 'HARMONi-2 (1L 鳞癌 + chemo)' },
  // ── BREAST HER2+ ──
  'T-DXd（DS-8201）辅助治疗': { pfs_hr: '0.73 (iDFS)', orr: null, trial: 'DESTINY-Breast05 (HR pCR/non-pCR)' },
  'Zanidatamab': { orr: '37.9%', pfs: '6.9m', pfs_hr: null, trial: 'HERIZON-GEA-01 (2L HER2+ GEA)' },
  // ── BREAST HR+ ──
  'Elacestrant（艾拉司群）': { os: '24.0m', os_hr: '0.75 (ESR1m)', pfs: '3.8m', pfs_hr: '0.55 (ESR1m)', orr: '10%', trial: 'EMERALD (2L ESR1突变)' },
  'Capivasertib + 氟维司群': { pfs: '7.3m', pfs_hr: '0.60', orr: '23%', trial: 'CAPItello-291 (2L PIK3CA/AKT1/PTEN)' },
  'Inavolisib + Palbociclib + Fulvestrant': { pfs: '15.0m', pfs_hr: '0.43', orr: '43%', trial: 'INAVO120 (1L PIK3CA突变)' },
  // ── BREAST TNBC ──
  '芦康沙妥单抗（SKB264）新辅助': { orr: 'pCR: 40.9%', trial: 'Phase 2 新辅助 (early TNBC)' },
  '芦康沙妥单抗（SKB264）一线': { pfs: '8.3m', pfs_hr: '0.58', orr: '46.6%', trial: 'EVER-132-001 (1L mTNBC)' },
  'Dato-DXd（Datopotamab deruxtecan）': { pfs: '6.9m', pfs_hr: '0.63', orr: '36%', trial: 'TROPION-Breast01 (2L+ HR+/HER2-)' },
  'Dato-DXd': { pfs: '4.4m', pfs_hr: '0.63', orr: '27%', trial: 'TROPION-Lung01 (2L+ NSCLC)' },
  'Dato-DXd (Datopotamab deruxtecan)': { pfs: '6.9m', pfs_hr: '0.63', orr: '36%', trial: 'TROPION-Breast01' },
  // ── BREAST HER2-low ──
  'T-DXd（DESTINY-Breast06，HER2超低表达）': { pfs: '13.2m', pfs_hr: '0.62', orr: '57%', trial: 'DESTINY-Breast06 (HER2低/超低表达)' },
  'Dato-DXd（HER2低表达）': { pfs: '6.9m', pfs_hr: '0.63', orr: '36%', trial: 'TROPION-Breast01 subgroup' },
  // ── CRC ──
  'Fruzaqintinib（呋喹替尼）': { os: '7.4m', os_hr: '0.66', pfs: '3.7m', pfs_hr: '0.32', orr: '1.5%', trial: 'FRESCO-2 (4L+ mCRC)' },
  // ── GASTRIC ──
  'Zanidatamab + 化疗': { pfs: '10.6m', pfs_hr: '0.72', orr: '67%', trial: 'HERIZON-GEA-01 (1L HER2+ GEA)' },
  'T-DXd（DS-8201）+ 纳武利尤单抗': { orr: '74%', pfs: null, pfs_hr: null, trial: 'DESTINY-Gastric04 (HER2+ 1L)' },
  // ── CERVICAL ──
  '卡度利尼（AK104）+ 化疗': { pfs: '9.8m', pfs_hr: '0.62', orr: '71%', trial: 'COMPASSION-16 (1L HPV+)' },
  'Tisotumab Vedotin（TV，Tivdak）': { os: '11.5m', os_hr: '0.70', pfs: '4.2m', pfs_hr: '0.67', orr: '17.8%', trial: 'innovaTV 301 (2L+)' },
  'Pembrolizumab + Tisotumab Vedotin': { orr: '41%', pfs: '10.8m', pfs_hr: '0.58', trial: 'innovaTV 304 (1L CPS≥1)' },
  '卡度利尼（AK104）US approval': { orr: '33.3%', trial: 'COMPASSION-16 (2L+)' },
  // ── PROSTATE ──
  '177Lu-PSMA-617（Pluvicto）': { os: '15.3m', os_hr: '0.62', pfs: '8.7m', pfs_hr: '0.40', orr: '30%', trial: 'VISION (3L+ mCRPC PSMA+)' },
  'Olaparib + Abiraterone（PROpel）': { os: '42.1m', os_hr: '0.81 (ITT)', pfs: '24.8m', pfs_hr: '0.66', orr: '58%', trial: 'PROpel (1L mCRPC HRR不限)' },
  'Niraparib + Abiraterone（MAGNITUDE）': { pfs: '16.7m', pfs_hr: '0.53 (BRCA1/2)', orr: null, trial: 'MAGNITUDE (1L mCRPC BRCA1/2)' },
  'ARV-110 (Bavdegalutamide)': { orr: '30%', pfs: '6.0m', pfs_hr: null, trial: 'Phase 1/2 (AR LBD突变)' },
  '177Lu-PSMA-I&T': { pfs_hr: '0.41', orr: null, trial: 'ECLIPSE (3L+ PSMA+)' },
  // ── LIVER ──
  '度伐利尤单抗 + 替西木单抗（STRIDE方案）': { os: '16.4m', os_hr: '0.78', pfs: '3.8m', pfs_hr: '0.90', orr: '20%', trial: 'HIMALAYA (1L HCC vs sorafenib)' },
  '帕博利珠单抗 + 仑伐替尼': { os: '21.2m', os_hr: '0.79', pfs: '8.2m', pfs_hr: '0.67', orr: '36%', trial: 'LEAP-002 (1L HCC, p=0.0227 not sig)' },
  'Camrelizumab + Rivoceranib': { os: '22.1m', os_hr: '0.62', pfs: '5.6m', pfs_hr: '0.52', orr: '25%', trial: 'CARES-310 (1L HCC)' },
  'Linrodostat + 纳武利尤单抗（IDO1+PD-1）': { orr: '23%', pfs: '3.7m', pfs_hr: null, trial: 'Phase 2 (2L+ HCC IDO1+)' },
  // ── BLADDER ──
  'Enfortumab Vedotin（EV）+ Pembrolizumab': { os: '31.5m', os_hr: '0.47', pfs: '12.5m', pfs_hr: '0.45', orr: '68%', trial: 'EV-302/KEYNOTE-869 (1L mUC)' },
  'Sacituzumab Govitecan（Trodelvy，UC）': { os: '11.2m', os_hr: '0.78', pfs: '5.5m', pfs_hr: '0.67', orr: '27%', trial: 'TROPiCS-02 (2L+ mUC)' },
  'GC + Nivolumab (CheckMate-901)': { os: '21.7m', os_hr: '0.78', pfs: '7.9m', pfs_hr: '0.72', orr: '47%', trial: 'CheckMate-901 (1L mUC)' },
  // ── ESOPHAGEAL ──
  '卡度利尼（AK104）+ 化疗': { pfs: '7.5m', pfs_hr: '0.62', orr: '60%', trial: 'AK104-301 (1L ESCC)' },
  'Tislelizumab + Chemotherapy': { os: '17.2m', os_hr: '0.66', pfs: '7.3m', pfs_hr: '0.62', orr: '63%', trial: 'RATIONALE-306 (1L ESCC/EAC)' },
  // ── THYROID ──
  'Selpercatinib（RET融合 DTC）': { pfs: 'NR', pfs_hr: '0.28', orr: '82%', trial: 'LIBRETTO-431 (1L vs standard)' },
  'Pralsetinib（BLU-667，RET融合）': { orr: '71%', pfs: '13.1m', pfs_hr: null, trial: 'ARROW (RET fusion thyroid)' },
  'Cabozantinib (RAI-R DTC 2L)': { orr: '15%', pfs: '11.0m', pfs_hr: '0.54', trial: 'COSMIC-311 (2L DTC)' },
  // ── ENDOMETRIAL ──
  'Mirvetuximab soravtansine（FRα ADC）': { os: '16.9m', os_hr: '0.67', pfs: '5.6m', pfs_hr: '0.65', orr: '42%', trial: 'MIRASOL (3L+ FRα-high OC — also EC)' },
  'Trastuzumab Deruxtecan (T-DXd) - HER2+ EC': { orr: '58%', pfs: '11.3m', pfs_hr: '0.36', trial: 'DESTINY-PanTumor02 (HER2+ EC)' },
  // ── NSCLC IO 跨品类 ──
  'Nivolumab + Ipilimumab (CheckMate-227 已批)': { os: '17.1m', os_hr: '0.73', pfs: '5.1m', pfs_hr: '0.82', orr: '36%', trial: 'CheckMate-227 (TMB-H ≥10)' },
  '派安普利单抗（安尼可）+ 化疗': { pfs: '7.0m', pfs_hr: '0.55', orr: '56%', trial: 'AK105-302 (1L NSCLC)' },
};
