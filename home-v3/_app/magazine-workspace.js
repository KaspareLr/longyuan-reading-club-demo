/* Independent magazine workspace. Local matching/theme proposals are intentionally demo data. */
(()=>{
'use strict';
const $=s=>document.querySelector(s),e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=n=>`<i class="iconfont icon-${n}" aria-hidden="true"></i>`;
const source='https://www.qikan.com.cn/original/BE43497A-FCCC-49C3-8E79-5A58E8632CB4/2026/09.html#book7/page1';
const reference=window.periodicalReference,full=new Map((window.clubEditorialArticleData||[]).map(a=>[a.id,a]));
if(!reference?.groups){$('#text-reader').textContent='本期内容暂未加载，请刷新页面。';return;}
const articles=reference.groups.flatMap(g=>g.articles.map(a=>{const id=a.url.match(/(dycy\d+)/)?.[1],text=full.get(id),length=text?.blocks.reduce((n,b)=>n+(b.text?.length||0),0)||0;return {...a,id,group:g.title,full:text,minutes:text?Math.max(1,Math.ceil(length/350)):1};})).map((a,index)=>({...a,index}));
function topic(a){if(/睡|眠|暑假|生活|咖啡|家|高寿/.test(a.title))return '生活方式';if(/数字|趋势|AI|科技|能源|电|机器人/.test(a.title))return '科技与趋势';if(/人物|故事|电影|导演|天才|刘同|读|艺术/.test(a.title))return '文化与人物';return ['有腔调','有态度'].includes(a.group)?'文化与人物':'商业观察';}
articles.forEach(a=>a.topic=topic(a));
let current=articles[0].id,mode='text',aiMode='filter',duration=0,fontIndex=0,dialogOwner=null,filterSequence=0;
const interests=new Set(),observed=new Set(),reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
const lookup=id=>articles.find(a=>a.id===id);
function notice(text){$('#notice').textContent=text;$('#notice').classList.add('visible');clearTimeout(notice.timer);notice.timer=setTimeout(()=>$('#notice').classList.remove('visible'),2500);}
function updateURL(){const q=new URLSearchParams({article:current,mode});history.replaceState(null,'',location.pathname+location.search+'#'+q);}
function renderTOC(query=''){
 const q=query.trim().toLowerCase();$('#toc').innerHTML=reference.groups.map((g,index)=>{const list=articles.filter(a=>a.group===g.title&&(!q||a.title.toLowerCase().includes(q)));return list.length?`<section class="toc-group"><div class="portal-toc-group"><span>${String(index+1).padStart(2,'0')}</span><span>${e(g.title)}</span></div>${list.map(a=>`<a class="toc-item reader-toc-article" href="#article-${a.id}" data-article="${a.id}" ${a.id===current?'aria-current="page"':''}><span>${String(a.index+1).padStart(2,'0')}</span><span><strong>${e(a.title)}</strong><small>${e(a.excerpt||'')}</small></span></a>`).join('')}</section>`:'';}).join('')||'<p class="empty-filter">没有匹配的篇目，换个关键词试试。</p>';
}
function renderBody(a){
 const body=$(`#body-${a.id} .article-body`);if(body.dataset.loaded)return;body.dataset.loaded='1';
 if(a.full){body.innerHTML=a.full.blocks.map(b=>{
  if(b.type==='figure')return `<figure><img src="${e(b.src)}" alt="${e(b.alt||b.caption||a.title+'配图')}" loading="lazy" ${b.width?`width="${Number(b.width)}"`:''} ${b.height?`height="${Number(b.height)}"`:''}>${b.caption?`<figcaption>${e(b.caption)}</figcaption>`:''}</figure>`;
  if(b.type==='heading')return `<h3>${e(b.text)}</h3>`;
  return `<p>${e(b.text)}</p>`;
 }).join('')+'<div class="article-end" aria-label="本篇结束">END</div>';}
 else body.innerHTML=`<p>${e(a.excerpt||'本期已收录该篇目录，完整文本尚未接入。')}</p><p class="preview-note">当前展示本地保存的摘要，尚未收录这篇文章的完整文本。你可以切换到官方原貌试读，继续浏览可试读的页面。</p><div class="preview-end"><span>摘要预览</span><button type="button" data-original>切换原貌版 ${icon('Arrow_Forward-3')}</button></div>`;
}
function renderArticles(){
 $('#text-reader').innerHTML=articles.map(a=>`<article class="article-card ${a.id===current?'is-current':''}" id="article-${a.id}" data-id="${a.id}"><header class="article-header"><div class="article-topline"><span class="article-index">${String(a.index+1).padStart(2,'0')}</span><span>${e(a.group)}</span></div><button class="article-toggle" type="button" data-toggle="${a.id}" aria-expanded="false" aria-controls="body-${a.id}"><h2>${e(a.title)}</h2><span class="fold-icon">${icon('Arrow_Down')}</span></button><div class="article-byline">${a.full?.authors?.length?`<span>${e(a.full.authors.join(' / '))}</span>`:''}<span>${a.full?'全文 · 约 '+a.minutes+' 分钟':'摘要预览 · 约 1 分钟'}</span></div><p class="article-preview">${e(a.excerpt||a.full?.blocks.find(b=>b.text)?.text||'')}</p></header><div class="article-body-shell" id="body-${a.id}" inert><div class="article-body-clip"><div class="article-body"></div></div></div></article>`).join('');
}
function setCurrent(id){const a=lookup(id);if(!a)return;current=id;document.querySelectorAll('.toc-item').forEach(n=>{if(n.dataset.article===id)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current')});document.querySelectorAll('.article-card').forEach(n=>n.classList.toggle('is-current',n.dataset.id===id));$('#mobile-current').textContent=String(a.index+1).padStart(2,'0')+' / '+articles.length;$('#reading-status').textContent='正在阅读 '+String(a.index+1).padStart(2,'0')+' / '+articles.length;updateURL();}
function setOpen(id,open){
 const card=$(`#article-${id}`),shell=$(`#body-${id}`),button=card.querySelector('.article-toggle');if(open)renderBody(lookup(id));
 button.setAttribute('aria-expanded',String(open));shell.inert=!open;shell.classList.toggle('is-open',open);card.querySelector('.article-preview').hidden=open;
 if(open&&!reduced())shell.querySelectorAll('.article-body>p,.article-body>figure').forEach((n,i)=>{if(i<3)n.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:380,delay:70+i*35,easing:'cubic-bezier(.22,1,.36,1)'});});
}
function choose(id){if(!lookup(id))return;const wasOriginal=mode==='original';setCurrent(id);if(dialogOwner)closePanel();if(wasOriginal)setMode('text');setOpen(id,true);requestAnimationFrame(()=>requestAnimationFrame(()=>$(`#article-${id}`).scrollIntoView({behavior:reduced()?'instant':'smooth',block:'start'})));}
function setMode(next){mode=next;document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===next)));$('#text-reader').hidden=next!=='text';$('#original-reader').hidden=next!=='original';$('.reader-settings').hidden=next!=='text';$('#mode-description').textContent=next==='text'?'按篇连续阅读 · 点击目录即可定位':'本地原貌试读 · 前11页连续阅读';
 if(next==='original')renderOriginal();
 if(next==='text')requestAnimationFrame(()=>$(`#article-${current}`).scrollIntoView({behavior:'instant',block:'start'}));updateURL();}
