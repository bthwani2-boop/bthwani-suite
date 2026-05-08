import os

path = 'C:/bthwani-suite/dsh/frontend/control-panel/catalogs/ControlPanelDshCatalogScreen.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

placeholder = """
        {workspaceMode !== 'catalog' && (
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
}"""

content = content.replace("      </div>\n    </div>\n  );\n}", placeholder)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Added placeholder for empty tabs.")
