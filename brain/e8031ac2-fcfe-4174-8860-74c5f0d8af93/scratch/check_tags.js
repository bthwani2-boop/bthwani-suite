const fs = require('fs');
const content = fs.readFileSync('C:\\bthwani-suite\\dsh\\frontend\\app-client\\DshStoreGetScreen.tsx', 'utf8');

const tags = [];
const regex = /<(Box|View|Modal|Pressable|Surface|Animated\.View|FlatList|Animated\.FlatList|Text|Chip|Button|Icon|TopBar|SearchTopBar|StateView|BannerCarousel|ProductCard|MenuItemCard|Toast|ScrollView|View|Animated\.View)(?:\s+[^>]*?)?(\/?)>|<\/(Box|View|Modal|Pressable|Surface|Animated\.View|FlatList|Animated\.FlatList|Text|Chip|Button|Icon|TopBar|SearchTopBar|StateView|BannerCarousel|ProductCard|MenuItemCard|Toast|ScrollView|View|Animated\.View)>/g;

let match;
let stack = [];
const lines = content.split('\n');

while ((match = regex.exec(content)) !== null) {
    const isClosing = !!match[3];
    const isSelfClosing = !!match[2];
    const tagName = match[3] || match[1];

    // Find line number
    const pos = match.index;
    let lineNum = 1;
    let currentPos = 0;
    for (let i = 0; i < lines.length; i++) {
        if (currentPos + lines[i].length >= pos) {
            lineNum = i + 1;
            break;
        }
        currentPos += lines[i].length + 1;
    }

    if (isSelfClosing) {
        // console.log(`Self-closing: ${tagName} at line ${lineNum}`);
    } else if (isClosing) {
        if (stack.length === 0) {
            console.log(`Error: Unexpected closing tag </${tagName}> at line ${lineNum}`);
        } else {
            const last = stack.pop();
            if (last.name !== tagName) {
                console.log(`Error: Mismatched tag. Expected </${last.name}> (from line ${last.line}) but found </${tagName}> at line ${lineNum}`);
            }
        }
    } else {
        stack.push({ name: tagName, line: lineNum });
    }
}

if (stack.length > 0) {
    stack.forEach(s => {
        console.log(`Error: Unclosed tag <${s.name}> from line ${s.line}`);
    });
}