let originalPage=1,originalObserver=null;
function renderOriginal(){
 const pages=window.magazineOriginalData?.pages||[];
 if($('#original-pages').children.length)return;
 if(!pages.length){$('#original-pages').textContent='原貌数据暂未加载，请刷新页面。';return;}
 $('#original-page-select').innerHTML=pages.map(p=>`<option value="${p.page}">${String(p.page).padStart(2,'0')}</option>`).join('');
 $('#original-pages').innerHTML=pages.map(p=>`<figure class="original-page" id="original-page-${p.page}" data-page="${p.page}"><div class="original-tiles" role="img" aria-label="第一财经2026年09期，原貌试读第${p.page}页" style="aspect-ratio:${p.width}/${p.height};grid-template-columns:${p.columns.map(n=>n+'fr').join(' ')};grid-template-rows:${p.rows.map(n=>n+'fr').join(' ')}">${p.tiles.map(t=>`<img src="${e(t.src)}" alt="" aria-hidden="true" loading="lazy" width="${t.width}" height="${t.height}" style="grid-row:${t.row+1};grid-column:${t.col+1}">`).join('')}</div><figcaption>${String(p.page).padStart(2,'0')} / ${pages.length} · 官方原貌试读</figcaption></figure>`).join('')+'<div class="original-end">已读完本地收录的11页试读，后续页面可前往官方授权阅读。</div>';
 originalObserver=new IntersectionObserver(entries=>{if(mode!=='original')return;for(const entry of entries)if(entry.isIntersecting){originalPage=Number(entry.target.dataset.page);syncOriginalControls();}},{rootMargin:'-10% 0px -65% 0px',threshold:0});
 document.querySelectorAll('.original-page').forEach(p=>originalObserver.observe(p));syncOriginalControls();
}
function syncOriginalControls(){ $('#original-page-select').value=String(originalPage);$('#original-prev').disabled=originalPage<=1;$('#original-next').disabled=originalPage>=11; }
function goOriginal(page){originalPage=Math.max(1,Math.min(11,Number(page)));syncOriginalControls();$('#original-page-'+originalPage)?.scrollIntoView({behavior:reduced()?'instant':'smooth',block:'start'});}
$('#original-page-select').addEventListener('change',ev=>goOriginal(ev.target.value));
$('#original-prev').addEventListener('click',()=>goOriginal(originalPage-1));$('#original-next').addEventListener('click',()=>goOriginal(originalPage+1));
function renderFilters(){
 $('#interest-chips').innerHTML=['商业观察','生活方式','科技与趋势','文化与人物'].map(t=>`<button type="button" data-interest="${t}" aria-pressed="${interests.has(t)}">${t}</button>`).join('');
 $('#time-options').innerHTML=[[0,'不限'],[3,'3 分钟'],[8,'8 分钟'],[15,'15 分钟']].map(([v,t])=>`<button type="button" data-time="${v}" aria-pressed="${duration===v}">${t}</button>`).join('');
}
function showRecommendations(){const selected=$('#topic-select').value;const list=articles.filter(a=>(!interests.size||interests.has(a.topic))&&(selected==='全部'||a.topic===selected)&&(!duration||a.minutes<=duration)).sort((a,b)=>Number(!!b.full)-Number(!!a.full)||a.index-b.index);
 $('#recommendations').innerHTML=`<div class="results-caption"><span>${interests.size||selected!=='全部'||duration?'为你筛选':'先从这几篇读起'}</span><span>${list.length} 篇匹配</span></div>`+(list.length?list.slice(0,4).map(a=>`<button class="recommendation pe-guide-prompt" type="button" data-article="${a.id}"><span><strong>${e(a.title)}</strong><small>${a.topic} · ${a.full?'全文':'摘要预览'} · 约 ${a.minutes} 分钟</small></span>${icon('Arrow_Forward-2')}</button>`).join(''):'<p class="empty-filter">还没有同时符合这些偏好的内容。可以放宽阅读时间，或少选一个条件。</p>')+'<p class="empty-filter" style="font-size:12px;margin-top:10px">时长按本地可读内容估算；主题匹配为演示。</p>';
}
const themeData=[
 {title:'睡眠，如何成为一门生意？',description:'从《你睡得好吗？》切入，留意个人睡眠困扰与睡眠经济之间的联系。一个日常需求，如何成为商业议题？',ids:['dycy20260901','dycy20260903']},
 {title:'市场变了，创作者怎么办？',description:'沿着《市场退潮，新导演如何“上岸”》的讨论，观察电影市场、观众需求和新导演的处境。可以继续追问：旧经验失效后，新的机会在哪里？',ids:['dycy20260912']},
 {title:'从数字与人物里，读到变化',description:'把《数字世界》《人物》《大事件》放在一起，尝试从数据、个体和事件三个视角阅读这一期。这是一条建议的阅读路径，而非原文结论。',ids:['dycy20260904','dycy20260905','dycy20260902']}
];
function renderThemes(){ $('#theme-cards').innerHTML=themeData.map((t,n)=>`<article class="theme-card"><span class="theme-index">TOPIC ${String(n+1).padStart(2,'0')}</span><h4>${e(t.title)}</h4><p>${e(t.description)}</p><div class="theme-sources">${t.ids.filter(id=>lookup(id)).map(id=>`<button type="button" data-article="${id}">${icon('Book')}<span>${e(lookup(id).title)}</span></button>`).join('')}</div></article>`).join('');}
const dialog=$('#panel-dialog');
function openPanel(owner){if(dialog.open)closePanel();dialogOwner=owner;$('#panel-title').textContent=owner==='directory'?'本期目录':'AI 阅读助手';$('#panel-slot').append($('#'+owner));dialog.showModal();document.body.classList.add('panel-open');$('#close-panel').focus();}
function restorePanel(){if(!dialogOwner)return;const owner=dialogOwner;dialogOwner=null;$('#'+owner+'-slot').append($('#'+owner));document.body.classList.remove('panel-open');document.querySelector(`[data-panel="${owner}"]`)?.focus({preventScroll:true});}
function closePanel(){dialog.close();restorePanel();}
$('#close-panel').addEventListener('click',closePanel);dialog.addEventListener('close',restorePanel);dialog.addEventListener('click',ev=>{if(ev.target===dialog){const r=dialog.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)closePanel();}});
window.addEventListener('resize',()=>{if(dialog.open&&((dialogOwner==='directory'&&innerWidth>760)||(dialogOwner==='assistant'&&innerWidth>1199)))closePanel();},{passive:true});
document.addEventListener('click',ev=>{
 const b=ev.target.closest('button,a[data-article]');if(!b)return;if(b.matches('a[data-article]'))ev.preventDefault();
 if(b.dataset.article){choose(b.dataset.article);return;}
 if(b.dataset.toggle){setCurrent(b.dataset.toggle);setOpen(b.dataset.toggle,b.getAttribute('aria-expanded')!=='true');return;}
 if(b.dataset.mode){setMode(b.dataset.mode);return;}
 if(b.hasAttribute('data-original')){setMode('original');window.scrollTo({top:0,behavior:reduced()?'instant':'smooth'});return;}
 if(b.dataset.ai){aiMode=b.dataset.ai;document.querySelectorAll('[data-ai]').forEach(n=>n.setAttribute('aria-pressed',String(n.dataset.ai===aiMode)));$('#filter-panel').hidden=aiMode!=='filter';$('#themes-panel').hidden=aiMode!=='themes';return;}
 if(b.dataset.interest){interests.has(b.dataset.interest)?interests.delete(b.dataset.interest):interests.add(b.dataset.interest);renderFilters();return;}
 if(b.hasAttribute('data-time')){duration=Number(b.dataset.time);renderFilters();return;}
 if(b.dataset.panel)openPanel(b.dataset.panel);
});
$('#toc-search').addEventListener('input',ev=>renderTOC(ev.target.value));
$('#find-articles').addEventListener('click',()=>{const sequence=++filterSequence;const b=$('#find-articles');b.disabled=true;b.textContent='正在匹配…';setTimeout(()=>{if(sequence!==filterSequence)return;showRecommendations();b.disabled=false;b.innerHTML='重新挑选 '+icon('Arrow_Forward-3');},380);});
$('#font-size').addEventListener('click',()=>{fontIndex=(fontIndex+1)%3;const [size,line,label]=[[16,28,'标准'],[20,32,'大号'],[24,36,'特大号']][fontIndex];document.documentElement.style.setProperty('--base-font',size+'px');document.documentElement.style.setProperty('--base-line',line+'px');$('#font-size').setAttribute('aria-label','正文字号：'+label+'，点击切换');notice(label+'字号 · '+size+'/'+line);});
$('#fold-all').addEventListener('click',()=>{articles.forEach(a=>setOpen(a.id,false));notice('已收起所有文章，点击标题可继续阅读');});
$('#ai-form').addEventListener('submit',ev=>{ev.preventDefault();const question=$('#ai-question').value.trim();if(!question){$('#ai-question').focus();return;}const theme=/电影|市场|创作|导演/.test(question)?themeData[1]:/数字|科技|人物|趋势/.test(question)?themeData[2]:themeData[0];$('#ai-response').textContent='可以从「'+theme.title+'」这条线索读起。\n'+theme.description+'\n\n这是演示建议，未调用实时模型；点击上方关联篇目即可阅读原文。';});
renderTOC();renderArticles();renderFilters();showRecommendations();renderThemes();
const initial=new URLSearchParams(location.hash.slice(1));if(lookup(initial.get('article')))current=initial.get('article');setOpen(current,true);setCurrent(current);if(initial.get('mode')==='original')setMode('original');
const observer=new IntersectionObserver(entries=>{if(mode!=='text'||dialog.open)return;entries.forEach(entry=>{if(entry.isIntersecting){observed.add(entry.target.dataset.id);setCurrent(entry.target.dataset.id);}});},{rootMargin:'-8% 0px -68% 0px',threshold:0});document.querySelectorAll('.article-card').forEach(a=>observer.observe(a));
window.magazineWorkspace={articles:articles.map(a=>({id:a.id,title:a.title,full:!!a.full,group:a.group})),get state(){return {current,mode,aiMode,interests:[...interests],duration}},choose};
})();
