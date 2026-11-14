/**
 * DRUG_SALES — 产品级年销售额（全适应症合计，非单一适应症）
 *
 * 单位：global / us = 十亿美元（$B）；cn = 亿元人民币
 * year 默认 2025（FY2025 年报口径）
 * est: 标记哪些字段是估算（年报未单独披露），页面上以 "≈" 显示
 *   - 多数跨国药企年报不披露单品中国销售额，cn 多为估算或 null（未披露）
 * match: 在 name_en + name_cn 中做不区分大小写的子串匹配；exclude 命中则跳过
 *
 * 汇率：EUR 1.13 / CHF 1.20 / DKK 0.151 / CNY 7.18 / GBP 1.32 / JPY 150
 * 来源：各公司 FY2025 年报 / 10-K / 业绩公告（AZ、Pfizer、Sanofi、AbbVie、Amgen、Gilead、
 *       Novartis、Merck、Lilly、Novo Nordisk、J&J、BMS、BeiGene、argenx、UCB、Madrigal 等）
 */
const S = (brand, match, global, us, cn, opt = {}) => ({ brand, match, global, us, cn, year: 2025, ...opt });

export const DRUG_SALES = [
  // ── PD-(L)1 / IO ──
  S('Keytruda', ['Keytruda', 'Pembrolizumab', '帕博利珠'], 31.68, 19.3, 15, { est: ['us', 'cn'], src: 'Merck 10-K（全球）；美/中为估算' }),
  S('Opdivo', ['Opdivo', 'Nivolumab', '纳武利尤'], 10.05, 6.0, null, { est: ['us'], exclude: ['Relatlimab', 'Opdualag'], src: 'BMS FY2025' }),
  S('Yervoy', ['Yervoy', 'Ipilimumab', '伊匹木'], 2.9, 1.83, null, { src: 'BMS FY2025' }),
  S('Opdualag', ['Opdualag', 'Relatlimab'], 1.2, 1.1, null, { est: ['global', 'us'], src: 'BMS FY2025（>10亿美元）' }),
  S('Tecentriq', ['Tecentriq', 'Atezolizumab', '阿替利珠'], 4.2, 1.9, null, { est: ['global'], src: 'Roche FY2025（美国 CHF 1.6B）' }),
  S('Imfinzi', ['Imfinzi', 'Durvalumab', '度伐利尤'], 6.06, 3.51, 25, { est: ['cn'], src: 'AstraZeneca FY2025' }),
  S('Imjudo', ['Imjudo', 'Tremelimumab'], 0.35, 0.23, null, { src: 'AstraZeneca FY2025' }),
  S('Libtayo', ['Libtayo', 'Cemiplimab'], 1.45, 0.94, null, { src: 'Regeneron FY2025' }),
  S('Jemperli', ['Jemperli', 'Dostarlimab'], 1.05, 0.8, null, { est: ['global', 'us'], src: 'GSK FY2025（估算）' }),
  S('Tevimbra 百泽安', ['Tevimbra', 'Tislelizumab', '替雷利珠'], 0.74, 0.05, 48, { est: ['us', 'cn'], src: '百济神州 2025 年报（全球 52.97 亿元）' }),
  S('Tyvyt 达伯舒', ['Tyvyt', 'Sintilimab', '信迪利'], 0.58, null, 42, { est: ['global', 'cn'], src: '信达生物 2025（估算）' }),
  S('AiRuiKa 艾瑞卡', ['Camrelizumab', '卡瑞利珠'], 0.7, null, 50, { est: ['global', 'cn'], src: '恒瑞医药 2025（估算）' }),
  S('Tuoyi 拓益', ['Toripalimab', '特瑞普利'], 0.3, 0.03, 20, { est: ['global', 'us', 'cn'], src: '君实生物 2025（估算）' }),
  S('依达方 Ivonescimab', ['Ivonescimab', '依沃西'], 0.24, null, 17, { est: ['global', 'cn'], src: '康方生物 2025 产品销售合计 30.33 亿元（单品为估算）' }),
  S('开坦尼 Cadonilimab', ['Cadonilimab', '卡度尼利'], 0.18, null, 13, { est: ['global', 'cn'], src: '康方生物 2025（单品为估算）' }),

  // ── Lung ──
  S('Tagrisso', ['Tagrisso', 'Osimertinib', '奥希替尼'], 7.25, 3.06, 90, { est: ['cn'], src: 'AstraZeneca FY2025（新兴市场 $1.97B）' }),
  S('阿美乐 Aumolertinib', ['Aumolertinib', '阿美替尼'], 0.77, null, 55, { est: ['global', 'cn'], src: '翰森制药 2025（估算）' }),
  S('艾弗沙 Furmonertinib', ['Furmonertinib', 'Firmonertinib', '伏美替尼'], 0.67, null, 48, { est: ['global', 'cn'], src: '艾力斯 2025（估算）' }),
  S('Rybrevant/Lazcluze', ['Rybrevant', 'Amivantamab', '埃万妥'], 0.73, 0.5, null, { est: ['us'], src: 'J&J 10-K FY2025' }),
  S('Alecensa', ['Alecensa', 'Alectinib', '阿来替尼'], 1.9, 0.5, 30, { est: ['global', 'us', 'cn'], src: 'Roche FY2025（估算）' }),
  S('Lorbrena', ['Lorbrena', 'Lorlatinib', '洛拉替尼'], 1.02, 0.41, 15, { est: ['cn'], src: 'Pfizer FY2025' }),
  S('Alunbrig', ['Alunbrig', 'Brigatinib', '布格替尼'], 0.3, 0.1, null, { est: ['global', 'us'], src: 'Takeda FY2025（估算）' }),
  S('Lumakras', ['Lumakras', 'Sotorasib', '索托拉西布'], 0.36, 0.21, null, { src: 'Amgen FY2025' }),
  S('Krazati', ['Krazati', 'Adagrasib', '阿达格拉西布'], 0.2, 0.18, null, { est: ['global', 'us'], src: 'BMS FY2025（估算）' }),
  S('Imdelltra', ['Imdelltra', 'Tarlatamab', '塔拉妥'], 0.63, 0.51, null, { src: 'Amgen FY2025' }),
  S('安罗替尼 福可维', ['Anlotinib', '安罗替尼'], 0.7, null, 50, { est: ['global', 'cn'], src: '中国生物制药 2025（估算）' }),
  S('Cyramza', ['Cyramza', 'Ramucirumab', '雷莫西尤'], 0.95, 0.35, null, { est: ['global', 'us'], src: 'Lilly FY2025（估算）' }),

  // ── Breast ──
  S('Enhertu', ['Enhertu', 'Trastuzumab Deruxtecan', 'T-DXd', '德曲妥珠'], 4.98, 2.3, 35, { est: ['us', 'cn'], src: 'Daiichi Sankyo + AZ 合计 FY2025' }),
  S('Perjeta + Phesgo', ['Perjeta', 'Pertuzumab', 'Phesgo', '帕妥珠'], 6.6, 2.6, 45, { est: ['global', 'us', 'cn'], exclude: ['Deruxtecan', 'T-DXd', 'Tucatinib'], src: 'Roche FY2025（HER2 系列合计 CHF 8.5B，拆分为估算）' }),
  S('Kadcyla', ['Kadcyla', 'T-DM1', '恩美曲妥珠'], 2.3, 0.9, 12, { est: ['global', 'us', 'cn'], src: 'Roche FY2025（估算）' }),
  S('Tukysa', ['Tukysa', 'Tucatinib', '图卡替尼'], 0.46, 0.35, null, { src: 'Pfizer FY2025' }),
  S('Ibrance', ['Ibrance', 'Palbociclib', '哌柏西利'], 4.12, 2.71, null, { exclude: ['Gedatolisib', 'Inavolisib'], src: 'Pfizer FY2025' }),
  S('Kisqali', ['Kisqali', 'Ribociclib', '瑞波西利'], 4.78, 2.6, null, { est: ['us'], src: 'Novartis FY2025' }),
  S('Verzenio', ['Verzenio', 'Abemaciclib', '阿贝西利'], 5.72, 3.46, null, { exclude: ['Imlunestrant'], src: 'Lilly 10-K FY2025' }),
  S('Truqap', ['Truqap', 'Capivasertib', '卡匹色替'], 0.73, 0.59, null, { src: 'AstraZeneca FY2025' }),
  S('Trodelvy', ['Trodelvy', 'Sacituzumab Govitecan', '戈沙妥珠'], 1.4, 0.88, null, { src: 'Gilead FY2025' }),
  S('Lynparza', ['Lynparza', 'Olaparib', '奥拉帕利'], 3.28, 1.43, 25, { est: ['cn'], src: 'AstraZeneca FY2025' }),
  S('Talzenna', ['Talzenna', 'Talazoparib'], 0.18, 0.13, null, { src: 'Pfizer FY2025' }),

  // ── GI / GU / other solid tumors ──
  S('Avastin', ['Avastin', 'Bevacizumab (Avastin)'], 1.3, 0.35, null, { est: ['global', 'us'], src: 'Roche FY2025（估算；生物类似药侵蚀）' }),
  S('Erbitux', ['Erbitux', 'Cetuximab', '西妥昔'], 1.6, 0.55, 20, { est: ['global', 'us', 'cn'], exclude: ['Encorafenib', 'Adagrasib'], src: 'Merck KGaA + Lilly FY2025（估算）' }),
  S('Braftovi + Mektovi', ['Braftovi', 'Encorafenib'], 0.72, 0.67, null, { src: 'Pfizer FY2025' }),
  S('Lenvima', ['Lenvima', 'Lenvatinib', '仑伐替尼'], 2.2, 1.3, 8, { est: ['global', 'us', 'cn'], src: 'Eisai FY2025（估算；Merck 联盟收入 $1.05B）' }),
  S('Stivarga', ['Stivarga', 'Regorafenib', '瑞戈非尼'], 0.5, 0.15, null, { est: ['global', 'us'], src: 'Bayer FY2025（估算）' }),
  S('爱优特 / Fruzaqla', ['Fruquintinib', 'Fruzaqla', '呋喹替尼'], 0.5, 0.25, 9, { est: ['global', 'us', 'cn'], src: 'HUTCHMED / Takeda FY2025（估算）' }),
  S('Xtandi', ['Xtandi', 'Enzalutamide', '恩扎卢胺'], 6.1, 2.19, null, { est: ['global'], src: 'Astellas FY2025（估算）；美国为 Pfizer 联盟收入' }),
  S('Erleada', ['Erleada', 'Apalutamide', '阿帕他胺'], 3.57, 1.5, null, { est: ['us'], src: 'J&J 10-K FY2025' }),
  S('Nubeqa', ['Nubeqa', 'Darolutamide', '达罗他胺'], 2.5, 1.0, null, { est: ['global', 'us'], src: 'Bayer FY2025（估算）' }),
  S('Zytiga', ['Zytiga', 'Abiraterone', '阿比特龙'], 0.5, 0.03, null, { est: ['us'], exclude: ['Capivasertib', 'Olaparib', 'Niraparib'], src: 'J&J 10-K FY2025（原研；已仿制）' }),
  S('Pluvicto', ['Pluvicto', 'Lutetium Vipivotide', '177Lu-PSMA-617'], 1.99, 1.4, null, { est: ['us'], src: 'Novartis FY2025' }),
  S('Padcev', ['Padcev', 'Enfortumab', '维恩妥尤'], 2.5, 1.9, null, { est: ['global'], src: 'Pfizer FY2025（美国 $1.90B）+ Astellas（估算）' }),
  S('Balversa', ['Balversa', 'Erdafitinib'], 0.1, 0.08, null, { est: ['global', 'us'], src: 'J&J（估算）' }),
  S('Tivdak', ['Tivdak', 'Tisotumab'], 0.15, 0.14, null, { src: 'Pfizer FY2025' }),
  S('Welireg', ['Welireg', 'Belzutifan'], 0.72, 0.6, null, { est: ['us'], src: 'Merck 10-K FY2025' }),
  S('Tafinlar + Mekinist', ['Tafinlar', 'Dabrafenib', '达拉非尼'], 2.22, 0.9, null, { est: ['us'], src: 'Novartis FY2025' }),
  S('Retevmo', ['Retevmo', 'Selpercatinib', '塞普替尼'], 0.6, 0.4, null, { est: ['global', 'us'], src: 'Lilly FY2025（估算）' }),
  S('Cabometyx', ['Cabometyx', 'Cometriq', 'Cabozantinib', '卡博替尼'], 3.0, 2.2, null, { est: ['global', 'us'], src: 'Exelixis + Ipsen FY2025（估算）' }),
  S('Vyloy', ['Vyloy', 'Zolbetuximab', '佐妥昔'], 0.3, 0.08, null, { est: ['global', 'us'], src: 'Astellas FY2025（估算）' }),
  S('Ziihera', ['Ziihera', 'Zanidatamab', '泽尼达妥'], 0.025, 0.025, null, { src: 'Jazz 10-K FY2025（$24.8M）' }),
  S('爱地希 Disitamab vedotin', ['Disitamab', '维迪西妥'], 0.13, null, 9, { est: ['global', 'cn'], src: '荣昌生物 2025（估算）' }),

  // ── Hematology ──
  S('Darzalex', ['Darzalex', 'Daratumumab', '达雷妥尤', 'Dara-'], 14.35, 8.2, null, { est: ['us'], src: 'J&J 10-K FY2025' }),
  S('Carvykti', ['Carvykti', 'Cilta-cel', 'Ciltacabtagene', '西达基奥仑赛'], 1.89, 1.5, null, { est: ['us'], src: 'J&J 10-K FY2025' }),
  S('Tecvayli', ['Tecvayli', 'Teclistamab', '特立妥'], 0.67, 0.5, null, { est: ['us'], src: 'J&J 10-K FY2025' }),
  S('Talvey', ['Talvey', 'Talquetamab'], 0.46, 0.35, null, { est: ['us'], src: 'J&J 10-K FY2025' }),
  S('Elrexfio', ['Elrexfio', 'Elranatamab'], 0.3, 0.14, null, { src: 'Pfizer FY2025' }),
  S('Abecma', ['Abecma', 'Idecabtagene'], 0.35, 0.2, null, { est: ['global', 'us'], src: 'BMS FY2025（估算）' }),
  S('Revlimid', ['Revlimid', 'Lenalidomide', '来那度胺', 'VRd', 'RVd'], 2.8, 2.3, null, { est: ['global', 'us'], src: 'BMS FY2025（估算；仿制药侵蚀）' }),
  S('Pomalyst', ['Pomalyst', 'Pomalidomide', '泊马度胺'], 2.7, 2.0, null, { est: ['global', 'us'], src: 'BMS FY2025（估算）' }),
  S('Kyprolis', ['Kyprolis', 'Carfilzomib', '卡非佐米'], 1.41, 0.91, null, { src: 'Amgen FY2025' }),
  S('Sarclisa', ['Sarclisa', 'Isatuximab'], 0.66, 0.28, null, { src: 'Sanofi FY2025（€588M）' }),
  S('Brukinsa 百悦泽', ['Brukinsa', 'Zanubrutinib', '泽布替尼'], 3.93, 2.81, 24.7, { src: '百济神州 2025 年报（美国 202 亿元 / 中国 24.72 亿元）' }),
  S('Calquence', ['Calquence', 'Acalabrutinib', '阿可替尼'], 3.52, 2.34, 8, { est: ['cn'], src: 'AstraZeneca FY2025' }),
  S('Imbruvica', ['Imbruvica', 'Ibrutinib', '伊布替尼'], 4.9, 2.05, null, { est: ['global'], src: 'AbbVie（美国 $2.05B）+ J&J FY2025' }),
  S('Jaypirca', ['Jaypirca', 'Pirtobrutinib', '匹妥布替尼'], 0.55, 0.45, null, { est: ['global', 'us'], src: 'Lilly FY2025（估算）' }),
  S('Venclexta', ['Venclexta', 'Venetoclax', '维奈克拉', 'Ven+Aza', 'V+O', 'V+R'], 2.79, 1.31, null, { src: 'AbbVie FY2025' }),
  S('宜诺凯 Orelabrutinib', ['Orelabrutinib', '奥布替尼'], 0.2, null, 14, { est: ['global', 'cn'], src: '诺诚健华 2025（估算）' }),
  S('Polivy', ['Polivy', 'Polatuzumab', '维泊妥珠'], 1.8, 0.7, null, { est: ['global', 'us'], src: 'Roche FY2025（估算）' }),
  S('Columvi', ['Columvi', 'Glofitamab', '格菲妥'], 0.35, 0.12, null, { est: ['global', 'us'], src: 'Roche FY2025（估算）' }),
  S('Lunsumio', ['Lunsumio', 'Mosunetuzumab', '莫妥珠'], 0.15, 0.08, null, { est: ['global', 'us'], src: 'Roche FY2025（估算）' }),
  S('Epkinly', ['Epkinly', 'Epcoritamab', '艾可瑞妥'], 0.5, 0.17, null, { est: ['global', 'us'], src: 'AbbVie（$271M 份额）+ Genmab FY2025（估算）' }),
  S('Gazyva', ['Gazyva', 'Obinutuzumab', '奥妥珠'], 1.2, 0.55, null, { est: ['global', 'us'], src: 'Roche FY2025（估算）' }),
  S('Yescarta', ['Yescarta', 'Axicabtagene', 'Axi-cel', '阿基仑赛'], 1.5, 0.6, null, { src: 'Gilead FY2025' }),
  S('Tecartus', ['Tecartus', 'Brexucabtagene', 'Brexu-cel'], 0.34, 0.15, null, { src: 'Gilead FY2025' }),
  S('Breyanzi', ['Breyanzi', 'Lisocabtagene', 'Liso-cel'], 1.36, 1.05, null, { est: ['us'], src: 'BMS FY2025' }),
  S('Adcetris', ['Adcetris', 'Brentuximab', '维布妥昔'], 1.9, 0.89, null, { est: ['global'], src: 'Pfizer（美国 $885M）+ Takeda FY2025（估算）' }),
  S('Scemblix', ['Scemblix', 'Asciminib', '阿思尼布'], 1.29, 0.85, null, { est: ['us'], src: 'Novartis FY2025' }),
  S('Tasigna', ['Tasigna', 'Nilotinib', '尼洛替尼'], 1.1, 0.5, null, { est: ['us'], src: 'Novartis FY2025' }),
  S('Bosulif', ['Bosulif', 'Bosutinib'], 0.61, 0.49, null, { src: 'Pfizer FY2025' }),
  S('Xospata', ['Xospata', 'Gilteritinib', '吉瑞替尼'], 0.45, 0.2, null, { est: ['global', 'us'], src: 'Astellas FY2025（估算）' }),

  // ── Immunology ──
  S('Skyrizi', ['Skyrizi', 'Risankizumab', '利生奇珠'], 17.56, 15.2, null, { src: 'AbbVie FY2025' }),
  S('Rinvoq', ['Rinvoq', 'Upadacitinib', '乌帕替尼'], 8.3, 5.94, null, { src: 'AbbVie FY2025' }),
  S('Humira', ['Humira', 'Adalimumab', '阿达木'], 4.54, 3.06, null, { src: 'AbbVie FY2025（原研；生物类似药侵蚀）' }),
  S('Dupixent', ['Dupixent', 'Dupilumab', '度普利尤'], 17.8, 13.0, 30, { est: ['cn'], src: 'Sanofi/Regeneron FY2025（€15.7B；美国 €11.5B）' }),
  S('Stelara', ['Stelara', 'Ustekinumab', '乌司奴'], 6.08, 3.8, null, { src: 'J&J 10-K FY2025（生物类似药侵蚀，-41%）' }),
  S('Tremfya', ['Tremfya', 'Guselkumab', '古塞奇尤'], 5.16, 3.5, null, { est: ['us'], src: 'J&J 10-K FY2025' }),
  S('Cosentyx', ['Cosentyx', 'Secukinumab', '司库奇尤'], 6.67, 3.6, 45, { est: ['us', 'cn'], src: 'Novartis FY2025' }),
  S('Taltz', ['Taltz', 'Ixekizumab', '依奇珠'], 3.6, 2.3, null, { est: ['global', 'us'], src: 'Lilly FY2025（>30亿美元）' }),
  S('Bimzelx', ['Bimzelx', 'Bimekizumab', '比吉利珠'], 2.5, 1.6, null, { est: ['us'], src: 'UCB FY2025（>€2.2B）' }),
  S('Sotyktu', ['Sotyktu', 'Deucravacitinib', '氘可来昔替尼'], 0.3, 0.22, null, { est: ['global', 'us'], src: 'BMS FY2025（估算）' }),
  S('Enbrel', ['Enbrel', 'Etanercept', '依那西普'], 3.2, 2.2, null, { est: ['global'], src: 'Amgen（美国 $2.20B）+ Pfizer 海外 FY2025' }),
  S('Xeljanz', ['Xeljanz', 'Tofacitinib', '托法替布'], 1.09, 0.63, null, { src: 'Pfizer FY2025' }),
  S('Olumiant', ['Olumiant', 'Baricitinib', '巴瑞替尼'], 0.95, 0.3, null, { est: ['global', 'us'], src: 'Lilly FY2025（估算）' }),
  S('Orencia', ['Orencia', 'Abatacept', '阿巴西普'], 3.7, 2.8, null, { est: ['global', 'us'], src: 'BMS FY2025（估算）' }),
  S('Actemra', ['Actemra', 'Tocilizumab', '托珠'], 2.9, 1.2, null, { est: ['global', 'us'], src: 'Roche FY2025（估算；生物类似药侵蚀）' }),
  S('Cibinqo', ['Cibinqo', 'Abrocitinib', '阿布昔替尼'], 0.28, 0.12, null, { src: 'Pfizer FY2025' }),
  S('Ebglyss', ['Ebglyss', 'Lebrikizumab'], 0.5, 0.35, null, { est: ['global', 'us'], src: 'Lilly + Almirall FY2025（估算）' }),
  S('Entyvio', ['Entyvio', 'Vedolizumab', '维得利珠'], 6.1, 4.0, null, { est: ['global', 'us'], src: 'Takeda FY2025（估算）' }),
  S('Omvoh', ['Omvoh', 'Mirikizumab'], 0.35, 0.25, null, { est: ['global', 'us'], src: 'Lilly FY2025（估算）' }),
  S('Benlysta', ['Benlysta', 'Belimumab', '贝利尤'], 2.2, 1.8, null, { est: ['global', 'us'], src: 'GSK FY2025（估算）' }),
  S('Saphnelo', ['Saphnelo', 'Anifrolumab', '阿尼鲁'], 0.69, 0.6, null, { src: 'AstraZeneca FY2025' }),
  S('泰它西普 泰爱', ['Telitacicept', '泰它西普'], 0.2, null, 14, { est: ['global', 'cn'], src: '荣昌生物 2025（估算）' }),
  S('Ocrevus', ['Ocrevus', 'Ocrelizumab', '奥瑞利珠'], 8.4, 5.9, null, { est: ['global'], src: 'Roche FY2025（美国 CHF 4.9B）' }),
  S('Kesimpta', ['Kesimpta', 'Ofatumumab', '奥法妥木'], 4.43, 2.9, null, { est: ['us'], src: 'Novartis FY2025' }),
  S('Aubagio', ['Aubagio', 'Teriflunomide', '特立氟胺'], 0.27, 0.15, null, { src: 'Sanofi FY2025（€238M；已仿制）' }),
  S('Vyvgart', ['Vyvgart', 'Efgartigimod', '艾加莫德'], 4.2, 3.6, 6.8, { est: ['us'], src: 'argenx FY2025；中国为再鼎医药 $94.2M' }),
  S('Ultomiris', ['Ultomiris', 'Ravulizumab', '瑞利珠'], 4.72, 2.67, null, { src: 'AstraZeneca FY2025' }),
  S('Soliris', ['Soliris', 'Eculizumab', '依库珠'], 1.84, 1.09, null, { src: 'AstraZeneca FY2025' }),
  S('Uplizna', ['Uplizna', 'Inebilizumab'], 0.66, 0.53, null, { src: 'Amgen FY2025' }),

  // ── Metabolic / CV ──
  S('Mounjaro', ['Mounjaro', '穆峰达'], 22.97, 13.65, null, { src: 'Lilly 10-K FY2025' }),
  S('Zepbound', ['Zepbound'], 13.54, 13.48, null, { src: 'Lilly 10-K FY2025' }),
  S('Ozempic', ['Ozempic', '诺和泰'], 19.2, 12.6, 62, { est: ['us', 'cn'], src: 'Novo Nordisk FY2025（DKK 127.1B；美/中为按 GLP-1 糖尿病板块拆分估算）' }),
  S('Wegovy', ['Wegovy', '诺和盈'], 11.9, 7.7, 8.9, { src: 'Novo Nordisk FY2025（DKK 79.1B；美国 DKK 51.0B；中国减重板块 DKK 0.82B）' }),
  S('Rybelsus', ['Rybelsus'], 3.3, 1.6, null, { est: ['us'], src: 'Novo Nordisk FY2025（DKK 22.1B）' }),
  S('Jardiance', ['Jardiance', 'Empagliflozin', '恩格列净'], 9.5, 4.5, null, { est: ['global', 'us'], src: 'Boehringer Ingelheim + Lilly FY2025（估算）' }),
  S('Farxiga', ['Farxiga', 'Forxiga', 'Dapagliflozin', '达格列净'], 8.4, 1.73, 70, { est: ['cn'], src: 'AstraZeneca FY2025（新兴市场 $3.32B）' }),
  S('Rezdiffra', ['Rezdiffra', 'Resmetirom'], 0.96, 0.95, null, { src: 'Madrigal FY2025（$958M）' }),
  S('Entresto', ['Entresto', 'Sacubitril', '沙库巴曲'], 7.75, 2.9, 50, { est: ['us', 'cn'], src: 'Novartis FY2025（美国 2025-07 起仿制）' }),
  S('Kerendia', ['Kerendia', 'Finerenone', '非奈利酮'], 0.9, 0.55, null, { est: ['global', 'us'], src: 'Bayer FY2025（估算）' }),
  S('Repatha', ['Repatha', 'Evolocumab', '依洛尤'], 3.02, 1.66, null, { src: 'Amgen FY2025' }),
  S('Praluent', ['Praluent', 'Alirocumab', '阿利西尤'], 0.85, 0.25, null, { est: ['global', 'us'], src: 'Sanofi（海外 €526M）+ Regeneron（美国估算）' }),
  S('Leqvio', ['Leqvio', 'Inclisiran', '英克司兰'], 1.2, 0.55, null, { est: ['us'], src: 'Novartis FY2025' }),

  // ── Neuro ──
  S('Leqembi', ['Leqembi', 'Lecanemab', '仑卡奈'], 0.5, 0.25, 8, { est: ['global', 'us', 'cn'], src: 'Eisai/Biogen FY2025（估算）' }),
  S('Kisunla', ['Kisunla', 'Donanemab', '多奈'], 0.3, 0.22, null, { est: ['global', 'us'], src: 'Lilly FY2025（估算）' }),
  S('Nurtec ODT', ['Nurtec', 'Rimegepant', '瑞美吉泮'], 1.42, 1.32, null, { src: 'Pfizer FY2025' }),
  S('Qulipta', ['Qulipta', 'Atogepant'], 1.04, 0.91, null, { src: 'AbbVie FY2025' }),
  S('Ubrelvy', ['Ubrelvy', 'Ubrogepant'], 1.27, 1.24, null, { src: 'AbbVie FY2025' }),
  S('Aimovig', ['Aimovig', 'Erenumab'], 0.55, 0.3, null, { est: ['global', 'us'], src: 'Amgen + Novartis FY2025（估算）' }),
  S('Ajovy', ['Ajovy', 'Fremanezumab'], 0.6, 0.25, null, { est: ['global', 'us'], src: 'Teva FY2025（估算）' }),
  S('Spravato', ['Spravato', 'Esketamine', '艾司氯胺酮'], 1.7, 1.5, null, { est: ['us'], src: 'J&J 10-K FY2025' }),
  S('Auvelity', ['Auvelity', 'AXS-05'], 0.52, 0.52, null, { est: ['global', 'us'], src: 'Axsome FY2025（估算）' }),
  S('Zurzuvae', ['Zurzuvae', 'Zuranolone'], 0.15, 0.15, null, { est: ['global', 'us'], src: 'Biogen/Supernus FY2025（估算）' }),
  S('Vraylar', ['Vraylar', 'Cariprazine'], 3.62, 3.61, null, { src: 'AbbVie FY2025' }),
];

const norm = (s) => (s || '').toLowerCase();

// 返回与某个药物条目匹配的所有产品销售记录（联合方案可命中多个）
export function matchSales(drug) {
  const hay = norm(`${drug.name_en || ''} ${drug.name_cn || ''}`);
  if (!hay.trim()) return [];
  return DRUG_SALES.filter((s) =>
    s.match.some((m) => hay.includes(norm(m))) &&
    !(s.exclude || []).some((x) => hay.includes(norm(x)))
  );
}
