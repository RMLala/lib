const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM,VirtualConsole}=require('jsdom');
const {webcrypto}=require('node:crypto');
const {TextEncoder,TextDecoder}=require('node:util');

test('Home card and text follow the selected palette and explicit custom color',()=>{
  const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
  const html=fs.readFileSync(require('node:path').join(__dirname,'../www/index.html'),'utf8');
  const dom=new JSDOM(html,{url:'https://liberte.test/',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){
    w.scrollTo=()=>{};w.matchMedia=()=>({matches:false,addEventListener(){}});w.HTMLElement.prototype.scrollIntoView=function(){};w.HTMLMediaElement.prototype.load=function(){};w.HTMLMediaElement.prototype.pause=function(){};w.confirm=()=>true;w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;Object.defineProperty(w.crypto,'subtle',{value:webcrypto.subtle});
  }});
  try{
    const {document:d}=dom.window,hero=d.querySelector('#home .hero');
    const asRgb=hex=>`rgb(${hex.match(/[0-9a-f]{2}/ig).map(part=>parseInt(part,16)).join(', ')})`;
    assert.equal(d.getElementById('identityBackgroundImage').style.objectFit,'cover');
    const first=hero.style.getPropertyValue('--home-bg');
    d.querySelector('[data-select-theme="lavande"]').click();
    const themed=hero.style.getPropertyValue('--home-bg');
    assert.notEqual(themed,first,'theme selection must change the home-card background');
    assert.equal(hero.style.backgroundColor,asRgb(themed),'theme must replace the baked-in green gradient');
    assert.equal(hero.querySelector('.identity-copy h2').style.getPropertyPriority('color'),'important');
    assert.equal(hero.querySelector('.identity-copy .eyebrow').style.getPropertyPriority('color'),'important');
    d.querySelector('[data-home-bg="#3b145b"]').click();
    assert.equal(hero.style.getPropertyValue('--home-bg'),'#3b145b','custom home color remains an override');
    assert.equal(hero.style.backgroundColor,asRgb('#3b145b'),'custom color fills the whole home card');
    assert.equal(d.getElementById('homeBackgroundColor').value,'#3b145b');
    assert.deepEqual(errors,[]);
  }finally{dom.window.close()}
});
