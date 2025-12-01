import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('@prisma/client');
console.log(Object.keys(pkg));
