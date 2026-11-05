const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const nativePlugin = fs.readFileSync(path.join(root, 'native/android/LibertyDevicePlugin.java'), 'utf8');
const generatedPlugin = fs.readFileSync(path.join(root, 'android/app/src/main/java/mg/libertelibre/app/LibertyDevicePlugin.java'), 'utf8');
const prepareAndroid = fs.readFileSync(path.join(root, 'scripts/prepare-android.mjs'), 'utf8');

test('Android microphone permission state uses the Capacitor API import', () => {
  assert.match(nativePlugin, /^import com\.getcapacitor\.PermissionState;$/m);
  assert.match(generatedPlugin, /^import com\.getcapacitor\.PermissionState;$/m);
});

test('Android native plugin remains the source copied during prepare', () => {
  assert.match(prepareAndroid, /native\/android\/LibertyDevicePlugin\.java/);
  assert.match(prepareAndroid, /LibertyDevicePlugin\.java/);
});

// A later sync must never reintroduce an outdated generated plugin.
test('Native source and Android copy are identical', () => {
  assert.equal(generatedPlugin, nativePlugin);
});

assert.match(nativePlugin, /^import androidx\.activity\.result\.ActivityResult;$/m);
assert.match(generatedPlugin, /^import androidx\.activity\.result\.ActivityResult;$/m);
assert.match(nativePlugin, /^import com\.getcapacitor\.annotation\.PermissionCallback;$/m);
assert.match(generatedPlugin, /^import com\.getcapacitor\.annotation\.PermissionCallback;$/m);

require('node:test')('All audio permissions requested by Capacitor are declared',()=>{const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');const manifest=fs.readFileSync(path.join(__dirname,'../android/app/src/main/AndroidManifest.xml'),'utf8');for(const permission of ['RECORD_AUDIO','MODIFY_AUDIO_SETTINGS'])assert(manifest.includes('android.permission.'+permission),permission+' missing');});
