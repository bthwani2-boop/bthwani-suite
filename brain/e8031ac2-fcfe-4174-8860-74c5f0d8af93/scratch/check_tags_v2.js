const fs = require('fs');
const content = fs.readFileSync('C:\\bthwani-suite\\dsh\\frontend\\app-client\\DshStoreGetScreen.tsx', 'utf8');

const stack = [];
const lines = content.split('\n');

// A better regex that handles multi-line tags.
// Match opening tags: <Name ... > or <Name ... />
// Match closing tags: </Name>
const regex = /<(\/?)([\w\.]+)([^>]*?)(\/?)>/g;

let match;
while ((match = regex.exec(content)) !== null) {
    const isClosing = match[1] === '/';
    const tagName = match[2];
    const isSelfClosing = match[4] === '/';

    // Skip some known non-component tags if needed, but here we want all JSX.
    // Also skip fragments <> and </> if they match.
    if (!tagName) continue;

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

    if (isClosing) {
        if (stack.length === 0) {
            console.log(`Error: Unexpected closing tag </${tagName}> at line ${lineNum}`);
        } else {
            const last = stack.pop();
            if (last.name !== tagName) {
                console.log(`Error: Mismatched tag. Expected </${last.name}> (from line ${last.line}) but found </${tagName}> at line ${lineNum}`);
            }
        }
    } else if (!isSelfClosing) {
        stack.push({ name: tagName, line: lineNum });
    }
}

if (stack.length > 0) {
    stack.forEach(s => {
        console.log(`Error: Unclosed tag <${s.name}> from line ${s.line}`);
    });
}
