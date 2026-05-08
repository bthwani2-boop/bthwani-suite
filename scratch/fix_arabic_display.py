import os

path = 'C:/bthwani-suite/dsh/frontend/control-panel/catalogs/ControlPanelDshCatalogScreen.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace broken template literals
content = content.replace('\\${', '${')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed broken template literals successfully.")
