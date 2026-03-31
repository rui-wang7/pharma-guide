import { useState } from 'react';
import { CATEGORIES } from '../data/index.js';

export default function Sidebar({ selected, onSelect, searchQuery, onSearchChange }) {
  const [expanded, setExpanded] = useState({ oncology: true });

  const toggleCategory = (catId) => {
    setExpanded((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  // Filter logic
  const q = searchQuery.toLowerCase();
  const filteredCategories = CATEGORIES.map((cat) => {
    const diseases = cat.diseases.map((disease) => {
      const subtypes = disease.subtypes.filter((sub) => {
        if (!q) return true;
        return (
          sub.name_cn.toLowerCase().includes(q) ||
          sub.name_en.toLowerCase().includes(q) ||
          disease.name_cn.toLowerCase().includes(q) ||
          cat.name_cn.toLowerCase().includes(q)
        );
      });
      return { ...disease, subtypes };
    }).filter((d) => d.subtypes.length > 0);
    return { ...cat, diseases };
  }).filter((c) => c.diseases.length > 0);

  return (
    <aside className="sidebar">
      {/* Search */}
      <div className="sidebar-search">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="搜索疾病 / Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button className="search-clear" onClick={() => onSearchChange('')}>✕</button>
        )}
      </div>

      {/* Tree */}
      <nav className="sidebar-nav">
        {filteredCategories.map((cat) => (
          <div key={cat.id} className="cat-group">
            <button
              className="cat-header"
              onClick={() => toggleCategory(cat.id)}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.name_cn}</span>
              <span className={`cat-chevron ${expanded[cat.id] || q ? 'open' : ''}`}>›</span>
            </button>

            {(expanded[cat.id] || q) && (
              <div className="cat-body">
                {cat.diseases.map((disease) => (
                  <div key={disease.id} className="disease-group">
                    <div className="disease-label">{disease.name_cn}</div>
                    {disease.subtypes.map((sub) => {
                      const isActive =
                        selected?.categoryId === cat.id &&
                        selected?.diseaseId === disease.id &&
                        selected?.subtypeId === sub.id;
                      return (
                        <button
                          key={sub.id}
                          className={`subtype-btn ${isActive ? 'active' : ''}`}
                          onClick={() =>
                            onSelect({ categoryId: cat.id, diseaseId: disease.id, subtypeId: sub.id })
                          }
                        >
                          <span className="subtype-cn">{sub.name_cn}</span>
                          <span className="subtype-en">{sub.name_en}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
