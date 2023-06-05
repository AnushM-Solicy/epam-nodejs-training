import fs from 'fs';
import path from 'path';

function findDeepestDir(startPath) {
    let maxDepth = 0;
    let deepest = '';

    function traverse(currentPath, depth) {
        const files = fs.readdirSync(currentPath);

        for (const file of files) {
            const filePath = path.join(currentPath, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                traverse(filePath, depth + 1);
            } else if (depth > maxDepth) {
                maxDepth = depth;
                deepest = currentPath;
            }
        }
    }

    traverse(startPath, 0);

    return deepest;
}

const currentFilePath = new URL(import.meta.url).pathname;
const currentDirectory = path.dirname(currentFilePath);
const nmPath = path.join(currentDirectory, 'node_modules');
const deepest = findDeepestDir(nmPath);

if (deepest) {
    const filePath = path.join(deepest, 'file.txt');
    fs.writeFileSync(filePath, 'Hello, World!');
} else {
    console.log('No deepest directory found inside node_modules.');
}
