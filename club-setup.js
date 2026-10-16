/* Isolated, local-only onboarding scenario. No remote resources are generated or saved. */
(() => {
  const home = document.querySelector('body > main#home');
  if (!home) return;
  const params = new URLSearchParams(location.search);
  const session = window.clubSession;
  const entry = new URL('index.html?setup=1', location.href).href;
  const setup = params.get('setup') === '1';
  const saved = session?.read('club-configuration', null);
  const personal = params.get('club') === 'mine' && saved;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const steps = [
    { id: 'featured', label: '本期领读', english: 'READ TOGETHER', question: '从一场共读开始？', description: '选择一种领读资源，我会在首页为它留出主角的位置。', choices: [['期刊领读','magazine'],['图书领读','book'],['文章领读','article'],['暂不设置',false]] },
    { id: 'books', label: '精选图书', english: 'SELECTED BOOKS', question: '要关联图书资源吗？', description: '搭建一个属于你的精选书架。演示中会放入几本虚拟图书。' },
    { id: 'magazines', label: '精选杂志', english: 'SELECTED MAGAZINES', question: '也想和大家一起读杂志吗？', description: '关联期刊后，读者可以在首页发现你精选的杂志。' },
    { id: 'podcasts', label: '播客', english: 'PODCASTS', question: '让读书会也有声音？', description: '我可以为你创建一个演示播客栏目，用声音分享阅读中的发现。' },
    { id: 'daily', label: '每日一读', english: 'DAILY READING', question: '每天，留一点时间给阅读？', description: '开启每日一读，为读者准备一篇适合短暂休息时阅读的内容。' },
    { id: 'articles', label: '精选文章', english: 'SELECTED ARTICLES', question: '把值得读的文章留下来？', description: '用精选文章，呈现你的阅读趣味与关注的话题。' },
    { id: 'activities', label: '精选活动', english: 'SELECTED EVENTS', question: '还想组织一些阅读活动吗？', description: '可以先创建一场虚拟共读活动，之后再补充真实时间与地点。' }
  ];
  if (!setup && !personal) {
    document.addEventListener('DOMContentLoaded', () => {
      const host = document.querySelector('.club-footer-service');
      if (host) { const a = document.createElement('a'); a.href = entry; a.textContent = '领读人首次配置 · 演示'; host.append(a); }
    });
    document.documentElement.classList.remove('club-setup-loading');
    return;
  }
  document.body.classList.add('club-setup-page');
  if(personal)document.body.classList.add('setup-personal-page');
  let config = personal ? saved.modules : { ...session?.read('club-configuration-draft', {}) };
  let current = 0, editing = false, busy = false, started = false;
  const palette = ['#dce2d6','#dcd8e6','#e6dccd','#cfdfdf','#dfd1d0'];
  const titles = {books:['在日常里，慢慢生长','把时间读成诗','一座城的温柔','留白的练习'],magazines:['日常来信','远山之间','万物有声','新知手记','慢生活'],podcasts:['听见文字的回声','把好奇心留给明天','读书，是一次相遇'],daily:['一页的光','与自己安静相处','在细微处发现美'],articles:['把目光交还给生活','每一次阅读，都是新的出发','我们如何理解彼此'],activities:['一个午后，一起读书']};
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const lines = () => '<div class="setup-lines" aria-hidden="true"><i></i><i></i><i></i></div>';
  const art = (i, generated, title, cls='setup-cover') => `<div class="${cls}${generated?' setup-generated-art':''}" style="--swatch:${palette[i%palette.length]}" aria-hidden="true">${generated?`<span>${title}</span>`:''}</div>`;
  const caption = (id,i,generated) => generated ? `<div><h3 class="setup-generated-title">${titles[id][i]}</h3><p class="setup-generated-meta">AI 演示内容 · ${id==='magazines'?'创刊号':id==='podcasts'?'声音与阅读':'我的阅读精选'}</p></div>` : lines();
  function moduleBody(id, generated=false) {
    if (id==='featured') return `<div class="setup-feature"><div><span class="setup-label">${generated?'本期共读 · AI 演示':'YOUR NEXT READING'}</span>${generated?'<h2 class="setup-generated-title" style="font-size:36px;margin:18px 0">在日常里，<br>慢慢生长</h2><p class="setup-generated-meta">和我一起，从文字里发现生活的另一种可能。</p>':lines()}</div>${config.featured==='article'?`<div class="setup-generated-art"><span>${generated?'在一页文字里，遇见更大的世界':lines()}</span></div>`:art(0,generated,'在日常里<br>慢慢生长')}<div><div class="setup-ring" aria-hidden="true"></div><p class="setup-generated-meta" style="text-align:center;margin-top:16px">${generated?'新的共读，即将开始': '领读进度预览'}</p></div></div>`;
    if (id==='books'||id==='magazines') return `<div class="setup-grid ${id==='magazines'?'mag-grid':''}">${Array.from({length:id==='books'?4:5},(_,i)=>`<article class="setup-card">${art(i,generated,titles[id][i])}${caption(id,i,generated)}</article>`).join('')}</div>`;
    if (id==='podcasts') return `<div class="setup-podcasts">${titles[id].map((_,i)=>`<article class="setup-podcast">${art(i+1,generated,'声音<br>来信')}${caption(id,i,generated)}</article>`).join('')}</div>`;
    if (id==='daily') return `<div class="setup-daily">${titles[id].map((_,i)=>`<article class="setup-card" style="--swatch:${palette[i]}">${caption(id,i,generated)}</article>`).join('')}</div>`;
    if (id==='articles') return titles[id].map((_,i)=>`<article class="setup-article">${art(i+1,generated,'阅读<br>片刻','setup-art')}${caption(id,i,generated)}</article>`).join('');
    return `<div class="setup-event">${generated?caption(id,0,true):lines()}${art(3,generated,'把阅读<br>带到生活里','setup-art')}</div>`;
  }
  const nickname = session?.profile?.nickname || '';
  home.innerHTML = `<section class="setup-intro"><div class="setup-topline"><span class="eyebrow">YOUR READING CLUB</span><a href="index.html" class="setup-label">返回普通首页</a></div><h1>${personal?(nickname?escape(nickname)+'的读书会':'我的读书会'):'每一种热爱，<br>都值得一场共读。'}</h1><p>${personal?'从一页文字出发，让喜欢的内容在这里相遇。':'这是你的读书会初稿。先看看它的样子，再一起把它变成你的。'}</p><div class="setup-intro-bottom"><span class="setup-tag">${personal?'专属首页 · AI 演示内容':'领读人视角 · 未配置'}</span><span class="setup-label">${personal?'内容为虚拟演示，未接入真实资源':'所有色块与文字占位均为演示'}</span></div></section>${personal?'<div class="setup-complete-banner" role="status"><span>你的读书会已准备就绪，欢迎开始新的共读。</span><button type="button" data-setup-restart>重新配置演示</button></div>':''}${steps.map(s=>`<section class="section setup-section" id="${s.id}" ${personal&&!config[s.id]?'hidden':''}><header class="section-title"><span>${s.english}</span><h2>${s.label}</h2></header><div class="setup-module-body">${moduleBody(s.id,personal)}</div></section>`).join('')}`;
  document.documentElement.classList.remove('club-setup-loading');
  // Keep demo resources from inheriting real-resource routing or book-opening behavior.
  if(!personal)document.querySelector('.demo-reading-widget')?.setAttribute('inert','');
  if (personal) {
    document.querySelector('[data-setup-restart]').addEventListener('click', () => {session?.write('club-configuration-draft',{});window.clubPageMotion.navigate(entry)});
    return;
  }
  const dock=document.createElement('aside');dock.className='setup-dock';dock.setAttribute('aria-label','创建读书会引导');
  dock.innerHTML='<div class="setup-dock-copy"><h2>恭喜您！<br>龙源读书会创建成功！</h2><p>当前内容为演示效果。让配置助手陪你完成内容创建，也可以前往后台配置。</p></div><div class="setup-dock-actions"><button class="button" data-setup-backend>去后台配置我的读书会</button><button class="button dark" data-setup-start>开始配置我的读书会</button></div>';
  document.body.append(dock);
  const assistant=document.createElement('aside');assistant.className='setup-assistant';assistant.hidden=true;assistant.setAttribute('aria-label','读书会配置助手');
  assistant.innerHTML='<header class="setup-chat-header"><img src="assets/reading-guide-avatar-v3.png" alt=""><div><h2>读书会配置助手</h2><p>一起，把想法变成读书会</p></div><button type="button" data-setup-minimize aria-label="收起配置助手">−</button></header><div class="setup-chat-messages" role="log" aria-label="配置对话" aria-live="polite"></div><form class="setup-chat-form"><textarea rows="2" aria-label="告诉配置助手你的选择" placeholder="例如：保留这个模块，或暂时跳过"></textarea><button type="submit" aria-label="发送配置选择">↑</button></form><p class="setup-chat-note">交互演示 · 选择仅保存在当前浏览器</p>';
  document.body.append(assistant);
  const reopen=document.createElement('button');reopen.className='setup-reopen';reopen.hidden=true;reopen.setAttribute('aria-label','展开配置助手');reopen.innerHTML='<img src="assets/reading-guide-avatar-v3.png" alt="">';document.body.append(reopen);
  const messages=assistant.querySelector('.setup-chat-messages'), input=assistant.querySelector('textarea');
  const animate=(el,frames,options={})=>reduced.matches?Promise.resolve():el.animate(frames,{duration:500,easing:'cubic-bezier(.16,1,.3,1)',...options}).finished.catch(()=>{});
  const delay=ms=>new Promise(resolve=>setTimeout(resolve,reduced.matches?Math.min(ms,80):ms));
  function message(html,user=false){const el=document.createElement('div');el.className=user?'setup-answer':'setup-message';el.innerHTML=user?`<span>${escape(html)}</span>`:html;messages.append(el);messages.scrollTop=messages.scrollHeight;animate(el,[{opacity:0,translate:'0 12px'},{opacity:1,translate:'0 0'}],{duration:400});return el}
  function progress(){dock.className='setup-dock setup-working';dock.innerHTML=`<div><strong>正在搭建你的读书会</strong><p>${Object.keys(config).length} / ${steps.length} 项已确认</p></div><div class="setup-step-track"><i style="width:${Object.keys(config).length/steps.length*100}%"></i></div><button data-setup-show>继续配置</button>`}
  function ask(index){current=index;const s=steps[index];const choices=s.choices||[['帮我配置',true],['暂不需要',false]];message(`<span class="setup-label">${String(index+1).padStart(2,'0')} / 07 · ${s.label}</span><h3>${s.question}</h3><p>${s.description}</p><div class="setup-choices">${choices.map(([label,value])=>`<button type="button" data-choice="${String(value)}">${label}</button>`).join('')}</div>`);input.placeholder=s.id==='featured'?'例如：我想领读一本书':'例如：帮我配置，或暂不需要';}
  function summary(){current=steps.length;editing=false;message('<span class="setup-label">READY TO CREATE</span><h3>你的读书会，轮廓已清晰。</h3><p>确认一下这些选择。点击任意一项可以修改。</p><div class="setup-summary">'+steps.map((s,i)=>`<button type="button" data-setup-edit="${i}"><span>${s.label}</span><small>${config[s.id]?'保留':'不展示'} · 修改</small></button>`).join('')+'</div><div class="setup-choices"><button data-setup-generate>确认，生成我的首页</button></div>');input.placeholder='确认生成，或点击上方修改选择';}
  async function apply(value,label){if(busy||current>=steps.length)return;busy=true;const s=steps[current];messages.querySelectorAll('[data-choice]').forEach(b=>b.disabled=true);message(label,true);config[s.id]=value;session?.write('club-configuration-draft',config);progress();const section=document.getElementById(s.id);section.hidden=false;section.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'center'});input.disabled=true;
    await delay(700);
    if(!value){message(`好的，首页将不展示「${s.label}」。之后也可以重新添加。`);const h=section.getBoundingClientRect().height;await animate(section,[{opacity:1,scale:'1'},{opacity:0,scale:'.98'}],{duration:380});await animate(section,[{height:h+'px',marginBottom:'0px',opacity:0},{height:'0px',marginBottom:'-80px',opacity:0}],{duration:450});section.hidden=true;section.classList.remove('is-confirmed');}
    else{section.querySelector('.setup-module-body').innerHTML=moduleBody(s.id);section.classList.add('is-confirmed');let status=section.querySelector('.setup-status');if(!status){status=document.createElement('span');status.className='setup-status';section.querySelector('header').append(status)}status.textContent='已配置 · 演示预览';await animate(section,[{opacity:.45,translate:'0 12px'},{opacity:1,translate:'0 0'}]);message(`已为你保留「${s.label}」，正式内容将在最后一步统一生成。`)}
    await delay(250);busy=false;input.disabled=false;if(editing){summary()}else if(current+1<steps.length){ask(current+1)}else summary();
  }
  async function generate(){if(busy)return;busy=true;assistant.hidden=true;reopen.hidden=true;dock.hidden=true;document.body.classList.remove('setup-configuring');const overlay=document.createElement('div');overlay.className='setup-generate';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','正在生成读书会首页');overlay.innerHTML='<div class="setup-generation-card"><div class="setup-generation-orb" aria-hidden="true"></div><h2>配置完成，正在生成。</h2><p>让你的阅读趣味，在这里慢慢成形。</p><div class="setup-generation-number"><span>0</span><small>%</small></div><div class="setup-generation-bar" role="progressbar" aria-label="首页生成进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i style="width:0%"></i></div><p class="setup-generation-stage" role="status">整理你的模块选择…</p></div>';document.body.append(overlay);home.inert=true;document.querySelector('.site-header').inert=true;document.querySelector('.club-site-footer')?.setAttribute('inert','');overlay.querySelector('.setup-generation-card').tabIndex=-1;overlay.querySelector('.setup-generation-card').focus({preventScroll:true});const count=overlay.querySelector('.setup-generation-number span'),bar=overlay.querySelector('[role=progressbar]'),stage=overlay.querySelector('.setup-generation-stage');const duration=reduced.matches?1400:5400,start=performance.now();await new Promise(resolve=>{function tick(now){const p=Math.min(100,Math.floor((now-start)/duration*100));count.textContent=p;bar.setAttribute('aria-valuenow',p);bar.firstElementChild.style.width=p+'%';stage.textContent=p<25?'整理你的模块选择…':p<58?'生成演示封面与内容…':p<85?'编排专属首页…':p<100?'完成最后的细节…':'你的读书会，准备好了。';if(p<100)requestAnimationFrame(tick);else resolve()}requestAnimationFrame(tick)});session?.write('club-configuration',{modules:config,completedAt:Date.now()});session?.write('club-configuration-draft',{});await delay(700);window.clubPageMotion.navigate(new URL('index.html?club=mine',location.href))}
  function show(){assistant.hidden=false;reopen.hidden=true;animate(assistant,[{opacity:0,translate:'28px 0',scale:'.97'},{opacity:1,translate:'0 0',scale:'1'}]);}
  function start(){if(started){show();return}started=true;document.body.classList.add('setup-configuring');show();progress();message('<h3>你好，领读人。</h3><p>接下来，我会陪你搭建首页。每确认一步，左侧页面都会同步变化。不需要的模块可以先收起来。</p>');steps.forEach(s=>{if(config[s.id]===false)document.getElementById(s.id).hidden=true});const next=steps.findIndex(s=>!(s.id in config));if(next<0)summary();else ask(next)}
  document.addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;if(b.hasAttribute('data-setup-start'))start();if(b.hasAttribute('data-setup-backend')){dock.querySelector('p').textContent='后台配置入口暂未接入。可以点击「开始配置我的读书会」体验前台配置。'}if(b.hasAttribute('data-setup-show'))show();if(b.hasAttribute('data-setup-minimize')){assistant.hidden=true;reopen.hidden=false}if(b===reopen)show();if(b.hasAttribute('data-choice')){const raw=b.dataset.choice;apply(raw==='true'?true:raw==='false'?false:raw,b.textContent)}if(b.hasAttribute('data-setup-edit')&&!busy){messages.querySelectorAll('[data-setup-generate],[data-setup-edit]').forEach(x=>x.disabled=true);editing=true;ask(Number(b.dataset.setupEdit));show()}if(b.hasAttribute('data-setup-generate'))generate()});
  assistant.querySelector('form').addEventListener('submit',e=>{e.preventDefault();const text=input.value.trim();if(!text||busy)return;input.value='';if(current>=steps.length){if(/确认|生成|完成|可以|好的/.test(text))generate();else message('<p>可以点击上方的模块修改选择，或回复「确认生成」。</p>');return}if(/不|跳过|取消|不要|隐藏|去掉/.test(text)){apply(false,text);return}if(current===0){const value=/期刊|杂志/.test(text)?'magazine':/图书|书/.test(text)?'book':/文章/.test(text)?'article':null;if(value)apply(value,text);else message('<p>想从期刊、图书还是文章开始？也可以选择暂不设置。</p>')}else if(/好|要|配置|保留|创建|关联|开|是|可以|需要/.test(text))apply(true,text);else message('<p>这个演示支持「帮我配置」或「暂不需要」，也可以直接点击上方选项。</p>')});
})();
