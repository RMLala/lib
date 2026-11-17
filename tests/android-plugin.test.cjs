const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const nativePlugin = fs.readFileSync(path.join(root, 'native/android/LibertyDevicePlugin.java'), 'utf8');
const generatedPlugin = fs.readFileSync(path.join(root, 'android/app/src/main/java/mg/libertelibre/app/LibertyDevicePlugin.java'), 'utf8');
const prepareAndroid = fs.readFileSync(path.join(root, 'scripts/prepare-android.mjs'), 'utf8');
const nativeExport = fs.readFileSync(path.join(root, 'native/android/DataExportPlugin.java'), 'utf8');
const generatedExport = fs.readFileSync(path.join(root, 'android/app/src/main/java/mg/libertelibre/app/DataExportPlugin.java'), 'utf8');

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

test('Android plugin exposes native print-to-PDF bridge', () => {
  assert.match(nativePlugin, /void printHtml\(PluginCall call\)/);
  assert.match(nativePlugin, /PrintManager/);
  assert.match(nativePlugin, /createPrintDocumentAdapter/);
  assert.match(generatedPlugin, /void printHtml\(PluginCall call\)/);
});

test('Android backup plugin shares JSON and restores it through the document picker',()=>{
  assert.equal(generatedExport,nativeExport);
  assert.match(prepareAndroid,/native\/android\/DataExportPlugin\.java/);
  assert.match(nativeExport,/Intent\.ACTION_SEND/);
  assert.match(nativeExport,/FileProvider\.getUriForFile/);
  assert.match(nativeExport,/Intent\.ACTION_OPEN_DOCUMENT/);
  assert.match(nativeExport,/MAX_BACKUP_BYTES/);
});

test('Background audio playback is wired to a foreground service for screen lock',()=>{
 const nativeAudio=fs.readFileSync(path.join(root,'native/android/LibertyBackgroundAudioPlugin.java'),'utf8');
 const generatedAudio=fs.readFileSync(path.join(root,'android/app/src/main/java/mg/libertelibre/app/LibertyBackgroundAudioPlugin.java'),'utf8');
 const service=fs.readFileSync(path.join(root,'native/android/LibertyAudioService.java'),'utf8');
 const generatedService=fs.readFileSync(path.join(root,'android/app/src/main/java/mg/libertelibre/app/LibertyAudioService.java'),'utf8');
 const activity=fs.readFileSync(path.join(root,'android/app/src/main/java/mg/libertelibre/app/MainActivity.java'),'utf8');
 const manifest=fs.readFileSync(path.join(root,'android/app/src/main/AndroidManifest.xml'),'utf8');
 assert.equal(generatedAudio,nativeAudio);assert.equal(generatedService,service);
 assert.match(prepareAndroid,/LibertyBackgroundAudioPlugin\.java/);assert.match(prepareAndroid,/LibertyAudioService\.java/);
 assert.match(activity,/registerPlugin\(LibertyBackgroundAudioPlugin\.class\)/);
 assert.match(manifest,/FOREGROUND_SERVICE_MEDIA_PLAYBACK/);assert.match(manifest,/foregroundServiceType="mediaPlayback"/);
 assert.match(service,/ACTION_PAUSE/);assert.match(service,/ACTION_RESUME/);assert.match(service,/PARTIAL_WAKE_LOCK/);
 assert.match(nativeAudio,/Base64\.decode/);
});
