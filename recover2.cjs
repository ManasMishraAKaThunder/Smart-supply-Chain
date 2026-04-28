const fs = require('fs');
const path = require('path');

const historyDir = path.join(process.env.APPDATA, 'Code', 'User', 'History');
if (!fs.existsSync(historyDir)) {
  console.log('No history dir found');
  process.exit(1);
}

const targetPathFragment = 'Smart';
const outputDir = path.join(process.cwd(), 'recovered_history');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

let recoveredCount = 0;

function scanHistory(dir) {
  const folders = fs.readdirSync(dir);
  for (const folder of folders) {
    const p = path.join(dir, folder);
    const stat = fs.statSync(p);
    if (!stat.isDirectory()) continue;
    
    const entriesFile = path.join(p, 'entries.json');
    if (!fs.existsSync(entriesFile)) continue;
    
    try {
      const data = JSON.parse(fs.readFileSync(entriesFile, 'utf8'));
      if (data.resource) {
         let raw = decodeURIComponent(data.resource);
         if (raw.toLowerCase().includes('vama')) {
            console.log("Found:", raw);
            
            // Only recover if it has a timestamp from before today? Or just the latest.
            if (!data.entries || data.entries.length === 0) continue;
            
            // let's grab the one just before my rollback! The rollback was at ~ 19:00 local time
            // Timestamp in ms
            const rollbackTime = new Date('2026-04-12T19:00:00Z').getTime(); // Roughly
            // To be safe, just get the absolute latest. It's either today's edits or yesterday's.
            // Wait, I OVERWROTE files using Copy-Item. Copy-Item doesn't register in VS Code history unless VS Code was open and watching!
            // If VS Code was watching, it might have added an entry. Let's just grab the latest entry before my script started.
            
            let bestEntry = data.entries[data.entries.length - 1];
            
            const backupFile = path.join(p, bestEntry.id);
            if (fs.existsSync(backupFile)) {
              let relative = raw.split(/vama2[\\\/]+Smart-supply-Chain-main[\\\/]+/i)[1];
              if (relative) {
                  const dest = path.join(outputDir, relative);
                  fs.mkdirSync(path.dirname(dest), { recursive: true });
                  fs.copyFileSync(backupFile, dest);
                  console.log(`Recovered: ${relative}`);
                  recoveredCount++;
              }
            }
         }
      }
    } catch (e) {
    }
  }
}

scanHistory(historyDir);
console.log(`Recovered ${recoveredCount} files to ${outputDir}`);
