import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const mount = document.querySelector('#game');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x081321);
scene.fog = new THREE.Fog(0x081321, 28, 115);
const camera = new THREE.PerspectiveCamera(65, innerWidth/innerHeight, .1, 220);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
mount.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0x9bcfff,0x17202b,2.0));
const sun = new THREE.DirectionalLight(0xc5e8ff,2.3);
sun.position.set(-18,35,12); sun.castShadow=true; sun.shadow.mapSize.set(1024,1024); scene.add(sun);

const mat=(color,roughness=.8,metalness=.05)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const groundMat=mat(0x182532), roadMat=mat(0x111923), buildingMats=[mat(0x26394b),mat(0x30495c),mat(0x1c3043),mat(0x35404e)];
const ground=new THREE.Mesh(new THREE.PlaneGeometry(180,180),groundMat); ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; scene.add(ground);

function box(x,y,z,sx,sy,sz,material,shadow=true){const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),material);m.position.set(x,y,z);m.castShadow=shadow;m.receiveShadow=true;scene.add(m);return m}
function road(x,z,sx,sz){box(x,.025,z,sx,.05,sz,roadMat,false);const dash=mat(0x8bb9c9);if(sx>sz){for(let i=-sx/2+3;i<sx/2;i+=7)box(x+i,.06,z,3,.025,.12,dash,false)}else{for(let i=-sz/2+3;i<sz/2;i+=7)box(x,.06,z+i,.12,.025,3,dash,false)}}
road(0,0,150,10);road(0,0,10,150);road(0,-35,100,8);road(0,35,100,8);road(-35,0,8,100);road(35,0,8,100);
const windowMat=new THREE.MeshStandardMaterial({color:0x5bdcff,emissive:0x167a9a,emissiveIntensity:.8});
for(let i=0;i<22;i++){
  const x=(Math.random()-.5)*105,z=(Math.random()-.5)*105;
  if(Math.abs(x)<12||Math.abs(z)<12)continue;
  const w=5+Math.random()*7,d=5+Math.random()*7,h=7+Math.random()*22;
  const b=box(x,h/2,z,w,h,d,buildingMats[i%buildingMats.length]);
  for(let yy=2;yy<h-1;yy+=3){for(let xx=-w/2+1;xx<w/2-0.5;xx+=2.2){const win=new THREE.Mesh(new THREE.BoxGeometry(.8,1.05,.08),windowMat);win.position.set(x+xx,yy,z+d/2+.045);scene.add(win)}}
}
const lampMat=new THREE.MeshStandardMaterial({color:0x4ad7ff,emissive:0x159acb,emissiveIntensity:2});
for(const [x,z] of [[-8,-8],[8,-8],[-8,8],[8,8],[-26,12],[26,-12]]){box(x,2.2,z,.16,4.4,.16,mat(0x516c80));const l=new THREE.Mesh(new THREE.SphereGeometry(.32,12,8),lampMat);l.position.set(x,4.5,z);scene.add(l)}
// Player avatar
const player=new THREE.Group();scene.add(player);
const body=new THREE.Mesh(new THREE.CapsuleGeometry(.48,.85,4,8),mat(0xd83b4b));body.position.y=1.15;body.castShadow=true;player.add(body);
const head=new THREE.Mesh(new THREE.SphereGeometry(.34,16,12),mat(0xe5b995));head.position.y=2.05;head.castShadow=true;player.add(head);
const visor=new THREE.Mesh(new THREE.BoxGeometry(.42,.12,.08),mat(0x182a3b,.25,.5));visor.position.set(0,2.08,-.29);player.add(visor);
player.position.set(0,0,12);

// Service kiosk and NPC
const kiosk= new THREE.Group();kiosk.position.set(5,0,-8);scene.add(kiosk);
const kioskBody=new THREE.Mesh(new THREE.BoxGeometry(2.3,2.6,1.4),mat(0x164f72));kioskBody.position.y=1.3;kiosk.add(kioskBody);
const kioskScreen=new THREE.Mesh(new THREE.BoxGeometry(1.55,1.15,.08),new THREE.MeshStandardMaterial({color:0x55ddff,emissive:0x168db5,emissiveIntensity:1.5}));kioskScreen.position.set(0,1.55,-.75);kiosk.add(kioskScreen);
const npc=new THREE.Group();npc.position.set(5,0,-5.5);scene.add(npc);
const npcBody=new THREE.Mesh(new THREE.CapsuleGeometry(.42,.8,4,8),mat(0x55b99c));npcBody.position.y=1.1;npc.add(npcBody);
const npcHead=new THREE.Mesh(new THREE.SphereGeometry(.31,14,10),mat(0xd5a77f));npcHead.position.y=2;npc.add(npcHead);
const marker=new THREE.Mesh(new THREE.ConeGeometry(.22,.5,12),mat(0x55e5ff));marker.position.set(5,3,-5.5);scene.add(marker);
const sign=box(5,3.8,-8,2.6,.35,.15,mat(0x1e9bc0)); sign.material.emissive=new THREE.Color(0x087da8);sign.material.emissiveIntensity=1;

