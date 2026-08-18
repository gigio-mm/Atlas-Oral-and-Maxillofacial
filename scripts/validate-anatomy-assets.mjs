import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const dataPath = path.join(projectRoot, 'constants', 'muscleData.ts');
const dataSource = fs.readFileSync(dataPath, 'utf8');
const referencedImages = [...dataSource.matchAll(/['\"](\/images\/[^'\"]+)['\"]/g)]
    .map((match) => match[1]);
const uniqueImages = [...new Set(referencedImages)];
const missingImages = uniqueImages.filter((imagePath) => (
    !fs.existsSync(path.join(projectRoot, 'public', imagePath.slice(1)))
));

if (missingImages.length > 0) {
    console.error('Imagens referenciadas pelo muscleData.ts não encontradas:');
    missingImages.forEach((imagePath) => console.error(`- ${imagePath}`));
    process.exitCode = 1;
} else {
    console.log(`Assets anatômicos validados: ${uniqueImages.length} imagens encontradas.`);
}

