/* Local display samples: semantic, bounded and traceable; never mutate source objects, routes or IDs. */
(()=>{
 const data=window.overflowFixtureData;if(!data)return;
 const seen=new WeakSet(),inputs=new WeakSet(),fixed=new WeakSet();let frame=0;
 const norm=s=>String(s||'').replace(/\s+/g,'').replace(/[。！!？?]+$/,'');
 const index=new Map();for(const field of data.fields)for(const source of field.originals){const key=norm(source),list=index.get(key)||[];if(!list.some(x=>x.key===field.key))list.push(field);index.set(key,list);}
 const skip='.club-motion-snapshot,script,style,svg,.iconfont,.sr-only,input,textarea,select,.portal-prose,.reader-paper,.reader-content,.portal-article-head,.podcast-caption,.book-course-transcript,.text-full-dialog,.text-full-body,.portal-facts,.pd-facts,.rd-facts,.cf-desktop-stats,.cf-mobile-stats,.cf-account-stats,.cs-filter-sheet,.pm-interest-sheet,.badge,.reading-home-status,.oc-reading-list-status,.oc-status,[role=progressbar],.reading-home-issue,.oc-reading-participants,.reading-home-participants,.participants,.cf-share-preview';
 const systemCopy=new Set(['你好','为什么选它','领读语','导读','共读问题','今日阅读任务','阅读进度','剩余时间','总进度','基本信息','我的收藏','我的订单','活动报名','我的共读','分享读书会','编辑个人资料','退出登录','最近搜索历史','全部内容','阅读权益','会员权益']);
 const systemSelectors='.oc-profile-greeting,.v3-reason>h3,.v3-article-reason>strong,.v3-resource blockquote>strong,.feature-copy blockquote>strong,.reading-home-identity blockquote>strong,.reading-home-assignment blockquote>strong,.oc-reading-list-message>strong,.reading-home-task>header>h2,.reading-home-clock>span,.oc-reading-list-summary-copy>div>strong,.pd-label,label,legend,dt,.field-limit-counter,.cs-heading,.reading-home-heading';
 const fixedLabels=/^(栏目名称|栏目标题|英文栏目名|栏目英文名|通用栏目标题|导航名称|页脚导航|领读状态|共读期次|期次|参与人数|领读日期|筛选项|会员方案名称|会员权益标题|会员权益说明|工具名称|弹窗标题|学术及专题页面主标题)$/;
 function hash(s){let n=2166136261;for(const c of s)n=Math.imul(n^c.codePointAt(0),16777619);return n>>>0;}
 function kindFor(n,label){
  const name=n.dataset.v3Field||'';
  if(n.matches('.club-account-name,.cf-mobile-identity strong,.portal-account-side>h2,.cf-account-menu>header strong'))return 'nickname';
  if(n.matches('.reader-comment-text,.oc-reading-notes p,.book-notes-list p'))return 'comment';
  if(n.matches('.reading-home-task-description,.oc-guided-question>p'))return 'task';
  if(n.matches('.reading-home-assignment blockquote p,.oc-guided-question blockquote p'))return 'question';
  if(/姓名|名字|昵称/.test(label)||n.matches('.oc-profile-name'))return 'name';
  if(/头衔|职务|身份|署名|作者|来源|期次|出版社|元信息/.test(label)||/Meta$/.test(name))return 'metadata';
  if(/why|articleWhy/.test(name)||/为什么选它|推荐理由|编辑推荐/.test(label)||n.matches('.book-detail-quote>p'))return 'why';
  if(/guide/i.test(name)||/导读|领读语|寄语/.test(label)||n.matches('.oc-reading-list-message p,.feature-copy blockquote p,.reading-home-identity blockquote p'))return 'guide';
  if(/Title$/.test(name)||/标题|名称|篇名|章名/.test(label)||n.matches('h1,h2,h3,h4'))return 'title';
  if(/笔记/.test(label))return 'note';
  return 'body';
 }
 function sample(n,label,text){
  const scoped=data.fields.find(field=>field.selectors?.some(selector=>n.matches(selector)));if(scoped)return scoped;
  const kind=kindFor(n,label),candidates=index.get(norm(text))||[],known=candidates.find(field=>field.kind===kind)||candidates[0];
  // Exact aliases tie a resource field across pages, but an unrelated article excerpt is not a book field.
  if(known&&!(known.key.startsWith('book.')&&n.closest('.v3-mixed-item[data-kind="article"]')))return known;
  if(kind==='nickname')return {key:'club.account.nickname',kind,text:'在书页之间寻找远方的读者'};
  const key='content.'+kind+'.'+hash(norm(text)).toString(16);
  // Realistic fixed/short fields stay short; do not invent surnames, credentials, issues or publication names.
  if(['name','metadata','title'].includes(kind)||/^\d/.test(text)||text.length>140)return {key,kind,text};
  const pool=data.pools[kind]||data.pools.body,extra=pool[hash(norm(text))%pool.length];
  return {key,kind,text:text.replace(/[。\s]+$/,'')+'。'+extra};
 }
 function apply(n,label='内容字段'){
  if(fixed.has(n)||seen.has(n)||n.closest(systemSelectors)||n.closest(skip)||!n.textContent.trim()||n.matches('a,button,.oc-profile-title h1')||n.querySelector('img,svg,i,.iconfont,button,a,input,textarea,select,h1,h2,h3,h4,p,div,section,article'))return;
  const text=n.textContent.trim();if(systemCopy.has(text.replace(/[？?：:！!。\s]+$/g,''))||!/[\p{L}]/u.test(text)||n.closest('header.site-header nav,.club-mobile-nav,footer nav'))return;
  const field=sample(n,label,text);seen.add(n);n.dataset.overflowFixtureOriginal=text;n.dataset.overflowFixtureLabel=label;n.dataset.overflowFixtureKey=field.key;n.dataset.overflowFixtureKind=field.kind;
  if(field.text!==text)n.textContent=field.text;
 }
 function scan(){frame=0;
  for(const rules of [window.clubHomeFieldLimits||[],window.clubSecondaryFieldLimits||[]])for(const r of rules)if(fixedLabels.test(r.label))document.querySelectorAll(r.selector).forEach(n=>fixed.add(n));
  document.querySelectorAll('.portal-account-panel>h2,.cf-panel-heading h2,.cs-result-title h2,.cs-heading h1,.pd-label,.cf-mobile-menu strong,.cf-mobile-shortcuts button,.club-footer-columns h2').forEach(n=>fixed.add(n));
  for(const rules of [window.clubHomeFieldLimits||[],window.clubSecondaryFieldLimits||[]])for(const r of rules)document.querySelectorAll(r.selector).forEach(n=>apply(n,r.label));
  document.querySelectorAll('[data-v3-field],[data-overflow-mode],.to-managed').forEach(n=>apply(n,n.dataset.v3Field||n.dataset.overflowLabel||'内容字段'));
  document.querySelectorAll('.cf-mobile-identity strong,.pd-saved-copy small,.pd-link-card strong,.cf-account-menu strong,.club-account-name').forEach(n=>apply(n));
  document.querySelectorAll('#profile-form input[maxlength]').forEach(n=>{if(inputs.has(n)||n.type==='hidden')return;inputs.add(n);if(n.name==='nickname')n.value='在书页之间寻找远方的读者'.slice(0,n.maxLength);else if(n.name==='email')n.value='reading.community.member@example-reading-club.test';else if(n.name==='interests')n.value='中国文学、世界历史、商业观察、城市生活、艺术建筑、科技社会、人物传记、心理成长';n.dispatchEvent(new Event('input',{bubbles:true}));});
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(scan)}
 new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});document.fonts?.ready.then(schedule);window.addEventListener('hashchange',schedule);window.addEventListener('resize',schedule);schedule();
 window.overflowLab={version:data.version,audit:()=>[...document.querySelectorAll('[data-overflow-fixture-key]')].map(n=>({key:n.dataset.overflowFixtureKey,kind:n.dataset.overflowFixtureKind,label:n.dataset.overflowFixtureLabel,original:n.dataset.overflowFixtureOriginal,text:n.textContent,mode:n.dataset.overflowMode||'native'}))};
})();
