const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const read = p => fs.readFileSync(path.join(root,p),'utf8');

test('Liberté V3: all three published HTML variants contain the actual app and support', () => {
  const paths=['Liberte_Premium_1.6.14.html','www/index.html','android/app/src/main/assets/public/index.html'];
  for(const p of paths){
    const html=read(p);
    assert.ok(html.length>10000,`${p}: application HTML missing or truncated`);
    assert.match(html,/appforgeAboutSupport/,`${p}: About & Support missing`);
    assert.match(html,/AppForge Studio/,`${p}: branding missing`);
    assert.match(html,/Made in Madagascar/,`${p}: origin missing`);
    assert.match(html,/lalainaadclick@gmail\.com/,`${p}: support email missing`);
    assert.doesNotMatch(html,/id=["']version-history["']/i,`${p}: forbidden version-history section`);
  }
});
test('Liberté V3: native biometric methods and PIN fallback semantics remain present', () => {
  const java=read('native/android/LibertyDevicePlugin.java');
  assert.match(java,/void biometricAvailability\(PluginCall call\)/);
  assert.match(java,/void authenticateBiometric\(PluginCall call\)/);
  assert.match(java,/BIOMETRIC_WEAK/);
  assert.match(java,/Utiliser le PIN/);
  assert.match(java,/FragmentActivity/);
});
test('Liberté V3: version and Android build variants are configured',()=>{
  const pkg=JSON.parse(read('package.json'));
  assert.match(pkg.version,/^\d+\.\d+\.\d+$/);
  const workflow=read('.github/workflows/android-release.yml');
  for(const variant of ['assembleApi23Debug','assembleApi29Debug','assembleApi23Release','assembleApi29Release'])assert.ok(workflow.includes(variant),`missing ${variant}`);
});
