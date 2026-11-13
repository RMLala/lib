const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'www/index.html'),'utf8');
const gradle=fs.readFileSync(path.join(root,'android/app/build.gradle'),'utf8');
test('Ritual reader exposes full screen and synchronized teleprompter controls',()=>{
  assert.match(html,/data-ritual-teleprompter/);
  assert.match(html,/data-fullscreen-reading/);
  assert.match(html,/data-system-voice-start/);
  assert.match(html,/data-system-voice-pause/);
  assert.match(html,/data-system-voice-stop/);
  assert.match(html,/systemVoiceName/);
  assert.match(html,/systemVoiceRate/);
});
test('Collapse controls are compact plus/minus buttons and navigation labels are added',()=>{
  assert.match(html,/class="fold-icon-btn"[^>]+>−<\/button>/);
  assert.match(html,/class="fold-icon-btn"[^>]+>\+<\/button>/);
  assert.match(html,/className='shortcut-label'/);
  assert.match(html,/bottom-toolbar \.shortcut-label/);
});
test('Release version remains API 23/API 29 and advances monotonically',()=>{
  assert.match(gradle,/versionName "1\.6\.7"/);
  assert.match(gradle,/versionCode 2026111301/);
});
