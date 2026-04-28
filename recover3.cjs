const fs = require('fs');
const path = require('path');

const historyDir = path.join(process.env.APPDATA, 'Code', 'User', 'History');
if (!fs.existsSync(historyDir)) {
  console.log('No history dir found');
  process.exit(1);
}

const outputDir = path.join(process.cwd(), 'recovered_history');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, {recursive:true});

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
      if (data.resource && decodeURIComponent(data.resource).toLowerCase().includes('vama2')) {
        let raw = decodeURIComponent(data.resource);
        
        // Find latest timestamp before the rollback incident which was around 19:00 today.
        // Today is April 12, 2026. Let's just find the latest file entirely!
        if (!data.entries || data.entries.length === 0) continue;
        
        let bestEntry = null;
        let highestTs = 0;
        
        for (let entry of data.entries) {
           if (entry.timestamp > highestTs) {
               highestTs = entry.timestamp;
               bestEntry = entry;
           }
        }
        
        if (bestEntry) {
          const backupFile = path.join(p, bestEntry.id);
          if (fs.existsSync(backupFile)) {
             // raw looks like "file:///d:/vama2/Smart-supply-Chain-main/src/..."
             const parts = raw.split(/vama2[\\\/]+Smart-supply-Chain-main[\\\/]+/i);
             // handle both Windows and URI path separators
             const relative = parts.length > 1 ? parts[1] : (raw.split('Smart-supply-Chain-main/')[1] || raw.split('Smart-supply-Chain-main\\')[1]);
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
