(()=>{
  'use strict';
  const STORAGE_KEY='bavaria-consent-v1';
  const VERSION=1;
  let preferences={necessary:true,externalMedia:false,statistics:false};
  const read=()=>{try{const value=JSON.parse(localStorage.getItem(STORAGE_KEY));return value?.version===VERSION?value:null;}catch{return null;}};
  const has=category=>category==='necessary'||preferences[category]===true;
  const emit=()=>window.dispatchEvent(new CustomEvent('bavaria:consent',{detail:{...preferences}}));
  const save=next=>{preferences={necessary:true,externalMedia:!!next.externalMedia,statistics:!!next.statistics};try{localStorage.setItem(STORAGE_KEY,JSON.stringify({version:VERSION,savedAt:new Date().toISOString(),...preferences}));}catch{}emit();close();};
  const template=`<section class="consent-panel" role="dialog" aria-modal="false" aria-labelledby="consent-title" aria-describedby="consent-copy">
    <div class="consent-intro"><span class="consent-kicker">DEINE PRIVATSPHÄRE</span><h2 id="consent-title">Cookies & Datenschutz</h2><p id="consent-copy">Wir verwenden technisch notwendige Speicherung, damit die Website funktioniert. Externe Medien und Statistik werden nur mit deiner freiwilligen Einwilligung aktiviert. Deine Auswahl kannst du jederzeit ändern.</p><div class="consent-legal"><a href="datenschutz.html">Datenschutzerklärung</a><a href="impressum.html">Impressum</a></div></div>
    <div class="consent-settings" hidden>
      <label class="consent-option"><span><strong>Notwendig</strong><small>Sprache, Einwilligungsstatus und sichere Grundfunktionen</small></span><input type="checkbox" checked disabled aria-label="Notwendige Speicherung, immer aktiv"></label>
      <label class="consent-option"><span><strong>Externe Medien</strong><small>Instagram-Inhalte und Verbindungen zu externen Anbietern</small></span><input name="externalMedia" type="checkbox"></label>
      <label class="consent-option"><span><strong>Statistik</strong><small>Anonyme Reichweitenmessung, falls künftig eingebunden</small></span><input name="statistics" type="checkbox"></label>
    </div>
    <div class="consent-actions"><button class="consent-secondary" type="button" data-consent="settings">Einstellungen</button><button class="consent-secondary" type="button" data-consent="reject">Nur notwendige</button><button class="consent-primary" type="button" data-consent="accept">Alle akzeptieren</button><button class="consent-primary consent-save" type="button" data-consent="save" hidden>Auswahl speichern</button></div>
  </section>`;
  let host;
  function open(){
    if(!host){host=document.createElement('div');host.className='consent-host';host.innerHTML=template;document.body.append(host);host.addEventListener('click',onClick);}
    host.querySelector('[name="externalMedia"]').checked=preferences.externalMedia;
    host.querySelector('[name="statistics"]').checked=preferences.statistics;
    host.hidden=false;requestAnimationFrame(()=>host.classList.add('is-visible'));
  }
  function close(){if(!host)return;host.classList.remove('is-visible');setTimeout(()=>{if(host)host.hidden=true;},280);}
  function onClick(event){
    const action=event.target.closest('[data-consent]')?.dataset.consent;if(!action)return;
    if(action==='accept')return save({externalMedia:true,statistics:true});
    if(action==='reject')return save({externalMedia:false,statistics:false});
    if(action==='save')return save({externalMedia:host.querySelector('[name="externalMedia"]').checked,statistics:host.querySelector('[name="statistics"]').checked});
    const settings=host.querySelector('.consent-settings'),saveButton=host.querySelector('.consent-save');settings.hidden=false;saveButton.hidden=false;event.target.hidden=true;settings.querySelector('input:not(:disabled)')?.focus();
  }
  const stored=read();if(stored)preferences={necessary:true,externalMedia:!!stored.externalMedia,statistics:!!stored.statistics};
  window.BavariaConsent={has,open,get:()=>({...preferences})};
  document.addEventListener('click',event=>{if(event.target.closest('[data-open-consent]'))open();});
  window.addEventListener('load',()=>setTimeout(()=>{if(!stored)open();else emit();},8000),{once:true});
})();
