import oncology from './oncology.json';
import immune from './immune.json';
import metabolic from './metabolic.json';
import cardiovascular from './cardiovascular.json';
import neuro from './neuro.json';

export const CATEGORIES = [oncology, immune, metabolic, cardiovascular, neuro];

// Flatten all subtypes for search
export function getAllSubtypes() {
  const results = [];
  for (const cat of CATEGORIES) {
    for (const disease of cat.diseases) {
      for (const sub of disease.subtypes) {
        results.push({
          ...sub,
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
  return disease.subtypes.find((s) => s.id === subtypeId) || null;
}
