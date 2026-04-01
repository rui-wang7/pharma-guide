import oncology from './oncology.json';
import immune from './immune.json';
import metabolic from './metabolic.json';
import cardiovascular from './cardiovascular.json';
import neuro from './neuro.json';
import { EU_SURVIVAL, CLINICAL_ENDPOINTS, PIPELINE_ENDPOINTS } from './supplemental.js';

export const CATEGORIES = [oncology, immune, metabolic, cardiovascular, neuro];

// Merge EU/survival data and clinical endpoints into a subtype
function enrichSubtype(sub) {
  const supp = EU_SURVIVAL[sub.id] || {};
  // Merge EU block
  const enriched = { ...sub, eu: supp.eu || null };
  // Merge survival/prevalence into china/us
  if (supp.china && enriched.china) {
    enriched.china = { ...enriched.china, ...supp.china };
  }
  if (supp.us && enriched.us) {
    enriched.us = { ...enriched.us, ...supp.us };
  }
  // Merge clinical endpoints into each drug option in treatment lines
  const regions = ['china', 'us'];
  for (const region of regions) {
    if (!enriched[region]?.treatment_lines) continue;
    enriched[region] = {
      ...enriched[region],
      treatment_lines: enriched[region].treatment_lines.map((line) => ({
        ...line,
        options: (line.options || []).map((opt) => {
          const endpoints = CLINICAL_ENDPOINTS[opt.name_cn];
          return endpoints ? { ...opt, clinical_data: endpoints } : opt;
        }),
        pipeline: (line.pipeline || []).map((p) => {
          const endpoints = PIPELINE_ENDPOINTS[p.name_cn];
          return endpoints ? { ...p, clinical_data: endpoints } : p;
        }),
      })),
    };
  }
  return enriched;
}

// Flatten all subtypes for search
export function getAllSubtypes() {
  const results = [];
  for (const cat of CATEGORIES) {
    for (const disease of cat.diseases) {
      for (const sub of disease.subtypes) {
        results.push({
          ...enrichSubtype(sub),
          categoryId: cat.id,
          categoryName: cat.name_cn,
          categoryIcon: cat.icon,
          diseaseId: disease.id,
          diseaseName: disease.name_cn,
        });
      }
    }
  }
  return results;
}

export function findSubtype(categoryId, diseaseId, subtypeId) {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return null;
  const disease = cat.diseases.find((d) => d.id === diseaseId);
  if (!disease) return null;
  const sub = disease.subtypes.find((s) => s.id === subtypeId);
  return sub ? enrichSubtype(sub) : null;
}

// Get flat list of all subtypes enriched with market data — for Dashboard
export function getDashboardData() {
  const rows = [];
  for (const cat of CATEGORIES) {
    for (const disease of cat.diseases) {
      for (const sub of disease.subtypes) {
        const e = enrichSubtype(sub);
        const cn = e.china || {};
        const us = e.us || {};
        const eu = e.eu || {};

        // Convert all to USD for comparison (approx FX: 1 USD = 7.2 CNY, 1 EUR = 1.1 USD)
        const cnTamUSD = cn.tam_rmb_bn ? cn.tam_rmb_bn / 7.2 : null;
        const usTamUSD = us.tam_usd_bn || null;
        const euTamUSD = eu.tam_eur_bn ? eu.tam_eur_bn * 1.1 : null;

        const cnCases = cn.annual_new_cases || null;
        const usCases = us.annual_new_cases || null;
        const euCases = eu.annual_new_cases || null;

        const cnPrev = cn.prevalence || null;
        const usPrev = us.prevalence || null;
        const euPrev = eu.prevalence || null;

        const cnSPP = cnTamUSD && cnCases ? (cnTamUSD * 1e9) / cnCases / 1000 : null; // $K per patient
        const usSPP = usTamUSD && usCases ? (usTamUSD * 1e9) / usCases / 1000 : null;
        const euSPP = euTamUSD && euCases ? (euTamUSD * 1e9) / euCases / 1000 : null;

        rows.push({
          id: sub.id,
          name_cn: sub.name_cn,
          name_en: sub.name_en,
          categoryId: cat.id,
          categoryName: cat.name_cn,
          categoryIcon: cat.icon,
          diseaseId: disease.id,
          diseaseName_cn: disease.name_cn,
          // New cases
          cn_new_cases: cnCases,
          us_new_cases: usCases,
          eu_new_cases: euCases,
          // Prevalence
          cn_prevalence: cnPrev,
          us_prevalence: usPrev,
          eu_prevalence: euPrev,
          // Survival
          cn_survival: cn.median_survival_years || null,
          us_survival: us.median_survival_years || null,
          // TAM (USD billions for comparison)
          cn_tam_usd: cnTamUSD,
          us_tam_usd: usTamUSD,
          eu_tam_usd: euTamUSD,
          total_tam_usd: (cnTamUSD || 0) + (usTamUSD || 0) + (euTamUSD || 0),
          // Sales per patient ($K / new patient)
          cn_spp: cnSPP ? Math.round(cnSPP) : null,
          us_spp: usSPP ? Math.round(usSPP) : null,
          eu_spp: euSPP ? Math.round(euSPP) : null,
        });
      }
    }
  }
  return rows.sort((a, b) => (b.total_tam_usd || 0) - (a.total_tam_usd || 0));
}
