(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // page load
  window.addEventListener('load', ()=>document.body.classList.add('loaded'));
  setTimeout(()=>document.body.classList.add('loaded'),600);

  // mobile menu (global for inline onclick)
  const burger=document.querySelector('.burger');
  window.toggleMenu=function(open){
    document.body.classList.toggle('menu-open',open);
    const mnav=document.getElementById('mnav');
    if(mnav)mnav.setAttribute('aria-hidden',!open);
    if(burger)burger.setAttribute('aria-expanded',open);
  };
  document.addEventListener('keydown',e=>{if(e.key==='Escape')toggleMenu(false);});

  // sticky header + scroll progress + parallax
  const header=document.getElementById('header');
  const progress=document.getElementById('progress');
  const parallaxEls=[...document.querySelectorAll('[data-parallax]')];
  let ticking=false;
  function onScroll(){
    const y=window.scrollY;
    if(header)header.classList.toggle('solid',y>40);
    if(progress){const h=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=(h>0?(y/h*100):0)+'%';}
    if(!reduce){for(const el of parallaxEls){const r=el.getBoundingClientRect();const c=r.top+r.height/2-window.innerHeight/2;el.style.transform='translateY('+(c*parseFloat(el.dataset.parallax))+'px)';}}
    ticking=false;
  }
  window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(onScroll);ticking=true;}},{passive:true});
  onScroll();

  // reveal on scroll
  const io=new IntersectionObserver((entries)=>{entries.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('in'),(i%4)*80);io.unobserve(e.target);}});},{threshold:.14,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // count-up
  const cio=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,to=+el.dataset.to;if(reduce){el.textContent=to;cio.unobserve(el);return;}let n=0;const step=Math.max(1,Math.round(to/28));const t=setInterval(()=>{n+=step;if(n>=to){n=to;clearInterval(t);}el.textContent=n;},32);cio.unobserve(el);});},{threshold:.6});
  document.querySelectorAll('.count').forEach(el=>cio.observe(el));

  // nav active state by current page
  const path=(location.pathname.split('/').pop()||'index.html');
  document.querySelectorAll('.menu a, .mnav nav a').forEach(a=>{if(a.getAttribute('href')===path)a.classList.add('active');});

  // cursor-follow service preview (home only, desktop, pointer-fine)
  const prev=document.getElementById('svcPreview');
  const list=document.getElementById('svcList');
  if(!reduce && prev && list && window.matchMedia('(pointer:fine)').matches){
    const imgs={};prev.querySelectorAll('img').forEach(i=>imgs[i.dataset.key]=i);
    let tx=0,ty=0,cx=0,cy=0,raf=null;
    function loop(){cx+=(tx-cx)*.16;cy+=(ty-cy)*.16;prev.style.left=cx+'px';prev.style.top=cy+'px';raf=requestAnimationFrame(loop);}
    list.querySelectorAll('.svc').forEach(row=>{
      row.addEventListener('mouseenter',()=>{const k=row.dataset.img;Object.values(imgs).forEach(i=>i.classList.remove('on'));if(imgs[k])imgs[k].classList.add('on');prev.classList.add('show');if(!raf)loop();});
      row.addEventListener('mouseleave',()=>{prev.classList.remove('show');});
    });
    list.addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;if(cx===0){cx=tx;cy=ty;}});
    list.addEventListener('mouseleave',()=>{if(raf){cancelAnimationFrame(raf);raf=null;}});
  }

  // hero image crossfade
  var hfs=[].slice.call(document.querySelectorAll('.hero-frame .hf'));
  if(!reduce && hfs.length>1){
    var hi=0;
    setInterval(function(){
      hfs[hi].classList.remove('on');
      hi=(hi+1)%hfs.length;
      hfs[hi].classList.add('on');
    },4200);
  }

  // magnetic buttons (desktop, pointer-fine)
  if(!reduce && window.matchMedia('(pointer:fine)').matches){
    document.querySelectorAll('.magnetic').forEach(function(el){
      el.addEventListener('mousemove',function(e){
        var r=el.getBoundingClientRect();
        var mx=e.clientX-r.left-r.width/2, my=e.clientY-r.top-r.height/2;
        el.style.transform='translate('+(mx*0.22).toFixed(1)+'px,'+(my*0.34).toFixed(1)+'px)';
      });
      el.addEventListener('mouseleave',function(){el.style.transform='';});
    });
  }
})();
