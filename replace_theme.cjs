const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/lr690/OneDrive/Desktop/जय-बजरंग-गणेश-उत्सव/src';

const replacements = [
  // Gradients
  { regex: /bg-gradient-to-[a-z]+ from-\[#[A-F0-9]+\] to-\[#[A-F0-9]+\]/gi, replacement: 'bg-theme-gradient' },
  { regex: /bg-\[linear-gradient\([^)]+\)\]/gi, replacement: 'bg-theme-gradient' }, // catch specific linear-gradients if any
  
  // Backgrounds
  { regex: /bg-\[\#FF7A00\]/gi, replacement: 'bg-theme-gradient' },
  { regex: /bg-\[\#FF6A00\]/gi, replacement: 'bg-theme-gradient' },
  { regex: /bg-\[\#FF8C00\]/gi, replacement: 'bg-theme-gradient' },
  { regex: /bg-\[\#FF8A00\]/gi, replacement: 'bg-theme-gradient' },

  // Text colors
  { regex: /text-\[\#FF7A00\]/gi, replacement: 'text-theme-primary' },
  { regex: /text-\[\#FF6A00\]/gi, replacement: 'text-theme-primary' },

  // Border colors
  { regex: /border-\[\#FF7A00\]/gi, replacement: 'border-theme-primary' },
  { regex: /border-\[\#FF6A00\]/gi, replacement: 'border-theme-primary' },
];

function processDir(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      for (const { regex, replacement } of replacements) {
        if (regex.test(content)) {
          // Special exception for Dashboard cards with specific red/pink/orange gradients?
          // The user said "app ke orang them collar ko hata ke"
          // If the regex replaces the Dashboard card's custom gradients, that might be fine or not.
          // Dashboard has: `bg-[linear-gradient(135deg,#D32F2F_0%,#E53935_50%,#FF6B6B_100%)]` - this should NOT be replaced by the bg-theme-gradient, because it's a specific red card!
          // Wait, the regex `/bg-\[linear-gradient\([^)]+\)\]/` would replace the red one too! Let's remove that regex.
          content = content.replace(regex, replacement);
          modified = true;
        }
      }
      if (modified) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

// Modify replacements to NOT catch the red/pink linear gradients
replacements.splice(1, 1); // remove the general linear-gradient regex
// Actually let's explicitly target the orange linear-gradient in Dashboard
replacements.push({ regex: /bg-\[linear-gradient\(135deg,#FF6A00_0%,#FF8500_50%,#FFA726_100%\)\]/gi, replacement: 'bg-theme-gradient' });

processDir(dir);
console.log('Theme replacement complete!');
