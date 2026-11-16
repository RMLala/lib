const {test}=require('node:test');
const assert=require('node:assert/strict');
const {JSDOM,VirtualConsole}=require('jsdom');
const fs=require('node:fs');
test('Reader focus can be restored and recording pauses, resumes and saves one complete take',async()=>{
 const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 let recorder,stopped=0;
 const dom=new JSDOM(fs.readFileSync(require('node:path').join(__dirname,'../www/index.html'),'utf8'),{url:'https://liberte.test/',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){
 w.scrollTo=()=>{};w.matchMedia=()=>({matches:false,addEventListener(){}});w.HTMLElement.prototype.scrollIntoView=function(){};w.HTMLMediaElement.prototype.load=function(){};w.HTMLMediaElement.prototype.pause=function(){};w.confirm=()=>true;w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;Object.defineProperty(w.crypto,'subtle',{value:require('node:crypto').webcrypto.subtle});
 Object.defineProperty(w.navigator,'mediaDevices',{value:{getUserMedia:async()=>({getTracks:()=>[{stop(){stopped++}}]})}});
 w.MediaRecorder=class{static isTypeSupported(){return true}constructor(){recorder=this;this.state='inactive';this.mimeType='audio/webm'}start(){this.state='recording'}pause(){assert.equal(this.state,'recording');this.state='paused';this.onpause?.()}resume(){assert.equal(this.state,'paused');this.state='recording';this.onresume?.()}stop(){this.state='inactive';this.ondataavailable({data:new w.Blob(['before-pause','after-resume'],{type:this.mimeType})});this.onstop?.()}};
 }});
 const w=dom.window,d=w.document;
 try{
 assert.deepEqual(errors,[]);
 d.querySelector('[data-fullscreen-reading="p-morning"]').click();const reader=d.getElementById('resourceReader');
 assert(reader.querySelector('.reader-settings-drawer'));assert.equal(reader.querySelector('.reader-settings-drawer').open,false);
 reader.querySelector('[data-reader-toggle]').click();assert(reader.classList.contains('reader-focus'));
 reader.querySelector('[data-reader-controls]').click();assert(!reader.classList.contains('reader-focus'));assert.equal(reader.querySelector('[data-reader-controls]').getAttribute('aria-expanded'),'true');
 reader.querySelector('[data-reader-close]').click();assert(reader.classList.contains('hidden'));
 d.querySelector('[data-fullscreen-reading="p-morning"]').click();assert(!reader.classList.contains('reader-focus'));reader.querySelector('[data-reader-close]').click();
 // Save through the real recorder flow, with an in-memory replacement for IndexedDB.
 w.eval('window.savedTakes=[];mediaDb=async(mode,operation)=>operation({put(blob,key){savedTakes.push({blob,key})},delete(){}})');
 d.querySelector('[data-edit-content="p-morning"]').click();await new Promise(r=>setTimeout(r,10));
 const player=d.querySelector('#libraryVoiceEditor [data-media-player]');const pause=player.querySelector('[data-record-pause]');assert(pause);assert(pause.disabled);
 player.querySelector('[data-record-voice]').click();await new Promise(r=>setTimeout(r,10));
 assert.equal(recorder.state,'recording');assert(!pause.disabled);assert(!pause.hidden);
 pause.click();assert.equal(recorder.state,'paused');assert.match(pause.textContent,/Reprendre/);assert.equal(stopped,0);assert.equal(w.savedTakes.length,0);
 pause.click();assert.equal(recorder.state,'recording');assert.match(pause.textContent,/Pause/);
 // Ending a paused take must also work.
 pause.click();player.querySelector('[data-record-voice]').click();await new Promise(r=>setTimeout(r,20));
 assert.equal(stopped,1);assert.equal(w.savedTakes.length,1);assert.equal(w.savedTakes[0].blob.size,'before-pauseafter-resume'.length);
 assert(w.eval('state.library.find(x=>x.id==="p-morning").voiceKey'));
 assert.deepEqual(errors,[]);
 }finally{w.close()}
});
