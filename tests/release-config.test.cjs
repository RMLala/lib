const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const gradle = fs.readFileSync(path.join(root, 'android/app/build.gradle'), 'utf8');
const workflow = fs.readFileSync(path.join(root, '.github/workflows/android-release.yml'), 'utf8');
test('Release has API 23 and API 29 signed variants plus two Debug APKs', () => {
  assert.match(gradle, /api23[\s\S]*minSdkVersion 23/);
  assert.match(gradle, /api29[\s\S]*minSdkVersion 29/);
  assert.match(gradle, /signingConfig signingConfigs\.release/);
  assert.match(workflow, /assembleApi23Debug assembleApi29Debug/);
  assert.match(workflow, /assembleApi23Release assembleApi29Release/);
  assert(workflow.includes('pull_request:\n    branches: [main]'), 'Missing PR trigger on main');
  assert(workflow.includes("if: github.event_name != 'pull_request'"), 'Release signing must skip PRs');
  for (const secret of ['ANDROID_RELEASE_KEY_BASE64','ANDROID_RELEASE_STORE_PASSWORD','ANDROID_RELEASE_KEY_ALIAS','ANDROID_RELEASE_KEY_PASSWORD']) assert(workflow.includes(secret), `Missing ${secret}`);
});
