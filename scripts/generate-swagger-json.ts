import { swaggerSpec } from '../src/config/swagger';
import fs from 'fs';
import path from 'path';

const outputPath = path.join(__dirname, '../swagger.json');

fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));

console.log(`✅ Swagger JSON generated at: ${outputPath}`);