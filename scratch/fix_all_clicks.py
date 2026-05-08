import os

path = 'C:/bthwani-suite/dsh/frontend/control-panel/catalogs/ControlPanelDshCatalogScreen.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix Tabs: Change <div onClick> to <button onClick>
old_tabs = """             {[
               { id: 'catalog', label: 'الكتالوج' },
               { id: 'quick-entry', label: 'إدخال سريع' },
               { id: 'partner-entry', label: 'الشريك' },
               { id: 'field-intake', label: 'الميدان' },
               { id: 'duplicate-resolution', label: 'تكرارات' },
               { id: 'category-mapping', label: 'ربط' },
               { id: 'media-governance', label: 'ميديا' }
             ].map(tab => (
                <div key={tab.id} onClick={() => { setWorkspaceMode(tab.id as WorkspaceMode); setSelectedProductId(null); }} style={{ padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', backgroundColor: workspaceMode === tab.id ? '#FFFFFF' : 'transparent', boxShadow: workspaceMode === tab.id ? '0 1px 2px rgba(0,0,0,0.05)' : 'none' }}>
                   <Text role="caption" style={{ fontWeight: workspaceMode === tab.id ? 800 : 600, color: workspaceMode === tab.id ? '#0A2F5C' : '#64748B' }}>{tab.label}</Text>
                </div>
             ))}"""

new_tabs = """             {[
               { id: 'catalog', label: 'الكتالوج' },
               { id: 'quick-entry', label: 'إدخال سريع' },
               { id: 'partner-entry', label: 'الشريك' },
               { id: 'field-intake', label: 'الميدان' },
               { id: 'duplicate-resolution', label: 'تكرارات' },
               { id: 'category-mapping', label: 'ربط' },
               { id: 'media-governance', label: 'ميديا' }
             ].map(tab => (
                <button key={tab.id} onClick={() => { setWorkspaceMode(tab.id as WorkspaceMode); setSelectedProductId(null); }} style={{ all: 'unset', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', backgroundColor: workspaceMode === tab.id ? '#FFFFFF' : 'transparent', boxShadow: workspaceMode === tab.id ? '0 1px 2px rgba(0,0,0,0.05)' : 'none', display: 'block' }}>
                   <Text role="caption" style={{ fontWeight: workspaceMode === tab.id ? 800 : 600, color: workspaceMode === tab.id ? '#0A2F5C' : '#64748B' }}>{tab.label}</Text>
                </button>
             ))}"""

content = content.replace(old_tabs, new_tabs)

# 2. Fix Categories All Chip: wrap in <button>
old_cat_all = """<Chip label="الكل" tone={!activeMainCategory ? 'brand' : 'default'} onPress={() => handleMainCategorySelect(null)} />"""
new_cat_all = """<button onClick={() => handleMainCategorySelect(null)} style={{ all: 'unset', cursor: 'pointer', display: 'block' }}><Chip label="الكل" tone={!activeMainCategory ? 'brand' : 'default'} /></button>"""
content = content.replace(old_cat_all, new_cat_all)

# 3. Fix Categories Mapped Chips: wrap in <button>
old_cat_mapped = """             {dshCatalogCategories.map(cat => (
               <Chip key={cat.id} label={`\\${cat.emojiFallback} \\${cat.label} \\${cat.categoryMode === 'manual-order' ? '(يدوي)' : ''}`} tone={activeMainCategory?.id === cat.id ? 'brand' : 'default'} onPress={() => handleMainCategorySelect(cat)} />
             ))}"""
new_cat_mapped = """             {dshCatalogCategories.map(cat => (
               <button key={cat.id} onClick={() => handleMainCategorySelect(cat)} style={{ all: 'unset', cursor: 'pointer', display: 'block' }}>
                 <Chip label={`\\${cat.emojiFallback} \\${cat.label} \\${cat.categoryMode === 'manual-order' ? '(يدوي)' : ''}`} tone={activeMainCategory?.id === cat.id ? 'brand' : 'default'} />
               </button>
             ))}"""
content = content.replace(old_cat_mapped, new_cat_mapped)

# 4. Fix Quick Filters Mapped Chips: wrap in <button>
old_filters_mapped = """              return (
                <Chip key={f} label={`\\${labels[f]} (\\${counts[f]})`} tone={activeFilter === f ? 'brand' : 'default'} onPress={() => setActiveFilter(f)} />
              );"""
new_filters_mapped = """              return (
                <button key={f} onClick={() => setActiveFilter(f)} style={{ all: 'unset', cursor: 'pointer', display: 'block' }}>
                   <Chip label={`\\${labels[f]} (\\${counts[f]})`} tone={activeFilter === f ? 'brand' : 'default'} />
                </button>
              );"""
content = content.replace(old_filters_mapped, new_filters_mapped)

# 5. Fix Subcategories map (already a div, make it a button)
old_subcat_all = """             <div onClick={() => setActiveSubCategory(null)} style={{ cursor: 'pointer' }}>
               <Text role="caption" style={{ fontWeight: !activeSubCategory ? 800 : 600, color: !activeSubCategory ? '#0A2F5C' : '#64748B', backgroundColor: !activeSubCategory ? '#E2E8F0' : 'transparent', padding: '2px 8px', borderRadius: '12px' }}>الكل</Text>
             </div>"""
new_subcat_all = """             <button onClick={() => setActiveSubCategory(null)} style={{ all: 'unset', cursor: 'pointer', display: 'block' }}>
               <Text role="caption" style={{ fontWeight: !activeSubCategory ? 800 : 600, color: !activeSubCategory ? '#0A2F5C' : '#64748B', backgroundColor: !activeSubCategory ? '#E2E8F0' : 'transparent', padding: '2px 8px', borderRadius: '12px' }}>الكل</Text>
             </button>"""
content = content.replace(old_subcat_all, new_subcat_all)

old_subcat_mapped = """             {activeMainCategory.subcategories.map(sub => (
               <div key={sub.id} onClick={() => setActiveSubCategory(sub)} style={{ cursor: 'pointer' }}>
                 <Text role="caption" style={{ fontWeight: activeSubCategory?.id === sub.id ? 800 : 600, color: activeSubCategory?.id === sub.id ? '#0A2F5C' : '#64748B', backgroundColor: activeSubCategory?.id === sub.id ? '#E2E8F0' : 'transparent', padding: '2px 8px', borderRadius: '12px' }}>{sub.label}</Text>
               </div>
             ))}"""
new_subcat_mapped = """             {activeMainCategory.subcategories.map(sub => (
               <button key={sub.id} onClick={() => setActiveSubCategory(sub)} style={{ all: 'unset', cursor: 'pointer', display: 'block' }}>
                 <Text role="caption" style={{ fontWeight: activeSubCategory?.id === sub.id ? 800 : 600, color: activeSubCategory?.id === sub.id ? '#0A2F5C' : '#64748B', backgroundColor: activeSubCategory?.id === sub.id ? '#E2E8F0' : 'transparent', padding: '2px 8px', borderRadius: '12px' }}>{sub.label}</Text>
               </button>
             ))}"""
content = content.replace(old_subcat_mapped, new_subcat_mapped)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced all clickable divs and Chips with native <button> wrappers for absolute clickability.")
