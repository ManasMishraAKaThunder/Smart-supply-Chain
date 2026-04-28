const fs = require('fs');
const path = require('path');
const target = 'C:\\Users\\USER\\.gemini\\antigravity\\brain';

function findOverview(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (let f of files) {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            findOverview(p);
        } else {
            if (f === 'overview.txt') {
                console.log("FOUND LOG:", p);
            }
        }
    }
}
findOverview(target);