// Decorative parked vehicle
const car=new THREE.Group();car.position.set(-7,0,5);scene.add(car);
const chassis=new THREE.Mesh(new THREE.BoxGeometry(2.2,.55,4),mat(0x9c3142,.35,.45));chassis.position.y=.75;car.add(chassis);
const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.65,.8,1.8),mat(0x264e66,.25,.55));cabin.position.set(0,1.38,-.25);car.add(cabin);
for(const x of [-1,1])for(const z of [-1.3,1.3]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.38,.38,.22,16),mat(0x10151c));wheel.rotation.z=Math.PI/2;wheel.position.set(x,.48,z);car.add(wheel)}

// Boundaries and plaza
for(let i=-1;i<=1;i++){box(i*48,.15,-48,100,.3,.5,mat(0x1b455b));box(i*48,.15,48,100,.3,.5,mat(0x1b455b))}
const keys={};addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(e.key.toLowerCase()==='e')interact()});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
let yaw=0,pitch=.22,credits=100,hasJob=false;
const creditsEl=document.querySelector('#credits'),jobEl=document.querySelector('#job'),message=document.querySelector('#message');
function say(t){message.textContent=t}
function interact(){const dist=player.position.distanceTo(npc.position);if(dist<4.2){if(!hasJob){hasJob=true;jobEl.textContent='COURIER';say('Courier shift accepted! Deliveries will arrive in a future update. +₡25 welcome bonus.');credits+=25;creditsEl.textContent=credits}else{say('Dispatcher: Your courier shift is already registered. More missions coming soon!')}}else if(dist<4.2+0.1){say('Welcome to the service kiosk.')}else{say('Move closer to the service NPC to interact.')}}
document.querySelector('#interact').addEventListener('click',interact);
let dragging=false,lastX=0,lastY=0;
renderer.domElement.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){dragging=true;lastX=e.clientX;lastY=e.clientY}});
addEventListener('pointerup',()=>dragging=false);
addEventListener('pointermove',e=>{if(dragging){yaw-=(e.clientX-lastX)*.005;pitch=Math.max(-.05,Math.min(.65,pitch+(e.clientY-lastY)*.003));lastX=e.clientX;lastY=e.clientY}});
let joy={x:0,y:0};const zone=document.querySelector('#stick-zone'),stick=document.querySelector('#stick');let joyId=null;
zone.addEventListener('pointerdown',e=>{joyId=e.pointerId;zone.setPointerCapture(joyId);updateJoy(e)});
zone.addEventListener('pointermove',e=>{if(e.pointerId===joyId)updateJoy(e)});
function updateJoy(e){const r=zone.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=e.clientX-cx,dy=e.clientY-cy,len=Math.hypot(dx,dy),max=38;if(len>max){dx=dx/len*max;dy=dy/len*max}joy.x=dx/max;joy.y=dy/max;stick.style.transform=`translate(${dx}px,${dy}px)`}
function resetJoy(){joy={x:0,y:0};joyId=null;stick.style.transform='translate(0,0)'}zone.addEventListener('pointerup',resetJoy);zone.addEventListener('pointercancel',resetJoy);
let lookPointer=null,lookX=0;
addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'&&e.clientX>innerWidth*.48){lookPointer=e.pointerId;lookX=e.clientX}});
addEventListener('pointermove',e=>{if(e.pointerId===lookPointer){yaw-=(e.clientX-lookX)*.008;lookX=e.clientX}});
addEventListener('pointerup',e=>{if(e.pointerId===lookPointer)lookPointer=null});
const clock=new THREE.Clock();
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04);
 let f=(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0)-joy.y;
 let s=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+joy.x;
 const len=Math.hypot(f,s);if(len>.01){f/=Math.max(1,len);s/=Math.max(1,len);const forward=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));const right=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw));player.position.addScaledVector(forward,f*7*dt);player.position.addScaledVector(right,s*7*dt);player.rotation.y=Math.atan2(-forward.x,-forward.z)}
 player.position.x=THREE.MathUtils.clamp(player.position.x,-44,44);player.position.z=THREE.MathUtils.clamp(player.position.z,-44,44);
 const target=new THREE.Vector3(player.position.x+Math.sin(yaw)*10,4.5+pitch*4,player.position.z+Math.cos(yaw)*10);
 camera.position.lerp(target,1-Math.pow(.001,dt));camera.lookAt(player.position.x,1.25,player.position.z);
 marker.position.y=3+Math.sin(performance.now()*.003)*.18;
 renderer.render(scene,camera)}
animate();
document.querySelector('#start').addEventListener('click',()=>{document.querySelector('#start-screen').style.display='none';say('Welcome to Egg City. Find the blue dispatcher near the central road.')});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
