const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const read = p => fs.readFileSync(path.join(root,p),'utf8');

test('Liberté V3: all three published HTML variants contain the actual app and support', () => {
  const paths=['Liberte_Premium_1.6.22.html','www/index.html','android/app/src/main/assets/public/index.html'];
  for(const p of paths){
    const html=read(p);
    assert.ok(html.length>10000,`${p}: application HTML missing or truncated`);
    assert.match(html,/appforgeAboutSupport/,`${p}: About & Support missing`);
    assert.match(html,/AppForge Studio/,`${p}: branding missing`);
    assert.match(html,/Made in Madagascar/,`${p}: origin missing`);
    assert.match(html,/lalainaadclick@gmail\.com/,`${p}: support email missing`);
    assert.doesNotMatch(html,/id=["']version-history["']/i,`${p}: forbidden version-history section`);
    assert.doesNotMatch(html,/manifest\.webmanifest|serviceWorker\.register/i,`${p}: PWA output is not part of Liberté delivery`);
  }
});
test('Liberté V3: native biometric methods and PIN fallback semantics remain present', () => {
  const java=read('native/android/LibertyDevicePlugin.java');
  const html=read('www/index.html');
  assert.match(java,/void biometricAvailability\(PluginCall call\)/);
  assert.match(java,/void authenticateBiometric\(PluginCall call\)/);
  assert.match(java,/BIOMETRIC_WEAK/);
  assert.match(java,/Utiliser le PIN/);
  assert.match(java,/FragmentActivity/);
  assert.match(java,/isFinishing\(\) \|\| fragmentActivity\.isDestroyed\(\)/);
  assert.match(java,/Lifecycle\.State\.STARTED/);
  assert.match(java,/startBiometricAuthentication\(call, true\)/);
  assert.match(html,/nativeCall\('authenticateBiometric'/);
});
test('Liberté Cloud sync uses a license token without client account fields',()=>{
  const html=read('www/index.html');
  assert.match(html,/licenseAccessActive=true/);
  assert.match(html,/\/v1\/cloud\/token/);
  assert.match(html,/\/v1\/cloud\/snapshot/);
  assert.match(html,/cloudTokenExpiresAt/);
  assert.match(html,/afCloudRead/);
  assert.match(html,/initializeCloud\(\)/);
  assert.doesNotMatch(html,/afCloudEmail|afCloudPassword|afCloudOrg|\/v1\/auth\/login|organizations\//i);
});
test('Android Drive backup uses native sharing and file selection, without OAuth',()=>{
  const java=read('native/android/DataExportPlugin.java'),html=read('www/index.html');
  assert.match(java,/void share\(PluginCall call\)/);
  assert.match(java,/Intent\.ACTION_SEND/);
  assert.match(java,/Intent\.createChooser/);
  assert.match(java,/void restore\(PluginCall call\)/);
  assert.match(java,/Intent\.ACTION_OPEN_DOCUMENT/);
  assert.match(html,/DataExport','share'/);
  assert.match(html,/DataExport','restore'/);
  assert.match(html,/BACKUP_ENCRYPTED_FORMAT/);
  assert.match(html,/AES-256-GCM/);
  assert.match(html,/object-fit:cover/);
});
test('Liberté V3: version and Android build variants are configured',()=>{
  const pkg=JSON.parse(read('package.json'));
  assert.equal(pkg.version,'1.6.22');
  const workflow=read('.github/workflows/android-release.yml');
  for(const variant of ['assembleApi23Debug','assembleApi29Debug','assembleApi23Release','assembleApi29Release'])assert.ok(workflow.includes(variant),`missing ${variant}`);
});
