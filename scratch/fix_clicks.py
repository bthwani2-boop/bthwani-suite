import os

path = 'C:/bthwani-suite/dsh/frontend/control-panel/catalogs/ControlPanelDshCatalogScreen.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Categories All Chip
old_cat_all = """             <div onClick={() => handleMainCategorySelect(null)} style={{ cursor: 'pointer' }}>
               <Chip label="الكل" tone={!activeMainCategory ? 'brand' : 'default'} />
             </div>"""
new_cat_all = """             <Chip label="الكل" tone={!activeMainCategory ? 'brand' : 'default'} onPress={() => handleMainCategorySelect(null)} />"""
content = content.replace(old_cat_all, new_cat_all)

# Replace Categories Mapped Chips
old_cat_mapped = """             {dshCatalogCategories.map(cat => (
               <div key={cat.id} onClick={() => handleMainCategorySelect(cat)} style={{ cursor: 'pointer' }}>
                 <Chip label={`\\${cat.emojiFallback} \\${cat.label} \\${cat.categoryMode === 'manual-order' ? '(يدوي)' : ''}`} tone={activeMainCategory?.id === cat.id ? 'brand' : 'default'} />
               </div>
             ))}"""
new_cat_mapped = """             {dshCatalogCategories.map(cat => (
               <Chip key={cat.id} label={`\\${cat.emojiFallback} \\${cat.label} \\${cat.categoryMode === 'manual-order' ? '(يدوي)' : ''}`} tone={activeMainCategory?.id === cat.id ? 'brand' : 'default'} onPress={() => handleMainCategorySelect(cat)} />
             ))}"""
content = content.replace(old_cat_mapped, new_cat_mapped)

# Replace Quick Filters Mapped Chips
old_filters_mapped = """              return (
                <div key={f} onClick={() => setActiveFilter(f)} style={{ cursor: 'pointer' }}>
                   <Chip label={`\\${labels[f]} (\\${counts[f]})`} tone={activeFilter === f ? 'brand' : 'default'} />
                </div>
              );"""
new_filters_mapped = """              return (
                <Chip key={f} label={`\\${labels[f]} (\\${counts[f]})`} tone={activeFilter === f ? 'brand' : 'default'} onPress={() => setActiveFilter(f)} />
              );"""
content = content.replace(old_filters_mapped, new_filters_mapped)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced onClick divs with onPress Chips successfully.")
