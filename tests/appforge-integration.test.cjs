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
  assert.match(html,/id="afLicensePlan"/);
  assert.match(html,/value="monthly">Mensuelle/);
  assert.match(html,/value="annual">Annuelle/);
  assert.match(html,/value="lifetime">À vie/);
  assert.match(html,/id="afLicensePurchase"/);
  assert.match(html,/afLicensePlanGate/);
  assert.match(html,/appforge-license-api\.appforge-licences-mg\.workers\.dev/);
});

test('Cloud sync uses the stable app snapshot route and requires explicit conflict resolution',()=>{
  assert.match(html,/appforge-cloud-api\.appforge-licences-mg\.workers\.dev/);
  assert.ok(html.includes("'/v1/organizations/'+encodeURIComponent(cloudOrg)+'/apps/'+APP_ID+'/snapshot'"));
  assert.match(html,/expectedRevision:cloudRevision/);
  assert.match(html,/Les copies diffèrent/);
  assert.match(html,/Remplacer toute la copie Cloud/);
  assert.match(html,/chiffrés de bout en bout/);
  assert.match(html,/const PREFERRED_CLOUD_ORG='RMLala'/);
  assert.match(html,/PREFERRED_CLOUD_ORG='RMLala'/);
  assert.match(html,/id="appforgeCloudSettings" hidden/);
  assert.match(html,/cloudPanel\.hidden=!paidLicenseActive/);
});

test('Android biometric prompt is requested only after returning to a visible app',()=>{
  assert.ok(html.includes("document.visibilityState==='visible'&&!overlay.classList.contains('hidden')"));
  assert.match(html,/autoBioOnResume/);
});

test('License choices stay visible; a paid license unlocks Cloud and preselects RMLala',async()=>{
 const vc=new VirtualConsole(),errors=[];vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{url:'https://liberte.test/',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){
  w.scrollTo=()=>{};w.matchMedia=()=>({matches:false,addEventListener(){}});w.HTMLElement.prototype.scrollIntoView=function(){};w.HTMLMediaElement.prototype.load=function(){};w.HTMLMediaElement.prototype.pause=function(){};w.confirm=()=>true;w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;Object.defineProperty(w.crypto,'subtle',{value:webcrypto.subtle});Object.defineProperty(w.navigator,'onLine',{configurable:true,value:false});
 }});
 try{
  const w=dom.window,d=w.document,card=d.getElementById('appforgeIntegrationSettings'),plan=d.getElementById('afLicensePlan'),cloud=d.getElementById('appforgeCloudSettings');
  assert(card);assert(plan);assert.equal(card.hidden,false);assert.equal(cloud.hidden,true);
  plan.value='annual';plan.dispatchEvent(new w.Event('change',{bubbles:true}));assert.equal(w.localStorage.getItem('liberte-license-plan-v1'),'annual');
  Object.defineProperty(w.navigator,'onLine',{configurable:true,value:true});
  w.fetch=async(url,options={})=>{let data={};if(String(url).endsWith('/v1/activate'))data={token:'test-paid-proof',publicKey:{}};else if(String(url).endsWith('/v1/auth/login'))data={token:'test-cloud-session',user:{email:'test@example.invalid'},organizations:[{id:'rmlala-id',name:'RMLala',role:'owner'}]};else if(String(url).includes('/snapshot'))data={revision:0,snapshot:null};return{ok:true,status:200,json:async()=>data}};
  d.getElementById('afLicenseCode').value='TEST-CODE';await d.getElementById('afLicenseActivate').onclick();assert.equal(cloud.hidden,false,'paid license reveals Cloud configuration');
  d.getElementById('afCloudEmail').value='test@example.invalid';d.getElementById('afCloudPassword').value='not-real';d.getElementById('afCloudLogin').click();await new Promise(resolve=>setTimeout(resolve,25));
  assert.equal(d.getElementById('afCloudOrg').value,'rmlala-id','RMLala is selected by organization name');assert.equal(d.getElementById('afCloudPassword').value,'','password is cleared after login');assert.deepEqual(errors,[]);
 }finally{dom.window.close()}
});
