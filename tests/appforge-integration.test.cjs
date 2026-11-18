const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM,VirtualConsole}=require('jsdom');
const {webcrypto}=require('node:crypto');
const {TextEncoder,TextDecoder}=require('node:util');
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
  assert.match(html,/const PRODUCT_ID='LIBERTE'/);
  assert.ok(html.includes("![PRODUCT_ID,'LIBERTE-V1'].includes(claims.app)"));
  assert.match(html,/crypto\.subtle\.verify/);
  assert.match(html,/afLicensePlan/);
  assert.match(html,/monthly/);
  assert.match(html,/annual/);
  assert.match(html,/lifetime/);
  assert.match(html,/afLicensePurchase/);
  assert.match(html,/afLicensePlanGate/);
  assert.match(html,/appforge-license-api\.appforge-licences-mg\.workers\.dev/);
});

test('Cloud sync is licensed automatically without client account credentials',()=>{
  assert.match(html,/\/v1\/cloud\/token/);
  assert.match(html,/\/v1\/cloud\/snapshot/);
  assert.match(html,/expectedRevision:cloudRevision/);
  assert.match(html,/cloudTokenExpiresAt/);
  assert.match(html,/cloudTokenExpiresAt=0/);
  assert.match(html,/jeton Cloud/i);
  assert.doesNotMatch(html,/appforge-cloud-api\.appforge-licences-mg\.workers\.dev|afCloudEmail|afCloudPassword|afCloudOrg|v1\/auth\/login|organizations\//i);
  assert.match(html,/afCloudRead/);
  assert.match(html,/modifications conservées localement/i);
  assert.match(html,/Aucune copie locale n’a été supprimée/);
});

test('Android biometric prompt is requested only after returning to a visible app',()=>{
  assert.ok(html.includes("document.visibilityState==='visible'&&!overlay.classList.contains('hidden')"));
  assert.match(html,/autoBioOnResume/);
});

test('License activation provisions Cloud automatically without saving the Cloud token',async()=>{
 const vc=new VirtualConsole(),errors=[];vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{url:'https://liberte.test/',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){
  w.scrollTo=()=>{};w.matchMedia=()=>({matches:false,addEventListener(){}});w.HTMLElement.prototype.scrollIntoView=function(){};w.HTMLMediaElement.prototype.load=function(){};w.HTMLMediaElement.prototype.pause=function(){};w.confirm=()=>true;w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;Object.defineProperty(w.crypto,'subtle',{value:webcrypto.subtle});Object.defineProperty(w.navigator,'onLine',{configurable:true,value:false});
 }});
 try{
  const w=dom.window,d=w.document,card=d.getElementById('appforgeIntegrationSettings'),plan=d.getElementById('afLicensePlan');
  assert(card);assert(plan);assert.equal(card.hidden,false);
  assert.equal(d.getElementById('afCloudEmail'),null);assert.equal(d.getElementById('afCloudPassword'),null);assert.equal(d.getElementById('afCloudOrg'),null);
  plan.value='annual';plan.dispatchEvent(new w.Event('change',{bubbles:true}));assert.equal(w.localStorage.getItem('liberte-license-plan-v1'),'annual');
  Object.defineProperty(w.navigator,'onLine',{configurable:true,value:true});
  w.fetch=async(url,options={})=>{const path=String(url);let data={};if(path.endsWith('/v1/activate'))data={token:'test-paid-proof',publicKey:{},expiresAt:new Date(Date.now()+86400000).toISOString()};else if(path.endsWith('/v1/cloud/token'))data={token:'cloud-secret-test',expiresAt:new Date(Date.now()+3600000).toISOString()};else if(path.includes('/v1/cloud/snapshot')&&(options.method||'GET')==='GET')data={revision:0,snapshot:null};else if(path.includes('/v1/cloud/snapshot')&&options.method==='PUT')data={revision:1};else throw Error('Unexpected URL '+path);return{ok:true,status:200,json:async()=>data}};
  d.getElementById('afLicenseCode').value='TEST-CODE';await d.getElementById('afLicenseActivate').onclick();for(let i=0;i<40&&!d.getElementById('afCloudStatus').textContent.includes('Synchronisation confirmée');i++)await new Promise(resolve=>setTimeout(resolve,100));
  assert.match(d.getElementById('afCloudStatus').textContent,/Synchronisation confirmée/);
  assert.equal(w.localStorage.getItem('liberte-cloud-sync-meta-v1')?.includes('cloud-secret-test'),false);
  assert.equal(w.localStorage.getItem('liberte-license-v1')?.includes('cloud-secret-test'),false);
  assert.equal(errors.length,0,errors.join('\n'));
 }finally{dom.window.close()}
});
