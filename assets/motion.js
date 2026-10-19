/* Bavaria motion: continuous marquee and textured rising smoke, without network dependencies. */
(function(root){
 'use strict';
 const wrap=(value,length)=>length>0?((value%length)+length)%length:0;
 const advanceLoop=(position,delta,length)=>wrap(position+delta,length);
 function rise(p,dt,time,intro){
  const dispersion=intro?Math.max(0,time-.9):0;
  p.y-=(p.speed+dispersion*70)*dt;
  p.phase+=dt*.28;
  p.x+=(Math.sin(p.phase)*14+p.direction*dispersion*85)*dt;
  p.rotation+=p.spin*dt;
  return dispersion;
 }
 function createMarquee(viewport,belt,group,{speed=22,paused=false,progress=0,draggable=false}={}){
  let width=0,position=0,last=null,frameId=0,ended=false,remaining=0,drag=null,suppressClick=false;
  const doc=viewport.ownerDocument;
  function paint(){belt.style.transform='translate3d('+(-position).toFixed(3)+'px,0,0)';}
  function measure(){const old=width;width=group.getBoundingClientRect().width;position=width?(old?position/old:progress)*width:0;paint();}
  function tick(now){
   if(ended)return;frameId=requestAnimationFrame(tick);
   const dt=last===null?0:Math.min(Math.max(0,(now-last)/1000),.05);last=now;
   if(doc.hidden||!width)return;
   const nudge=remaining*(1-Math.exp(-dt*7));remaining-=nudge;
   const delta=(!paused&&!drag?-speed*dt:0)+nudge;
   if(delta){position=advanceLoop(position,delta,width);paint();}
  }
  function down(event){if(event.button!==0)return;drag={id:event.pointerId,start:event.clientX,last:event.clientX,moved:false};}
  function move(event){if(!drag||event.pointerId!==drag.id)return;const dx=event.clientX-drag.last;if(!drag.moved&&Math.abs(event.clientX-drag.start)<7)return;drag.moved=true;suppressClick=true;viewport.setPointerCapture?.(event.pointerId);position=advanceLoop(position,-dx,width);drag.last=event.clientX;paint();}
  function up(event){if(drag&&event.pointerId===drag.id){if(drag.moved){viewport.releasePointerCapture?.(event.pointerId);setTimeout(()=>suppressClick=false,80);}drag=null;}}
  function click(event){if(suppressClick){event.preventDefault();event.stopImmediatePropagation();suppressClick=false;}}
  function visibility(){last=null;}
  if(draggable){viewport.addEventListener('pointerdown',down);viewport.addEventListener('pointermove',move);viewport.addEventListener('pointerup',up);viewport.addEventListener('pointercancel',up);viewport.addEventListener('click',click,true);}doc.addEventListener('visibilitychange',visibility);
  const observer=typeof ResizeObserver==='function'?new ResizeObserver(measure):null;observer?.observe(group);addEventListener('resize',measure,{passive:true});
  measure();frameId=requestAnimationFrame(tick);
  return{setPaused(value){paused=value;last=null;},nudge(delta,instant=false){if(instant){position=advanceLoop(position,delta,width);paint();}else remaining+=delta;},getProgress(){return width?position/width:0;},destroy(){ended=true;cancelAnimationFrame(frameId);observer?.disconnect();removeEventListener('resize',measure);doc.removeEventListener('visibilitychange',visibility);viewport.removeEventListener('pointerdown',down);viewport.removeEventListener('pointermove',move);viewport.removeEventListener('pointerup',up);viewport.removeEventListener('pointercancel',up);viewport.removeEventListener('click',click,true);}};
 }
 let cachedSprite=null;
 function createSmokeSprite(doc){
  if(cachedSprite)return cachedSprite;
  const size=256,c=doc.createElement('canvas');c.width=c.height=size;const ctx=c.getContext('2d');if(!ctx)return null;
  const fract=n=>n-Math.floor(n),smooth=n=>n*n*(3-2*n);
  function hash(x,y){let n=(Math.imul(x,374761393)+Math.imul(y,668265263))|0;n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967295;}
  function noise(x,y){const ix=Math.floor(x),iy=Math.floor(y),u=smooth(fract(x)),v=smooth(fract(y));const a=hash(ix,iy),b=hash(ix+1,iy),c=hash(ix,iy+1),d=hash(ix+1,iy+1);return(a+(b-a)*u)*(1-v)+(c+(d-c)*u)*v;}
  function fbm(x,y){let value=0,amp=.55;for(let i=0;i<4;i++){value+=noise(x,y)*amp;x=x*2.03+17.1;y=y*2.03+9.2;amp*=.5;}return value;}
  const image=ctx.createImageData(size,size);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
   const nx=(x-size/2)/(size/2),ny=(y-size/2)/(size/2),r=nx*nx+ny*ny;
   if(r>=1)continue;
   const warpX=fbm(nx*3+10,ny*3+20),warpY=fbm(nx*3+31,ny*3+11);
   const billow=fbm(nx*5+warpX*4,ny*5+warpY*4),filament=1-Math.abs(noise(nx*17+warpY*8,ny*17+warpX*8)*2-1);
   const edge=Math.pow(1-r,1.55),alpha=edge*Math.pow(Math.max(0,(billow-.18)*1.8),1.35)*(.48+.52*filament);
   const i=(y*size+x)*4,light=160+billow*78;image.data[i]=light;image.data[i+1]=light;image.data[i+2]=light+3;image.data[i+3]=Math.round(Math.min(.82,alpha)*255);
  }
  ctx.putImageData(image,0,0);cachedSprite=c;return c;
 }
 function createSmoke(canvas,{intro=false}={}){
  if(!canvas)return{setEnabled(){},stop(){}};
  const ctx=canvas.getContext('2d'),doc=canvas.ownerDocument;
  const sprite=ctx?createSmokeSprite(doc):null;
  if(!ctx||!sprite)return{setEnabled(){},stop(){}};
  let w=0,h=0,enabled=true,ended=false,frameId=0,last=null,elapsed=0;
  const particles=[],count=intro?48:(innerWidth<600?28:42);
  function reset(p,initial=false){
   p.x=Math.random()*w;p.y=initial?Math.random()*(h+160)-80:h+80;
   p.size=intro?Math.max(w,h)*(.7+Math.random()*.65):Math.min(900,Math.max(400,w*.6))*(.65+Math.random()*.55);
   p.speed=intro?25+Math.random()*30:24+Math.random()*20;
   p.phase=Math.random()*Math.PI*2;p.rotation=Math.random()*Math.PI*2;
   p.spin=(Math.random()-.5)*.045;p.alpha=intro?.7+Math.random()*.3:.22+Math.random()*.2;p.direction=p.x<w/2?-1:1;
  }
  function resize(){w=innerWidth;h=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);particles.forEach(p=>reset(p,true));}
  function draw(dt){
   ctx.clearRect(0,0,w,h);elapsed+=dt;
   for(const p of particles){const dispersion=rise(p,dt,elapsed,intro),size=p.size*(1+dispersion*.23);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rotation);ctx.globalAlpha=p.alpha*(intro?Math.max(0,1-(elapsed-2.4)/1.6):1);ctx.drawImage(sprite,-size/2,-size/2,size,size);ctx.restore();if(!intro&&(p.y<-size||p.x<-size||p.x>w+size))reset(p);}
  }
  function tick(now){if(ended)return;frameId=requestAnimationFrame(tick);if(!enabled||doc.hidden){last=null;return;}if(last!==null&&now-last<1000/30)return;const dt=last===null?0:Math.min((now-last)/1000,.08);last=now;draw(dt);}
  resize();for(let i=0;i<count;i++){const p={};reset(p,true);particles.push(p);}draw(0);addEventListener('resize',resize,{passive:true});frameId=requestAnimationFrame(tick);
  return{setEnabled(value){enabled=value;canvas.style.display=value?'':'none';last=null;if(value)draw(0);else ctx.clearRect(0,0,w,h);},stop(){ended=true;cancelAnimationFrame(frameId);removeEventListener('resize',resize);ctx.clearRect(0,0,w,h);}};
 }
 const api={wrap,advanceLoop,rise,createMarquee,createSmoke};
 if(typeof module==='object'&&module.exports)module.exports=api;
 root.BavariaMotion=api;
})(typeof window==='undefined'?globalThis:window);
