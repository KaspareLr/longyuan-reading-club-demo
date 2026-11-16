/* Isolated visual fixture: no source data or storage is rewritten. */
(()=>{if(location.pathname.endsWith('/portal.html')){const u=new URL(location.href);u.searchParams.set('personalPreview','filled');history.replaceState(null,'',u.href);}})();
