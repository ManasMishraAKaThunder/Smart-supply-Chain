const fs = require('fs');
const path = require('path');

const historyDir = path.join(process.env.APPDATA, 'Code', 'User', 'History');
if (!fs.existsSync(historyDir)) {
  console.log('No history dir found');
  process.exit(1);
}

const targetPathFragment = 'Smart-supply-Chain-main';
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
      if (data.resource && decodeURIComponent(data.resource).includes(targetPathFragment)) {
        // Find the latest entry
        if (!data.entries || data.entries.length === 0) continue;
        const latestEntry = data.entries[data.entries.length - 1];
        
        // Read the actual backed up file
        const backupFile = path.join(p, latestEntry.id);
        if (fs.existsSync(backupFile)) {
          // Determine relative path
          const rawUri = decodeURIComponent(data.resource);
          let relative = rawUri.split(targetPathFragment)[1];
          if (relative.startsWith('/') || relative.startsWith('\\')) {
            relative = relative.substring(1);
          }
          
          const dest = path.join(outputDir, relative);
          fs.mkdirSync(path.dirname(dest), { recursive: true });
          fs.copyFileSync(backupFile, dest);
          console.log(`Recovered: ${relative}`);
          recoveredCount++;
        }
      }
    } catch (e) {
      // console.error('Error parsing', entriesFile, e.message);
    }
  }
}

scanHistory(historyDir);
console.log(`Recovered ${recoveredCount} files to ${outputDir}`);
