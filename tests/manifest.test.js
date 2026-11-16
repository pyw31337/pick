const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'manifest.json'), 'utf8'));

test('asks for site access only when the user starts analysis', () => {
  assert.equal(manifest.host_permissions, undefined);
  assert.deepEqual(manifest.optional_host_permissions, ['http://*/*', 'https://*/*']);
  assert.equal(manifest.content_scripts, undefined);
  assert.ok(manifest.permissions.includes('activeTab'));
  assert.ok(!manifest.permissions.includes('declarativeNetRequest'));
});
