/* Mobile shell: source navigation stays authoritative; desktop keeps that shell. */
(()=>{
 const script=document.currentScript;
 const base=new URL('.',script.src);
 const header=document.querySelector('.site-header,body>.club-demo-topbar');
 const source=header?.querySelector('nav');
 if(!header||!source)return;
 const mobile=matchMedia('(max-width:760px)');
 const paths={library:'portal.html#/reading',home:'index.html',reading:'portal.html#/reading',people:'portal.html#/people',magazines:'pages/index.html?nav=club#/magazines',books:'pages/index.html?nav=club#/books',events:'portal.html#/events',membership:'portal.html#/membership'};
 const labels={library:'阅读',home:'首页',reading:'共读',people:'领读人',magazines:'杂志',books:'图书',events:'活动',membership:'会员'};
 const shapes={
  home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
  reading:'<path d="M12 5v16M3 4h5a5 5 0 0 1 4 2 5 5 0 0 1 4-2h5v15h-5a5 5 0 0 0-4 2 5 5 0 0 0-4-2H3Z"/>',
  people:'<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 4v3"/>',
  magazines:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 16h8M8 12h3m3 0h2"/>',
  books:'<path d="M4 4h4v17H4zM10 3h4v18h-4zM16 5l4-1 3 16-4 1Z"/>',
  events:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-13 5h2m4 0h2m-8 3h2"/>',
  membership:'<path d="m3 7 4 4 5-7 5 7 4-4-2 12H5Z"/><path d="M7 22h10"/>',
  more:'<rect x="4" y="4" width="5" height="5" rx="1"/><rect x="15" y="4" width="5" height="5" rx="1"/><rect x="4" y="15" width="5" height="5" rx="1"/><rect x="15" y="15" width="5" height="5" rx="1"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>'
 };
 // Figma 486:1968 supplies all primary and tray icons at native 24 × 24.
 const designIcons={library:'reading.svg',recommendation:'recommendation.svg',home:'home.svg',reading:'reading.svg',people:'people.svg',magazines:'magazines.svg',more:'more.svg',books:'books.svg',events:'events.svg',membership:'membership.svg'};
 const icon=key=>`<span class="club-mobile-nav-icon" aria-hidden="true"><i class="iconfont icon-${({library:'Read',recommendation:'Home',home:'Home',reading:'Read',people:'Male',magazines:'Magazine-2',more:'All',books:'Book',events:'Calendar',membership:'Crown'})[key]||'Read'}"></i></span>`;
 const bar=document.createElement('nav');bar.className='club-mobile-nav';bar.setAttribute('aria-label','底部主导航');
 const barShell=document.createElement('div');barShell.className='club-mobile-nav-shell';bar.append(barShell);
 document.body.append(bar);
 const primary=['home','library','events','membership'],readingKeys=['reading','people','magazines','books'];
 let readingLevel=true;
 const back=document.createElement('button');back.type='button';back.className='club-mobile-level-back';back.setAttribute('aria-label','返回首页');back.innerHTML='<i class="iconfont icon-Arrow_Forward-2" aria-hidden="true"></i>';bar.prepend(back);
 let navSequence=0,navAnimations=[],pageExit=null;
 back.addEventListener('click',()=>navigateLevel(paths.home,false));
 function renderLevel(force,animate=false){
  const secondary=typeof force==='boolean'?force:readingLevel&&readingKeys.includes(activeKey());
  const before=barShell.getBoundingClientRect(),beforeMargin=getComputedStyle(barShell).marginLeft,beforeBack={opacity:getComputedStyle(back).opacity,transform:getComputedStyle(back).transform};
  navAnimations.forEach(a=>a.cancel());navAnimations=[];
  bar.classList.toggle('is-home-level',secondary);back.hidden=false;back.disabled=!secondary;back.setAttribute('aria-hidden',String(!secondary));back.tabIndex=secondary?0:-1;
  bar.setAttribute('aria-label',secondary?'阅读内容导航':'底部主导航');
  barShell.replaceChildren();
  for(const key of secondary?readingKeys:primary){const link=makeLink({key,label:labels[key],href:new URL(paths[key],base).href});barShell.append(link);}
  syncActive();
  if(!animate||!mobile.matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return Promise.resolve();
  const after=barShell.getBoundingClientRect(),options={duration:360,easing:'cubic-bezier(.22,1,.36,1)'};
  navAnimations.push(barShell.animate([{width:before.width+'px',marginLeft:beforeMargin},{width:after.width+'px',marginLeft:getComputedStyle(barShell).marginLeft}],options));
  navAnimations.push(back.animate([beforeBack,{opacity:getComputedStyle(back).opacity,transform:getComputedStyle(back).transform}],options));
  [...barShell.children].forEach(node=>navAnimations.push(node.animate([{opacity:0},{opacity:1}],{duration:180,delay:70,easing:'ease-out'})));
  return Promise.allSettled(navAnimations.map(a=>a.finished));
 }
 async function navigateLevel(destination,secondary){
  const token=++navSequence;pageExit?.cancel();readingLevel=secondary;
  const morph=renderLevel(secondary,true),main=document.querySelector('#portal-main,#app,body>main');
  if(main&&mobile.matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches)pageExit=main.animate([{opacity:1},{opacity:0}],{duration:160,delay:180,easing:'ease-in',fill:'forwards'});
  await morph;if(token!==navSequence)return;location.assign(window.clubPreviewScenario?.url(new URL(destination,base).href)||new URL(destination,base).href);
 }
 bar.addEventListener('click',event=>{const link=event.target.closest('a[data-mobile-nav-key]');if(!link||event.defaultPrevented||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  if(link.dataset.mobileNavKey==='library'){
   event.preventDefault();navigateLevel(paths.reading,true);
  }
 });
 bar.style.setProperty('--mobile-nav-count','4');document.body.classList.add('mobile-navigation-ready');
 function keyFor(link){
  const text=link.textContent.trim();
  const known=Object.keys(labels).find(k=>labels[k]===text);if(known)return known;
  const url=new URL(link.href,location.href),hash=url.hash;
  if(url.pathname.endsWith('portal.html')){const part=hash.split(/[/?]/)[1];return ['event','events'].includes(part)?'events':part;}
  if(/#\/(books|magazines)/.test(hash))return hash.split(/[/?]/)[1];
  if(url.pathname.endsWith('index.html')&&!hash.startsWith('#/'))return 'home';
  return '';
 }
 function activeKey(){
  const path=location.pathname,hash=location.hash;
  if(path.endsWith('water-margin.html'))return 'books';
  if(path.endsWith('portal.html')){
   const route=hash.split(/[/?]/)[1];
   if(route==='book')return 'books';if(route==='event')return 'events';
   if(route==='article')return /context=book/.test(hash)?'books':/context=magazine/.test(hash)?'magazines':'reading';
   return route;
  }
  if(/\/pages\/index\.html$/.test(path)){
   if(/(?:[?&])page=(?:lecturer|people)/.test(hash))return 'people';
   if(/(?:[?&])page=reading/.test(hash))return 'reading';
   if(/(?:[?&])page=(?:event|events)/.test(hash))return 'events';
   if(hash.startsWith('#/books')||hash.startsWith('#/book/'))return 'books';
   return 'magazines';
  }
  return 'home';
 }
 function makeLink(item){
  const link=document.createElement('a');link.href=item.href;link.dataset.mobileNavKey=item.key;link.className='club-mobile-nav-item';
  const label=document.createElement('span');label.textContent=item.label;
  link.innerHTML=icon(item.key);link.append(label);return link;
 }
 function syncActive(){
  const current=activeKey(),secondary=bar.classList.contains('is-home-level');
  for(const link of bar.querySelectorAll('a')){const active=link.dataset.mobileNavKey===(secondary?(readingKeys.includes(current)?current:'reading'):readingKeys.includes(current)?'library':current);link.classList.toggle('is-active',active);if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');}
 }
 function syncBack(){
  const hasBack=Array.from(header.querySelectorAll('.portal-back,.club-page-back,.wm-back')).some(button=>!button.hidden);
  document.body.classList.toggle('mobile-navigation-back',hasBack);
  if(hasBack)document.body.style.removeProperty('--mobile-nav-height');
  syncActive();
 }
 mobile.addEventListener('change',()=>{if(!mobile.matches)document.body.style.removeProperty('--mobile-nav-height');syncBack();});
 addEventListener('hashchange',()=>{readingLevel=readingKeys.includes(activeKey());renderLevel();syncBack();});addEventListener('club-session-change',syncActive);addEventListener('pageshow',syncBack);
 new MutationObserver(syncBack).observe(header,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden']});
 renderLevel();syncBack();
 new ResizeObserver(()=>{if(mobile.matches&&!document.body.classList.contains('mobile-navigation-back')&&bar.offsetHeight)document.body.style.setProperty('--mobile-nav-height',Math.ceil(bar.getBoundingClientRect().height)+'px');}).observe(bar);
 if(mobile.matches)header.querySelectorAll('.nav-shell,.nav-island,.portal-back,.club-page-back').forEach(node=>node.getAnimations().forEach(animation=>animation.cancel()));
})();
