const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const gradle = fs.readFileSync(path.join(root, 'android/app/build.gradle'), 'utf8');
const workflow = fs.readFileSync(path.join(root, '.github/workflows/android-release.yml'), 'utf8');
test('Release has API 23 and API 29 signed variants plus a Debug APK', () => {
  assert.match(gradle, /api23[\s\S]*minSdkVersion 23/);
  assert.match(gradle, /api29[\s\S]*minSdkVersion 29/);
  assert.match(gradle, /signingConfig signingConfigs\.release/);
  assert.match(workflow, /assembleApi23Debug assembleApi23Release assembleApi29Release/);
  for (const secret of ['KEYSTORE_BASE64','KEYSTORE_PASSWORD','KEY_ALIAS','KEY_PASSWORD']) assert(workflow.includes(secret), `Missing ${secret}`);
});
