/* Button-free overflow disclosure. Full source text stays in the document. */
(()=>{
 const mobile=matchMedia('(max-width:760px)'),records=new Map();let scheduled=0,returnFocus=null;
 const excluded='script,style,svg,i,.iconfont,.sr-only,.portal-prose,.reader-paper,.reader-content,.podcast-caption,.book-course-transcript,.text-full-dialog,input,textarea,select';
 const complete='h1,.portal-article-meta,.portal-facts,.rd-facts,.portal-faq,.price,.portal-event-meta,.activity-meta,.club-overline,.eyebrow,.oc-eyebrow,.rd-eyebrow,.badge,.oc-status,.oc-reading-list-status';
 // Only actual bounded surfaces count as cards; ordinary article sections do not.
 const card='.oc-profile-primary,.reading-home-task,.oc-guided-task,.feature,.reading-home-feature,.v3-recommendation,.v3-resource,.v3-mixed-item,.v3-podcast,.daily-card,.book-card,.magazine,.guide,.people-guide-card,.oc-reading-list-card,.portal-event,.oc-activity-card,.books-library-card,.mag-card,.rank-row,.rd-article,.pe-article,.oc-article,.topic-card,.rd-feature-card,.portal-tool,.cf-result,.pd-saved-card,.pd-link-card,.portal-account-side,.oc-person-card,.oc-opinion-slide';
 const systemFields='.badge,.reading-home-status,.oc-reading-list-status,.oc-status,.oc-profile-greeting,.oc-profile-title h1,.v3-reason>h3,.v3-article-reason>strong,.v3-resource blockquote>strong,.feature-copy blockquote>strong,.reading-home-identity blockquote>strong,.reading-home-assignment blockquote>strong,.oc-reading-list-message>strong,.reading-home-task>header>h2,.reading-home-clock>span,label,legend,dt,.field-limit-counter';
 const taskFields='.reading-home-task-description,.reading-home-assignment blockquote p,.oc-guided-question>p,.oc-guided-question blockquote p';
 // List previews lead to a detail page; they never disclose a standalone text preview.
 const nicknames='.club-account-name,.cf-mobile-identity strong,.portal-account-side>h2,.cf-account-menu>header strong';
 const compactTitles='.feature-copy h2,.reading-home-identity h2,.oc-reading-list-heading h3';
 const listTitles='.feature-copy h2,.reading-home-identity h2,.daily-card h3,.portal-reading-card h3,.v3-mixed-item [data-v3-field="mixedTitle"],.article-copy h3,.cf-result h3,.pd-saved-copy h3,.pd-link-card strong,.cf-mobile-recent strong,.portal-chapter-link strong,.book-card h3,.magazine h3,.books-library-card h3,.mag-card h3,.rank-row h3,.rank-row b,.small-book-row b,.oc-reading-list-heading h3,.portal-event h2,.activity-copy h3,.oc-activity-card h3,.oc-article h3,.pe-article h4,.rd-article strong,.topic-card h3,.discovery-topic h3,.research-link h3,.wm-chapter-link strong';
 const previews='.oc-reading-list-message p,.article-copy p,.v3-mixed-item [data-v3-field="mixedBody"],.v3-mixed-item [data-v3-field="mixedArticleBody"],.cf-result .cs-result-copy p,.pd-saved-copy p,.portal-event>div>p,.activity-copy>div>p,.oc-activity-card p,.oc-article p,.pe-article p,.rd-article p,.topic-card p,.story-copy p,.magazines-story-caption p,.pe-related-summary,.reader-toc-article small,.portal-tool small,.rd-tools p,.discovery-topic p,.research-link p,.rank-row p,.books-library-card .book-summary,.book-card .book-summary,[data-overflow-mode="ellipsis"]';
 const supplements=[
  ['.oc-profile-name','领读人姓名','modal',2],['.oc-profile-identity>p','领读人头衔','modal',2],
  [taskFields,'阅读任务与共读问题','modal',3],
  ['.intro-copy','读书会简介','inline',3],['.reader-comment-text','评论','inline',4],['.book-detail-about>p,.pe-intro-copy>p','资源简介','inline',6],['.book-detail-quote>p','编辑推荐','inline',4],
  ['.oc-opinion-slide p,.oc-profile-introduction section>p','阅读观点','inline',6],['.people-guide-card-copy>div>p','领读人身份','modal',2],
  ['.oc-person-card h2,.oc-activity-card h2,.oc-person-card span','卡片信息','modal',2],['.books-library-card footer>span:first-child','作者','modal',2],
  ['.podcast-track-heading>strong,.podcast-mobile-artwork strong,.podcast-hero-copy h1','播客标题','full',0],
  ['.wm-chapter-link strong,.small-book-row b,.rank-row b','条目名称','modal',2]
 ];
 const fullLabels=/^(页面主标题|栏目标题|英文栏目名|栏目英文名|栏目名称|读书会名称|导航名称|页脚导航|共读期次|期次|领读状态|参与人数|领读日期|阅读任务说明|活动详情标题|会员方案名称|会员权益标题|会员权益说明|弹窗标题|阅读文章标题|共读主推名称|书名与刊名详情)$/;
 function modeFor(node,label){
  if(node.matches(nicknames))return 'ellipsis';
  if(node.matches(taskFields))return node.closest(card)?'modal':'inline';
  if(node.matches(previews)||node.matches(listTitles))return 'ellipsis';
  if(node.matches(complete)||node.closest('.portal-reader-tools,.club-mobile-nav,.portal-faq,.portal-facts,.rd-facts,.portal-event-meta,.activity-meta')||fullLabels.test(label))return 'full';
  if(node.closest('.portal-event-detail,.oc-event-hero')&&node.matches('h1,h2'))return 'full';
  return node.closest(card)?'modal':'inline';
 }
 function labelFor(node){const name=node.dataset.v3Field;const labels={recommendationTitle:'推荐标题',recommendationBody:'推荐正文',articleBody:'文章摘要',resourceTitle:'资源名称',resourceMeta:'作者与期次',guide:'导读',why:'为什么选它',articleWhy:'为什么选它',dailyTitle:'每日一读标题',dailyMeta:'每日一读来源',podcastTitle:'播客标题',podcastMeta:'播客信息',mixedTitle:'条目标题',mixedMeta:'条目来源',mixedBody:'条目简介',mixedArticleBody:'文章摘要'};return labels[name]||node.dataset.overflowLabel||'完整文字';}
 function register(node,label,mode,lines){
  if(node.closest(excluded)||node.matches(systemFields)||node.matches('a,button,input,textarea,select,summary')||!node.textContent.trim())return;
  if(node.querySelector('a,button,input,select,textarea,img,svg,i,.iconfont'))return;
  const old=records.get(node);
  // Labels and line budgets come from the field registry, not from a later generic scan.
  const fieldLabel=old?.label||label;
  let resolved=modeFor(node,fieldLabel);
  if(mode==='full'||node.dataset.overflowMode==='full')resolved='full';
  if(node.matches(previews)||node.matches(listTitles))resolved='ellipsis';
  // Bounded task copy takes precedence over historic full-task exemptions.
  if(node.matches(taskFields))resolved=node.closest(card)?'modal':'inline';
  if(node.matches(nicknames))resolved='ellipsis';
  const cssLimit=parseInt(getComputedStyle(node).getPropertyValue('--to-limit')); 
  const limit=node.matches(nicknames)?1:resolved==='full'?0:node.matches(compactTitles)?2:Number.isFinite(cssLimit)&&cssLimit>0?cssLimit:
   (Number(node.dataset.overflowLines)||old?.lines||Number(lines)||(resolved==='inline'?6:2));
  if(old){
   if(old.mode!==resolved){old.expanded=false;node.classList.remove('to-expanded');}
   old.mode=resolved;old.lines=limit;return;
  }
  records.set(node,{label:fieldLabel,mode:resolved,lines:limit,expanded:false,lastText:node.textContent});node.classList.add('to-managed');
  if(node.title===node.textContent||node.hasAttribute('data-field-lines')||node.hasAttribute('data-secondary-lines')||node.hasAttribute('data-v3-field'))node.removeAttribute('title');
 }
 function discover(){
  document.querySelectorAll(nicknames).forEach(node=>register(node,'用户昵称','ellipsis',1));
  for(const rules of [window.clubHomeFieldLimits||[],window.clubSecondaryFieldLimits||[]])for(const rule of rules)document.querySelectorAll(rule.selector).forEach(node=>register(node,rule.label,modeFor(node,rule.label),rule.lines));
  document.querySelectorAll('[data-v3-field]').forEach(node=>register(node,labelFor(node),'modal',parseInt(node.style.getPropertyValue('--v3-lines'))||2));
  document.querySelectorAll(listTitles).forEach(node=>register(node,labelFor(node),'ellipsis',parseInt(getComputedStyle(node).webkitLineClamp)||2));
  document.querySelectorAll(previews).forEach(node=>register(node,labelFor(node),'ellipsis',parseInt(getComputedStyle(node).webkitLineClamp)||3));
  for(const [selector,label,mode,lines] of supplements)document.querySelectorAll(selector).forEach(node=>register(node,label,mode,lines));
  document.querySelectorAll('[data-overflow-mode]').forEach(node=>register(node,labelFor(node),node.dataset.overflowMode,node.dataset.overflowLines||4));
  // Catch legacy CSS-only clamps as well; never turn whole layout containers into fields.
  document.querySelectorAll('h1,h2,h3,h4,p,small,strong,span,blockquote,dd').forEach(node=>{
   if(records.has(node)||node.closest(excluded)||node.querySelector('p,h1,h2,h3,h4,div,section,article,figure,button,a,input,img,svg,i')||!node.textContent.trim())return;
   const css=getComputedStyle(node),clamp=parseInt(css.webkitLineClamp);
   if(clamp>0||css.textOverflow==='ellipsis'||(['hidden','clip'].includes(css.overflowY)&&node.scrollHeight>node.clientHeight+1))register(node,labelFor(node),modeFor(node,''),clamp||1);
  });
 }
 function makeAccessible(node,info,clipped){
  if(clipped){
   if(!node.closest('a,button,summary')){if(!node.hasAttribute('tabindex')){node.tabIndex=0;node.dataset.overflowOwnTab='1';}if(!node.hasAttribute('role')){node.setAttribute('role','button');node.dataset.overflowOwnRole='1';}}
   node.setAttribute('aria-haspopup',info.mode==='modal'?'dialog':'false');if(info.mode==='inline')node.setAttribute('aria-expanded','false');
  }else{
   if(node.dataset.overflowOwnTab){node.removeAttribute('tabindex');delete node.dataset.overflowOwnTab;}
   if(node.dataset.overflowOwnRole){node.removeAttribute('role');delete node.dataset.overflowOwnRole;}
   node.removeAttribute('aria-haspopup');if(info.expanded)node.setAttribute('aria-expanded','true');else node.removeAttribute('aria-expanded');
  }
 }
 function measure(){
  scheduled=0;watcher.disconnect();discover();
  for(const [node,info] of records){
   if(!node.isConnected){sizeObserver.unobserve(node);records.delete(node);continue;}
   if(node.textContent!==info.lastText){info.lastText=node.textContent;info.expanded=false;node.classList.remove('to-expanded');}
   node.dataset.overflowMode=info.mode;
   if(!node.getClientRects().length)continue;
   let line=parseFloat(getComputedStyle(node).lineHeight);if(!Number.isFinite(line))line=parseFloat(getComputedStyle(node).fontSize)*1.5;
   node.style.setProperty('--to-line',line+'px');
   node.classList.remove('to-collapsed','to-overflow');
   const full=info.mode==='full'||info.expanded||info.lines===0;
   node.style.setProperty('--to-lines',String(info.lines));node.classList.toggle('to-ellipsis',info.mode==='ellipsis');
   if(!full)node.classList.add('to-collapsed');
   const clipped=!full&&node.scrollHeight>node.clientHeight+1;
   node.classList.toggle('to-overflow',clipped&&info.mode!=='ellipsis');if(!clipped)node.classList.remove('to-collapsed');
   makeAccessible(node,info,clipped&&info.mode!=='ellipsis');sizeObserver.observe(node);
  }
  watcher.observe(document.body,{subtree:true,childList:true,characterData:true});
 }
 function schedule(){if(!scheduled)scheduled=requestAnimationFrame(measure);}
 const sizeObserver=new ResizeObserver(entries=>{let changed=false;for(const e of entries){const r=records.get(e.target);if(!r)continue;const width=e.contentRect.width;if(r.width!==width){r.width=width;changed=true;}}if(changed)schedule();});
 const watcher=new MutationObserver(schedule);
 const dialog=document.createElement('dialog');dialog.className='text-full-dialog';dialog.setAttribute('aria-labelledby','text-full-title');
 dialog.innerHTML='<header><h2 id="text-full-title"></h2><button type="button" aria-label="关闭" title="关闭"><i class="iconfont club-local-icon icon-Close" aria-hidden="true"></i></button></header><div class="text-full-body" tabindex="0"></div>';
 document.body.append(dialog);dialog.querySelector('button').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{document.body.classList.remove('text-full-open');if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});returnFocus=null;});
 function activate(node){const info=records.get(node);if(!info||info.mode==='ellipsis'||!node.classList.contains('to-overflow'))return;
  if(info.mode==='inline'){info.expanded=true;node.classList.add('to-expanded');measure();return;}
  returnFocus=node.closest('a')||node;dialog.querySelector('h2').textContent=info.label;dialog.querySelector('.text-full-body').textContent=node.textContent;dialog.classList.toggle('night',!!node.closest('.night'));dialog.showModal();document.body.classList.add('text-full-open');dialog.querySelector('button').focus();
 }
 // Capture before routing, the page-motion handler and enlarged-card activation.
 window.addEventListener('click',event=>{if(event.button!==0||event.metaKey||event.ctrlKey||event.altKey||event.shiftKey)return;const node=event.target.closest?.('.to-overflow');if(!node||window.getSelection()?.toString().trim())return;if(event.target.closest('button,input,select,textarea')&&!node.matches('button'))return;event.preventDefault();event.stopImmediatePropagation();activate(node);},true);
 window.addEventListener('keydown',event=>{if(!['Enter',' '].includes(event.key)||event.repeat)return;const target=event.target;let node=target.matches?.('.to-overflow')?target:null;if(!node&&event.key===' '&&target.matches?.('a'))node=target.querySelector('.to-overflow');if(!node)return;event.preventDefault();event.stopImmediatePropagation();activate(node);},true);
 window.addEventListener('resize',schedule,{passive:true});mobile.addEventListener('change',schedule);document.fonts?.ready.then(schedule);
 window.clubTextOverflow={refresh:schedule,audit:()=>[...records].filter(([n])=>n.isConnected).map(([n,r])=>({tag:n.tagName,label:r.label,mode:r.mode,lines:r.lines,overflow:n.classList.contains('to-overflow'),expanded:r.expanded,text:n.textContent}))};schedule();
})();
