const {test}=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');
const html=fs.readFileSync(require('node:path').join(__dirname,'../www/index.html'),'utf8');
const source=html.match(/<script>\s*\/\/ Android WebView[\s\S]*?<\/script>/)[0].replace(/^<script>|<\/script>$/g,'');
test('Android native bridge reads, pauses, resumes, follows text and reports missing voices',async()=>{
 const calls=[];let listener;const status={textContent:''};const w={Capacitor:{getPlatform:()=> 'android',nativePromise:async(p,m,args)=>{calls.push({p,m,args});return m==='voices'?{voices:[{name:'French',lang:'fr-FR'}]}:{}},addListener(p,e,fn){listener=fn;return {remove(){}}}}};
 vm.runInNewContext(source,{window:w,document:{getElementById:()=>status},setTimeout});await new Promise(r=>setImmediate(r));
 const synth=w.speechSynthesis;assert.equal(synth.getVoices()[0].name,'French');
 const events=[];const u=new w.SpeechSynthesisUtterance('Bonjour le monde');u.lang='fr-FR';u.rate=.8;u.onstart=()=>events.push('start');u.onboundary=e=>events.push(e.charIndex);u.onend=()=>events.push('end');u.onerror=e=>events.push(e.error);
 synth.speak(u);await new Promise(r=>setImmediate(r));assert.equal(calls.at(-1).m,'speak');assert.equal(calls.at(-1).args.text,u.text);
 listener({type:'start'});listener({type:'boundary',charIndex:8});synth.pause();assert(synth.paused);synth.resume();assert(!synth.paused);listener({type:'end'});assert.deepEqual(events,['start',8,'end']);
 synth.speak(u);synth.cancel();await new Promise(r=>setImmediate(r));assert.equal(calls.at(-1).m,'stop');
 synth.speak(u);await new Promise(r=>setImmediate(r));listener({type:'error',error:'Voix non installée'});assert.equal(events.at(-1),'Voix non installée');assert.equal(status.textContent,'Voix non installée');
});
test('Browser keeps its own speech engine',()=>{const engine={};const w={speechSynthesis:engine};vm.runInNewContext(source,{window:w});assert.equal(w.speechSynthesis,engine)});
