const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../www/index.html'),'utf8');

test('Mobile reader keeps the text pane visible and tucks secondary controls away',()=>{
  assert.match(html,/reader-settings-drawer/);
  assert.match(html,/reader-quick-controls/);
  assert.match(html,/resource-reader-text\{min-height:0[^}]*flex:1 1 0/);
});

test('Gemini accepts one session-only API key and calls the current Flash model directly',()=>{
  assert.match(html,/id="geminiApiKey" type="password"/);
  assert.match(html,/gemini-3\.8-flash:generateContent/);
  assert.match(html,/x-goog-api-key/);
  assert.doesNotMatch(html,/id="geminiServerUrl"|id="geminiAccessCode"/);
});

test('License client uses AppForge public routes and preserves a signed offline proof',()=>{
  assert.match(html,/appforge-license-api\.appforge-licences-mg\.workers\.dev/);
  assert.match(html,/\/v1\/trial/);
  assert.match(html,/\/v1\/activate/);
  assert.match(html,/\/v1\/status/);
  assert.match(html,/LIBERTE-V1/);
  assert.match(html,/crypto\.subtle\.verify/);
});

test('Cloud sync uses the stable app snapshot route and requires explicit conflict resolution',()=>{
  assert.match(html,/appforge-cloud-api\.appforge-licences-mg\.workers\.dev/);
  assert.ok(html.includes("'/v1/organizations/'+encodeURIComponent(cloudOrg)+'/apps/'+APP_ID+'/snapshot'"));
  assert.match(html,/expectedRevision:cloudRevision/);
  assert.match(html,/Les copies diffèrent/);
  assert.match(html,/Remplacer toute la copie Cloud/);
  assert.match(html,/chiffrés de bout en bout/);
});

test('Android biometric prompt is requested only after returning to a visible app',()=>{
  assert.ok(html.includes("document.visibilityState==='visible'&&!overlay.classList.contains('hidden')"));
  assert.match(html,/autoBioOnResume/);
});
