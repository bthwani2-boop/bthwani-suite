const fs = require('fs');

let content = fs.readFileSync('C:/bthwani-suite/dsh/frontend/control-panel/catalogs/ControlPanelDshCatalogScreen.tsx', 'utf8');

// 1. Categories - 'All' chip
content = content.replace(
  '<div onClick={() => handleMainCategorySelect(null)} style={{ cursor: \\'pointer\\' }}>\\n               <Chip label="الكل" tone={!activeMainCategory ? \\'brand\\' : \\'default\\'} />\\n             </div>',
  '<Chip label="الكل" tone={!activeMainCategory ? \\'brand\\' : \\'default\\'} onPress={() => handleMainCategorySelect(null)} />'
);

// 2. Categories - mapped chips
content = content.replace(
  '<div key={cat.id} onClick={() => handleMainCategorySelect(cat)} style={{ cursor: \\'pointer\\' }}>\\n                 <Chip label={`\\${cat.emojiFallback} \\${cat.label} \\${cat.categoryMode === \\'manual-order\\' ? \\'(يدوي)\\' : \\'\\'}`} tone={activeMainCategory?.id === cat.id ? \\'brand\\' : \\'default\\'} />\\n               </div>',
  '<Chip key={cat.id} label={`\\${cat.emojiFallback} \\${cat.label} \\${cat.categoryMode === \\'manual-order\\' ? \\'(يدوي)\\' : \\'\\'}`} tone={activeMainCategory?.id === cat.id ? \\'brand\\' : \\'default\\'} onPress={() => handleMainCategorySelect(cat)} />'
);

// 3. Quick Filters - mapped chips
content = content.replace(
  '<div key={f} onClick={() => setActiveFilter(f)} style={{ cursor: \\'pointer\\' }}>\\n                   <Chip label={`\\${labels[f]} (\\${counts[f]})`} tone={activeFilter === f ? \\'brand\\' : \\'default\\'} />\\n                </div>',
  '<Chip key={f} label={`\\${labels[f]} (\\${counts[f]})`} tone={activeFilter === f ? \\'brand\\' : \\'default\\'} onPress={() => setActiveFilter(f)} />'
);

fs.writeFileSync('C:/bthwani-suite/dsh/frontend/control-panel/catalogs/ControlPanelDshCatalogScreen.tsx', content);
console.log('Done replacing onClick with onPress');
