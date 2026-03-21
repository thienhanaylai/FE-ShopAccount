const fs = require('fs');
const buffer = fs.readFileSync('lint_report.json');
let content = buffer.toString('utf16le');
// Support for JSON output might have BOM
if (content.charCodeAt(0) === 0xFEFF) {
  content = content.slice(1);
}
const data = JSON.parse(content);
data.forEach(file => {
  if (file.messages.length > 0) {
    console.log(`File: ${file.filePath}`);
    file.messages.forEach(msg => {
      console.log(`  Line ${msg.line}: ${msg.message} (${msg.ruleId})`);
    });
  }
});
