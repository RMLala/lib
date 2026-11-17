const {test}=require('node:test');
const assert=require('node:assert/strict');
const {JSDOM,VirtualConsole}=require('jsdom');
const fs=require('node:fs');
const path=require('node:path');

test('Full-screen reader offers saved personal voice with pause/resume and keeps controls visible',async()=>{
 const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 let audio;
 const dom=new JSDOM(fs.readFileSync(path.join(__dirname,'../www/index.html'),'utf8'),{url:'https://liberte.test/',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){
  w.scrollTo=()=>{};w.matchMedia=()=>({matches:false,addEventListener(){}});w.HTMLElement.prototype.scrollIntoView=function(){};w.HTMLMediaElement.prototype.load=function(){};w.HTMLMediaElement.prototype.pause=function(){};w.confirm=()=>true;w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;Object.defineProperty(w.crypto,'subtle',{value:require('node:crypto').webcrypto.subtle});
  w.Audio=class{constructor(){audio=this;this.paused=true;this.ended=false;this.currentTime=0;this.duration=12;this.listeners={}}addEventListener(name,fn){this.listeners[name]=fn}play(){this.paused=false;this.listeners.play?.();return Promise.resolve()}pause(){this.paused=true;this.listeners.pause?.()}};
  w.URL.createObjectURL=()=> 'blob:personal-take';w.URL.revokeObjectURL=()=>{};
 }});
 const w=dom.window,d=w.document;
 try{
  w.eval("state.library.find(x=>x.id==='p-morning').voiceKey='';state.settings.voiceRecordingBlocks=['resource-p-morning'];mediaDb=async(mode,operation)=>operation({get:key=>key==='voice:resource-p-morning'?new Blob(['voice'],{type:'audio/webm'}):undefined})");
  d.querySelector('[data-fullscreen-reading="p-morning"]').click();
  const reader=d.getElementById('resourceReader'),selector=reader.querySelector('[data-reader-voice-source]');
  assert.equal(selector.value,'system');assert.equal(selector.querySelector('option[value="personal"]').disabled,false);
  selector.value='personal';selector.dispatchEvent(new w.Event('change',{bubbles:true}));
  reader.querySelector('[data-system-voice-start]').click();await new Promise(r=>setTimeout(r,20));
  assert.equal(audio.src,'blob:personal-take');assert.equal(audio.paused,false);
  assert.match(reader.querySelector('[data-system-voice-status]').textContent,/Ma voix est en cours/);
  assert(reader.classList.contains('reader-focus'));
  const quick=reader.querySelector('.reader-quick-controls');assert(quick.contains(reader.querySelector('[data-system-voice-pause]')));assert(quick.contains(reader.querySelector('[data-system-voice-stop]')));
  assert.notEqual(w.getComputedStyle(quick).display,'none');
  reader.querySelector('[data-system-voice-pause]').click();assert.equal(audio.paused,true);
  assert.match(reader.querySelector('[data-system-voice-status]').textContent,/en pause/);
  reader.querySelector('[data-system-voice-pause]').click();await new Promise(r=>setTimeout(r,5));assert.equal(audio.paused,false);
  reader.querySelector('[data-system-voice-stop]').click();assert.equal(audio.paused,true);assert.equal(audio.currentTime,0);
  assert.deepEqual(errors,[]);
 }finally{dom.window.close()}
});
