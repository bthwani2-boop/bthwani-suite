const fs = require('fs');

let content = fs.readFileSync('dsh/frontend/control-panel/catalogs/ControlPanelDshCatalogScreen.tsx', 'utf8');

// 1. Fix width/height
content = content.replace(
  "style={{ height: '100vh', width: '100vw', overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}",
  "style={{ height: '100%', width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}"
);

// 2. Fix Categories All Chip (remove div, use onPress)
content = content.replace(
  "<div onClick={() => handleMainCategorySelect(null)} style={{ cursor: 'pointer' }}>\n               <Chip label=\"الكل\" tone={!activeMainCategory ? 'brand' : 'default'} />\n             </div>",
  "<Chip label=\"الكل\" tone={!activeMainCategory ? 'brand' : 'default'} onPress={() => handleMainCategorySelect(null)} />"
);

// 3. Fix Categories Mapped Chips (remove div, use onPress)
// In rewrite_screen.js, it might be formatted differently. I'll use a regex for safety.
content = content.replace(
  /<div key=\{cat\.id\} onClick=\{\(\) => handleMainCategorySelect\(cat\)\} style=\{\{ cursor: 'pointer' \}\}>\s*<Chip label=\{`\$\{cat\.emojiFallback\} \$\{cat\.label\} \$\{cat\.categoryMode === 'manual-order' \? '\(يدوي\)' : ''\}`\} tone=\{activeMainCategory\?\.id === cat\.id \? 'brand' : 'default'\} \/>\s*<\/div>/g,
  "<Chip key={cat.id} label={`\\${cat.emojiFallback} \\${cat.label} \\${cat.categoryMode === 'manual-order' ? '(يدوي)' : ''}`} tone={activeMainCategory?.id === cat.id ? 'brand' : 'default'} onPress={() => handleMainCategorySelect(cat)} />"
);

// 4. Fix Quick Filters Mapped Chips (remove div, use onPress)
content = content.replace(
  /<div key=\{f\} onClick=\{\(\) => setActiveFilter\(f\)\} style=\{\{ cursor: 'pointer' \}\}>\s*<Chip label=\{`\$\{labels\[f\]\} \(\$\{counts\[f\]\}\)`\} tone=\{activeFilter === f \? 'brand' : 'default'\} \/>\s*<\/div>/g,
  "<Chip key={f} label={`\\${labels[f]} (\\${counts[f]})`} tone={activeFilter === f ? 'brand' : 'default'} onPress={() => setActiveFilter(f)} />"
);

// 5. Add Placeholder at the very end
const placeholder = `        {workspaceMode !== 'catalog' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', padding: '48px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>🚧</div>
            <Text role="titleLg" style={{ color: '#0A2F5C' }}>قيد التطوير والربط</Text>
            <Text role="body" tone="muted" style={{ marginTop: '8px', textAlign: 'center', maxWidth: '400px' }}>
              هذه الشاشة (مساحة العمل الحالية) تعتبر جزءاً من المرحلة القادمة. الواجهة متوفرة وجاهزة للربط مع الأنظمة الخلفية لاحقاً.
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}`;

const lastOccurrenceIndex = content.lastIndexOf("      </div>\n    </div>\n  );\n}");
if (lastOccurrenceIndex !== -1) {
  content = content.slice(0, lastOccurrenceIndex) + placeholder + content.slice(lastOccurrenceIndex + "      </div>\n    </div>\n  );\n}".length);
}

fs.writeFileSync('dsh/frontend/control-panel/catalogs/ControlPanelDshCatalogScreen.tsx', content);
console.log("Fixes applied successfully.");
