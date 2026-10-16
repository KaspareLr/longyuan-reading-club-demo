/* The first reading cover opens at card size and settles into its existing grid slot. */
(()=>{
 const card=document.querySelector('#featured'),slot=card?.querySelector('.feature-cover .hinged-cover'),source=slot?.querySelector('img');
 if(!card||!slot||!source)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const overlay=document.createElement('button');overlay.className='feature-scroll-cover';overlay.type='button';overlay.dataset.open='reading';overlay.setAttribute('aria-label','查看第一财经领读');overlay.innerHTML='<img alt="">';const image=overlay.firstElementChild;image.src=source.currentSrc||source.src;card.append(overlay);
 let metrics,frame=0;
 const clamp=n=>Math.max(0,Math.min(1,n));const mix=(a,b,p)=>a+(b-a)*p;
 function measure(){const rect=card.getBoundingClientRect(),target=slot.getBoundingClientRect();const centerTop=Math.max(104,(innerHeight-rect.height)/2);metrics={top:rect.top+scrollY,width:card.clientWidth,height:card.clientHeight,x:target.left-rect.left,y:target.top-rect.top,w:target.width,h:target.height,radius:parseFloat(getComputedStyle(card).borderTopLeftRadius)||0};metrics.start=Math.max(0,metrics.top-innerHeight*.88);metrics.end=Math.max(metrics.start+80,metrics.top-centerTop);update()}
 function update(){frame=0;if(!metrics)return;const raw=reduce.matches?1:clamp((scrollY-metrics.start)/(metrics.end-metrics.start)),p=raw*raw*(3-2*raw);card.style.setProperty('--feature-cover-progress',p.toFixed(4));const active=p<.999;card.classList.toggle('feature-cover-unfolding',active);overlay.hidden=!active;overlay.tabIndex=active?0:-1;card.querySelectorAll('.feature-copy,.feature-progress').forEach(el=>el.inert=active&&p<.84);if(!active)return;Object.assign(overlay.style,{left:mix(0,metrics.x,p)+'px',top:mix(0,metrics.y,p)+'px',width:mix(metrics.width,metrics.w,p)+'px',height:mix(metrics.height,metrics.h,p)+'px',borderRadius:mix(metrics.radius,4,p)+'px'});const details=clamp((p-.25)/.65);card.style.setProperty('--feature-details-opacity',details.toFixed(4))}
 function requestUpdate(){if(!frame)frame=requestAnimationFrame(update)}
 addEventListener('scroll',requestUpdate,{passive:true});addEventListener('resize',measure);reduce.addEventListener('change',measure);new ResizeObserver(measure).observe(card);source.addEventListener('load',measure);document.fonts?.ready.then(measure);measure();
 // The existing cover remains the action source, preserving all reading navigation handlers.
 overlay.addEventListener('click',event=>{event.stopPropagation();card.querySelector('.feature-cover').click()});
})();
