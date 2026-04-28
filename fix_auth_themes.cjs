const fs = require('fs');

const targets = [
  'src/app/pages/Login.tsx',
  'src/app/pages/Register.tsx',
  'src/app/pages/SelectRole.tsx'
];

for (const file of targets) {
  if (fs.existsSync(file)) {
    let txt = fs.readFileSync(file, 'utf8');

    // Fix backgrounds that were inline
    txt = txt.replace(/className="((?:[^"]+)?)"\s*style=\{\{\s*background:\s*C\.bg\s*\}\}/g, 'className="$1 bg-background"');
    txt = txt.replace(/style=\{\{\s*background:\s*C\.bg\s*\}\}/g, 'className="bg-background"');

    // Replace textDark inline styles with tracking/replacing class names
    txt = txt.replace(/className="((?:[^"]+)?)"\s*style=\{\{\s*color:\s*C\.textDark\s*\}\}/g, 'className="$1 text-foreground"');
    txt = txt.replace(/style=\{\{\s*color:\s*C\.textDark\s*\}\}\s*className="((?:[^"]+)?)"/g, 'className="$1 text-foreground"');
    txt = txt.replace(/style=\{\{\s*color:\s*C\.textDark\s*\}\}/g, 'className="text-foreground"');

    // Replace textMuted
    txt = txt.replace(/className="((?:[^"]+)?)"\s*style=\{\{\s*color:\s*C\.textMuted\s*\}\}/g, 'className="$1 text-muted-foreground"');
    txt = txt.replace(/style=\{\{\s*color:\s*C\.textMuted\s*\}\}\s*className="((?:[^"]+)?)"/g, 'className="$1 text-muted-foreground"');
    txt = txt.replace(/style=\{\{\s*color:\s*C\.textMuted\s*\}\}/g, 'className="text-muted-foreground"');

    // Remove textMuted and textDark from blended styles
    txt = txt.replace(/,\s*color:\s*C\.textDark/g, ''); 
    txt = txt.replace(/color:\s*C\.textDark\s*,\s*/g, ''); 
    txt = txt.replace(/,\s*color:\s*C\.textMuted/g, ''); 
    txt = txt.replace(/color:\s*C\.textMuted\s*,\s*/g, '');

    // For inputs that had style={{ borderColor: ..., color: C.textDark }}
    // The previous regexes remove `color: C.textDark, ` leaving `{ borderColor: ... }`
    // We should also ensure `text-foreground` or `text-muted-foreground` gets into the className!
    
    // Add text-foreground to Input instances implicitly if they don't have it
    // Wait, the previous step removed `color: C.textDark`, but didn't inject `text-foreground` into className if style had multiple properties.
    txt = txt.replace(/(<Input[^>]*className="[^"]+)(")/g, function(match, p1, p2) {
      if (!p1.includes('text-foreground')) return p1 + ' text-foreground' + p2;
      return match;
    });

    // Also remove any remaining text-[#1a1a1a] or text-[#6b6b6b] standard classes we missed
    txt = txt.replace(/text-\[\#1a1a1a\]/g, 'text-foreground');
    txt = txt.replace(/text-\[\#6b6b6b\]/g, 'text-muted-foreground');
    txt = txt.replace(/bg-white/g, 'bg-card');

    fs.writeFileSync(file, txt);
    console.log(`Fixed ${file}`);
  } else {
    console.log(`Not found: ${file}`);
  }
}
