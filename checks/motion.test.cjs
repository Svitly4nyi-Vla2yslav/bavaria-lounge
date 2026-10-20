const assert=require('node:assert/strict');
const fs=require('node:fs');
const motion=require('../assets/motion.js');
// Constant displacement must not depend on refresh rate or pause on slide boundaries.
for(const fps of [30,60,120]){
 let position=0;
 for(let frame=0;frame<fps*10;frame++)position=motion.advanceLoop(position,-22/fps,2817);
 assert.ok(Math.abs(position-2597)<1e-7,`10-second speed at ${fps}fps`);
}
assert.equal(motion.advanceLoop(2,-5,100),97);
assert.equal(motion.advanceLoop(98,5,100),3);
assert.equal(motion.advanceLoop(10,5,0),0);
let puff={x:30,y:500,speed:30,phase:0,rotation:0,spin:.02,direction:1};
motion.rise(puff,1,0,false);assert.equal(puff.y,470);
const intro={...puff};motion.rise(intro,1,3,true);assert.ok(intro.y<400);assert.ok(intro.x>puff.x);

// Run the actual marquee frame controller against a measurable element and a fake RAF clock.
let queued=new Map(),seq=0;
global.requestAnimationFrame=callback=>{queued.set(++seq,callback);return seq;};
global.cancelAnimationFrame=id=>queued.delete(id);
global.addEventListener=global.removeEventListener=()=>{};
global.innerWidth=1024;global.innerHeight=768;global.devicePixelRatio=1;
function frames(start,count,step=1000/60){for(let i=0;i<count;i++){const callbacks=[...queued.values()];queued.clear();callbacks.forEach(fn=>fn(start+i*step));}}
const doc={hidden:false,addEventListener(){},removeEventListener(){}};
const viewport={ownerDocument:doc,addEventListener(){},removeEventListener(){}};
const belt={style:{}},group={getBoundingClientRect:()=>({width:2817})};
const marquee=motion.createMarquee(viewport,belt,group,{speed:22});
frames(0,61);assert.ok(Math.abs(marquee.getProgress()*2817-2795)<.001);
assert.match(belt.style.transform,/translate3d/);
marquee.setPaused(true);const paused=marquee.getProgress();frames(1100,30);assert.equal(marquee.getProgress(),paused);
marquee.setPaused(false);frames(1700,61);assert.ok(Math.abs(marquee.getProgress()*2817-2773)<.001);marquee.destroy();

// Verify visible initial smoke, populated pixels, upwards motion and a full viewport surface.
let spriteData,draws=[],transforms=[];
doc.createElement=()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(image){spriteData=image.data;}})});
const ctx={globalAlpha:1,setTransform(){},clearRect(){draws=[];transforms=[];},save(){},restore(){},translate(x,y){this.xy=[x,y];},rotate(r){this.angle=r;},drawImage(sprite,x,y,w,h){draws.push({x:this.xy[0],y:this.xy[1],size:w,rotation:this.angle,alpha:this.globalAlpha});transforms.push(this.xy);}};
const canvas={style:{},ownerDocument:doc,getContext:()=>ctx};
const engine=motion.createSmoke(canvas);
assert.equal(canvas.width,1024);assert.equal(canvas.height,768);assert.equal(draws.length,42);
let nontransparent=0,maxAlpha=0;for(let i=3;i<spriteData.length;i+=4){if(spriteData[i]>15)nontransparent++;maxAlpha=Math.max(maxAlpha,spriteData[i]);}
assert.ok(nontransparent>10000);assert.ok(maxAlpha>100);
const initial=draws.map(d=>d.y);frames(3000,8);assert.ok(draws.every((d,i)=>d.y<initial[i]));
engine.setEnabled(false);assert.equal(canvas.style.display,'none');engine.setEnabled(true);assert.equal(canvas.style.display,'');assert.equal(draws.length,42);engine.stop();
assert.ok(!fs.readFileSync(require.resolve('../assets/app.js'),'utf8').includes("sessionStorage.getItem('bavaria-intro')"));
console.log(JSON.stringify({continuousSpeed:'22px/s at 30/60/120Hz',loopBoundary:'seamless modulo',pauseAndResume:'passed',smoke:'42 puffs drawn immediately, textured alpha visible, all puffs rise',intro:'session gate removed',status:'passed'}));
