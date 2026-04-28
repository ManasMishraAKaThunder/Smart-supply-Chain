const fs = require('fs');

const targets = [
  'src/app/pages/VamaLanding.tsx',
  'src/app/pages/Login.tsx',
  'src/app/pages/Register.tsx',
  'src/app/pages/SelectRole.tsx'
];

const replaces = [
  // Backgrounds
  [/bg-\[\#FAF7F2\]/g, 'bg-background'],
  [/bg-\[\#F8F6F2\]/g, 'bg-background'],
  [/bg-white/g, 'bg-card'],
  [/bg-gray-50/g, 'bg-accent'],
  [/bg-gray-100/g, 'bg-accent'],
  [/bg-slate-50/g, 'bg-accent'],
  
  // Text colors
  [/text-gray-900/g, 'text-foreground'],
  [/text-\[\#1A1A1A\]/g, 'text-foreground'],
  [/text-gray-800/g, 'text-foreground'],
  [/text-gray-700/g, 'text-muted-foreground'],
  [/text-gray-600/g, 'text-muted-foreground'],
  [/text-gray-500/g, 'text-muted-foreground'],
  [/text-\[\#444444\]/g, 'text-muted-foreground'],
  [/text-\[\#555555\]/g, 'text-muted-foreground'],
  
  // Brand colors
  [/text-\[\#8B004A\]/g, 'text-primary'],
  [/bg-\[\#8B004A\]/g, 'bg-primary'],
  [/border-\[\#8B004A\]/g, 'border-primary'],
  [/hover:bg-\[\#6e003c\]/g, 'hover:bg-primary\/90'],
  
  // Borders
  [/border-gray-100/g, 'border-border'],
  [/border-gray-200/g, 'border-border']
];

for (const file of targets) {
  if (fs.existsSync(file)) {
    let txt = fs.readFileSync(file, 'utf8');
    for (const [regex, replacement] of replaces) {
      txt = txt.replace(regex, replacement);
    }
    fs.writeFileSync(file, txt);
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
}
