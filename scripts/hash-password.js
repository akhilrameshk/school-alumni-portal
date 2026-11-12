const bcrypt = require('bcryptjs');
const pw = process.argv[2];
if (!pw) {
  console.log('Usage: npm run hash -- "YourPassword"');
  process.exit(1);
}
const hash = bcrypt.hashSync(pw, 10);
// "$" must be escaped in .env files used by Next.js
console.log('\nAdd this line to .env.local:\n');
console.log('ADMIN_PASSWORD_HASH=' + hash.replace(/\$/g, '\\$') + '\n');
