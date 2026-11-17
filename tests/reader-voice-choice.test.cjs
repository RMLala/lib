const {test}=require('node:test');
const assert=require('node:assert/strict');
const {JSDOM,VirtualConsole}=require('jsdom');
const fs=require('node:fs');
const path=require('node:path');

test('Full-screen reader offers saved personal voice with pause/resume and keeps controls visible',async()=>{
 const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 let audio,frameId=0;const frames=new Map();
 const dom=new JSDOM(fs.readFileSync(path.join(__dirname,'../www/index.html'),'utf8'),{url:'https://liberte.test/',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){
  w.scrollTo=()=>{};w.matchMedia=()=>({matches:false,addEventListener(){}});w.HTMLElement.prototype.scrollIntoView=function(){};w.HTMLMediaElement.prototype.load=function(){};w.HTMLMediaElement.prototype.pause=function(){};w.confirm=()=>true;w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;Object.defineProperty(w.crypto,'subtle',{value:require('node:crypto').webcrypto.subtle});
  w.requestAnimationFrame=fn=>{const id=++frameId;frames.set(id,fn);return id};w.cancelAnimationFrame=id=>frames.delete(id);
  w.Audio=class{constructor(){audio=this;this.paused=true;this.ended=false;this.currentTime=0;this.duration=12;this.listeners={}}addEventListener(name,fn){this.listeners[name]=fn}play(){this.paused=false;this.listeners.play?.();return Promise.resolve()}pause(){this.paused=true;this.listeners.pause?.()}};
  w.URL.createObjectURL=()=> 'blob:personal-take';w.URL.revokeObjectURL=()=>{};
 }});
 const w=dom.window,d=w.document;
 try{
  w.eval("state.library.find(x=>x.id==='p-morning').voiceKey='';state.settings.voiceRecordingBlocks=['resource-p-morning'];mediaDb=async(mode,operation)=>operation({get:key=>key==='voice:resource-p-morning'?new Blob(['voice'],{type:'audio/webm'}):undefined})");
  d.querySelector('#ritualGroups [data-fullscreen-reading="p-morning"]').click();
  const reader=d.getElementById('resourceReader'),selector=reader.querySelector('[data-reader-voice-source]');
  assert.equal(selector.value,'system');assert.equal(selector.querySelector('option[value="personal"]').disabled,false);
  selector.value='personal';selector.dispatchEvent(new w.Event('change',{bubbles:true}));
  reader.querySelector('[data-system-voice-start]').click();await new Promise(r=>setTimeout(r,20));
  assert.equal(audio.src,'blob:personal-take');assert.equal(audio.paused,false);
  const readerText=reader.querySelector('[data-reader-text]');Object.defineProperty(readerText,'scrollHeight',{configurable:true,value:1100});Object.defineProperty(readerText,'clientHeight',{configurable:true,value:100});
  assert.equal(typeof audio.listeners.timeupdate,'undefined','personal playback must not compete with a second timeupdate scroll loop');
  audio.currentTime=6;let frame=[...frames.entries()][0];assert(frame,'personal playback schedules smooth animation-frame following');frames.delete(frame[0]);frame[1](0);assert.equal(readerText.scrollTop,500,'text follows the recording position continuously');
  audio.currentTime=7.2;frame=[...frames.entries()][0];frames.delete(frame[0]);frame[1](0);assert.equal(readerText.scrollTop,600,'text advances smoothly with the recorded voice');
  assert.match(reader.querySelector('[data-system-voice-status]').textContent,/Ma voix est en cours/);
  assert(reader.classList.contains('reader-focus'));
  const quick=reader.querySelector('.reader-quick-controls');assert(quick.contains(reader.querySelector('[data-system-voice-pause]')));assert(quick.contains(reader.querySelector('[data-system-voice-stop]')));
  assert.notEqual(w.getComputedStyle(quick).display,'none');
  reader.querySelector('[data-system-voice-pause]').click();assert.equal(audio.paused,true);assert.equal(frames.size,0,'pause stops the teleprompter animation');
  assert.match(reader.querySelector('[data-system-voice-status]').textContent,/en pause/);
  reader.querySelector('[data-system-voice-pause]').click();await new Promise(r=>setTimeout(r,5));assert.equal(audio.paused,false);
  reader.querySelector('[data-system-voice-stop]').click();assert.equal(audio.paused,true);assert.equal(audio.currentTime,0);
  reader.querySelector('[data-reader-close]').click();
  d.querySelector('#contentLibrary [data-fullscreen-reading="p-morning"]').click();
  assert.equal(reader.querySelector('[data-reader-voice-source]').value,'personal');
  reader.querySelector('[data-system-voice-start]').click();await new Promise(r=>setTimeout(r,15));
  assert.equal(audio.paused,false);assert.equal(audio.src,'blob:personal-take');
  reader.querySelector('[data-system-voice-stop]').click();reader.querySelector('[data-reader-close]').click();
  assert.deepEqual(errors,[]);
 }finally{dom.window.close()}
});
