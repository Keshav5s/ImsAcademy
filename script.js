const pages=[['index.html','Home'],['about.html','About Us'],['branches.html','Branches'],['contact.html','Contact Us'],['email.html','Email Us']];
const cur=location.pathname.split('/').pop()||'index.html';
document.body.insertAdjacentHTML('afterbegin',`<header><a class="logo" href="index.html">IMS<b>.</b>Academy</a><nav id="nav">${pages.map(p=>`<a href="${p[0]}" class="${p[0]==cur?'on':''}">${p[1]}</a>`).join('')}</nav><button class="burger" id="bg">☰</button></header>`);
document.body.insertAdjacentHTML('beforeend',`<footer><div class="logo">IMS<b>.</b>Academy</div><p>1/7130, Post Office Road, Shivaji Park, Shahdara, New Delhi, Delhi, 110032</p><p>© ${new Date().getFullYear()} IMS Academy. Learn. Level up.</p></footer>`);
document.getElementById('bg').onclick=()=>document.getElementById('nav').classList.toggle('open');
// smooth page transitions
document.querySelectorAll('a[href$=".html"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.body.classList.add('out');setTimeout(()=>location.href=a.href,380)}));
addEventListener('pageshow',()=>document.body.classList.remove('out'));
// reveal on scroll
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('show')),{threshold:.15});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
// parallax
const px=[...document.querySelectorAll('[data-speed]')];
addEventListener('scroll',()=>{const y=scrollY;px.forEach(el=>{const r=el.parentElement.getBoundingClientRect();el.style.transform=`translateY(${(r.top)*el.dataset.speed}px)`})},{passive:true});
// three.js hero
const c=document.getElementById('hero3d');
if(c&&window.THREE){
const r=new THREE.WebGLRenderer({canvas:c,alpha:true,antialias:true}),s=new THREE.Scene(),cam=new THREE.PerspectiveCamera(60,1,.1,100);cam.position.z=7;
const mk=(g,col)=>new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:col,wireframe:true}));
const ico=mk(new THREE.IcosahedronGeometry(2,1),0xe10600),tor=mk(new THREE.TorusKnotGeometry(.8,.25,80,12),0x111111);
ico.position.x=3;tor.position.set(-3.5,-1.5,-1);s.add(ico,tor);
const pts=new Float32Array(900*3).map(()=>(Math.random()-.5)*20),pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pts,3));
const stars=new THREE.Points(pg,new THREE.PointsMaterial({size:.04,color:0xe10600}));s.add(stars);
let mx=0,my=0;addEventListener('mousemove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
const rs=()=>{r.setSize(c.clientWidth,c.clientHeight,false);cam.aspect=c.clientWidth/c.clientHeight;cam.updateProjectionMatrix();ico.position.x=innerWidth<800?0:3};rs();addEventListener('resize',rs);
(function a(){ico.rotation.x+=.003;ico.rotation.y+=.005;tor.rotation.x+=.01;tor.rotation.y+=.008;stars.rotation.y+=.0006;cam.position.x+=(mx*2-cam.position.x)*.05;cam.position.y+=(-my*2-cam.position.y)*.05;cam.lookAt(0,0,0);r.render(s,cam);requestAnimationFrame(a)})();
}
// d3 results chart + counters
const ch=document.getElementById('chart');
if(ch&&window.d3){
const data=[['2020',62],['2021',71],['2022',78],['2023',86],['2024',92],['2025',96]];
const w=ch.clientWidth,h=300,svg=d3.select(ch).append('svg').attr('viewBox',`0 0 ${w} ${h}`).attr('width','100%');
const x=d3.scaleBand().domain(data.map(d=>d[0])).range([30,w-10]).padding(.35),y=d3.scaleLinear().domain([0,100]).range([h-30,10]);
svg.append('g').attr('transform',`translate(0,${h-30})`).call(d3.axisBottom(x).tickSize(0)).selectAll('text').attr('fill','#111');
svg.selectAll('.domain').remove();
const bars=svg.selectAll('rect').data(data).join('rect').attr('x',d=>x(d[0])).attr('width',x.bandwidth()).attr('y',h-30).attr('height',0).attr('rx',10).attr('fill',(d,i)=>i==5?'#111':'#e10600');
bars.on('mouseover',function(){d3.select(this).attr('opacity',.7)}).on('mouseout',function(){d3.select(this).attr('opacity',1)});
new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){bars.transition().duration(1200).delay((d,i)=>i*120).attr('y',d=>y(d[1])).attr('height',d=>h-30-y(d[1]));
svg.selectAll('.v').data(data).join('text').attr('x',d=>x(d[0])+x.bandwidth()/2).attr('y',d=>y(d[1])-6).attr('text-anchor','middle').attr('fill','#111').attr('font-size',12).text(d=>d[1]+'%');o.disconnect()}}).observe(ch);
}
document.querySelectorAll('[data-count]').forEach(el=>new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){d3.select(el).transition().duration(1500).tween('t',()=>{const i=d3.interpolateNumber(0,+el.dataset.count);return t=>el.textContent=Math.round(i(t))+(el.dataset.s||'')});o.disconnect()}}).observe(el));
// forms -> mailto
document.querySelectorAll('form[data-mail]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(f);location.href=`mailto:info@imsacademy.in?subject=${encodeURIComponent(d.get('subject')||'Enquiry from '+d.get('name'))}&body=${encodeURIComponent(d.get('message')+'\n\n'+d.get('name')+' | '+d.get('phone'))}`}));
