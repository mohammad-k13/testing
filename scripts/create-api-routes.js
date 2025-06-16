// scripts/create-api-routes.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Simulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target base directory: app/api
const baseDir = path.join(__dirname, '../app/api');

// All API routes to generate
const routes = [
      ['auth/session', ['GET']],
      ['auth/sign-out', ['POST']],
      ['public/food-categories', ['GET']],
      ['public/meal-options', ['GET']],
      ['public/recommendations', ['GET']],
      ['user/profile', ['GET', 'PUT']],
      ['user/meal-logs', ['GET', 'POST']],
      ['user/meal-logs/[id]', ['DELETE']],
      ['user/workout-logs', ['GET', 'POST']],
      ['user/workout-logs/[id]', ['DELETE']],
      ['user/body-metrics', ['GET', 'POST']],
      ['user/body-metrics/[id]', ['PUT', 'DELETE']],
      ['admin/users', ['GET']],
      ['admin/users/[id]/role', ['PUT']],
      ['admin/food-categories', ['GET', 'POST']],
      ['admin/food-categories/[id]', ['PUT', 'DELETE']],
      ['admin/food-units', ['GET', 'POST']],
      ['admin/food-units/[id]', ['PUT', 'DELETE']],
      ['admin/meal-options', ['GET', 'POST']],
      ['admin/meal-options/[id]', ['PUT', 'DELETE']],
      ['admin/recommendations', ['GET', 'POST']],
      ['admin/recommendations/[id]', ['PUT', 'DELETE']],
];

// Create boilerplate route.ts file
function createRouteFile(dirPath, methods) {
      const filePath = path.join(dirPath, 'route.ts');

      if (fs.existsSync(filePath)) {
            console.log(`⚠️  Skipped (already exists): ${filePath}`);
            return;
      }

      const content = methods
            .map(
                  (method) =>
                        `export async function ${method}() {\n  return Response.json({ message: "${method} not implemented" });\n}`,
            )
            .join('\n\n');

      fs.writeFileSync(filePath, content);
      console.log(`✅ Created: ${filePath}`);
}

// Create folders and files
routes.forEach(([routePath, methods]) => {
      const fullPath = path.join(baseDir, routePath);
      fs.mkdirSync(fullPath, { recursive: true });
      createRouteFile(fullPath, methods);
});
