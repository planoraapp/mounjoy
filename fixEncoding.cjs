const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/Dashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = {
    'Ã¡': 'á',
    'Ã©': 'é',
    'Ã­': 'í',
    'Ã³': 'ó',
    'Ãº': 'ú',
    'Ã¢': 'â',
    'Ãª': 'ê',
    'Ã®': 'î',
    'Ã´': 'ô',
    'Ã»': 'û',
    'Ã£': 'ã',
    'Ãµ': 'õ',
    'Ã§': 'ç',
    'Ã\x81': 'Á',
    'Ã‰': 'É',
    'Ã\x8D': 'Í',
    'Ã“': 'Ó',
    'Ãš': 'Ú',
    'Ã‚': 'Â',
    'ÃŠ': 'Ê',
    'ÃŽ': 'Î',
    'Ã”': 'Ô',
    'Ã›': 'Û',
    'Ãƒ': 'Ã',
    'Ã•': 'Õ',
    'Ã‡': 'Ç',
    'Ã€': 'À',
    'Ã\xAD': 'í',
    'ðŸ’Š': '💊',
    'ðŸ’‰': '💉',
    'âœ✨': '✨',
    'âœ¨': '✨',
    'âˆ’': '−',
    'Ã‡Ãƒ': 'ÇÃ',
    'Ã‡Ã': 'ÇÃ',
    'Ã§Ã£o': 'ção',
    'Ã§Ãµes': 'ções',
    'Ã‡ÃƒO': 'ÇÃO',
    'Ã\x8D': 'Í',
    'HIDRATAÃ‡ÃƒO': 'HIDRATAÇÃO',
    'PROTEÃ\x8DNA': 'PROTEÍNA',
    'PROTEÃ\x8D': 'PROTEÍ'
};

const sorted = Object.entries(replacements).sort((a, b) => b[0].length - a[0].length);

for (const [bad, good] of sorted) {
    content = content.replace(new RegExp(bad, 'g'), good);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed encoding');
