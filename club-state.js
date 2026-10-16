/* Shared local-only account state across the independent demo. */
(()=>{
 const base=new URL('.',document.currentScript.src);window.clubRootURL=base.href;
 const avatarPool=["assets/account-avatars/avatar-01.png", "assets/account-avatars/avatar-02.png", "assets/account-avatars/avatar-03.png", "assets/account-avatars/avatar-04.png", "assets/account-avatars/avatar-05.png", "assets/account-avatars/avatar-06.png", "assets/account-avatars/avatar-07.png", "assets/account-avatars/avatar-08.png", "assets/account-avatars/avatar-09.png"];
 const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem('club-demo:'+key))??fallback}catch{return fallback}};
 const write=(key,value)=>{try{localStorage.setItem('club-demo:'+key,JSON.stringify(value))}catch{}};
 const state=window.clubSession={get profile(){return read('profile',null)},get membership(){return read('membership',null)},read,write,
  update(profile){profile={...profile,avatar:profile.avatar||read('default-avatar',null)||avatarPool[Math.floor(Math.random()*avatarPool.length)]};write('default-avatar',profile.avatar);write('profile',profile);try{localStorage.setItem('club-demo:nickname',profile.nickname)}catch{};refresh();window.dispatchEvent(new Event('club-session-change'))},
  logout(){write('profile',null);try{localStorage.removeItem('club-demo:nickname')}catch{};refresh();window.dispatchEvent(new Event('club-session-change'))},
  member(plan){write('membership',{...plan,expires:'2027-10-15',started:'2026-10-15'});window.dispatchEvent(new Event('club-session-change'))},
  login(){dialog.showModal();dialog.querySelector('input').focus()}
 };
 const dialog=document.createElement('dialog');dialog.className='club-account-dialog';dialog.setAttribute('aria-label','登录读书会');dialog.innerHTML=`<form method="dialog"><button class="club-dialog-close" aria-label="关闭登录">×</button></form><span class="club-overline">YOUR READING SPACE</span><h2>欢迎回来。</h2><p>用一个昵称，开启你的阅读空间。</p><form id="club-demo-login"><label>阅读昵称<input name="nickname" maxlength="20" value="林间读者" autocomplete="nickname" required></label><label>邮箱（选填）<input name="email" type="email" autocomplete="email" placeholder="reader@example.com"></label><button class="button dark" type="submit">登录并开始阅读</button><small>演示登录，无需密码，资料仅保存在当前浏览器。</small></form>`;document.body.append(dialog);
 dialog.querySelector('#club-demo-login').addEventListener('submit',e=>{e.preventDefault();const f=e.target;state.update({nickname:f.nickname.value.trim(),email:f.email.value,bio:'读书，读人，也读世界。',city:'上海',interests:['文学','生活']});dialog.close()});
 const themes={共读:'reading',书友:'people',活动:'events',会员:'membership'};
 function refresh(){
  let profile=state.profile;if(profile&&!profile.avatar){profile={...profile,avatar:read('default-avatar',null)||avatarPool[Math.floor(Math.random()*avatarPool.length)]};write('default-avatar',profile.avatar);write('profile',profile)}
  document.querySelectorAll('.nav-shell nav a,.nav-shell nav button,.club-demo-topbar .nav a').forEach(el=>{
   const page=themes[el.textContent.trim()];if(!page)return;
   if(el.tagName==='BUTTON'){const a=document.createElement('a');a.href=new URL('portal.html#/'+page,base);a.textContent=el.textContent;el.replaceWith(a)}else el.href=new URL('portal.html#/'+page,base);
  });
  document.querySelectorAll('.login,.nav-login').forEach(el=>{el.replaceChildren();if(profile){const img=document.createElement('img');img.className='club-account-avatar';img.src=new URL(profile.avatar,base);img.alt='';img.width=28;img.height=28;const name=document.createElement('span');name.className='club-account-name';name.textContent=profile.nickname;el.append(img,name)}else el.textContent='登录';el.classList.toggle('is-signed-in',!!profile);el.setAttribute('aria-label',profile?'我的阅读空间':'登录');if(el.tagName==='A')el.href=new URL('portal.html#/me',base)});
 }
 document.addEventListener('click',e=>{
  const login=e.target.closest('.login,.nav-login,[data-club-login]');if(login){e.preventDefault();e.stopImmediatePropagation();if(state.profile&&!login.hasAttribute('data-club-login'))location.href=new URL('portal.html#/me',base);else state.login();return}
  const member=e.target.closest('[data-open="member"],.member');if(member){e.preventDefault();e.stopImmediatePropagation();location.href=new URL('portal.html#/membership',base);return}
 },true);
 refresh();window.addEventListener('storage',refresh);window.addEventListener('hashchange',refresh);
})();
