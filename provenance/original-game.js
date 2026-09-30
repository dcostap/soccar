(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class e{x;y;z;constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return this.x=e,this.y=t,this.z=n,this}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}clone(){return new e(this.x,this.y,this.z)}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}addScaled(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}scale(e){return this.x*=e,this.y*=e,this.z*=e,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}normalize(){let e=this.length();return e>1e-12&&this.scale(1/e),this}crossVectors(e,t){let n=e.y*t.z-e.z*t.y,r=e.z*t.x-e.x*t.z,i=e.x*t.y-e.y*t.x;return this.x=n,this.y=r,this.z=i,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}distanceTo(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return Math.sqrt(t*t+n*n+r*r)}clampLength(e){let t=this.lengthSq();return t>e*e&&this.scale(e/Math.sqrt(t)),this}isZero(){return this.x===0&&this.y===0&&this.z===0}},t=class e{x;y;z;w;constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w,this}clone(){return new e(this.x,this.y,this.z,this.w)}normalize(){let e=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);return e===0?(this.set(0,0,0,1),this):(e=1/e,this.x*=e,this.y*=e,this.z*=e,this.w*=e,this)}setFromEuler(e,t,n){let r=Math.cos(e/2),i=Math.sin(e/2),a=Math.cos(-t/2),o=Math.sin(-t/2),s=Math.cos(n/2),c=Math.sin(n/2);return this.w=r*a*s+i*o*c,this.x=r*a*c-i*o*s,this.y=r*o*s+i*a*c,this.z=i*a*s-r*o*c,this}setFromAxisAngle(e,t){let n=Math.sin(t/2);return this.x=e.x*n,this.y=e.y*n,this.z=e.z*n,this.w=Math.cos(t/2),this}integrate(e,t){let n=e.length()*t;if(n<1e-9)return this;let r=1/e.length(),i=Math.sin(n/2),a=Math.cos(n/2),o=e.x*r*i,s=e.y*r*i,c=e.z*r*i,l=a,u=l*this.x+o*this.w+s*this.z-c*this.y,d=l*this.y-o*this.z+s*this.w+c*this.x,f=l*this.z+o*this.y-s*this.x+c*this.w,p=l*this.w-o*this.x-s*this.y-c*this.z;return this.x=u,this.y=d,this.z=f,this.w=p,this.normalize()}slerp(e,t){let n=this.w*e.w+this.x*e.x+this.y*e.y+this.z*e.z,r=e.x,i=e.y,a=e.z,o=e.w;if(n<0&&(n=-n,r=-r,i=-i,a=-a,o=-o),n>.9995)return this.x+=(r-this.x)*t,this.y+=(i-this.y)*t,this.z+=(a-this.z)*t,this.w+=(o-this.w)*t,this.normalize();let s=Math.acos(n),c=Math.sqrt(1-n*n),l=Math.sin((1-t)*s)/c,u=Math.sin(t*s)/c;return this.x=this.x*l+r*u,this.y=this.y*l+i*u,this.z=this.z*l+a*u,this.w=this.w*l+o*u,this}},n=class{e=new Float64Array(9);constructor(){this.identity()}identity(){let e=this.e;return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=1,e[5]=0,e[6]=0,e[7]=0,e[8]=1,this}copy(e){return this.e.set(e.e),this}setFromQuat(e){let{x:t,y:n,z:r,w:i}=e,a=t+t,o=n+n,s=r+r,c=t*a,l=t*o,u=t*s,d=n*o,f=n*s,p=r*s,m=i*a,h=i*o,g=i*s,_=this.e;return _[0]=1-(d+p),_[1]=l-g,_[2]=u+h,_[3]=l+g,_[4]=1-(c+p),_[5]=f-m,_[6]=u-h,_[7]=f+m,_[8]=1-(c+d),this}mulVec(e,t){let n=this.e,r=n[0]*e.x+n[1]*e.y+n[2]*e.z,i=n[3]*e.x+n[4]*e.y+n[5]*e.z,a=n[6]*e.x+n[7]*e.y+n[8]*e.z;return t.set(r,i,a)}mulTVec(e,t){let n=this.e,r=n[0]*e.x+n[3]*e.y+n[6]*e.z,i=n[1]*e.x+n[4]*e.y+n[7]*e.z,a=n[2]*e.x+n[5]*e.y+n[8]*e.z;return t.set(r,i,a)}col(e,t){let n=this.e;return t.set(n[e],n[3+e],n[6+e])}setFromForwardUp(t,n){let r=t.clone().normalize(),i=new e().crossVectors(n,r).normalize(),a=new e().crossVectors(r,i),o=this.e;return o[0]=r.x,o[1]=i.x,o[2]=a.x,o[3]=r.y,o[4]=i.y,o[5]=a.y,o[6]=r.z,o[7]=i.z,o[8]=a.z,this}},r=(e,t,n)=>e<t?t:e>n?n:e,i=e=>e>0?1:e<0?-1:0,a=class{xs;ys;constructor(e){this.xs=e.map(e=>e[0]),this.ys=e.map(e=>e[1])}get(e){let t=this.xs,n=this.ys,r=t.length;if(r===0)return 1;if(e<=t[0])return n[0];if(e>=t[r-1])return n[r-1];for(let i=1;i<r;i++)if(e<t[i]){let r=(e-t[i-1])/(t[i]-t[i-1]);return n[i-1]+(n[i]-n[i-1])*r}return n[r-1]}},o=1/120,s=-650,c=4096,l=5120,u=2044,d=8064,f=642.775,p=5124.25,m=91.25,h=93.15,g=6e3,_=.03,v=.6,y=2300,b=5.5,x={hitboxSize:[120.507,86.6994,38.6591],hitboxOffset:[13.8757,0,20.755],frontWheel:{x:51.25,y:25.9,radius:12.5},backWheel:{x:-33.75,y:29.5,radius:15}},S=36.25,C=54.4375,w=2.5,T=13.5,E=.2,D=new a([[0,1600],[1400,160],[1410,0]]),O=3500;O*.15;var k=200/3,A=2975/3,j=3175/3,ee=100/3,M=100/3,N=new a([[0,.53356],[500,.3193],[1e3,.18203],[1500,.1057],[1750,.08507],[3e3,.03454]]),P=new a([[0,.39235],[2500,.1261]]),F=new a([[0,1],[1,.2]]);new a([[0,.1]]);var te=new a([[0,.5],[1,.9]]),ne=new a([[0,.1],[.7075,.5],[1,1]]),re=4375/3,ie=875/3,I=1135/(4375/3),ae=.35,oe=1.9,se=2.5,ce=16/15,le=.5,ue=2*Math.PI/65536*1e3,de=.4,fe=Math.SQRT1_2,pe=.09,me=.1,he=.35,ge=.65,_e=4600,ve=new a([[0,.65],[500,.65],[2300,.55],[4600,.3]]),ye=.25,be=new a([[0,5/6],[1400,1100],[2200,1530]]),L=new a([[0,5/6],[1400,1390],[2200,1945]]),xe=new a([[0,1/3],[1400,278],[2200,417]]),Se=[{x:0,y:-4240,big:!1},{x:-1792,y:-4184,big:!1},{x:1792,y:-4184,big:!1},{x:-3072,y:-4096,big:!0},{x:3072,y:-4096,big:!0},{x:-940,y:-3308,big:!1},{x:940,y:-3308,big:!1},{x:0,y:-2816,big:!1},{x:-3584,y:-2484,big:!1},{x:3584,y:-2484,big:!1},{x:-1788,y:-2300,big:!1},{x:1788,y:-2300,big:!1},{x:-2048,y:-1036,big:!1},{x:0,y:-1024,big:!1},{x:2048,y:-1036,big:!1},{x:-3584,y:0,big:!0},{x:-1024,y:0,big:!1},{x:1024,y:0,big:!1},{x:3584,y:0,big:!0},{x:-2048,y:1036,big:!1},{x:0,y:1024,big:!1},{x:2048,y:1036,big:!1},{x:-1788,y:2300,big:!1},{x:1788,y:2300,big:!1},{x:-3584,y:2484,big:!1},{x:3584,y:2484,big:!1},{x:0,y:2816,big:!1},{x:-940,y:3310,big:!1},{x:940,y:3308,big:!1},{x:-3072,y:4096,big:!0},{x:3072,y:4096,big:!0},{x:-1792,y:4184,big:!1},{x:1792,y:4184,big:!1},{x:0,y:4240,big:!1}],Ce=[{x:-2048,y:-2560,yaw:Math.PI*.25},{x:2048,y:-2560,yaw:Math.PI*.75},{x:-256,y:-3840,yaw:Math.PI*.5},{x:256,y:-3840,yaw:Math.PI*.5},{x:0,y:-4608,yaw:Math.PI*.5}],R=[{x:-2304,y:-4608,yaw:Math.PI*.5},{x:-2688,y:-4608,yaw:Math.PI*.5},{x:2304,y:-4608,yaw:Math.PI*.5},{x:2688,y:-4608,yaw:Math.PI*.5}],we={sideDamping:.0875,rearSideGrip:.925,coastFactor:.15,handbrakeLat:.1,handbrakeLatHi:.1,handbrakeFront:1,powerslideRise:6.5,handbrakeBrake:.3,powerslideSteer:1,hardStopShare:1,carWorldRestitution:0,carWorldFriction:.106,carWorldRestThreshold:20,carWorldMargin:3,carWorldErp:.6,carWorldSlop:.5,collideFirst:0,jumpGrip:1,autoRollWorld:1},z=Math.SQRT2,B=c-420,Te=l-420,Ee=d-420*z,De=Ee-Te,Oe=Te,ke=B,Ae=Ee-B;function je(e,t,n,r,i,a){let o=i-n,s=a-r,c=((e-n)*o+(t-r)*s)/(o*o+s*s);c=c<0?0:c>1?1:c;let l=n+o*c-e,u=r+s*c-t;return Math.sqrt(l*l+u*u)}function Me(e,t){let n=Math.max(e-B,t-Te,(e+t-Ee)/z);if(n<=0)return n;let r=je(e,t,0,Te,De,Oe),i=je(e,t,De,Oe,ke,Ae),a=je(e,t,ke,Ae,B,0);return Math.min(r,i,a)}function Ne(e){let t=Math.min(1,Math.max(0,(Math.abs(e)-893)/450));return 256*Math.max(.02,t*t*(3-2*t))}function Pe(e,t,n){let r=n<1022?Ne(e):256,i=Me(e,t)-420+r,a=Math.max(r-n,n-(u-r)),o=i>0?i:0,s=a>0?a:0;return r-(Math.sqrt(o*o+s*s)+Math.min(Math.max(i,a),0))}var Fe=5362,Ie=.041,Le=.32,Re=5650,ze=542,Be=6004,Ve=243,He=110,Ue=Math.hypot(Ie,1),We=Math.hypot(Le,1),Ge=5761,Ke=Ie*399+Ve*Ue,qe=ze-Le*111-Ve*We;function Je(e){let t=Math.abs(e);return t>Fe?Ie*(t-Fe):0}var Ye=Ge+Ve*Math.sin(Math.atan(Ie));function Xe(e,t,n){return $e(Math.abs(e),Math.abs(t),n)}function Ze(e,t,n){if(n>0&&e<n&&t<n){let r=n-e,i=n-t;return n-Math.sqrt(r*r+i*i)}return e<t?e:t}function Qe(e,t){let n=Math.min(t,(t-Ie*(e-Fe))/Ue),r=Math.min(f-t,(ze-Le*(e-Re)-t)/We),i=Math.min(n,r,Be-e),a=e-Ge;if(a>0){let e=t-Ke,n=-e*Ue;n>0&&a-n*Ie/Ue>0&&(i=Math.min(i,Ve-Math.hypot(a,e))),e=t-qe;let r=e*We;r>0&&a-r*Le/We>0&&(i=Math.min(i,Ve-Math.hypot(a,e)))}return i}function $e(e,t,n){if(t<5120){if(e>=893||n>=642.775||n<=0)return-Math.max(e-893,n-f,-n);let r=l-t,i=893-e,a=f-n,o=Math.sqrt(i*i+r*r),s=Math.sqrt(a*a+r*r);return Math.min(o,s,n)}let r=Math.min(1,(t-l)/60),i=Math.min(1,Math.max(0,n/f));return Ze(893-e,Qe(t,n),(He+25*i)*r)}function et(e,t,n){let r=Math.abs(e),i=Math.abs(t),a=Pe(r,i,n);if(i<4408&&a>0)return a;let o=$e(r,i,n);return a>o?a:o}var tt=.5;function nt(e,t){let n=et(e.x+tt,e.y,e.z)-et(e.x-tt,e.y,e.z),r=et(e.x,e.y+tt,e.z)-et(e.x,e.y-tt,e.z),i=et(e.x,e.y,e.z+tt)-et(e.x,e.y,e.z-tt);t.set(n,r,i);let a=t.length();return a<1e-9?t.set(0,0,1):t.scale(1/a)}var rt=new e;function it(e,t,n,r){let i=0;for(let a=0;a<48;a++){rt.set(e.x+t.x*i,e.y+t.y*i,e.z+t.z*i);let a=et(rt.x,rt.y,rt.z);if(a<.05)return r&&(r.t=i,r.point.copy(rt),nt(rt,r.normal)),i;if(i+=a,i>n)return-1}return-1}var at=()=>({throttle:0,steer:0,pitch:0,yaw:0,roll:0,jump:!1,boost:!1,handbrake:!1}),ot=x.hitboxSize[0]/2,st=x.hitboxSize[1]/2,ct=x.hitboxSize[2]/2,lt=new e(ot,st,ct),ut=new e(x.hitboxOffset[0],x.hitboxOffset[1],x.hitboxOffset[2]),dt=new e(15*(4*st*st+4*ct*ct),15*(4*ot*ot+4*ct*ct),15*(4*ot*ot+4*st*st)),ft=[];{let t=[-1,-.5,0,.5,1],n=[-1,0,1],r=[-1,0,1];for(let i of t)for(let t of n)for(let n of r)(Math.abs(i)===1||Math.abs(t)===1||Math.abs(n)===1)&&ft.push(new e(i*ot,t*st,n*ct))}var pt=500/180,mt=25/180,ht=40/180,gt=-s*1.5/(pt*(2*(S+C))),_t=new e,vt=new e,yt=new e,bt=new e,xt=new e,St=new e,Ct={t:0,point:new e,normal:new e},wt=new e,Tt=new e,Et=class{id;team;name=`Player`;pos=new e(0,0,17);vel=new e;angVel=new e;rot=new t;mat=new n;mass=180;forward=new e(1,0,0);left=new e(0,1,0);up=new e(0,0,1);boost=M;dodgeDeadzone=le;controls=at();lastControls=at();wheels=[];numWheelsInContact=0;isOnGround=!0;hasJumped=!1;isJumping=!1;jumpTime=0;hasDoubleJumped=!1;hasFlipped=!1;isFlipping=!1;flipTime=0;flipRoll=0;flipPitch=0;airTime=0;airTimeSinceJump=0;handbrakeVal=0;isBoosting=!1;boostingTime=0;isSupersonic=!1;supersonicTime=0;isAutoFlipping=!1;autoFlipTimer=0;autoFlipTorqueScale=0;worldContact={has:!1,normal:new e(0,0,1)};isDemoed=!1;demoRespawnTimer=0;frozen=!1;velImpulseCache=new e;bumpCooldowns=new Map;lastExtraBallHitTick=-10;lastBallTouchTick=-10;events={jumped:!1,doubleJumped:!1,flipped:!1,landed:!1,ballHit:0};constructor(t,n){this.id=t,this.team=n;let r=x.frontWheel,i=x.backWheel,a=(t,n,r,i)=>{let a=22-i;return{front:t,local:new e(n,r,5),radius:i,restLength:a+gt,forceScale:t?S:C,inContact:!1,onBall:!1,contactPoint:new e,contactNormal:new e(0,0,1),suspensionLength:a,traceLength:a+i,steerAngle:0,spin:0,visualLength:a,latFriction:1,longFriction:1}};this.wheels=[a(!0,r.x,r.y,r.radius),a(!0,r.x,-r.y,r.radius),a(!1,i.x,i.y,i.radius),a(!1,i.x,-i.y,i.radius)],this.updateAxes()}updateAxes(){this.mat.setFromQuat(this.rot),this.mat.col(0,this.forward),this.mat.col(1,this.left),this.mat.col(2,this.up)}spawn(e,t,n,r=M){this.pos.set(e,t,17),this.vel.set(0,0,0),this.angVel.set(0,0,0),this.rot.setFromEuler(n,0,0),this.boost=r,this.hasJumped=this.isJumping=this.hasDoubleJumped=this.hasFlipped=this.isFlipping=!1,this.jumpTime=this.flipTime=this.airTime=this.airTimeSinceJump=0,this.handbrakeVal=0,this.isBoosting=!1,this.boostingTime=0,this.isSupersonic=!1,this.supersonicTime=0,this.isAutoFlipping=!1,this.isDemoed=!1,this.isOnGround=!0,this.numWheelsInContact=4,this.velImpulseCache.set(0,0,0),this.worldContact.has=!1,this.lastControls=at(),this.updateAxes();for(let e of this.wheels)e.suspensionLength=e.restLength-gt,e.visualLength=e.suspensionLength}get forwardSpeed(){return this.vel.dot(this.forward)}invInertiaMul(e,t){return this.mat.mulTVec(e,t),t.set(t.x/dt.x,t.y/dt.y,t.z/dt.z),this.mat.mulVec(t,t)}pointVelocity(e,t){return yt.subVectors(e,this.pos),t.crossVectors(this.angVel,yt),t.add(this.vel)}applyImpulse(e,t){this.vel.addScaled(e,1/this.mass),yt.subVectors(t,this.pos),bt.crossVectors(yt,e),this.invInertiaMul(bt,bt),this.angVel.add(bt)}effectiveMassInv(e,t){return bt.crossVectors(e,t),this.invInertiaMul(bt,bt),vt.crossVectors(bt,e),1/this.mass+t.dot(vt)}hitboxCenter(e){return this.mat.mulVec(ut,e),e.add(this.pos)}preStep(e,t,n){let a=this.events;if(a.jumped=a.doubleJumped=a.flipped=a.landed=!1,a.ballHit=0,this.isDemoed){this.demoRespawnTimer-=e;return}let o=this.controls;if(this.frozen){this.lastControls={...o};return}this.updateAxes();let c=this.forward,l=this.up;this.velImpulseCache.isZero()||(this.vel.add(this.velImpulseCache),this.velImpulseCache.set(0,0,0));for(let[t,n]of this.bumpCooldowns)n-e<=0?this.bumpCooldowns.delete(t):this.bumpCooldowns.set(t,n-e);let u=o.jump&&!this.lastControls.jump,d=this.isOnGround,f=0;Tt.copy(l).scale(-1);for(let e of this.wheels){this.mat.mulVec(e.local,wt).add(this.pos);let n=e.restLength+e.radius+T,i=-1;e.onBall=!1;let a=it(wt,Tt,n,Ct);if(a>=0&&(i=a,e.contactPoint.copy(Ct.point),e.contactNormal.copy(Ct.normal)),t){let r=Dt(wt,Tt,t.pos,t.radius);r>=0&&r<=n&&(i<0||r<i)&&(i=r,e.onBall=!0,e.contactPoint.copy(wt).addScaled(Tt,r),e.contactNormal.subVectors(e.contactPoint,t.pos).normalize())}i>=0?(e.inContact=!0,e.traceLength=i,e.suspensionLength=r(i-e.radius,e.restLength-6,e.restLength+6),f++):(e.inContact=!1,e.suspensionLength=e.restLength)}this.numWheelsInContact=f,this.isOnGround=f>=3,this.isOnGround&&!d&&this.airTime>.1&&(a.landed=!0);let p=this.vel.dot(c),m=Math.abs(p);o.handbrake?this.handbrakeVal+=we.powerslideRise*e:this.handbrakeVal-=2*e,this.handbrakeVal=r(this.handbrakeVal,0,1);let h=this.wantsBoost(o),g=o.throttle;h&&(g=1);let _=g,v=0;Math.abs(g)>=.001?m>25&&i(g)!==i(p)&&(v=o.handbrake?we.handbrakeBrake:1,m>.01&&(_=0)):(_=0,v=o.handbrake?0:m<25?1:we.coastFactor);let y=1;f<3&&(y/=4);let b=_*D.get(m)*y,x=v*O,S=N.get(m);this.handbrakeVal>0&&(S+=(P.get(m)*we.powerslideSteer-S)*this.handbrakeVal),S*=o.steer,this.wheels[0].steerAngle=this.wheels[1].steerAngle=S;let C=this.isJumping||this.isOnGround&&u;if(this.updateWheels(e,t,b,x,o,C),f>=3&&!C){let t=.5;(o.throttle!==0||h||m>25)&&(t+=1-Math.abs(l.z)),this.vel.addScaled(l,t*s*e)}if(this.isOnGround&&!this.isJumping&&(this.hasJumped&&this.jumpTime<.05||(this.hasJumped=!1,this.jumpTime=0)),this.isJumping?this.isJumping=this.jumpTime<.025||o.jump&&this.jumpTime<.2:this.isOnGround&&u&&(this.isJumping=!0,this.jumpTime=0,this.vel.addScaled(l,ie),a.jumped=!0),this.isJumping){this.hasJumped=!0;let t=re;this.jumpTime<.05416666666666667&&(t*=I),this.vel.addScaled(l,t*e),this.jumpTime+=e}if(this.updateDoubleJumpOrFlip(e,u,p),this.updateAutoFlip(e,u),(f>0&&f<4||f===0&&this.worldContact.has)&&this.updateAutoRoll(e),this.isOnGround||(this.updateAirControl(e),this.vel.addScaled(c,o.throttle*k*e)),h){this.isBoosting=!0,this.boostingTime+=e,this.boost=Math.max(0,this.boost-ee*e);let t=this.isOnGround?A:j;this.vel.addScaled(c,t*e)}else this.isBoosting=!1,this.boostingTime=0;this.vel.z+=s*e,this.lastControls={...o}}wantsBoost(e){return this.boost<=0?!1:e.boost||this.isBoosting&&this.boostingTime<.1}updateWheels(e,t,n,i,a,o=!1){let s=this.up,c=this.forward,l=this.left,u=this.mass,d=a.throttle!==0||this.isBoosting,f=[];for(let a of this.wheels){if(!a.inContact){a.visualLength+=(a.restLength-a.visualLength)*.3;continue}a.visualLength=a.suspensionLength;let p=a.contactNormal,m=a.contactPoint;this.pointVelocity(m,_t),a.onBall&&t&&(yt.subVectors(m,t.pos),bt.crossVectors(t.angVel,yt).add(t.vel),_t.sub(bt));let h=0,g=10,_=-p.dot(s);if(_<-.1){let e=-1/_;h=p.dot(_t)*e,g=e}let v=a.restLength-a.suspensionLength,y=pt*a.forceScale*v*g;y-=(h<0?mt:ht)*a.forceScale*h,(y<0||o)&&(y=0);let b=p.clone().scale(y*u*e);f.push({J:b,p:m.clone(),ball:a.onBall});let x=a.restLength+a.radius-w;if(!a.onBall&&a.traceLength<x){let t=a.traceLength-x,n=p.dot(_t);yt.subVectors(m,this.pos);let r=1/this.effectiveMassInv(yt,p),i=(E*-t/e-n)*r;i>0&&(i/=Math.max(1,this.numWheelsInContact)**+we.hardStopShare,f.push({J:p.clone().scale(i),p:m.clone(),ball:!1}))}if(a.onBall||!(o&&we.jumpGrip)&&a.traceLength>a.restLength+a.radius+6-2.5)continue;let S=a.steerAngle;xt.set(-l.x*Math.cos(S)-c.x*Math.sin(S),-l.y*Math.cos(S)-c.y*Math.sin(S),-l.z*Math.cos(S)-c.z*Math.sin(S)),xt.addScaled(p,-xt.dot(p)).normalize(),St.crossVectors(p,xt).normalize();let C=_t.dot(xt),T=_t.dot(St),D=Math.abs(C),O=0;D>5&&(O=D/(Math.abs(T)+D));let k=F.get(O),A=1;if(this.handbrakeVal>0){let e=we.handbrakeLat+(we.handbrakeLatHi-we.handbrakeLat)*O;k*=(e-1)*this.handbrakeVal*(a.front?we.handbrakeFront:1)+1,A*=(te.get(O)-1)*this.handbrakeVal+1}if(!d){let e=ne.get(p.z);k*=e,A*=e}a.latFriction=k,a.longFriction=A,yt.subVectors(m,this.pos),yt.addScaled(s,-s.dot(yt));let j=this.pos.clone().add(yt),ee=this.effectiveMassInv(yt,xt),M=a.front?1:we.rearSideGrip,N=-we.sideDamping*M*C/ee*k,P=0;if(n!==0)P=u*n*e/4;else if(i>0){let t=this.effectiveMassInv(yt,St),n=u*i*e/4;P=r(-T/t/4,-n,n)}P*=A;let re=xt.clone().scale(N).addScaled(St,P);f.push({J:re,p:j,ball:!1}),a.spin+=T/a.radius*e}for(let e of f)this.applyImpulse(e.J,e.p),e.ball&&t&&t.vel.addScaled(e.J,-1/t.mass);for(let t of this.wheels)t.inContact||(t.spin+=(this.controls.throttle*30+(this.isBoosting?30:0))*e)}updateDoubleJumpOrFlip(e,t,n){let r=this.controls,i=this.events;if(this.isOnGround){this.hasDoubleJumped=!1,this.hasFlipped=!1,this.isFlipping=!1,this.airTime=0,this.airTimeSinceJump=0,this.flipTime=0;return}if(this.airTime+=e,this.hasJumped&&!this.isJumping?this.airTimeSinceJump+=e:this.airTimeSinceJump=0,t&&this.airTimeSinceJump<1.25){let e=(r.dodgeMag??Math.abs(r.yaw)+Math.abs(r.pitch)+Math.abs(r.roll))>=this.dodgeDeadzone;if(!this.hasDoubleJumped&&!this.hasFlipped){if(e){this.flipTime=0,this.hasFlipped=!0,this.isFlipping=!0,i.flipped=!0;let e=Math.abs(n)/y,t=-r.pitch,a=r.yaw+r.roll;if(Math.abs(a)<.1&&Math.abs(t)<.1)t=0,a=0;else{let e=Math.hypot(t,a);t/=e,a/=e}if(this.flipRoll=a,this.flipPitch=t,Math.abs(t)<.1&&(t=0),Math.abs(a)<.1&&(a=0),t!==0||a!==0){let r;r=Math.abs(n)<100?t<0:t>=0!=n>=0;let i=t*500,o=a*500;i*=((r?se:1)-1)*e+1,o*=(oe-1)*e+1,r&&(i*=ce);let s=this.forward.x,c=this.forward.y,l=Math.hypot(s,c)||1,u=s/l,d=c/l,f=d,p=-u;this.vel.x+=u*i+f*o,this.vel.y+=d*i+p*o}}else this.vel.addScaled(this.up,ie),this.hasDoubleJumped=!0,i.doubleJumped=!0}}this.isFlipping?(this.flipTime+=e,this.flipTime<=.65?this.flipTime>=.15&&(this.vel.z<0||this.flipTime<.21)&&(this.vel.z*=(1-ae)**(e/(1/120))):this.isFlipping=!1):this.hasFlipped&&(this.flipTime+=e)}updateAirControl(e){let t=this.controls,n=this.forward,r=this.left,a=this.up,o=!0,s=1;if(this.isFlipping&&this.flipTime<.65){o=!1;let a=this.flipRoll,s=this.flipPitch;if(a!==0||s!==0){let c=1;s!==0&&t.pitch!==0&&i(s)===i(t.pitch)&&(c=1-Math.min(Math.abs(t.pitch),1),o=!0),s*=c,this.angVel.addScaled(n,a*260*e),this.angVel.addScaled(r,s*224*e)}else o=!0}if(this.hasFlipped&&this.flipTime<.95&&(s=0),!o)return;let c=t.pitch*s,l=t.yaw,u=t.roll,d=this.angVel,f=d.dot(n),p=-d.dot(r),m=-d.dot(a),h=u*400-f*50,g=c*130-p*30*(1-Math.abs(c)),_=l*95-m*20*(1-Math.abs(l)),v=ue*e;d.addScaled(n,h*v),d.addScaled(r,-g*v),d.addScaled(a,-_*v)}updateAutoFlip(e,t){if(t&&this.worldContact.has&&this.worldContact.normal.z>fe){let e=Math.atan2(this.left.z,this.up.z),t=Math.abs(e);t>2.8&&(this.autoFlipTimer=t/Math.PI*de,this.autoFlipTorqueScale=e>0?1:-1,this.isAutoFlipping=!0,this.vel.addScaled(this.up,-200))}this.isAutoFlipping&&(this.autoFlipTimer<=0?this.isAutoFlipping=!1:(this.angVel.addScaled(this.forward,50*this.autoFlipTorqueScale*e),this.autoFlipTimer-=e))}updateAutoRoll(t){let n=_t.set(0,0,0),i=0;for(let e of this.wheels)e.inContact&&!e.onBall&&(n.add(e.contactNormal),i++);if(i===0){let e=we.autoRollWorld;if(!this.worldContact.has||e===0||e===2&&this.up.dot(this.worldContact.normal)<=0)return;n.copy(this.worldContact.normal)}n.normalize();let a=this.forward,o=vt.copy(this.left).scale(-1),s=new e().crossVectors(n,a),c=new e().crossVectors(s,n).normalize(),l=s.scale(-1).normalize(),u=1-r(o.dot(l),0,1),d=1-r(a.dot(c),0,1),f=o.dot(n)>=0?1:-1,p=a.dot(n)>=0?1:-1;this.angVel.addScaled(a,f*u*80*t),this.angVel.addScaled(this.left,p*d*80*t),this.vel.addScaled(n,-100*t)}integratePosition(e){this.isDemoed||this.frozen||(this.pos.addScaled(this.vel,e),this.rot.integrate(this.angVel,e),this.updateAxes())}collideWorld(){if(this.worldContact.has=!1,this.isDemoed||this.frozen)return;let t=we,n=this.hitboxCenter(new e),r=[],i=new e;for(let a of ft){this.mat.mulVec(a,i).add(n);let o=et(i.x,i.y,i.z)-t.carWorldMargin;o<0&&r.push({p:i.clone(),n:nt(i,new e),depth:-o})}if(r.length===0)return;r.sort((e,t)=>t.depth-e.depth);let a=[r[0]];for(;a.length<4&&a.length<r.length;){let e=-1,t=4;for(let n=0;n<r.length;n++){let i=1/0;for(let e of a)i=Math.min(i,_t.subVectors(e.p,r[n].p).lengthSq());i>t&&(t=i,e=n)}if(e<0)break;a.push(r[e])}this.worldContact.has=!0,this.worldContact.normal.copy(a[0].n);let o=a.map(n=>{let r=n.p.clone().sub(this.pos);this.pointVelocity(n.p,_t);let i=_t.dot(n.n),a=new e().crossVectors(Math.abs(n.n.z)<.9?new e(0,0,1):new e(1,0,0),n.n).normalize(),o=new e().crossVectors(n.n,a);return{c:n,r,t1:a,t2:o,kn:1/this.effectiveMassInv(r,n.n),k1:1/this.effectiveMassInv(r,a),k2:1/this.effectiveMassInv(r,o),target:i<-t.carWorldRestThreshold?-t.carWorldRestitution*i:0,jn:0,j1:0,j2:0}}),s=new e;for(let e=0;e<10;e++)for(let e of o){this.pointVelocity(e.c.p,_t);let n=_t.dot(e.c.n),r=Math.max(0,e.jn+(e.target-n)*e.kn),i=r-e.jn;e.jn=r,i!==0&&this.applyImpulse(s.copy(e.c.n).scale(i),e.c.p);let a=t.carWorldFriction*e.jn;this.pointVelocity(e.c.p,_t);let o=Math.min(a,Math.max(-a,e.j1-_t.dot(e.t1)*e.k1)),c=o-e.j1;e.j1=o,c!==0&&this.applyImpulse(s.copy(e.t1).scale(c),e.c.p),this.pointVelocity(e.c.p,_t);let l=Math.min(a,Math.max(-a,e.j2-_t.dot(e.t2)*e.k2)),u=l-e.j2;e.j2=l,u!==0&&this.applyImpulse(s.copy(e.t2).scale(u),e.c.p)}this.pos.addScaled(a[0].n,Math.max(0,a[0].depth-t.carWorldSlop)*t.carWorldErp)}postStep(e){if(this.isDemoed)return;this.vel.clampLength(y),this.angVel.clampLength(b);let t=this.vel.length();t>=2200?(this.isSupersonic=!0,this.supersonicTime=0):this.isSupersonic&&t>=2100&&this.supersonicTime<1?this.supersonicTime+=e:(this.isSupersonic=!1,this.supersonicTime=0)}demolish(){this.isDemoed=!0,this.demoRespawnTimer=3,this.vel.set(0,0,0),this.angVel.set(0,0,0)}};function Dt(e,t,n,r){let i=e.x-n.x,a=e.y-n.y,o=e.z-n.z,s=i*t.x+a*t.y+o*t.z,c=i*i+a*a+o*o-r*r,l=s*s-c;if(l<0)return-1;let u=-s-Math.sqrt(l);return u<0?c<0?0:-1:u}var Ot={CROSS:0,CIRCLE:1,SQUARE:2,TRIANGLE:3,L1:4,R1:5,L2:6,R2:7,SHARE:8,OPTIONS:9,L3:10,R3:11,UP:12,DOWN:13,LEFT:14,RIGHT:15,PS:16,TOUCHPAD:17},kt={0:`Cross`,1:`Circle`,2:`Square`,3:`Triangle`,4:`L1`,5:`R1`,6:`L2`,7:`R2`,8:`Share`,9:`Options`,10:`L3`,11:`R3`,12:`D-Pad Up`,13:`D-Pad Down`,14:`D-Pad Left`,15:`D-Pad Right`,16:`PS`,17:`Touchpad`},At={throttle:Ot.R2,reverse:Ot.L2,jump:Ot.CROSS,boost:Ot.CIRCLE,powerslide:Ot.SQUARE,airRoll:Ot.L2,airRollLeft:Ot.L1,airRollRight:Ot.R1,ballCam:Ot.TRIANGLE,rearView:Ot.R3,scoreboard:Ot.L3,pause:Ot.OPTIONS,reset:Ot.SHARE},jt={deadzone:.2,dodgeDeadzone:.6,steeringSensitivity:1.6,aerialSensitivity:2.34,vibration:!0,padBindings:{...At}},Mt={throttle:[`KeyW`,`ArrowUp`],reverse:[`KeyS`,`ArrowDown`],left:[`KeyA`,`ArrowLeft`],right:[`KeyD`,`ArrowRight`],jump:[`Space`],boost:[`ShiftRight`,`KeyK`],powerslide:[`ShiftLeft`],airRollLeft:[`KeyQ`],airRollRight:[`KeyE`],ballCam:[`KeyC`],rearView:[`KeyV`],scoreboard:[`Tab`],pause:[`Escape`],reset:[`KeyR`]},Nt=class{settings;keys=new Set;mouseButtons=new Set;prevPadButtons=[];suppressedPad=new Set;suppressedKeys=new Set;suppressedMouse=new Set;suppressHeld(){let e=this.getGamepad();e&&e.buttons.forEach((e,t)=>{(e.pressed||e.value>.5)&&this.suppressedPad.add(t)});for(let e of this.keys)this.suppressedKeys.add(e);for(let e of this.mouseButtons)this.suppressedMouse.add(e)}prevKeys=new Set;prevMouse=new Set;navRepeat={dir:``,time:0};lastDevice=`keyboard`;padName=``;captureMouse=!0;constructor(e){this.settings=e,window.addEventListener(`keydown`,e=>{(e.code===`Tab`||e.code===`Space`||e.code.startsWith(`Arrow`))&&(e.target instanceof HTMLInputElement||e.preventDefault()),this.keys.add(e.code),this.lastDevice=`keyboard`}),window.addEventListener(`keyup`,e=>this.keys.delete(e.code)),window.addEventListener(`blur`,()=>{this.keys.clear(),this.mouseButtons.clear()}),window.addEventListener(`mousedown`,e=>{this.captureMouse&&(e.target?.closest?.(`.ui-layer`)||(this.mouseButtons.add(e.button),this.lastDevice=`keyboard`))}),window.addEventListener(`mouseup`,e=>this.mouseButtons.delete(e.button)),window.addEventListener(`contextmenu`,e=>e.preventDefault())}getGamepad(){let e=navigator.getGamepads?navigator.getGamepads():[],t=null;for(let n of e)n&&n.connected&&(t||=n,n.mapping===`standard`&&t.mapping!==`standard`&&(t=n));return t&&(this.padName=t.id),t}key(e){for(let t of e)if(this.keys.has(t)&&!this.suppressedKeys.has(t))return!0;return!1}keyEdge(e){for(let t of e)if(this.keys.has(t)&&!this.prevKeys.has(t)&&!this.suppressedKeys.has(t))return!0;return!1}poll(e){let t=this.settings;for(let e of this.suppressedKeys)this.keys.has(e)||this.suppressedKeys.delete(e);for(let e of this.suppressedMouse)this.mouseButtons.has(e)||this.suppressedMouse.delete(e);let n=t.padBindings,r=at(),i={controls:r,lookX:0,lookY:0,rearView:!1,scoreboard:!1,ballCamToggle:!1,ballCamHeld:!1,pausePressed:!1,resetPressed:!1,jumpPressed:!1,freeplay:{reset:!1,ballFront:!1,ballTop:!1},nav:{up:!1,down:!1,left:!1,right:!1,confirm:!1,back:!1},usingGamepad:!1},a=this.getGamepad(),o=0,s=0;if(a){let e=e=>!!a.buttons[e]&&(a.buttons[e].pressed||a.buttons[e].value>.5);for(let t of this.suppressedPad)e(t)||this.suppressedPad.delete(t);let c=t=>e(t)&&!this.suppressedPad.has(t),l=e=>a.buttons[e]&&!this.suppressedPad.has(e)?a.buttons[e].value:0,u=e=>c(e)&&!this.prevPadButtons[e],[d,f]=Ft(a.axes[0]??0,a.axes[1]??0,t.deadzone),[p,m]=Ft(a.axes[2]??0,a.axes[3]??0,.15);o=d,s=f,(Math.abs(d)+Math.abs(f)+Math.abs(p)+Math.abs(m)>.2||a.buttons.some(e=>e.pressed))&&(this.lastDevice=`gamepad`),r.throttle=l(n.throttle)-l(n.reverse),r.steer=Pt(d*t.steeringSensitivity),r.pitch=Pt(f*t.aerialSensitivity),r.yaw=Pt(d*t.aerialSensitivity),r.jump=c(n.jump),r.boost=c(n.boost),r.handbrake=c(n.powerslide);let h=c(n.airRollLeft),g=c(n.airRollRight);h||g?r.roll=!!g-+!!h:c(n.airRoll)&&(r.roll=Pt(d*t.aerialSensitivity),r.yaw=0),r.dodgeMag=Math.abs(d)+Math.abs(f)+(h||g?1:0),i.lookX=p,i.lookY=m,i.rearView=c(n.rearView),i.scoreboard=c(n.scoreboard),i.ballCamToggle=u(n.ballCam),i.ballCamHeld=c(n.ballCam),i.pausePressed=u(n.pause),i.resetPressed=u(n.reset),i.jumpPressed=u(n.jump),i.freeplay.reset=u(Ot.LEFT),i.freeplay.ballFront=u(Ot.DOWN),i.freeplay.ballTop=u(Ot.UP),i.nav.confirm=u(Ot.CROSS),i.nav.back=u(Ot.CIRCLE),i.nav.up=u(Ot.UP),i.nav.down=u(Ot.DOWN),i.nav.left=u(Ot.LEFT),i.nav.right=u(Ot.RIGHT),this.prevPadButtons=a.buttons.map(e=>e.pressed||e.value>.5)}let c=+!!this.key(Mt.throttle)-!!this.key(Mt.reverse),l=+!!this.key(Mt.right)-!!this.key(Mt.left),u=this.mouseButtons.has(0)&&!this.suppressedMouse.has(0),d=this.mouseButtons.has(2)&&!this.suppressedMouse.has(2);if(this.lastDevice===`keyboard`||c||l){(c||l)&&(r.dodgeMag=Math.abs(c)+Math.abs(l)),c&&(r.throttle=c,r.pitch=-c),l&&(r.steer=l,r.yaw=l),this.key(Mt.powerslide)&&(r.handbrake=!0,l&&(r.roll=l,r.yaw=0));let e=this.key(Mt.airRollLeft),t=this.key(Mt.airRollRight);(e||t)&&(r.roll=!!t-+!!e)}r.jump||=this.key(Mt.jump)||d,r.boost||=this.key(Mt.boost)||u,i.rearView||=this.key(Mt.rearView)||this.mouseButtons.has(1),i.scoreboard||=this.key(Mt.scoreboard),i.ballCamToggle||=this.keyEdge(Mt.ballCam),i.ballCamHeld||=this.key(Mt.ballCam),i.pausePressed||=this.keyEdge(Mt.pause),i.resetPressed||=this.keyEdge(Mt.reset),i.freeplay.reset||=this.keyEdge([`Backspace`]),i.freeplay.ballFront||=this.keyEdge([`Digit1`]),i.freeplay.ballTop||=this.keyEdge([`Digit2`]),i.jumpPressed||=this.keyEdge(Mt.jump)||d&&!this.prevMouse.has(2),i.nav.confirm||=this.keyEdge([`Enter`,`Space`]),i.nav.back||=this.keyEdge([`Escape`,`Backspace`]),i.nav.up||=this.keyEdge([`ArrowUp`,`KeyW`]),i.nav.down||=this.keyEdge([`ArrowDown`,`KeyS`]),i.nav.left||=this.keyEdge([`ArrowLeft`,`KeyA`]),i.nav.right||=this.keyEdge([`ArrowRight`,`KeyD`]);let f=Math.abs(s)>.6?s<0?`up`:`down`:Math.abs(o)>.6?o<0?`left`:`right`:``;return f?f===this.navRepeat.dir?(this.navRepeat.time-=e,this.navRepeat.time<=0&&(this.navRepeat.time=.12,i.nav[f]=!0)):(this.navRepeat={dir:f,time:.4},i.nav[f]=!0):this.navRepeat.dir=``,this.prevKeys=new Set(this.keys),this.prevMouse=new Set(this.mouseButtons),i.usingGamepad=this.lastDevice===`gamepad`,i}rumble(e,t,n){if(!this.settings.vibration)return;let r=this.getGamepad()?.vibrationActuator;r?.playEffect&&r.playEffect(`dual-rumble`,{duration:n,strongMagnitude:Math.min(1,e),weakMagnitude:Math.min(1,t)}).catch(()=>{})}pollAnyPadButton(){let e=this.getGamepad();if(!e)return null;for(let t=0;t<e.buttons.length;t++)if((e.buttons[t].pressed||e.buttons[t].value>.5)&&!this.prevPadButtons[t])return t;return null}};function Pt(e){return e<-1?-1:e>1?1:e}function Ft(e,t,n){let r=Math.hypot(e,t);if(r<=n)return[0,0];let i=Math.min(1,(r-n)/(1-n))/r;return[Pt(e*i),Pt(t*i)]}var It=`attached`,Lt=1e3,Rt=1001,zt=1002,Bt=1003,Vt=1004,Ht=1005,Ut=1006,Wt=1007,Gt=1008,Kt=1009,qt=1010,Jt=1011,Yt=1012,Xt=1013,Zt=1014,Qt=1015,$t=1016,en=1017,tn=1018,nn=1020,rn=35902,an=35899,on=1021,sn=1022,cn=1023,ln=1026,un=1027,dn=1028,fn=1029,pn=1030,mn=1031,hn=1033,gn=33776,_n=33777,vn=33778,yn=33779,bn=35840,xn=35841,Sn=35842,Cn=35843,wn=36196,Tn=37492,En=37496,Dn=37488,On=37489,kn=37490,An=37491,jn=37808,Mn=37809,Nn=37810,Pn=37811,Fn=37812,In=37813,Ln=37814,Rn=37815,zn=37816,Bn=37817,Vn=37818,Hn=37819,Un=37820,Wn=37821,Gn=36492,Kn=36494,qn=36495,Jn=36283,Yn=36284,Xn=36285,Zn=36286,Qn=2300,$n=2301,er=2302,tr=2303,nr=2400,rr=2401,ir=2402,ar=2500,or=3200,sr=`srgb`,cr=`srgb-linear`,lr=`linear`,ur=`srgb`,dr=7680,fr=35044,pr=35048,mr=2e3;function hr(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function gr(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function _r(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function vr(){let e=_r(`canvas`);return e.style.display=`block`,e}var yr={};function br(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function xr(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function V(...e){e=xr(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function H(...e){e=xr(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function Sr(...e){let t=e.join(` `);t in yr||(yr[t]=!0,V(...e))}function Cr(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var wr={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},Tr=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},Er=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),Dr=1234567,Or=Math.PI/180,kr=180/Math.PI;function Ar(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Er[e&255]+Er[e>>8&255]+Er[e>>16&255]+Er[e>>24&255]+`-`+Er[t&255]+Er[t>>8&255]+`-`+Er[t>>16&15|64]+Er[t>>24&255]+`-`+Er[n&63|128]+Er[n>>8&255]+`-`+Er[n>>16&255]+Er[n>>24&255]+Er[r&255]+Er[r>>8&255]+Er[r>>16&255]+Er[r>>24&255]).toLowerCase()}function U(e,t,n){return Math.max(t,Math.min(n,e))}function jr(e,t){return(e%t+t)%t}function Mr(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function Nr(e,t,n){return e===t?0:(n-e)/(t-e)}function Pr(e,t,n){return(1-n)*e+n*t}function Fr(e,t,n,r){return Pr(e,t,1-Math.exp(-n*r))}function Ir(e,t=1){return t-Math.abs(jr(e,t*2)-t)}function Lr(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function Rr(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function zr(e,t){return e+Math.floor(Math.random()*(t-e+1))}function Br(e,t){return e+Math.random()*(t-e)}function Vr(e){return e*(.5-Math.random())}function Hr(e){e!==void 0&&(Dr=e);let t=Dr+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Ur(e){return e*Or}function Wr(e){return e*kr}function Gr(e){return e>0&&Number.isInteger(e)&&2**Math.round(Math.log2(e))===e}function Kr(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function qr(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function Jr(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:V(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function Yr(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function Xr(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var Zr={DEG2RAD:Or,RAD2DEG:kr,generateUUID:Ar,clamp:U,euclideanModulo:jr,mapLinear:Mr,inverseLerp:Nr,lerp:Pr,damp:Fr,pingpong:Ir,smoothstep:Lr,smootherstep:Rr,randInt:zr,randFloat:Br,randFloatSpread:Vr,seededRandom:Hr,degToRad:Ur,radToDeg:Wr,isPowerOfTwo:Gr,ceilPowerOfTwo:Kr,floorPowerOfTwo:qr,setQuaternionFromProperEuler:Jr,normalize:Xr,denormalize:Yr},W=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=U(this.x,e.x,t.x),this.y=U(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=U(this.x,e,t),this.y=U(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(U(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(U(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Qr=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:V(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(U(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},G=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ei.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ei.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=U(this.x,e.x,t.x),this.y=U(this.y,e.y,t.y),this.z=U(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=U(this.x,e,t),this.y=U(this.y,e,t),this.z=U(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(U(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return $r.copy(this).projectOnVector(e),this.sub($r)}reflect(e){return this.sub($r.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(U(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},$r=new G,ei=new Qr,K=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return Sr(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(ti.makeScale(e,t)),this}rotate(e){return Sr(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(ti.makeRotation(-e)),this}translate(e,t){return Sr(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(ti.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},ti=new K,ni=new K().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ri=new K().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function ii(){let e={enabled:!0,workingColorSpace:cr,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n?e:(this.spaces[t].transfer===`srgb`&&(e.r=oi(e.r),e.g=oi(e.g),e.b=oi(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=si(e.r),e.g=si(e.g),e.b=si(e.b)),e)},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?lr:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return Sr(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return Sr(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[cr]:{primaries:t,whitePoint:r,transfer:lr,toXYZ:ni,fromXYZ:ri,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:sr},outputColorSpaceConfig:{drawingBufferColorSpace:sr}},[sr]:{primaries:t,whitePoint:r,transfer:ur,toXYZ:ni,fromXYZ:ri,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:sr}}}),e}var ai=ii();function oi(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function si(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var ci,li=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{ci===void 0&&(ci=_r(`canvas`)),ci.width=e.width,ci.height=e.height;let t=ci.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=ci}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=_r(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=oi(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(oi(t[e]/255)*255):t[e]=oi(t[e]);return{data:t,width:e.width,height:e.height}}return V(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},ui=0,di=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:ui++}),this.uuid=Ar(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(fi(r[t].image)):e.push(fi(r[t]))}else e=fi(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function fi(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?li.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(V(`Texture: Unable to serialize Texture.`),{})}var pi=0,mi=new G,hi=class e extends Tr{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=Rt,i=Rt,a=Ut,o=Gt,s=cn,c=Kt,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:pi++}),this.uuid=Ar(),this.name=``,this.source=new di(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new W(0,0),this.repeat=new W(1,1),this.center=new W(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new K,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(mi).x}get height(){return this.source.getSize(mi).y}get depth(){return this.source.getSize(mi).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){V(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){V(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Lt:e.x-=Math.floor(e.x);break;case Rt:e.x=e.x<0?0:1;break;case zt:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case Lt:e.y-=Math.floor(e.y);break;case Rt:e.y=e.y<0?0:1;break;case zt:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};hi.DEFAULT_IMAGE=null,hi.DEFAULT_MAPPING=300,hi.DEFAULT_ANISOTROPY=1;var gi=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=U(this.x,e.x,t.x),this.y=U(this.y,e.y,t.y),this.z=U(this.z,e.z,t.z),this.w=U(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=U(this.x,e,t),this.y=U(this.y,e,t),this.z=U(this.z,e,t),this.w=U(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(U(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},_i=class extends Tr{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ut,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new gi(0,0,e,t),this.scissorTest=!1,this.viewport=new gi(0,0,e,t),this.textures=[];let r=new hi({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Ut,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new di(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},vi=class extends _i{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},yi=class extends hi{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Bt,this.minFilter=Bt,this.wrapR=Rt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},bi=class extends hi{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Bt,this.minFilter=Bt,this.wrapR=Rt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},q=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/xi.setFromMatrixColumn(e,0).length(),i=1/xi.setFromMatrixColumn(e,1).length(),a=1/xi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ci,e,wi)}lookAt(e,t,n){let r=this.elements;return Di.subVectors(e,t),Di.lengthSq()===0&&(Di.z=1),Di.normalize(),Ti.crossVectors(n,Di),Ti.lengthSq()===0&&(Math.abs(n.z)===1?Di.x+=1e-4:Di.z+=1e-4,Di.normalize(),Ti.crossVectors(n,Di)),Ti.normalize(),Ei.crossVectors(Di,Ti),r[0]=Ti.x,r[4]=Ei.x,r[8]=Di.x,r[1]=Ti.y,r[5]=Ei.y,r[9]=Di.y,r[2]=Ti.z,r[6]=Ei.z,r[10]=Di.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],ee=r[14],M=r[3],N=r[7],P=r[11],F=r[15];return i[0]=a*x+o*T+s*k+c*M,i[4]=a*S+o*E+s*A+c*N,i[8]=a*C+o*D+s*j+c*P,i[12]=a*w+o*O+s*ee+c*F,i[1]=l*x+u*T+d*k+f*M,i[5]=l*S+u*E+d*A+f*N,i[9]=l*C+u*D+d*j+f*P,i[13]=l*w+u*O+d*ee+f*F,i[2]=p*x+m*T+h*k+g*M,i[6]=p*S+m*E+h*A+g*N,i[10]=p*C+m*D+h*j+g*P,i[14]=p*w+m*O+h*ee+g*F,i[3]=_*x+v*T+y*k+b*M,i[7]=_*S+v*E+y*A+b*N,i[11]=_*C+v*D+y*j+b*P,i[15]=_*w+v*O+y*ee+b*F,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=xi.set(r[0],r[1],r[2]).length(),o=xi.set(r[4],r[5],r[6]).length(),s=xi.set(r[8],r[9],r[10]).length();i<0&&(a=-a),Si.copy(this);let c=1/a,l=1/o,u=1/s;return Si.elements[0]*=c,Si.elements[1]*=c,Si.elements[2]*=c,Si.elements[4]*=l,Si.elements[5]*=l,Si.elements[6]*=l,Si.elements[8]*=u,Si.elements[9]*=u,Si.elements[10]*=u,t.setFromRotationMatrix(Si),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=mr,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=mr,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},xi=new G,Si=new q,Ci=new G(0,0,0),wi=new G(1,1,1),Ti=new G,Ei=new G,Di=new G,Oi=new q,ki=new Qr,Ai=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(U(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-U(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(U(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-U(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(U(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-U(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:V(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Oi.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Oi,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ki.setFromEuler(this),this.setFromQuaternion(ki,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Ai.DEFAULT_ORDER=`XYZ`;var ji=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&(1<<e|0))}},Mi=0,Ni=new G,Pi=new Qr,Fi=new q,Ii=new G,Li=new G,Ri=new G,zi=new Qr,Bi=new G(1,0,0),Vi=new G(0,1,0),Hi=new G(0,0,1),Ui={type:`added`},Wi={type:`removed`},Gi={type:`childadded`,child:null},Ki={type:`childremoved`,child:null},qi=class e extends Tr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Mi++}),this.uuid=Ar(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new G,n=new Ai,r=new Qr,i=new G(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new q},normalMatrix:{value:new K}}),this.matrix=new q,this.matrixWorld=new q,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ji,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Pi.setFromAxisAngle(e,t),this.quaternion.multiply(Pi),this}rotateOnWorldAxis(e,t){return Pi.setFromAxisAngle(e,t),this.quaternion.premultiply(Pi),this}rotateX(e){return this.rotateOnAxis(Bi,e)}rotateY(e){return this.rotateOnAxis(Vi,e)}rotateZ(e){return this.rotateOnAxis(Hi,e)}translateOnAxis(e,t){return Ni.copy(e).applyQuaternion(this.quaternion),this.position.add(Ni.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Bi,e)}translateY(e){return this.translateOnAxis(Vi,e)}translateZ(e){return this.translateOnAxis(Hi,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Fi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ii.copy(e):Ii.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),Li.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Fi.lookAt(Li,Ii,this.up):Fi.lookAt(Ii,Li,this.up),this.quaternion.setFromRotationMatrix(Fi),r&&(Fi.extractRotation(r.matrixWorld),Pi.setFromRotationMatrix(Fi),this.quaternion.premultiply(Pi.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(H(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ui),Gi.child=e,this.dispatchEvent(Gi),Gi.child=null):H(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Wi),Ki.child=e,this.dispatchEvent(Ki),Ki.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Fi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Fi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Fi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ui),Gi.child=e,this.dispatchEvent(Gi),Gi.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Li,e,Ri),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Li,zi,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};qi.DEFAULT_UP=new G(0,1,0),qi.DEFAULT_MATRIX_AUTO_UPDATE=!0,qi.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ji=class extends qi{constructor(){super(),this.isGroup=!0,this.type=`Group`}},Yi={type:`move`},Xi=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ji,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ji,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ji,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Yi)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Ji;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Zi={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Qi={h:0,s:0,l:0},$i={h:0,s:0,l:0};function ea(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var J=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=sr){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ai.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=ai.workingColorSpace){return this.r=e,this.g=t,this.b=n,ai.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=ai.workingColorSpace){if(e=jr(e,1),t=U(t,0,1),n=U(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=ea(i,r,e+1/3),this.g=ea(i,r,e),this.b=ea(i,r,e-1/3)}return ai.colorSpaceToWorking(this,r),this}setStyle(e,t=sr){function n(t){t!==void 0&&parseFloat(t)<1&&V(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:V(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);V(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=sr){let n=Zi[e.toLowerCase()];return n===void 0?V(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=oi(e.r),this.g=oi(e.g),this.b=oi(e.b),this}copyLinearToSRGB(e){return this.r=si(e.r),this.g=si(e.g),this.b=si(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=sr){return ai.workingToColorSpace(ta.copy(this),e),Math.round(U(ta.r*255,0,255))*65536+Math.round(U(ta.g*255,0,255))*256+Math.round(U(ta.b*255,0,255))}getHexString(e=sr){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ai.workingColorSpace){ai.workingToColorSpace(ta.copy(this),t);let n=ta.r,r=ta.g,i=ta.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=ai.workingColorSpace){return ai.workingToColorSpace(ta.copy(this),t),e.r=ta.r,e.g=ta.g,e.b=ta.b,e}getStyle(e=sr){ai.workingToColorSpace(ta.copy(this),e);let t=ta.r,n=ta.g,r=ta.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(Qi),this.setHSL(Qi.h+e,Qi.s+t,Qi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Qi),e.getHSL($i);let n=Pr(Qi.h,$i.h,t),r=Pr(Qi.s,$i.s,t),i=Pr(Qi.l,$i.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},ta=new J;J.NAMES=Zi;var na=class e{constructor(e,t=1,n=1e3){this.isFog=!0,this.name=``,this.color=new J(e),this.near=t,this.far=n}clone(){return new e(this.color,this.near,this.far)}toJSON(){return{type:`Fog`,name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},ra=class extends qi{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ai,this.environmentIntensity=1,this.environmentRotation=new Ai,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},ia=new G,aa=new G,oa=new G,sa=new G,ca=new G,la=new G,ua=new G,da=new G,fa=new G,pa=new G,ma=new gi,ha=new gi,ga=new gi,_a=class e{constructor(e=new G,t=new G,n=new G){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),ia.subVectors(e,t),r.cross(ia);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){ia.subVectors(r,t),aa.subVectors(n,t),oa.subVectors(e,t);let a=ia.dot(ia),o=ia.dot(aa),s=ia.dot(oa),c=aa.dot(aa),l=aa.dot(oa),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,sa)!==null&&sa.x>=0&&sa.y>=0&&sa.x+sa.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,sa)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,sa.x),s.addScaledVector(a,sa.y),s.addScaledVector(o,sa.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return ma.setScalar(0),ha.setScalar(0),ga.setScalar(0),ma.fromBufferAttribute(e,t),ha.fromBufferAttribute(e,n),ga.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(ma,i.x),a.addScaledVector(ha,i.y),a.addScaledVector(ga,i.z),a}static isFrontFacing(e,t,n,r){return ia.subVectors(n,t),aa.subVectors(e,t),ia.cross(aa).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ia.subVectors(this.c,this.b),aa.subVectors(this.a,this.b),ia.cross(aa).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;ca.subVectors(r,n),la.subVectors(i,n),da.subVectors(e,n);let s=ca.dot(da),c=la.dot(da);if(s<=0&&c<=0)return t.copy(n);fa.subVectors(e,r);let l=ca.dot(fa),u=la.dot(fa);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(ca,a);pa.subVectors(e,i);let f=ca.dot(pa),p=la.dot(pa);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(la,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return ua.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(ua,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(ca,a).addScaledVector(la,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},va=class{constructor(e=new G(1/0,1/0,1/0),t=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ba.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ba.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=ba.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,ba):ba.fromBufferAttribute(r,t),ba.applyMatrix4(e.matrixWorld),this.expandByPoint(ba);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),xa.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),xa.copy(e.boundingBox)),xa.applyMatrix4(e.matrixWorld),this.union(xa)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ba),ba.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Oa),ka.subVectors(this.max,Oa),Sa.subVectors(e.a,Oa),Ca.subVectors(e.b,Oa),wa.subVectors(e.c,Oa),Ta.subVectors(Ca,Sa),Ea.subVectors(wa,Ca),Da.subVectors(Sa,wa);let t=[0,-Ta.z,Ta.y,0,-Ea.z,Ea.y,0,-Da.z,Da.y,Ta.z,0,-Ta.x,Ea.z,0,-Ea.x,Da.z,0,-Da.x,-Ta.y,Ta.x,0,-Ea.y,Ea.x,0,-Da.y,Da.x,0];return!Ma(t,Sa,Ca,wa,ka)||(t=[1,0,0,0,1,0,0,0,1],!Ma(t,Sa,Ca,wa,ka))?!1:(Aa.crossVectors(Ta,Ea),t=[Aa.x,Aa.y,Aa.z],Ma(t,Sa,Ca,wa,ka))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ba).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ba).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ya[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ya[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ya[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ya[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ya[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ya[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ya[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ya[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ya),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},ya=[new G,new G,new G,new G,new G,new G,new G,new G],ba=new G,xa=new va,Sa=new G,Ca=new G,wa=new G,Ta=new G,Ea=new G,Da=new G,Oa=new G,ka=new G,Aa=new G,ja=new G;function Ma(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){ja.fromArray(e,a);let o=i.x*Math.abs(ja.x)+i.y*Math.abs(ja.y)+i.z*Math.abs(ja.z),s=t.dot(ja),c=n.dot(ja),l=r.dot(ja);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var Na=Pa();function Pa(){let e=new ArrayBuffer(4),t=new Float32Array(e),n=new Uint32Array(e),r=new Uint32Array(512),i=new Uint32Array(512);for(let e=0;e<256;++e){let t=e-127;t<-27?(r[e]=0,r[e|256]=32768,i[e]=24,i[e|256]=24):t<-14?(r[e]=1024>>-t-14,r[e|256]=1024>>-t-14|32768,i[e]=-t-1,i[e|256]=-t-1):t<=15?(r[e]=t+15<<10,r[e|256]=t+15<<10|32768,i[e]=13,i[e|256]=13):t<128?(r[e]=31744,r[e|256]=64512,i[e]=24,i[e|256]=24):(r[e]=31744,r[e|256]=64512,i[e]=13,i[e|256]=13)}let a=new Uint32Array(2048),o=new Uint32Array(64),s=new Uint32Array(64);for(let e=1;e<1024;++e){let t=e<<13,n=0;for(;!(t&8388608);)t<<=1,n-=8388608;t&=-8388609,n+=947912704,a[e]=t|n}for(let e=1024;e<2048;++e)a[e]=939524096+(e-1024<<13);for(let e=1;e<31;++e)o[e]=e<<23;o[31]=1199570944,o[32]=2147483648;for(let e=33;e<63;++e)o[e]=2147483648+(e-32<<23);o[63]=3347054592;for(let e=1;e<64;++e)e!==32&&(s[e]=1024);return{floatView:t,uint32View:n,baseTable:r,shiftTable:i,mantissaTable:a,exponentTable:o,offsetTable:s}}function Fa(e){Math.abs(e)>65504&&V(`DataUtils.toHalfFloat(): Value out of range.`),e=U(e,-65504,65504),Na.floatView[0]=e;let t=Na.uint32View[0],n=t>>23&511;return Na.baseTable[n]+((t&8388607)>>Na.shiftTable[n])}function Ia(e){let t=e>>10;return Na.uint32View[0]=Na.mantissaTable[Na.offsetTable[t]+(e&1023)]+Na.exponentTable[t],Na.floatView[0]}var La=class{static toHalfFloat(e){return Fa(e)}static fromHalfFloat(e){return Ia(e)}},Ra=new G,za=new W,Ba=0,Va=class extends Tr{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Ba++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=fr,this.updateRanges=[],this.gpuType=Qt,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)za.fromBufferAttribute(this,t),za.applyMatrix3(e),this.setXY(t,za.x,za.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ra.fromBufferAttribute(this,t),Ra.applyMatrix3(e),this.setXYZ(t,Ra.x,Ra.y,Ra.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ra.fromBufferAttribute(this,t),Ra.applyMatrix4(e),this.setXYZ(t,Ra.x,Ra.y,Ra.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ra.fromBufferAttribute(this,t),Ra.applyNormalMatrix(e),this.setXYZ(t,Ra.x,Ra.y,Ra.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ra.fromBufferAttribute(this,t),Ra.transformDirection(e),this.setXYZ(t,Ra.x,Ra.y,Ra.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Yr(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Xr(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Yr(t,this.array)),t}setX(e,t){return this.normalized&&(t=Xr(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Yr(t,this.array)),t}setY(e,t){return this.normalized&&(t=Xr(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Yr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Xr(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Yr(t,this.array)),t}setW(e,t){return this.normalized&&(t=Xr(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Xr(t,this.array),n=Xr(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Xr(t,this.array),n=Xr(n,this.array),r=Xr(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=Xr(t,this.array),n=Xr(n,this.array),r=Xr(r,this.array),i=Xr(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}},Ha=class extends Va{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Ua=class extends Va{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Y=class extends Va{constructor(e,t,n){super(new Float32Array(e),t,n)}},Wa=new va,Ga=new G,Ka=new G,qa=class{constructor(e=new G,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?Wa.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ga.subVectors(e,this.center);let t=Ga.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(Ga,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ka.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ga.copy(e.center).add(Ka)),this.expandByPoint(Ga.copy(e.center).sub(Ka))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Ja=0,Ya=new q,Xa=new qi,Za=new G,Qa=new va,$a=new va,eo=new G,to=class e extends Tr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ja++}),this.uuid=Ar(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(hr(e)?Ua:Ha)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new K().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Ya.makeRotationFromQuaternion(e),this.applyMatrix4(Ya),this}rotateX(e){return Ya.makeRotationX(e),this.applyMatrix4(Ya),this}rotateY(e){return Ya.makeRotationY(e),this.applyMatrix4(Ya),this}rotateZ(e){return Ya.makeRotationZ(e),this.applyMatrix4(Ya),this}translate(e,t,n){return Ya.makeTranslation(e,t,n),this.applyMatrix4(Ya),this}scale(e,t,n){return Ya.makeScale(e,t,n),this.applyMatrix4(Ya),this}lookAt(e){return Xa.lookAt(e),Xa.updateMatrix(),this.applyMatrix4(Xa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Za).negate(),this.translate(Za.x,Za.y,Za.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new Y(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&V(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new va);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){H(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Qa.setFromBufferAttribute(n),this.morphTargetsRelative?(eo.addVectors(this.boundingBox.min,Qa.min),this.boundingBox.expandByPoint(eo),eo.addVectors(this.boundingBox.max,Qa.max),this.boundingBox.expandByPoint(eo)):(this.boundingBox.expandByPoint(Qa.min),this.boundingBox.expandByPoint(Qa.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&H(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new qa);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){H(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new G,1/0);return}if(e){let n=this.boundingSphere.center;if(Qa.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];$a.setFromBufferAttribute(n),this.morphTargetsRelative?(eo.addVectors(Qa.min,$a.min),Qa.expandByPoint(eo),eo.addVectors(Qa.max,$a.max),Qa.expandByPoint(eo)):(Qa.expandByPoint($a.min),Qa.expandByPoint($a.max))}Qa.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)eo.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(eo));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)eo.fromBufferAttribute(a,t),o&&(Za.fromBufferAttribute(e,t),eo.add(Za)),r=Math.max(r,n.distanceToSquared(eo))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&H(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){H(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new Va(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new G,s[e]=new G;let c=new G,l=new G,u=new G,d=new W,f=new W,p=new W,m=new G,h=new G;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new G,y=new G,b=new G,x=new G;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new Va(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new G,i=new G,a=new G,o=new G,s=new G,c=new G,l=new G,u=new G;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)eo.fromBufferAttribute(e,t),eo.normalize(),e.setXYZ(t,eo.x,eo.y,eo.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new Va(a,r,i)}if(this.index===null)return V(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},no=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e===void 0?0:e.length/t,this.usage=fr,this.updateRanges=[],this.version=0,this.uuid=Ar()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,i=this.stride;r<i;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ar()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ar()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},ro=new G,io=class e{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name=``,this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)ro.fromBufferAttribute(this,t),ro.applyMatrix4(e),this.setXYZ(t,ro.x,ro.y,ro.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)ro.fromBufferAttribute(this,t),ro.applyNormalMatrix(e),this.setXYZ(t,ro.x,ro.y,ro.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)ro.fromBufferAttribute(this,t),ro.transformDirection(e),this.setXYZ(t,ro.x,ro.y,ro.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Yr(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Xr(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=Xr(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Xr(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Xr(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Xr(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Yr(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Yr(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Yr(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Yr(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Xr(t,this.array),n=Xr(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Xr(t,this.array),n=Xr(n,this.array),r=Xr(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Xr(t,this.array),n=Xr(n,this.array),r=Xr(r,this.array),i=Xr(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=i,this}clone(t){if(t===void 0){br(`InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return new Va(new this.array.constructor(e),this.itemSize,this.normalized)}return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new e(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){br(`InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},ao=new G,oo=new G,so=new K,co=class{constructor(e=new G(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=ao.subVectors(n,t).cross(oo.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(ao),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||so.getNormalMatrix(e),r=this.coplanarPoint(ao).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},lo=0,uo=class extends Tr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:lo++}),this.uuid=Ar(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new J(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=dr,this.stencilZFail=dr,this.stencilZPass=dr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){V(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){V(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new J().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new co().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new W().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new W().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},fo=new G,po=new G,mo=new G,ho=new G,go=class{constructor(e=new G,t=new G(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,fo)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=fo.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(fo.copy(this.origin).addScaledVector(this.direction,t),fo.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){po.copy(e).add(t).multiplyScalar(.5),mo.copy(t).sub(e).normalize(),ho.copy(this.origin).sub(po);let i=e.distanceTo(t)*.5,a=-this.direction.dot(mo),o=ho.dot(this.direction),s=-ho.dot(mo),c=ho.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(po).addScaledVector(mo,d),f}intersectSphere(e,t){if(e.radius<0)return null;fo.subVectors(e.center,this.origin);let n=fo.dot(this.direction),r=fo.dot(fo)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,fo)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,k,A,j,ee,M;if(y>=b&&y>=x?(w=s,D=u,A=p,M=g,s>=0?(S=c,C=l,T=d,E=f,O=m,k=h,j=_,ee=v):(S=l,C=c,T=f,E=d,O=h,k=m,j=v,ee=_)):b>=x?(w=c,D=d,A=m,M=_,c>=0?(S=l,C=s,T=f,E=u,O=h,k=p,j=v,ee=g):(S=s,C=l,T=u,E=f,O=p,k=h,j=g,ee=v)):(w=l,D=f,A=h,M=v,l>=0?(S=s,C=c,T=u,E=d,O=p,k=m,j=g,ee=_):(S=c,C=s,T=d,E=u,O=m,k=p,j=_,ee=g)),w===0)return null;let N=S/w,P=C/w,F=1/w,te=T-N*D,ne=E-P*D,re=O-N*A,ie=k-P*A,I=j-N*M,ae=ee-P*M,oe=I*ie-ae*re,se=te*ae-ne*I,ce=re*ne-ie*te;if(r){if(oe<0||se<0||ce<0)return null}else if((oe<0||se<0||ce<0)&&(oe>0||se>0||ce>0))return null;let le=oe+se+ce;if(le===0)return null;let ue=F*(oe*D+se*A+ce*M);return(le>0?ue<0:ue>0)?null:this.at(ue/le,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},_o=class extends uo{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new J(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ai,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},vo=new q,yo=new go,bo=new qa,xo=new G,So=new G,Co=new G,wo=new G,To=new G,Eo=new G,Do=new G,Oo=new G,X=class extends qi{constructor(e=new to,t=new _o){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){Eo.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(To.fromBufferAttribute(s,e),a?Eo.addScaledVector(To,r):Eo.addScaledVector(To.sub(t),r))}t.add(Eo)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),bo.copy(n.boundingSphere),bo.applyMatrix4(i),yo.copy(e.ray).recast(e.near),!(bo.containsPoint(yo.origin)===!1&&(yo.intersectSphere(bo,xo)===null||yo.origin.distanceToSquared(xo)>(e.far-e.near)**2))&&(vo.copy(i).invert(),yo.copy(e.ray).applyMatrix4(vo),(n.boundingBox===null||yo.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,yo)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=Ao(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=Ao(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=Ao(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=Ao(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function ko(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;Oo.copy(s),Oo.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(Oo);return l<n.near||l>n.far?null:{distance:l,point:Oo.clone(),object:e}}function Ao(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,So),e.getVertexPosition(c,Co),e.getVertexPosition(l,wo);let u=ko(e,t,n,r,So,Co,wo,Do);if(u){let e=new G;_a.getBarycoord(Do,So,Co,wo,e),i&&(u.uv=_a.getInterpolatedAttribute(i,s,c,l,e,new W)),a&&(u.uv1=_a.getInterpolatedAttribute(a,s,c,l,e,new W)),o&&(u.normal=_a.getInterpolatedAttribute(o,s,c,l,e,new G),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new G,materialIndex:0};_a.getNormal(So,Co,wo,t.normal),u.face=t,u.barycoord=e}return u}var jo=new gi,Mo=new gi,No=new gi,Po=new gi,Fo=new q,Io=new G,Lo=new qa,Ro=new q,zo=new go,Bo=class extends X{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type=`SkinnedMesh`,this.bindMode=It,this.bindMatrix=new q,this.bindMatrixInverse=new q,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new va),this.boundingBox.makeEmpty();let t=e.getAttribute(`position`);for(let e=0;e<t.count;e++)this.getVertexPosition(e,Io),this.boundingBox.expandByPoint(Io)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new qa),this.boundingSphere.makeEmpty();let t=e.getAttribute(`position`);for(let e=0;e<t.count;e++)this.getVertexPosition(e,Io),this.boundingSphere.expandByPoint(Io)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,r=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Lo.copy(this.boundingSphere),Lo.applyMatrix4(r),e.ray.intersectsSphere(Lo)!==!1&&(Ro.copy(r).invert(),zo.copy(e.ray).applyMatrix4(Ro),(this.boundingBox===null||zo.intersectsBox(this.boundingBox)!==!1)&&this._computeIntersections(e,t,zo)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new gi,t=this.geometry.attributes.skinWeight;for(let n=0,r=t.count;n<r;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r===1/0?e.set(1,0,0,0):e.multiplyScalar(r),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===`attached`?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===`detached`?this.bindMatrixInverse.copy(this.bindMatrix).invert():V(`SkinnedMesh: Unrecognized bindMode: `+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,r=this.geometry;Mo.fromBufferAttribute(r.attributes.skinIndex,e),No.fromBufferAttribute(r.attributes.skinWeight,e),t.isVector4?(jo.copy(t),t.set(0,0,0,0)):(jo.set(...t,1),t.set(0,0,0)),jo.applyMatrix4(this.bindMatrix);for(let e=0;e<4;e++){let r=No.getComponent(e);if(r!==0){let i=Mo.getComponent(e);Fo.multiplyMatrices(n.bones[i].matrixWorld,n.boneInverses[i]),t.addScaledVector(Po.copy(jo).applyMatrix4(Fo),r)}}return t.isVector4&&(t.w=jo.w),t.applyMatrix4(this.bindMatrixInverse)}},Vo=class extends qi{constructor(){super(),this.isBone=!0,this.type=`Bone`}},Ho=class extends hi{constructor(e=null,t=1,n=1,r,i,a,o,s,c=Bt,l=Bt,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Uo=new q,Wo=new q,Go=class e{constructor(e=[],t=[]){this.uuid=Ar(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){V(`Skeleton: Number of inverse bone matrices does not match amount of bones.`),this.boneInverses=[];for(let e=0,t=this.bones.length;e<t;e++)this.boneInverses.push(new q)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let t=new q;this.bones[e]&&t.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(t)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let t=this.bones[e];t&&t.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let t=this.bones[e];t&&(t.parent&&t.parent.isBone?(t.matrix.copy(t.parent.matrixWorld).invert(),t.matrix.multiply(t.matrixWorld)):t.matrix.copy(t.matrixWorld),t.matrix.decompose(t.position,t.quaternion,t.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,r=this.boneTexture;for(let r=0,i=e.length;r<i;r++){let i=e[r]?e[r].matrixWorld:Wo;Uo.multiplyMatrices(i,t[r]),Uo.toArray(n,r*16)}r!==null&&(r.needsUpdate=!0)}clone(){return new e(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new Ho(t,e,e,cn,Qt);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let n=this.bones[t];if(n.name===e)return n}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,r=e.bones.length;n<r;n++){let r=e.bones[n],i=t[r];i===void 0&&(V(`Skeleton: No bone found with UUID:`,r),i=new Vo),this.bones.push(i),this.boneInverses.push(new q().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:`Skeleton`,generator:`Skeleton.toJSON`},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let r=0,i=t.length;r<i;r++){let i=t[r];e.bones.push(i.uuid);let a=n[r];e.boneInverses.push(a.toArray())}return e}},Ko=class extends Va{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},qo=new q,Jo=new q,Yo=[],Xo=new va,Zo=new q,Qo=new X,$o=new qa,es=class extends X{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ko(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,Zo)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new va),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,qo),Xo.copy(e.boundingBox).applyMatrix4(qo),this.boundingBox.union(Xo)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new qa),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,qo),$o.copy(e.boundingSphere).applyMatrix4(qo),this.boundingSphere.union($o)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(Qo.geometry=this.geometry,Qo.material=this.material,Qo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),$o.copy(this.boundingSphere),$o.applyMatrix4(n),e.ray.intersectsSphere($o)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,qo),Jo.multiplyMatrices(n,qo),Qo.matrixWorld=Jo,Qo.raycast(e,Yo);for(let e=0,n=Yo.length;e<n;e++){let n=Yo[e];n.instanceId=i,n.object=this,t.push(n)}Yo.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Ko(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new Ho(new Float32Array(r*this.count),r,this.count,dn,Qt));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},ts=new qa,ns=new W(.5,.5),rs=new G,is=class{constructor(e=new co,t=new co,n=new co,r=new co,i=new co,a=new co){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=mr,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ts.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ts.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ts)}intersectsSprite(e){return ts.center.set(0,0,0),ts.radius=.7071067811865476+ns.distanceTo(e.center),ts.applyMatrix4(e.matrixWorld),this.intersectsSphere(ts)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(rs.x=r.normal.x>0?e.max.x:e.min.x,rs.y=r.normal.y>0?e.max.y:e.min.y,rs.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(rs)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},as=class extends uo{constructor(e){super(),this.isLineBasicMaterial=!0,this.type=`LineBasicMaterial`,this.color=new J(16777215),this.map=null,this.linewidth=1,this.linecap=`round`,this.linejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},os=new G,ss=new G,cs=new q,ls=new go,us=new qa,ds=new G,fs=new G,ps=class extends qi{constructor(e=new to,t=new as){super(),this.isLine=!0,this.type=`Line`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let e=1,r=t.count;e<r;e++)os.fromBufferAttribute(t,e-1),ss.fromBufferAttribute(t,e),n[e]=n[e-1],n[e]+=os.distanceTo(ss);e.setAttribute(`lineDistance`,new Y(n,1))}else V(`Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),us.copy(n.boundingSphere),us.applyMatrix4(r),us.radius+=i,e.ray.intersectsSphere(us)===!1)return;cs.copy(r).invert(),ls.copy(e.ray).applyMatrix4(cs);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=this.isLineSegments?2:1,l=n.index,u=n.attributes.position;if(l!==null){let n=Math.max(0,a.start),r=Math.min(l.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=l.getX(i),r=l.getX(i+1),a=ms(this,e,ls,s,n,r,i);a&&t.push(a)}if(this.isLineLoop){let i=l.getX(r-1),a=l.getX(n),o=ms(this,e,ls,s,i,a,r-1);o&&t.push(o)}}else{let n=Math.max(0,a.start),r=Math.min(u.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=ms(this,e,ls,s,i,i+1,i);n&&t.push(n)}if(this.isLineLoop){let i=ms(this,e,ls,s,r-1,n,r-1);i&&t.push(i)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function ms(e,t,n,r,i,a,o){let s=e.geometry.attributes.position;if(os.fromBufferAttribute(s,i),ss.fromBufferAttribute(s,a),n.distanceSqToSegment(os,ss,ds,fs)>r)return;ds.applyMatrix4(e.matrixWorld);let c=t.ray.origin.distanceTo(ds);if(!(c<t.near||c>t.far))return{distance:c,point:fs.clone().applyMatrix4(e.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:e}}var hs=new G,gs=new G,_s=class extends ps{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type=`LineSegments`}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let e=0,r=t.count;e<r;e+=2)hs.fromBufferAttribute(t,e),gs.fromBufferAttribute(t,e+1),n[e]=e===0?0:n[e-1],n[e+1]=n[e]+hs.distanceTo(gs);e.setAttribute(`lineDistance`,new Y(n,1))}else V(`LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}},vs=class extends ps{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type=`LineLoop`}},ys=class extends uo{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new J(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},bs=new q,xs=new go,Ss=new qa,Cs=new G,ws=class extends qi{constructor(e=new to,t=new ys){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ss.copy(n.boundingSphere),Ss.applyMatrix4(r),Ss.radius+=i,e.ray.intersectsSphere(Ss)===!1)return;bs.copy(r).invert(),xs.copy(e.ray).applyMatrix4(bs);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);Cs.fromBufferAttribute(l,n),Ts(Cs,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)Cs.fromBufferAttribute(l,a),Ts(Cs,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function Ts(e,t,n,r,i,a,o){let s=xs.distanceSqToPoint(e);if(s<n){let n=new G;xs.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var Es=class extends hi{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Ds=class extends hi{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Os=class extends hi{constructor(e,t,n=Zt,r,i,a,o=Bt,s=Bt,c,l=ln,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new di(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},ks=class extends Os{constructor(e,t=Zt,n=301,r,i,a=Bt,o=Bt,s,c=ln){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},As=class extends hi{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},js=class e extends to{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new Y(c,3)),this.setAttribute(`normal`,new Y(l,3)),this.setAttribute(`uv`,new Y(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new G;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Ms=class e extends to{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new G,l=new W;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new Y(a,3)),this.setAttribute(`normal`,new Y(o,3)),this.setAttribute(`uv`,new Y(s,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Ns=class e extends to{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new Y(u,3)),this.setAttribute(`normal`,new Y(d,3)),this.setAttribute(`uv`,new Y(f,2));function _(){let a=new G,_=new G,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new W,m=new G,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ps=class e extends to{constructor(e=[],t=[],n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new Y(i,3)),this.setAttribute(`normal`,new Y(i.slice(),3)),this.setAttribute(`uv`,new Y(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new G,r=new G,i=new G;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new G;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new G;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new G,t=new G,n=new G,r=new G,o=new W,s=new W,c=new W;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.detail)}},Fs=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){V(`Curve: .getPoint() not implemented.`)}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new W:new G);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new G,r=[],i=[],a=[],o=new G,s=new q;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new G)}i[0]=new G,a[0]=new G;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos(U(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos(U(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Is=class extends Fs{constructor(e=0,t=0,n=1,r=1,i=0,a=Math.PI*2,o=!1,s=0){super(),this.isEllipseCurve=!0,this.type=`EllipseCurve`,this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=i,this.aEndAngle=a,this.aClockwise=o,this.aRotation=s}getPoint(e,t=new W){let n=t,r=Math.PI*2,i=this.aEndAngle-this.aStartAngle,a=Math.abs(i)<2**-52;for(;i<0;)i+=r;for(;i>r;)i-=r;i<2**-52&&(i=a?0:r),this.aClockwise===!0&&!a&&(i===r?i=-r:i-=r);let o=this.aStartAngle+e*i,s=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let e=Math.cos(this.aRotation),t=Math.sin(this.aRotation),n=s-this.aX,r=c-this.aY;s=n*e-r*t+this.aX,c=n*t+r*e+this.aY}return n.set(s,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Ls=class extends Is{constructor(e,t,n,r,i,a){super(e,t,n,n,r,i,a),this.isArcCurve=!0,this.type=`ArcCurve`}};function Rs(){let e=0,t=0,n=0,r=0;function i(i,a,o,s){e=i,t=o,n=-3*i+3*a-2*o-s,r=2*i-2*a+o+s}return{initCatmullRom:function(e,t,n,r,a){i(t,n,a*(n-e),a*(r-t))},initNonuniformCatmullRom:function(e,t,n,r,a,o,s){let c=(t-e)/a-(n-e)/(a+o)+(n-t)/o,l=(n-t)/o-(r-t)/(o+s)+(r-n)/s;c*=o,l*=o,i(t,n,c,l)},calc:function(i){let a=i*i,o=a*i;return e+t*i+n*a+r*o}}}var zs=new G,Bs=new G,Vs=new Rs,Hs=new Rs,Us=new Rs,Ws=class extends Fs{constructor(e=[],t=!1,n=`centripetal`,r=.5){super(),this.isCatmullRomCurve3=!0,this.type=`CatmullRomCurve3`,this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new G){let n=t,r=this.points,i=r.length,a=(i-+!this.closed)*e,o=Math.floor(a),s=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/i)+1)*i:s===0&&o===i-1&&(o=i-2,s=1);let c,l;this.closed||o>0?c=r[(o-1)%i]:(Bs.subVectors(r[0],r[1]).add(r[0]),c=Bs);let u=r[o%i],d=r[(o+1)%i];if(this.closed||o+2<i?l=r[(o+2)%i]:(zs.subVectors(r[i-1],r[i-2]).add(r[i-1]),l=zs),this.curveType===`centripetal`||this.curveType===`chordal`){let e=this.curveType===`chordal`?.5:.25,t=c.distanceToSquared(u)**+e,n=u.distanceToSquared(d)**+e,r=d.distanceToSquared(l)**+e;n<1e-4&&(n=1),t<1e-4&&(t=n),r<1e-4&&(r=n),Vs.initNonuniformCatmullRom(c.x,u.x,d.x,l.x,t,n,r),Hs.initNonuniformCatmullRom(c.y,u.y,d.y,l.y,t,n,r),Us.initNonuniformCatmullRom(c.z,u.z,d.z,l.z,t,n,r)}else this.curveType===`catmullrom`&&(Vs.initCatmullRom(c.x,u.x,d.x,l.x,this.tension),Hs.initCatmullRom(c.y,u.y,d.y,l.y,this.tension),Us.initCatmullRom(c.z,u.z,d.z,l.z,this.tension));return n.set(Vs.calc(s),Hs.calc(s),Us.calc(s)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new G().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Gs(e,t,n,r,i){let a=(r-t)*.5,o=(i-n)*.5,s=e*e,c=e*s;return(2*n-2*r+a+o)*c+(-3*n+3*r-2*a-o)*s+a*e+n}function Ks(e,t){let n=1-e;return n*n*t}function qs(e,t){return 2*(1-e)*e*t}function Js(e,t){return e*e*t}function Ys(e,t,n,r){return Ks(e,t)+qs(e,n)+Js(e,r)}function Xs(e,t){let n=1-e;return n*n*n*t}function Zs(e,t){let n=1-e;return 3*n*n*e*t}function Qs(e,t){return 3*(1-e)*e*e*t}function $s(e,t){return e*e*e*t}function ec(e,t,n,r,i){return Xs(e,t)+Zs(e,n)+Qs(e,r)+$s(e,i)}var tc=class extends Fs{constructor(e=new W,t=new W,n=new W,r=new W){super(),this.isCubicBezierCurve=!0,this.type=`CubicBezierCurve`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new W){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(ec(e,r.x,i.x,a.x,o.x),ec(e,r.y,i.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},nc=class extends Fs{constructor(e=new G,t=new G,n=new G,r=new G){super(),this.isCubicBezierCurve3=!0,this.type=`CubicBezierCurve3`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new G){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(ec(e,r.x,i.x,a.x,o.x),ec(e,r.y,i.y,a.y,o.y),ec(e,r.z,i.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},rc=class extends Fs{constructor(e=new W,t=new W){super(),this.isLineCurve=!0,this.type=`LineCurve`,this.v1=e,this.v2=t}getPoint(e,t=new W){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new W){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ic=class extends Fs{constructor(e=new G,t=new G){super(),this.isLineCurve3=!0,this.type=`LineCurve3`,this.v1=e,this.v2=t}getPoint(e,t=new G){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new G){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ac=class extends Fs{constructor(e=new W,t=new W,n=new W){super(),this.isQuadraticBezierCurve=!0,this.type=`QuadraticBezierCurve`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new W){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(Ys(e,r.x,i.x,a.x),Ys(e,r.y,i.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},oc=class extends Fs{constructor(e=new G,t=new G,n=new G){super(),this.isQuadraticBezierCurve3=!0,this.type=`QuadraticBezierCurve3`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new G){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(Ys(e,r.x,i.x,a.x),Ys(e,r.y,i.y,a.y),Ys(e,r.z,i.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},sc=class extends Fs{constructor(e=[]){super(),this.isSplineCurve=!0,this.type=`SplineCurve`,this.points=e}getPoint(e,t=new W){let n=t,r=this.points,i=(r.length-1)*e,a=Math.floor(i),o=i-a,s=r[a===0?a:a-1],c=r[a],l=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(Gs(o,s.x,c.x,l.x,u.x),Gs(o,s.y,c.y,l.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new W().fromArray(n))}return this}},cc=Object.freeze({__proto__:null,ArcCurve:Ls,CatmullRomCurve3:Ws,CubicBezierCurve:tc,CubicBezierCurve3:nc,EllipseCurve:Is,LineCurve:rc,LineCurve3:ic,QuadraticBezierCurve:ac,QuadraticBezierCurve3:oc,SplineCurve:sc}),lc=class extends Fs{constructor(){super(),this.type=`CurvePath`,this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?`LineCurve`:`LineCurve3`;this.curves.push(new cc[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),r=this.getCurveLengths(),i=0;for(;i<r.length;){if(r[i]>=n){let e=r[i]-n,a=this.curves[i],o=a.getLength(),s=o===0?0:1-e/o;return a.getPointAt(s,t)}i++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,i=this.curves;r<i.length;r++){let a=i[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,s=a.getPoints(o);for(let e=0;e<s.length;e++){let r=s[e];n&&n.equals(r)||(t.push(r),n=r)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(new cc[n.type]().fromJSON(n))}return this}},uc=class extends lc{constructor(e){super(),this.type=`Path`,this.currentPoint=new W,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new rc(this.currentPoint.clone(),new W(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){let i=new ac(this.currentPoint.clone(),new W(e,t),new W(n,r));return this.curves.push(i),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,i,a){let o=new tc(this.currentPoint.clone(),new W(e,t),new W(n,r),new W(i,a));return this.curves.push(o),this.currentPoint.set(i,a),this}splineThru(e){let t=new sc([this.currentPoint.clone()].concat(e));return this.curves.push(t),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,i,a){let o=this.currentPoint.x,s=this.currentPoint.y;return this.absarc(e+o,t+s,n,r,i,a),this}absarc(e,t,n,r,i,a){return this.absellipse(e,t,n,n,r,i,a),this}ellipse(e,t,n,r,i,a,o,s){let c=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(e+c,t+l,n,r,i,a,o,s),this}absellipse(e,t,n,r,i,a,o,s){let c=new Is(e,t,n,r,i,a,o,s);if(this.curves.length>0){let e=c.getPoint(0);e.equals(this.currentPoint)||this.lineTo(e.x,e.y)}this.curves.push(c);let l=c.getPoint(1);return this.currentPoint.copy(l),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},dc=class extends uc{constructor(e){super(e),this.uuid=Ar(),this.type=`Shape`,this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(new uc().fromJSON(n))}return this}};function fc(e,t,n=2){let r=t&&t.length,i=r?t[0]*n:e.length,a=pc(e,0,i,n,!0),o=[];if(!a||a.next===a.prev)return o;let s,c,l;if(r&&(a=bc(e,t,a,n)),e.length>80*n){s=e[0],c=e[1];let t=s,r=c;for(let a=n;a<i;a+=n){let n=e[a],i=e[a+1];n<s&&(s=n),i<c&&(c=i),n>t&&(t=n),i>r&&(r=i)}l=Math.max(t-s,r-c),l=l===0?0:32767/l}return hc(a,o,n,s,c,l,0),o}function pc(e,t,n,r,i){let a;if(i===Wc(e,t,n,r)>0)for(let i=t;i<n;i+=r)a=Vc(i/r|0,e[i],e[i+1],a);else for(let i=n-r;i>=t;i-=r)a=Vc(i/r|0,e[i],e[i+1],a);return a&&Nc(a,a.next)&&(Hc(a),a=a.next),a}function mc(e,t){if(!e)return e;t||=e;let n=e,r;do if(r=!1,!n.steiner&&(Nc(n,n.next)||Mc(n.prev,n,n.next)===0)){if(Hc(n),n=t=n.prev,n===n.next)break;r=!0}else n=n.next;while(r||n!==t);return t}function hc(e,t,n,r,i,a,o){if(!e)return;!o&&a&&Tc(e,r,i,a);let s=e;for(;e.prev!==e.next;){let c=e.prev,l=e.next;if(a?_c(e,r,i,a):gc(e)){t.push(c.i,e.i,l.i),Hc(e),e=l.next,s=l.next;continue}if(e=l,e===s){o?o===1?(e=vc(mc(e),t),hc(e,t,n,r,i,a,2)):o===2&&yc(e,t,n,r,i,a):hc(mc(e),t,n,r,i,a,1);break}}}function gc(e){let t=e.prev,n=e,r=e.next;if(Mc(t,n,r)>=0)return!1;let i=t.x,a=n.x,o=r.x,s=t.y,c=n.y,l=r.y,u=Math.min(i,a,o),d=Math.min(s,c,l),f=Math.max(i,a,o),p=Math.max(s,c,l),m=r.next;for(;m!==t;){if(m.x>=u&&m.x<=f&&m.y>=d&&m.y<=p&&Ac(i,s,a,c,o,l,m.x,m.y)&&Mc(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function _c(e,t,n,r){let i=e.prev,a=e,o=e.next;if(Mc(i,a,o)>=0)return!1;let s=i.x,c=a.x,l=o.x,u=i.y,d=a.y,f=o.y,p=Math.min(s,c,l),m=Math.min(u,d,f),h=Math.max(s,c,l),g=Math.max(u,d,f),_=Dc(p,m,t,n,r),v=Dc(h,g,t,n,r),y=e.prevZ,b=e.nextZ;for(;y&&y.z>=_&&b&&b.z<=v;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&Ac(s,u,c,d,l,f,y.x,y.y)&&Mc(y.prev,y,y.next)>=0||(y=y.prevZ,b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&Ac(s,u,c,d,l,f,b.x,b.y)&&Mc(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;y&&y.z>=_;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&Ac(s,u,c,d,l,f,y.x,y.y)&&Mc(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;b&&b.z<=v;){if(b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&Ac(s,u,c,d,l,f,b.x,b.y)&&Mc(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function vc(e,t){let n=e;do{let r=n.prev,i=n.next.next;!Nc(r,i)&&Pc(r,n,n.next,i)&&Rc(r,i)&&Rc(i,r)&&(t.push(r.i,n.i,i.i),Hc(n),Hc(n.next),n=e=i),n=n.next}while(n!==e);return mc(n)}function yc(e,t,n,r,i,a){let o=e;do{let e=o.next.next;for(;e!==o.prev;){if(o.i!==e.i&&jc(o,e)){let s=Bc(o,e);o=mc(o,o.next),s=mc(s,s.next),hc(o,t,n,r,i,a,0),hc(s,t,n,r,i,a,0);return}e=e.next}o=o.next}while(o!==e)}function bc(e,t,n,r){let i=[];for(let n=0,a=t.length;n<a;n++){let o=pc(e,t[n]*r,n<a-1?t[n+1]*r:e.length,r,!1);o===o.next&&(o.steiner=!0),i.push(Oc(o))}i.sort(xc);for(let e=0;e<i.length;e++)n=Sc(i[e],n);return n}function xc(e,t){let n=e.x-t.x;return n===0&&(n=e.y-t.y,n===0&&(n=(e.next.y-e.y)/(e.next.x-e.x)-(t.next.y-t.y)/(t.next.x-t.x))),n}function Sc(e,t){let n=Cc(e,t);if(!n)return t;let r=Bc(n,e);return mc(r,r.next),mc(n,n.next)}function Cc(e,t){let n=t,r=e.x,i=e.y,a=-1/0,o;if(Nc(e,n))return n;do{if(Nc(e,n.next))return n.next;if(i<=n.y&&i>=n.next.y&&n.next.y!==n.y){let e=n.x+(i-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(e<=r&&e>a&&(a=e,o=n.x<n.next.x?n:n.next,e===r))return o}n=n.next}while(n!==t);if(!o)return null;let s=o,c=o.x,l=o.y,u=1/0;n=o;do{if(r>=n.x&&n.x>=c&&r!==n.x&&kc(i<l?r:a,i,c,l,i<l?a:r,i,n.x,n.y)){let t=Math.abs(i-n.y)/(r-n.x);Rc(n,e)&&(t<u||t===u&&(n.x>o.x||n.x===o.x&&wc(o,n)))&&(o=n,u=t)}n=n.next}while(n!==s);return o}function wc(e,t){return Mc(e.prev,e,t.prev)<0&&Mc(t.next,e,e.next)<0}function Tc(e,t,n,r){let i=e;do i.z===0&&(i.z=Dc(i.x,i.y,t,n,r)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==e);i.prevZ.nextZ=null,i.prevZ=null,Ec(i)}function Ec(e){let t,n=1;do{let r=e,i;e=null;let a=null;for(t=0;r;){t++;let o=r,s=0;for(let e=0;e<n&&(s++,o=o.nextZ,o);e++);let c=n;for(;s>0||c>0&&o;)s!==0&&(c===0||!o||r.z<=o.z)?(i=r,r=r.nextZ,s--):(i=o,o=o.nextZ,c--),a?a.nextZ=i:e=i,i.prevZ=a,a=i;r=o}a.nextZ=null,n*=2}while(t>1);return e}function Dc(e,t,n,r,i){return e=(e-n)*i|0,t=(t-r)*i|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function Oc(e){let t=e,n=e;do(t.x<n.x||t.x===n.x&&t.y<n.y)&&(n=t),t=t.next;while(t!==e);return n}function kc(e,t,n,r,i,a,o,s){return(i-o)*(t-s)>=(e-o)*(a-s)&&(e-o)*(r-s)>=(n-o)*(t-s)&&(n-o)*(a-s)>=(i-o)*(r-s)}function Ac(e,t,n,r,i,a,o,s){return(e!==o||t!==s)&&kc(e,t,n,r,i,a,o,s)}function jc(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!Lc(e,t)&&(Rc(e,t)&&Rc(t,e)&&zc(e,t)&&(Mc(e.prev,e,t.prev)||Mc(e,t.prev,t))||Nc(e,t)&&Mc(e.prev,e,e.next)>0&&Mc(t.prev,t,t.next)>0)}function Mc(e,t,n){return(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y)}function Nc(e,t){return e.x===t.x&&e.y===t.y}function Pc(e,t,n,r){let i=Ic(Mc(e,t,n)),a=Ic(Mc(e,t,r)),o=Ic(Mc(n,r,e)),s=Ic(Mc(n,r,t));return!!(i!==a&&o!==s||i===0&&Fc(e,n,t)||a===0&&Fc(e,r,t)||o===0&&Fc(n,e,r)||s===0&&Fc(n,t,r))}function Fc(e,t,n){return t.x<=Math.max(e.x,n.x)&&t.x>=Math.min(e.x,n.x)&&t.y<=Math.max(e.y,n.y)&&t.y>=Math.min(e.y,n.y)}function Ic(e){return e>0?1:e<0?-1:0}function Lc(e,t){let n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==t.i&&n.next.i!==t.i&&Pc(n,n.next,e,t))return!0;n=n.next}while(n!==e);return!1}function Rc(e,t){return Mc(e.prev,e,e.next)<0?Mc(e,t,e.next)>=0&&Mc(e,e.prev,t)>=0:Mc(e,t,e.prev)<0||Mc(e,e.next,t)<0}function zc(e,t){let n=e,r=!1,i=(e.x+t.x)/2,a=(e.y+t.y)/2;do n.y>a!=n.next.y>a&&n.next.y!==n.y&&i<(n.next.x-n.x)*(a-n.y)/(n.next.y-n.y)+n.x&&(r=!r),n=n.next;while(n!==e);return r}function Bc(e,t){let n=Uc(e.i,e.x,e.y),r=Uc(t.i,t.x,t.y),i=e.next,a=t.prev;return e.next=t,t.prev=e,n.next=i,i.prev=n,r.next=n,n.prev=r,a.next=r,r.prev=a,r}function Vc(e,t,n,r){let i=Uc(e,t,n);return r?(i.next=r.next,i.prev=r,r.next.prev=i,r.next=i):(i.prev=i,i.next=i),i}function Hc(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function Uc(e,t,n){return{i:e,x:t,y:n,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Wc(e,t,n,r){let i=0;for(let a=t,o=n-r;a<n;a+=r)i+=(e[o]-e[a])*(e[a+1]+e[o+1]),o=a;return i}var Gc=class{static triangulate(e,t,n=2){return fc(e,t,n)}},Kc=class e{static area(e){let t=e.length,n=0;for(let r=t-1,i=0;i<t;r=i++)n+=e[r].x*e[i].y-e[i].x*e[r].y;return n*.5}static isClockWise(t){return e.area(t)<0}static triangulateShape(e,t){let n=[],r=[],i=[];qc(e),Jc(n,e);let a=e.length;t.forEach(qc);for(let e=0;e<t.length;e++)r.push(a),a+=t[e].length,Jc(n,t[e]);let o=Gc.triangulate(n,r);for(let e=0;e<o.length;e+=3)i.push(o.slice(e,e+3));return i}};function qc(e){let t=e.length;t>2&&e[t-1].equals(e[0])&&e.pop()}function Jc(e,t){for(let n=0;n<t.length;n++)e.push(t[n].x),e.push(t[n].y)}var Yc=class e extends to{constructor(e=new dc([new W(.5,.5),new W(-.5,.5),new W(-.5,-.5),new W(.5,-.5)]),t={}){super(),this.type=`ExtrudeGeometry`,this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,r=[],i=[];for(let t=0,n=e.length;t<n;t++){let n=e[t];a(n)}this.setAttribute(`position`,new Y(r,3)),this.setAttribute(`uv`,new Y(i,2)),this.computeVertexNormals();function a(e){let a=[],o=t.curveSegments===void 0?12:t.curveSegments,s=t.steps===void 0?1:t.steps,c=t.depth===void 0?1:t.depth,l=t.bevelEnabled===void 0||t.bevelEnabled,u=t.bevelThickness===void 0?.2:t.bevelThickness,d=t.bevelSize===void 0?u-.1:t.bevelSize,f=t.bevelOffset===void 0?0:t.bevelOffset,p=t.bevelSegments===void 0?3:t.bevelSegments,m=t.extrudePath,h=t.UVGenerator===void 0?Xc:t.UVGenerator,g,_=!1,v,y,b,x;if(m){g=m.getSpacedPoints(s),_=!0,l=!1;let e=m.isCatmullRomCurve3?m.closed:!1;v=m.computeFrenetFrames(s,e),y=new G,b=new G,x=new G}l||(p=0,u=0,d=0,f=0);let S=e.extractPoints(o),C=S.shape,w=S.holes;if(!Kc.isClockWise(C)){C=C.reverse();for(let e=0,t=w.length;e<t;e++){let t=w[e];Kc.isClockWise(t)&&(w[e]=t.reverse())}}function T(e){let t=e[0];for(let n=1;n<=e.length;n++){let r=n%e.length,i=e[r],a=i.x-t.x,o=i.y-t.y,s=a*a+o*o,c=Math.max(Math.abs(i.x),Math.abs(i.y),Math.abs(t.x),Math.abs(t.y));if(s<=10000000000000001e-36*c*c){e.splice(r,1),n--;continue}t=i}}T(C),w.forEach(T);let E=w.length,D=C;for(let e=0;e<E;e++){let t=w[e];C=C.concat(t)}function O(e,t,n){return t||H(`ExtrudeGeometry: vec does not exist`),e.clone().addScaledVector(t,n)}let k=C.length;function A(e,t,n){let r,i,a,o=e.x-t.x,s=e.y-t.y,c=n.x-e.x,l=n.y-e.y,u=o*o+s*s,d=o*l-s*c;if(Math.abs(d)>2**-52){let d=Math.sqrt(u),f=Math.sqrt(c*c+l*l),p=t.x-s/d,m=t.y+o/d,h=n.x-l/f,g=n.y+c/f,_=((h-p)*l-(g-m)*c)/(o*l-s*c);r=p+o*_-e.x,i=m+s*_-e.y;let v=r*r+i*i;if(v<=2)return new W(r,i);a=Math.sqrt(v/2)}else{let e=!1;o>2**-52?c>2**-52&&(e=!0):o<-(2**-52)?c<-(2**-52)&&(e=!0):Math.sign(s)===Math.sign(l)&&(e=!0),e?(r=-s,i=o,a=Math.sqrt(u)):(r=o,i=s,a=Math.sqrt(u/2))}return new W(r/a,i/a)}let j=[];for(let e=0,t=D.length,n=t-1,r=e+1;e<t;e++,n++,r++)n===t&&(n=0),r===t&&(r=0),j[e]=A(D[e],D[n],D[r]);let ee=[],M,N=j.concat();for(let e=0,t=E;e<t;e++){let t=w[e];M=[];for(let e=0,n=t.length,r=n-1,i=e+1;e<n;e++,r++,i++)r===n&&(r=0),i===n&&(i=0),M[e]=A(t[e],t[r],t[i]);ee.push(M),N=N.concat(M)}let P;if(p===0)P=Kc.triangulateShape(D,w);else{let e=[],t=[];for(let n=0;n<p;n++){let r=n/p,i=u*Math.cos(r*Math.PI/2),a=d*Math.sin(r*Math.PI/2)+f;for(let t=0,n=D.length;t<n;t++){let n=O(D[t],j[t],a);I(n.x,n.y,-i),r===0&&e.push(n)}for(let e=0,n=E;e<n;e++){let n=w[e];M=ee[e];let o=[];for(let e=0,t=n.length;e<t;e++){let t=O(n[e],M[e],a);I(t.x,t.y,-i),r===0&&o.push(t)}r===0&&t.push(o)}}P=Kc.triangulateShape(e,t)}let F=P.length,te=d+f;for(let e=0;e<k;e++){let t=l?O(C[e],N[e],te):C[e];_?(b.copy(v.normals[0]).multiplyScalar(t.x),y.copy(v.binormals[0]).multiplyScalar(t.y),x.copy(g[0]).add(b).add(y),I(x.x,x.y,x.z)):I(t.x,t.y,0)}for(let e=1;e<=s;e++)for(let t=0;t<k;t++){let n=l?O(C[t],N[t],te):C[t];_?(b.copy(v.normals[e]).multiplyScalar(n.x),y.copy(v.binormals[e]).multiplyScalar(n.y),x.copy(g[e]).add(b).add(y),I(x.x,x.y,x.z)):I(n.x,n.y,c/s*e)}for(let e=p-1;e>=0;e--){let t=e/p,n=u*Math.cos(t*Math.PI/2),r=d*Math.sin(t*Math.PI/2)+f;for(let e=0,t=D.length;e<t;e++){let t=O(D[e],j[e],r);I(t.x,t.y,c+n)}for(let e=0,t=w.length;e<t;e++){let t=w[e];M=ee[e];for(let e=0,i=t.length;e<i;e++){let i=O(t[e],M[e],r);_?I(i.x,i.y+g[s-1].y,g[s-1].x+n):I(i.x,i.y,c+n)}}}ne(),re();function ne(){let e=r.length/3;if(l){let e=0,t=k*e;for(let e=0;e<F;e++){let n=P[e];ae(n[2]+t,n[1]+t,n[0]+t)}e=s+p*2,t=k*e;for(let e=0;e<F;e++){let n=P[e];ae(n[0]+t,n[1]+t,n[2]+t)}}else{for(let e=0;e<F;e++){let t=P[e];ae(t[2],t[1],t[0])}for(let e=0;e<F;e++){let t=P[e];ae(t[0]+k*s,t[1]+k*s,t[2]+k*s)}}n.addGroup(e,r.length/3-e,0)}function re(){let e=r.length/3,t=0;ie(D,t),t+=D.length;for(let e=0,n=w.length;e<n;e++){let n=w[e];ie(n,t),t+=n.length}n.addGroup(e,r.length/3-e,1)}function ie(e,t){let n=e.length;for(;--n>=0;){let r=n,i=n-1;i<0&&(i=e.length-1);for(let e=0,n=s+p*2;e<n;e++){let n=k*e,a=k*(e+1);oe(t+r+n,t+i+n,t+i+a,t+r+a)}}}function I(e,t,n){a.push(e),a.push(t),a.push(n)}function ae(e,t,i){se(e),se(t),se(i);let a=r.length/3,o=h.generateTopUV(n,r,a-3,a-2,a-1);ce(o[0]),ce(o[1]),ce(o[2])}function oe(e,t,i,a){se(e),se(t),se(a),se(t),se(i),se(a);let o=r.length/3,s=h.generateSideWallUV(n,r,o-6,o-3,o-2,o-1);ce(s[0]),ce(s[1]),ce(s[3]),ce(s[1]),ce(s[2]),ce(s[3])}function se(e){r.push(a[e*3+0]),r.push(a[e*3+1]),r.push(a[e*3+2])}function ce(e){i.push(e.x),i.push(e.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Zc(t,n,e)}static fromJSON(t,n){let r=[];for(let e=0,i=t.shapes.length;e<i;e++){let i=n[t.shapes[e]];r.push(i)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new cc[i.type]().fromJSON(i)),new e(r,t.options)}},Xc={generateTopUV:function(e,t,n,r,i){let a=t[n*3],o=t[n*3+1],s=t[r*3],c=t[r*3+1],l=t[i*3],u=t[i*3+1];return[new W(a,o),new W(s,c),new W(l,u)]},generateSideWallUV:function(e,t,n,r,i,a){let o=t[n*3],s=t[n*3+1],c=t[n*3+2],l=t[r*3],u=t[r*3+1],d=t[r*3+2],f=t[i*3],p=t[i*3+1],m=t[i*3+2],h=t[a*3],g=t[a*3+1],_=t[a*3+2];return Math.abs(s-u)<Math.abs(o-l)?[new W(o,1-c),new W(l,1-d),new W(f,1-m),new W(h,1-_)]:[new W(s,1-c),new W(u,1-d),new W(p,1-m),new W(g,1-_)]}};function Zc(e,t,n){if(n.shapes=[],Array.isArray(e))for(let t=0,r=e.length;t<r;t++){let r=e[t];n.shapes.push(r.uuid)}else n.shapes.push(e.uuid);return n.options=Object.assign({},t),t.extrudePath!==void 0&&(n.options.extrudePath=t.extrudePath.toJSON()),n}var Qc=class e extends Ps{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1];super(r,[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type=`IcosahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},$c=class e extends to{constructor(e=[new W(0,-.5),new W(.5,0),new W(0,.5)],t=12,n=0,r=Math.PI*2){super(),this.type=`LatheGeometry`,this.parameters={points:e,segments:t,phiStart:n,phiLength:r},t=Math.floor(t),r=U(r,0,Math.PI*2);let i=[],a=[],o=[],s=[],c=[],l=1/t,u=new G,d=new W,f=new G,p=new G,m=new G,h=0,g=0;for(let t=0;t<=e.length-1;t++)switch(t){case 0:h=e[t+1].x-e[t].x,g=e[t+1].y-e[t].y,f.x=g*1,f.y=-h,f.z=g*0,m.copy(f),f.normalize(),s.push(f.x,f.y,f.z);break;case e.length-1:s.push(m.x,m.y,m.z);break;default:h=e[t+1].x-e[t].x,g=e[t+1].y-e[t].y,f.x=g*1,f.y=-h,f.z=g*0,p.copy(f),f.x+=m.x,f.y+=m.y,f.z+=m.z,f.normalize(),s.push(f.x,f.y,f.z),m.copy(p)}for(let i=0;i<=t;i++){let f=n+i*l*r,p=Math.sin(f),m=Math.cos(f);for(let n=0;n<=e.length-1;n++){u.x=e[n].x*p,u.y=e[n].y,u.z=e[n].x*m,a.push(u.x,u.y,u.z),d.x=i/t,d.y=n/(e.length-1),o.push(d.x,d.y);let r=s[3*n+0]*p,l=s[3*n+1],f=s[3*n+0]*m;c.push(r,l,f)}}for(let n=0;n<t;n++)for(let t=0;t<e.length-1;t++){let r=t+n*e.length,a=r,o=r+e.length,s=r+e.length+1,c=r+1;i.push(a,o,c),i.push(s,c,o)}this.setIndex(i),this.setAttribute(`position`,new Y(a,3)),this.setAttribute(`uv`,new Y(o,2)),this.setAttribute(`normal`,new Y(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.points,t.segments,t.phiStart,t.phiLength)}},el=class e extends to{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new Y(p,3)),this.setAttribute(`normal`,new Y(m,3)),this.setAttribute(`uv`,new Y(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},tl=class e extends to{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new G,d=new G,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new Y(p,3)),this.setAttribute(`normal`,new Y(m,3)),this.setAttribute(`uv`,new Y(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},nl=class e extends to{constructor(e=1,t=.4,n=12,r=48,i=Math.PI*2,a=0,o=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i,thetaStart:a,thetaLength:o},n=Math.floor(n),r=Math.floor(r);let s=[],c=[],l=[],u=[],d=new G,f=new G,p=new G;for(let s=0;s<=n;s++){let m=a+s/n*o;for(let a=0;a<=r;a++){let o=a/r*i;f.x=(e+t*Math.cos(m))*Math.cos(o),f.y=(e+t*Math.cos(m))*Math.sin(o),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(o),d.y=e*Math.sin(o),p.subVectors(f,d).normalize(),l.push(p.x,p.y,p.z),u.push(a/r),u.push(s/n)}}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,a=(r+1)*(e-1)+t,o=(r+1)*e+t;s.push(n,i,o),s.push(i,a,o)}this.setIndex(s),this.setAttribute(`position`,new Y(c,3)),this.setAttribute(`normal`,new Y(l,3)),this.setAttribute(`uv`,new Y(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}},rl=class e extends to{constructor(e=new oc(new G(-1,-1,0),new G(-1,1,0),new G(1,1,0)),t=64,n=1,r=8,i=!1){super(),this.type=`TubeGeometry`,this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:r,closed:i};let a=e.computeFrenetFrames(t,i);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new G,s=new G,c=new W,l=new G,u=[],d=[],f=[],p=[];m(),this.setIndex(p),this.setAttribute(`position`,new Y(u,3)),this.setAttribute(`normal`,new Y(d,3)),this.setAttribute(`uv`,new Y(f,2));function m(){for(let e=0;e<t;e++)h(e);h(i===!1?t:0),_(),g()}function h(i){l=e.getPointAt(i/t,l);let c=a.normals[i],f=a.binormals[i];for(let e=0;e<=r;e++){let t=e/r*Math.PI*2,i=Math.sin(t),a=-Math.cos(t);s.x=a*c.x+i*f.x,s.y=a*c.y+i*f.y,s.z=a*c.z+i*f.z,s.normalize(),d.push(s.x,s.y,s.z),o.x=l.x+n*s.x,o.y=l.y+n*s.y,o.z=l.z+n*s.z,u.push(o.x,o.y,o.z)}}function g(){for(let e=1;e<=t;e++)for(let t=1;t<=r;t++){let n=(r+1)*(e-1)+(t-1),i=(r+1)*e+(t-1),a=(r+1)*e+t,o=(r+1)*(e-1)+t;p.push(n,i,o),p.push(i,a,o)}}function _(){for(let e=0;e<=t;e++)for(let n=0;n<=r;n++)c.x=e/t,c.y=n/r,f.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(t){return new e(new cc[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}};function il(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(ol(i))i.isRenderTargetTexture?(V(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(ol(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function al(e){let t={};for(let n=0;n<e.length;n++){let r=il(e[n]);for(let e in r)t[e]=r[e]}return t}function ol(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function sl(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function cl(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ai.workingColorSpace}var ll={clone:il,merge:al},ul=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,dl=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,fl=class extends uo{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ul,this.fragmentShader=dl,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=il(e.uniforms),this.uniformsGroups=sl(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new J().setHex(r.value);break;case`v2`:this.uniforms[n].value=new W().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new G().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new gi().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new K().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new q().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},pl=class extends fl{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},ml=class extends uo{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new J(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new J(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new W(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ai,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},hl=class extends ml{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:``,PHYSICAL:``},this.type=`MeshPhysicalMaterial`,this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new W(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return U(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new J(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new J(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new J(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:``,PHYSICAL:``},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}},gl=class extends uo{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type=`MeshNormalMaterial`,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new W(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}},_l=class extends uo{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type=`MeshLambertMaterial`,this.color=new J(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new J(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new W(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ai,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},vl=class extends uo{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=or,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},yl=class extends uo{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function bl(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function xl(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}function Sl(e){function t(t,n){return e[t]-e[n]}let n=e.length,r=Array(n);for(let e=0;e!==n;++e)r[e]=e;return r.sort(t),r}function Cl(e,t,n){let r=e.length,i=new e.constructor(r);for(let a=0,o=0;o!==r;++a){let r=n[a]*t;for(let n=0;n!==t;++n)i[o++]=e[r+n]}return i}function wl(e,t,n,r){let i=1,a=e[0];for(;a!==void 0&&a[r]===void 0;)a=e[i++];if(a===void 0)return;let o=a[r];if(o!==void 0){if(Array.isArray(o))do o=a[r],o!==void 0&&(t.push(a.time),n.push(...o)),a=e[i++];while(a!==void 0);else if(o.toArray!==void 0)do o=a[r],o!==void 0&&(t.push(a.time),o.toArray(n,n.length)),a=e[i++];while(a!==void 0);else do o=a[r],o!==void 0&&(t.push(a.time),n.push(o)),a=e[i++];while(a!==void 0)}}var Tl=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},El=class extends Tl{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:nr,endingEnd:nr}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case rr:i=e,o=2*t-n;break;case ir:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case rr:a=e,s=2*n-t;break;case ir:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Dl=class extends Tl{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Ol=class extends Tl{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},kl=class extends Tl{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=Ml(n,t,g,y,r);i[p]=Al(x,o,_,b,m)}return i}};function Al(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function jl(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function Ml(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=Al(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=jl(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var Nl=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=bl(t,this.TimeBufferType),this.values=bl(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:bl(e.times,Array),values:bl(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),xl(e.settings)&&(n.settings={inTangents:bl(e.settings.inTangents,Array),outTangents:bl(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Ol(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Dl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new El(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new kl(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Qn:t=this.InterpolantFactoryMethodDiscrete;break;case $n:t=this.InterpolantFactoryMethodLinear;break;case er:t=this.InterpolantFactoryMethodSmooth;break;case tr:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return V(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Qn;case this.InterpolantFactoryMethodLinear:return $n;case this.InterpolantFactoryMethodSmooth:return er;case this.InterpolantFactoryMethodBezier:return tr}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;xl(this.settings)&&(Pl(this.settings.inTangents,e),Pl(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(H(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(H(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){H(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){H(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&gr(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){H(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===er,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,xl(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Pl(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}Nl.prototype.ValueTypeName=``,Nl.prototype.TimeBufferType=Float32Array,Nl.prototype.ValueBufferType=Float32Array,Nl.prototype.DefaultInterpolation=$n;var Fl=class extends Nl{constructor(e,t,n){super(e,t,n)}};Fl.prototype.ValueTypeName=`bool`,Fl.prototype.ValueBufferType=Array,Fl.prototype.DefaultInterpolation=Qn,Fl.prototype.InterpolantFactoryMethodLinear=void 0,Fl.prototype.InterpolantFactoryMethodSmooth=void 0;var Il=class extends Nl{constructor(e,t,n,r){super(e,t,n,r)}};Il.prototype.ValueTypeName=`color`;var Ll=class extends Nl{constructor(e,t,n,r){super(e,t,n,r)}};Ll.prototype.ValueTypeName=`number`;var Rl=class extends Tl{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)Qr.slerpFlat(i,0,a,c-o,a,c,s);return i}},zl=class extends Nl{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new Rl(this.times,this.values,this.getValueSize(),e)}};zl.prototype.ValueTypeName=`quaternion`,zl.prototype.InterpolantFactoryMethodSmooth=void 0;var Bl=class extends Nl{constructor(e,t,n){super(e,t,n)}};Bl.prototype.ValueTypeName=`string`,Bl.prototype.ValueBufferType=Array,Bl.prototype.DefaultInterpolation=Qn,Bl.prototype.InterpolantFactoryMethodLinear=void 0,Bl.prototype.InterpolantFactoryMethodSmooth=void 0;var Vl=class extends Nl{constructor(e,t,n,r){super(e,t,n,r)}};Vl.prototype.ValueTypeName=`vector`;var Hl=class{constructor(e=``,t=-1,n=[],r=ar){this.name=e,this.tracks=n,this.duration=t,this.blendMode=r,this.uuid=Ar(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,r=1/(e.fps||1);for(let e=0,i=n.length;e!==i;++e)t.push(Wl(n[e]).scale(r));let i=new this(e.name,e.duration,t,e.blendMode);return i.uuid=e.uuid,i.userData=JSON.parse(e.userData||`{}`),i}static toJSON(e){let t=[],n=e.tracks,r={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let e=0,r=n.length;e!==r;++e)t.push(Nl.toJSON(n[e]));return r}static CreateFromMorphTargetSequence(e,t,n,r){let i=t.length,a=[];for(let e=0;e<i;e++){let o=[],s=[];o.push((e+i-1)%i,e,(e+1)%i),s.push(0,1,0);let c=Sl(o);o=Cl(o,1,c),s=Cl(s,1,c),!r&&o[0]===0&&(o.push(i),s.push(s[0])),a.push(new Ll(`.morphTargetInfluences[`+t[e].name+`]`,o,s).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let t=e;n=t.geometry&&t.geometry.animations||t.animations}for(let e=0;e<n.length;e++)if(n[e].name===t)return n[e];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let r={},i=/^([\w-]*?)([\d]+)$/;for(let t=0,n=e.length;t<n;t++){let n=e[t],a=n.name.match(i);if(a&&a.length>1){let e=a[1],t=r[e];t||(r[e]=t=[]),t.push(n)}}let a=[];for(let e in r)a.push(this.CreateFromMorphTargetSequence(e,r[e],t,n));return a}resetDuration(){let e=this.tracks,t=0;for(let n=0,r=e.length;n!==r;++n){let e=this.tracks[n];t=Math.max(t,e.times[e.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e&&=this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function Ul(e){switch(e.toLowerCase()){case`scalar`:case`double`:case`float`:case`number`:case`integer`:return Ll;case`vector`:case`vector2`:case`vector3`:case`vector4`:return Vl;case`color`:return Il;case`quaternion`:return zl;case`bool`:case`boolean`:return Fl;case`string`:return Bl}throw Error(`THREE.KeyframeTrack: Unsupported typeName: `+e)}function Wl(e){if(e.type===void 0)throw Error(`THREE.KeyframeTrack: track type undefined, can not parse`);let t=Ul(e.type);if(e.times===void 0){let t=[],n=[];wl(e.keys,t,n,`value`),e.times=t,e.values=n}let n;return n=t.parse===void 0?new t(e.name,e.times,e.values,e.interpolation):t.parse(e),xl(e.settings)&&(n.settings={inTangents:bl(e.settings.inTangents,Float32Array),outTangents:bl(e.settings.outTangents,Float32Array)}),n}var Gl={enabled:!1,files:{},add:function(e,t){this.enabled!==!1&&(Kl(e)||(this.files[e]=t))},get:function(e){if(this.enabled!==!1&&!Kl(e))return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}};function Kl(e){try{let t=e.slice(e.indexOf(`:`)+1);return new URL(t).protocol===`blob:`}catch{return!1}}var ql=new class{constructor(e,t,n){let r=this,i=!1,a=0,o=0,s,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(e){o++,i===!1&&r.onStart!==void 0&&r.onStart(e,a,o),i=!0},this.itemEnd=function(e){a++,r.onProgress!==void 0&&r.onProgress(e,a,o),a===o&&(i=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(e){r.onError!==void 0&&r.onError(e)},this.resolveURL=function(e){return e=e.normalize(`NFC`),s?s(e):e},this.setURLModifier=function(e){return s=e,this},this.addHandler=function(e,t){return c.push(e,t),this},this.removeHandler=function(e){let t=c.indexOf(e);return t!==-1&&c.splice(t,2),this},this.getHandler=function(e){for(let t=0,n=c.length;t<n;t+=2){let n=c[t],r=c[t+1];if(n.global&&(n.lastIndex=0),n.test(e))return r}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||=new AbortController,this._abortController}},Jl=class{constructor(e){this.manager=e===void 0?ql:e,this.crossOrigin=`anonymous`,this.withCredentials=!1,this.path=``,this.resourcePath=``,this.requestHeader={},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,i){n.load(e,r,t,i)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Jl.DEFAULT_MATERIAL_NAME=`__DEFAULT`;var Yl={},Xl=class extends Error{constructor(e,t){super(e),this.response=t}},Zl=class extends Jl{constructor(e){super(e),this.mimeType=``,this.responseType=``,this._abortController=new AbortController}load(e,t,n,r){e===void 0&&(e=``),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=Gl.get(`file:${e}`);if(i!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(i),this.manager.itemEnd(e)},0);return}if(Yl[e]!==void 0){Yl[e].push({onLoad:t,onProgress:n,onError:r});return}Yl[e]=[],Yl[e].push({onLoad:t,onProgress:n,onError:r});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?`include`:`same-origin`,signal:typeof AbortSignal.any==`function`?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,s=this.responseType;fetch(a).then(t=>{if(t.status===200||t.status===0){if(t.status===0&&V(`FileLoader: HTTP Status 0 received.`),typeof ReadableStream>`u`||t.body===void 0||t.body.getReader===void 0)return t;let n=Yl[e],r=t.body.getReader(),i=t.headers.get(`X-File-Size`)||t.headers.get(`Content-Length`),a=i?parseInt(i):0,o=a!==0,s=0,c=new ReadableStream({start(e){t();function t(){r.read().then(({done:r,value:i})=>{if(r)e.close();else{s+=i.byteLength;let r=new ProgressEvent(`progress`,{lengthComputable:o,loaded:s,total:a});for(let e=0,t=n.length;e<t;e++){let t=n[e];t.onProgress&&t.onProgress(r)}e.enqueue(i),t()}},t=>{e.error(t)})}}});return new Response(c)}throw new Xl(`fetch for "${t.url}" responded with ${t.status}: ${t.statusText}`,t)}).then(e=>{switch(s){case`arraybuffer`:return e.arrayBuffer();case`blob`:return e.blob();case`document`:return e.text().then(e=>new DOMParser().parseFromString(e,o));case`json`:return e.json();default:if(o===``)return e.text();{let t=/charset="?([^;"\s]*)"?/i.exec(o),n=t&&t[1]?t[1].toLowerCase():void 0,r=new TextDecoder(n);return e.arrayBuffer().then(e=>r.decode(e))}}}).then(t=>{Gl.add(`file:${e}`,t);let n=Yl[e];delete Yl[e];for(let e=0,r=n.length;e<r;e++){let r=n[e];r.onLoad&&r.onLoad(t)}}).catch(t=>{let n=Yl[e];if(n===void 0)throw this.manager.itemError(e),t;delete Yl[e];for(let e=0,r=n.length;e<r;e++){let r=n[e];r.onError&&r.onError(t)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},Ql=new WeakMap,$l=class extends Jl{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=Gl.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)i.manager.itemStart(e),setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0);else{let e=Ql.get(a);e===void 0&&(e=[],Ql.set(a,e)),e.push({onLoad:t,onError:r})}return a}let o=_r(`img`);function s(){l(),t&&t(this);let n=Ql.get(this)||[];for(let e=0;e<n.length;e++){let t=n[e];t.onLoad&&t.onLoad(this)}Ql.delete(this),i.manager.itemEnd(e)}function c(t){l(),r&&r(t),Gl.remove(`image:${e}`);let n=Ql.get(this)||[];for(let e=0;e<n.length;e++){let r=n[e];r.onError&&r.onError(t)}Ql.delete(this),i.manager.itemError(e),i.manager.itemEnd(e)}function l(){o.removeEventListener(`load`,s,!1),o.removeEventListener(`error`,c,!1)}return o.addEventListener(`load`,s,!1),o.addEventListener(`error`,c,!1),e.slice(0,5)!==`data:`&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Gl.add(`image:${e}`,o),i.manager.itemStart(e),o.src=e,o}},eu=class extends Jl{constructor(e){super(e)}load(e,t,n,r){let i=new hi,a=new $l(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(e){i.image=e,i.needsUpdate=!0,t!==void 0&&t(i)},n,r),i}},tu=class extends qi{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new J(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},nu=class extends tu{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(qi.DEFAULT_UP),this.updateMatrix(),this.groundColor=new J(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},ru=new q,iu=new G,au=new G,ou=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new W(512,512),this.mapType=Kt,this.map=null,this.mapPass=null,this.matrix=new q,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new is,this._frameExtents=new W(1,1),this._viewportCount=1,this._viewports=[new gi(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;iu.setFromMatrixPosition(e.matrixWorld),t.position.copy(iu),au.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(au),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){ru.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(ru,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(ru)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},su=new G,cu=new Qr,lu=new G,uu=class extends qi{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new q,this.projectionMatrix=new q,this.projectionMatrixInverse=new q,this.coordinateSystem=mr,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(su,cu,lu),lu.x===1&&lu.y===1&&lu.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(su,cu,lu.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(su,cu,lu),lu.x===1&&lu.y===1&&lu.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(su,cu,lu.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},du=new G,fu=new W,pu=new W,mu=class extends uu{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=kr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Or*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return kr*2*Math.atan(Math.tan(Or*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){du.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(du.x,du.y).multiplyScalar(-e/du.z),du.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(du.x,du.y).multiplyScalar(-e/du.z)}getViewSize(e,t){return this.getViewBounds(e,fu,pu),t.subVectors(pu,fu)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Or*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},hu=class extends ou{constructor(){super(new mu(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=kr*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height*this.aspect,i=e.distance||t.far;(n!==t.fov||r!==t.aspect||i!==t.far)&&(t.fov=n,t.aspect=r,t.far=i,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},gu=class extends tu{constructor(e,t,n=0,r=Math.PI/3,i=0,a=2){super(e,t),this.isSpotLight=!0,this.type=`SpotLight`,this.position.copy(qi.DEFAULT_UP),this.updateMatrix(),this.target=new qi,this.distance=n,this.angle=r,this.penumbra=i,this.decay=a,this.map=null,this.shadow=new hu}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},_u=class extends ou{constructor(){super(new mu(90,1,.5,500)),this.isPointLightShadow=!0}},vu=class extends tu{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new _u}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},yu=class extends uu{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},bu=class extends ou{constructor(){super(new yu(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},xu=class extends tu{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(qi.DEFAULT_UP),this.updateMatrix(),this.target=new qi,this.shadow=new bu}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Su=class{static extractUrlBase(e){let t=e.lastIndexOf(`/`);return t===-1?`./`:e.slice(0,t+1)}static resolveURL(e,t){return typeof e!=`string`||e===``?``:(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,`$1`)),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}},Cu=new WeakMap,wu=class extends Jl{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>`u`&&V(`ImageBitmapLoader: createImageBitmap() not supported.`),typeof fetch>`u`&&V(`ImageBitmapLoader: fetch() not supported.`),this.options={premultiplyAlpha:`none`},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,r){e===void 0&&(e=``),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=Gl.get(`image-bitmap:${e}`);if(a!==void 0){if(i.manager.itemStart(e),a.then){a.then(n=>{Cu.has(a)===!0?(r&&r(Cu.get(a)),i.manager.itemError(e),i.manager.itemEnd(e)):(t&&t(n),i.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0);return}let o={};o.credentials=this.crossOrigin===`anonymous`?`same-origin`:`include`,o.headers=this.requestHeader,o.signal=typeof AbortSignal.any==`function`?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let s=fetch(e,o).then(function(e){return e.blob()}).then(function(e){return createImageBitmap(e,Object.assign({},i.options,{colorSpaceConversion:`none`}))}).then(function(n){return Gl.add(`image-bitmap:${e}`,n),t&&t(n),i.manager.itemEnd(e),n}).catch(function(t){r&&r(t),Cu.set(s,t),Gl.remove(`image-bitmap:${e}`),i.manager.itemError(e),i.manager.itemEnd(e)});Gl.add(`image-bitmap:${e}`,s),i.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},Tu=-90,Eu=1,Du=class extends qi{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new mu(Tu,Eu,e,t);r.layers=this.layers,this.add(r);let i=new mu(Tu,Eu,e,t);i.layers=this.layers,this.add(i);let a=new mu(Tu,Eu,e,t);a.layers=this.layers,this.add(a);let o=new mu(Tu,Eu,e,t);o.layers=this.layers,this.add(o);let s=new mu(Tu,Eu,e,t);s.layers=this.layers,this.add(s);let c=new mu(Tu,Eu,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Ou=class extends mu{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},ku=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=Au.bind(this),e.addEventListener(`visibilitychange`,this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener(`visibilitychange`,this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e===void 0?performance.now():e)-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function Au(){this._document.hidden===!1&&this.reset()}var ju=`\\[\\]\\.:\\/`,Mu=RegExp(`[\\[\\]\\.:\\/]`,`g`),Nu=`[^\\[\\]\\.:\\/]`,Pu=`[^`+ju.replace(`\\.`,``)+`]`,Fu=`((?:WC+[\\/:])*)`.replace(`WC`,Nu),Iu=`(WCOD+)?`.replace(`WCOD`,Pu),Lu=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,Nu),Ru=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,Nu),zu=RegExp(`^`+Fu+Iu+Lu+Ru+`$`),Bu=[`material`,`materials`,`bones`,`map`],Vu=class{constructor(e,t,n){let r=n||Hu.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Hu=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(Mu,``)}static parseTrackName(e){let t=zu.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Bu.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){V(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){H(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){H(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){H(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){H(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){H(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){H(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){H(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;H(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){H(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){H(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Hu.Composite=Vu,Hu.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Hu.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Hu.prototype.GetterByBindingType=[Hu.prototype._getValue_direct,Hu.prototype._getValue_array,Hu.prototype._getValue_arrayElement,Hu.prototype._getValue_toArray],Hu.prototype.SetterByBindingTypeAndVersioning=[[Hu.prototype._setValue_direct,Hu.prototype._setValue_direct_setNeedsUpdate,Hu.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Hu.prototype._setValue_array,Hu.prototype._setValue_array_setNeedsUpdate,Hu.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Hu.prototype._setValue_arrayElement,Hu.prototype._setValue_arrayElement_setNeedsUpdate,Hu.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Hu.prototype._setValue_fromArray,Hu.prototype._setValue_fromArray_setNeedsUpdate,Hu.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]],class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}};function Uu(e,t,n,r){let i=Wu(r);switch(n){case on:return e*t;case dn:return e*t/i.components*i.byteLength;case fn:return e*t/i.components*i.byteLength;case pn:return e*t*2/i.components*i.byteLength;case mn:return e*t*2/i.components*i.byteLength;case sn:return e*t*3/i.components*i.byteLength;case cn:return e*t*4/i.components*i.byteLength;case hn:return e*t*4/i.components*i.byteLength;case gn:case _n:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case vn:case yn:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case xn:case Cn:return Math.max(e,16)*Math.max(t,8)/4;case bn:case Sn:return Math.max(e,8)*Math.max(t,8)/2;case wn:case Tn:case Dn:case On:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case En:case kn:case An:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case jn:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Mn:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case Nn:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case Pn:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case Fn:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case In:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case Ln:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case Rn:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case zn:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Bn:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Vn:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Hn:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Un:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Wn:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Gn:case Kn:case qn:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Jn:case Yn:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Xn:case Zn:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Wu(e){switch(e){case Kt:case qt:return{byteLength:1,components:1};case Yt:case Jt:case $t:return{byteLength:2,components:1};case en:case tn:return{byteLength:2,components:4};case Zt:case Xt:case Qt:return{byteLength:4,components:1};case rn:case an:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`186`}})),typeof window<`u`&&(window.__THREE__?V(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`186`);function Gu(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Ku(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Z={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},Q={common:{diffuse:{value:new J(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new K},alphaMap:{value:null},alphaMapTransform:{value:new K},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new K}},envmap:{envMap:{value:null},envMapRotation:{value:new K},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new K}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new K}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new K},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new K},normalScale:{value:new W(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new K},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new K}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new K}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new K}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new J(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new G},probesMax:{value:new G},probesResolution:{value:new G}},points:{diffuse:{value:new J(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new K},alphaTest:{value:0},uvTransform:{value:new K}},sprite:{diffuse:{value:new J(16777215)},opacity:{value:1},center:{value:new W(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new K},alphaMap:{value:null},alphaMapTransform:{value:new K},alphaTest:{value:0}}},qu={basic:{uniforms:al([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.fog]),vertexShader:Z.meshbasic_vert,fragmentShader:Z.meshbasic_frag},lambert:{uniforms:al([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,Q.lights,{emissive:{value:new J(0)},envMapIntensity:{value:1}}]),vertexShader:Z.meshlambert_vert,fragmentShader:Z.meshlambert_frag},phong:{uniforms:al([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,Q.lights,{emissive:{value:new J(0)},specular:{value:new J(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Z.meshphong_vert,fragmentShader:Z.meshphong_frag},standard:{uniforms:al([Q.common,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.roughnessmap,Q.metalnessmap,Q.fog,Q.lights,{emissive:{value:new J(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Z.meshphysical_vert,fragmentShader:Z.meshphysical_frag},toon:{uniforms:al([Q.common,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.gradientmap,Q.fog,Q.lights,{emissive:{value:new J(0)}}]),vertexShader:Z.meshtoon_vert,fragmentShader:Z.meshtoon_frag},matcap:{uniforms:al([Q.common,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,{matcap:{value:null}}]),vertexShader:Z.meshmatcap_vert,fragmentShader:Z.meshmatcap_frag},points:{uniforms:al([Q.points,Q.fog]),vertexShader:Z.points_vert,fragmentShader:Z.points_frag},dashed:{uniforms:al([Q.common,Q.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Z.linedashed_vert,fragmentShader:Z.linedashed_frag},depth:{uniforms:al([Q.common,Q.displacementmap]),vertexShader:Z.depth_vert,fragmentShader:Z.depth_frag},normal:{uniforms:al([Q.common,Q.bumpmap,Q.normalmap,Q.displacementmap,{opacity:{value:1}}]),vertexShader:Z.meshnormal_vert,fragmentShader:Z.meshnormal_frag},sprite:{uniforms:al([Q.sprite,Q.fog]),vertexShader:Z.sprite_vert,fragmentShader:Z.sprite_frag},background:{uniforms:{uvTransform:{value:new K},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Z.background_vert,fragmentShader:Z.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new K}},vertexShader:Z.backgroundCube_vert,fragmentShader:Z.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Z.cube_vert,fragmentShader:Z.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Z.equirect_vert,fragmentShader:Z.equirect_frag},distance:{uniforms:al([Q.common,Q.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Z.distance_vert,fragmentShader:Z.distance_frag},shadow:{uniforms:al([Q.lights,Q.fog,{color:{value:new J(0)},opacity:{value:1}}]),vertexShader:Z.shadow_vert,fragmentShader:Z.shadow_frag}};qu.physical={uniforms:al([qu.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new K},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new K},clearcoatNormalScale:{value:new W(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new K},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new K},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new K},sheen:{value:0},sheenColor:{value:new J(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new K},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new K},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new K},transmissionSamplerSize:{value:new W},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new K},attenuationDistance:{value:0},attenuationColor:{value:new J(0)},specularColor:{value:new J(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new K},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new K},anisotropyVector:{value:new W},anisotropyMap:{value:null},anisotropyMapTransform:{value:new K}}]),vertexShader:Z.meshphysical_vert,fragmentShader:Z.meshphysical_frag};var Ju={r:0,b:0,g:0},Yu=new q,Xu=new K;Xu.set(-1,0,0,0,1,0,0,0,1);function Zu(e,t,n,r,i,a){let o=new J(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new X(new js(1,1,1),new fl({name:`BackgroundCubeMaterial`,uniforms:il(qu.backgroundCube.uniforms),vertexShader:qu.backgroundCube.vertexShader,fragmentShader:qu.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Yu.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Xu),l.material.toneMapped=ai.getTransfer(i.colorSpace)!==ur,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new X(new el(2,2),new fl({name:`BackgroundMaterial`,uniforms:il(qu.background.uniforms),vertexShader:qu.background.vertexShader,fragmentShader:qu.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=ai.getTransfer(i.colorSpace)!==ur,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(Ju,cl(e)),n.buffers.color.setClear(Ju.r,Ju.g,Ju.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function Qu(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function $u(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function ed(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(V(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&V(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function td(e){let t=this,n=null,r=0,i=!1,a=!1,o=new co,s=new K,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var nd=4,rd=6,id=20,ad=256,od=new yu,sd=new J,cd=null,ld=0,ud=0,dd=!1,fd=new G,pd=new G,md=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=fd}=i;cd=this._renderer.getRenderTarget(),ld=this._renderer.getActiveCubeFace(),ud=this._renderer.getActiveMipmapLevel(),dd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=xd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=bd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(cd,ld,ud),this._renderer.xr.enabled=dd,e.scissorTest=!1,_d(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),cd=this._renderer.getRenderTarget(),ld=this._renderer.getActiveCubeFace(),ud=this._renderer.getActiveMipmapLevel(),dd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Ut,minFilter:Ut,generateMipmaps:!1,type:$t,format:cn,colorSpace:cr,depthBuffer:!1},r=gd(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=gd(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=hd(r)),this._blurMaterial=yd(r,e,t),this._ggxMaterial=vd(r,e,t)}return r}_compileMaterial(e){let t=new X(new to,e);this._renderer.compile(t,od)}_sceneToCubeUV(e,t,n,r,i){let a=new mu(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(sd),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new X(new js,new _o({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(sd),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;_d(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=xd()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=bd());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;_d(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,od)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-nd?n-d+nd:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,_d(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,od),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,_d(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,od)}_blur(e,t,n,r){let i=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,i,t,n,a),this._blurPass(i,e,n,n,a)}_blurPass(e,t,n,r,i){let a=this._renderer,o=this._blurMaterial,s=this._lodMeshes[r];s.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=i,c.mipInt.value=this._lodMax-n;let l=this._sizeLods[r];_d(t,3*l*(r>this._lodMax-nd?r-this._lodMax+nd:0),4*(this._cubeSize-l),3*l,2*l),a.setRenderTarget(t),a.render(s,od)}};function hd(e){let t=[],n=[],r=e,i=e-nd+1+rd;for(let e=0;e<i;e++){let e=2**r;t.push(e);let i=1/(e-2),a=-i,o=1+i,s=[a,a,o,a,o,o,a,a,o,o,a,o],c=new Float32Array(108),l=new Float32Array(108);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];c.set(r,18*e);for(let t=0;t<6;t++){let n=s[t*2]*2-1,r=s[t*2+1]*2-1;e===0?pd.set(1,r,n):e===1?pd.set(-n,1,-r):e===2?pd.set(-n,r,1):e===3?pd.set(-1,r,-n):e===4?pd.set(-n,-1,r):pd.set(n,r,-1),pd.toArray(l,(e*6+t)*3)}}let u=new to;u.setAttribute(`position`,new Va(c,3)),u.setAttribute(`outputDirection`,new Va(l,3)),n.push(new X(u,null)),r>nd&&r--}return{lodMeshes:n,sizeLods:t}}function gd(e,t,n){let r=new vi(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function _d(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function vd(e,t,n){return new fl({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:ad,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Sd(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function yd(e,t,n){return new fl({name:`SphericalGaussianBlur`,defines:{SAMPLES:id,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Sd(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function bd(){return new fl({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:Sd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function xd(){return new fl({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Sd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Sd(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Cd=class extends vi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Es(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new js(5,5,5),i=new fl({name:`CubemapFromEquirect`,uniforms:il(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new X(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=Ut),new Du(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function wd(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new Cd(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new md(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new md(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function Td(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&Sr(`WebGLRenderer: `+e+` extension not supported.`),t}}}function Ed(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0?t:(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++,t)}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?Ua:Ha)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function Dd(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function Od(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:H(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function kd(e,t,n){let r=new WeakMap,i=new gi;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new yi(h,p,m,u);g.type=Qt,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new W(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function Ad(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var jd={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function Md(e,t,n,r,i,a){let o=new vi(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=new to;l.setAttribute(`position`,new Y([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute(`uv`,new Y([0,2,0,0,2,0],2));let u=new pl({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new X(l,u),f=new yu(-1,1,1,-1,0,1),p=null,m=null,h=!1,g,_=null,v=[],y=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<v.length;n++){let r=v[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){v=e,y=v.length>0&&v[0].isRenderPass===!0;let t=o.width,n=o.height;v.length>0&&s===null&&(s=new vi(t,n,{type:$t,depthBuffer:!1,stencilBuffer:!1}),c=new vi(t,n,{type:$t,depthBuffer:!1,stencilBuffer:!1}));for(let e=0;e<v.length;e++){let r=v[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(h||e.toneMapping===0&&v.length===0)return!1;if(_=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return y===!1&&e.setRenderTarget(o),g=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return y},this.end=function(e,t){e.toneMapping=g,h=!0;let n=o,r=s;for(let i=0;i<v.length;i++){let a=v[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(p!==e.outputColorSpace||m!==e.toneMapping){p=e.outputColorSpace,m=e.toneMapping,u.defines={},ai.getTransfer(p)===`srgb`&&(u.defines.SRGB_TRANSFER=``);let t=jd[m];t&&(u.defines[t]=``),u.needsUpdate=!0}u.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(_),e.render(d,f),_=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var Nd=new hi,Pd=new Os(1,1),Fd=new yi,Id=new bi,Ld=new Es,Rd=[],zd=[],Bd=new Float32Array(16),Vd=new Float32Array(9),Hd=new Float32Array(4);function Ud(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Rd[i];if(a===void 0&&(a=new Float32Array(i),Rd[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Wd(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Gd(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Kd(e,t){let n=zd[t];n===void 0&&(n=new Int32Array(t),zd[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function qd(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Jd(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Wd(n,t))return;e.uniform2fv(this.addr,t),Gd(n,t)}}function Yd(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Wd(n,t))return;e.uniform3fv(this.addr,t),Gd(n,t)}}function Xd(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Wd(n,t))return;e.uniform4fv(this.addr,t),Gd(n,t)}}function Zd(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Wd(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Gd(n,t)}else{if(Wd(n,r))return;Hd.set(r),e.uniformMatrix2fv(this.addr,!1,Hd),Gd(n,r)}}function Qd(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Wd(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Gd(n,t)}else{if(Wd(n,r))return;Vd.set(r),e.uniformMatrix3fv(this.addr,!1,Vd),Gd(n,r)}}function $d(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Wd(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Gd(n,t)}else{if(Wd(n,r))return;Bd.set(r),e.uniformMatrix4fv(this.addr,!1,Bd),Gd(n,r)}}function ef(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function tf(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Wd(n,t))return;e.uniform2iv(this.addr,t),Gd(n,t)}}function nf(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Wd(n,t))return;e.uniform3iv(this.addr,t),Gd(n,t)}}function rf(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Wd(n,t))return;e.uniform4iv(this.addr,t),Gd(n,t)}}function af(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function of(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Wd(n,t))return;e.uniform2uiv(this.addr,t),Gd(n,t)}}function sf(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Wd(n,t))return;e.uniform3uiv(this.addr,t),Gd(n,t)}}function cf(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Wd(n,t))return;e.uniform4uiv(this.addr,t),Gd(n,t)}}function lf(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(Pd.compareFunction=n.isReversedDepthBuffer()?518:515,a=Pd):a=Nd,n.setTexture2D(t||a,i)}function uf(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Id,i)}function df(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||Ld,i)}function ff(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||Fd,i)}function pf(e){switch(e){case 5126:return qd;case 35664:return Jd;case 35665:return Yd;case 35666:return Xd;case 35674:return Zd;case 35675:return Qd;case 35676:return $d;case 5124:case 35670:return ef;case 35667:case 35671:return tf;case 35668:case 35672:return nf;case 35669:case 35673:return rf;case 5125:return af;case 36294:return of;case 36295:return sf;case 36296:return cf;case 35678:case 36198:case 36298:case 36306:case 35682:return lf;case 35679:case 36299:case 36307:return uf;case 35680:case 36300:case 36308:case 36293:return df;case 36289:case 36303:case 36311:case 36292:return ff}}function mf(e,t){e.uniform1fv(this.addr,t)}function hf(e,t){let n=Ud(t,this.size,2);e.uniform2fv(this.addr,n)}function gf(e,t){let n=Ud(t,this.size,3);e.uniform3fv(this.addr,n)}function _f(e,t){let n=Ud(t,this.size,4);e.uniform4fv(this.addr,n)}function vf(e,t){let n=Ud(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function yf(e,t){let n=Ud(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function bf(e,t){let n=Ud(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function xf(e,t){e.uniform1iv(this.addr,t)}function Sf(e,t){e.uniform2iv(this.addr,t)}function Cf(e,t){e.uniform3iv(this.addr,t)}function wf(e,t){e.uniform4iv(this.addr,t)}function Tf(e,t){e.uniform1uiv(this.addr,t)}function Ef(e,t){e.uniform2uiv(this.addr,t)}function Df(e,t){e.uniform3uiv(this.addr,t)}function Of(e,t){e.uniform4uiv(this.addr,t)}function kf(e,t,n){let r=this.cache,i=t.length,a=Kd(n,i);Wd(r,a)||(e.uniform1iv(this.addr,a),Gd(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?Pd:Nd;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function Af(e,t,n){let r=this.cache,i=t.length,a=Kd(n,i);Wd(r,a)||(e.uniform1iv(this.addr,a),Gd(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Id,a[e])}function jf(e,t,n){let r=this.cache,i=t.length,a=Kd(n,i);Wd(r,a)||(e.uniform1iv(this.addr,a),Gd(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||Ld,a[e])}function Mf(e,t,n){let r=this.cache,i=t.length,a=Kd(n,i);Wd(r,a)||(e.uniform1iv(this.addr,a),Gd(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||Fd,a[e])}function Nf(e){switch(e){case 5126:return mf;case 35664:return hf;case 35665:return gf;case 35666:return _f;case 35674:return vf;case 35675:return yf;case 35676:return bf;case 5124:case 35670:return xf;case 35667:case 35671:return Sf;case 35668:case 35672:return Cf;case 35669:case 35673:return wf;case 5125:return Tf;case 36294:return Ef;case 36295:return Df;case 36296:return Of;case 35678:case 36198:case 36298:case 36306:case 35682:return kf;case 35679:case 36299:case 36307:return Af;case 35680:case 36300:case 36308:case 36293:return jf;case 36289:case 36303:case 36311:case 36292:return Mf}}var Pf=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=pf(t.type)}},Ff=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Nf(t.type)}},If=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Lf=/(\w+)(\])?(\[|\.)?/g;function Rf(e,t){e.seq.push(t),e.map[t.id]=t}function zf(e,t,n){let r=e.name,i=r.length;for(Lf.lastIndex=0;;){let a=Lf.exec(r),o=Lf.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Rf(n,l===void 0?new Pf(s,e,t):new Ff(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new If(s),Rf(n,e)),n=e}}}var Bf=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);zf(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Vf(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Hf=37297,Uf=0;function Wf(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Gf=new K;function Kf(e){ai._getMatrix(Gf,ai.workingColorSpace,e);let t=`mat3( ${Gf.elements.map(e=>e.toFixed(4))} )`;switch(ai.getTransfer(e)){case lr:return[t,`LinearTransferOETF`];case ur:return[t,`sRGBTransferOETF`];default:return V(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function qf(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Wf(e.getShaderSource(t),r)}return i}function Jf(e,t){let n=Kf(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var Yf={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Xf(e,t){let n=Yf[t];return n===void 0?(V(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Zf=new G;function Qf(){return ai.getLuminanceCoefficients(Zf),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Zf.x.toFixed(4)}, ${Zf.y.toFixed(4)}, ${Zf.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function $f(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(np).join(`
`)}function ep(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function tp(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function np(e){return e!==``}function rp(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function ip(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var ap=/^[ \t]*#include +<([\w\d./]+)>/gm;function op(e){return e.replace(ap,cp)}var sp=new Map;function cp(e,t){let n=Z[t];if(n===void 0){let e=sp.get(t);if(e!==void 0)n=Z[e],V(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return op(n)}var lp=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function up(e){return e.replace(lp,dp)}function dp(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function fp(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var pp={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function mp(e){return pp[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var hp={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function gp(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:hp[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var _p={302:`ENVMAP_MODE_REFRACTION`};function vp(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:_p[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var yp={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function bp(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:yp[e.combine]||`ENVMAP_BLENDING_NONE`}function xp(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function Sp(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=mp(n),l=gp(n),u=vp(n),d=bp(n),f=xp(n),p=$f(n),m=ep(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(np).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(np).join(`
`),_.length>0&&(_+=`
`)):(g=[fp(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(np).join(`
`),_=[fp(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:Z.tonemapping_pars_fragment,n.toneMapping===0?``:Xf(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,Z.colorspace_pars_fragment,Jf(`linearToOutputTexel`,n.outputColorSpace),Qf(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(np).join(`
`)),o=op(o),o=rp(o,n),o=ip(o,n),s=op(s),s=rp(s,n),s=ip(s,n),o=up(o),s=up(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=Vf(i,i.VERTEX_SHADER,y),S=Vf(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=qf(i,x,`vertex`),n=qf(i,S,`fragment`);H(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):V(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new Bf(i,h),T=tp(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Hf)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Uf++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var Cp=0,wp=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Tp(e),t.set(e,n)),n}},Tp=class{constructor(e){this.id=Cp++,this.code=e,this.usedTimes=0}};function Ep(e){return e===1030||e===37490||e===36285}function Dp(e,t,n,r,i,a){let o=new ji,s=new wp,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&V(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,k,A;if(C){let e=qu[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),k=e.id,A=t.id}let j=e.getRenderTarget(),ee=e.state.buffers.depth.getReversed(),M=h.isInstancedMesh===!0,N=h.isBatchedMesh===!0,P=!!i.map,F=!!i.matcap,te=!!x,ne=!!i.aoMap,re=!!i.lightMap,ie=!!i.bumpMap&&i.wireframe===!1,I=!!i.normalMap,ae=!!i.displacementMap,oe=!!i.emissiveMap,se=!!i.metalnessMap,ce=!!i.roughnessMap,le=i.anisotropy>0,ue=i.clearcoat>0,de=i.dispersion>0,fe=i.retroreflectivity>0,pe=i.iridescence>0,me=i.sheen>0,he=i.transmission>0,ge=le&&!!i.anisotropyMap,_e=ue&&!!i.clearcoatMap,ve=ue&&!!i.clearcoatNormalMap,ye=ue&&!!i.clearcoatRoughnessMap,be=pe&&!!i.iridescenceMap,L=pe&&!!i.iridescenceThicknessMap,xe=me&&!!i.sheenColorMap,Se=me&&!!i.sheenRoughnessMap,Ce=!!i.specularMap,R=!!i.specularColorMap,we=!!i.specularIntensityMap,z=he&&!!i.transmissionMap,B=he&&!!i.thicknessMap,Te=!!i.gradientMap,Ee=!!i.alphaMap,De=i.alphaTest>0,Oe=!!i.alphaHash,ke=!!i.extensions,Ae=0;i.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(Ae=e.toneMapping);let je={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:k,customFragmentShaderID:A,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:N,batchingColor:N&&h._colorsTexture!==null,instancing:M,instancingColor:M&&h.instanceColor!==null,instancingMorph:M&&h.morphTexture!==null,outputColorSpace:j===null?e.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:ai.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:P,matcap:F,envMap:te,envMapMode:te&&x.mapping,envMapCubeUVHeight:S,aoMap:ne,lightMap:re,bumpMap:ie,normalMap:I,displacementMap:ae,emissiveMap:oe,normalMapObjectSpace:I&&i.normalMapType===1,normalMapTangentSpace:I&&i.normalMapType===0,packedNormalMap:I&&i.normalMapType===0&&Ep(i.normalMap.format),metalnessMap:se,roughnessMap:ce,anisotropy:le,anisotropyMap:ge,clearcoat:ue,clearcoatMap:_e,clearcoatNormalMap:ve,clearcoatRoughnessMap:ye,dispersion:de,retroreflection:fe,iridescence:pe,iridescenceMap:be,iridescenceThicknessMap:L,sheen:me,sheenColorMap:xe,sheenRoughnessMap:Se,specularMap:Ce,specularColorMap:R,specularIntensityMap:we,transmission:he,transmissionMap:z,thicknessMap:B,gradientMap:Te,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Ee,alphaTest:De,alphaHash:Oe,combine:i.combine,mapUv:P&&m(i.map.channel),aoMapUv:ne&&m(i.aoMap.channel),lightMapUv:re&&m(i.lightMap.channel),bumpMapUv:ie&&m(i.bumpMap.channel),normalMapUv:I&&m(i.normalMap.channel),displacementMapUv:ae&&m(i.displacementMap.channel),emissiveMapUv:oe&&m(i.emissiveMap.channel),metalnessMapUv:se&&m(i.metalnessMap.channel),roughnessMapUv:ce&&m(i.roughnessMap.channel),anisotropyMapUv:ge&&m(i.anisotropyMap.channel),clearcoatMapUv:_e&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:ve&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ye&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:be&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:L&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:xe&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:Se&&m(i.sheenRoughnessMap.channel),specularMapUv:Ce&&m(i.specularMap.channel),specularColorMapUv:R&&m(i.specularColorMap.channel),specularIntensityMapUv:we&&m(i.specularIntensityMap.channel),transmissionMapUv:z&&m(i.transmissionMap.channel),thicknessMapUv:B&&m(i.thicknessMap.channel),alphaMapUv:Ee&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(I||le),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(P||Ee),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&I===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:ee,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Ae,decodeVideoTexture:P&&i.map.isVideoTexture===!0&&ai.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:oe&&i.emissiveMap.isVideoTexture===!0&&ai.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:ke&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(ke&&i.extensions.multiDraw===!0||N)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return je.vertexUv1s=c.has(1),je.vertexUv2s=c.has(2),je.vertexUv3s=c.has(3),c.clear(),je}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=qu[t];n=ll.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new Sp(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function Op(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function kp(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Ap(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function jp(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||kp),r.length>1&&r.sort(t||Ap),i.length>1&&i.sort(t||Ap)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function Mp(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new jp,e.set(t,[i])):n>=r.length?(i=new jp,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Np(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new G,color:new J};break;case`SpotLight`:n={position:new G,direction:new G,color:new J,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new G,color:new J,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new G,skyColor:new J,groundColor:new J};break;case`RectAreaLight`:n={color:new J,position:new G,halfWidth:new G,halfHeight:new G}}return e[t.id]=n,n}}}function Pp(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new W};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new W};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new W,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var Fp=0;function Ip(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Lp(e){let t=new Np,n=Pp(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new G);let i=new G,a=new q,o=new q;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(Ip);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=Q.LTC_FLOAT_1,r.rectAreaLTC2=Q.LTC_FLOAT_2):(r.rectAreaLTC1=Q.LTC_HALF_1,r.rectAreaLTC2=Q.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=Fp++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function Rp(e){let t=new Lp(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function zp(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Rp(e),t.set(n,[a])):r>=i.length?(a=new Rp(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Bp=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Vp=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Hp=[new G(1,0,0),new G(-1,0,0),new G(0,1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1)],Up=[new G(0,-1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1),new G(0,-1,0),new G(0,-1,0)],Wp=new q,Gp=new G,Kp=new G;function qp(e,t,n){let r=new is,i=new W,a=new W,o=new gi,s=new vl,c=new yl,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new fl({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new W},radius:{value:4}},vertexShader:Bp,fragmentShader:Vp}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new to;m.setAttribute(`position`,new Va(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new X(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(V(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){V(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){V(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new vi(i.x,i.y,{format:pn,type:$t,minFilter:Ut,magFilter:Ut,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new Os(i.x,i.y,Qt),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=ln,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=Bt,d.map.depthTexture.magFilter=Bt}else l.isPointLight?(d.map=new Cd(i.x),d.map.depthTexture=new ks(i.x,Zt)):(d.map=new vi(i.x,i.y),d.map.depthTexture=new Os(i.x,i.y,Zt)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=ln,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=Ut,d.map.depthTexture.magFilter=Ut):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=Bt,d.map.depthTexture.magFilter=Bt);d.camera.updateProjectionMatrix()}d.map.isWebGLCubeRenderTarget!==!0&&(d.map.width!==i.x||d.map.height!==i.y)&&d.map.setSize(i.x,i.y);let g=d.map.isWebGLCubeRenderTarget?6:d.getViewportCount();l.isPointLight!==!0&&d.updateMatrices(l,s);for(let t=0;t<g;t++){let i=d.getCamera(t);if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Gp.setFromMatrixPosition(l.matrixWorld),e.position.copy(Gp),Kp.copy(e.position),Kp.add(Hp[t]),e.up.copy(Up[t]),e.lookAt(Kp),e.updateMatrixWorld(),n.makeTranslation(-Gp.x,-Gp.y,-Gp.z),Wp.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(Wp,e.coordinateSystem,e.reversedDepth)}if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}r=d.getFrustum(t),b(n,s,i,l,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null?n.mapPass=new vi(i.x,i.y,{format:pn,type:$t}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value.set(n.map.width,n.map.height),f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function y(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,x)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function b(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=y(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=y(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)b(c[e],i,a,o,s)}function x(e){e.target.removeEventListener(`dispose`,x);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Jp(e,t){function n(){let t=!1,n=new gi,r=null,i=new gi(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?se(e.DEPTH_TEST):ce(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=wr[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?se(e.STENCIL_TEST):ce(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new J(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,ee=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),M=!1,N=0,P=e.getParameter(e.VERSION);P.indexOf(`WebGL`)===-1?P.indexOf(`OpenGL ES`)!==-1&&(N=parseFloat(/^OpenGL ES (\d)/.exec(P)[1]),M=N>=2):(N=parseFloat(/^WebGL (\d)/.exec(P)[1]),M=N>=1);let F=null,te={},ne=e.getParameter(e.SCISSOR_BOX),re=e.getParameter(e.VIEWPORT),ie=new gi().fromArray(ne),I=new gi().fromArray(re);function ae(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let oe={};oe[e.TEXTURE_2D]=ae(e.TEXTURE_2D,e.TEXTURE_2D,1),oe[e.TEXTURE_CUBE_MAP]=ae(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),oe[e.TEXTURE_2D_ARRAY]=ae(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),oe[e.TEXTURE_3D]=ae(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),se(e.DEPTH_TEST),o.setFunc(3),ge(!1),_e(1),se(e.CULL_FACE),me(0);function se(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function ce(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function le(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function ue(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function de(t){return h!==t&&(e.useProgram(t),h=t,!0)}let fe={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};fe[103]=e.MIN,fe[104]=e.MAX;let pe={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function me(t,n,r,i,a,o,s,c,l,u){if(t===0){g===!0&&(ce(e.BLEND),g=!1);return}if(g===!1&&(se(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:H(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:H(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:H(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:H(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}return}a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(fe[n],fe[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(pe[r],pe[i],pe[o],pe[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function he(t,n){t.side===2?ce(e.CULL_FACE):se(e.CULL_FACE);let r=t.side===1;n&&(r=!r),ge(r),t.blending===1&&t.transparent===!1?me(0):me(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),ye(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?se(e.SAMPLE_ALPHA_TO_COVERAGE):ce(e.SAMPLE_ALPHA_TO_COVERAGE)}function ge(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function _e(t){t===0?ce(e.CULL_FACE):(se(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function ve(t){t!==k&&(M&&e.lineWidth(t),k=t)}function ye(t,n,r){t?(se(e.POLYGON_OFFSET_FILL),(A!==n||j!==r)&&(A=n,j=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):ce(e.POLYGON_OFFSET_FILL)}function be(t){t?se(e.SCISSOR_TEST):ce(e.SCISSOR_TEST)}function L(t){t===void 0&&(t=e.TEXTURE0+ee-1),F!==t&&(e.activeTexture(t),F=t)}function xe(t,n,r){r===void 0&&(r=F===null?e.TEXTURE0+ee-1:F);let i=te[r];i===void 0&&(i={type:void 0,texture:void 0},te[r]=i),(i.type!==t||i.texture!==n)&&(F!==r&&(e.activeTexture(r),F=r),e.bindTexture(t,n||oe[t]),i.type=t,i.texture=n)}function Se(){let t=te[F];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Ce(){try{e.compressedTexImage2D(...arguments)}catch(e){H(`WebGLState:`,e)}}function R(){try{e.compressedTexImage3D(...arguments)}catch(e){H(`WebGLState:`,e)}}function we(){try{e.texSubImage2D(...arguments)}catch(e){H(`WebGLState:`,e)}}function z(){try{e.texSubImage3D(...arguments)}catch(e){H(`WebGLState:`,e)}}function B(){try{e.compressedTexSubImage2D(...arguments)}catch(e){H(`WebGLState:`,e)}}function Te(){try{e.compressedTexSubImage3D(...arguments)}catch(e){H(`WebGLState:`,e)}}function Ee(){try{e.texStorage2D(...arguments)}catch(e){H(`WebGLState:`,e)}}function De(){try{e.texStorage3D(...arguments)}catch(e){H(`WebGLState:`,e)}}function Oe(){try{e.texImage2D(...arguments)}catch(e){H(`WebGLState:`,e)}}function ke(){try{e.texImage3D(...arguments)}catch(e){H(`WebGLState:`,e)}}function Ae(t){return d[t]===void 0?e.getParameter(t):d[t]}function je(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function Me(t){ie.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),ie.copy(t))}function Ne(t){I.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),I.copy(t))}function Pe(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Fe(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Ie(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},F=null,te={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new J(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,ie.set(0,0,e.canvas.width,e.canvas.height),I.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:se,disable:ce,bindFramebuffer:le,drawBuffers:ue,useProgram:de,setBlending:me,setMaterial:he,setFlipSided:ge,setCullFace:_e,setLineWidth:ve,setPolygonOffset:ye,setScissorTest:be,activeTexture:L,bindTexture:xe,unbindTexture:Se,compressedTexImage2D:Ce,compressedTexImage3D:R,texImage2D:Oe,texImage3D:ke,pixelStorei:je,getParameter:Ae,updateUBOMapping:Pe,uniformBlockBinding:Fe,texStorage2D:Ee,texStorage3D:De,texSubImage2D:we,texSubImage3D:z,compressedTexSubImage2D:B,compressedTexSubImage3D:Te,scissor:Me,viewport:Ne,reset:Ie}}function Yp(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new W,u=new WeakMap,d=new Set,f,p=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function h(e,t){return m?new OffscreenCanvas(e,t):_r(`canvas`)}function g(e,t,n){let r=1,i=Ce(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=h(n,a));let o=t?h(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),V(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&V(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function _(e){return e.generateMipmaps}function v(t){e.generateMipmap(t)}function y(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function b(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];V(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||V(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?lr:ai.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function x(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,V(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function S(e,t){return _(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function C(e){let t=e.target;t.removeEventListener(`dispose`,C),T(t),t.isVideoTexture&&u.delete(t),t.isHTMLTexture&&d.delete(t)}function w(e){let t=e.target;t.removeEventListener(`dispose`,w),D(t)}function T(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&E(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function E(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function D(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let O=0;function k(){O=0}function A(){return O}function j(e){O=e}function ee(){let e=O;return e>=i.maxTextures&&V(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),O+=1,e}function M(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function N(t,i){let a=r.get(t);if(t.isVideoTexture&&xe(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)V(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)V(`WebGLRenderer: Texture marked for update but image is incomplete`);else{ce(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function P(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){ce(a,t,i);return}t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i)}function F(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){ce(a,t,i);return}n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function te(t,i){let a=r.get(t);if(t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version){le(a,t,i);return}n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let ne={[Lt]:e.REPEAT,[Rt]:e.CLAMP_TO_EDGE,[zt]:e.MIRRORED_REPEAT},re={[Bt]:e.NEAREST,[Vt]:e.NEAREST_MIPMAP_NEAREST,[Ht]:e.NEAREST_MIPMAP_LINEAR,[Ut]:e.LINEAR,[Wt]:e.LINEAR_MIPMAP_NEAREST,[Gt]:e.LINEAR_MIPMAP_LINEAR},ie={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function I(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&V(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,ne[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,ne[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,ne[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,re[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,re[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,ie[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function ae(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,C));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=M(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&E(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function oe(e,t,n){return Math.floor(Math.floor(e/n)/t)}function se(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=oe(n.start,r.width,4),c=oe(t.start,r.width,4);n.start<=i+1&&a===c&&oe(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function ce(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=ae(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=ai.getPrimaries(ai.workingColorSpace),r=o.colorSpace===``?null:ai.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=g(o.image,!1,i.maxTextureSize);t=Se(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=b(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);I(c,o);let h,y=o.mipmaps,C=o.isVideoTexture!==!0,w=f.__version===void 0||l===!0,T=u.dataReady,E=S(o,t);if(o.isDepthTexture)m=x(o.format===un,o.type),w&&(C?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(y.length>0){C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else C?(w&&n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height),T&&se(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){C&&w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,y[0].width,y[0].height,t.depth);for(let i=0,a=y.length;i<a;i++)if(h=y[i],o.format!==1023){if(r!==null){if(C){if(T){if(o.layerUpdates.size>0){let t=Uu(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else V(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else C?T&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],o.format===1023?C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?V(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):C?T&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(C){if(w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,t.width,t.height,t.depth),T){if(o.layerUpdates.size>0){let i=Uu(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)C?(w&&n.texStorage3D(e.TEXTURE_3D,E,m,t.width,t.height,t.depth),T&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(w){if(C)n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<E;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(y.length>0){if(C&&w){let t=Ce(y[0]);n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height)}for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(C){if(w){let r=Ce(t);n.texStorage2D(e.TEXTURE_2D,E,m,r.width,r.height)}T&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);_(o)&&v(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function le(t,o,s){if(o.image.length!==6)return;let c=ae(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=ai.getPrimaries(ai.workingColorSpace),r=o.colorSpace===``?null:ai.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=g(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=Se(o,m[e]);let h=m[0],y=a.convert(o.format,o.colorSpace),x=a.convert(o.type),C=b(o.internalFormat,y,x,o.normalized,o.colorSpace),w=o.isVideoTexture!==!0,T=u.__version===void 0||c===!0,E=l.dataReady,D=S(o,h);I(e.TEXTURE_CUBE_MAP,o);let O;if(f){w&&T&&n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,h.width,h.height);for(let t=0;t<6;t++){O=m[t].mipmaps;for(let r=0;r<O.length;r++){let i=O[r];o.format===1023?w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,y,x,i.data):y===null?V(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):w?E&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,i.data)}}}else{if(O=o.mipmaps,w&&T){O.length>0&&D++;let t=Ce(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,t.width,t.height)}for(let t=0;t<6;t++)if(p){w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,y,x,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,m[t].width,m[t].height,0,y,x,m[t].data);for(let r=0;r<O.length;r++){let i=O[r].image[t].image;w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,i.width,i.height,0,y,x,i.data)}}else{w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,y,x,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,y,x,m[t]);for(let r=0;r<O.length;r++){let i=O[r];w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,y,x,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,y,x,i.image[t])}}}_(o)&&v(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function ue(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=b(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),L(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,be(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function de(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=x(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;L(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,be(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,be(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=b(o.internalFormat,c,l,o.normalized,o.colorSpace);L(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,be(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,be(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function fe(t,i,o){let c=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let l=r.get(i.depthTexture);if(l.__renderTarget=i,(!l.__webglTexture||i.depthTexture.image.width!==i.width||i.depthTexture.image.height!==i.height)&&(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),c){if(l.__webglInit===void 0&&(l.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,C)),l.__webglTexture===void 0){l.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,l.__webglTexture),I(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=a.convert(i.depthTexture.format),r=a.convert(i.depthTexture.type),o;i.depthTexture.format===1026?o=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(o=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,o,i.width,i.height,0,t,r,null)}}else N(i.depthTexture,0);let u=l.__webglTexture,d=be(i),f=c?e.TEXTURE_CUBE_MAP_POSITIVE_X+o:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)L(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)L(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function pe(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)fe(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?fe(i.__webglFramebuffer[0],t,0):fe(i.__webglFramebuffer,t,0)}}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),de(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),de(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function me(t,n,i){let a=r.get(t);n!==void 0&&ue(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&pe(t)}function he(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,w);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&L(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=b(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=be(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),de(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),I(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)ue(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else ue(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);_(i)&&v(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),I(c,a),ue(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),_(a)&&v(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),I(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)ue(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else ue(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);_(i)&&v(r),n.unbindTexture()}t.depthBuffer&&pe(t)}function ge(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(_(a)){let t=y(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),v(t),n.unbindTexture()}}}let _e=[],ve=[];function ye(t){if(t.samples>0){if(L(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(_e.length=0,ve.length=0,_e.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&(_e.push(l),ve.push(l),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,ve)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,_e))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function be(e){return Math.min(i.maxSamples,e.samples)}function L(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function xe(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function Se(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(ai.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&V(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):H(`WebGLTextures: Unsupported texture color space:`,n)),t}function Ce(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=ee,this.resetTextureUnits=k,this.getTextureUnits=A,this.setTextureUnits=j,this.setTexture2D=N,this.setTexture2DArray=P,this.setTexture3D=F,this.setTextureCube=te,this.rebindTextures=me,this.setupRenderTarget=he,this.updateRenderTargetMipmap=ge,this.updateMultisampleRenderTarget=ye,this.setupDepthRenderbuffer=pe,this.setupFrameBufferTexture=ue,this.useMultisampledRTT=L,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function Xp(e,t){function n(n,r=``){let i,a=ai.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Zp=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Qp=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,$p=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new As(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new fl({vertexShader:Zp,fragmentShader:Qp,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new X(new el(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},em=class extends Tr{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new $p,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new W,C=null,w=null,T=new mu;T.viewport=new gi;let E=new mu;E.viewport=new gi;let D=[T,E],O=new Ou,k=null,A=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new Xi,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new Xi,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new Xi,b[e]=t),t.getHandSpace()};function j(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ee(){r.removeEventListener(`select`,j),r.removeEventListener(`selectstart`,j),r.removeEventListener(`selectend`,j),r.removeEventListener(`squeeze`,j),r.removeEventListener(`squeezestart`,j),r.removeEventListener(`squeezeend`,j),r.removeEventListener(`end`,ee),r.removeEventListener(`inputsourceschange`,M);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}k=null,A=null,h.reset();for(let e in g)delete g[e];if(e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,I.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),w!==null){let e=w.camera;e.fov=w.fov,e.zoom=w.zoom,e.updateProjectionMatrix(),w=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&V(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&V(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,j),r.addEventListener(`selectstart`,j),r.addEventListener(`selectend`,j),r.addEventListener(`squeeze`,j),r.addEventListener(`squeezestart`,j),r.addEventListener(`squeezeend`,j),r.addEventListener(`end`,ee),r.addEventListener(`inputsourceschange`,M),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?un:ln,a=_.stencil?nn:Zt);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new vi(d.textureWidth,d.textureHeight,{format:cn,type:Kt,depthTexture:new Os(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new vi(f.framebufferWidth,f.framebufferHeight,{format:cn,type:Kt,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),I.setContext(r),I.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function M(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}let N=new G,P=new G;function F(e,t,n){N.setFromMatrixPosition(t.matrixWorld),P.setFromMatrixPosition(n.matrixWorld);let r=N.distanceTo(P),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function te(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),O.near=E.near=T.near=t,O.far=E.far=T.far=n,(k!==O.near||A!==O.far)&&(r.updateRenderState({depthNear:O.near,depthFar:O.far}),k=O.near,A=O.far),O.layers.mask=e.layers.mask|6,T.layers.mask=O.layers.mask&-5,E.layers.mask=O.layers.mask&-3;let i=e.parent,a=O.cameras;te(O,i);for(let e=0;e<a.length;e++)te(a[e],i);a.length===2?F(O,T,E):O.projectionMatrix.copy(T.projectionMatrix),w===null&&e.isPerspectiveCamera&&(w={camera:e,fov:e.fov,zoom:e.zoom}),ne(e,O,i)};function ne(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=kr*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(O)},this.getCameraTexture=function(e){return g[e]};let re=null;function ie(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==O.cameras.length&&(O.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=D[n];o===void 0&&(o=new mu,o.layers.enable(n),o.viewport=new gi,D[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(O.matrix.copy(o.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),i===!0&&O.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new As,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}re&&re(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let I=new Gu;I.setAnimationLoop(ie),this.setAnimationLoop=function(e){re=e},this.dispose=function(){}}},tm=new q,nm=new K;nm.set(-1,0,0,0,1,0,0,0,1);function rm(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,cl(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(tm.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(nm),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function im(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return H(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?V(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):V(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var am=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),om=null;function sm(){return om===null&&(om=new Ho(am,16,16,pn,$t),om.name=`DFG_LUT`,om.minFilter=Ut,om.magFilter=Ut,om.wrapS=Rt,om.wrapT=Rt,om.generateMipmaps=!1,om.needsUpdate=!0),om}var cm=class{constructor(e={}){let{canvas:t=vr(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=Kt}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([hn,mn,fn]),g=new Set([Kt,Zt,Yt,nn,en,tn]),_=new Uint32Array(4),v=new Int32Array(4),y=new G,b=null,x=null,S=[],C=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,E=!1,D=null,O=null,k=null,A=null;this._outputColorSpace=sr;let j=0,ee=0,M=null,N=-1,P=null,F=new gi,te=new gi,ne=null,re=new J(0),ie=0,I=t.width,ae=t.height,oe=1,se=null,ce=null,le=new gi(0,0,I,ae),ue=new gi(0,0,I,ae),de=!1,fe=new is,pe=!1,me=!1,he=new q,ge=new G,_e=new gi,ve={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},ye=!1;function be(){return M===null?oe:1}let L=n;function xe(e,n){return t.getContext(e,n)}let Se,Ce,R,we,z,B,Te,Ee,De,Oe,ke,Ae,je,Me,Ne,Pe,Fe,Ie,Le,Re,ze,Be,Ve;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r186`),t.addEventListener(`webglcontextlost`,We,!1),t.addEventListener(`webglcontextrestored`,Ge,!1),t.addEventListener(`webglcontextcreationerror`,Ke,!1),L===null){let t=`webgl2`;if(L=xe(t,e),L===null)throw xe(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}He()}catch(e){throw t.removeEventListener(`webglcontextlost`,We,!1),t.removeEventListener(`webglcontextrestored`,Ge,!1),t.removeEventListener(`webglcontextcreationerror`,Ke,!1),H(`WebGLRenderer: `+e.message),e}function He(){Se=new Td(L),Se.init(),ze=new Xp(L,Se),Ce=new ed(L,Se,e,ze),R=new Jp(L,Se),Ce.reversedDepthBuffer&&d&&R.buffers.depth.setReversed(!0),O=L.createFramebuffer(),k=L.createFramebuffer(),A=L.createFramebuffer(),we=new Od(L),z=new Op,B=new Yp(L,Se,R,z,Ce,ze,we),Te=new wd(T),Ee=new Ku(L),Be=new Qu(L,Ee),De=new Ed(L,Ee,we,Be),Oe=new Ad(L,De,Ee,Be,we),Ie=new kd(L,Ce,B),Ne=new td(z),ke=new Dp(T,Te,Se,Ce,Be,Ne),Ae=new rm(T,z),je=new Mp,Me=new zp(Se),Fe=new Zu(T,Te,R,Oe,p,s),Pe=new qp(T,Oe,Ce),Ve=new im(L,we,Ce,R),Le=new $u(L,Se,we),Re=new Dd(L,Se,we),we.programs=ke.programs,T.capabilities=Ce,T.extensions=Se,T.properties=z,T.renderLists=je,T.shadowMap=Pe,T.state=R,T.info=we}m!==1009&&(w=new Md(m,t.width,t.height,o,r,i));let Ue=new em(T,L);this.xr=Ue,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){let e=Se.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Se.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return oe},this.setPixelRatio=function(e){e!==void 0&&(oe=e,this.setSize(I,ae,!1))},this.getSize=function(e){return e.set(I,ae)},this.setSize=function(e,n,r=!0){if(Ue.isPresenting){V(`WebGLRenderer: Can't change size while VR device is presenting.`);return}I=e,ae=n,t.width=Math.floor(e*oe),t.height=Math.floor(n*oe),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,e,n)},this.getDrawingBufferSize=function(e){return e.set(I*oe,ae*oe).floor()},this.setDrawingBufferSize=function(e,n,r){I=e,ae=n,oe=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009){H(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);return}if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){V(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}w.setEffects(e||[])},this.getCurrentViewport=function(e){return e.copy(F)},this.getViewport=function(e){return e.copy(le)},this.setViewport=function(e,t,n,r){e.isVector4?le.set(e.x,e.y,e.z,e.w):le.set(e,t,n,r),R.viewport(F.copy(le).multiplyScalar(oe).round())},this.getScissor=function(e){return e.copy(ue)},this.setScissor=function(e,t,n,r){e.isVector4?ue.set(e.x,e.y,e.z,e.w):ue.set(e,t,n,r),R.scissor(te.copy(ue).multiplyScalar(oe).round())},this.getScissorTest=function(){return de},this.setScissorTest=function(e){R.setScissorTest(de=e)},this.setOpaqueSort=function(e){se=e},this.setTransparentSort=function(e){ce=e},this.getClearColor=function(e){return e.copy(Fe.getClearColor())},this.setClearColor=function(){Fe.setClearColor(...arguments)},this.getClearAlpha=function(){return Fe.getClearAlpha()},this.setClearAlpha=function(){Fe.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(M!==null){let t=M.texture.format;e=h.has(t)}if(e){let e=M.texture.type,t=g.has(e),n=Fe.getClearColor(),r=Fe.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,L.clearBufferuiv(L.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,L.clearBufferiv(L.COLOR,0,v))}else r|=L.COLOR_BUFFER_BIT}t&&(r|=L.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&L.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),D=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,We,!1),t.removeEventListener(`webglcontextrestored`,Ge,!1),t.removeEventListener(`webglcontextcreationerror`,Ke,!1),Fe.dispose(),je.dispose(),Me.dispose(),z.dispose(),Te.dispose(),Oe.dispose(),Be.dispose(),Ve.dispose(),ke.dispose(),Ue.dispose(),Ue.removeEventListener(`sessionstart`,$e),Ue.removeEventListener(`sessionend`,et),tt.stop()};function We(e){e.preventDefault(),br(`WebGLRenderer: Context Lost.`),E=!0}function Ge(){br(`WebGLRenderer: Context Restored.`),E=!1;let e=we.autoReset,t=Pe.enabled,n=Pe.autoUpdate,r=Pe.needsUpdate,i=Pe.type;He(),we.autoReset=e,Pe.enabled=t,Pe.autoUpdate=n,Pe.needsUpdate=r,Pe.type=i}function Ke(e){H(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function qe(e){let t=e.target;t.removeEventListener(`dispose`,qe),Je(t)}function Je(e){Ye(e),z.remove(e)}function Ye(e){let t=z.get(e).programs;t!==void 0&&(t.forEach(function(e){ke.releaseProgram(e)}),e.isShaderMaterial&&ke.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=ve);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=dt(e,t,n,r,i);R.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=De.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Be.setup(i,r,s,n,c);let h,g=Le;if(c!==null&&(h=Ee.get(c),g=Re,g.setIndex(h)),i.isMesh)r.wireframe===!0?(R.setLineWidth(r.wireframeLinewidth*be()),g.setMode(L.LINES)):g.setMode(L.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),R.setLineWidth(e*be()),i.isLineSegments?g.setMode(L.LINES):i.isLineLoop?g.setMode(L.LINE_LOOP):g.setMode(L.LINE_STRIP)}else i.isPoints?g.setMode(L.POINTS):i.isSprite&&g.setMode(L.TRIANGLES);if(i.isBatchedMesh){if(Se.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Ee.get(c).bytesPerElement:1,o=z.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(L,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function Xe(e,t,n,r){D!==null&&e.isNodeMaterial&&D.setObject(r,e),pe===!0&&Ne.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,st(e,t,r),e.side=0,e.needsUpdate=!0,st(e,t,r),e.side=2):st(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),D!==null&&D.renderStart(e,t,n),x=Me.get(n),x.init(t),C.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights(),D!==null&&D.updateLights(x.state.lightsArray),me=this.localClippingEnabled,pe=Ne.init(this.clippingPlanes,me),pe===!0&&Ne.setGlobalState(this.clippingPlanes,t),D!==null&&Pe.render(x.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];Xe(o,n,t,e),r.add(o)}else Xe(i,n,t,e),r.add(i)}}),x=C.pop(),D!==null&&D.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){if(r.forEach(function(e){let t=z.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0){t(e);return}setTimeout(n,10)}Se.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let Ze=null;function Qe(e){Ze&&Ze(e)}function $e(){tt.stop()}function et(){tt.start()}let tt=new Gu;tt.setAnimationLoop(Qe),typeof self<`u`&&tt.setContext(self),this.setAnimationLoop=function(e){Ze=e,Ue.setAnimationLoop(e),e===null?tt.stop():tt.start()},Ue.addEventListener(`sessionstart`,$e),Ue.addEventListener(`sessionend`,et),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){H(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(E===!0)return;D!==null&&D.renderStart(e,t);let n=Ue.enabled===!0&&Ue.isPresenting===!0,r=w!==null&&(M===null||n)&&w.begin(T,M);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),Ue.enabled===!0&&Ue.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Ue.cameraAutoUpdate===!0&&Ue.updateCamera(t),t=Ue.getCamera()),e.isScene===!0&&e.onBeforeRender(T,e,t,M),x=Me.get(e,C.length),x.init(t),x.state.textureUnits=B.getTextureUnits(),C.push(x),he.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),fe.setFromProjectionMatrix(he,mr,t.reversedDepth),me=this.localClippingEnabled,pe=Ne.init(this.clippingPlanes,me),b=je.get(e,S.length),b.init(),S.push(b),Ue.enabled===!0&&Ue.isPresenting===!0){let e=T.xr.getDepthSensingMesh();e!==null&&nt(e,t,-1/0,T.sortObjects)}nt(e,t,0,T.sortObjects),b.finish(),D!==null&&D.updateLights(x.state.lightsArray),T.sortObjects===!0&&b.sort(se,ce),ye=Ue.enabled===!1||Ue.isPresenting===!1||Ue.hasDepthSensing()===!1,ye&&Fe.addToRenderList(b,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),pe===!0&&Ne.beginShadows();let i=x.state.shadowsArray;if(Pe.render(i,e,t),pe===!0&&Ne.endShadows(),(r&&w.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];it(n,r,e,a)}ye&&Fe.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];rt(b,e,n,n.viewport)}}else r.length>0&&it(n,r,e,t),ye&&Fe.render(e),rt(b,e,t)}M!==null&&ee===0&&(B.updateMultisampleRenderTarget(M),B.updateRenderTargetMipmap(M)),r&&w.end(T),e.isScene===!0&&e.onAfterRender(T,e,t),Be.resetDefaultState(),N=-1,P=null,C.pop(),C.length>0?(x=C[C.length-1],B.setTextureUnits(x.state.textureUnits),pe===!0&&Ne.setGlobalState(T.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,D!==null&&D.renderEnd()};function nt(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)x.pushLightProbeGrid(e);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||e.intersectsFrustum(fe)){r&&_e.setFromMatrixPosition(e.matrixWorld).applyMatrix4(he);let i=Oe.update(e),a=e.material;a.visible&&b.push(e,i,a,n,_e.z,null,t)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||e.intersectsFrustum(fe))){let i=Oe.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),_e.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),_e.copy(e.boundingSphere.center)),_e.applyMatrix4(e.matrixWorld).applyMatrix4(he)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&b.push(e,i,c,n,_e.z,s,t)}}else a.visible&&b.push(e,i,a,n,_e.z,null,t)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)nt(i[e],t,n,r)}function rt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),pe===!0&&Ne.setGlobalState(T.clippingPlanes,n),r&&R.viewport(F.copy(r)),i.length>0&&at(i,t,n),a.length>0&&at(a,t,n),o.length>0&&at(o,t,n),R.buffers.depth.setTest(!0),R.buffers.depth.setMask(!0),R.buffers.color.setMask(!0),R.setPolygonOffset(!1)}function it(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=Se.has(`EXT_color_buffer_half_float`)||Se.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new vi(1,1,{generateMipmaps:!0,type:e?$t:Kt,minFilter:Gt,samples:Math.max(4,Ce.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ai.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||F;a.setSize(o.z*T.transmissionResolutionScale,o.w*T.transmissionResolutionScale);let s=T.getRenderTarget(),c=T.getActiveCubeFace(),l=T.getActiveMipmapLevel();T.setRenderTarget(a),T.getClearColor(re),ie=T.getClearAlpha(),ie<1&&T.setClearColor(16777215,.5),T.clear(),ye&&Fe.render(n);let u=T.toneMapping;T.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),pe===!0&&Ne.setGlobalState(T.clippingPlanes,r),at(e,n,r),B.updateMultisampleRenderTarget(a),B.updateRenderTargetMipmap(a),Se.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,ot(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(B.updateMultisampleRenderTarget(a),B.updateRenderTargetMipmap(a))}T.setRenderTarget(s,c,l),T.setClearColor(re,ie),d!==void 0&&(r.viewport=d),T.toneMapping=u}function at(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&ot(o,t,n,s,l,c)}}function ot(e,t,n,r,i,a){D!==null&&i.isNodeMaterial&&D.setObject(e,i),e.onBeforeRender(T,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(T,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=2):T.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(T,t,n,r,i,a)}function st(e,t,n){t.isScene!==!0&&(t=ve);let r=z.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=ke.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=ke.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Te.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,qe),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return lt(e,s),d}else s.uniforms=ke.getUniforms(e),D!==null&&e.isNodeMaterial&&D.build(e,n,s),e.onBeforeCompile(s,T),d=ke.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Ne.uniform),lt(e,s),r.needsLights=pt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=x.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function ct(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Bf.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function lt(e,t){let n=z.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function ut(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];y.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(y))return n}return null}function dt(e,t,n,r,i){t.isScene!==!0&&(t=ve),B.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=M===null?T.outputColorSpace:M.isXRRenderTarget===!0?M.texture.colorSpace:ai.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Te.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(M===null||M.isXRRenderTarget===!0)&&(h=T.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=z.get(r),y=x.state.lights;if(pe===!0&&(me===!0||e!==P)){let t=e===P&&r.id===N;Ne.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Ne.numPlanes||v.numIntersection!==Ne.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=x.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let S=v.currentProgram;b===!0&&(S=st(r,t,i),D&&r.isNodeMaterial&&D.onUpdateProgram(r,S,v));let C=!1,w=!1,E=!1,O=S.getUniforms(),k=v.uniforms;if(R.useProgram(S.program)&&(C=!0,w=!0,E=!0),r.id!==N&&(N=r.id,w=!0),v.needsLights){let e=ut(x.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,w=!0)}if(C||P!==e){R.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),O.setValue(L,`projectionMatrix`,e.projectionMatrix),O.setValue(L,`viewMatrix`,e.matrixWorldInverse);let t=O.map.cameraPosition;t!==void 0&&t.setValue(L,ge.setFromMatrixPosition(e.matrixWorld)),Ce.logarithmicDepthBuffer&&O.setValue(L,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&O.setValue(L,`isOrthographic`,e.isOrthographicCamera===!0),P!==e&&(P=e,w=!0,E=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&O.setValue(L,`sunShadowMap`,y.state.sunShadowMap,B),y.state.directionalShadowMap.length>0&&O.setValue(L,`directionalShadowMap`,y.state.directionalShadowMap,B),y.state.spotShadowMap.length>0&&O.setValue(L,`spotShadowMap`,y.state.spotShadowMap,B),y.state.pointShadowMap.length>0&&O.setValue(L,`pointShadowMap`,y.state.pointShadowMap,B)),i.isSkinnedMesh){O.setOptional(L,i,`bindMatrix`),O.setOptional(L,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),O.setValue(L,`boneTexture`,e.boneTexture,B))}i.isBatchedMesh&&(O.setOptional(L,i,`batchingTexture`),O.setValue(L,`batchingTexture`,i._matricesTexture,B),O.setOptional(L,i,`batchingIdTexture`),O.setValue(L,`batchingIdTexture`,i._indirectTexture,B),O.setOptional(L,i,`batchingColorTexture`),i._colorsTexture!==null&&O.setValue(L,`batchingColorTexture`,i._colorsTexture,B));let A=n.morphAttributes;if((A.position!==void 0||A.normal!==void 0||A.color!==void 0)&&Ie.update(i,n,S),(w||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,O.setValue(L,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(k.envMapIntensity.value=t.environmentIntensity),k.dfgLUT!==void 0&&(k.dfgLUT.value=sm()),w){if(O.setValue(L,`toneMappingExposure`,T.toneMappingExposure),v.needsLights&&ft(k,E),a&&r.fog===!0&&Ae.refreshFogUniforms(k,a),Ae.refreshMaterialUniforms(k,r,oe,ae,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;k.probesSH.value=e.texture,k.probesMin.value.copy(e.boundingBox.min),k.probesMax.value.copy(e.boundingBox.max),k.probesResolution.value.copy(e.resolution)}Bf.upload(L,ct(v),k,B)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Bf.upload(L,ct(v),k,B),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&O.setValue(L,`center`,i.center),O.setValue(L,`modelViewMatrix`,i.modelViewMatrix),O.setValue(L,`normalMatrix`,i.normalMatrix),O.setValue(L,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];Ve.update(n,S),Ve.bind(n,S)}}return S}function ft(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function pt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return j},this.getActiveMipmapLevel=function(){return ee},this.getRenderTarget=function(){return M},this.setRenderTargetTextures=function(e,t,n){let r=z.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),z.get(e.texture).__webglTexture=t,z.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=z.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){M=e,j=t,ee=n;let r=null,i=!1,a=!1;if(e){let o=z.get(e);if(o.__useDefaultFramebuffer!==void 0){R.bindFramebuffer(L.FRAMEBUFFER,o.__webglFramebuffer),F.copy(e.viewport),te.copy(e.scissor),ne=e.scissorTest,R.viewport(F),R.scissor(te),R.setScissorTest(ne),N=-1;return}if(o.__webglFramebuffer===void 0)B.setupRenderTarget(e);else if(o.__hasExternalTextures)B.rebindTextures(e,z.get(e.texture).__webglTexture,z.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&z.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);B.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=z.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&B.useMultisampledRTT(e)===!1?z.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,F.copy(e.viewport),te.copy(e.scissor),ne=e.scissorTest}else F.copy(le).multiplyScalar(oe).floor(),te.copy(ue).multiplyScalar(oe).floor(),ne=de;if(n!==0&&(r=O),R.bindFramebuffer(L.FRAMEBUFFER,r)&&R.drawBuffers(e,r),R.viewport(F),R.scissor(te),R.setScissorTest(ne),i){let r=z.get(e.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=z.get(e.textures[t]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=z.get(e.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,t.__webglTexture,n)}N=-1};function mt(e){let t=z.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Ce.textureFormatReadable(e.format),t.__typeReadable=Ce.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){H(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=z.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){R.bindFramebuffer(L.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+s);let u=mt(o);if(u.__formatReadable===!1){H(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){H(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&L.readPixels(t,n,r,i,ze.convert(c),ze.convert(l),a)}finally{let e=M===null?null:z.get(M).__webglFramebuffer;R.bindFramebuffer(L.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=z.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){R.bindFramebuffer(L.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+s);let d=mt(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,f),L.bufferData(L.PIXEL_PACK_BUFFER,a.byteLength,L.STREAM_READ),L.readPixels(t,n,r,i,ze.convert(l),ze.convert(u),0),L.bindBuffer(L.PIXEL_PACK_BUFFER,null);let p=M===null?null:z.get(M).__webglFramebuffer;R.bindFramebuffer(L.FRAMEBUFFER,p);let m=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await Cr(L,m,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,f),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,a),L.bindBuffer(L.PIXEL_PACK_BUFFER,null),L.deleteBuffer(f),L.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;B.setTexture2D(e,0),L.copyTexSubImage2D(L.TEXTURE_2D,n,0,0,o,s,i,a),R.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=ze.convert(t.format),_=ze.convert(t.type),v;t.isData3DTexture?(B.setTexture3D(t,0),v=L.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(B.setTexture2DArray(t,0),v=L.TEXTURE_2D_ARRAY):(B.setTexture2D(t,0),v=L.TEXTURE_2D),R.activeTexture(L.TEXTURE0),R.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,t.flipY),R.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),R.pixelStorei(L.UNPACK_ALIGNMENT,t.unpackAlignment);let y=R.getParameter(L.UNPACK_ROW_LENGTH),b=R.getParameter(L.UNPACK_IMAGE_HEIGHT),x=R.getParameter(L.UNPACK_SKIP_PIXELS),S=R.getParameter(L.UNPACK_SKIP_ROWS),C=R.getParameter(L.UNPACK_SKIP_IMAGES);R.pixelStorei(L.UNPACK_ROW_LENGTH,h.width),R.pixelStorei(L.UNPACK_IMAGE_HEIGHT,h.height),R.pixelStorei(L.UNPACK_SKIP_PIXELS,l),R.pixelStorei(L.UNPACK_SKIP_ROWS,u),R.pixelStorei(L.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=z.get(e),r=z.get(t),h=z.get(n.__renderTarget),g=z.get(r.__renderTarget);R.bindFramebuffer(L.READ_FRAMEBUFFER,h.__webglFramebuffer),R.bindFramebuffer(L.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,z.get(e).__webglTexture,i,d+n),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,z.get(t).__webglTexture,a,m+n)),L.blitFramebuffer(l,u,o,s,f,p,o,s,L.DEPTH_BUFFER_BIT,L.NEAREST);R.bindFramebuffer(L.READ_FRAMEBUFFER,null),R.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||z.has(e)){let n=z.get(e),r=z.get(t);R.bindFramebuffer(L.READ_FRAMEBUFFER,k),R.bindFramebuffer(L.DRAW_FRAMEBUFFER,A);for(let e=0;e<c;e++)w?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,n.__webglTexture,i),T?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,r.__webglTexture,a),i===0?T?L.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):L.copyTexSubImage2D(v,a,f,p,l,u,o,s):L.blitFramebuffer(l,u,o,s,f,p,o,s,L.COLOR_BUFFER_BIT,L.NEAREST);R.bindFramebuffer(L.READ_FRAMEBUFFER,null),R.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?L.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?L.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):L.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):L.texSubImage2D(L.TEXTURE_2D,a,f,p,o,s,g,_,h);R.pixelStorei(L.UNPACK_ROW_LENGTH,y),R.pixelStorei(L.UNPACK_IMAGE_HEIGHT,b),R.pixelStorei(L.UNPACK_SKIP_PIXELS,x),R.pixelStorei(L.UNPACK_SKIP_ROWS,S),R.pixelStorei(L.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&L.generateMipmap(v),R.unbindTexture()},this.initRenderTarget=function(e){z.get(e).__webglFramebuffer===void 0&&B.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?B.setTextureCube(e,0):e.isData3DTexture?B.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?B.setTexture2DArray(e,0):B.setTexture2D(e,0),R.unbindTexture()},this.resetState=function(){j=0,ee=0,M=null,R.reset(),Be.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return mr}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=ai._getDrawingBufferColorSpace(e),t.unpackColorSpace=ai._getUnpackColorSpace()}},lm={fov:110,distance:270,height:100,angle:-3,stiffness:.5,swivelSpeed:10,transitionSpeed:1.5,invertSwivel:!0,shake:!1,ballCamMode:`toggle`},um=new G(0,0,1),dm=Math.PI/180,fm=e=>new G(e.x,e.y,e.z),pm=.15,mm=-55*dm,hm=80*dm,gm=.3,_m=-.62,vm=30*dm,ym=70*dm,bm=22,xm=14.1,Sm=1.9,Cm=.0021,wm=2300,Tm=3.5,Em=class{settings;camera;ballCam=!0;heading=new G(0,1,0);aimFwd=new G(0,1,0);aimUp=new G(0,0,1);surfaceAlign=0;ballCamBlend=1;switchBoost=0;orbit=0;viewPitch=0;speed=0;prevSpeed=0;accel=0;swivelYaw=0;swivelPitch=0;initialized=!1;shakeAmount=0;shakeTime=0;lastPos=new G;fovExtra=0;constructor(e,t){this.camera=e,this.settings=t}reset(){this.initialized=!1}addShake(e){this.settings.shake&&(this.shakeAmount=Math.min(1,this.shakeAmount+e))}vfov(e){let t=(this.settings.fov+this.fovExtra)*dm,n=Math.min(e,16/9);return 2*Math.atan(Math.tan(t/2)/n)}updateProjection(e){e>0&&Number.isFinite(e)&&(this.camera.fov=this.vfov(e)/dm,this.camera.aspect=e,this.camera.updateProjectionMatrix())}update(e,t,n,r){let i=this.settings,a=fm(t.pos),o=fm(t.forward),s=fm(t.up),c=new G().crossVectors(o,s).normalize();if(this.initialized&&this.lastPos.distanceToSquared(a)>36e4&&(this.initialized=!1),this.lastPos.copy(a),!this.initialized){let e=o.clone().setZ(0);e.lengthSq()<1e-4&&e.set(0,1,0),this.heading.copy(e.normalize()),this.aimFwd.copy(this.heading),this.aimUp.copy(um),this.surfaceAlign=0,this.ballCamBlend=+!!this.ballCam,this.orbit=0,this.viewPitch=0,this.speed=this.prevSpeed=fm(t.vel).length(),this.initialized=!0}let l=!t.isOnGround&&fm(t.angVel).length()>Tm;this.trackHeading(e,o,s,c,fm(t.vel),l);let u=t.isOnGround&&s.z<.8;this.surfaceAlign+=(+!!u-this.surfaceAlign)*(1-Math.exp(-(u?5:3)*e));let d=this.heading.clone(),f=um.clone();if(this.surfaceAlign>.001){let e=o.clone();d=Dm(d,e,this.surfaceAlign),f=Dm(f,s,this.surfaceAlign)}let p=null,m=0,h=0;if(n){let e=fm(n).sub(a),t=e.clone().setZ(0);if(h=t.length(),m=Zr.clamp(Math.atan2(e.z,Math.max(h,1)),mm,hm),h>1){t.divideScalar(h);let e=Math.min(1,h/150);p=Dm(this.heading,t,e)}else p=this.heading.clone()}let g=this.ballCam&&p!==null,_=e/(.28/Math.max(.5,i.transitionSpeed)),v=this.ballCamBlend;this.ballCamBlend=Zr.clamp(this.ballCamBlend+(g?_:-_),0,1),this.switchBoost=this.ballCamBlend===v?Math.max(0,this.switchBoost-e):.3;let y=this.ballCamBlend*this.ballCamBlend*(3-2*this.ballCamBlend),b=p?Dm(d,p,y):d,x=Dm(f,um,y),S=12+12*i.stiffness,C=S+(14*Zr.clamp(h/700,.35,1)-S)*y,w=(720+-270*y)*dm;this.switchBoost>0&&(C=Math.max(C,45),w=1400*dm),Om(this.aimFwd,b,C,w,e),Om(this.aimUp,x,6,360*dm,e),this.aimFwd.normalize();let T=new G().crossVectors(this.aimFwd,this.aimUp).normalize();this.aimUp.crossVectors(T,this.aimFwd).normalize();let E=fm(t.vel).length();this.speed+=(E-this.speed)*(1-Math.exp(-2.5*e));let D=e>0?(this.speed-this.prevSpeed)/e:0;this.prevSpeed=this.speed,this.fovExtra=Cm*Math.min(this.speed,wm),this.accel+=(D-this.accel)*(1-Math.exp(-4*e));let O=1-i.stiffness,k=Zr.clamp(O*this.accel*12e-5,-.08,.15),A=1+.25*O*Math.min(this.speed/2200,1)+k,j=i.invertSwivel?-1:1,ee=-r.lookX*Math.PI*j,M=-r.lookY*.8*j;r.rearView&&(ee=Math.PI,M=0);let N=i.swivelSpeed*2.2;this.swivelYaw+=(ee-this.swivelYaw)*(1-Math.exp(-N*e)),this.swivelPitch+=(M-this.swivelPitch)*(1-Math.exp(-N*e));let P=this.aimFwd.clone(),F=this.aimUp.clone();Math.abs(this.swivelYaw)>1e-4&&P.applyAxisAngle(F,this.swivelYaw);let te=new G().crossVectors(P,F).normalize(),ne=pm*m*y;this.viewPitch+=(ne-this.viewPitch)*(1-Math.exp(-8*e));let re=i.distance*A,ie=0;if(n&&y>.001){let e=(t.isOnGround&&s.z>.7?vm:ym)*y;ie=this.solveOrbit(a,fm(n),P,F,te,re,e,0)}this.orbit+=(ie-this.orbit)*(1-Math.exp(-6*e));let I=this.boomPose(a,P,F,te,re,this.orbit+this.swivelPitch,this.viewPitch);if(I.pos.z<bm&&(I.pos.z=bm),this.shakeAmount>.001){this.shakeTime+=e;let t=this.shakeAmount*this.shakeAmount*10;I.pos.x+=Math.sin(this.shakeTime*71)*t,I.pos.y+=Math.sin(this.shakeTime*53+1)*t,I.pos.z+=Math.sin(this.shakeTime*61+2)*t,this.shakeAmount*=Math.exp(-5*e)}this.camera.position.copy(I.pos),this.camera.up.copy(I.up),this.camera.lookAt(I.pos.clone().add(I.dir))}trackHeading(e,t,n,r,i,a){let o=null;if(n.z>.1&&!a){let e=t.clone().setZ(0),n=new G().crossVectors(um,r).setZ(0),i=e.length(),a=n.length();(i>.25||a>.25)&&(i>.25&&e.divideScalar(i),a>.25&&n.divideScalar(a),o=i<=.25?n:a<=.25||e.dot(this.heading)>=n.dot(this.heading)?e:n)}else{let t=i.clone().setZ(0);t.lengthSq()>9e4&&(t.normalize(),this.heading.copy(Dm(this.heading,t,1-Math.exp(-e/.4))))}o&&this.heading.copy(o),this.heading.setZ(0).normalize(),this.heading.lengthSq()<.5&&this.heading.set(0,1,0)}boomPose(e,t,n,r,i,a,o){let s=t.clone().applyAxisAngle(r,a),c=n.clone().applyAxisAngle(r,a),l=this.settings,u=i,d=l.height+xm;u-=Sm;let f=e.clone().addScaledVector(s,-u).addScaledVector(c,d);if(f.z<bm&&s.z>.01){let t=(e.z+c.z*d-bm)/s.z;u=Math.max(60,Math.min(u,t)),f=e.clone().addScaledVector(s,-u).addScaledVector(c,d)}let p=s.clone().applyAxisAngle(r,o+l.angle*dm),m=c.clone().applyAxisAngle(r,o+l.angle*dm);return{pos:f,dir:p,up:m}}solveOrbit(e,t,n,r,i,a,o,s){let c=Math.tan(this.vfov(this.camera.aspect||16/9)/2),l=o=>{let s=this.boomPose(e,n,r,i,a,o,this.viewPitch),l=t.clone().sub(s.pos),u=l.dot(s.dir);return u<1?2:l.dot(s.up)/(u*c)},u=l(0);if(u>gm){if(o<=0||l(o)>gm)return Math.max(0,o);let e=0,t=o;for(let n=0;n<12;n++){let n=(e+t)/2;l(n)>gm?e=n:t=n}return t}if(u<_m&&s<0){if(l(s)<_m)return s;let e=s,t=0;for(let n=0;n<12;n++){let n=(e+t)/2;l(n)<_m?t=n:e=n}return e}return 0}};function Dm(e,t,n){let r=Zr.clamp(e.dot(t),-1,1),i=Math.acos(r);if(i<1e-5)return t.clone();let a=new G().crossVectors(e,t);if(r<-.999){let t=new G(0,0,1).addScaledVector(e,-e.z);t.lengthSq()<1e-6&&t.set(1,0,0),a.dot(t)<0&&t.negate(),a=t}else if(a.lengthSq()<1e-14)return t.clone();return a.normalize(),e.clone().applyAxisAngle(a,i*n)}function Om(e,t,n,r,i){let a=Math.acos(Zr.clamp(e.dot(t),-1,1));if(a<1e-6){e.copy(t);return}let o=Math.min(a*(1-Math.exp(-n*i)),r*i);e.copy(Dm(e,t,o/a))}var km=class{camera;constructor(e){this.camera=e}pos=new G(0,-3e3,1200);target=new G;update(t,n,r){let i=fm(n),a=new G;if(r){let e=fm(r),t=i.clone().sub(e);t.z=0,t.lengthSq()<1&&t.set(0,1,0),t.normalize(),a.copy(e).addScaledVector(t,-700).add(new G(0,0,350))}else a.copy(i).add(new G(0,i.y>0?-1200:1200,500));let o=new e(a.x,a.y,a.z),s=et(o.x,o.y,o.z);s<60&&o.addScaled(nt(o,new e),60-s),a.set(o.x,o.y,o.z),this.pos.lerp(a,1-Math.exp(-2.5*t)),this.target.lerp(i,1-Math.exp(-6*t)),this.camera.position.copy(this.pos),this.camera.up.copy(um),this.camera.lookAt(this.target)}snap(e){this.target.copy(fm(e))}},Am={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},jm=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},Mm=new yu(-1,1,1,-1,0,1),Nm=new class extends to{constructor(){super(),this.setAttribute(`position`,new Y([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new Y([0,2,0,0,2,0],2))}},Pm=class{constructor(e){this._mesh=new X(Nm,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Mm)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},Fm=class extends jm{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof fl?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=ll.clone(e.uniforms),this.material=new fl({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Pm(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},Im=class extends jm{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},Lm=class extends jm{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},Rm=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new W);this._width=n.width,this._height=n.height,t=new vi(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:$t}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Fm(Am),this.copyPass.material.blending=0,this.timer=new ku}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}Im!==void 0&&(r instanceof Im?n=!0:r instanceof Lm&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new W);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},zm=class extends jm{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new J}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},Bm={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new J(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`},Vm=class e extends jm{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new W(256,256):new W(e.x,e.y),this.clearColor=new J(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new vi(i,a,{type:$t,depthBuffer:!1}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new vi(i,a,{type:$t,depthBuffer:!1});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new vi(i,a,{type:$t,depthBuffer:!1});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),a=Math.round(a/2)}let o=Bm;this.highPassUniforms=ll.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new fl({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let s=[6,10,14,18,22];i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new W(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new G(1,1,1),new G(1,1,1),new G(1,1,1),new G(1,1,1),new G(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=ll.clone(Am.uniforms),this.blendMaterial=new fl({uniforms:this.copyUniforms,vertexShader:Am.vertexShader,fragmentShader:Am.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new J,this._oldClearAlpha=1,this._basic=new _o,this._fsQuad=new Pm(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new W(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);let r=[],i=[];for(let n=1;n<e;n+=2){let a=t[n],o=n+1<e?t[n+1]:0,s=a+o;r.push((n*a+(n+1)*o)/s),i.push(s)}return new fl({defines:{KERNEL_PAIRS:r.length},uniforms:{colorTexture:{value:null},invSize:{value:new W(.5,.5)},direction:{value:new W(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:r},gaussianWeights:{value:i}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new fl({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};Vm.BlurDirectionX=new W(1,0),Vm.BlurDirectionY=new W(0,1);var Hm={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},Um=class extends jm{constructor(){super(),this.isOutputPass=!0,this.uniforms=ll.clone(Hm.uniforms),this.material=new pl({name:Hm.name,uniforms:this.uniforms,vertexShader:Hm.vertexShader,fragmentShader:Hm.fragmentShader}),this._fsQuad=new Pm(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},ai.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},Wm={name:`GTAOShader`,defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:`x`,SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new W},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new q},cameraProjectionMatrixInverse:{value:new q},cameraWorldMatrix:{value:new q},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new G(-1,-1,-1)},sceneBoxMax:{value:new G(1,1,1)}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		varying vec2 vUv;
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform mat4 cameraWorldMatrix;
		uniform float radius;
		uniform float distanceExponent;
		uniform float thickness;
		uniform float distanceFallOff;
		uniform float scale;
		#if SCENE_CLIP_BOX == 1
			uniform vec3 sceneBoxMin;
			uniform vec3 sceneBoxMax;
		#endif

		#include <common>
		#include <packing>

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
		#endif

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
			return textureLod(tDepth, uv.xy, 0.0).DEPTH_SWIZZLING;
		}

		float fetchDepth(const ivec2 uv) {
			return texelFetch(tDepth, uv.xy, 0).DEPTH_SWIZZLING;
		}

		float getViewZ(const in float depth) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
			#else
				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
			#if NORMAL_VECTOR_TYPE == 2
				return normalize(textureLod(tNormal, uv, 0.).rgb);
			#elif NORMAL_VECTOR_TYPE == 1
				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
			#else
				return computeNormalFromDepth(uv);
			#endif
		}

		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {
			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
			float sampleSceneDepth = getDepth(sampleUv);
			return vec3(sampleUv, sampleSceneDepth);
		}

		void main() {
			float depth = getDepth(vUv.xy);

			#ifdef USE_REVERSED_DEPTH_BUFFER
				if (depth <= 0.0) {
					discard;
					return;
				}
			#else
				if (depth >= 1.0) {
					discard;
					return;
				}
			#endif
			
			vec3 viewPos = getViewPosition(vUv, depth);
			vec3 viewNormal = getViewNormal(vUv);

			float radiusToUse = radius;
			float distanceFalloffToUse = thickness;
			#if SCREEN_SPACE_RADIUS == 1
				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;
				radiusToUse *= radiusScale;
				distanceFalloffToUse *= radiusScale;
			#endif

			#if SCENE_CLIP_BOX == 1
				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;
				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));
				if (boxDistance > radiusToUse) {
					discard;
					return;
				}
			#endif

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
			vec3 tangent = normalize(vec3(randomVec.xy, 0.));
			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);
			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));

			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;
			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;
			float ao = 0.0;
			for (int i = 0; i < DIRECTIONS; ++i) {

				float angle = float(i) / float(DIRECTIONS) * PI;
				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w);
				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

				vec3 viewDir = normalize(-viewPos.xyz);
				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));
				vec3 sliceTangent = cross(sliceBitangent, viewDir);
				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));

				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);
				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));

				for (int j = 0; j < STEPS; ++j) {
					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);

					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);
					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					vec3 viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));
					}

					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);
					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));
					}
				}

				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);
				float nx = dot(normalInSlice, sliceTangent);
				float ny = dot(normalInSlice, viewDir);
				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);
				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);
				float occlusion = nx * nxb + ny * nyb;
				ao += occlusion;
			}

			ao = clamp(ao / float(DIRECTIONS), 0., 1.);
		#if SCENE_CLIP_BOX == 1
			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));
		#endif
			ao = pow(ao, scale);

			gl_FragColor = FRAGMENT_OUTPUT;
		}`},Gm={name:`GTAODepthShader`,defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform sampler2D tDepth;
		uniform float cameraNear;
		uniform float cameraFar;
		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {
			#if PERSPECTIVE_CAMERA == 1
				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			#else
				return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		void main() {
			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},Km={name:`GTAOBlendShader`,uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform float intensity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);
		}`};function qm(e=5){let t=Math.floor(e)%2==0?Math.floor(e)+1:Math.floor(e),n=Jm(t),r=n.length,i=new Uint8Array(r*4);for(let e=0;e<r;++e){let t=n[e],a=2*Math.PI*t/r,o=new G(Math.cos(a),Math.sin(a),0).normalize();i[e*4]=(o.x*.5+.5)*255,i[e*4+1]=(o.y*.5+.5)*255,i[e*4+2]=127,i[e*4+3]=255}let a=new Ho(i,t,t);return a.wrapS=Lt,a.wrapT=Lt,a.needsUpdate=!0,a}function Jm(e){let t=Math.floor(e)%2==0?Math.floor(e)+1:Math.floor(e),n=t*t,r=Array(n).fill(0),i=Math.floor(t/2),a=t-1;for(let e=1;e<=n;){if(i===-1&&a===t?(a=t-2,i=0):(a===t&&(a=0),i<0&&(i=t-1)),r[i*t+a]!==0){a-=2,i++;continue}r[i*t+a]=e++,a++,i--}return r}var Ym={name:`PoissonDenoiseShader`,defines:{SAMPLES:16,SAMPLE_VECTORS:Xm(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new W},cameraProjectionMatrixInverse:{value:new q},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tDiffuse;
		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform float lumaPhi;
		uniform float depthPhi;
		uniform float normalPhi;
		uniform float radius;
		uniform int index;

		#include <common>
		#include <packing>

		#ifndef SAMPLE_LUMINANCE
		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
		#endif

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(denoised, 1.)
		#endif

		float getLuminance(const in vec3 a) {
			return SAMPLE_LUMINANCE;
		}

		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
		#if DEPTH_VALUE_SOURCE == 1
			return textureLod(tDepth, uv.xy, 0.0).a;
		#else
			return textureLod(tDepth, uv.xy, 0.0).r;
		#endif
		}

		float fetchDepth(const ivec2 uv) {
			#if DEPTH_VALUE_SOURCE == 1
				return texelFetch(tDepth, uv.xy, 0).a;
			#else
				return texelFetch(tDepth, uv.xy, 0).r;
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
		#if NORMAL_VECTOR_TYPE == 2
			return normalize(textureLod(tNormal, uv, 0.).rgb);
		#elif NORMAL_VECTOR_TYPE == 1
			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
		#else
			return computeNormalFromDepth(uv);
		#endif
		}

		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
			float sampleDepth = getDepth(sampleUv);
			vec3 sampleNormal = getViewNormal(sampleUv);
			vec3 neighborColor = sampleTexel.rgb;
			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);

			float normalDiff = dot(viewNormal, sampleNormal);
			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
			float w = lumaSimilarity * depthSimilarity * normalSimilarity;

			denoised += w * neighborColor;
			totalWeight += w;
		}

		void main() {
			float depth = getDepth(vUv.xy);
			vec3 viewNormal = getViewNormal(vUv);
			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
				discard;
				return;
			}
			vec4 texel = textureLod(tDiffuse, vUv, 0.0);
			vec3 center = texel.rgb;
			vec3 viewPos = getViewPosition(vUv, depth);

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);

			float totalWeight = 1.0;
			vec3 denoised = texel.rgb;
			for (int i = 0; i < SAMPLES; i++) {
				vec3 sampleDir = poissonDisk[i];
				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
				vec2 sampleUv = vUv + offset;
				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
			}

			if (totalWeight > 0.) {
				denoised /= totalWeight;
			}
			gl_FragColor = FRAGMENT_OUTPUT;
		}`};function Xm(e,t,n){let r=Zm(e,t,n),i=`vec3[SAMPLES](`;for(let t=0;t<e;t++){let n=r[t];i+=`vec3(${n.x}, ${n.y}, ${n.z})${t<e-1?`,`:`)`}`}return i}function Zm(e,t,n){let r=[];for(let i=0;i<e;i++){let a=2*Math.PI*t*i/e,o=(i/(e-1))**n;r.push(new G(Math.cos(a),Math.sin(a),o))}return r}var Qm=class{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[e&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(e,t){let n,r,i,a=.5*(Math.sqrt(3)-1),o=(e+t)*a,s=Math.floor(e+o),c=Math.floor(t+o),l=(3-Math.sqrt(3))/6,u=(s+c)*l,d=s-u,f=c-u,p=e-d,m=t-f,h,g;p>m?(h=1,g=0):(h=0,g=1);let _=p-h+l,v=m-g+l,y=p-1+2*l,b=m-1+2*l,x=s&255,S=c&255,C=this.perm[x+this.perm[S]]%12,w=this.perm[x+h+this.perm[S+g]]%12,T=this.perm[x+1+this.perm[S+1]]%12,E=.5-p*p-m*m;E<0?n=0:(E*=E,n=E*E*this._dot(this.grad3[C],p,m));let D=.5-_*_-v*v;D<0?r=0:(D*=D,r=D*D*this._dot(this.grad3[w],_,v));let O=.5-y*y-b*b;return O<0?i=0:(O*=O,i=O*O*this._dot(this.grad3[T],y,b)),70*(n+r+i)}noise3d(e,t,n){let r,i,a,o,s=(e+t+n)*(1/3),c=Math.floor(e+s),l=Math.floor(t+s),u=Math.floor(n+s),d=1/6,f=(c+l+u)*d,p=c-f,m=l-f,h=u-f,g=e-p,_=t-m,v=n-h,y,b,x,S,C,w;g>=_?_>=v?(y=1,b=0,x=0,S=1,C=1,w=0):g>=v?(y=1,b=0,x=0,S=1,C=0,w=1):(y=0,b=0,x=1,S=1,C=0,w=1):_<v?(y=0,b=0,x=1,S=0,C=1,w=1):g<v?(y=0,b=1,x=0,S=0,C=1,w=1):(y=0,b=1,x=0,S=1,C=1,w=0);let T=g-y+d,E=_-b+d,D=v-x+d,O=g-S+2*d,k=_-C+2*d,A=v-w+2*d,j=g-1+3*d,ee=_-1+3*d,M=v-1+3*d,N=c&255,P=l&255,F=u&255,te=this.perm[N+this.perm[P+this.perm[F]]]%12,ne=this.perm[N+y+this.perm[P+b+this.perm[F+x]]]%12,re=this.perm[N+S+this.perm[P+C+this.perm[F+w]]]%12,ie=this.perm[N+1+this.perm[P+1+this.perm[F+1]]]%12,I=.6-g*g-_*_-v*v;I<0?r=0:(I*=I,r=I*I*this._dot3(this.grad3[te],g,_,v));let ae=.6-T*T-E*E-D*D;ae<0?i=0:(ae*=ae,i=ae*ae*this._dot3(this.grad3[ne],T,E,D));let oe=.6-O*O-k*k-A*A;oe<0?a=0:(oe*=oe,a=oe*oe*this._dot3(this.grad3[re],O,k,A));let se=.6-j*j-ee*ee-M*M;return se<0?o=0:(se*=se,o=se*se*this._dot3(this.grad3[ie],j,ee,M)),32*(r+i+a+o)}noise4d(e,t,n,r){let i=this.grad4,a=this.simplex,o=this.perm,s=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20,l,u,d,f,p,m=(e+t+n+r)*s,h=Math.floor(e+m),g=Math.floor(t+m),_=Math.floor(n+m),v=Math.floor(r+m),y=(h+g+_+v)*c,b=h-y,x=g-y,S=_-y,C=v-y,w=e-b,T=t-x,E=n-S,D=r-C,O=w>T?32:0,k=w>E?16:0,A=T>E?8:0,j=w>D?4:0,ee=T>D?2:0,M=+(E>D),N=O+k+A+j+ee+M,P=+(a[N][0]>=3),F=+(a[N][1]>=3),te=+(a[N][2]>=3),ne=+(a[N][3]>=3),re=+(a[N][0]>=2),ie=+(a[N][1]>=2),I=+(a[N][2]>=2),ae=+(a[N][3]>=2),oe=+(a[N][0]>=1),se=+(a[N][1]>=1),ce=+(a[N][2]>=1),le=+(a[N][3]>=1),ue=w-P+c,de=T-F+c,fe=E-te+c,pe=D-ne+c,me=w-re+2*c,he=T-ie+2*c,ge=E-I+2*c,_e=D-ae+2*c,ve=w-oe+3*c,ye=T-se+3*c,be=E-ce+3*c,L=D-le+3*c,xe=w-1+4*c,Se=T-1+4*c,Ce=E-1+4*c,R=D-1+4*c,we=h&255,z=g&255,B=_&255,Te=v&255,Ee=o[we+o[z+o[B+o[Te]]]]%32,De=o[we+P+o[z+F+o[B+te+o[Te+ne]]]]%32,Oe=o[we+re+o[z+ie+o[B+I+o[Te+ae]]]]%32,ke=o[we+oe+o[z+se+o[B+ce+o[Te+le]]]]%32,Ae=o[we+1+o[z+1+o[B+1+o[Te+1]]]]%32,je=.6-w*w-T*T-E*E-D*D;je<0?l=0:(je*=je,l=je*je*this._dot4(i[Ee],w,T,E,D));let Me=.6-ue*ue-de*de-fe*fe-pe*pe;Me<0?u=0:(Me*=Me,u=Me*Me*this._dot4(i[De],ue,de,fe,pe));let Ne=.6-me*me-he*he-ge*ge-_e*_e;Ne<0?d=0:(Ne*=Ne,d=Ne*Ne*this._dot4(i[Oe],me,he,ge,_e));let Pe=.6-ve*ve-ye*ye-be*be-L*L;Pe<0?f=0:(Pe*=Pe,f=Pe*Pe*this._dot4(i[ke],ve,ye,be,L));let Fe=.6-xe*xe-Se*Se-Ce*Ce-R*R;return Fe<0?p=0:(Fe*=Fe,p=Fe*Fe*this._dot4(i[Ae],xe,Se,Ce,R)),27*(l+u+d+f+p)}_dot(e,t,n){return e[0]*t+e[1]*n}_dot3(e,t,n,r){return e[0]*t+e[1]*n+e[2]*r}_dot4(e,t,n,r,i){return e[0]*t+e[1]*n+e[2]*r+e[3]*i}},$m=class e extends jm{constructor(e,t,n=512,r=512,i,a,o){super(),this.width=n,this.height=r,this.clear=!0,this.camera=t,this.scene=e,this.output=0,this._renderGBuffer=!0,this._visibilityCache=[],this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=qm(),this.pdNoiseTexture=this._generateNoise(),this.gtaoRenderTarget=new vi(this.width,this.height,{type:$t,depthBuffer:!1}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new fl({defines:Object.assign({},Wm.defines),uniforms:ll.clone(Wm.uniforms),vertexShader:Wm.vertexShader,fragmentShader:Wm.fragmentShader,blending:0,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=+!!this.camera.isPerspectiveCamera,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new gl,this.normalMaterial.blending=0,this.pdMaterial=new fl({defines:Object.assign({},Ym.defines),uniforms:ll.clone(Ym.uniforms),vertexShader:Ym.vertexShader,fragmentShader:Ym.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new fl({defines:Object.assign({},Gm.defines),uniforms:ll.clone(Gm.uniforms),vertexShader:Gm.vertexShader,fragmentShader:Gm.fragmentShader,blending:0}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new fl({uniforms:ll.clone(Am.uniforms),vertexShader:Am.vertexShader,fragmentShader:Am.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:208,blendDst:200,blendEquation:100,blendSrcAlpha:206,blendDstAlpha:200,blendEquationAlpha:100}),this.blendMaterial=new fl({uniforms:ll.clone(Km.uniforms),vertexShader:Km.vertexShader,fragmentShader:Km.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:5,blendSrc:208,blendDst:200,blendEquation:100,blendSrcAlpha:206,blendDstAlpha:200,blendEquationAlpha:100}),this._fsQuad=new Pm(null),this._originalClearColor=new J,this.setGBuffer(i?i.depthTexture:void 0,i?i.normalTexture:void 0),a!==void 0&&this.updateGtaoMaterial(a),o!==void 0&&this.updatePdMaterial(o)}setSize(e,t){this.width=e,this.height=t,this.gtaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.pdRenderTarget.setSize(e,t),this.gtaoMaterial.uniforms.resolution.value.set(e,t),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(e,t),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(e,t){e===void 0?(this.depthTexture=new Os,this.depthTexture.format=un,this.depthTexture.type=nn,this.normalRenderTarget=new vi(this.width,this.height,{minFilter:Bt,magFilter:Bt,type:$t,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0):(this.depthTexture=e,this.normalTexture=t,this._renderGBuffer=!1);let n=+!!this.normalTexture,r=this.depthTexture===this.normalTexture?`w`:`x`;this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=n,this.gtaoMaterial.defines.DEPTH_SWIZZLING=r,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=n,this.pdMaterial.defines.DEPTH_SWIZZLING=r,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(e){e?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(e){e.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=e.radius),e.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=e.distanceExponent),e.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=e.thickness),e.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=e.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),e.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=e.scale),e.samples!==void 0&&e.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=e.samples,this.gtaoMaterial.needsUpdate=!0),e.screenSpaceRadius!==void 0&&+!!e.screenSpaceRadius!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=+!!e.screenSpaceRadius,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(e){let t=!1;e.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=e.lumaPhi),e.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=e.depthPhi),e.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=e.normalPhi),e.radius!==void 0&&e.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=e.radius),e.radiusExponent!==void 0&&e.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=e.radiusExponent,t=!0),e.rings!==void 0&&e.rings!==this.pdRings&&(this.pdRings=e.rings,t=!0),e.samples!==void 0&&e.samples!==this.pdSamples&&(this.pdSamples=e.samples,t=!0),t&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=Xm(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(t,n,r){switch(this._renderGBuffer&&(this._overrideVisibility(),this._renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this._renderPass(t,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this._renderPass(t,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case e.OUTPUT.Off:break;case e.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=r.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this._renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=r.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this._renderPass(t,this.blendMaterial,this.renderToScreen?null:n);break;default:console.warn(`THREE.GTAOPass: Unknown output type.`)}}_renderPass(e,t,n,r,i){e.getClearColor(this._originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,r!=null&&(e.setClearColor(r),e.setClearAlpha(i||0),e.clear()),this._fsQuad.material=t,this._fsQuad.render(e),e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_renderOverride(e,t,n,r,i){e.getClearColor(this._originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,r=t.clearColor||r,i=t.clearAlpha||i,r!=null&&(e.setClearColor(r),e.setClearAlpha(i||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_overrideVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(e){(e.isPoints||e.isLine||e.isLine2)&&e.visible&&(e.visible=!1,t.push(e))})}_restoreVisibility(){let e=this._visibilityCache;for(let t=0;t<e.length;t++)e[t].visible=!0;e.length=0}_generateNoise(e=64){let t=new Qm,n=e*e*4,r=new Uint8Array(n);for(let n=0;n<e;n++)for(let i=0;i<e;i++){let a=n,o=i;r[(n*e+i)*4]=(t.noise(a,o)*.5+.5)*255,r[(n*e+i)*4+1]=(t.noise(a+e,o)*.5+.5)*255,r[(n*e+i)*4+2]=(t.noise(a,o+e)*.5+.5)*255,r[(n*e+i)*4+3]=(t.noise(a+e,o+e)*.5+.5)*255}let i=new Ho(r,e,e,cn,Kt);return i.wrapS=Lt,i.wrapT=Lt,i.needsUpdate=!0,i}};$m.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var eh={uniforms:{tDiffuse:{value:null},uSat:{value:1},uContrast:{value:1.06},uVignette:{value:.12}},vertexShader:`
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float uSat;
    uniform float uContrast;
    uniform float uVignette;
    varying vec2 vUv;
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      float l = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
      c.rgb = mix(vec3(l), c.rgb, uSat);
      c.rgb = (c.rgb - 0.5) * uContrast + 0.5;
      vec2 d = vUv - 0.5;
      c.rgb *= 1.0 - uVignette * smoothstep(0.35, 0.85, length(d * vec2(1.0, 0.8)));
      gl_FragColor = vec4(clamp(c.rgb, 0.0, 1.0), c.a);
    }
  `},th=null;function nh(){if(th)return th;let e=document.createElement(`canvas`);e.width=e.height=128;let t=e.getContext(`2d`),n=t.createRadialGradient(64,64,0,64,64,64);return n.addColorStop(0,`rgba(0,0,0,0.9)`),n.addColorStop(.5,`rgba(0,0,0,0.45)`),n.addColorStop(1,`rgba(0,0,0,0)`),t.fillStyle=n,t.fillRect(0,0,128,128),th=new Ds(e),th}var rh=class{scene;meshes=new Map;constructor(e){this.scene=e}set(e,t,n,r,i,a=1,o=0,s=.8){let c=this.meshes.get(e);c||(c=new X(new el(1,1),new _o({map:nh(),transparent:!0,depthWrite:!1})),c.renderOrder=1,this.scene.add(c),this.meshes.set(e,c));let l=Math.max(0,r),u=Math.max(0,1-l/380);c.visible=u>.01,c.position.set(t,n,1.6),c.rotation.set(0,0,o);let d=i*(1+l/450);c.scale.set(d,d*a,1),c.material.opacity=s*u}hide(e){let t=this.meshes.get(e);t&&(t.visible=!1)}},ih={uniforms:{tDiffuse:{value:null},uDebug:{value:1}},vertexShader:`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`
    uniform sampler2D tDiffuse; uniform float uDebug; varying vec2 vUv;
    // exponent bits all set = NaN/Inf. Tested on the bits: Metal's fast-math folds v != v / isnan()
    // to false, which made this pass a no-op on Macs
    bool bad(float v) { return (floatBitsToUint(v) & 0x7f800000u) == 0x7f800000u || abs(v) > 60000.0; }
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      gl_FragColor = (bad(c.r) || bad(c.g) || bad(c.b) || bad(c.a)) ? vec4(uDebug, 0.0, uDebug, 1.0) : c;
    }`},ah=class e extends X{constructor(){let t=e.SkyShader,n=new fl({name:t.name,uniforms:ll.clone(t.uniforms),vertexShader:t.vertexShader,fragmentShader:t.fragmentShader,side:1,depthWrite:!1});super(new js(1,1,1),n),this.isSky=!0}};ah.SkyShader={name:`SkyShader`,uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new G},cloudScale:{value:2e-4},cloudSpeed:{value:2e-5},cloudCoverage:{value:.4},cloudDensity:{value:.4},cloudElevation:{value:.5},showSunDisc:{value:1},time:{value:0}},vertexShader:`
		uniform vec3 sunPosition;
		uniform float rayleigh;
		uniform float turbidity;
		uniform float mieCoefficient;

		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		// constants for atmospheric scattering
		const float e = 2.71828182845904523536028747135266249775724709369995957;
		const float pi = 3.141592653589793238462643383279502884197169;

		// wavelength of used primaries, according to preetham
		const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
		// this pre-calculation replaces older TotalRayleigh(vec3 lambda) function:
		// (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
		const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

		// mie stuff
		// K coefficient for the primaries
		const float v = 4.0;
		const vec3 K = vec3( 0.686, 0.678, 0.666 );
		// MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
		const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

		// earth shadow hack
		// cutoffAngle = pi / 1.95;
		const float cutoffAngle = 1.6110731556870734;
		const float steepness = 1.5;
		const float EE = 1000.0;

		float sunIntensity( float zenithAngleCos ) {
			zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
			return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
		}

		vec3 totalMie( float T ) {
			float c = ( 0.2 * T ) * 10E-18;
			return 0.434 * c * MieConst;
		}

		void main() {

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vWorldPosition = worldPosition.xyz;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			gl_Position.z = gl_Position.w; // set z to camera.far

			vSunDirection = normalize( sunPosition );

			vSunE = sunIntensity( vSunDirection.y );

			vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

			float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

			// extinction (absorption + out scattering)
			// rayleigh coefficients
			vBetaR = totalRayleigh * rayleighCoefficient;

			// mie coefficients
			vBetaM = totalMie( turbidity ) * mieCoefficient;

		}`,fragmentShader:`
		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		uniform float mieDirectionalG;
		uniform float cloudScale;
		uniform float cloudSpeed;
		uniform float cloudCoverage;
		uniform float cloudDensity;
		uniform float cloudElevation;
		uniform float showSunDisc;
		uniform float time;

		// gradient at a lattice corner; sinless hash so every GPU produces the same clouds
		vec2 gradient( vec2 i ) {
			vec3 p = fract( i.xyx * vec3( 0.1031, 0.1030, 0.0973 ) );
			p += dot( p, p.yzx + 33.33 );
			return fract( ( p.xx + p.yz ) * p.zy ) * 2.0 - 1.0;
		}

		// 2D gradient noise: isotropic lobes like Perlin at value-noise cost
		float noise( vec2 p ) {
			vec2 i = floor( p );
			vec2 f = fract( p );
			vec2 u = f * f * f * ( f * ( f * 6.0 - 15.0 ) + 10.0 ); // quintic fade
			float a = dot( gradient( i ), f );
			float b = dot( gradient( i + vec2( 1.0, 0.0 ) ), f - vec2( 1.0, 0.0 ) );
			float c = dot( gradient( i + vec2( 0.0, 1.0 ) ), f - vec2( 0.0, 1.0 ) );
			float d = dot( gradient( i + vec2( 1.0, 1.0 ) ), f - vec2( 1.0, 1.0 ) );
			return mix( mix( a, b, u.x ), mix( c, d, u.x ), u.y ) * 1.6; // ~[-1,1]
		}

		// fbm; per-octave drift makes clouds billow instead of scrolling as a rigid stamp
		float fbm( vec2 p, float drift ) {
			float result = 0.0;
			float amplitude = 1.0;
			for ( int i = 0; i < 4; i ++ ) {
				result += amplitude * noise( p );
				amplitude *= 0.5;
				p = p * 2.0 + drift;
			}
			return result;
		}

		// constants for atmospheric scattering
		const float pi = 3.141592653589793238462643383279502884197169;

		const float n = 1.0003; // refractive index of air
		const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

		// optical length at zenith for molecules
		const float rayleighZenithLength = 8.4E3;
		const float mieZenithLength = 1.25E3;
		// 66 arc seconds -> degrees, and the cosine of that
		const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

		// 3.0 / ( 16.0 * pi )
		const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
		// 1.0 / ( 4.0 * pi )
		const float ONE_OVER_FOURPI = 0.07957747154594767;

		float rayleighPhase( float cosTheta ) {
			return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
		}

		float hgPhase( float cosTheta, float g ) {
			float g2 = pow( g, 2.0 );
			float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
			return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
		}

		void main() {

			vec3 direction = normalize( vWorldPosition - cameraPosition );

			// optical length
			// cutoff angle at 90 to avoid singularity in next formula.
			float zenithAngle = acos( max( 0.0, direction.y ) );
			float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
			float sR = rayleighZenithLength * inverse;
			float sM = mieZenithLength * inverse;

			// combined extinction factor
			vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

			// in scattering
			float cosTheta = dot( direction, vSunDirection );

			float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
			vec3 betaRTheta = vBetaR * rPhase;

			float mPhase = hgPhase( cosTheta, mieDirectionalG );
			vec3 betaMTheta = vBetaM * mPhase;

			vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
			Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - vSunDirection.y, 5.0 ), 0.0, 1.0 ) );

			// nightsky
			float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
			float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
			vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
			vec3 L0 = vec3( 0.1 ) * Fex;

			// composition + solar disc
			float sundisc = clamp( ( cosTheta - sunAngularDiameterCos ) * 50000.0, 0.0, 1.0 ) * showSunDisc;
			vec3 sundiscColor = ( 760.0 * sundisc ) * min( vSunE * Fex, 80.0 );

			vec3 texColor = ( Lin + L0 ) * 0.04 + sundiscColor + vec3( 0.0, 0.0003, 0.00075 );

			// Clouds
			if ( direction.y > 0.0 && cloudCoverage > 0.0 ) {

				// Project to cloud plane (higher elevation = clouds appear lower/closer)
				float elevation = mix( 1.0, 0.1, cloudElevation );
				vec2 cloudUV = direction.xz / ( direction.y * elevation );
				cloudUV *= cloudScale;
				cloudUV += time * cloudSpeed;

				// Cloud density field
				float evolve = time * cloudSpeed * 300.0;
				float cloudNoise = clamp( fbm( cloudUV * 1000.0, evolve ) * 0.7 + 0.5, 0.0, 1.0 );

				// Large-scale coverage variation: clear gaps next to dense banks
				float region = noise( cloudUV * 300.0 ) * 0.37 + 0.5;
				float cov = clamp( cloudCoverage + ( region - 0.5 ) * 0.6, 0.0, 1.0 );

				// Carve clouds where noise rises above the coverage level
				float threshold = 1.0 - cov;
				float cloudMask = smoothstep( threshold, threshold + 0.3, cloudNoise );

				// Fade clouds near horizon (adjusted by elevation)
				float horizonFade = smoothstep( 0.0, 0.03 + 0.06 * cloudElevation, direction.y );
				cloudMask *= horizonFade;

				// Cloud lighting from the sky's own radiance
				float dayFactor = smoothstep( -0.08, 0.3, vSunDirection.y );
				vec3 sunColor = vSunE * Fex * 0.22 * 0.04; // 0.22 ~ albedo/pi, 0.04 = exposure; the aerial composite adds the eye-leg extinction
				vec3 skyAmbient = Lin * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

				// Beer-powder self-shadow from the sampled density
				float depth = max( 0.0, cloudNoise - threshold );
				float beer = exp( depth * -4.0 );
				float powder = 1.0 - beer * beer; // beer*beer == exp(-8*depth)
				float shade = mix( 0.45, 1.0, clamp( beer * powder * 2.6, 0.0, 1.0 ) ); // 2.6 = 1/0.385, normalizes beer*powder peak to 1

				// Henyey-Greenstein forward lobe ( g = 0.7 ): silver lining on rims toward the sun
				float silver = clamp( 0.51 / pow( 1.49 - cosTheta * 1.4, 1.5 ), 0.0, 3.0 ); // 0.51=1-g^2, 1.49=1+g^2, 1.4=2g
				float edge = cloudMask * ( 1.0 - cloudMask ) * 4.0;

				vec3 cloudColor = skyAmbient + sunColor * shade;
				cloudColor += sunColor * silver * edge * 0.6;
				cloudColor *= max( dayFactor, 0.03 );

				// Cloud opacity via Beer's law: density sets how solid the clouds get
				float alpha = ( 1.0 - exp( depth * cloudDensity * -12.0 ) ) * horizonFade;

				// Occlude the sun disc/glow behind opaque cloud
				texColor -= L0 * 0.04 * alpha;

				// Composite through the atmosphere so distant clouds dissolve into haze
				vec3 cloudAerial = mix( texColor, cloudColor, Fex );
				texColor = mix( texColor, cloudAerial, alpha );

			}

			gl_FragColor = vec4( texColor, 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};var oh=new G(.615,-.135,.777).normalize();function sh(e,t,n={scale:.75,max:1.1}){let r=new ra,i=new ah;i.scale.setScalar(1e4);let a=i.material.uniforms;a.turbidity.value=2.5,a.rayleigh.value=1.2,a.mieCoefficient.value=.003,a.mieDirectionalG.value=.8,a.cloudCoverage&&(a.cloudCoverage.value=.4,a.cloudDensity.value=.6,a.cloudElevation.value=.6,a.cloudScale.value=22e-5),a.sunPosition.value.set(oh.x,oh.z,-oh.y),a.showSunDisc&&(a.showSunDisc.value=!1),r.add(i);let o=new Cd(512,{type:$t}),s=new Du(1,2e4,o),c=e.toneMapping;e.toneMapping=0,s.update(e,r);let l=new ra,u=new fl({uniforms:{tCube:{value:o.texture},uScale:{value:n.scale},uMax:{value:n.max}},vertexShader:`varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`
      uniform samplerCube tCube; uniform float uScale; uniform float uMax; varying vec3 vDir;
      void main(){
        vec3 d = normalize(vDir);
        vec3 c = textureCube(tCube, vec3(-d.x, d.y, d.z)).rgb * uScale;
        float m = max(c.r, max(c.g, c.b));
        if (m > uMax) c *= uMax / m;
        // below the horizon the world is stadium + grass, not sky
        vec3 ground = vec3(0.045, 0.06, 0.04);
        c = mix(ground, c, smoothstep(-0.12, 0.04, d.y));
        gl_FragColor = vec4(c, 1.0);
      }`,side:1,depthWrite:!1,depthTest:!1});l.add(new X(new js(100,100,100),u));let d=new Cd(1024,{type:$t,generateMipmaps:!0,minFilter:Gt});new Du(1,1e3,d).update(e,l),e.toneMapping=c,o.dispose();let f=new md(e),p=f.fromCubemap(d.texture);return f.dispose(),t.background=d.texture,t.environment=p.texture,t.backgroundRotation.set(Math.PI/2,0,0),t.environmentRotation.set(Math.PI/2,0,0),t.backgroundIntensity=1.4,t.environmentIntensity=1,{cubeRT:d,envRT:p,readback:()=>lh(e,d)}}function ch(e,t,n=new G(0,0,260),r=[]){let i=new Cd(512,{type:$t,generateMipmaps:!0,minFilter:Gt}),a=new Du(20,15e4,i);a.position.copy(n),t.add(a);let o=r.map(e=>e.visible);r.forEach(e=>e.visible=!1),a.update(e,t),r.forEach((e,t)=>e.visible=o[t]),t.remove(a);let s=new md(e),c=s.fromCubemap(i.texture).texture;return s.dispose(),i.dispose(),c}function lh(e,t){let n=[],r=new Uint16Array(1024);for(let i=0;i<6;i++){e.readRenderTargetPixels(t,t.width/2-8,t.height/2-8,16,16,r,i);let a=0;for(let e=0;e<r.length;e+=4)a+=La.fromHalfFloat(r[e+1]);n.push(+(a/256).toFixed(3))}return n}var uh=class{mesh;uniforms;constructor(e){this.uniforms={uSun:{value:oh.clone()},uTime:{value:0},uHaze:{value:e.clone()},uZenith:{value:new J(.07,.2,.62)},uMid:{value:new J(.28,.5,.9)}};let t=new fl({uniforms:this.uniforms,vertexShader:`
        varying vec3 vDir;
        void main() {
          vDir = position;
          // rotation only: the dome is always centred on whichever camera renders it
          vec4 p = projectionMatrix * vec4(mat3(viewMatrix) * position, 1.0);
          gl_Position = p.xyww; // on the far plane
        }`,fragmentShader:`
        uniform vec3 uSun, uHaze, uZenith, uMid;
        uniform float uTime;
        varying vec3 vDir;
        float h21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
        float noise(vec2 p) {
          vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
          return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y);
        }
        float fbm(vec2 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 6; i++) { s += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; } return s; }
        // cumulus density on the cloud plane: domain-warped fbm, thresholded into puffy shapes
        float cumulus(vec2 p) {
          vec2 w = vec2(fbm(p * 0.6 + 3.1), fbm(p * 0.6 - 7.7));
          float d = fbm(p + w * 0.9);
          return smoothstep(0.44, 0.68, d);
        }
        void main() {
          vec3 d = normalize(vDir);
          float el = d.z;
          // ---- clear sky gradient: haze at the horizon -> saturated blue -> deep zenith ----
          float up = max(el, 0.0);
          vec3 col = mix(uHaze, uMid, smoothstep(0.0, 0.28, up));
          col = mix(col, uZenith, smoothstep(0.25, 1.0, up));
          // sun: Mie forward glow + disc (HDR, the bloom turns it into glare)
          float mu = dot(d, normalize(uSun));
          float glow = pow(max(mu, 0.0), 12.0) * 0.55 + pow(max(mu, 0.0), 180.0) * 1.6;
          col += vec3(1.0, 0.92, 0.78) * glow;
          col = mix(col, uHaze * 1.08, pow(max(1.0 - up, 0.0), 10.0) * 0.6);   // thicker haze band right at the horizon

          // ---- clouds on a plane above the arena (perspective-correct, thinning toward the horizon) ----
          if (el > 0.015) {
            vec2 cp = d.xy / (el + 0.06);
            vec2 wind = vec2(uTime * 0.004, uTime * 0.0015);
            vec2 q = cp * 2.3 + wind;
            float c = cumulus(q);
            // self-shadow: density a step toward the sun darkens the underside
            vec2 toSun = normalize(uSun.xy + 1e-4) * 0.09;
            float shadow = cumulus(q + toSun);
            vec3 lit = vec3(1.0, 0.98, 0.95) * (1.05 + 0.45 * pow(max(mu, 0.0), 6.0));
            vec3 base = mix(vec3(0.72, 0.77, 0.86), vec3(0.52, 0.58, 0.7), shadow);
            vec3 cloud = mix(lit, base, clamp(shadow * 1.2 - c * 0.2, 0.0, 1.0));
            // silver lining where thin cloud faces the sun
            cloud += vec3(1.0, 0.95, 0.85) * (1.0 - shadow) * (1.0 - c) * pow(max(mu, 0.0), 4.0) * 0.8;
            float fade = smoothstep(0.015, 0.2, el);
            col = mix(col, cloud, c * 0.92 * fade);
            // high cirrus streaks
            vec2 cq = cp * vec2(0.5, 2.2) * 0.35 + wind * 1.6;
            float ci = smoothstep(0.55, 0.85, fbm(cq)) * (1.0 - c);
            col = mix(col, vec3(0.95, 0.96, 1.0) * (1.0 + 0.3 * pow(max(mu, 0.0), 8.0)), ci * 0.35 * fade);
          }
          // below the horizon (seen through gaps): the far haze
          col = mix(uHaze * 0.9, col, smoothstep(-0.05, 0.01, el));
          gl_FragColor = vec4(col, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,side:1,depthWrite:!1,fog:!1});this.mesh=new X(new tl(1e3,48,24),t),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-10}update(e,t){this.uniforms.uTime.value=t}},dh=6,fh=97,ph=2.8,mh=2.6,hh=84,gh=15,_h=.07,vh=.55,yh=1e3,bh={uRingBall:{value:new gi(0,0,-1e5,hh)},uRingParams:{value:new W(_h,0)}},xh=`
  uniform vec4 uRingBall; uniform vec2 uRingParams;
  float ballRingMask(vec3 w) {
    vec2 p = w.xy - uRingBall.xy;
    float r = length(p);
    float aaR = fwidth(r) * 0.75 + 1e-4;
    float outer = 1.0 - smoothstep(${(ph/2).toFixed(2)} - aaR, ${(ph/2).toFixed(2)} + aaR, abs(r - ${fh.toFixed(1)}));
    float q = abs(mod(atan(p.y, p.x), 1.5707963) - 0.7853982);
    float along = q * uRingBall.w;
    float aaA = fwidth(along) * 0.75 + 1e-4;
    float arc = 1.0 - smoothstep((0.7853982 - uRingParams.x) * uRingBall.w - aaA, (0.7853982 - uRingParams.x) * uRingBall.w + aaA, along);
    float inner = (1.0 - smoothstep(${(mh/2).toFixed(2)} - aaR, ${(mh/2).toFixed(2)} + aaR, abs(r - uRingBall.w))) * arc;
    // only on surfaces under the ball, above the flat ring plane
    float under = step(${dh.toFixed(1)}, w.z) * step(w.z, uRingBall.z);
    return max(outer, inner) * under * uRingParams.y;
  }
`,Sh=class{mesh;mat;constructor(e){let t=106.6;this.mat=new fl({uniforms:{uInnerR:{value:hh},uGap:{value:_h},uOpacity:{value:1}},vertexShader:`
        varying vec2 vP;
        void main() { vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`
        uniform float uInnerR; uniform float uGap; uniform float uOpacity;
        varying vec2 vP;
        float ring(float r, float radius, float w) {
          float aa = fwidth(r) * 0.75 + 1e-4;
          return 1.0 - smoothstep(w * 0.5 - aa, w * 0.5 + aa, abs(r - radius));
        }
        void main() {
          float r = length(vP);
          float outer = ring(r, ${fh.toFixed(1)}, ${ph.toFixed(1)});
          // four arcs centred on the diagonals, gaps on the axes
          float a = atan(vP.y, vP.x);
          float q = abs(mod(a, 1.5707963) - 0.7853982);         // 0 at an arc's centre, pi/4 at a gap
          float arcLen = (0.7853982 - uGap) * uInnerR;           // half arc length, uu
          float along = q * uInnerR;
          float aaA = fwidth(along) * 0.75 + 1e-4;
          float arc = 1.0 - smoothstep(arcLen - aaA, arcLen + aaA, along);
          float inner = ring(r, uInnerR, ${mh.toFixed(1)}) * arc;
          float m = max(outer, inner) * uOpacity;
          if (m < 0.003) discard;
          gl_FragColor = vec4(vec3(1.0), m);
        }`,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),this.mesh=new X(new el(t*2,t*2),this.mat),this.mesh.renderOrder=2,this.mesh.frustumCulled=!1,this.mesh.name=`ballIndicator`,e.add(this.mesh)}update(e,t){if(this.mesh.visible=t,!t){bh.uRingParams.value.y=0;return}this.mesh.position.set(e.x,e.y,dh);let n=Zr.smootherstep(e.z-h,0,yh);this.mat.uniforms.uInnerR.value=Zr.lerp(hh,gh,n),this.mat.uniforms.uGap.value=Zr.lerp(_h,vh,n),bh.uRingBall.value.set(e.x,e.y,e.z,this.mat.uniforms.uInnerR.value),bh.uRingParams.value.set(this.mat.uniforms.uGap.value,1)}};function Ch(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new to,l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let e in d.morphAttributes){if(!i.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;o[e]===void 0&&(o[e]=[]),o[e].push(d.morphAttributes[e])}if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=wh(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=wh(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function wh(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new Va(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}function Th(e,t){if(t===0)return console.warn(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles.`),e;if(t===2||t===1){let n=e.getIndex();if(n===null){let t=[],r=e.getAttribute(`position`);if(r!==void 0){for(let e=0;e<r.count;e++)t.push(e);e.setIndex(t),n=e.getIndex()}else return console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.`),e}let r=n.count-2,i=[];if(t===2)for(let e=1;e<=r;e++)i.push(n.getX(0)),i.push(n.getX(e)),i.push(n.getX(e+1));else for(let e=0;e<r;e++)e%2==0?(i.push(n.getX(e)),i.push(n.getX(e+1)),i.push(n.getX(e+2))):(i.push(n.getX(e+2)),i.push(n.getX(e+1)),i.push(n.getX(e)));return i.length/3!==r&&console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.`),e.setIndex(i),e.clearGroups(),e}return console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:`,t),e}var Eh=new Map,Dh=new eu;function Oh(e){let t=Dh.load(e);return t.wrapS=t.wrapT=Lt,t.colorSpace=``,t.anisotropy=16,t}function kh(e){let t=Eh.get(e);if(!t){let n=`/assets/textures/${e}`;t={detail:Oh(`${n}_detail.webp`),normal:Oh(`${n}_normal.webp`),rough:Oh(`${n}_rough.webp`)},Eh.set(e,t)}return t}function Ah(){return new URLSearchParams(location.search).get(`grass`)===`001`?`grass001`:`grass005`}var jh=`
vec4 triplanar(sampler2D t, vec3 p, vec3 n, float tile) {
  vec3 w = pow(abs(n), vec3(6.0));
  w /= max(1e-4, w.x + w.y + w.z);
  return texture2D(t, p.yz / tile) * w.x + texture2D(t, p.xz / tile) * w.y + texture2D(t, p.xy / tile) * w.z;
}`,Mh={height:4,cell:1.35,layers:12,fadeIn:650,fadeOut:1450,size:3200},Nh={uGrassTime:{value:0}};function Ph(e={}){let t=new ml({color:16777215,roughness:.92,metalness:0});e.shell&&(t.defines={USE_SHELL:``});let n=kh(Ah()),r={uX1:{value:c-306},uY1:{value:l-306},uC1:{value:d-306*Math.SQRT2},uGoalW:{value:893},uGoalY:{value:l},uGoalD:{value:880},uGrassD:{value:n.detail},uGrassN:{value:n.normal},uGrassR:{value:n.rough},uShellH:{value:Mh.height},...Nh};return t.onBeforeCompile=e=>{Object.assign(e.uniforms,r),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
        varying vec3 vFieldPos;
        varying float vShellH;
        uniform float uShellH, uGrassTime;
        #ifdef USE_SHELL
        attribute float shellH;
        #endif`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
        vShellH = 0.0;
        #ifdef USE_SHELL
        {
          vShellH = shellH;
          vec3 wp = (modelMatrix * vec4(transformed, 1.0)).xyz;
          // layer height + a gentle wind sway that grows toward the tips
          vec2 sway = vec2(sin(uGrassTime * 1.6 + wp.x * 0.004 + wp.y * 0.002), cos(uGrassTime * 1.2 + wp.y * 0.005)) * 0.6;
          transformed.z += shellH * uShellH;
          transformed.xy += sway * shellH * shellH;
        }
        #endif`).replace(`#include <worldpos_vertex>`,`#include <worldpos_vertex>
vFieldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`),Object.assign(e.uniforms,bh),e.fragmentShader=e.fragmentShader.replace(`#include <dithering_fragment>`,`gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0), ballRingMask(vFieldPos));
        #include <dithering_fragment>`).replace(`#include <common>`,`#include <common>
        ${xh}
        varying vec3 vFieldPos;
        varying float vShellH;
        uniform float uX1, uY1, uC1, uGoalW, uGoalY, uGoalD;
        uniform sampler2D uGrassD, uGrassN, uGrassR;
        float gFar;
        #define END_R 3000.0
        #define RL_GRASS_NEAR 1.0
        #define RL_GRASS_FAR vec3(1.54, 1.87, 0.56)
        float fh(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float fnoise(vec2 p) {
          vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
          return mix(mix(fh(i), fh(i + vec2(1, 0)), f.x), mix(fh(i + vec2(0, 1)), fh(i + vec2(1, 1)), f.x), f.y);
        }
        float fbm(vec2 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * fnoise(p); p *= 2.03; a *= 0.5; } return s; }
        // anti-aliased line of half-width w at distance d
        float aaLine(float d, float w) { float fw = fwidth(d) * 1.2 + 0.001; return 1.0 - smoothstep(w - fw, w + fw, abs(d)); }
        float segDist(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h); }
        // ---- RL pitch markings, measured from a top-down mosaic of RL captures (tools/calib/fit_pitch.py) ----
        // our frame = RL's mirrored in x; the layout is symmetric in x and point-symmetric between halves
        float dash(float s, float period, float duty) { return step(fract(s / period), duty); }
        float markings(vec2 p) {
          vec2 q = abs(p);
          float m = 0.0;
          // centre: spot ring, inner + outer circles
          float r = length(p);
          m = max(m, aaLine(r - 257.0, 10.0));
          m = max(m, aaLine(r - 892.0, 11.0));
          m = max(m, aaLine(r - 1142.0, 11.0));
          // halfway line (outside the spot ring, up to the boundary)
          float bx = 3672.0 - 515.0 * q.y / 4000.0;          // slanted boundary line x at this |y|
          if (q.x > 257.0 && q.x < bx) m = max(m, aaLine(p.y, 11.0));
          // side boundary lines: slanted in toward the corner pads, ending at their rings
          if (q.y < 3940.0) m = max(m, aaLine(q.x - bx, 11.0));
          // lengthwise lines from the centre's outer circle to the end-zone rim
          if (q.y > 789.0 && q.y < 3564.0) m = max(m, aaLine(q.x - 826.0, 11.0));
          // end zone: rim + inner arc about (0, +-4725), clipped at the goal line
          vec2 e = vec2(q.x, q.y - 4725.0);
          float de = length(e);
          if (q.y < 5120.0) {
            m = max(m, aaLine(de - 1425.0, 13.0));
            m = max(m, aaLine(de - 1048.0, 11.0));
          }
          // dashed curve: half-ellipse (2308 x 4809) along the sides joined to an arc (r 1966 about y 4689)
          if (q.y < 3530.0) {
            vec2 k = q / vec2(2308.0, 4809.0);
            float kl = length(k);
            float dl = (kl - 1.0) * kl / length(q / vec2(2308.0 * 2308.0, 4809.0 * 4809.0));
            float t = atan(k.y, k.x) * 3558.0;
            m = max(m, aaLine(dl, 9.0) * dash(t, 150.0, 0.6));
          } else if (q.y < 4780.0) {
            vec2 c = vec2(q.x, q.y - 4689.0);
            float t = atan(c.x, -c.y) * 1966.0;
            m = max(m, aaLine(length(c) - 1966.0, 9.0) * dash(t + 40.0, 150.0, 0.6));
          }
          // painted rings round the big pads
          m = max(m, aaLine(length(q - vec2(3072.0, 4096.0)) - 160.0, 10.0));
          m = max(m, aaLine(length(vec2(q.x - 3584.0, p.y)) - 160.0, 10.0));
          return m;
        }`).replace(`#include <clipping_planes_fragment>`,`#include <clipping_planes_fragment>
        #ifdef USE_SHELL
        {
          // blades: one per jittered world-space cell, tapering and leaning toward the tip;
          // a layer keeps only the pixels still inside a blade at its height
          vec2 p0 = vFieldPos.xy;
          vec2 aq = abs(p0);
          if (aq.x > uX1 + 40.0 || aq.x + aq.y > uC1 + 70.0 || (aq.y > uY1 + 40.0 && (aq.x > uGoalW || aq.y > uGoalY + uGoalD))) discard;
          float dcam = length(cameraPosition.xy - p0);
          float fade = 1.0 - smoothstep(${Mh.fadeIn.toFixed(1)}, ${Mh.fadeOut.toFixed(1)}, dcam);
          vec2 bp = p0 / ${Mh.cell.toFixed(3)};
          vec2 cell = floor(bp), f = fract(bp);
          float hgt = 0.5 + 0.5 * fh(cell + 4.3);
          float t = vShellH / hgt;
          vec2 root = 0.22 + 0.56 * vec2(fh(cell), fh(cell + 19.7));
          vec2 lean = (vec2(fh(cell + 7.7), fh(cell + 2.9)) - 0.5) * 0.7 * t;
          float w = 0.44 * (1.0 - t);
          if (t > 1.0 || length(f - root - lean) > w || fh(cell + 11.0) > fade * 1.15) discard;
        }
        #endif`).replace(`#include <color_fragment>`,`#include <color_fragment>
        vec2 fp = vFieldPos.xy;
        // grass base with large and small scale variation
        float big = fbm(fp * 0.0009);
        float mid = fbm(fp * 0.012);
        float fine = fnoise(fp * 0.35) * 0.5 + fnoise(fp * 0.9) * 0.5;
        vec3 grassA = vec3(0.040, 0.150, 0.018);
        vec3 grassB = vec3(0.075, 0.225, 0.030);
        vec3 grass = mix(grassA, grassB, big * 0.8 + mid * 0.3);
        // photographic turf (CC0): near tile + a rotated coarse tile far away to hide repetition
        gFar = smoothstep(1200.0, 7000.0, length(cameraPosition - vFieldPos));
        vec3 gNear = texture2D(uGrassD, fp / ${140 .toFixed(1)}).rgb * 2.0;
        vec2 rp = mat2(0.8, -0.6, 0.6, 0.8) * fp;
        vec3 gCoarse = texture2D(uGrassD, rp / ${882 .toFixed(1)} + 0.31).rgb * 2.0;
        vec3 turf = mix(gNear, gNear * 0.5 + gCoarse * 0.5, gFar);
        grass *= mix(vec3(1.0), turf, 0.9) * (0.9 + fine * 0.2);
        // ---- mowing + paint: RL pitch (tools/calib/fit_pitch.py + mowing fit on the mosaic) ----
        vec3 viewV = normalize(cameraPosition - vFieldPos);
        float px = fwidth(fp.x) + fwidth(fp.y) + 1.0;
        float r = length(fp);
        // concentric mowing rings: dark band [460, 810] + 700k, soft mower edges, x 16 spokes (tuned by eye
        // against RL from matched cameras; the lighting-normalised fit gave 0.834 / 1.03, which reads too flat)
        float rf = fract((r - 460.0) / 700.0);
        float rw = fwidth(r) / 700.0 + 40.0 / 700.0;
        float ring = smoothstep(0.0, rw, rf) * (1.0 - smoothstep(0.5 - rw, 0.5, rf));
        ring = mix(ring, 0.5, smoothstep(0.08, 0.3, fwidth(r) / 700.0));
        float aa = atan(fp.y, -fp.x);                       // RL's angle (x mirrored)
        float sf = fract((aa - 0.1955) / 0.7853982);
        float sww = fwidth(aa) / 0.7853982 + 0.01;
        float spoke = smoothstep(0.0, sww, sf) * (1.0 - smoothstep(0.5 - sww, 0.5, sf));
        grass *= mix(1.0, 0.76, ring) * mix(1.0, 1.12, spoke);
        // measured vs RL (tools/calib/region_stats.py, matched camera): RL's turf is a dark desaturated olive
        // up close and brightens ~4x toward grazing view angles (blade sheen), turning yellow-green
        grass *= vec3(1.43, 0.51, 1.16) * RL_GRASS_NEAR;
        float gz = smoothstep(0.25, 0.03, viewV.z);
        grass = mix(grass, grass * RL_GRASS_FAR, gz);
        // ...and does not brighten when seen from above (top-down mosaic vs RL: 0.47/0.53/0.69 at ~35 deg down)
        grass *= mix(vec3(1.0), vec3(0.47, 0.53, 0.69), smoothstep(0.22, 0.55, viewV.z));
        float grain = clamp(dot(turf, vec3(0.3, 0.5, 0.2)) * 2.2, 0.6, 1.4);
        // team paint, fitted on the top-down mosaic (orange is a saturated red-orange in RL)
        vec3 teamC = fp.y > 0.0 ? vec3(1.2, 0.27, 0.05) : vec3(0.124, 0.684, 2.47);
        // end zones: paint inside the rim circle (r 1425 about y +-4725), up to the goal line; thin dark
        // stripes (period 160, dark 60) at RL's angle (138.5 deg, checked against RL renders from the same camera)
        float dEnd = length(vec2(fp.x, abs(fp.y) - 4725.0));
        float endZone = (1.0 - smoothstep(1425.0 - px, 1425.0 + px, dEnd)) * step(abs(fp.y), uGoalY);
        float st = dot(fp, vec2(-0.6626, -0.7490));
        float sx = mod(st + 50000.0, 160.0);
        float stripeL = smoothstep(0.0, px, sx) * (1.0 - smoothstep(60.0 - px, 60.0, sx));
        stripeL = mix(stripeL, 60.0 / 160.0, smoothstep(50.0, 100.0, px));
        // the band between the inner arc (1048) and the rim (1425) is painted a darker shade
        float band = smoothstep(1048.0 - px, 1048.0 + px, dEnd);
        vec3 paintC = teamC * (0.2 + 0.05 * mid) * mix(1.0, 0.6, stripeL) * mix(1.0, 0.72, band) * mix(1.0, grain, 1.0 - gFar);
        grass = mix(grass, paintC + grass * 0.25, endZone * 0.88);
        // centre annulus 550..844 split across the halfway line, lengthwise stripes (period 171, dark 44)
        float ann = smoothstep(550.0 - px, 550.0 + px, r) * (1.0 - smoothstep(844.0 - px, 844.0 + px, r));
        float cx = mod(fp.x + 150.0 + 35.0 + 171.0 * 300.0, 171.0);
        float stripeC = smoothstep(0.0, px, cx) * (1.0 - smoothstep(70.0 - px, 70.0, cx));
        stripeC = mix(stripeC, 70.0 / 171.0, smoothstep(50.0, 100.0, px));
        vec3 annC = teamC * 0.4 * (0.2 + 0.05 * mid) * mix(1.0, 0.55, stripeC) * mix(1.0, grain, 1.0 - gFar);
        grass = mix(grass, annC + grass * 0.25, ann * 0.88);
        // team marks near the sidelines: bars (|y| 180..392, |x| 2156..3708) and 4 dashes (|y| 1884..1984)
        vec2 qa = abs(fp);
        float bar = step(2156.0, qa.x) * step(qa.x, 3708.0) * step(180.0, qa.y) * step(qa.y, 392.0);
        float dsh = step(2136.0, qa.x) * step(qa.x, 3700.0) * step(1884.0, qa.y) * step(qa.y, 1984.0)
                  * step(fract((qa.x - 2136.0) / 432.0), 356.0 / 432.0);
        grass = mix(grass, teamC * 0.26 * mix(1.0, grain, 1.0 - gFar) + grass * 0.2, max(bar, dsh) * 0.9);
        // subtle team tint near the ends
        float team = smoothstep(2500.0, 5200.0, abs(fp.y));
        vec3 tint = fp.y > 0.0 ? vec3(1.08, 0.98, 0.9) : vec3(0.92, 0.99, 1.1);
        grass *= mix(vec3(1.0), tint, team * 0.35);
        // goal interior
        if (abs(fp.y) > uGoalY) grass *= 0.72;
        float mk = markings(fp);
        vec3 lineCol = vec3(0.3, 0.34, 0.31);
        diffuseColor.rgb = mix(grass, lineCol, mk * 0.85);
        #ifdef USE_SHELL
        // blade self-shadowing: dark roots, bright sunlit tips
        diffuseColor.rgb *= mix(0.55, 1.2, pow(vShellH, 0.8));
        #else
        // under the shells the flat pitch reads as the shaded soil between blades
        diffuseColor.rgb *= mix(1.0, 0.6, 1.0 - smoothstep(${Mh.fadeIn.toFixed(1)}, ${Mh.fadeOut.toFixed(1)}, length(cameraPosition.xy - fp)));
        #endif`).replace(`#include <roughnessmap_fragment>`,`#include <roughnessmap_fragment>
        float tr = texture2D(uGrassR, fp / ${140 .toFixed(1)}).r;
        roughnessFactor = mix(mix(0.97, 0.78 + 0.2 * tr, 1.0 - gFar), 0.75, mk);`).replace(`#include <normal_fragment_maps>`,`#include <normal_fragment_maps>
        {
          // turf normal map: the pitch is a z-up plane, so tangent space = world x/y
          vec3 tn = texture2D(uGrassN, vFieldPos.xy / ${140 .toFixed(1)}).xyz * 2.0 - 1.0;
          vec3 pn = normalize(vec3(tn.xy * 1.1, tn.z));
          vec3 pv = normalize((viewMatrix * vec4(pn, 0.0)).xyz);
          normal = normalize(mix(normal, pv, 0.85 * (1.0 - gFar)));
        }`)},t.customProgramCacheKey=()=>e.shell?`field-shell`:`field`,t}function Fh(){let e=[];for(let t=0;t<Mh.layers;t++){let n=new el(Mh.size,Mh.size,1,1),r=(t+1)/Mh.layers;n.setAttribute(`shellH`,new Y([r,r,r,r],1)),e.push(n)}let t=new X(Ch(e),Ph({shell:!0}));return t.receiveShadow=!0,t.frustumCulled=!1,t}var Ih=.2,Lh=(e,t,n)=>{let r=Math.max(0,Math.min(1,.5+.5*(t-e)/n));return t*(1-r)+e*r-n*r*(1-r)};function Rh(e,t,n){let r=Math.hypot(e,t),i=Math.atan2(t,e),a=r-n*.46;for(let e=0;e<3;e++){let t=i-(Math.PI/2+e*2*Math.PI/3+r/n*Ih);t=Math.atan2(Math.sin(t),Math.cos(t));let o=Math.abs(r*Math.sin(t)),s=r*Math.cos(t),c=o-n*.2,l=s-n,u=n*.06,d=Math.hypot(Math.max(c+u,0),Math.max(l+u,0))+Math.min(Math.max(c,l),0)-u;a=Lh(a,s>0?d:1e9,n*.22)}return a}function zh(e,t,n=240){let r=[];for(let i=0;i<n;i++){let a=i/n*Math.PI*2,o;if(t){let t=0,n=e*1.2;for(let r=0;r<30;r++){let r=(t+n)/2;Rh(Math.cos(a)*r,Math.sin(a)*r,e)<0?t=r:n=r}o=t}else o=e*(.74+.26*(.5+.5*Math.cos(3*(a-Math.PI/2)))**1.4);r.push(new W(Math.cos(a)*o,Math.sin(a)*o))}return new dc(r)}function Bh(e,t){let n=new hl({color:16777215,roughness:.5,metalness:.05,clearcoat:.2,clearcoatRoughness:.3,envMapIntensity:.35});return n.onBeforeCompile=n=>{n.vertexShader=n.vertexShader.replace(`#include <common>`,`#include <common>
varying vec2 vPadP;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vPadP = position.xy;`),n.fragmentShader=n.fragmentShader.replace(`#include <common>`,`#include <common>
varying vec2 vPadP;`).replace(`#include <color_fragment>`,`#include <color_fragment>
        {
          float r = length(vPadP) / ${t.toFixed(1)};
          float th = atan(vPadP.y, vPadP.x);
          vec3 blue = vec3(0.05, 0.058, 0.075);
          float t;
          ${e?`
          // arms: blue-grey toward their flanks, white along the middle
          float best = 1.0;
          for (int k = 0; k < 3; k++) {
            float ca = 1.5707963 + float(k) * 2.0943951 + ${Ih.toFixed(3)} * r;
            float dl = atan(sin(th - ca), cos(th - ca));
            best = min(best, abs(r * sin(dl)) / 0.2);
          }
          t = smoothstep(0.2, 0.95, best) * smoothstep(0.5, 0.6, r);`:`
          // blue-grey facets between the lobes, outside the centre ring
          float c = 0.5 + 0.5 * cos(3.0 * (th - 1.5707963));
          t = smoothstep(0.7, 0.2, c) * smoothstep(0.56, 0.64, r);`}
          diffuseColor.rgb = mix(vec3(0.3, 0.305, 0.315), blue, t);
        }`)},n.customProgramCacheKey=()=>`padtop`+(e?`B`:`S`),n}function Vh(e,t){let n=e.attributes.position;for(let e=0;e<n.count;e++){let r=n.getX(e),i=n.getY(e),a=Ih*Math.hypot(r,i)/t,o=Math.cos(a),s=Math.sin(a);n.setXY(e,r*o-i*s,r*s+i*o)}return e.computeVertexNormals(),e}function Hh(e,t,n){let r=new dc,i=(t-e)/2,a=(e+t)/2,o=(e,t)=>[-Math.sin(t)*e,Math.cos(t)*e],s=e=>[-Math.cos(e),-Math.sin(e)],c=e=>[-Math.sin(e),Math.cos(e)];for(let e=0;e<=24;e++){let[i,a]=o(t,-n+2*n*e/24);e===0?r.moveTo(i,a):r.lineTo(i,a)}let l=(e,t)=>{let[n,l]=o(a,e),u=s(e),d=c(e);for(let e=1;e<12;e++){let a=e/12*Math.PI;r.lineTo(n+t*(d[0]*Math.cos(a)+u[0]*Math.sin(a))*i,l+t*(d[1]*Math.cos(a)+u[1]*Math.sin(a))*i)}};l(n,1);for(let t=0;t<=24;t++){let[i,a]=o(e,n-2*n*t/24);r.lineTo(i,a)}return l(-n,-1),r.closePath(),r}function Uh(e,t,n){return new Yc(e,{depth:t,bevelEnabled:n>0,bevelThickness:n,bevelSize:n,bevelSegments:3,curveSegments:8})}function Wh(e,t,n,r,i){let a=new dc,o=[[-n/2,e],[n/2,e],[r/2,t],[-r/2,t]],s=o.length;for(let e=0;e<s;e++){let t=o[(e+s-1)%s],n=o[e],r=o[(e+1)%s],c=Math.hypot(t[0]-n[0],t[1]-n[1]),l=Math.hypot(r[0]-n[0],r[1]-n[1]),u=Math.min(i,c/2,l/2),d=[n[0]+(t[0]-n[0])/c*u,n[1]+(t[1]-n[1])/c*u],f=[n[0]+(r[0]-n[0])/l*u,n[1]+(r[1]-n[1])/l*u];e===0?a.moveTo(d[0],d[1]):a.lineTo(d[0],d[1]),a.quadraticCurveTo(n[0],n[1],f[0],f[1])}return a.closePath(),a}var Gh=`
  varying vec3 vL; varying vec3 vN; varying vec3 vV;
  void main() {
    vL = position; vN = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0); vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }`,Kh=`
  // fine perforated mesh (spent state): dark with a grid of lighter holes
  vec3 meshPattern(vec2 p, float cell, vec3 warm) {
    vec2 g = abs(fract(p / cell) - 0.5);
    float hole = smoothstep(0.32, 0.22, max(g.x, g.y));
    return mix(vec3(0.05, 0.05, 0.06), vec3(0.11, 0.105, 0.11), hole) + warm;
  }
`,qh=`
  uniform float uTime, uOn, uBig, uR, uPhase;
  varying vec3 vL; varying vec3 vN; varying vec3 vV;
  ${Kh}
  void main() {
    vec2 p = vL.xy / uR; float r = length(p); float a = atan(p.y, p.x);
    vec3 off = meshPattern(vL.xy, 2.6, vec3(0.16, 0.07, 0.02) * pow(max(1.0 - r, 0.0), 1.5));
    vec3 lit;
    if (uBig > 0.5) {
      // radial sun: yellow centre to orange rim, fine rays, a dashed white ring near the edge
      vec3 c = mix(vec3(2.2, 1.45, 0.12), vec3(1.4, 0.35, 0.0), smoothstep(0.0, 0.95, r));
      c *= 0.88 + 0.12 * cos(a * 36.0);
      float dash = step(0.45, fract(a / 6.2831853 * 28.0 + uTime * 0.05));
      float ring = (1.0 - smoothstep(0.012, 0.03, abs(r - 0.84))) * dash;
      lit = mix(c, vec3(2.4, 2.1, 1.4), ring);
      lit *= 0.95 + 0.05 * sin(uTime * 3.0 + uPhase);
    } else {
      // concentric rings: bright rim ring, dark gap, inner filled glow with a bright ring, hot dot
      float pulse = 0.9 + 0.1 * sin(uTime * 3.0 + uPhase);
      vec3 orange = vec3(1.4, 0.35, 0.0), yellow = vec3(2.3, 1.5, 0.15);
      lit = orange * (0.55 + 0.45 * (1.0 - r));
      lit = mix(lit, vec3(0.12, 0.03, 0.0), 1.0 - smoothstep(0.02, 0.06, abs(r - 0.72)));        // dark gap
      lit += yellow * (1.0 - smoothstep(0.015, 0.05, abs(r - 0.9))) * 0.9;                       // rim ring
      lit += yellow * (1.0 - smoothstep(0.02, 0.06, abs(r - 0.42)));                             // inner ring
      lit = mix(lit, vec3(2.5, 1.9, 0.6), 1.0 - smoothstep(0.1, 0.16, r));                       // hot dot
      lit *= pulse;
    }
    gl_FragColor = vec4(mix(off, lit, uOn), 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`,Jh=`
  uniform float uTime, uOn, uMode, uY0, uLen, uPhase;
  varying vec3 vL; varying vec3 vN; varying vec3 vV;
  ${Kh}
  void main() {
    float t = clamp((vL.y - uY0) / uLen, 0.0, 1.0);
    vec3 off = uMode > 0.5 ? vec3(0.78, 0.74, 0.64) * (0.8 + 0.2 * t)           // spent end block: cream
                           : meshPattern(vL.xy, 2.2, vec3(0.03, 0.015, 0.0));   // spent plate: dark mesh
    // active: orange with a yellow band across the middle (reads like a lit lens)
    float band = 1.0 - smoothstep(0.1, 0.42, abs(t - 0.45));
    // RL: glowing yellow core, deep orange-red toward the ends (emissive, blooms)
    vec3 lit = mix(vec3(1.3, 0.28, 0.0), vec3(2.3, 1.55, 0.12), band);
    lit *= 0.6 + 0.4 * sin(3.14159 * t);
    lit *= 0.95 + 0.05 * sin(uTime * 3.0 + uPhase);
    gl_FragColor = vec4(mix(off, lit, uOn), 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`,Yh=`
  varying vec2 vUv; varying float vFacing;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * normal);
    vFacing = abs(dot(n, normalize(-mv.xyz)));
    gl_Position = projectionMatrix * mv;
  }`,Xh=`
  uniform float uTime, uOn, uPhase;
  varying vec2 vUv; varying float vFacing;
  float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float n2(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
  void main() {
    float y = clamp(vUv.y, 0.0, 1.0); // interpolation can overshoot 1 -> pow(negative) = NaN
    float x = clamp(vUv.x, 0.0, 1.0);
    // wisps: licks of light that break up as they rise
    float n = n2(vec2(x * 3.0 + uPhase, y * 2.0 - uTime * 0.8));
    float fade = pow(1.0 - y, 1.6) * smoothstep(0.0, 0.05, y);
    float edge = pow(max(sin(3.14159 * x), 0.0), 0.8);
    float vol = smoothstep(0.05, 0.45, vFacing);
    vec3 col = mix(vec3(1.0, 0.4, 0.02), vec3(1.0, 0.75, 0.15), pow(1.0 - y, 1.5));
    float a = fade * edge * vol * uOn * (0.85 + 0.15 * n);
    gl_FragColor = vec4(col * a * 0.6, 1.0);
  }`;function Zh(e,t,n){let r=[],i=[],a=[],o=[[-e/2,-t/2],[e/2,-t/2],[e/2,t/2],[-e/2,t/2]];for(let e=0;e<4;e++){let[t,s]=o[e],[c,l]=o[(e+1)%4],u=l-s,d=-(c-t),f=Math.hypot(u,d),p=[[t,s,0,0,0],[c,l,0,1,0],[c,l,n,1,1],[t,s,0,0,0],[c,l,n,1,1],[t,s,n,0,1]];for(let e of p)r.push(e[0],e[1],e[2]),i.push(e[3],e[4]),a.push(u/f,d/f,0)}let s=new to;return s.setAttribute(`position`,new Y(r,3)),s.setAttribute(`normal`,new Y(a,3)),s.setAttribute(`uv`,new Y(i,2)),s}var Qh=`
  uniform float uOn;
  varying vec3 vL; varying vec3 vN; varying vec3 vV;
  void main() {
    float f = pow(max(dot(normalize(vN), normalize(vV)), 0.0), 1.5);
    gl_FragColor = vec4(vec3(1.0, 0.45, 0.08) * f * 0.35 * uOn, 1.0);
  }`,$h=`varying vec3 vN; varying vec3 vV; void main(){ vN = normalize(normal); vec4 mv = modelViewMatrix * vec4(position, 1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,eg=`
  uniform float uTime;
  varying vec3 vN; varying vec3 vV;
  float h(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float n3(vec3 p) {
    vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(h(i), h(i + vec3(1,0,0)), f.x), mix(h(i + vec3(0,1,0)), h(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(h(i + vec3(0,0,1)), h(i + vec3(1,0,1)), f.x), mix(h(i + vec3(0,1,1)), h(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  void main() {
    // RL: molten orange marble, thin bright swirls over darker orange-red, glowing golden rim
    vec3 p = vN * 3.2 + vec3(0.0, 0.0, -uTime * 0.9);
    float w = n3(p * 0.7 + uTime * 0.2);
    float f = n3(p + w * 2.0) * 0.6 + n3(p * 2.3 + 3.7) * 0.3 + n3(p * 5.1 - 1.1) * 0.1;
    float swirl = 1.0 - smoothstep(0.0, 0.07, abs(f - 0.5));
    vec3 dark = vec3(1.1, 0.36, 0.01), mid = vec3(1.9, 0.95, 0.08), hot = vec3(2.6, 1.9, 0.5);
    vec3 c = mix(dark, mid, smoothstep(0.3, 0.6, f));
    c = mix(c, hot, swirl * 0.85);
    // clamp: dot of unit vectors can round past 1 and Metal returns NaN for pow() of a negative base
    float rim = pow(clamp(1.0 - dot(vN, vV), 0.0, 1.0), 2.5);
    c = mix(c, vec3(1.3, 0.85, 0.3), rim * 0.8);
    gl_FragColor = vec4(c, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;function tg(e){let t=new Ji,n={small:Bh(!1,72),big:Bh(!0,150)},r=new ml({color:723983,roughness:.45,metalness:.6}),i=new hl({color:9343900,roughness:.3,metalness:.1,clearcoat:.4,clearcoatRoughness:.2}),a={value:0},o=[];return e.forEach((e,s)=>{let c=e.big,l=c?150:72,u={value:1},d=s*1.37,f=new Ji;f.position.set(e.x,e.y,0),f.rotation.z=s*.7%(Math.PI*2/3),f.scale.setScalar(c?.7:.66);let p=c?9:7,m=new X(Uh(zh(l,c),p,1.8),[c?n.big:n.small,r]);m.receiveShadow=!0,f.add(m);let h=p+1.8,g=c?44:30,_=new X(new nl(g+(c?7:5),c?6:4.5,14,80),i);_.position.z=h+.5,_.scale.z=.5,f.add(_);let v=new ml({color:460810,roughness:.6,metalness:.4}),y=new X(new Ns(g+2,g+2,2,64),v);y.rotation.x=Math.PI/2,y.position.z=h-.4,f.add(y);let b=new fl({uniforms:{uTime:a,uOn:u,uBig:{value:+!!c},uR:{value:g},uPhase:{value:d}},vertexShader:Gh,fragmentShader:qh}),x=new X(new Ms(g,72),b);x.position.z=h+.7,f.add(x);let S=[],C=(e,t,n,r,i,o)=>{let s=new fl({uniforms:{uTime:a,uOn:u,uPhase:{value:d+o*2.1}},vertexShader:Yh,fragmentShader:Xh,transparent:!0,depthWrite:!1,blending:2,side:2}),c=new X(Zh(t,n,r),s);c.position.z=i,c.renderOrder=5,e.add(c),S.push(c)},w=(e,t,n,r)=>new fl({uniforms:{uTime:a,uOn:u,uMode:{value:e},uY0:{value:t},uLen:{value:n},uPhase:{value:d+r}},vertexShader:Gh,fragmentShader:Jh});for(let e=0;e<3;e++){let t=e*2*Math.PI/3,n=new Ji;if(n.rotation.z=t,f.add(n),c){let n=(e,n)=>{let r=new Ji;return r.rotation.z=t,f.add(r),r},i=e=>Vh(e,l),a=g+20,o=l*.8,s=n(a,o),c=new X(i(Uh(Wh(a-4,o+3,50,50,8),1.5,0)),r);c.position.z=h-.2,s.add(c);let u=new X(i(Uh(Wh(a,o,42,43,7),1.2,0)),w(0,a,o-a,e));u.position.z=h+.4,s.add(u);let d=l*.84,p=l*.99,m=n(d,p),_=new X(i(Uh(Wh(d-3,p+3,60,60,8),8,1.2)),r);_.position.z=h-1,m.add(_);let v=new X(i(Uh(Wh(d+2,p-2,42,42,5),1.2,0)),w(1,d,p-d,e+.5));v.position.z=h+8.6,m.add(v);let y=new Ji,b=Ih*(d+p)/2/l;y.position.set(-Math.sin(b)*(d+p)/2,Math.cos(b)*(d+p)/2,0),y.rotation.z=b,m.add(y),C(y,40,26,55,h+9.5,e);let x=Ih*(a+o)/2/l,S=(a+o)/2,T=new Ji;T.position.set(-Math.sin(x)*S,Math.cos(x)*S,0),T.rotation.z=x,s.add(T),C(T,40,60,45,h+1.5,e+3)}else{let t=l*.75,i=l*.85,a=t,o=i,s=new X(Uh(Hh(t-3,i+3,.34),3,.8),r);s.position.z=h-1.5,n.add(s);let c=new X(Uh(Hh(t,i,.3),1,0),w(0,a,o-a,e));c.position.z=h+2.4,n.add(c);let u=new Ji;u.position.set(0,(t+i)/2,0),n.add(u),C(u,30,6,30,h+3,e)}}C(f,g*1.4,g*1.4,c?60:45,h+1,7);let T;c||(T=new X(new tl(g*1.05,32,16,0,Math.PI*2,0,Math.PI/2),new fl({uniforms:{uOn:u},vertexShader:Gh,fragmentShader:Qh,transparent:!0,depthWrite:!1,blending:2})),T.rotation.x=Math.PI/2,T.scale.set(1,.55,1),T.position.z=h+.5,T.renderOrder=5,f.add(T));let E;if(c){E=new Ji;let e=new X(new Qc(27,4),new fl({uniforms:{uTime:a},vertexShader:$h,fragmentShader:eg}));E.add(e);let t=new X(new el(1,1),new fl({uniforms:{uSize:{value:86.4}},vertexShader:`uniform float uSize; varying vec2 vUv; void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          mv.xy += position.xy * uSize; gl_Position = projectionMatrix * mv; }`,fragmentShader:`varying vec2 vUv; void main(){ float r = length(vUv - 0.5) * 2.0; float g = pow(max(1.0 - r, 0.0), 2.2);
          gl_FragColor = vec4(vec3(1.0, 0.55, 0.12) * g * 0.9, 1.0); }`,transparent:!0,depthWrite:!1,blending:2}));t.renderOrder=6,t.frustumCulled=!1,E.add(t),E.position.z=160,f.add(E)}t.add(f),o.push({big:c,on:u,fire:E,dome:T,shafts:S,phase:d})}),{group:t,update(e,t){a.value=e,o.forEach((n,r)=>{let i=t[r]??!0;n.on.value+=(+!!i-n.on.value)*.2;let a=n.on.value>.02;for(let e of n.shafts)e.visible=a;n.dome&&(n.dome.visible=a),n.fire&&(n.fire.visible=i,n.fire.position.z=160+Math.sin(e*2+n.phase)*12,n.fire.rotation.z=e*1.2)})}}}var ng={cornerR:85,faceW:0,height:20,lipR:18,hexW:57,bracketW:38};function rg(e,t,n,r){let i=Ne(e);if(t>=i){n.set(e,l,t),r.set(0,-1,0);return}let a=Math.max(-1,Math.min(1,(i-Math.max(t,0))/i)),o=Math.acos(a);n.set(e,l-i+i*Math.sin(o),i-i*Math.cos(o)),r.set(0,-Math.sin(o),Math.cos(o))}function ig(){let e=ng.cornerR,t=f,n=[],r=0,i=(e,t,i,a)=>{if(n.length){let i=n[n.length-1];r+=Math.hypot(e-i.x,t-i.v)}n.push({x:e,v:t,ox:i,ov:a,s:r})},a=t-e;for(let e=0;e<a;e+=12)i(-893,e,-1,0);for(let t=0;t<=24;t++){let n=Math.PI-t/24*(Math.PI/2);i(-893+e+e*Math.cos(n),a+e*Math.sin(n),Math.cos(n),Math.sin(n))}for(let n=-893+e+12;n<893-e;n+=12)i(n,t,0,1);for(let t=0;t<=24;t++){let n=Math.PI/2-t/24*(Math.PI/2);i(893-e+e*Math.cos(n),a+e*Math.sin(n),Math.cos(n),Math.sin(n))}for(let e=a-12;e>0;e-=12)i(893,e,1,0);return i(893,0,1,0),n}function ag(e){let{height:t,lipR:n}=ng,r=t*e,i=[[0,NaN],[0,-24],[-n*.8,-12]];for(let e=0;e<=12;e++){let t=Math.PI+e/12*Math.PI*.75;i.push([-n*.45+n*.55*Math.cos(t)*1,r*.45+r*.55*-Math.sin(t)])}return i.push([8,r*.2],[10,0],[10,-3]),i}function og(e,t){let n=ig(),r=ag(1).length,i=[],a=[],o=new G,s=new G,c=new G,l=new G,u=[];for(let t of n){let n=ag(1);for(let o=0;o<r;o++){let[r,s]=n[o];Number.isNaN(s)&&(s=-30),rg(t.x+t.ox*r,t.v+t.ov*r,c,l),c.addScaledVector(l,s),i.push(c.x,c.y*e,c.z),a.push(t.s,r)}for(let n of[-ng.lipR*.4,-ng.lipR*.2])rg(t.x+t.ox*n,t.v+t.ov*n,o,s),o.addScaledVector(s,ng.height*1+.6),u.push(o.x,o.y*e,o.z)}let d=[],f=[];for(let t=0;t<n.length-1;t++){for(let n=0;n<r-1;n++){let i=t*r+n,a=(t+1)*r+n;e>0?d.push(i,i+1,a,a,i+1,a+1):d.push(i,a,i+1,a,a+1,i+1)}let n=t*2,i=(t+1)*2;e>0?f.push(n,n+1,i,i,n+1,i+1):f.push(n,i,n+1,i,i+1,n+1)}let p=new to;p.setAttribute(`position`,new Y(i,3)),p.setAttribute(`uv`,new Y(a,2)),p.setIndex(d),p.computeVertexNormals();let m=new X(p,new hl({color:13224928,metalness:.7,roughness:.25,clearcoat:.8,clearcoatRoughness:.12,side:2}));m.castShadow=!0,m.receiveShadow=!0;let h=new to;h.setAttribute(`position`,new Y(u,3)),h.setIndex(f);let g=new X(h,new _o({color:t.clone().lerp(new J(1,1,1),.8).multiplyScalar(1.1),toneMapped:!1,side:2})),_=new Ji;return _.add(m,g),_}var sg=`
  float goalRimDist(float x, float v) {
    vec2 q = vec2(abs(x) - ${(893-ng.cornerR).toFixed(1)}, v - ${(f-ng.cornerR).toFixed(1)});
    if (q.y < 0.0) return abs(x) - ${893 .toFixed(1)};
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - ${ng.cornerR.toFixed(1)};
  }
`,cg={blue:new J(2059263),orange:new J(16742938)};function lg(){let e=c-420,t=l-420,n=d-420*Math.SQRT2,r=n-t,i=n-e,a=[[e,-i],[e,i],[r,t],[-r,t],[-e,i],[-e,-i],[-r,-t],[r,-t]],o=[],s=a.length;for(let e=0;e<s;e++){let t=a[e],n=a[(e+1)%s],r=n[0]-t[0],i=n[1]-t[1],c=Math.hypot(r,i),l=i/c,u=-r/c,d=[],f=Math.max(2,Math.ceil(c/160));for(let e=0;e<=f;e++)d.push(e/f);if(Math.abs(u)>.99){for(let e of[-893,893]){let n=(e-t[0])/r;n>0&&n<1&&d.push(n);for(let n=1;n<=24;n++){let i=(e+n/24*Math.sign(e)*490-t[0])/r;i>0&&i<1&&d.push(i)}}d.sort((e,t)=>e-t)}for(let e=0;e<d.length-1;e++){let n=d[e];o.push({x:t[0]+r*n+l*420,y:t[1]+i*n+u*420,nx:l,ny:u,s:0})}let p=a[(e+2)%s],m=p[0]-n[0],h=p[1]-n[1],g=Math.hypot(m,h),_=h/g,v=-m/g,y=Math.atan2(u,l),b=Math.atan2(v,_);for(;b<y;)b+=Math.PI*2;for(let e=0;e<6;e++){let t=y+(b-y)*e/6,r=Math.cos(t),i=Math.sin(t);o.push({x:n[0]+r*420,y:n[1]+i*420,nx:r,ny:i,s:0})}}let u=0;for(let e=0;e<o.length;e++)e>0&&(u+=Math.hypot(o[e].x-o[e-1].x,o[e].y-o[e-1].y)),o[e].s=u;return o}function ug(){let e=[];for(let t=0;t<=10;t++){let n=t/10*(Math.PI/2);e.push({d:256-256*Math.sin(n),z:256-256*Math.cos(n),nd:Math.sin(n),nz:Math.cos(n)})}for(let t of[f,900,1200,1500,u-256])e.push({d:0,z:t,nd:1,nz:0});for(let t=1;t<=10;t++){let n=t/10*(Math.PI/2);e.push({d:256-256*Math.cos(n),z:u-256+256*Math.sin(n),nd:Math.cos(n),nz:-Math.sin(n)})}let t=0;return e.map((n,r)=>(r>0&&(t+=Math.hypot(n.d-e[r-1].d,n.z-e[r-1].z)),{...n,v:t}))}var dg=`
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec2 vUv;
  void main() {
    vPos = position;
    vNormal = normal;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,fg=`
  uniform vec3 uBlue;
  uniform vec3 uOrange;
  uniform float uTime;
  uniform float uHexSize;
  uniform float uBaseAlpha;
  uniform float uLineAlpha;
  uniform float uLowerSolid;
  uniform float uTriplanar;
  uniform vec3 uCamPos;
  uniform float uGoalDebug;
  ${xh}
  ${sg}
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec2 vUv;

  float hexDist(vec2 p) {
    p = abs(p);
    return max(dot(p, normalize(vec2(1.0, 1.7320508))), p.x);
  }
  vec4 hexCoords(vec2 uv) {
    vec2 r = vec2(1.0, 1.7320508);
    vec2 h = r * 0.5;
    vec2 a = mod(uv, r) - h;
    vec2 b = mod(uv - h, r) - h;
    vec2 gv = dot(a, a) < dot(b, b) ? a : b;
    vec2 id = uv - gv;
    return vec4(gv, id);
  }
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  float aa(float d, float w) { float f = fwidth(d) + 1e-4; return 1.0 - smoothstep(w - f, w + f, abs(d)); }

  void main() {
    float team = smoothstep(-500.0, 500.0, vPos.y);
    vec3 col = mix(uBlue, uOrange, team);
    vec3 N = normalize(vNormal);
    vec3 viewDir = normalize(uCamPos - vPos);
    float fres = pow(max(1.0 - abs(dot(viewDir, N)), 0.0), 3.0);
    vec3 sunDir = normalize(vec3(0.615, -0.135, 0.777)); // = SUN_DIR
    float lambert = max(dot(N, sunDir), 0.0);

    // ---- glass: nearly invisible, faint hex texture, slim silver mullions ----
    vec4 hc = hexCoords(vUv / uHexSize);
    float hexLine = aa(0.5 - hexDist(hc.xy), 0.015);
    float rib = aa(mod(vUv.x + 256.0, 512.0) - 256.0, 3.5);            // vertical mullions
    float band = aa(vPos.z - 1150.0, 3.5) + aa(vPos.z - 1780.0, 4.0);   // horizontal rails
    float frame = max(rib, band);
    if (uTriplanar > 0.5) {
      // curved goal net: hex cells projected along the dominant normal axis, no mullions
      vec3 w = pow(abs(N), vec3(6.0)); w /= w.x + w.y + w.z;
      hexLine = w.x * aa(0.5 - hexDist(hexCoords(vPos.yz / uHexSize).xy), 0.015)
              + w.y * aa(0.5 - hexDist(hexCoords(vPos.xz / uHexSize).xy), 0.015)
              + w.z * aa(0.5 - hexDist(hexCoords(vPos.xy / uHexSize).xy), 0.015);
      frame = 0.0;
    }
    vec3 sky = vec3(0.75, 0.82, 0.92);
    vec3 glass = sky * 0.06 + mix(sky, col, 0.35) * hexLine * 0.12 + sky * fres * 0.25;
    vec3 metal = vec3(0.55, 0.57, 0.6) * (0.35 + 0.9 * lambert) + sky * 0.12;
    vec3 c = mix(glass, metal, frame);
    float alpha = uBaseAlpha + hexLine * uLineAlpha + fres * 0.18 + frame * 0.9;

    // ---- RL boards (heights solved from survey/wall_e, details from close-ups): the side / back walls are
    // ice-hockey style boards up to ~337 uu, clear glass above. Bottom to top:
    //   silver floor lip | recessed blue-lit hex window strip | big curved satin panels with a raised plate
    //   edge, double-groove cable seams every 274 uu and a lamp atop each | thick rail 150..166 |
    //   framed hex-glass windows 166..245 | bevelled frame with notches 245..290 | neon hex strip 290..310 |
    //   top rail 310..337
    if (uLowerSolid > 0.5) {
      float z = vPos.z;
      float s = vUv.x;
      vec3 up = vec3(0.0, 0.0, 1.0);
      float solid = 1.0;
      float emit = 0.0;          // 1 = unlit (lights)
      vec3 alb = vec3(0.42, 0.44, 0.48);
      float tilt = 0.0;          // fake bevel: + faces up (catches the sky), - faces down
      float gloss = 0.55;        // env reflection strength
      float glassA = 0.0;        // >0: translucent glass

      // seams: double grooves that sweep sideways toward the floor
      float t = clamp(z / 150.0, 0.0, 1.0);
      float seamS = mod(s + 90.0 * pow(1.0 - t, 1.6) + 137.0, 274.0) - 137.0;
      float groove = max(aa(seamS - 2.2, 0.9), aa(seamS + 2.2, 0.9));

      if (z < 7.0) {
        // silver floor lip with a groove along its top
        alb = vec3(0.78, 0.8, 0.84); gloss = 0.7;
        tilt = 0.6;
        alb *= 1.0 - 0.6 * aa(z - 5.5, 0.8);
      } else if (z < 40.0) {
        // recessed strip of blue-lit hex glass, framed top and bottom
        vec4 wh = hexCoords(vec2(s, z) / 17.0);
        float edge = aa(0.5 - hexDist(wh.xy), 0.028);
        // dark glass lit from behind: deeper at the bottom, a sky sheen across the top of each cell
        vec3 deep = mix(vec3(0.015, 0.035, 0.14), vec3(0.14, 0.04, 0.01), team);
        vec3 lit = mix(deep, deep * 2.2 + vec3(0.05, 0.07, 0.12), smoothstep(-0.45, 0.5, wh.y) * (0.7 + 0.3 * hash(wh.zw)));
        lit += vec3(0.3, 0.36, 0.5) * fres * 0.3;
        alb = mix(lit, vec3(0.62, 0.66, 0.75), edge * 0.9);
        emit = 1.0;
        float fr = max(aa(z - 8.5, 1.6), aa(z - 38.5, 1.6));             // metal frame lines
        if (fr > 0.01) { alb = mix(alb, vec3(0.55, 0.57, 0.6), fr); emit = 1.0 - fr; }
      } else if (z < 150.0) {
        // curved satin panel; a raised plate edge (lighter ridge + shadow) at ~105 that steps down
        // toward each seam
        float stepS = smoothstep(60.0, 20.0, abs(seamS));                 // near a seam
        float ridgeZ = 105.0 - 22.0 * stepS;
        float ridge = aa(z - ridgeZ, 1.6);
        float below = aa(z - ridgeZ + 3.0, 1.6);
        alb = vec3(0.3, 0.32, 0.37);                                        // satin blue-grey
        tilt = ridge * 0.9 - below * 0.9 + 0.15;
        alb *= mix(0.62, 1.0, smoothstep(40.0, 135.0, z));                // darker toward the floor
        alb = mix(alb, vec3(0.05, 0.055, 0.06), groove);
        gloss = 0.8;
        // lamp at the top of each seam
        float lamp = aa(seamS, 4.5) * step(137.0, z) * step(z, 147.0);
        vec3 lampC = mix(mix(vec3(0.6, 2.2, 3.0), vec3(3.0, 1.4, 0.5), team), vec3(2.6), 1.0 - abs(team * 2.0 - 1.0));
        if (lamp > 0.01) { alb = mix(alb, lampC, lamp); emit = lamp; }
      } else if (z < 166.0) {
        // thick rail: bevelled top and bottom, dark groove in the middle
        alb = vec3(0.4, 0.42, 0.46);
        tilt = (z - 158.0) / 8.0;
        alb *= 1.0 - 0.65 * aa(z - 158.0, 0.9);
        gloss = 0.65;
      } else if (z < 245.0) {
        // windows: thick rounded mullions every 410 uu, sills top and bottom; semi-opaque hex glass
        float ws = mod(s + 205.0, 410.0) - 205.0;
        vec2 q = vec2(abs(ws), abs(z - 205.5));
        vec2 half_ = vec2(205.0 - 11.0, 39.5 - 6.0);
        vec2 dq = q - half_ + 6.0;
        float boxD = length(max(dq, 0.0)) + min(max(dq.x, dq.y), 0.0) - 6.0; // rounded rect, <0 inside glass
        float frameM = smoothstep(-0.8, 0.8, boxD);
        vec4 gh = hexCoords(vec2(s, z) / 24.0);
        float gl = aa(0.5 - hexDist(gh.xy), 0.04);
        glassA = (1.0 - frameM);
        alb = mix(vec3(0.42, 0.44, 0.48), vec3(0.3, 0.32, 0.36), 0.0);
        tilt = frameM * clamp(boxD / 6.0, -1.0, 1.0) * sign(z - 205.5);
        gloss = 0.6;
        solid = frameM;
        // glass: grey hex cells, reflective
        vec3 R = reflect(-viewDir, N);
        vec3 env = mix(vec3(0.3, 0.34, 0.3), mix(vec3(0.85, 0.9, 1.0), vec3(0.5, 0.65, 0.95), smoothstep(0.2, 0.9, R.z)), smoothstep(-0.1, 0.12, R.z));
        // tinted by the half it's in (RL: blue hex glass on the blue side, orange on the orange side)
        vec3 tint = mix(vec3(0.16, 0.3, 0.75), vec3(0.75, 0.35, 0.12), team);
        tint = mix(tint, vec3(0.45, 0.45, 0.5), pow(1.0 - abs(team * 2.0 - 1.0), 3.0));
        vec3 glassC = tint * (0.35 + 0.25 * lambert) + env * (0.2 + 0.35 * fres) + mix(tint, vec3(0.9), 0.5) * gl * 0.45;
        c = glassC;
        alpha = 0.5 + gl * 0.3 + fres * 0.2;
      } else if (z < 290.0) {
        // frame bar: bevelled, with a stepped notch every 820 uu
        float ns = abs(mod(s + 410.0, 820.0) - 410.0);
        float notchTop = 283.0 - 10.0 * smoothstep(60.0, 40.0, ns);
        alb = vec3(0.38, 0.4, 0.44);
        tilt = smoothstep(notchTop - 5.0, notchTop, z) - smoothstep(245.0, 252.0, z) * 0.0 - aa(z - 250.0, 2.5);
        alb *= 1.0 - 0.5 * aa(z - notchTop - 1.5, 0.9);
        gloss = 0.6;
      } else if (z < 310.0) {
        // neon hex strip: big cells with dark borders; cyan / orange by half, near white across halfway
        vec4 nh = hexCoords(vec2(s, z) / 9.5);
        float border = aa(0.5 - hexDist(nh.xy), 0.07);
        vec3 neon = mix(vec3(0.35, 1.0, 2.0), vec3(2.0, 0.75, 0.2), team);
        neon = mix(neon, vec3(1.8, 1.7, 2.1), pow(1.0 - abs(team * 2.0 - 1.0), 2.0));
        alb = mix(neon * (0.8 + 0.4 * hash(nh.zw)), vec3(0.08, 0.09, 0.1), border);
        emit = 1.0;
        float fr = max(aa(z - 290.8, 1.0), aa(z - 309.2, 1.0));
        if (fr > 0.01) { alb = mix(alb, vec3(0.3, 0.32, 0.35), fr); emit = 1.0 - fr; }
      } else if (z < 337.0) {
        // top rail: thick, lit on top, shadowed underneath
        alb = vec3(0.4, 0.42, 0.46);
        tilt = (z - 318.0) / 12.0;
        alb *= 1.0 - 0.55 * aa(z - 313.0, 1.2);
        gloss = 0.65;
      } else {
        solid = 0.0;
      }

      if (solid > 0.0) {
        vec3 Nb = normalize(N + up * clamp(tilt, -1.0, 1.0) * 0.9);
        float lb = max(dot(Nb, sunDir), 0.0);
        vec3 R = reflect(-viewDir, Nb);
        // cheap environment: grass below the horizon, bright sky above
        vec3 env = mix(vec3(0.22, 0.27, 0.2), mix(vec3(0.95, 0.97, 1.0), vec3(0.55, 0.7, 1.0), smoothstep(0.25, 0.95, R.z)), smoothstep(-0.12, 0.12, R.z));
        float spec = pow(max(dot(R, sunDir), 0.0), 40.0);
        vec3 shaded = alb * (0.24 + 0.5 * lb) + env * alb * gloss * 0.55 + vec3(1.0) * spec * 0.3 * gloss;
        shaded = mix(shaded, alb, emit);
        c = mix(c, shaded, solid);
        alpha = mix(alpha, 1.0, solid);
      }
    }

    // ---- around each goal mouth on the back wall (RL): cyan / orange hex light band just outside the
    // frame, then a grey bracket; the frame itself is geometry (src/render/goalFrame.ts)
    if (uLowerSolid > 0.5 && abs(vPos.y) > ${(l-256-2).toFixed(1)} && abs(vPos.x) < 3000.0) {
      float ga = goalRimDist(vPos.x, vPos.z) - ${ng.faceW.toFixed(1)};
      if (ga > -6.0 && ga < ${(ng.hexW+ng.bracketW).toFixed(1)}) {
        vec3 R = reflect(-viewDir, N);
        vec3 env = mix(vec3(0.22, 0.27, 0.2), vec3(0.85, 0.9, 1.0), smoothstep(-0.12, 0.12, R.z));
        if (ga < ${ng.hexW.toFixed(1)}) {
          vec4 gh = hexCoords(vec2(vPos.x, vUv.y) / 7.0);
          float border = aa(0.5 - hexDist(gh.xy), 0.1);
          vec3 neon = mix(vec3(0.06, 0.5, 1.25), vec3(1.25, 0.38, 0.05), team);
          c = mix(neon * (0.75 + 0.35 * hash(gh.zw)), vec3(0.06, 0.07, 0.09), border);
          c = mix(c, vec3(0.3, 0.32, 0.36), max(aa(ga + 3.0, 2.0), aa(ga - ${(ng.hexW-2).toFixed(1)}, 2.0)));
        } else {
          float t = (ga - ${ng.hexW.toFixed(1)}) / ${ng.bracketW.toFixed(1)};
          vec3 alb = vec3(0.4, 0.42, 0.47) * (1.0 - 0.5 * aa(t - 0.5, 0.06));
          c = alb * (0.3 + 0.55 * lambert) + env * alb * 0.5;
        }
        alpha = 1.0;
      }
    }

    // ceiling fillet darker
    float upper = smoothstep(1750.0, 2040.0, vPos.z);
    c = mix(c, c * 0.6, upper);
    // ---- goal interior (RL, survey/goal_blue_close): lavender-silver structure, framed glass panes,
    // cyan pill lights, dark ribbed roof with a lit hex skylight, back wall with a light strip, a lit
    // bracket and an A-frame window. Surfaces are classified by normal; patterns in goal coordinates.
    if (uTriplanar > 0.5) {
      float gy = abs(vPos.y);
      float d = gy - 5120.0;                   // depth behind the goal line
      float X = abs(vPos.x);
      float z = vPos.z;
      float ny = N.y * sign(vPos.y);           // < 0: faces the mouth (back wall)
      vec3 metalC = vec3(0.3, 0.31, 0.42);
      vec3 cyan = mix(vec3(0.25, 1.6, 2.6), vec3(2.6, 1.0, 0.25), team);
      vec3 alb = metalC;
      float solid = 1.0, emit = 0.0, gloss = 0.7, selfLit = 0.0;
      float zRoof = min(642.775, 542.0 - 0.32 * (gy - 5650.0));
      // classify by position (the shape is analytic; the ray-traced normals are too noisy for this)
      // back arc (radius 243 about d ~641, z ~255) bounds the side wall at the back
      float dBack = 641.0 + sqrt(max(0.0, 243.0 * 243.0 - (z - 255.0) * (z - 255.0)));
      bool isSide = X > 845.0 && z > 70.0 && z < zRoof - 75.0 && d < dBack - 20.0;
      bool isRoof = z > zRoof - 6.0 && X < 760.0 && d < 700.0;
      bool isBack = gy > 5790.0 && X < 780.0 && z < 520.0;
      if (isSide) {
        // ---- side wall (RL close-up): lavender structure, thick bevelled frames round every pane.
        // Bottom to top: kick panel with two cyan pills | lower row of 3 panes | raised mid rail with a
        // row of pills in a dark inset | upper row: small lit hex window at the front, 2 panes, top
        // following the roof slope. Panes are dark grey glass with big faint hex cells.
        vec3 lav = vec3(0.27, 0.3, 0.64);
        alb = lav; gloss = 0.6; selfLit = 0.5;
        float top = zRoof - 105.0;
        float back = dBack - 105.0;
        float inset = min(min(d - 42.0, back - d), min(top - z, z - 100.0));
        float bev = 0.0;                                    // +1 lit top edge, -1 shadowed lower edge
        if (inset < 0.0) {
          // outer frame: a groove ~14 uu in from the opening
          alb = lav * 1.05; bev = aa(inset + 16.0, 1.5) * -1.0 + aa(inset + 4.0, 1.5);
        } else if (z < 150.0) {
          alb = lav * 0.92;                                                           // kick panel
          alb *= 1.0 - 0.35 * aa(mod(d + 45.0, 90.0) - 45.0, 1.1);                    // ribbed plates
          bev = aa(z - 147.0, 2.0) - aa(z - 104.0, 2.0);
          vec2 pq = vec2(min(abs(d - 150.0), abs(d - 500.0)), abs(z - 125.0));
          if (pq.x < 30.0 && pq.y < 8.0) { alb = cyan; emit = 1.0; }
          else if (pq.x < 36.0 && pq.y < 13.0) { alb = vec3(0.08, 0.09, 0.12); }
        } else if (z > 290.0 && z < 348.0) {
          // raised mid rail, slanted front end, pills in a dark inset strip
          alb = lav * 1.12; bev = aa(z - 345.0, 2.2) - aa(z - 293.0, 2.2);
          float front = 60.0 + (z - 290.0) * 0.6;
          if (d < front) { alb = lav * 0.9; }
          if (z > 306.0 && z < 332.0 && d > front + 10.0 && d < back - 12.0) {
            alb = vec3(0.07, 0.08, 0.11);
            float seg = mod(d - front - 16.0, 96.0);
            if (seg < 80.0 && abs(z - 319.0) < 7.0) { alb = cyan; emit = 1.0; }
          }
        } else {
          // pane rows: mullions positions per row
          bool upper = z >= 348.0;
          float m1 = upper ? 150.0 : 205.0;
          float m2 = upper ? 360.0 : 385.0;
          float mw = 13.0;
          float dm = min(abs(d - m1), abs(d - m2));
          float rowIn = upper ? min(z - 348.0, top - z) : min(z - 150.0, 290.0 - z);
          float edge = min(dm - mw, min(rowIn - 8.0, inset - 8.0));
          if (edge < 0.0) {
            alb = lav; bev = aa(edge + 3.0, 1.5) * sign(z - (upper ? 420.0 : 220.0)) * 0.6;
          } else if (upper && d < m1 - mw && d > 70.0 && z < 470.0) {
            // small lit hex window at the front of the upper row
            vec4 lh = hexCoords(vec2(d, z) / 5.5);
            alb = mix(cyan * 0.85, cyan * 0.25, aa(0.5 - hexDist(lh.xy), 0.12)); emit = 1.0;
          } else {
            solid = 0.0;
          }
        }
        alb *= 1.0 + 0.35 * bev;
      } else if (isRoof) {
        // ---- roof (RL, survey/goal_blue_close): the flat part is opaque charcoal panelling with seams
        // running front to back, a silver beam behind the crossbar and a thick dark beam with brackets at
        // the back; the sloped part is a big framed hex-glass window with A-frame struts and a lit hex
        // skylight at the top centre
        float slopeD = 340.0;                                                  // glass starts before the slope (RL)
        if (d < slopeD) {
          alb = vec3(0.26, 0.25, 0.27) * mix(1.0, 0.45, smoothstep(60.0, slopeD, d)); gloss = 0.06;
          float px = mod(vPos.x + 175.0, 350.0) - 175.0;
          alb *= 0.85 + 0.3 * smoothstep(-175.0, 175.0, px);                   // panels catch light unevenly
          alb = mix(alb, vec3(0.025), aa(px, 2.0));
          alb = mix(alb, vec3(0.03), aa(d - 250.0, 1.6));
          if (d < 75.0) {                                                        // silver beam at the front
            alb = metalC * 0.85; gloss = 0.8;
            alb *= 1.0 - 0.5 * max(aa(d - 70.0, 2.0), aa(d - 35.0, 1.2));
          }
          if (d > slopeD - 55.0) {                                               // dark back beam + brackets
            alb = vec3(0.035, 0.035, 0.04);
            alb = mix(alb, metalC * 0.8, aa(d - (slopeD - 5.0), 3.0));
            if (abs(X - 560.0) < 24.0 && d > slopeD - 40.0) alb = metalC * 0.75;
          }
        } else {
          float t = clamp((d - slopeD) / 360.0, 0.0, 1.0);
          float strut = aa(X - (160.0 + 600.0 * t), 9.0);
          float frame = max(max(aa(d - slopeD - 6.0, 7.0), aa(X - 760.0, 16.0)), strut);
          solid = frame;
          alb = metalC * 0.8; gloss = 0.7;
          if (X < 150.0 && d > slopeD + 14.0 && d < slopeD + 150.0) {
            vec4 sh = hexCoords(vec2(vPos.x, d) / 8.0);
            alb = mix(cyan * 1.05, cyan * 0.35, aa(0.5 - hexDist(sh.xy), 0.08)); emit = 1.0; solid = 1.0;
            alb = mix(alb, metalC * 0.6, max(aa(X - 150.0, 5.0), max(aa(d - slopeD - 14.0, 5.0), aa(d - slopeD - 150.0, 5.0))));
          }
        }
      } else if (isBack) {
        // ---- back wall ----
        if (z < 14.0) { alb = metalC; }
        else if (z < 125.0) {
          // lower dark hex glass with posts
          float post = max(aa(X, 9.0), aa(X - 480.0, 9.0));
          vec4 bh = hexCoords(vec2(vPos.x, z) / 26.0);
          float hl = aa(0.5 - hexDist(bh.xy), 0.04);
          alb = mix(vec3(0.07, 0.08, 0.1) + hl * 0.25, metalC, post); gloss = 0.5;
        } else if (z < 185.0) {
          alb = metalC * 0.92;
          if (X < 190.0 - (z - 125.0) * 0.7) {                                    // lit bracket, cross mark
            alb = cyan * 0.9; emit = 1.0;
            float mark = max(step(X, 6.0) * step(abs(z - 155.0), 18.0), step(X, 26.0) * step(abs(z - 152.0), 3.5));
            if (mark > 0.5) { alb = vec3(0.05); emit = 0.0; }
          }
        } else if (z < 208.0) {
          alb = metalC * 0.6;
          float pill = step(abs(z - 196.0), 7.0) * step(mod(vPos.x + 52.0, 104.0), 90.0);
          if (pill > 0.5) { alb = cyan; emit = 1.0; }
        } else if (z < 245.0) {
          alb = vec3(0.16, 0.17, 0.2); gloss = 0.5;                                // dark rail
        } else {
          // big window: vertical mullions + A-frame diagonals
          float mullB = aa(X - 205.0, 9.0);
          float diag = aa((X - 870.0) + (z - 270.0) * (640.0 / 300.0), 12.0) * step(X, 880.0);
          float f = max(mullB, diag);
          solid = f;
          alb = metalC * 0.9;
        }
      } else {
        // ---- fillets (side-roof, side-floor, back arcs): big rounded lavender-silver tubes ----
        // plates along the tubes
        // tube shading: darker where the curve turns away from the viewer, a soft highlight band
        float facing = abs(dot(N, viewDir));
        alb = metalC * (0.55 + 0.75 * pow(facing, 0.8)); gloss = 0.9;
        // the upper (roof-side) tubes are charcoal in RL, the lower ones lavender-silver
        alb = mix(vec3(0.27, 0.3, 0.64) * (0.6 + 0.6 * facing), alb, smoothstep(40.0, 120.0, d) * 0.0 + 0.35); // lavender tint
        alb = mix(alb, vec3(0.13, 0.13, 0.15) * (0.6 + 0.6 * facing), smoothstep(zRoof - 260.0, zRoof - 150.0, z));
        selfLit = 0.35 * (1.0 - smoothstep(zRoof - 260.0, zRoof - 150.0, z));
        alb *= 1.0 - 0.35 * aa(mod(d + 70.0, 140.0) - 70.0, 1.3);
      }
      vec3 R = reflect(-viewDir, N);
      vec3 env = mix(vec3(0.24, 0.28, 0.24), mix(vec3(0.9, 0.93, 1.0), vec3(0.55, 0.68, 1.0), smoothstep(0.25, 0.95, R.z)), smoothstep(-0.12, 0.12, R.z));
      float spec = pow(max(dot(R, sunDir), 0.0), 36.0);
      vec3 shaded = alb * (0.4 + 0.35 * lambert) + env * alb * gloss * 0.3 + vec3(1.0) * spec * 0.2 * gloss;
      shaded = mix(shaded, alb * 1.1 + env * alb * 0.25, selfLit);  // the goal is lit from inside
      shaded = mix(shaded, alb, emit);
      // glass: grey hex, reflective, see-through
      vec4 gh = hexCoords(vec2(vPos.x + vPos.y, z) / (isSide ? 42.0 : 30.0));
      float gl = aa(0.5 - hexDist(gh.xy), 0.035);
      // RL's goal glass: light grey hex cells over a see-through pane, a soft sheen
      float cellShade = 0.8 + 0.2 * hash(gh.zw);
      vec3 glassC = vec3(0.2, 0.21, 0.24) * cellShade + env * (0.1 + 0.18 * fres) + vec3(0.7) * gl * (isSide ? 0.16 : 0.4);
      c = mix(glassC, shaded, solid);
      alpha = mix((isSide ? 0.5 : 0.34) + gl * 0.35 + fres * 0.12, 1.0, solid);
      if (uGoalDebug > 0.5) { c = isSide ? vec3(1,0,0) : isRoof ? vec3(0,1,0) : isBack ? vec3(0,0,1) : vec3(1,1,0); alpha = 1.0; }
    }

    // RL's ball rings, projected down onto walls / goal (src/render/ballIndicator.ts)
    float ringM = ballRingMask(vPos);
    c = mix(c, vec3(1.0), ringM);
    alpha = max(alpha, ringM);
    gl_FragColor = vec4(c, clamp(alpha, 0.0, 1.0));
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;function pg(e={}){return new fl({uniforms:{uBlue:{value:cg.blue.clone()},uOrange:{value:cg.orange.clone()},uTime:{value:0},uHexSize:{value:e.hexSize??160},uBaseAlpha:{value:e.baseAlpha??.12},uLineAlpha:{value:e.lineAlpha??.55},uLowerSolid:{value:e.lowerSolid??1},uTriplanar:{value:+!!e.triplanar},uCamPos:{value:new G},uGoalDebug:{value:0},...bh},vertexShader:dg,fragmentShader:fg,transparent:!0,depthWrite:!1,side:0})}function mg(e,t,n){return Math.abs(t)>4863&&Math.abs(e)<892.5&&n<642.275}function hg(){let e=lg(),t=ug(),n=e.length,r=t.length,i=[],a=[],o=[];for(let s=0;s<=n;s++){let c=e[s%n],l=s===n?e[n-1].s+Math.hypot(e[0].x-e[n-1].x,e[0].y-e[n-1].y):c.s,u=Ne(c.x)/256;for(let e=0;e<r;e++){let n=t[e],r=n.z<256.01,s=r?n.d*u:n.d,d=r?n.z*u:n.z;i.push(c.x-c.nx*s,c.y-c.ny*s,d),a.push(-c.nx*n.nd,-c.ny*n.nd,n.nz),o.push(l,n.v)}}let s=[];for(let e=0;e<n;e++)for(let t=0;t<r-1;t++){let n=e*r+t,a=(e+1)*r+t,o=(e+1)*r+t+1,c=e*r+t+1;mg((i[n*3]+i[a*3]+i[o*3]+i[c*3])/4,(i[n*3+1]+i[a*3+1]+i[o*3+1]+i[c*3+1])/4,(i[n*3+2]+i[a*3+2]+i[o*3+2]+i[c*3+2])/4)||s.push(n,c,a,a,c,o)}let c=new to;return c.setAttribute(`position`,new Y(i,3)),c.setAttribute(`normal`,new Y(a,3)),c.setAttribute(`uv`,new Y(o,2)),c.setIndex(s),c}function gg(){let e=lg(),t=[0,0,u],n=[0,0];for(let r of e)t.push(r.x-r.nx*256,r.y-r.ny*256,u),n.push(r.x,r.y);let r=[],i=e.length;for(let e=0;e<i;e++)r.push(0,1+(e+1)%i,1+e);let a=new to;return a.setAttribute(`position`,new Y(t,3)),a.setAttribute(`uv`,new Y(n,2)),a.setIndex(r),a.computeVertexNormals(),a}function _g(e){let t=new G(0,5560,321),n=150*Math.PI/180,r=[],i=new G;for(let e=0;e<=150;e++){let a=e/150*n;for(let e=0;e<240;e++){let n=e/240*Math.PI*2;i.set(Math.sin(a)*Math.cos(n),Math.cos(a),Math.sin(a)*Math.sin(n));let o=0,s=!1,c=new G;for(let e=0;e<200;e++){if(c.copy(t).addScaledVector(i,o),c.y<5120){c.copy(t).addScaledVector(i,(l-t.y)/i.y);let e=893-Math.abs(c.x),n=f-c.z,r=c.z;e<n&&e<r?c.x=Math.sign(c.x)*893:c.z=n<r?f:0,s=!0;break}let e=Xe(c.x,c.y,c.z);if(e<.05)break;o+=e}r.push({p:c,mouth:s,floor:c.y<Ye&&c.z<Je(c.y)+1})}}let a=[],o=[],s=(e,t)=>r[e*240+t%240],c=(n,r,i)=>{if(n.mouth&&r.mouth&&i.mouth||n.floor&&r.floor&&i.floor||(n.mouth||r.mouth||i.mouth)&&Math.max(n.p.distanceTo(r.p),r.p.distanceTo(i.p),i.p.distanceTo(n.p))>60)return;let s=new G().subVectors(r.p,n.p).cross(new G().subVectors(i.p,n.p)).dot(new G().subVectors(t,n.p))>0?[n,r,i]:[n,i,r];for(let t of s)a.push(t.p.x,t.p.y*e,t.p.z),o.push(t.p.x+t.p.y,t.p.z+t.p.y*.5)};for(let e=0;e<150;e++)for(let t=0;t<240;t++){let n=s(e,t),r=s(e+1,t),i=s(e+1,t+1),a=s(e,t+1);c(n,r,i),c(n,i,a)}let u=new to;if(u.setAttribute(`position`,new Y(a,3)),u.setAttribute(`uv`,new Y(o,2)),e<0){let e=u.getAttribute(`position`),t=u.getAttribute(`uv`);for(let n=0;n<e.count;n+=3){for(let t=0;t<3;t++){let r=e.getComponent(n+1,t);e.setComponent(n+1,t,e.getComponent(n+2,t)),e.setComponent(n+2,t,r)}for(let e=0;e<2;e++){let r=t.getComponent(n+1,e);t.setComponent(n+1,e,t.getComponent(n+2,e)),t.setComponent(n+2,e,r)}}}return u.computeVertexNormals(),u}function vg(){let e=Ye,t=new el(c*2,e*2,1,700),n=t.getAttribute(`position`);for(let e=0;e<n.count;e++)n.setZ(e,Je(n.getY(e)));return t.computeVertexNormals(),t}function yg(e){let t=new Ji;t.name=`arena`;let n=Ph(),r=new X(vg(),n);r.receiveShadow=!0,t.add(r);let i=Fh();i.onBeforeRender=(e,t,n)=>{n.isPerspectiveCamera&&(i.position.set(Math.round(n.position.x/50)*50,Math.round(n.position.y/50)*50,0),i.updateMatrixWorld())},t.add(i);let a=pg({hexSize:120,baseAlpha:.035,lineAlpha:.1}),o=new X(hg(),a);o.renderOrder=2,t.add(o);let s=pg({hexSize:260,baseAlpha:.04,lineAlpha:.12,lowerSolid:0}),c=new X(gg(),s);c.renderOrder=2,t.add(c);let u=[],d=[];for(let e of[-1,1]){let n=e<0?cg.blue:cg.orange,r=pg({hexSize:70,baseAlpha:.25,lineAlpha:.7,lowerSolid:0,triplanar:!0});r.uniforms.uBlue.value=n.clone(),r.uniforms.uOrange.value=n.clone(),d.push(r),r.depthWrite=!0;let i=new X(_g(e),r);i.renderOrder=1,t.add(i),t.add(og(e,n));let a=new _o({color:n,transparent:!0,opacity:.85,blending:2,depthWrite:!1}),o=new X(new el(1786,8),a);o.position.set(0,e*(l+4),1.2),t.add(o);let s=new vu(n,0,3500,1.5);s.position.set(0,e*(l+528),f*.6),t.add(s),u.push(s)}let p=tg(Se);t.add(p.group);let m=[],h=[a,s,...d];return{group:t,wallMaterials:h,padVisuals:m,goalLights:u,update(e,t,n){Nh.uGrassTime.value=e;for(let n of h)n.uniforms.uTime.value=e,n.uniforms.uCamPos.value.copy(t);p.update(e,n);for(let e of u)e.intensity*=.96}}}function bg(e){let t=new Map,n=new Map,r=e.clone();return xg(e,r,function(e,r){t.set(r,e),n.set(e,r)}),r.traverse(function(e){if(!e.isSkinnedMesh)return;let r=e,i=t.get(e),a=i.skeleton.bones;r.skeleton=i.skeleton.clone(),r.bindMatrix.copy(i.bindMatrix),r.skeleton.bones=a.map(function(e){return n.get(e)}),r.bind(r.skeleton,r.bindMatrix)}),r}function xg(e,t,n){n(e,t);for(let r=0;r<e.children.length;r++)xg(e.children[r],t.children[r],n)}var Sg=class extends Jl{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(e){return new kg(e)}),this.register(function(e){return new Ag(e)}),this.register(function(e){return new zg(e)}),this.register(function(e){return new Bg(e)}),this.register(function(e){return new Vg(e)}),this.register(function(e){return new Mg(e)}),this.register(function(e){return new Ng(e)}),this.register(function(e){return new Pg(e)}),this.register(function(e){return new Fg(e)}),this.register(function(e){return new Og(e)}),this.register(function(e){return new Ig(e)}),this.register(function(e){return new jg(e)}),this.register(function(e){return new Rg(e)}),this.register(function(e){return new Lg(e)}),this.register(function(e){return new Eg(e)}),this.register(function(e){return new Hg(e,Tg.EXT_MESHOPT_COMPRESSION)}),this.register(function(e){return new Hg(e,Tg.KHR_MESHOPT_COMPRESSION)}),this.register(function(e){return new Ug(e)})}load(e,t,n,r){let i=this,a;if(this.resourcePath!==``)a=this.resourcePath;else if(this.path!==``){let t=Su.extractUrlBase(e);a=Su.resolveURL(t,this.path)}else a=Su.extractUrlBase(e);this.manager.itemStart(e);let o=function(t){r?r(t):console.error(t),i.manager.itemError(e),i.manager.itemEnd(e)},s=new Zl(this.manager);s.setPath(this.path),s.setResponseType(`arraybuffer`),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials),s.load(e,function(n){try{i.parse(n,a,function(n){t(n),i.manager.itemEnd(e)},o)}catch(e){o(e)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,r){let i,a={},o={},s=new TextDecoder;if(typeof e==`string`)i=JSON.parse(e);else if(e instanceof ArrayBuffer){if(s.decode(new Uint8Array(e,0,4))===Wg){try{a[Tg.KHR_BINARY_GLTF]=new qg(e)}catch(e){r&&r(e);return}i=JSON.parse(a[Tg.KHR_BINARY_GLTF].content)}else i=JSON.parse(s.decode(e))}else i=e;if(i.asset===void 0||i.asset.version[0]<2){r&&r(Error(`THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.`));return}let c=new y_(i,{path:t||this.resourcePath||``,crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let e=0;e<this.pluginCallbacks.length;e++){let t=this.pluginCallbacks[e](c);t.name||console.error(`THREE.GLTFLoader: Invalid plugin found: missing name`),o[t.name]=t,a[t.name]=!0}if(i.extensionsUsed)for(let e=0;e<i.extensionsUsed.length;++e){let t=i.extensionsUsed[e],n=i.extensionsRequired||[];switch(t){case Tg.KHR_MATERIALS_UNLIT:a[t]=new Dg;break;case Tg.KHR_DRACO_MESH_COMPRESSION:a[t]=new Jg(i,this.dracoLoader);break;case Tg.KHR_TEXTURE_TRANSFORM:a[t]=new Yg;break;case Tg.KHR_MESH_QUANTIZATION:a[t]=new Xg;break;default:n.indexOf(t)>=0&&o[t]===void 0&&console.warn(`THREE.GLTFLoader: Unknown extension "`+t+`".`)}}c.setExtensions(a),c.setPlugins(o),c.parse(n,r)}parseAsync(e,t){let n=this;return new Promise(function(r,i){n.parse(e,t,r,i)})}};function Cg(){let e={};return{get:function(t){return e[t]},add:function(t,n){e[t]=n},remove:function(t){delete e[t]},removeAll:function(){e={}}}}function wg(e,t,n){let r=e.json.materials[t];return r.extensions&&r.extensions[n]?r.extensions[n]:null}var Tg={KHR_BINARY_GLTF:`KHR_binary_glTF`,KHR_DRACO_MESH_COMPRESSION:`KHR_draco_mesh_compression`,KHR_LIGHTS_PUNCTUAL:`KHR_lights_punctual`,KHR_MATERIALS_CLEARCOAT:`KHR_materials_clearcoat`,KHR_MATERIALS_DISPERSION:`KHR_materials_dispersion`,KHR_MATERIALS_IOR:`KHR_materials_ior`,KHR_MATERIALS_SHEEN:`KHR_materials_sheen`,KHR_MATERIALS_SPECULAR:`KHR_materials_specular`,KHR_MATERIALS_TRANSMISSION:`KHR_materials_transmission`,KHR_MATERIALS_IRIDESCENCE:`KHR_materials_iridescence`,KHR_MATERIALS_ANISOTROPY:`KHR_materials_anisotropy`,KHR_MATERIALS_UNLIT:`KHR_materials_unlit`,KHR_MATERIALS_VOLUME:`KHR_materials_volume`,KHR_TEXTURE_BASISU:`KHR_texture_basisu`,KHR_TEXTURE_TRANSFORM:`KHR_texture_transform`,KHR_MESH_QUANTIZATION:`KHR_mesh_quantization`,KHR_MATERIALS_EMISSIVE_STRENGTH:`KHR_materials_emissive_strength`,EXT_MATERIALS_BUMP:`EXT_materials_bump`,EXT_TEXTURE_WEBP:`EXT_texture_webp`,EXT_TEXTURE_AVIF:`EXT_texture_avif`,EXT_MESHOPT_COMPRESSION:`EXT_meshopt_compression`,KHR_MESHOPT_COMPRESSION:`KHR_meshopt_compression`,EXT_MESH_GPU_INSTANCING:`EXT_mesh_gpu_instancing`},Eg=class{constructor(e){this.parser=e,this.name=Tg.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,r=t.length;n<r;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n=`light:`+e,r=t.cache.get(n);if(r)return r;let i=t.json,a=((i.extensions&&i.extensions[this.name]||{}).lights||[])[e],o,s=new J(16777215);a.color!==void 0&&s.setRGB(a.color[0],a.color[1],a.color[2],cr);let c=a.range===void 0?0:a.range;switch(a.type){case`directional`:o=new xu(s),o.target.position.set(0,0,-1),o.add(o.target);break;case`point`:o=new vu(s),o.distance=c;break;case`spot`:o=new gu(s),o.distance=c,a.spot=a.spot||{},a.spot.innerConeAngle=a.spot.innerConeAngle===void 0?0:a.spot.innerConeAngle,a.spot.outerConeAngle=a.spot.outerConeAngle===void 0?Math.PI/4:a.spot.outerConeAngle,o.angle=a.spot.outerConeAngle,o.penumbra=1-a.spot.innerConeAngle/a.spot.outerConeAngle,o.target.position.set(0,0,-1),o.add(o.target);break;default:throw Error(`THREE.GLTFLoader: Unexpected light type: `+a.type)}return o.position.set(0,0,0),d_(o,a),a.intensity!==void 0&&(o.intensity=a.intensity),o.name=t.createUniqueName(a.name||`light_`+e),r=Promise.resolve(o),t.cache.add(n,r),r}getDependency(e,t){if(e===`light`)return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],i=(r.extensions&&r.extensions[this.name]||{}).light;return i===void 0?null:this._loadLight(i).then(function(e){return n._getNodeRef(t.cache,i,e)})}},Dg=class{constructor(){this.name=Tg.KHR_MATERIALS_UNLIT}getMaterialType(){return _o}extendParams(e,t,n){let r=[];e.color=new J(1,1,1),e.opacity=1;let i=t.pbrMetallicRoughness;if(i){if(Array.isArray(i.baseColorFactor)){let t=i.baseColorFactor;e.color.setRGB(t[0],t[1],t[2],cr),e.opacity=t[3]}i.baseColorTexture!==void 0&&r.push(n.assignTexture(e,`map`,i.baseColorTexture,sr))}return Promise.all(r)}},Og=class{constructor(e){this.parser=e,this.name=Tg.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=wg(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},kg=class{constructor(e){this.parser=e,this.name=Tg.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return wg(this.parser,e,this.name)===null?null:hl}extendMaterialParams(e,t){let n=wg(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&r.push(this.parser.assignTexture(t,`clearcoatMap`,n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&r.push(this.parser.assignTexture(t,`clearcoatRoughnessMap`,n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(r.push(this.parser.assignTexture(t,`clearcoatNormalMap`,n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let e=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new W(e,e)}return Promise.all(r)}},Ag=class{constructor(e){this.parser=e,this.name=Tg.KHR_MATERIALS_DISPERSION}getMaterialType(e){return wg(this.parser,e,this.name)===null?null:hl}extendMaterialParams(e,t){let n=wg(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion===void 0?0:n.dispersion),Promise.resolve()}},jg=class{constructor(e){this.parser=e,this.name=Tg.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return wg(this.parser,e,this.name)===null?null:hl}extendMaterialParams(e,t){let n=wg(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&r.push(this.parser.assignTexture(t,`iridescenceMap`,n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&r.push(this.parser.assignTexture(t,`iridescenceThicknessMap`,n.iridescenceThicknessTexture)),Promise.all(r)}},Mg=class{constructor(e){this.parser=e,this.name=Tg.KHR_MATERIALS_SHEEN}getMaterialType(e){return wg(this.parser,e,this.name)===null?null:hl}extendMaterialParams(e,t){let n=wg(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];if(t.sheenColor=new J(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let e=n.sheenColorFactor;t.sheenColor.setRGB(e[0],e[1],e[2],cr)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&r.push(this.parser.assignTexture(t,`sheenColorMap`,n.sheenColorTexture,sr)),n.sheenRoughnessTexture!==void 0&&r.push(this.parser.assignTexture(t,`sheenRoughnessMap`,n.sheenRoughnessTexture)),Promise.all(r)}},Ng=class{constructor(e){this.parser=e,this.name=Tg.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return wg(this.parser,e,this.name)===null?null:hl}extendMaterialParams(e,t){let n=wg(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&r.push(this.parser.assignTexture(t,`transmissionMap`,n.transmissionTexture)),Promise.all(r)}},Pg=class{constructor(e){this.parser=e,this.name=Tg.KHR_MATERIALS_VOLUME}getMaterialType(e){return wg(this.parser,e,this.name)===null?null:hl}extendMaterialParams(e,t){let n=wg(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];t.thickness=n.thicknessFactor===void 0?0:n.thicknessFactor,n.thicknessTexture!==void 0&&r.push(this.parser.assignTexture(t,`thicknessMap`,n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let i=n.attenuationColor||[1,1,1];return t.attenuationColor=new J().setRGB(i[0],i[1],i[2],cr),Promise.all(r)}},Fg=class{constructor(e){this.parser=e,this.name=Tg.KHR_MATERIALS_IOR}getMaterialType(e){return wg(this.parser,e,this.name)===null?null:hl}extendMaterialParams(e,t){let n=wg(this.parser,e,this.name);return n===null?Promise.resolve():(t.ior=n.ior===void 0?1.5:n.ior,t.ior===0&&(t.ior=1e3),Promise.resolve())}},Ig=class{constructor(e){this.parser=e,this.name=Tg.KHR_MATERIALS_SPECULAR}getMaterialType(e){return wg(this.parser,e,this.name)===null?null:hl}extendMaterialParams(e,t){let n=wg(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];t.specularIntensity=n.specularFactor===void 0?1:n.specularFactor,n.specularTexture!==void 0&&r.push(this.parser.assignTexture(t,`specularIntensityMap`,n.specularTexture));let i=n.specularColorFactor||[1,1,1];return t.specularColor=new J().setRGB(i[0],i[1],i[2],cr),n.specularColorTexture!==void 0&&r.push(this.parser.assignTexture(t,`specularColorMap`,n.specularColorTexture,sr)),Promise.all(r)}},Lg=class{constructor(e){this.parser=e,this.name=Tg.EXT_MATERIALS_BUMP}getMaterialType(e){return wg(this.parser,e,this.name)===null?null:hl}extendMaterialParams(e,t){let n=wg(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return t.bumpScale=n.bumpFactor===void 0?1:n.bumpFactor,n.bumpTexture!==void 0&&r.push(this.parser.assignTexture(t,`bumpMap`,n.bumpTexture)),Promise.all(r)}},Rg=class{constructor(e){this.parser=e,this.name=Tg.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return wg(this.parser,e,this.name)===null?null:hl}extendMaterialParams(e,t){let n=wg(this.parser,e,this.name);if(n===null)return Promise.resolve();let r=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&r.push(this.parser.assignTexture(t,`anisotropyMap`,n.anisotropyTexture)),Promise.all(r)}},zg=class{constructor(e){this.parser=e,this.name=Tg.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,r=n.textures[e];if(!r.extensions||!r.extensions[this.name])return null;let i=r.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw Error(`THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures`);return null}return t.loadTextureImage(e,i.source,a)}},Bg=class{constructor(e){this.parser=e,this.name=Tg.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,r=n.json,i=r.textures[e];if(!i.extensions||!i.extensions[t])return null;let a=i.extensions[t],o=r.images[a.source],s=n.textureLoader;if(o.uri){let e=n.options.manager.getHandler(o.uri);e!==null&&(s=e)}return n.loadTextureImage(e,a.source,s)}},Vg=class{constructor(e){this.parser=e,this.name=Tg.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,r=n.json,i=r.textures[e];if(!i.extensions||!i.extensions[t])return null;let a=i.extensions[t],o=r.images[a.source],s=n.textureLoader;if(o.uri){let e=n.options.manager.getHandler(o.uri);e!==null&&(s=e)}return n.loadTextureImage(e,a.source,s)}},Hg=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let e=n.extensions[this.name],r=this.parser.getDependency(`buffer`,e.buffer),i=this.parser.options.meshoptDecoder;if(!i||!i.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw Error(`THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files`);return null}return r.then(function(t){let n=e.byteOffset||0,r=e.byteLength||0,a=e.count,o=e.byteStride,s=new Uint8Array(t,n,r);return i.decodeGltfBufferAsync?i.decodeGltfBufferAsync(a,o,s,e.mode,e.filter).then(function(e){return e.buffer}):i.ready.then(function(){let t=new ArrayBuffer(a*o);return i.decodeGltfBuffer(new Uint8Array(t),a,o,s,e.mode,e.filter),t})})}return null}},Ug=class{constructor(e){this.name=Tg.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let r=t.meshes[n.mesh];for(let e of r.primitives)if(e.mode!==e_.TRIANGLES&&e.mode!==e_.TRIANGLE_STRIP&&e.mode!==e_.TRIANGLE_FAN&&e.mode!==void 0)return null;let i=n.extensions[this.name].attributes,a=[],o={};for(let e in i)a.push(this.parser.getDependency(`accessor`,i[e]).then(t=>(o[e]=t,o[e])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(e=>{let t=e.pop(),n=t.isGroup?t.children:[t],r=e[0].count,i=[];for(let e of n){let t=new q,n=new G,a=new Qr,s=new G(1,1,1),c=new es(e.geometry,e.material,r);for(let e=0;e<r;e++)o.TRANSLATION&&n.fromBufferAttribute(o.TRANSLATION,e),o.ROTATION&&a.fromBufferAttribute(o.ROTATION,e),o.SCALE&&s.fromBufferAttribute(o.SCALE,e),c.setMatrixAt(e,t.compose(n,a,s));let l=null;for(let e in o)if(e===`_COLOR_0`){let t=o[e];c.instanceColor=new Ko(t.array,t.itemSize,t.normalized)}else if(e!==`TRANSLATION`&&e!==`ROTATION`&&e!==`SCALE`){if(l===null){let e=c.geometry;l=new to,l.name=e.name;for(let t in e.attributes)l.setAttribute(t,e.attributes[t]);for(let t in e.morphAttributes)l.morphAttributes[t]=e.morphAttributes[t];e.index!==null&&l.setIndex(e.index),l.morphTargetsRelative=e.morphTargetsRelative;for(let t of e.groups)l.addGroup(t.start,t.count,t.materialIndex);e.boundingBox!==null&&(l.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(l.boundingSphere=e.boundingSphere.clone()),l.drawRange.start=e.drawRange.start,l.drawRange.count=e.drawRange.count,l.userData=Object.assign({},e.userData),c.geometry=l}let t=o[e];l.setAttribute(e,new Ko(t.array,t.itemSize,t.normalized))}qi.prototype.copy.call(c,e),this.parser.assignFinalMaterial(c),i.push(c)}return t.isGroup?(t.clear(),t.add(...i),t):i[0]}))}},Wg=`glTF`,Gg=12,Kg={JSON:1313821514,BIN:5130562},qg=class{constructor(e){this.name=Tg.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Gg),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Wg)throw Error(`THREE.GLTFLoader: Unsupported glTF-Binary header.`);if(this.header.version<2)throw Error(`THREE.GLTFLoader: Legacy binary file detected.`);let r=this.header.length-Gg,i=new DataView(e,Gg),a=0;for(;a<r;){let t=i.getUint32(a,!0);a+=4;let r=i.getUint32(a,!0);if(a+=4,r===Kg.JSON){let r=new Uint8Array(e,Gg+a,t);this.content=n.decode(r)}else if(r===Kg.BIN){let n=Gg+a;this.body=e.slice(n,n+t)}a+=t}if(this.content===null)throw Error(`THREE.GLTFLoader: JSON content not found.`)}},Jg=class{constructor(e,t){if(!t)throw Error(`THREE.GLTFLoader: No DRACOLoader instance provided.`);this.name=Tg.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,r=this.dracoLoader,i=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},s={},c={};for(let e in a){let t=a_[e]||e.toLowerCase();o[t]=a[e]}for(let t in e.attributes){let r=a_[t]||t.toLowerCase();if(a[t]!==void 0){let i=n.accessors[e.attributes[t]];c[r]=t_[i.componentType].name,s[r]=i.normalized===!0}}return t.getDependency(`bufferView`,i).then(function(e){return new Promise(function(t,n){r.decodeDracoFile(e,function(e){for(let t in e.attributes){let n=e.attributes[t],r=s[t];r!==void 0&&(n.normalized=r)}t(e)},o,c,cr,n)})})}},Yg=class{constructor(){this.name=Tg.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let t=Math.cos(e.rotation),n=Math.sin(e.rotation);e.matrix.set(e.repeat.x*t,e.repeat.y*n,e.offset.x,-e.repeat.x*n,e.repeat.y*t,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},Xg=class{constructor(){this.name=Tg.KHR_MESH_QUANTIZATION}},Zg=class extends Tl{constructor(e,t,n,r){super(e,t,n,r)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r*3+r;for(let e=0;e!==r;e++)t[e]=n[i+e];return t}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=o*2,c=o*3,l=r-t,u=(n-t)/l,d=u*u,f=d*u,p=e*c,m=p-c,h=-2*f+3*d,g=f-d,_=1-h,v=g-d+u;for(let e=0;e!==o;e++){let t=a[m+e+o],n=a[m+e+s]*l,r=a[p+e+o],c=a[p+e]*l;i[e]=_*t+v*n+h*r+g*c}return i}},Qg=new Qr,$g=class extends Zg{interpolate_(e,t,n,r){let i=super.interpolate_(e,t,n,r);return Qg.fromArray(i).normalize().toArray(i),i}},e_={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},t_={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},n_={9728:Bt,9729:Ut,9984:Vt,9985:Wt,9986:Ht,9987:Gt},r_={33071:Rt,33648:zt,10497:Lt},i_={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},a_={POSITION:`position`,NORMAL:`normal`,TANGENT:`tangent`,TEXCOORD_0:`uv`,TEXCOORD_1:`uv1`,TEXCOORD_2:`uv2`,TEXCOORD_3:`uv3`,COLOR_0:`color`,WEIGHTS_0:`skinWeight`,JOINTS_0:`skinIndex`},o_={scale:`scale`,translation:`position`,rotation:`quaternion`,weights:`morphTargetInfluences`},s_={CUBICSPLINE:void 0,LINEAR:$n,STEP:Qn},c_={OPAQUE:`OPAQUE`,MASK:`MASK`,BLEND:`BLEND`};function l_(e){return e.DefaultMaterial===void 0&&(e.DefaultMaterial=new ml({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:0})),e.DefaultMaterial}function u_(e,t,n){for(let r in n.extensions)e[r]===void 0&&(t.userData.gltfExtensions=t.userData.gltfExtensions||{},t.userData.gltfExtensions[r]=n.extensions[r])}function d_(e,t){t.extras!==void 0&&(typeof t.extras==`object`?Object.assign(e.userData,t.extras):console.warn(`THREE.GLTFLoader: Ignoring primitive type .extras, `+t.extras))}function f_(e,t,n){let r=!1,i=!1,a=!1;for(let e=0,n=t.length;e<n;e++){let n=t[e];if(n.POSITION!==void 0&&(r=!0),n.NORMAL!==void 0&&(i=!0),n.COLOR_0!==void 0&&(a=!0),r&&i&&a)break}if(!r&&!i&&!a)return Promise.resolve(e);let o=[],s=[],c=[];for(let l=0,u=t.length;l<u;l++){let u=t[l];if(r){let t=u.POSITION===void 0?e.attributes.position:n.getDependency(`accessor`,u.POSITION);o.push(t)}if(i){let t=u.NORMAL===void 0?e.attributes.normal:n.getDependency(`accessor`,u.NORMAL);s.push(t)}if(a){let t=u.COLOR_0===void 0?e.attributes.color:n.getDependency(`accessor`,u.COLOR_0);c.push(t)}}return Promise.all([Promise.all(o),Promise.all(s),Promise.all(c)]).then(function(t){let n=t[0],o=t[1],s=t[2];return r&&(e.morphAttributes.position=n),i&&(e.morphAttributes.normal=o),a&&(e.morphAttributes.color=s),e.morphTargetsRelative=!0,e})}function p_(e,t){if(e.updateMorphTargets(),t.weights!==void 0)for(let n=0,r=t.weights.length;n<r;n++)e.morphTargetInfluences[n]=t.weights[n];if(t.extras&&Array.isArray(t.extras.targetNames)){let n=t.extras.targetNames;if(e.morphTargetInfluences.length===n.length){e.morphTargetDictionary={};for(let t=0,r=n.length;t<r;t++)e.morphTargetDictionary[n[t]]=t}else console.warn(`THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.`)}}function m_(e){let t,n=e.extensions&&e.extensions[Tg.KHR_DRACO_MESH_COMPRESSION];if(t=n?`draco:`+n.bufferView+`:`+n.indices+`:`+h_(n.attributes):e.indices+`:`+h_(e.attributes)+`:`+e.mode,e.targets!==void 0)for(let n=0,r=e.targets.length;n<r;n++)t+=`:`+h_(e.targets[n]);return t}function h_(e){let t=``,n=Object.keys(e).sort();for(let r=0,i=n.length;r<i;r++)t+=n[r]+`:`+e[n[r]]+`;`;return t}function g_(e){switch(e){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw Error(`THREE.GLTFLoader: Unsupported normalized accessor component type.`)}}function __(e){return e.search(/\.jpe?g($|\?)/i)>0||e.search(/^data\:image\/jpeg/)===0?`image/jpeg`:e.search(/\.webp($|\?)/i)>0||e.search(/^data\:image\/webp/)===0?`image/webp`:e.search(/\.ktx2($|\?)/i)>0||e.search(/^data\:image\/ktx2/)===0?`image/ktx2`:`image/png`}var v_=new q,y_=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Cg,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,r=-1,i=!1,a=-1;if(typeof navigator<`u`&&navigator.userAgent!==void 0){let e=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(e)===!0;let t=e.match(/Version\/(\d+)/);r=n&&t?parseInt(t[1],10):-1,i=e.indexOf(`Firefox`)>-1,a=i?e.match(/Firefox\/([0-9]+)\./)[1]:-1}this.textureLoader=typeof createImageBitmap>`u`||n&&r<17||i&&a<98?new eu(this.options.manager):new wu(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Zl(this.options.manager),this.fileLoader.setResponseType(`arraybuffer`),this.options.crossOrigin===`use-credentials`&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,r=this.json,i=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(e){return e._markDefs&&e._markDefs()}),Promise.all(this._invokeAll(function(e){return e.beforeRoot&&e.beforeRoot()})).then(function(){return Promise.all([n.getDependencies(`scene`),n.getDependencies(`animation`),n.getDependencies(`camera`)])}).then(function(t){let a={scene:t[0][r.scene||0],scenes:t[0],animations:t[1],cameras:t[2],asset:r.asset,parser:n,userData:{}};return u_(i,a,r),d_(a,r),Promise.all(n._invokeAll(function(e){return e.afterRoot&&e.afterRoot(a)})).then(function(){for(let e of a.scenes)e.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let n=0,r=t.length;n<r;n++){let r=t[n].joints;for(let t=0,n=r.length;t<n;t++)e[r[t]].isBone=!0}for(let t=0,r=e.length;t<r;t++){let r=e[t];r.mesh!==void 0&&(this._addNodeRef(this.meshCache,r.mesh),r.skin!==void 0&&(n[r.mesh].isSkinnedMesh=!0)),r.camera!==void 0&&this._addNodeRef(this.cameraCache,r.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let r=n.clone(),i=(e,t)=>{let n=this.associations.get(e);n!=null&&this.associations.set(t,n);for(let[n,r]of e.children.entries())i(r,t.children[n])};return i(n,r),r.name+=`_instance_`+e.uses[t]++,r}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let r=e(t[n]);if(r)return r}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let r=0;r<t.length;r++){let i=e(t[r]);i&&n.push(i)}return n}getDependency(e,t){let n=e+`:`+t,r=this.cache.get(n);if(!r){switch(e){case`scene`:r=this.loadScene(t);break;case`node`:r=this._invokeOne(function(e){return e.loadNode&&e.loadNode(t)});break;case`mesh`:r=this._invokeOne(function(e){return e.loadMesh&&e.loadMesh(t)});break;case`accessor`:r=this.loadAccessor(t);break;case`bufferView`:r=this._invokeOne(function(e){return e.loadBufferView&&e.loadBufferView(t)});break;case`buffer`:r=this.loadBuffer(t);break;case`material`:r=this._invokeOne(function(e){return e.loadMaterial&&e.loadMaterial(t)});break;case`texture`:r=this._invokeOne(function(e){return e.loadTexture&&e.loadTexture(t)});break;case`skin`:r=this.loadSkin(t);break;case`animation`:r=this._invokeOne(function(e){return e.loadAnimation&&e.loadAnimation(t)});break;case`camera`:r=this.loadCamera(t);break;default:if(r=this._invokeOne(function(n){return n!=this&&n.getDependency&&n.getDependency(e,t)}),!r)throw Error(`Unknown type: `+e)}this.cache.add(n,r)}return r}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,r=this.json[e+(e===`mesh`?`es`:`s`)]||[];t=Promise.all(r.map(function(t,r){return n.getDependency(e,r)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!==`arraybuffer`)throw Error(`THREE.GLTFLoader: `+t.type+` buffer type is not supported.`);if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Tg.KHR_BINARY_GLTF].body);let r=this.options;return new Promise(function(e,i){n.load(Su.resolveURL(t.uri,r.path),e,void 0,function(){i(Error(`THREE.GLTFLoader: Failed to load buffer "`+t.uri+`".`))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency(`buffer`,t.buffer).then(function(e){let n=t.byteLength||0,r=t.byteOffset||0;return e.slice(r,r+n)})}loadAccessor(e){let t=this,n=this.json,r=this.json.accessors[e];if(r.bufferView===void 0&&r.sparse===void 0){let e=i_[r.type],t=t_[r.componentType],n=r.normalized===!0,i=new t(r.count*e);return Promise.resolve(new Va(i,e,n))}let i=[];return r.bufferView===void 0?i.push(null):i.push(this.getDependency(`bufferView`,r.bufferView)),r.sparse!==void 0&&(i.push(this.getDependency(`bufferView`,r.sparse.indices.bufferView)),i.push(this.getDependency(`bufferView`,r.sparse.values.bufferView))),Promise.all(i).then(function(e){let i=e[0],a=i_[r.type],o=t_[r.componentType],s=o.BYTES_PER_ELEMENT,c=s*a,l=r.byteOffset||0,u=r.bufferView===void 0?void 0:n.bufferViews[r.bufferView].byteStride,d=r.normalized===!0,f,p;if(u&&u!==c){let e=Math.floor(l/u),n=`InterleavedBuffer:`+r.bufferView+`:`+r.componentType+`:`+e+`:`+r.count,c=t.cache.get(n);c||(f=new o(i,e*u,r.count*u/s),c=new no(f,u/s),t.cache.add(n,c)),p=new io(c,a,l%u/s,d)}else f=i===null?new o(r.count*a):new o(i,l,r.count*a),p=new Va(f,a,d);if(r.sparse!==void 0){let t=i_.SCALAR,n=t_[r.sparse.indices.componentType],s=r.sparse.indices.byteOffset||0,c=r.sparse.values.byteOffset||0,l=new n(e[1],s,r.sparse.count*t),u=new o(e[2],c,r.sparse.count*a);i!==null&&(p=new Va(p.array.slice(),p.itemSize,p.normalized)),p.normalized=!1;for(let e=0,t=l.length;e<t;e++){let t=l[e];if(p.setX(t,u[e*a]),a>=2&&p.setY(t,u[e*a+1]),a>=3&&p.setZ(t,u[e*a+2]),a>=4&&p.setW(t,u[e*a+3]),a>=5)throw Error(`THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.`)}p.normalized=d}return p})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,i=t.images[r],a=this.textureLoader;if(i.uri){let e=n.manager.getHandler(i.uri);e!==null&&(a=e)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){let r=this,i=this.json,a=i.textures[e],o=i.images[t],s=(o.uri||o.bufferView)+`:`+a.sampler;if(this.textureCache[s])return this.textureCache[s];let c=this.loadImageSource(t,n).then(function(t){t.flipY=!1,t.name=a.name||o.name||``,t.name===``&&typeof o.uri==`string`&&o.uri.startsWith(`data:image/`)===!1&&(t.name=o.uri);let n=(i.samplers||{})[a.sampler]||{};return t.magFilter=n_[n.magFilter]||1006,t.minFilter=n_[n.minFilter]||1008,t.wrapS=r_[n.wrapS]||1e3,t.wrapT=r_[n.wrapT]||1e3,t.generateMipmaps=!t.isCompressedTexture&&t.minFilter!==1003&&t.minFilter!==1006,r.associations.set(t,{textures:e}),t}).catch(function(){return null});return this.textureCache[s]=c,c}loadImageSource(e,t){let n=this,r=this.json,i=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(e=>e.clone());let a=r.images[e],o=self.URL||self.webkitURL,s=a.uri||``,c=!1;if(a.bufferView!==void 0)s=n.getDependency(`bufferView`,a.bufferView).then(function(e){c=!0;let t=new Blob([e],{type:a.mimeType});return s=o.createObjectURL(t),s});else if(a.uri===void 0)throw Error(`THREE.GLTFLoader: Image `+e+` is missing URI and bufferView`);let l=Promise.resolve(s).then(function(e){return new Promise(function(n,r){let a=n;t.isImageBitmapLoader===!0&&(a=function(e){let t=new hi(e);t.needsUpdate=!0,n(t)}),t.load(Su.resolveURL(e,i.path),a,void 0,r)})}).then(function(e){return c===!0&&o.revokeObjectURL(s),d_(e,a),e.userData.mimeType=a.mimeType||__(a.uri),e}).catch(function(e){throw console.error(`THREE.GLTFLoader: Couldn't load texture`,s),e});return this.sourceCache[e]=l,l}assignTexture(e,t,n,r){let i=this;return this.getDependency(`texture`,n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),i.extensions[Tg.KHR_TEXTURE_TRANSFORM]){let e=n.extensions===void 0?void 0:n.extensions[Tg.KHR_TEXTURE_TRANSFORM];if(e){let t=i.associations.get(a);a=i.extensions[Tg.KHR_TEXTURE_TRANSFORM].extendTexture(a,e),i.associations.set(a,t)}}return r!==void 0&&(a.colorSpace=r),e[t]=a,a})}assignFinalMaterial(e){let t=e.geometry,n=e.material,r=t.attributes.tangent===void 0,i=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){let e=`PointsMaterial:`+n.uuid,t=this.cache.get(e);t||(t=new ys,uo.prototype.copy.call(t,n),t.color.copy(n.color),t.map=n.map,t.sizeAttenuation=!1,this.cache.add(e,t)),n=t}else if(e.isLine){let e=`LineBasicMaterial:`+n.uuid,t=this.cache.get(e);t||(t=new as,uo.prototype.copy.call(t,n),t.color.copy(n.color),t.map=n.map,this.cache.add(e,t)),n=t}if(r||i||a){let e=`ClonedMaterial:`+n.uuid+`:`;r&&(e+=`derivative-tangents:`),i&&(e+=`vertex-colors:`),a&&(e+=`flat-shading:`);let t=this.cache.get(e);t||(t=n.clone(),i&&(t.vertexColors=!0),a&&(t.flatShading=!0),r&&(t.normalScale&&(t.normalScale.y*=-1),t.clearcoatNormalScale&&(t.clearcoatNormalScale.y*=-1)),this.cache.add(e,t),this.associations.set(t,this.associations.get(n))),n=t}e.material=n}getMaterialType(){return ml}loadMaterial(e){let t=this,n=this.json,r=this.extensions,i=n.materials[e],a,o={},s=i.extensions||{},c=[];if(s[Tg.KHR_MATERIALS_UNLIT]){let e=r[Tg.KHR_MATERIALS_UNLIT];a=e.getMaterialType(),c.push(e.extendParams(o,i,t))}else{let n=i.pbrMetallicRoughness||{};if(o.color=new J(1,1,1),o.opacity=1,Array.isArray(n.baseColorFactor)){let e=n.baseColorFactor;o.color.setRGB(e[0],e[1],e[2],cr),o.opacity=e[3]}n.baseColorTexture!==void 0&&c.push(t.assignTexture(o,`map`,n.baseColorTexture,sr)),o.metalness=n.metallicFactor===void 0?1:n.metallicFactor,o.roughness=n.roughnessFactor===void 0?1:n.roughnessFactor,n.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,`metalnessMap`,n.metallicRoughnessTexture)),c.push(t.assignTexture(o,`roughnessMap`,n.metallicRoughnessTexture))),a=this._invokeOne(function(t){return t.getMaterialType&&t.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(t){return t.extendMaterialParams&&t.extendMaterialParams(e,o)})))}i.doubleSided===!0&&(o.side=2);let l=i.alphaMode||c_.OPAQUE;if(l===c_.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,l===c_.MASK&&(o.alphaTest=i.alphaCutoff===void 0?.5:i.alphaCutoff)),i.normalTexture!==void 0&&a!==_o&&(c.push(t.assignTexture(o,`normalMap`,i.normalTexture)),o.normalScale=new W(1,1),i.normalTexture.scale!==void 0)){let e=i.normalTexture.scale;o.normalScale.set(e,e)}if(i.occlusionTexture!==void 0&&a!==_o&&(c.push(t.assignTexture(o,`aoMap`,i.occlusionTexture)),i.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=i.occlusionTexture.strength)),i.emissiveFactor!==void 0&&a!==_o){let e=i.emissiveFactor;o.emissive=new J().setRGB(e[0],e[1],e[2],cr)}return i.emissiveTexture!==void 0&&a!==_o&&c.push(t.assignTexture(o,`emissiveMap`,i.emissiveTexture,sr)),Promise.all(c).then(function(){let n=new a(o);return i.name&&(n.name=i.name),d_(n,i),t.associations.set(n,{materials:e}),i.extensions&&u_(r,n,i),n})}createUniqueName(e){let t=Hu.sanitizeNodeName(e||``);return t in this.nodeNamesUsed?t+`_`+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,r=this.primitiveCache;function i(e){return n[Tg.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(e,t).then(function(n){return x_(n,e,t)})}let a=[];for(let n=0,o=e.length;n<o;n++){let o=e[n],s=m_(o),c=r[s];if(c)a.push(c.promise);else{let e;e=o.extensions&&o.extensions[Tg.KHR_DRACO_MESH_COMPRESSION]?i(o):x_(new to,o,t),o.mode===e_.TRIANGLE_STRIP?e=e.then(e=>Th(e,1)):o.mode===e_.TRIANGLE_FAN&&(e=e.then(e=>Th(e,2))),r[s]={primitive:o,promise:e},a.push(e)}}return Promise.all(a)}loadMesh(e){let t=this,n=this.json,r=this.extensions,i=n.meshes[e],a=i.primitives,o=[];for(let e=0,t=a.length;e<t;e++){let t=a[e].material===void 0?l_(this.cache):this.getDependency(`material`,a[e].material);o.push(t)}return o.push(t.loadGeometries(a)),Promise.all(o).then(async function(n){let o=n.slice(0,n.length-1),s=n[n.length-1],c=[];for(let n=0,l=s.length;n<l;n++){let l=s[n],u=a[n],d,f=o[n];if(u.mode===e_.TRIANGLES||u.mode===e_.TRIANGLE_STRIP||u.mode===e_.TRIANGLE_FAN||u.mode===void 0){let e=i.isSkinnedMesh===!0,t=l.hasAttribute(`skinIndex`)&&l.hasAttribute(`skinWeight`);e&&t===!1&&console.warn(`THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled.`),d=e&&t?new Bo(l,f):new X(l,f),d.isSkinnedMesh===!0&&d.normalizeSkinWeights()}else if(u.mode===e_.LINES)d=new _s(l,f);else if(u.mode===e_.LINE_STRIP)d=new ps(l,f);else if(u.mode===e_.LINE_LOOP)d=new vs(l,f);else if(u.mode===e_.POINTS)d=new ws(l,f);else throw Error(`THREE.GLTFLoader: Primitive mode unsupported: `+u.mode);Object.keys(d.geometry.morphAttributes).length>0&&p_(d,i),d.name=t.createUniqueName(i.name||`mesh_`+e),d_(d,i),u.extensions&&u_(r,d,u),t.assignFinalMaterial(d),c.push(d)}for(let n=0,r=c.length;n<r;n++)t.associations.set(c[n],{meshes:e,primitives:n});if(c.length===1)return i.extensions&&u_(r,c[0],i),c[0];let l=new Ji;i.extensions&&u_(r,l,i),t.associations.set(l,{meshes:e});for(let e=0,t=c.length;e<t;e++)l.add(c[e]);return l})}loadCamera(e){let t,n=this.json.cameras[e],r=n[n.type];if(!r){console.warn(`THREE.GLTFLoader: Missing camera parameters.`);return}return n.type===`perspective`?t=new mu(Zr.radToDeg(r.yfov),r.aspectRatio||1,r.znear||1,r.zfar||2e6):n.type===`orthographic`&&(t=new yu(-r.xmag,r.xmag,r.ymag,-r.ymag,r.znear,r.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),d_(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let e=0,r=t.joints.length;e<r;e++)n.push(this._loadNodeShallow(t.joints[e]));return t.inverseBindMatrices===void 0?n.push(null):n.push(this.getDependency(`accessor`,t.inverseBindMatrices)),Promise.all(n).then(function(e){let n=e.pop(),r=e,i=[],a=[];for(let e=0,o=r.length;e<o;e++){let o=r[e];if(o){i.push(o);let t=new q;n!==null&&t.fromArray(n.array,e*16),a.push(t)}else console.warn(`THREE.GLTFLoader: Joint "%s" could not be found.`,t.joints[e])}return new Go(i,a)})}loadAnimation(e){let t=this.json,n=this,r=t.animations[e],i=r.name?r.name:`animation_`+e,a=[],o=[],s=[],c=[],l=[];for(let e=0,t=r.channels.length;e<t;e++){let t=r.channels[e],n=r.samplers[t.sampler],i=t.target,u=i.node,d=r.parameters===void 0?n.input:r.parameters[n.input],f=r.parameters===void 0?n.output:r.parameters[n.output];i.node!==void 0&&(a.push(this.getDependency(`node`,u)),o.push(this.getDependency(`accessor`,d)),s.push(this.getDependency(`accessor`,f)),c.push(n),l.push(i))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(s),Promise.all(c),Promise.all(l)]).then(function(e){let t=e[0],a=e[1],o=e[2],s=e[3],c=e[4],l=[];for(let e=0,r=t.length;e<r;e++){let r=t[e],i=a[e],u=o[e],d=s[e],f=c[e];if(r===void 0)continue;r.updateMatrix&&r.updateMatrix();let p=n._createAnimationTracks(r,i,u,d,f);if(p)for(let e=0;e<p.length;e++)l.push(p[e])}let u=new Hl(i,void 0,l);return d_(u,r),u})}createNodeMesh(e){let t=this.json,n=this,r=t.nodes[e];return r.mesh===void 0?null:n.getDependency(`mesh`,r.mesh).then(function(e){let t=n._getNodeRef(n.meshCache,r.mesh,e);return r.weights!==void 0&&t.traverse(function(e){if(e.isMesh)for(let t=0,n=r.weights.length;t<n;t++)e.morphTargetInfluences[t]=r.weights[t]}),t})}loadNode(e){let t=this.json,n=this,r=t.nodes[e],i=n._loadNodeShallow(e),a=[],o=r.children||[];for(let e=0,t=o.length;e<t;e++)a.push(n.getDependency(`node`,o[e]));let s=r.skin===void 0?Promise.resolve(null):n.getDependency(`skin`,r.skin);return Promise.all([i,Promise.all(a),s]).then(function(e){let t=e[0],n=e[1],r=e[2];r!==null&&t.traverse(function(e){e.isSkinnedMesh&&e.bind(r,v_)});for(let e=0,r=n.length;e<r;e++)t.add(n[e]);if(t.userData.pivot!==void 0&&n.length>0){let e=t.userData.pivot,r=n[0];t.pivot=new G().fromArray(e),t.position.x-=e[0],t.position.y-=e[1],t.position.z-=e[2],r.position.set(0,0,0),delete t.userData.pivot}return t})}_loadNodeShallow(e){let t=this.json,n=this.extensions,r=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let i=t.nodes[e],a=i.name?r.createUniqueName(i.name):``,o=[],s=r._invokeOne(function(t){return t.createNodeMesh&&t.createNodeMesh(e)});return s&&o.push(s),i.camera!==void 0&&o.push(r.getDependency(`camera`,i.camera).then(function(e){return r._getNodeRef(r.cameraCache,i.camera,e)})),r._invokeAll(function(t){return t.createNodeAttachment&&t.createNodeAttachment(e)}).forEach(function(e){o.push(e)}),this.nodeCache[e]=Promise.all(o).then(function(t){let o;if(o=i.isBone===!0?new Vo:t.length>1?new Ji:t.length===1?t[0]:new qi,o!==t[0])for(let e=0,n=t.length;e<n;e++)o.add(t[e]);if(i.name&&(o.userData.name=i.name,o.name=a),d_(o,i),i.extensions&&u_(n,o,i),i.matrix!==void 0){let e=new q;e.fromArray(i.matrix),o.applyMatrix4(e)}else i.translation!==void 0&&o.position.fromArray(i.translation),i.rotation!==void 0&&o.quaternion.fromArray(i.rotation),i.scale!==void 0&&o.scale.fromArray(i.scale);if(!r.associations.has(o))r.associations.set(o,{});else if(i.mesh!==void 0&&r.meshCache.refs[i.mesh]>1){let e=r.associations.get(o);r.associations.set(o,{...e})}return r.associations.get(o).nodes=e,o}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],r=this,i=new Ji;n.name&&(i.name=r.createUniqueName(n.name)),d_(i,n),n.extensions&&u_(t,i,n);let a=n.nodes||[],o=[];for(let e=0,t=a.length;e<t;e++)o.push(r.getDependency(`node`,a[e]));return Promise.all(o).then(function(e){for(let t=0,n=e.length;t<n;t++){let n=e[t];n.parent===null?i.add(n):i.add(bg(n))}return r.associations=(e=>{let t=new Map;for(let[e,n]of r.associations)(e instanceof uo||e instanceof hi)&&t.set(e,n);return e.traverse(e=>{let n=r.associations.get(e);n!=null&&t.set(e,n)}),t})(i),i})}_createAnimationTracks(e,t,n,r,i){let a=[],o=e.name?e.name:e.uuid,s=[];function c(e){e.morphTargetInfluences&&s.push(e.name?e.name:e.uuid)}o_[i.path]===o_.weights?(c(e),e.isGroup&&e.children.forEach(c)):s.push(o);let l;switch(o_[i.path]){case o_.weights:l=Ll;break;case o_.rotation:l=zl;break;case o_.translation:case o_.scale:l=Vl;break;default:switch(n.itemSize){case 1:l=Ll;break;default:l=Vl}}let u=r.interpolation===void 0?$n:s_[r.interpolation],d=this._getArrayFromAccessor(n);for(let e=0,n=s.length;e<n;e++){let n=new l(s[e]+`.`+o_[i.path],t.array,d,u);r.interpolation===`CUBICSPLINE`&&this._createCubicSplineTrackInterpolant(n),a.push(n)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let e=g_(t.constructor),n=new Float32Array(t.length);for(let r=0,i=t.length;r<i;r++)n[r]=t[r]*e;t=n}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(e){return new(this instanceof zl?$g:Zg)(this.times,this.values,this.getValueSize()/3,e)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function b_(e,t,n){let r=t.attributes,i=new va;if(r.POSITION!==void 0){let e=n.json.accessors[r.POSITION],t=e.min,a=e.max;if(t!==void 0&&a!==void 0){if(i.set(new G(t[0],t[1],t[2]),new G(a[0],a[1],a[2])),e.normalized){let t=g_(t_[e.componentType]);i.min.multiplyScalar(t),i.max.multiplyScalar(t)}}else{console.warn(`THREE.GLTFLoader: Missing min/max properties for accessor POSITION.`);return}}else return;let a=t.targets;if(a!==void 0){let e=new G,t=new G;for(let r=0,i=a.length;r<i;r++){let i=a[r];if(i.POSITION!==void 0){let r=n.json.accessors[i.POSITION],a=r.min,o=r.max;if(a!==void 0&&o!==void 0){if(t.setX(Math.max(Math.abs(a[0]),Math.abs(o[0]))),t.setY(Math.max(Math.abs(a[1]),Math.abs(o[1]))),t.setZ(Math.max(Math.abs(a[2]),Math.abs(o[2]))),r.normalized){let e=g_(t_[r.componentType]);t.multiplyScalar(e)}e.max(t)}else console.warn(`THREE.GLTFLoader: Missing min/max properties for accessor POSITION.`)}}i.expandByVector(e)}e.boundingBox=i;let o=new qa;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,e.boundingSphere=o}function x_(e,t,n){let r=t.attributes,i=[];function a(t,r){return n.getDependency(`accessor`,t).then(function(t){e.setAttribute(r,t)})}for(let t in r){let n=a_[t]||t.toLowerCase();n in e.attributes||i.push(a(r[t],n))}if(t.indices!==void 0&&!e.index){let r=n.getDependency(`accessor`,t.indices).then(function(t){e.setIndex(t)});i.push(r)}return ai.workingColorSpace!==`srgb-linear`&&`COLOR_0`in r&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${ai.workingColorSpace}" not supported.`),d_(e,t),b_(e,t,n),Promise.all(i).then(function(){return t.targets===void 0?e:f_(e,t.targets,n)})}var S_=null;function C_(e=`/assets/stadium/`){return S_||(S_=(async()=>{try{let[t,n,r]=await Promise.all([new Sg().loadAsync(e+`stadium.glb`),new eu().loadAsync(e+`lightmap.webp`),fetch(e+`rows.json`).then(e=>e.json())]);n.flipY=!1,n.colorSpace=sr,n.channel=1,n.anisotropy=8;let i=t.scene;i.rotation.x=Math.PI/2,i.updateMatrixWorld(!0);let a=new Map;return i.traverse(e=>{let t=e;if(!t.isMesh)return;let n=t.geometry.clone();n.applyMatrix4(t.matrixWorld);let r=(t.parent&&t.parent!==i?t.parent.name:t.name).replace(/_\d+$/,``),o=new X(n,t.material);a.has(r)||a.set(r,[]),a.get(r).push(o)}),{meshes:a,lightmap:n,rows:r}}catch(e){return console.warn(`stadium asset failed to load, using procedural stadium`,e),null}})(),S_)}function w_(e=11){let t=e,n=()=>(t=t*16807%2147483647)/2147483647,r=new js(1,1,1);r.translate(0,0,.5);let i=new _l({color:16777215});i.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vSkyPos;
varying vec3 vSkyN;
varying vec3 vSkySeed;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
        vec4 sw = modelMatrix * instanceMatrix * vec4(transformed, 1.0);
        vSkyPos = sw.xyz;
        vSkyN = normalize(mat3(modelMatrix * instanceMatrix) * normal);
        vSkySeed = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
        varying vec3 vSkyPos;
        varying vec3 vSkyN;
        varying vec3 vSkySeed;
        float skh(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }`).replace(`#include <fog_fragment>`,`#include <fog_fragment>
        // extra aerial perspective: the city sits far out in the haze
        #ifdef USE_FOG
        gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, 0.35 * smoothstep(20000.0, 60000.0, length(vSkyPos - cameraPosition)));
        #endif`).replace(`#include <color_fragment>`,`#include <color_fragment>
        {
          float side = 1.0 - step(0.5, abs(vSkyN.z));          // facades only; roofs stay plain
          float along = abs(vSkyN.x) > abs(vSkyN.y) ? vSkyPos.y : vSkyPos.x;
          float h = skh(vSkySeed.xy);
          float floorH = 360.0 + 60.0 * h;
          float colW = 260.0 + 220.0 * skh(vSkySeed.yx);
          float fy = fract(vSkyPos.z / floorH), fx = fract(along / colW);
          float spandrel = step(0.72, fy);                        // solid band between floors
          float mullion = step(0.9, fx);
          float glass = (1.0 - spandrel) * (1.0 - mullion);
          // once floors/columns shrink below a few pixels, blend the grid to its average (no shimmer)
          float gf = 1.0 - smoothstep(0.12, 0.45, max(fwidth(vSkyPos.z / floorH), fwidth(along / colW)));
          glass = mix(0.55, glass, gf);
          vec2 cell = vec2(floor(along / colW), floor(vSkyPos.z / floorH));
          float lit = skh(cell + vSkySeed.xy);
          vec3 sky = mix(vec3(0.35, 0.45, 0.6), vec3(0.65, 0.75, 0.88), clamp(vSkyPos.z / 12000.0, 0.0, 1.0));
          vec3 glassCol = sky * (0.55 + 0.35 * lit);
          vec3 frame = diffuseColor.rgb;
          diffuseColor.rgb = mix(diffuseColor.rgb, mix(frame, glassCol, glass), side);
        }`)},i.customProgramCacheKey=()=>`skyline`;let a=new es(r,i,150),o=new q,s=new Qr,c=new G,l=new G,u=new J,d=[12106948,9212830,14078664,7305092,11121599,13225169,5989488],f=0;for(let e=0;e<450&&f<150;e++){let e=n()*Math.PI*2,t=Math.abs(Math.atan2(Math.sin(e-1.9),Math.cos(e-1.9)))<.7,r=26e3+n()*(t?16e3:26e3),i=1400+n()*2600,p=1400+n()*2600,m=(t?6e3:2e3)+n()**1.6*(t?15e3:6e3);c.set(Math.cos(e)*r*.85,Math.sin(e)*r,-20),s.setFromAxisAngle(new G(0,0,1),Math.round(n()*4)*(Math.PI/8)),l.set(i,p,m),o.compose(c,s,l),a.setMatrixAt(f,o),a.setColorAt(f,u.setHex(d[n()*d.length|0])),f++}return a.count=f,a.instanceMatrix.needsUpdate=!0,a.instanceColor&&(a.instanceColor.needsUpdate=!0),a.frustumCulled=!1,a}function T_(){let e=[],t=(e,t)=>{let n=e.getAttribute(`position`).count;return e.setAttribute(`part`,new Y(Array(n).fill(t),1)),e},n=new js(18,30,34,1,1,1);n.translate(0,0,17);let r=new js(16,34,8);r.translate(0,0,32);let i=new Qc(8.5,1);i.translate(1,0,45),e.push(t(n.toNonIndexed(),0),t(r.toNonIndexed(),0),t(i.toNonIndexed(),1));for(let[n,r]of[[1,2],[-1,3]]){let i=new js(8,8,26);i.translate(0,n*17,20),e.push(t(i.toNonIndexed(),r))}let a=Ch(e);return a.computeVertexNormals(),a}function E_(){let e=new js(2.5,2.5,90);e.translate(4,12,60);let t=new el(52,34,8,1);t.rotateX(Math.PI/2),t.rotateZ(Math.PI/2),t.translate(4,38,88);let n=e.toNonIndexed(),r=t.toNonIndexed(),i=(e,t)=>{let n=e.getAttribute(`position`),r=new Float32Array(n.count);for(let e=0;e<n.count;e++)r[e]=t(n.getY(e));e.setAttribute(`flagU`,new Va(r,1))};i(n,()=>0),i(r,e=>Math.max(0,(e-12)/52));let a=Ch([n,r]);return a.computeVertexNormals(),a}var D_=[15921906,16748451,9425919,16769162,11071664,13215999,16752491,7062271,2763312,10133674,16238304,8380624,14172224,3166368];function O_(e,t){let n=e=>{let n=Math.sin(e*127.1+t*311.7)*43758.5453;return n-Math.floor(n)},r=Math.floor(e),i=e-r,a=i*i*(3-2*i);return n(r)*(1-a)+n(r+1)*a}function k_(e,t=3){let n=t,r=()=>(n=n*16807%2147483647)/2147483647,i={uTime:{value:0},uExcite:{value:0}},a=new ml({roughness:.85});a.onBeforeCompile=e=>{Object.assign(e.uniforms,i),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
        uniform float uTime, uExcite;
        attribute float part;
        varying float vPart;
        varying float vH;
        varying vec3 vSkin;
        float fh(float n) { return fract(sin(n * 12.9898) * 43758.5453); }
        mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }`).replace(`#include <beginnormal_vertex>`,`#include <beginnormal_vertex>
        float fid = float(gl_InstanceID);
        float ph = fh(fid) * 6.2831;
        float mood = fh(fid + 3.1);                       // how into the game this fan is
        float sp = 2.2 + fh(fid + 7.7) * 2.5;
        // cheer amount: rises with excitement, pulsing per fan
        float cheer = clamp(uExcite * (0.6 + mood) * (0.55 + 0.45 * sin(uTime * sp + ph)), 0.0, 1.0);
        float clap = step(0.55, mood) * (0.5 + 0.5 * sin(uTime * 9.0 + ph));
        // arm pitch about the shoulder: resting forward on the lap (~70deg) -> clapping -> thrown up (~165deg)
        float rest = 1.15 + 0.25 * fh(fid + 1.9);
        float armA = mix(rest + clap * 0.35 * (1.0 - cheer), 2.9 - 0.25 * fh(fid + 5.3), cheer);
        bool isArm = part > 1.5;
        mat3 R = rotY(isArm ? -armA : 0.0);
        objectNormal = R * objectNormal;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
        if (isArm) {
          vec3 pivot = vec3(0.0, position.y > 0.0 ? 17.0 : -17.0, 33.0);
          transformed = pivot + R * (position - pivot);
        }
        // bob: stand up / bounce when excited
        transformed.z += abs(sin(uTime * sp * (1.0 + uExcite) + ph)) * (1.5 + uExcite * 22.0 * mood);
        vPart = part;
        vH = clamp(position.z / 50.0, 0.0, 1.0);
        float sk = fh(fid + 9.4);
        vSkin = sk < 0.18 ? vec3(0.93, 0.72, 0.58) : sk < 0.36 ? vec3(0.84, 0.6, 0.44) : sk < 0.54 ? vec3(0.7, 0.48, 0.32)
              : sk < 0.72 ? vec3(0.5, 0.33, 0.22) : sk < 0.86 ? vec3(0.36, 0.23, 0.15) : vec3(0.96, 0.8, 0.68);`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
        varying float vPart;
        varying float vH;
        varying vec3 vSkin;`).replace(`#include <color_fragment>`,`#include <color_fragment>
        // heads get skin (the instance colour still carries the baked sun/shade factor via its brightness)
        float shade = max(diffuseColor.r, max(diffuseColor.g, diffuseColor.b));
        if (vPart > 0.5 && vPart < 1.5) diffuseColor.rgb = vSkin * clamp(shade * 1.3, 0.35, 1.15);
        // seated occlusion: dark at the seat, bright on the shoulders
        diffuseColor.rgb *= mix(0.45, 1.1, vH);`)},a.customProgramCacheKey=()=>`crowd-v2`;let o=e.reduce((e,t)=>e+Math.ceil(Math.hypot(t.b[0]-t.a[0],t.b[1]-t.a[1])/44)+1,0),s=new es(T_(),a,o),c=new ml({roughness:.8,side:2});c.onBeforeCompile=e=>{Object.assign(e.uniforms,i),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
uniform float uTime, uExcite;
attribute float flagU;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
        float fid = float(gl_InstanceID);
        float ph = fract(sin(fid * 78.233) * 43758.5453) * 6.2831;
        float amp = 4.0 + uExcite * 8.0;
        transformed.x += sin(uTime * 5.5 + ph + flagU * 5.0) * flagU * amp;
        transformed.z += sin(uTime * 3.1 + ph) * (2.0 + uExcite * 14.0) - flagU * flagU * 5.0;
        transformed.y += sin(uTime * 1.3 + ph) * 8.0 * clamp(position.z / 100.0, 0.0, 1.0);   // the pole sways`)};let l=Math.ceil(o/45),u=new es(E_(),c,l),d=new q,f=new Qr,p=new G(0,0,1),m=new G,h=new G,g=new J,_=new J(1,1,1),v=0,y=0,b=0;for(let t of e){let e=Math.hypot(t.b[0]-t.a[0],t.b[1]-t.a[1]),n=Math.floor(e/44),i=t.team?cg.orange:cg.blue,a=Math.atan2(t.n[1],t.n[0]),c=(t.a[1]+t.b[1])/2,x=.3+.35*Zr.smoothstep(Math.abs(c),2500,7e3);b++;for(let e=0;e<=n;e++){if(r()<.05)continue;if(v>=o)break;let c=n?e/n:.5,S=t.a[0]+(t.b[0]-t.a[0])*c,C=t.a[1]+(t.b[1]-t.a[1])*c;m.set(S+(r()-.5)*5,C+(r()-.5)*5,t.a[2]),f.setFromAxisAngle(p,a+(r()-.5)*.35);let w=.92+r()*.18;h.set(w,w*(.95+r()*.12),w*(.94+r()*.14)),d.compose(m,f,h),s.setMatrixAt(v,d);let T=(S*.7+C)/420,E=O_(T+b*.37,1.3),D=D_[Math.floor(O_(T*.6+b*.21,7.1)*D_.length)%D_.length],O=r();O<x+.15*E?g.copy(i).lerp(_,.12+r()*.2).multiplyScalar(.85+r()*.25):O<x+.45?g.setHex(D).multiplyScalar(.8+r()*.25):g.setHex(D_[r()*D_.length|0]).multiplyScalar(.75+r()*.3);let k=t.sun[Math.min(t.sun.length-1,Math.floor(c*t.sun.length))]??0;if(s.setColorAt(v,g.multiplyScalar(.8+.55*k)),y<l&&r()<1/45){u.setMatrixAt(y,d);let e=r()<.7?g.copy(i).lerp(_,.1):g.setHex(D_[r()*D_.length|0]);u.setColorAt(y,e.multiplyScalar(.8+.5*k)),y++}v++}}s.count=v,u.count=y;for(let e of[s,u])e.instanceMatrix.needsUpdate=!0,e.instanceColor&&(e.instanceColor.needsUpdate=!0),e.frustumCulled=!1;let x=new Ji;return x.add(s,u),{group:x,update(e,t){i.uTime.value=e,i.uExcite.value+=(t-i.uExcite.value)*.05}}}var A_=2200;function j_(e){let t=[],n=[{cx:2700,cy:4700,a0:0},{cx:-2700,cy:4700,a0:Math.PI/2},{cx:-2700,cy:-4700,a0:Math.PI},{cx:2700,cy:-4700,a0:Math.PI*1.5}],r=0,i=null,a=(e,n,a,o)=>{i&&(r+=Math.hypot(e-i.x,n-i.y)),t.push({x:e,y:n,nx:a,ny:o,s:r}),i={x:e,y:n}};for(let t=0;t<4;t++){let r=n[t],i=Math.max(6,Math.ceil(Math.PI/2*A_/e));for(let e=0;e<i;e++){let t=r.a0+e/i*(Math.PI/2);a(r.cx+Math.cos(t)*A_,r.cy+Math.sin(t)*A_,Math.cos(t),Math.sin(t))}let o=n[(t+1)%4],s=r.a0+Math.PI/2,c=r.cx+Math.cos(s)*A_,l=r.cy+Math.sin(s)*A_,u=o.cx+Math.cos(s)*A_,d=o.cy+Math.sin(s)*A_,f=Math.max(1,Math.ceil(Math.hypot(u-c,d-l)/e));for(let e=0;e<f;e++){let t=e/f;a(c+(u-c)*t,l+(d-l)*t,Math.cos(s),Math.sin(s))}}return t}var M_=(()=>{let e=j_(50),t=e[e.length-1],n=e[0];return t.s+Math.hypot(n.x-t.x,n.y-t.y)})(),N_={d0:0,z0:380,rows:16,run:120,rise:64},P_=N_.z0+N_.rows*N_.rise,F_=N_.d0+N_.rows*N_.run,$={d0:1480,z0:2080,rows:20,run:125,rise:82},I_=$.z0+$.rows*$.rise,L_=$.d0+$.rows*$.run,R_=700,z_=L_+150,B_=e=>4420+(z_-e)/(z_-R_)*360,V_=e=>B_(e)-170,H_=1750,U_=70,W_=e=>(e%H_+H_)%H_<U_;function G_(e,t){let n=e.length,r=[],i=[],a=[],o=[],s=[],c=0,l=new J;for(let u of t){let t=u.b[0]-u.a[0],d=u.b[1]-u.a[1],f=Math.hypot(t,d)||1,p=-d/f,m=t/f,[h,g]=u.shade??[1,1],_=0;for(let t=0;t<=n;t++){let s=e[t%n];if(t>0){let n=e[t-1],r=(u.a[0]+u.b[0])/2;_+=Math.hypot(s.x+s.nx*r-(n.x+n.nx*r),s.y+s.ny*r-(n.y+n.ny*r))||0}l.copy(u.col(s));for(let[e,t,n]of[[u.a,h,0],[u.b,g,1]])r.push(s.x+s.nx*e[0],s.y+s.ny*e[0],e[1]),i.push(s.nx*p,s.ny*p,m),a.push(l.r*t,l.g*t,l.b*t),o.push(u.uvLen?_/u.uvLen:0,n)}for(let e=0;e<n;e++){let t=c+e*2,n=c+(e+1)*2;s.push(t,n,t+1,n,n+1,t+1)}c+=(n+1)*2}let u=new to;return u.setAttribute(`position`,new Y(r,3)),u.setAttribute(`normal`,new Y(i,3)),u.setAttribute(`color`,new Y(a,3)),u.setAttribute(`uv`,new Y(o,2)),u.setIndex(s),u}var K_=e=>e.y<0?cg.blue:cg.orange;function q_(e,t){let n=Zr.smoothstep(Math.abs(e),0,2600);return t.setRGB(1,1,1).lerp(e<0?cg.blue:cg.orange,n)}function J_(e,t){return t<$.z0-50&&e>$.d0-150?.42:t>=$.z0-50?Zr.lerp(.95,.5,Zr.clamp((e-$.d0)/(L_-$.d0),0,1)):.95}var Y_={asset:null};function X_(){return Y_.asset?Z_(Y_.asset):ev()}function Z_(e){let t=new Ji,n=new X(new Ms(4e4,48),new _l({color:3816768}));n.position.z=-20,t.add(n);let r=t=>e.meshes.get(t)??[],i=6*Math.PI*.45*2,a=new Map;for(let n of r(`Baked`)){let r=n.material,o=a.get(r);if(!o){o=new _o({color:r.color,lightMap:e.lightmap,lightMapIntensity:i,side:2});let t=Q_[r.name];t&&$_(o,t),a.set(r,o)}t.add(new X(n.geometry,o))}for(let e of r(`Unbaked`)){let n=e.material;t.add(new X(e.geometry,new _l({color:n.color,side:2})))}let o=new _o({color:16777215,side:2});o.color.setScalar(1.8);for(let e of r(`Lamps`))t.add(new X(e.geometry,o));let s=ov();s.wrapS=Lt,s.anisotropy=8,s.flipY=!1;let c=new _o({map:s,vertexColors:!0,side:2});c.color.setScalar(1.35);let l=new J;for(let e of r(`LEDs`)){let n=e.geometry,r=n.getAttribute(`position`),i=new Float32Array(r.count*3);for(let e=0;e<r.count;e++)q_(r.getY(e),l),i.set([l.r,l.g,l.b],e*3);n.setAttribute(`color`,new Va(i,3)),t.add(new X(n,c))}let u=cv();u.wrapS=Lt,u.flipY=!1;let d=new _o({map:u,side:2});d.color.setScalar(.9);for(let e of r(`Suites`))t.add(new X(e.geometry,d));let f=tv(1024,512);f.tex.flipY=!1;let p=new _o({map:f.tex,side:2});p.color.setScalar(1.2);for(let e of r(`Screens`))t.add(new X(e.geometry,p));let m=new _l({vertexColors:!0,side:2});for(let e of r(`Flags`))t.add(new X(e.geometry,m));let h=new hl({color:10466496,roughness:.05,metalness:0,transparent:!0,opacity:.28,depthWrite:!1,side:2});for(let e of r(`Glass`)){let n=new X(e.geometry,h);n.renderOrder=3,t.add(n)}let g=sv();g.flipY=!1;let _=new _o({map:g,side:2});_.color.setScalar(1.15);for(let e of r(`Boards`))t.add(new X(e.geometry,_));t.add(w_());let v=k_(e.rows);return t.add(v.group),{group:t,update(e,t){v.update(e,t),s.offset.x=e*.06%1},setScreens:f.set}}var Q_={Concrete:{set:`concrete`,tile:320,amt:.85,relief:.35},Aisle:{set:`concrete`,tile:220,amt:.9,relief:.35},ConcreteDark:{set:`concrete_wall`,tile:520,amt:.8,relief:.4},Facade:{set:`concrete_wall`,tile:520,amt:.7,relief:.4},SteelWhite:{set:`metal_plate`,tile:240,amt:.55,relief:.3},SteelDark:{set:`metal_plate`,tile:240,amt:.5,relief:.3},Membrane:{set:`metal_sheet`,tile:360,amt:.7,relief:.6},Seat:{set:`track`,tile:160,amt:.35,relief:.2}};function $_(e,t){let n=kh(t.set);e.onBeforeCompile=e=>{e.uniforms.uDet={value:n.detail},e.uniforms.uDetN={value:n.normal},e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vDetPos;
varying vec3 vDetN;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vDetPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
vDetN = normalize(mat3(modelMatrix) * normal);`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
        uniform sampler2D uDet, uDetN;
        varying vec3 vDetPos;
        varying vec3 vDetN;
        ${jh}`).replace(`#include <color_fragment>`,`#include <color_fragment>
        {
          vec3 n = normalize(vDetN);
          float near = triplanar(uDet, vDetPos, n, ${t.tile.toFixed(1)}).r * 2.0;
          float coarse = triplanar(uDet, vDetPos + 173.0, n, ${(t.tile*5.7).toFixed(1)}).r * 2.0;
          float fade = smoothstep(2500.0, 12000.0, length(cameraPosition - vDetPos));
          float det = mix(near * mix(1.0, coarse, 0.5), coarse, fade);
          vec3 tn = triplanar(uDetN, vDetPos, n, ${t.tile.toFixed(1)}).xyz * 2.0 - 1.0;
          float relief = 1.0 + (tn.x * 0.6 + tn.y * 0.8) * ${t.relief.toFixed(2)} * (1.0 - fade) - (1.0 - tn.z) * 0.5;
          diffuseColor.rgb *= mix(1.0, det, ${t.amt.toFixed(2)}) * relief;
        }`)},e.customProgramCacheKey=()=>`detail-${t.set}-${t.tile}-${t.amt}-${t.relief}`}function ev(){let e=new Ji,t=j_(140),n=new X(new Ms(4e4,48),new ml({color:856084,roughness:1}));n.position.z=-20,e.add(n);let r=new J(.42,.43,.45),i=new J(.2,.21,.23),a=[],o=(e,t)=>n=>W_(n.s)?r:new J(.3,.31,.33).lerp(K_(n),.12).multiplyScalar((t%5==0?1.25:1)*(e===`low`?1:.92)),s=()=>new J(.24,.25,.27);a.push({a:[N_.d0,0],b:[N_.d0,N_.z0],col:()=>i});for(let e=0;e<N_.rows;e++){let t=N_.d0+e*N_.run,n=N_.z0+e*N_.rise,r=J_(t,n);a.push({a:[t,n],b:[t,n+N_.rise],col:s,shade:[r*.55,r]}),a.push({a:[t,n+N_.rise],b:[t+N_.run,n+N_.rise],col:o(`low`,e),shade:[r,r*.8]})}a.push({a:[F_,P_],b:[F_,$.z0-330],col:()=>i,shade:[.5,.5]}),a.push({a:[F_,$.z0-330],b:[$.d0,$.z0-330],col:()=>r,shade:[.35,.5]}),a.push({a:[$.d0,$.z0-330],b:[$.d0,$.z0],col:()=>i});for(let e=0;e<$.rows;e++){let t=$.d0+e*$.run,n=$.z0+e*$.rise,r=J_(t,n);a.push({a:[t,n],b:[t,n+$.rise],col:s,shade:[r*.55,r]}),a.push({a:[t,n+$.rise],b:[t+$.run,n+$.rise],col:o(`up`,e),shade:[r,r*.8]})}a.push({a:[L_,I_],b:[L_,V_(L_)+10],col:()=>i,shade:[.4,.3]});let c=new ml({vertexColors:!0,roughness:.88,metalness:0,side:2});e.add(new X(G_(t,a),c));let l=ov();l.wrapS=Lt,l.anisotropy=8;let u=new J,d=(e,t,n)=>({a:[e-6,t],b:[e-6,n],col:e=>q_(e.y,u).clone(),uvLen:-2400}),f=G_(t,[d(N_.d0,70,330),d($.d0,$.z0-300,$.z0-40)]),p=new _o({map:l,vertexColors:!0,side:2});p.color.setScalar(1.35),e.add(new X(f,p));let m=cv();m.wrapS=Lt;let h=G_(t,[{a:[F_-4,P_+60],b:[F_-4,$.z0-380],col:()=>new J(1,1,1),uvLen:900}]),g=new _o({map:m,side:2});g.color.setScalar(.9),e.add(new X(h,g));let _=new ml({color:12107980,metalness:.9,roughness:.25});for(let[t,n]of[[N_.d0-8,N_.z0+110],[$.d0-8,$.z0+100]]){let r=j_(260).map(e=>new G(e.x+e.nx*t,e.y+e.ny*t,n));e.add(new X(new rl(new Ws(r,!0),r.length*2,4,6,!0),_))}let v=new J(.5,.52,.55),y=[{a:[z_,B_(z_)],b:[R_,B_(R_)],col:()=>v,shade:[.8,.8]},{a:[R_,V_(R_)],b:[z_,V_(z_)],col:()=>new J(.62,.64,.67),shade:[.75,.45]},{a:[R_,B_(R_)],b:[R_,V_(R_)],col:()=>new J(.7,.72,.75)},{a:[z_,V_(z_)],b:[z_,0],col:()=>i,shade:[.4,.2]}],b=new ml({vertexColors:!0,roughness:.6,metalness:.4,side:2});e.add(new X(G_(t,y),b));let x=j_(640),S=new es(new js(1,1,1),new ml({color:10791345,metalness:.6,roughness:.4}),x.length*3),C=new q,w=new G,T=new G,E=new G,D=0,O=(e,t,n,r,i,a,o)=>{let s=new G(e.x+e.nx*t,e.y+e.ny*t,n),c=new G(e.x+e.nx*r,e.y+e.ny*r,i);w.subVectors(c,s);let l=w.length();w.normalize(),T.set(-e.ny,e.nx,0),E.crossVectors(w,T).normalize(),C.makeBasis(w.clone().multiplyScalar(l),T.clone().multiplyScalar(a),E.clone().multiplyScalar(o)),C.setPosition(s.add(c).multiplyScalar(.5)),S.setMatrixAt(D++,C)};for(let e of x)O(e,760,V_(R_)-40,z_,V_(z_)-90,38,60),O(e,760,V_(R_)-40,(R_+z_)/2,V_((R_+z_)/2)-5,24,30),O(e,(R_+z_)/2,V_((R_+z_)/2)-250,z_,V_(z_)-90,24,30);S.count=D,S.instanceMatrix.needsUpdate=!0,S.frustumCulled=!1,e.add(S);let k=j_(260).map(e=>new G(e.x+e.nx*760,e.y+e.ny*760,V_(R_)-70));e.add(new X(new rl(new Ws(k,!0),k.length*2,34,6,!0),S.material));let A=new _o({map:lv(),transparent:!0,depthWrite:!1,side:2});A.color.setScalar(1.6);let j=new ml({color:7172730,metalness:.6,roughness:.5}),ee=j_(520),M=new es(new el(420,150),A,ee.length),N=new es(new js(450,180,60),j,ee.length),P=new G,F=new qi;ee.forEach((e,t)=>{F.position.set(e.x+e.nx*660,e.y+e.ny*660,V_(R_)-110),P.set(e.x*.35,e.y*.35,0),F.up.set(0,0,1),F.lookAt(P),F.updateMatrix(),N.setMatrixAt(t,new q().multiplyMatrices(F.matrix,new q().makeTranslation(0,0,-34))),M.setMatrixAt(t,F.matrix)});for(let t of[M,N])t.instanceMatrix.needsUpdate=!0,t.frustumCulled=!1,e.add(t);M.renderOrder=2;let te=av();e.add(te.mesh);let ne=tv(1024,384),re=new _o({map:ne.tex});re.color.setScalar(1.2);let ie=new ml({color:723984,roughness:.5,metalness:.5});for(let t of[-1,1]){let n=new Ji;n.position.set(0,t*8050,3420),n.lookAt(0,0,2600);let r=new X(new el(3600,1350),re);r.position.z=2;let i=new X(new js(3780,1500,140),ie);i.position.z=-75,n.add(r,i);for(let e of[-1300,1300]){let t=new X(new Ns(9,9,900,6),_);t.position.set(e,1150,-75),n.add(t)}e.add(n)}return{group:e,update(e,t){te.uniforms.uTime.value=e,te.uniforms.uExcite.value+=(t-te.uniforms.uExcite.value)*.05,l.offset.x=e*.06%1},setScreens:ne.set}}function tv(e,t){let n=document.createElement(`canvas`);n.width=e,n.height=t;let r=new Ds(n);r.colorSpace=sr,r.anisotropy=8;let i=``,a=(a,o,s)=>{let c=`${a}|${o}|${s}`;if(c===i)return;i=c;let l=n.getContext(`2d`),u=e*.35,d=t*.53;l.fillStyle=`#05070b`,l.fillRect(0,0,e,t);let f=l.createLinearGradient(0,0,u,0);f.addColorStop(0,`#0d3fd6`),f.addColorStop(1,`#2f7bff`),l.fillStyle=f,l.fillRect(0,0,u,t);let p=l.createLinearGradient(e-u,0,e,0);p.addColorStop(0,`#ff8a2a`),p.addColorStop(1,`#e05a00`),l.fillStyle=p,l.fillRect(e-u,0,u,t),l.fillStyle=`#fff`;let m=Math.min(t*.6,u*.6);l.font=`bold italic ${m}px Arial, sans-serif`,l.textAlign=`center`,l.textBaseline=`middle`,l.fillText(String(a),u/2,d),l.fillText(String(o),e-u/2,d),l.font=`bold ${m*.6}px Arial, sans-serif`;let h=Math.min(1,(e-2*u)*.85/Math.max(1,l.measureText(s).width));l.font=`bold ${Math.floor(m*.6*h)}px Arial, sans-serif`,l.fillText(s,e/2,d),l.fillStyle=`rgba(0,0,0,0.28)`;for(let n=0;n<e;n+=4)l.fillRect(n,0,1,t);for(let n=0;n<t;n+=4)l.fillRect(0,n,e,1);r.needsUpdate=!0};return a(0,0,`5:00`),{tex:r,set:a}}function nv(){let e=new Ns(11,14,38,6,1);e.rotateX(Math.PI/2),e.translate(0,0,19);let t=new Qc(8,0);t.translate(0,0,47);let n=Ch([e.toNonIndexed(),t.toNonIndexed()]);n.computeVertexNormals();let r=new ml({roughness:.85}),i={uTime:{value:0},uExcite:{value:0}};return r.onBeforeCompile=e=>{Object.assign(e.uniforms,i),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
uniform float uTime;
uniform float uExcite;
varying float vHead;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
        float fid = float(gl_InstanceID);
        float ph = fract(sin(fid * 12.9898) * 43758.5453) * 6.2831;
        float sp = 2.0 + fract(sin(fid * 78.233) * 4375.85) * 2.0;
        float bob = abs(sin(uTime * sp * (1.0 + uExcite) + ph));
        transformed.z += bob * (2.0 + uExcite * 40.0);
        transformed.x += sin(uTime * 1.3 + ph) * 1.5;
        vHead = step(40.0, position.z);`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying float vHead;`).replace(`#include <color_fragment>`,`#include <color_fragment>
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.42, 0.3, 0.22) * (0.6 + 0.4 * diffuseColor.g / max(0.001, max(diffuseColor.r, diffuseColor.b))), vHead * 0.9);`)},{person:n,mat:r,uniforms:i}}var rv=[15921906,16748451,9425919,16769162,11071664,13215999,16752491,7062271,16777215,10133674,16238304,8380624];function iv(e,t,n){return Math.random()<.3?n.copy(e).lerp(new J(1,1,1),.25).multiplyScalar(.8+Math.random()*.3):n.setHex(rv[Math.random()*rv.length|0]).multiplyScalar(.7+Math.random()*.35),n.multiplyScalar(t)}function av(){let{person:e,mat:t,uniforms:n}=nv(),r=j_(20),i=[];for(let e=0;e<N_.rows;e++)i.push({d:N_.d0+e*N_.run+N_.run*.55,z:N_.z0+(e+1)*N_.rise});for(let e=0;e<$.rows;e++)i.push({d:$.d0+e*$.run+$.run*.55,z:$.z0+(e+1)*$.rise});let a=i.reduce((e,t)=>e+Math.ceil((M_+2*Math.PI*t.d)/46)+4,0),o=new es(e,t,a),s=new q,c=new Qr,l=new G(0,0,1),u=new G,d=new G,f=new J,p=0;for(let e of i){let t=J_(e.d,e.z),n=46*Math.random();for(let i=0;i<r.length;i++){let m=r[i],h=r[(i+1)%r.length],g=m.x+m.nx*e.d,_=m.y+m.ny*e.d,v=Math.hypot(h.x+h.nx*e.d-g,h.y+h.ny*e.d-_);for(n+=v;n>=46&&p<a;){if(n-=46,W_(m.s)||Math.random()<.06)continue;let r=(Math.random()-.5)*8,i=(Math.random()-.5)*8;u.set(g+r,_+i,e.z),c.setFromAxisAngle(l,Math.atan2(-m.ny,-m.nx)+(Math.random()-.5)*.6);let a=.88+Math.random()*.24;d.set(a,a,a*(.92+Math.random()*.16)),s.compose(u,c,d),o.setMatrixAt(p,s),o.setColorAt(p,iv(K_(m),t,f)),p++}}}return o.count=p,o.instanceMatrix.needsUpdate=!0,o.instanceColor&&(o.instanceColor.needsUpdate=!0),o.frustumCulled=!1,{mesh:o,uniforms:n}}function ov(){let e=2048,t=document.createElement(`canvas`);t.width=e,t.height=128;let n=t.getContext(`2d`);n.fillStyle=`#05060a`,n.fillRect(0,0,e,128),n.fillStyle=`#9fb6d8`;for(let e=0;e<640;e+=64)n.beginPath(),n.moveTo(e,18),n.lineTo(e+26,18),n.lineTo(e+52,64),n.lineTo(e+26,110),n.lineTo(e,110),n.lineTo(e+26,64),n.closePath(),n.fill();let r=n.createLinearGradient(680,0,1400,0);r.addColorStop(0,`#ffffff`),r.addColorStop(1,`#b9c9e6`),n.fillStyle=r,n.font=`bold italic 96px Arial, sans-serif`,n.textBaseline=`middle`,n.fillText(`SOCCAR`,700,68);for(let e=0;e<12;e++){let t=1440+e*50;n.fillStyle=`rgba(255,255,255,${.25+.06*e})`,n.fillRect(t,20+e*3,34,88-e*6)}n.fillStyle=`rgba(0,0,0,0.35)`;for(let t=0;t<e;t+=4)n.fillRect(t,0,1,128);for(let t=0;t<128;t+=4)n.fillRect(0,t,e,1);let i=new Ds(t);return i.colorSpace=sr,i}function sv(){let e=document.createElement(`canvas`);e.width=2048,e.height=512;let t=e.getContext(`2d`);[{bg:[`#0b1f4d`,`#1c56d8`],fg:`#ffffff`,title:`VOLTEX`,sub:`ENERGY DRINK`},{bg:[`#1a1a1a`,`#3a3a3a`],fg:`#ffb21e`,title:`APEX`,sub:`PERFORMANCE TYRES`},{bg:[`#f25a0c`,`#ff9a3c`],fg:`#ffffff`,title:`NOVA`,sub:`MOTORS`},{bg:[`#0d0d12`,`#23232e`],fg:`#8fd3ff`,title:`SOCCAR`,sub:`LEAGUE  SEASON 1`}].forEach((e,n)=>{let r=n*512,i=t.createLinearGradient(r,0,r+512,512);i.addColorStop(0,e.bg[0]),i.addColorStop(1,e.bg[1]),t.fillStyle=i,t.fillRect(r,0,512,512),t.fillStyle=`rgba(255,255,255,0.08)`;for(let e=0;e<6;e++)t.fillRect(r+e*90-40,0,30,512);t.fillStyle=e.fg,t.textAlign=`center`,t.textBaseline=`middle`,t.font=`bold italic 150px Arial, sans-serif`,t.fillText(e.title,r+256,225.28,460.8),t.font=`bold 44px Arial, sans-serif`,t.fillText(e.sub,r+256,378.88,460.8),t.fillStyle=`rgba(0,0,0,0.25)`;for(let e=r;e<r+512;e+=4)t.fillRect(e,0,1,512);for(let e=0;e<512;e+=4)t.fillRect(r,e,512,1)});let n=new Ds(e);return n.colorSpace=sr,n.anisotropy=8,n}function cv(){let e=document.createElement(`canvas`);e.width=512,e.height=128;let t=e.getContext(`2d`);t.fillStyle=`#0a0c10`,t.fillRect(0,0,512,128);for(let e=0;e<4;e++){let n=e*128+10,r=.55+Math.random()*.45,i=t.createLinearGradient(0,14,0,114);i.addColorStop(0,`rgba(255,214,160,${r})`),i.addColorStop(1,`rgba(120,90,60,${r*.6})`),t.fillStyle=i,t.fillRect(n,14,108,100),t.fillStyle=`rgba(10,10,14,0.8)`;for(let e=0;e<3;e++){let e=n+16+Math.random()*76;t.fillRect(e,70,12,44),t.beginPath(),t.arc(e+6,64,7,0,Math.PI*2),t.fill()}}let n=new Ds(e);return n.colorSpace=sr,n}function lv(){let e=document.createElement(`canvas`);e.width=256,e.height=96;let t=e.getContext(`2d`);t.clearRect(0,0,256,96);for(let e=0;e<3;e++)for(let n=0;n<8;n++){let r=16+n*32,i=16+e*32,a=t.createRadialGradient(r,i,0,r,i,14);a.addColorStop(0,`rgba(255,255,255,1)`),a.addColorStop(.55,`rgba(235,244,255,0.9)`),a.addColorStop(1,`rgba(200,220,255,0)`),t.fillStyle=a,t.beginPath(),t.arc(r,i,14,0,Math.PI*2),t.fill()}let n=new Ds(e);return n.colorSpace=sr,n}var uv=`
  attribute float aSize;
  attribute vec4 aColor;
  varying vec4 vColor;
  uniform float uScale;
  void main() {
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uScale / max(1.0, -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`,dv=`
  varying vec4 vColor;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    gl_FragColor = vec4(vColor.rgb * a * vColor.a, a * vColor.a);
  }
`,fv=class{max;points;pool;pos;col;size;geo;cursor=0;material;constructor(e=6e3){this.max=e,this.pool=Array.from({length:e},()=>({alive:!1,px:0,py:0,pz:0,vx:0,vy:0,vz:0,life:0,maxLife:1,size0:1,size1:1,r:1,g:1,b:1,drag:0,grav:0})),this.pos=new Float32Array(e*3),this.col=new Float32Array(e*4),this.size=new Float32Array(e),this.geo=new to,this.geo.setAttribute(`position`,new Va(this.pos,3).setUsage(pr)),this.geo.setAttribute(`aColor`,new Va(this.col,4).setUsage(pr)),this.geo.setAttribute(`aSize`,new Va(this.size,1).setUsage(pr)),this.material=new fl({uniforms:{uScale:{value:800}},vertexShader:uv,fragmentShader:dv,transparent:!0,depthWrite:!1,blending:2}),this.points=new ws(this.geo,this.material),this.points.frustumCulled=!1,this.points.renderOrder=5}setViewportHeight(e,t){this.material.uniforms.uScale.value=e/(2*Math.tan(Zr.degToRad(t)/2))}spawn(e,t,n,r,i,a,o=0,s=0){let c=this.pool[this.cursor];this.cursor=(this.cursor+1)%this.max,c.alive=!0,c.px=e.x,c.py=e.y,c.pz=e.z,c.vx=t.x,c.vy=t.y,c.vz=t.z,c.life=0,c.maxLife=n,c.size0=r,c.size1=i,c.r=a.r,c.g=a.g,c.b=a.b,c.drag=o,c.grav=s}burst(e,t,n,r,i,a,o={}){for(let s=0;s<t;s++){let t=Math.random()*2-1,s=Math.random()*Math.PI*2,c=Math.sqrt(1-t*t),l=n*(.3+Math.random()*.7);this.spawn(e,{x:Math.cos(s)*c*l,y:Math.sin(s)*c*l,z:t*l+(o.up??0)},r*(.5+Math.random()*.5),i,i*.2,a,o.drag??1.5,o.grav??0)}}update(e){let t=this.pos,n=this.col,r=this.size;for(let i=0;i<this.max;i++){let a=this.pool[i];if(!a.alive){r[i]=0,n[i*4+3]=0;continue}if(a.life+=e,a.life>=a.maxLife){a.alive=!1,r[i]=0,n[i*4+3]=0;continue}let o=Math.exp(-a.drag*e);a.vx*=o,a.vy*=o,a.vz=a.vz*o+a.grav*e,a.px+=a.vx*e,a.py+=a.vy*e,a.pz+=a.vz*e;let s=a.life/a.maxLife;t[i*3]=a.px,t[i*3+1]=a.py,t[i*3+2]=a.pz,r[i]=a.size0+(a.size1-a.size0)*s;let c=s<.1?s/.1:1-(s-.1)/.9;n[i*4]=a.r,n[i*4+1]=a.g,n[i*4+2]=a.b,n[i*4+3]=c}this.geo.attributes.position.needsUpdate=!0,this.geo.attributes.aColor.needsUpdate=!0,this.geo.attributes.aSize.needsUpdate=!0}},pv=class{segments;width;mesh;pts=[];sides=[];geo;posArr;alphaArr;mat;intensity=0;constructor(e=40,t=new J(16777215),n=6){this.segments=e,this.width=n,this.geo=new to,this.posArr=new Float32Array(e*2*3),this.alphaArr=new Float32Array(e*2),this.geo.setAttribute(`position`,new Va(this.posArr,3).setUsage(pr)),this.geo.setAttribute(`aAlpha`,new Va(this.alphaArr,1).setUsage(pr));let r=[];for(let t=0;t<e-1;t++){let e=t*2,n=t*2+1,i=t*2+2,a=t*2+3;r.push(e,n,i,n,a,i)}this.geo.setIndex(r),this.mat=new fl({uniforms:{uColor:{value:t},uIntensity:{value:0}},vertexShader:`attribute float aAlpha; varying float vA; void main(){ vA = aAlpha; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);} `,fragmentShader:`uniform vec3 uColor; uniform float uIntensity; varying float vA; void main(){ float a = vA * uIntensity * 0.7; gl_FragColor = vec4(uColor * a * 1.2, a);} `,transparent:!0,depthWrite:!1,blending:2,side:2}),this.mesh=new X(this.geo,this.mat),this.mesh.frustumCulled=!1,this.mesh.renderOrder=4}reset(){this.pts.length=0,this.sides.length=0}update(e,t,n,r){this.intensity+=(+!!r-this.intensity)*(1-Math.exp(-(r?10:3)*e)),this.pts.unshift(t.clone()),this.sides.unshift(n.clone().multiplyScalar(this.width)),this.pts.length>this.segments&&(this.pts.pop(),this.sides.pop());let i=this.pts.length;for(let e=0;e<this.segments;e++){let t=this.pts[Math.min(e,i-1)],n=this.sides[Math.min(e,i-1)],r=e/(this.segments-1),a=1-r;this.posArr.set([t.x+n.x*a,t.y+n.y*a,t.z+n.z*a],e*6),this.posArr.set([t.x-n.x*a,t.y-n.y*a,t.z-n.z*a],e*6+3);let o=e<i?(1-r)*(1-r):0;this.alphaArr[e*2]=o,this.alphaArr[e*2+1]=o}this.geo.attributes.position.needsUpdate=!0,this.geo.attributes.aAlpha.needsUpdate=!0,this.mat.uniforms.uIntensity.value=this.intensity,this.mesh.visible=this.intensity>.01}},mv=class{mesh;t=1;mat;constructor(e){this.mat=new fl({uniforms:{uColor:{value:new J(1,1,1)},uFade:{value:0},uCam:{value:new G}},vertexShader:`varying vec3 vN; varying vec3 vW; void main(){ vN = normalize(mat3(modelMatrix)*normal); vec4 w = modelMatrix*vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`uniform vec3 uColor; uniform float uFade; uniform vec3 uCam; varying vec3 vN; varying vec3 vW; void main(){ float f = pow(max(1.0 - abs(dot(normalize(uCam - vW), vN)), 0.0), 2.5); float a = f * uFade; gl_FragColor = vec4(uColor * a * 2.0, a); }`,transparent:!0,depthWrite:!1,blending:2,side:2}),this.mesh=new X(new tl(1,48,24),this.mat),this.mesh.visible=!1,this.mesh.renderOrder=7,e.add(this.mesh)}trigger(e,t){this.t=0,this.mesh.position.copy(e),this.mat.uniforms.uColor.value.copy(t),this.mesh.visible=!0}update(e,t){if(this.t>=1){this.mesh.visible=!1;return}this.t=Math.min(1,this.t+e/1.1);let n=1-(1-this.t)**3;this.mesh.scale.setScalar(50+n*2600),this.mat.uniforms.uFade.value=1-this.t,this.mat.uniforms.uCam.value.copy(t)}},hv=`
  attribute vec2 aUv;
  varying vec2 vUv;
  void main() { vUv = aUv; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); }
`,gv=`
  uniform float uTime;
  uniform float uSeed;
  uniform vec3 uCore;
  uniform vec3 uEdge;
  uniform float uGain;
  varying vec2 vUv; // x: age 0 (at the outlet) .. 1 (dying), y: -1..1 across
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 x) {
    vec2 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }
  void main() {
    float u = vUv.x;
    // wisps: the streak breaks up along its length as it ages
    float n = noise(vec2(u * 7.0 - uTime * 9.0, uSeed * 13.0 + vUv.y * 1.5)) * 0.65
            + noise(vec2(u * 19.0 - uTime * 23.0, uSeed * 7.0 - vUv.y * 3.0)) * 0.35;
    float across = clamp(1.0 - vUv.y * vUv.y, 0.0, 1.0); // clamp: pow() of a tiny negative is NaN (bloom blob)
    float core = pow(across, 3.0) * (1.0 - smoothstep(0.1, 0.6, u)) * (0.6 + 0.4 * n);
    float body = across * across * smoothstep(0.25 + u * 0.6, 0.5 + u * 0.6, n);
    float a = max(core, body * (1.0 - u) * (1.0 - u)) * smoothstep(0.0, 0.04, u);
    vec3 col = mix(uEdge, uCore, clamp(core * 1.4 + 0.25 * (1.0 - u), 0.0, 1.0));
    gl_FragColor = vec4(col * a * uGain, a);
  }
`,_v=class{opts;mesh;pts=[];pos;uv;geo;mat;tmpA=new G;tmpB=new G;prevSide=new G;constructor(e,t){this.opts=t;let n=t.max;this.pos=new Float32Array(n*2*3),this.uv=new Float32Array(n*2*2),this.geo=new to,this.geo.setAttribute(`position`,new Va(this.pos,3).setUsage(pr)),this.geo.setAttribute(`aUv`,new Va(this.uv,2).setUsage(pr));let r=[];for(let e=0;e<n-1;e++){let t=e*2;r.push(t,t+1,t+2,t+1,t+3,t+2)}this.geo.setIndex(r),this.mat=new fl({uniforms:{uTime:{value:0},uSeed:{value:Math.random()*10},uGain:{value:t.gain},uCore:{value:new J(t.core)},uEdge:{value:new J(t.edge)}},vertexShader:hv,fragmentShader:gv,transparent:!0,depthWrite:!1,blending:2,side:2}),this.mesh=new X(this.geo,this.mat),this.mesh.frustumCulled=!1,this.mesh.renderOrder=6,this.mesh.visible=!1,e.add(this.mesh)}dispose(e){e.remove(this.mesh),this.geo.dispose(),this.mat.dispose()}update(e,t,n,r,i,a,o){let s=this.opts;for(let t of this.pts)t.age+=e,t.p.addScaledVector(t.v,e),t.v.multiplyScalar(Math.exp(-4*e));for(;this.pts.length&&this.pts[this.pts.length-1].age>s.life;)this.pts.pop();if(o){let e=r.clone().multiplyScalar(s.speed).add(i);e.x+=(Math.random()-.5)*s.jitter,e.y+=(Math.random()-.5)*s.jitter,e.z+=(Math.random()-.5)*s.jitter,this.pts.unshift({p:n.clone(),v:e,age:0}),this.pts.length>s.max&&this.pts.pop()}let c=this.pts.length;if(this.mesh.visible=c>1,!(c<2)){for(let e=0;e<s.max;e++){let t=this.pts[Math.min(e,c-1)],n=this.pts[Math.min(e+1,c-1)],i=this.pts[Math.min(Math.max(e-1,0),c-1)],o=this.tmpA.copy(i.p).sub(n.p);o.lengthSq()<1e-6&&o.copy(r);let l=o.cross(this.tmpB.copy(a).sub(t.p)).normalize();e>0&&l.dot(this.prevSide)<0&&l.negate(),this.prevSide.copy(l);let u=Math.min(1,t.age/s.life),d=s.w0+(s.w1-s.w0)*u;this.pos.set([t.p.x+l.x*d,t.p.y+l.y*d,t.p.z+l.z*d],e*6),this.pos.set([t.p.x-l.x*d,t.p.y-l.y*d,t.p.z-l.z*d],e*6+3);let f=e<c?u:1;this.uv.set([f,1,f,-1],e*4)}this.geo.attributes.position.needsUpdate=!0,this.geo.attributes.aUv.needsUpdate=!0,this.mat.uniforms.uTime.value=t}}};function vv(e){return new fl({uniforms:{uColor:{value:new J(e)},uLevel:{value:0},uHot:{value:0}},vertexShader:`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,fragmentShader:`
      uniform vec3 uColor; uniform float uLevel; uniform float uHot; varying vec2 vUv;
      void main() {
        vec2 q = abs(vUv - 0.5) * 2.0;
        float box = max(q.x, q.y);
        float fill = 1.0 - smoothstep(0.55, 1.0, box);           // lit panel, dimmer toward the frame
        float centre = 1.0 - smoothstep(0.0, 0.7, length(q));    // brighter middle
        vec3 col = mix(uColor, vec3(1.0, 0.8, 1.0), 0.35 * centre) * (0.6 + 0.5 * centre);
        // boosting: the opening runs white-hot pale pink (rec_boost_50)
        col = mix(col, vec3(1.0, 0.86, 1.0) * (0.9 + 0.5 * centre), uHot * 0.85);
        float a = fill * uLevel;
        gl_FragColor = vec4(col * a, a);
      }`,transparent:!0,depthWrite:!1,blending:2,toneMapped:!1})}var yv=`
vec4 cdTri(sampler2D t, vec3 p, vec3 w, float tile) {
  return texture2D(t, p.yz / tile) * w.x + texture2D(t, p.xz / tile) * w.y + texture2D(t, p.xy / tile) * w.z;
}
vec3 cdWeights(vec3 n) { vec3 w = pow(abs(n), vec3(4.0)); return w / max(1e-4, w.x + w.y + w.z); }
// object-space perturbation from three projected tangent normals (projection axes as tangent frames)
vec3 cdNormal(sampler2D t, vec3 p, vec3 n, vec3 w, float tile) {
  vec3 nx = texture2D(t, p.yz / tile).xyz * 2.0 - 1.0;
  vec3 ny = texture2D(t, p.xz / tile).xyz * 2.0 - 1.0;
  vec3 nz = texture2D(t, p.xy / tile).xyz * 2.0 - 1.0;
  return vec3(0.0, nx.x, nx.y) * w.x + vec3(ny.x, 0.0, ny.y) * w.y + vec3(nz.x, nz.y, 0.0) * w.z;
}`;function bv(e,t){let n=kh(t.set),r=e.onBeforeCompile,i=(t.albedo??.8).toFixed(2),a=(t.normal??.5).toFixed(2),o=t.tile.toFixed(2);e.onBeforeCompile=(s,c)=>{r.call(e,s,c),s.uniforms.cdD={value:n.detail},s.uniforms.cdN={value:n.normal},s.uniforms.cdR={value:n.rough},s.vertexShader=s.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 cdPos;
varying vec3 cdNrm;
varying mat3 cdNM;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
cdPos = position;
cdNrm = normal;
cdNM = normalMatrix;`),s.fragmentShader=s.fragmentShader.replace(`#include <common>`,`#include <common>
        uniform sampler2D cdD, cdN, cdR;
        varying vec3 cdPos;
        varying vec3 cdNrm;
        varying mat3 cdNM;
        vec3 cdW;
        ${yv}`).replace(`#include <color_fragment>`,`#include <color_fragment>
        cdW = cdWeights(normalize(cdNrm));
        diffuseColor.rgb *= mix(1.0, cdTri(cdD, cdPos, cdW, ${o}).r * 2.0, ${i});
        ${t.rings?`{
          // lathe marks: fine concentric rings around the axle
          float r = length(cdPos.xz);
          float ring = 0.5 + 0.5 * sin(r * 9.0 + sin(r * 1.7) * 2.0);
          diffuseColor.rgb *= 0.9 + 0.2 * ring * cdW.y;
        }`:``}`).replace(`#include <roughnessmap_fragment>`,`#include <roughnessmap_fragment>
        ${t.rough?`roughnessFactor = mix(${t.rough[0].toFixed(2)}, ${t.rough[1].toFixed(2)}, cdTri(cdR, cdPos, cdW, ${o}).r);`:``}`).replace(`#include <normal_fragment_maps>`,`#include <normal_fragment_maps>
        {
          vec3 pn = cdNormal(cdN, cdPos, normalize(cdNrm), cdW, ${o});
          float fade = 1.0 - smoothstep(900.0, 3000.0, length(vViewPosition));
          normal = normalize(normal + normalize(cdNM * pn) * length(pn) * ${a} * fade);
        }`)};let s=e.customProgramCacheKey.bind(e);return e.customProgramCacheKey=()=>`${s()}|cd-${t.set}-${o}-${i}-${a}-${t.rough}-${t.rings}`,e}function xv(){return bv(new hl({color:2895411,roughness:.32,metalness:.25,clearcoat:.8,clearcoatRoughness:.08}),{set:`carbon`,tile:14,albedo:1,normal:.6,rough:[.22,.5]})}function Sv(e,t){let n=Cv(e),r=new ml({color:3801088,emissive:16716838,emissiveIntensity:2.2,roughness:.3}),i=bv(new ml({color:1182214,emissive:16734738,emissiveIntensity:0,roughness:.6,metalness:.5}),{set:`brushed`,tile:12,albedo:.5,normal:.4,rough:[.45,.7]});return{byName:{Paint:n,Carbon:xv(),TrimBlack:bv(new hl({color:394759,roughness:.32,metalness:.1,clearcoat:.5,clearcoatRoughness:.2}),{set:`powder`,tile:20,albedo:.4,normal:.25,rough:null}),CanopyFrame:bv(new ml({color:3817030,roughness:.35,metalness:.7}),{set:`powder`,tile:30,albedo:.5,normal:.35,rough:[.3,.5]}),Glass:new hl({color:263690,roughness:.02,metalness:.2,clearcoat:1,clearcoatRoughness:.01,envMapIntensity:1.3,transparent:!0,opacity:.9,depthWrite:!1}),Interior:bv(new ml({color:1710879,roughness:.85}),{set:`rubber`,tile:18,albedo:.8,normal:.4,rough:[.75,.95]}),Grille:bv(new ml({color:2895668,roughness:.38,metalness:.8}),{set:`powder`,tile:24,albedo:.5,normal:.4,rough:[.4,.65]}),Headlight:new ml({color:16777215,emissive:15660799,emissiveIntensity:4.5}),Taillight:r,Tire:bv(new ml({color:1710619,roughness:.92,metalness:0}),{set:`rubber`,tile:16,albedo:.9,normal:.55,rough:[.78,.97]}),Rim:bv(new hl({color:1447706,roughness:.34,metalness:.85,clearcoat:.4}),{set:`powder`,tile:20,albedo:.6,normal:.45,rough:[.28,.5]}),Metal:bv(new ml({color:13159634,roughness:.18,metalness:1}),{set:`brushed`,tile:16,albedo:.6,normal:.35,rough:[.12,.32]}),BrakeDisc:bv(new ml({color:6974835,roughness:.42,metalness:1}),{set:`swirl`,tile:10,albedo:.3,normal:.5,rough:[.3,.55],rings:!0}),Caliper:bv(new hl({color:t,roughness:.3,metalness:.2,clearcoat:.8}),{set:`powder`,tile:12,albedo:.3,normal:.3,rough:null}),NozzleInner:i,TireText:bv(new ml({color:3026480,roughness:.75,metalness:0}),{set:`rubber`,tile:16,albedo:.6,normal:.3,rough:null}),GrilleSlat:new hl({color:657932,roughness:.3,metalness:.3,clearcoat:.6,clearcoatRoughness:.2}),Plate:new ml({color:14277334,roughness:.55,metalness:0}),Indicator:new ml({color:3809280,emissive:16747024,emissiveIntensity:1.6,roughness:.3})},tail:r,nozzle:i}}function Cv(e){let t=new hl({color:e,metalness:.18,roughness:.46,clearcoat:.45,clearcoatRoughness:.16,envMapIntensity:.7});return t.onBeforeCompile=e=>Ev(e),t.customProgramCacheKey=()=>`flakepaint`,t}var wv=1841814;function Tv(e){return new hl({color:e,metalness:.8,roughness:.28,clearcoat:.5,clearcoatRoughness:.05,envMapIntensity:2,name:`RLPaint`})}function Ev(e){e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vFlakePos;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vFlakePos = position;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
      varying vec3 vFlakePos;
      #ifndef FLAKE_STRENGTH
      #define FLAKE_STRENGTH 0.05
      #endif
      vec3 flakeHash(vec3 p) {
        p = fract(p * vec3(443.897, 441.423, 437.195));
        p += dot(p, p.yxz + 19.19);
        return fract((p.xxy + p.yxx) * p.zyx) * 2.0 - 1.0;
      }`).replace(`#include <normal_fragment_maps>`,`#include <normal_fragment_maps>
      {
        vec3 cell = floor(vFlakePos * 9.0);
        vec3 jitter = flakeHash(cell);
        // flakes only resolve when a cell covers a couple of pixels; below that they'd alias into noise
        float fade = 1.0 - smoothstep(0.25, 0.6, length(fwidth(vFlakePos * 9.0)));
        normal = normalize(normal + jitter * FLAKE_STRENGTH * fade);
      }`)}var Dv={value:0};function Ov(e,t){let n=new hl({color:e,metalness:.18,roughness:.46,clearcoat:.45,clearcoatRoughness:.16,envMapIntensity:.7,normalMap:t.normal,normalScale:new W(1,1),aoMap:t.ao,aoMapIntensity:1.35});return n.onBeforeCompile=e=>{e.uniforms.idMap={value:t.id},e.uniforms.bodyDebug=Dv;let n=kh(`carbon`);e.uniforms.cfD={value:n.detail},e.uniforms.cfN={value:n.normal},e.uniforms.cfR={value:n.rough},Ev(e),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vObjPos;
varying vec3 vObjNrm;
varying mat3 vSkinNM;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vObjPos = position;
vObjNrm = normal;
vSkinNM = normalMatrix;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
        uniform sampler2D idMap;
        uniform float bodyDebug;
        varying vec3 vObjPos;
        varying vec3 vObjNrm;
        uniform sampler2D cfD, cfN, cfR;
        varying mat3 vSkinNM;
        vec3 bodyId;
        vec3 cfW;
        float weaveW;
        ${yv}`).replace(`#include <color_fragment>`,`#include <color_fragment>
        bodyId = texture2D(idMap, vNormalMapUv).rgb;
        // carbon zones: photographic twill (ambientCG Fabric004), same tile as the carbon parts
        cfW = cdWeights(normalize(vObjNrm));
        weaveW = cdTri(cfD, vObjPos, cfW, 14.0).r * 2.0;
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.026, 0.027, 0.031) * weaveW, bodyId.r);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.0024, 0.0027, 0.0033), bodyId.g);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.58, 0.60, 0.64), bodyId.b);`).replace(`#include <roughnessmap_fragment>`,`#include <roughnessmap_fragment>
        roughnessFactor = mix(roughnessFactor, mix(0.22, 0.5, cdTri(cfR, vObjPos, cfW, 14.0).r), bodyId.r);
        roughnessFactor = mix(roughnessFactor, 0.5, bodyId.g);
        roughnessFactor = mix(roughnessFactor, 0.18, bodyId.b);`).replace(`#include <metalnessmap_fragment>`,`#include <metalnessmap_fragment>
        metalnessFactor = mix(metalnessFactor, 0.25, bodyId.r);
        metalnessFactor = mix(metalnessFactor, 0.6, bodyId.g);
        metalnessFactor = mix(metalnessFactor, 1.0, bodyId.b);`).replace(`#include <normal_fragment_maps>`,`#include <normal_fragment_maps>
        {
          vec3 pn = cdNormal(cfN, vObjPos, normalize(vObjNrm), cfW, 14.0);
          float fade = 1.0 - smoothstep(900.0, 3000.0, length(vViewPosition));
          normal = normalize(normal + normalize(vSkinNM * pn) * length(pn) * 0.6 * fade * bodyId.r);
        }`).replace(`#define FLAKE_STRENGTH 0.05`,`#define FLAKE_STRENGTH (0.05 * (1.0 - clamp(bodyId.r + bodyId.g + bodyId.b, 0.0, 1.0)))`).replace(`#include <lights_physical_fragment>`,`#include <lights_physical_fragment>
        #ifdef USE_CLEARCOAT
        material.clearcoat *= 1.0 - bodyId.g;
        #endif`).replace(`#include <dithering_fragment>`,`#include <dithering_fragment>
        if (bodyDebug > 0.5) {
          vec3 dbg = bodyDebug < 1.5 ? bodyId + 0.15 : (bodyDebug < 2.5 ? texture2D(normalMap, vNormalMapUv).rgb : vec3(texture2D(aoMap, vAoMapUv).r));
          gl_FragColor = vec4(dbg, 1.0);
        }`)},n.customProgramCacheKey=()=>`bodyskin`,n}function kv(e,t,n,r){let i=Math.ceil((n[0]-t[0])/r)+1,a=Math.ceil((n[1]-t[1])/r)+1,o=Math.ceil((n[2]-t[2])/r)+1,s=new Float32Array(i*a*o),c=(e,t,n)=>e+i*(t+a*n);for(let n=0;n<o;n++)for(let o=0;o<a;o++)for(let a=0;a<i;a++)s[c(a,o,n)]=e(t[0]+a*r,t[1]+o*r,t[2]+n*r);let l=new Int32Array((i-1)*(a-1)*(o-1)).fill(-1),u=(e,t,n)=>e+(i-1)*(t+(a-1)*n),d=[],f=[[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,0,1],[1,0,1],[0,1,1],[1,1,1]],p=[[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]],m=new Float32Array(8);for(let e=0;e<o-1;e++)for(let n=0;n<a-1;n++)for(let a=0;a<i-1;a++){let i=0;for(let t=0;t<8;t++){let r=s[c(a+f[t][0],n+f[t][1],e+f[t][2])];m[t]=r,r<0&&(i|=1<<t)}if(i===0||i===255)continue;let o=0,h=0,g=0,_=0;for(let[e,t]of p){let n=m[e],r=m[t];if(n<0==r<0)continue;let i=n/(n-r),a=f[e],s=f[t];o+=a[0]+(s[0]-a[0])*i,h+=a[1]+(s[1]-a[1])*i,g+=a[2]+(s[2]-a[2])*i,_++}l[u(a,n,e)]=d.length/3,d.push(t[0]+(a+o/_)*r,t[1]+(n+h/_)*r,t[2]+(e+g/_)*r)}let h=[],g=(e,t,n,r,i)=>{e<0||t<0||n<0||r<0||(i?h.push(e,t,n,e,n,r):h.push(e,r,n,e,n,t))};for(let e=0;e<o;e++)for(let t=0;t<a;t++)for(let n=0;n<i;n++){let r=s[c(n,t,e)]<0;n<i-1&&t>0&&e>0&&t<a-1&&e<o-1&&r!==s[c(n+1,t,e)]<0&&g(l[u(n,t-1,e-1)],l[u(n,t,e-1)],l[u(n,t,e)],l[u(n,t-1,e)],r),t<a-1&&n>0&&e>0&&n<i-1&&e<o-1&&r!==s[c(n,t+1,e)]<0&&g(l[u(n-1,t,e-1)],l[u(n-1,t,e)],l[u(n,t,e)],l[u(n,t,e-1)],r),e<o-1&&n>0&&t>0&&n<i-1&&t<a-1&&r!==s[c(n,t,e+1)]<0&&g(l[u(n-1,t-1,e)],l[u(n,t-1,e)],l[u(n,t,e)],l[u(n-1,t,e)],r)}let _=new Float32Array(d),v=new Float32Array(d.length),y=r*.35;for(let t=0;t<_.length;t+=3){let n=_[t],r=_[t+1],i=_[t+2],a=e(n+y,r,i)-e(n-y,r,i),o=e(n,r+y,i)-e(n,r-y,i),s=e(n,r,i+y)-e(n,r,i-y),c=Math.hypot(a,o,s)||1;a/=c,o/=c,s/=c,v[t]=a,v[t+1]=o,v[t+2]=s}return{positions:_,normals:v,indices:new Uint32Array(h)}}var Av=(e,t,n)=>{let r=Math.max(n-Math.abs(e-t),0)/n;return Math.min(e,t)-r*r*n*.25},jv=(e,t,n)=>-Av(-e,-t,n);function Mv(e,t,n,r,i,a,o){let s=Math.abs(e)-r+o,c=Math.abs(t)-i+o,l=Math.abs(n)-a+o;return Math.hypot(Math.max(s,0),Math.max(c,0),Math.max(l,0))+Math.min(Math.max(s,c,l),0)-o}function Nv(e,t,n,r,i,a){let o=Math.hypot(e/r,t/i,n/a),s=Math.hypot(e/(r*r),t/(i*i),n/(a*a));return s===0?-Math.min(r,i,a):o*(o-1)/s}function Pv(e,t,n,r,i){let a=Math.hypot(e,n)-r,o=Math.abs(t)-i;return Math.min(Math.max(a,o),0)+Math.hypot(Math.max(a,0),Math.max(o,0))}var Fv=-17,Iv=[[-53.5,20.8,11],[-53.5,-20.8,11]],Lv=[[-57,12.4,9.4],[-57,-12.4,9.4]],Rv=e=>(Array.isArray(e)?e[0]:e).name;function zv(e,t,n){let r=Mv(e-12,t,n-3,60,31,10,7),i=(n-13+.17*Math.max(0,e-16))/1.014;return r=jv(r,i,7),r}function Bv(e,t,n){let r=Math.abs(t),i=Mv(e+10,t,n-20,28,23,12,8),a=(e-18)*.726+(n-12)*.688,o=(e+24)*-.648+(n-31)*.762,s=(r-23+(n-12)*.28)/1.04;return i=jv(i,a,4),i=jv(i,o,4),i=jv(i,s,4),i}function Vv(e,t,n){let r=Pv(e-x.frontWheel.x,t-40,n+4.5,16.5,21),i=Pv(e-x.backWheel.x,t-42,n+2,19,21);return Math.min(r,i)}function Hv(e,t,n){let r=Math.abs(t),i=Mv(e+43,t,n-32+(e+43)*.12,7,37,1.1,1),a=Mv(e+41,r-17,n-25,3,1.1,7.5,1),o=Mv(e+43,r-37,n-30,8,.9,4.5,.8);return Math.min(i,a,o)}function Uv(e,t,n){let r=Math.abs(t),i=zv(e,t,n);return i=Av(i,Bv(e,t,n),6),i=Av(i,Nv(e-50,r-30,n+1,25,9.5,13.5),5),i=Av(i,Nv(e+32,r-33,n-1,28,10.5,15.5),6),i=jv(i,-Nv(e+12,r-36.5,n-3,13,5,4),2.5),i=jv(i,-Mv(e-36,r-12,n-12.6,7,3,1.2,1),1.2),i=jv(i,-(n+8),2),i=jv(i,-(e+49),3),i=Av(i,Mv(e-70,t,n+7,7,33,1.4,1.2),2),i=jv(i,-Vv(e,r,n),2.5),i=Math.min(i,Hv(e,t,n)),i=Av(i,Wv(e+49,t,n-4,7.5,3.5),1.5),i=jv(i,-Wv(e+52,t,n-4,5.2,4),1),i}function Wv(e,t,n,r,i){let a=Math.hypot(t,n)-r,o=Math.abs(e)-i;return Math.min(Math.max(a,o),0)+Math.hypot(Math.max(a,0),Math.max(o,0))}function Gv(e,t,n,r,i){let a=Math.abs(t);return Hv(e,t,n)<.8||Vv(e,a,n)<1.2?`dark`:e<-46.5&&n>1.5&&n<8.5&&a>10&&a<29?`tail`:e<-45&&Math.hypot(t,n-4)<9||n<-4.6?`dark`:e>62&&i>.35&&n>-3&&n<5.5&&a>12&&a<27?`head`:e>64&&n<0&&a<18?`dark`:Bv(e,t,n)<1.2&&zv(e,t,n)>.6&&n>13.5&&n<29.8?a>15&&Math.abs(e+12)<2.2?`paint`:`glass`:Math.abs(e-36)<7.5&&Math.abs(a-12)<3.4&&r>.5?`dark`:r>.55&&a>3.5&&a<7.5&&e>-30?`accent`:`paint`}var Kv=null;function qv(){if(Kv)return Kv;let{positions:e,normals:t,indices:n}=kv(Uv,[-54,-46,-11],[80,46,36],.9),r=new Map;for(let i=0;i<n.length;i+=3){let a=n[i],o=n[i+1],s=n[i+2],c=Gv((e[a*3]+e[o*3]+e[s*3])/3,(e[a*3+1]+e[o*3+1]+e[s*3+1])/3,(e[a*3+2]+e[o*3+2]+e[s*3+2])/3,(t[a*3+2]+t[o*3+2]+t[s*3+2])/3,(t[a*3]+t[o*3]+t[s*3])/3),l=r.get(c);l||r.set(c,l=[]),l.push(a,o,s)}let i=[`paint`,`glass`,`dark`,`head`,`tail`,`accent`],a=[],o=new to;o.setAttribute(`position`,new Va(e,3)),o.setAttribute(`normal`,new Va(t,3));let s=[];for(let e of i){let t=r.get(e);if(t&&t.length!==0){o.addGroup(a.length,t.length,s.length),s.push(e);for(let e of t)a.push(e)}}return o.setIndex(a),Kv={body:o,groups:s},Kv}function Jv(e,t){let n=[],r=e*.68,i=t/2;n.push(new W(r,-i+1)),n.push(new W(e-3,-i));for(let t=0;t<=6;t++){let r=-Math.PI/2+t/6*(Math.PI/2);n.push(new W(e-3+Math.cos(r)*3,-i+3+Math.sin(r)*3))}for(let t=0;t<=6;t++){let r=t/6*(Math.PI/2);n.push(new W(e-3+Math.cos(r)*3,i-3+Math.sin(r)*3))}return n.push(new W(e-3,i)),n.push(new W(r,i-1)),new $c(n,40)}function Yv(e,t,n){let r=e*.68,i=[new W(.01,n*(t/2-1.5)),new W(r*.25,n*(t/2-1.2)),new W(r*.35,n*(t/2-2.5)),new W(r*.92,n*(t/2-3.5)),new W(r,n*(t/2-.8)),new W(r,-n*(t/2-1))];return n<0&&i.reverse(),new $c(i,32)}var Xv=class e{root=new Ji;body=new Ji;wheels=[];nozzle=new qi;nozzles=[this.nozzle];smallNozzles=[];exhaustGlowMat=vv(13650175);tipGlowMat=vv(13650175);paint;tailMat;static asset=null;constructor(t){let n=t===0?cg.blue:cg.orange;if(e.asset){this.paint=new hl,this.tailMat=new ml,this.buildFromAsset(e.asset,t);return}let r=t===0?new J(1727743):new J(16738834);this.paint=new hl({color:r,metalness:.45,roughness:.3,clearcoat:1,clearcoatRoughness:.04});let i=new hl({color:395276,metalness:.9,roughness:.06,clearcoat:1,clearcoatRoughness:.02}),a=new ml({color:1382171,roughness:.55,metalness:.35}),o=new ml({color:16777215,emissive:15398655,emissiveIntensity:4});this.tailMat=new ml({color:5570560,emissive:16716840,emissiveIntensity:2});let s=new hl({color:t===0?15922687:1776415,metalness:.2,roughness:.35,clearcoat:1,clearcoatRoughness:.05}),c={paint:this.paint,glass:i,dark:a,head:o,tail:this.tailMat,accent:s},l=qv(),u=new X(l.body,l.groups.map(e=>c[e]));u.castShadow=!0,u.receiveShadow=!0,this.body.add(u);let d=new X(new el(110,60),new _o({color:328966}));d.position.set(12,0,-7.8),d.rotation.x=Math.PI,this.body.add(d),this.nozzle.position.set(-54,0,4),this.body.add(this.nozzle),this.root.add(this.body);let f=new ml({color:1315860,roughness:.92,metalness:0}),p=new hl({color:14278116,roughness:.2,metalness:1,clearcoat:.5}),m=new ml({color:2764083,roughness:.3,metalness:.9}),h=new ml({color:n,emissive:n,emissiveIntensity:.6,roughness:.3,metalness:.5}),g=new ml({color:5593182,roughness:.4,metalness:.9}),_=x.frontWheel,v=x.backWheel,y=[{x:_.x,y:_.y,r:_.radius,w:13},{x:_.x,y:-_.y,r:_.radius,w:13},{x:v.x,y:v.y,r:v.radius,w:16},{x:v.x,y:-v.y,r:v.radius,w:16}];for(let e of y){let t=e.y>0?1:-1,n=new Ji;n.position.set(e.x,e.y,-5);let r=new Ji;r.add(new X(Jv(e.r,e.w),f)),r.add(new X(Yv(e.r,e.w,t),p));for(let n=0;n<6;n++){let i=new X(new js(e.r*.62,1.4,1.8),m);i.position.set(0,t*(e.w/2-2.2),0),i.rotation.y=n/6*Math.PI*2,i.translateX(e.r*.3),r.add(i)}let i=new X(new Ns(e.r*.14,e.r*.14,1.5,12),h);i.position.y=t*(e.w/2-1),r.add(i);let a=new X(new Ns(e.r*.5,e.r*.5,1,24),g);a.position.y=-t*1,r.add(a),r.traverse(e=>{e.isMesh&&(e.castShadow=!0,e.receiveShadow=!0)}),n.add(r),this.root.add(n),this.wheels.push({group:n,spinner:r,radius:e.r})}}mats=null;susp={roll:0,rollV:0,pitch:0,pitchV:0,heave:0,heaveV:0};prevVel=new G;accelLocal=new G;hasPrev=!1;wasOnGround=!0;airVz=0;buildFromAsset(e,t){let n=t===0?new J(2055935):new J(16737810),r=Sv(n,t===0?new J(3116031):new J(16747042));this.mats=r,this.tailMat=r.tail,e.body.some(e=>/^Fennec/.test(Rv(e.material)))&&(r.byName.Paint=Tv(t===0?new J(wv):n)),this.paint=r.byName.Paint;let i={FennecBody:`Paint`,FennecWindow:`Glass`,FennecHeadlights:`Headlight`},a=e=>{let t=Array.isArray(e)?e[0]:e;return r.byName[i[t.name]??t.name]??t},o=e.bodyMaps,s=o?Ov(n,o):r.byName.Paint;o&&(this.paint=s);let c=e=>{let t=Array.isArray(e)?e[0]:e;return t.name===`BodySkin`?s:a(t)};for(let t of e.body){let e=c(t.material),n=new X(t.geometry,e);n.castShadow=!/Glass|Interior|light|Bar/i.test(String(t.userData.node)),n.receiveShadow=!0,n.material.transparent&&(n.renderOrder=3),this.body.add(n)}if(e.body.some(e=>/^Fennec/.test(Rv(e.material)))){this.nozzles=Iv.map((e,t)=>{let n=t===0?this.nozzle:new qi;return n.position.set(e[0],e[1],e[2]),this.body.add(n),n}),this.smallNozzles=Lv.map(e=>{let t=new qi;return t.position.set(e[0],e[1],e[2]),this.body.add(t),t});let e=new el(8.2,7.4).rotateY(-Math.PI/2);for(let t of[20.8,-20.8]){let n=new X(e,this.exhaustGlowMat);n.position.set(-52.5,t,11),n.renderOrder=2,this.body.add(n)}let t=new el(5,2).rotateY(-Math.PI/2);for(let e of[17.4,-17.4]){let n=new X(t,this.tipGlowMat);n.position.set(-56.2,e,-8.1),n.renderOrder=2,this.body.add(n)}}else e.nozzles.length?this.nozzles=e.nozzles.map((e,t)=>{let n=t===0?this.nozzle:new qi;return n.position.copy(e),this.body.add(n),n}):(this.nozzle.position.set(-58.5,0,3.6),this.body.add(this.nozzle));this.root.add(this.body);let l=e.wheelPos,u=l?[l.F.y,-l.F.y,l.R.y,-l.R.y]:[28.2,-28.2,30.2,-30.2];[x.frontWheel,x.frontWheel,x.backWheel,x.backWheel].forEach((t,n)=>{let r=n<2?e.wheelF:e.wheelR,i=l?n<2?l.F:l.R:null,o=i?i.r:e.tireRadius,s=new Ji,c=Fv+o;s.position.set(i?i.x:t.x,u[n],c),u[n]<0&&(s.scale.y=-1);let d=new Ji;for(let e of r.spin){let t=new X(e.geometry,a(e.material));t.castShadow=!0,t.receiveShadow=!0,u[n]<0&&/TireText/.test(String(e.userData.node))&&(t.scale.x=-1),d.add(t)}s.add(d);for(let e of r.fixed){let t=new X(e.geometry,a(e.material));t.castShadow=!0,s.add(t)}this.root.add(s);let f=22-t.radius;this.wheels.push({group:s,spinner:d,radius:o,baseZ:c,restLen:f,spinScale:t.radius/o})})}setBoostHot(e){this.exhaustGlowMat.uniforms.uHot.value=e}setBoostGlow(e){this.mats&&(this.mats.nozzle.emissiveIntensity=e*6),this.exhaustGlowMat.uniforms.uLevel.value=Math.min(1,e),this.exhaustGlowMat.visible=e>.004,this.tipGlowMat.uniforms.uLevel.value=Math.min(1,e)*.5,this.tipGlowMat.visible=e>.004}updateSuspension(e,t,n,r){if(!this.mats||e<=0)return;let i=new G(t.x,t.y,t.z);this.hasPrev||=(this.prevVel.copy(i),!0);let a=i.clone().sub(this.prevVel).divideScalar(Math.max(e,.001));this.prevVel.copy(i);let o=n.clone().invert();a.applyQuaternion(o),this.accelLocal.lerp(a,1-Math.exp(-18*e));let s=this.susp,c=0,l=0;r&&(c=Zr.clamp(this.accelLocal.y*45e-6,-.075,.075),l=Zr.clamp(-this.accelLocal.x*26e-6,-.045,.045)),r||(this.airVz=i.z),r&&!this.wasOnGround&&(s.heaveV-=Zr.clamp(-this.airVz*.06,4,55)),this.wasOnGround=r;let u=(t,n,r,i,a)=>{let o=i*i*(r-t)-2*a*i*n;return n+=o*e,[t+n*e,n]};[s.roll,s.rollV]=u(s.roll,s.rollV,c,11,.55),[s.pitch,s.pitchV]=u(s.pitch,s.pitchV,l,11,.55),[s.heave,s.heaveV]=u(s.heave,s.heaveV,0,16,.45),s.heave=Zr.clamp(s.heave,-3.5,1.5),this.body.rotation.set(s.roll,s.pitch,0),this.body.position.set(0,0,s.heave)}setBraking(e){this.tailMat.emissiveIntensity=e?6:2}setWheel(e,t,n,r){let i=this.wheels[e];if(i.baseZ!==void 0){i.group.position.z=i.baseZ+(i.restLen-t),i.group.rotation.z=-n,i.spinner.rotation.y=r*i.spinScale;return}i.group.position.z=5-t,i.group.rotation.z=-n,i.spinner.rotation.y=r}},Zv=h;function Qv(){let e=(1+Math.sqrt(5))/2,t=[];for(let n of[-1,1])for(let r of[-1,1])t.push(new G(0,n,r*e),new G(n,r*e,0),new G(r*e,0,n));let n=[];for(let e of[-1,1])for(let t of[-1,1])for(let r of[-1,1])n.push(new G(e,t,r));let r=1/e;for(let t of[-1,1])for(let i of[-1,1])n.push(new G(0,t*r,i*e),new G(t*r,i*e,0),new G(i*e,0,t*r));return{pent:t.map(e=>e.normalize()),hex:n.map(e=>e.normalize())}}function $v(){let e=new tl(m,64,48),t=new hl({color:14212322,roughness:.38,metalness:.05,clearcoat:.35,clearcoatRoughness:.3}),{pent:n,hex:r}=Qv(),i={uPent:{value:n},uHex:{value:r},uGlow:{value:new J(16752704)},uGlowAmt:{value:.6},uLeaN:{value:kh(`leather`).normal},uLeaR:{value:kh(`leather`).rough}};t.onBeforeCompile=e=>{Object.assign(e.uniforms,i),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vObjN;
varying mat3 vBallNM;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vObjN = normalize(position);
vBallNM = normalMatrix;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
        varying vec3 vObjN;
        varying mat3 vBallNM;
        uniform vec3 uPent[12];
        uniform vec3 uHex[20];
        uniform vec3 uGlow;
        uniform float uGlowAmt;
        uniform sampler2D uLeaN, uLeaR;
        float gSeam; float gPent; float gRim;
        ${jh}
        void panelPattern() {
          vec3 n = normalize(vObjN);
          float best = -2.0, second = -2.0; float isPent = 0.0;
          for (int i = 0; i < 12; i++) {
            float d = dot(n, uPent[i]);
            if (d > best) { second = best; best = d; isPent = 1.0; } else if (d > second) { second = d; }
          }
          for (int i = 0; i < 20; i++) {
            float d = dot(n, uHex[i]);
            if (d > best) { second = best; best = d; isPent = 0.0; } else if (d > second) { second = d; }
          }
          float edge = best - second;
          float fw = fwidth(edge) + 1e-4;
          gSeam = 1.0 - smoothstep(0.010 - fw, 0.010 + fw, edge);
          gRim = (1.0 - smoothstep(0.030 - fw, 0.030 + fw, abs(edge - 0.038))) ;
          gPent = isPent;
        }`).replace(`#include <color_fragment>`,`#include <color_fragment>
        panelPattern();
        vec3 panelCol = mix(vec3(0.80, 0.81, 0.84), vec3(0.34, 0.36, 0.40), gPent);
        diffuseColor.rgb = mix(panelCol, vec3(0.06, 0.06, 0.07), gSeam);`).replace(`#include <roughnessmap_fragment>`,`#include <roughnessmap_fragment>
        // leather grain (CC0) on the panels, in object space so it rolls with the ball
        float lr = triplanar(uLeaR, normalize(vObjN) * ${m.toFixed(1)}, vObjN, 110.0).r;
        roughnessFactor = mix(0.28 + 0.3 * lr, 0.6, gSeam);`).replace(`#include <normal_fragment_maps>`,`#include <normal_fragment_maps>
        {
          vec3 on = normalize(vObjN);
          vec3 tn = triplanar(uLeaN, on * ${m.toFixed(1)}, on, 110.0).xyz * 2.0 - 1.0;
          vec3 t = normalize(cross(abs(on.z) < 0.9 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0), on));
          vec3 b = cross(on, t);
          vec3 pn = normalize(on + (tn.x * t + tn.y * b) * 0.8 * (1.0 - gSeam));
          vec3 pv = normalize(vBallNM * pn);
          float fade = 1.0 - smoothstep(600.0, 2500.0, length(vViewPosition));
          normal = normalize(mix(normal, pv, fade));
        }`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
        totalEmissiveRadiance += uGlow * (gRim * gPent * 0.0 + gSeam * gPent * 0.8) * uGlowAmt;`)};let a=new X(e,t);return a.castShadow=!0,a.receiveShadow=!1,{mesh:a,material:t}}var ey=1.45;function ty(e,t=`/assets/rlball/scene.gltf`){return new URLSearchParams(location.search).get(`ball`)===`soccar`?Promise.resolve(null):new Promise(n=>{new Sg().load(t,t=>{let r=t.scene;r.rotation.x=Math.PI+ey,r.updateMatrixWorld(!0);let i=[];r.traverse(e=>{e.isMesh&&i.push(e)}),i.sort((e,t)=>t.geometry.attributes.position.count-e.geometry.attributes.position.count);let a=i[0].geometry.clone().applyMatrix4(i[0].matrixWorld);a.computeBoundingBox();let o=a.boundingBox.getCenter(new G);a.translate(-o.x,-o.y,-o.z),a.computeBoundingSphere();let s=Zv/a.boundingSphere.radius,c=(e,t=!1)=>{t||e.translate(-o.x,-o.y,-o.z),e.scale(s,s,s);let n=e.index;if(n)for(let e=0;e<n.count;e+=3){let t=n.getX(e+1);n.setX(e+1,n.getX(e+2)),n.setX(e+2,t)}let r=e.attributes.normal;for(let e=0;e<r.count;e++)r.setXYZ(e,-r.getX(e),-r.getY(e),-r.getZ(e));return e};c(a,!0);let l=i[0].material;l.metalness=.2,l.roughness=.42,l.clearcoat=0,l.envMapIntensity=2.2,l.color.setScalar(1.6),l.side=0;let u={value:new J(1,1,1)};l.userData.glow=u;let d={value:new J(.3,.42,.26)};l.userData.groundTint=d,l.onBeforeCompile=e=>{e.uniforms.uBallGlow=u,e.uniforms.uGroundTint=d,e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
uniform vec3 uBallGlow;
uniform vec3 uGroundTint;
float gLight;`).replace(`#include <map_fragment>`,`#include <map_fragment>
              gLight = smoothstep(0.12, 0.3, min(diffuseColor.g, diffuseColor.b) - diffuseColor.r);
              diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.02), gLight);`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
              totalEmissiveRadiance += uBallGlow * gLight;`).replace(`#include <opaque_fragment>`,`{
              vec3 wN = normalize((vec4(normal, 0.0) * viewMatrix).xyz);
              vec3 occ = mix(uGroundTint, vec3(1.0), smoothstep(-0.7, 0.6, wN.z));
              outgoingLight = (outgoingLight - totalEmissiveRadiance) * occ + totalEmissiveRadiance;
            }
            #include <opaque_fragment>`)},l.customProgramCacheKey=()=>`rlball`,e.geometry.dispose(),e.material.dispose(),e.geometry=a,e.material=l;let f=new _o({color:16777215,toneMapped:!1});l.userData.insert=f;for(let t of i.slice(1))e.add(new X(c(t.geometry.clone().applyMatrix4(t.matrixWorld)),f));let p=new X(a,new _o({color:16777215,side:1,transparent:!0,opacity:0,depthWrite:!0,toneMapped:!1}));p.name=`ballOutline`,p.renderOrder=-1,p.castShadow=!1,e.add(p),n(l)},void 0,()=>n(null))})}var ny=new J(4,4.2,4.6),ry=new J(.6,2.4,8),iy=new J(8,3.4,.6),ay=new J(.16,.24,.14),oy=new J(.45,.6,.4);function sy(e,t){let n=e.userData.groundTint;n&&n.value.copy(ay).lerp(oy,Zr.smoothstep(t-Zv,0,900))}function cy(e,t,n=1){let r=e.userData.glow;if(!r)return;let i=Zr.smoothstep(Math.abs(t),150,900);r.value.copy(ny).lerp(t<0?ry:iy,i).multiplyScalar(n),e.userData.insert.color.copy(r.value).multiplyScalar(.6)}var ly=1.7,uy=1600,dy=3400,fy=new G;function py(e,t,n){let r=e.getObjectByName(`ballOutline`);if(!r)return;let i=t.getWorldPosition(fy).distanceTo(e.position),a=Zr.smoothstep(i,uy,dy);r.visible=a>.01,r.material.opacity=a;let o=i*2*Math.tan(Zr.degToRad(t.fov)/2)/n;r.scale.setScalar(1+n/1080*ly*o/Zv)}qi.DEFAULT_UP.set(0,0,1);var my={quality:`high`,bloom:!0,shadows:!0,renderScale:1,autoScale:!0},hy=class{renderer;scene=new ra;camera;composer;bloom;gtao;arena;stadium;particles=new fv(8e3);shockwave;ball;ballMat;ballIndicator;sun;cars=new Map;labelLayer;time=0;settings;flashLight;ballGlowTimer=0;showNameplates=!0;contact;skyEnv;skyDome;shadowFocus=new G;carEnv=null;constructor(e,t,n){this.settings=n,this.labelLayer=t,this.renderer=new cm({antialias:!1,powerPreference:`high-performance`}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)*n.renderScale),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.toneMapping=7,this.renderer.toneMappingExposure=1,this.renderer.outputColorSpace=sr,this.renderer.shadowMap.enabled=n.shadows,this.renderer.shadowMap.type=2,e.appendChild(this.renderer.domElement),this.camera=new mu(60,window.innerWidth/window.innerHeight,5,15e4),this.camera.up.set(0,0,1),this.skyEnv=sh(this.renderer,this.scene),this.scene.environmentIntensity=1,this.scene.fog=new na(13885420,2500,45e3),this.skyDome=new uh(this.scene.fog.color),this.scene.add(this.skyDome.mesh);let r=new nu(13624063,2767388,.35);this.scene.add(r),this.sun=new xu(16774114,2.8),this.sun.position.copy(oh).multiplyScalar(9e3),this.sun.target.position.set(0,0,0),this.sun.castShadow=n.shadows;let i=this.sun.shadow.camera;i.left=-3e3,i.right=3e3,i.top=3e3,i.bottom=-3e3,i.near=100,i.far=2e4,this.sun.shadow.mapSize.set(n.quality===`high`?4096:2048,n.quality===`high`?4096:2048),this.sun.shadow.bias=-4e-4,this.sun.shadow.normalBias=1.5,this.scene.add(this.sun,this.sun.target),this.flashLight=new vu(16777215,0,6e3,1.2),this.scene.add(this.flashLight),this.arena=yg(this.renderer),this.scene.add(this.arena.group),this.stadium=X_(),this.scene.add(this.stadium.group);let a=$v();this.ball=a.mesh,this.ballMat=a.material,this.scene.add(this.ball),this.ballIndicator=new Sh(this.scene),ty(this.ball).then(e=>{e&&(this.ballMat=e,this.carEnv&&(e.envMap=this.carEnv))}),this.scene.add(this.particles.points),this.shockwave=new mv(this.scene);let o=new W;this.renderer.getDrawingBufferSize(o);let s=new vi(o.x,o.y,{type:$t,samples:4});this.composer=new Rm(this.renderer,s),this.composer.addPass(new zm(this.scene,this.camera));let c=new URLSearchParams(location.search).get(`nancheck`),l=()=>new Fm(ih);c===`render`&&this.composer.addPass(l()),this.gtao=new $m(this.scene,this.camera,o.x,o.y),this.gtao.output=$m.OUTPUT.Default,this.gtao.blendIntensity=1,this.gtao.updateGtaoMaterial({radius:90,distanceExponent:1.4,thickness:25,scale:1,samples:16}),this.gtao.updatePdMaterial({lumaPhi:10,depthPhi:2,normalPhi:3,radius:6,rings:2,samples:16}),this.gtao.enabled=n.quality===`high`;{let e=this.gtao,t=e._overrideVisibility.bind(e);e._overrideVisibility=()=>{t(),this.scene.traverse(t=>{let n=t.material;t.visible&&n&&!Array.isArray(n)&&t.isMesh&&(!n.depthWrite&&(n.blending===2||n.transparent)||t.name===`ballOutline`)&&(t.visible=!1,e._visibilityCache.push(t))})}}if(this.composer.addPass(this.gtao),c===`gtao`&&this.composer.addPass(l()),!c){let e=l();e.uniforms.uDebug.value=0,this.composer.addPass(e)}this.bloom=new Vm(new W(o.x,o.y),.28,.6,1.35),this.bloom.enabled=n.bloom,this.composer.addPass(this.bloom),c===`bloom`&&this.composer.addPass(l()),this.composer.addPass(new Um),this.composer.addPass(new Fm(eh)),this.contact=new rh(this.scene),window.addEventListener(`resize`,()=>this.resize()),this.resize()}applySettings(e){this.settings=e,this.bloom.enabled=e.bloom,this.renderer.shadowMap.enabled=e.shadows,this.sun.castShadow=e.shadows,this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)*e.renderScale),this.resize(),this.scene.traverse(e=>{let t=e.material;t&&(t.needsUpdate=!0)})}resize(){let e=window.innerWidth,t=window.innerHeight;this.renderer.setSize(e,t),this.composer.setSize(e,t),this.composer.setPixelRatio(this.renderer.getPixelRatio()),this.camera.aspect=e/t,this.camera.updateProjectionMatrix()}lastAspect=16/9;get aspect(){let e=window.innerWidth,t=window.innerHeight;return e>0&&t>0&&(this.lastAspect=e/t),this.lastAspect}ensureCar(e,t,n){let r=this.cars.get(e);if(r)return r;let i=new Xv(t);if(!this.carEnv){let e=[this.skyDome.mesh,this.ball,this.particles.points,...[...this.cars.values()].map(e=>e.visual.root)];this.carEnv=ch(this.renderer,this.scene,void 0,e)}let a=this.carEnv;this.ballMat.isMeshStandardMaterial&&(this.ballMat.envMap=a),i.root.traverse(e=>{let t=e.material;t&&t.isMeshStandardMaterial&&(t.envMap=a)}),this.scene.add(i.root);let o=[],s=i.nozzles.map(()=>xy.map(e=>new _v(this.scene,e))),c=i.smallNozzles.map(()=>[new _v(this.scene,Sy)]),l=new J(4638975),u=new pv(22,l,4.5),d=new pv(22,l,4.5);this.scene.add(u.mesh,d.mesh);let f=document.createElement(`div`);return f.className=`nameplate ${t===0?`blue`:`orange`}`,f.textContent=n,this.labelLayer.appendChild(f),r={visual:i,flames:o,streaks:s,fires:c,hot:0,glow:0,trailL:u,trailR:d,label:f,lastBoostEmit:0},this.cars.set(e,r),r}removeAllCars(){for(let e of this.cars.values()){this.scene.remove(e.visual.root,e.trailL.mesh,e.trailR.mesh);for(let t of[...e.streaks.flat(),...e.fires.flat()])t.dispose(this.scene);e.label.remove()}this.cars.clear()}syncCar(e,t,n){let r=this.ensureCar(e.id,e.team,e.name);e.id===n&&this.shadowFocus.set(e.pos.x,e.pos.y,0);let i=r.visual;i.root.visible=!e.demoed,i.root.position.set(e.pos.x,e.pos.y,e.pos.z),i.root.quaternion.set(e.rot.x,e.rot.y,e.rot.z,e.rot.w),e.wheels.forEach((e,t)=>i.setWheel(t,e.len,e.steer,e.spin)),i.setBraking(e.braking),i.updateSuspension(t,e.vel,i.root.quaternion,e.onGround);let a=e.boosting&&!e.demoed,o=i.root.quaternion,s=1-2*(o.y*o.y+o.z*o.z),c=2*(o.x*o.y+o.w*o.z),l=2*(o.x*o.z-o.w*o.y),u=e.vel.x*s+e.vel.y*c+e.vel.z*l,d=Math.hypot(e.vel.x,e.vel.y,e.vel.z);if(e.demoed?r.glow=0:a?r.glow=1:u<-450?r.glow=Math.max(0,r.glow-t/.15):d<80?r.glow*=Math.exp(-t/1.3):r.glow*=Math.exp(-t/60),i.setBoostGlow(r.glow),!e.demoed&&e.pos.z<500){let t=Math.atan2(2*(e.rot.w*e.rot.z+e.rot.x*e.rot.y),1-2*(e.rot.y*e.rot.y+e.rot.z*e.rot.z));this.contact.set(`car${e.id}`,e.pos.x+Math.cos(t)*10,e.pos.y+Math.sin(t)*10,e.pos.z-17,138,.6,t,1)}else this.contact.hide(`car${e.id}`);r.hot+=(+!!a-r.hot)*(1-Math.exp(-(a?25:8)*t)),i.setBoostHot(r.hot),i.root.updateMatrixWorld();let f=new G(-1,0,0).applyQuaternion(i.root.quaternion),p=new G(e.vel.x,e.vel.y,e.vel.z),m=i.nozzles.map(e=>e.getWorldPosition(new G)),h=this.camera.position;if(r.streaks.forEach((e,n)=>e.forEach(e=>e.update(t,this.time,m[n],f,p,h,a))),r.fires.forEach((e,n)=>{let r=i.smallNozzles[n].getWorldPosition(new G);for(let n of e)n.update(t,this.time,r,f,p,h,a&&Math.random()<.7)}),a&&!r.wasBoosting)for(let e of m)for(let t=0;t<10;t++){let t=f.clone().multiplyScalar(60+Math.random()*140).add(p.clone().multiplyScalar(.3));t.x+=(Math.random()-.5)*260,t.y+=(Math.random()-.5)*260,t.z+=Math.random()*160,this.particles.spawn(e,t,.3+Math.random()*.25,16+Math.random()*12,40+Math.random()*20,Math.random()<.5?by:Cy,4,0)}if(a){r.lastBoostEmit+=t;let e=1/90,n=Math.floor(r.lastBoostEmit/e);r.lastBoostEmit-=n*e;let i=new G;for(let e=0;e<n;e++){let a=m[e%m.length],o=r.lastNozzle&&r.wasBoosting?a.clone().sub(p.clone().multiplyScalar(t)):a;i.copy(o).lerp(a,(e+Math.random())/Math.max(1,n));let s=f.clone().multiplyScalar(280+Math.random()*200).add(p.clone().multiplyScalar(.1));s.x+=(Math.random()-.5)*50,s.y+=(Math.random()-.5)*50,s.z+=(Math.random()-.5)*50+15;let c=Math.random(),l=c<.4?gy:c<.75?_y:vy;this.particles.spawn(i,s,.18+Math.random()*.2,3+Math.random()*4,1.5,l,2,40)}}r.wasBoosting=a,r.lastNozzle=(r.lastNozzle??new G).copy(m[0]);let g=new G(-46,28,-10).applyQuaternion(i.root.quaternion).add(i.root.position),_=new G(-46,-28,-10).applyQuaternion(i.root.quaternion).add(i.root.position),v=new G(0,0,1).applyQuaternion(i.root.quaternion);if(r.trailL.update(t,g,v,e.supersonic&&!e.demoed),r.trailR.update(t,_,v,e.supersonic&&!e.demoed),this.showNameplates&&e.id!==n&&!e.demoed){let t=new G(e.pos.x,e.pos.y,e.pos.z+110).project(this.camera),n=t.z<1&&t.z>-1;if(r.label.style.display=n?`block`:`none`,n){let e=(t.x*.5+.5)*window.innerWidth,n=(-t.y*.5+.5)*window.innerHeight;r.label.style.transform=`translate(${e}px, ${n}px) translate(-50%, -100%)`}}else r.label.style.display=`none`}syncBall(e,t,n){this.ball.position.set(e.x,e.y,e.z),cy(this.ballMat,e.y),sy(this.ballMat,e.z),this.ball.quaternion.copy(t),this.ball.visible=n,n?this.contact.set(`ball`,e.x,e.y,e.z-91.25,175,1,0,1):this.contact.hide(`ball`),this.ballIndicator.update(e,n)}ballHit(e,t){let n=Math.min(40,6+t/60);this.particles.burst(new G(e.x,e.y,e.z),n,200+t*.3,.45,28,wy,{drag:3,grav:-300}),this.ballGlowTimer=Math.min(1,t/2500)}goalExplosion(e,t){let n=t===0?cg.blue:cg.orange,r=new G(e.x,e.y,e.z);this.particles.burst(r,450,2600,1.8,90,n.clone().multiplyScalar(1.6),{drag:1.6,grav:-250}),this.particles.burst(r,200,1800,1.2,70,Ty,{drag:2.2,grav:-150}),this.particles.burst(r,120,900,2.5,160,n.clone().multiplyScalar(.8),{drag:1,grav:40}),this.shockwave.trigger(r,n),this.flashLight.position.copy(r),this.flashLight.color.copy(n),this.flashLight.intensity=60,this.arena.goalLights[+(t===0)].intensity=25}demoExplosion(e){let t=new G(e.x,e.y,e.z);this.particles.burst(t,160,900,1.2,70,Ey,{drag:2,grav:-200}),this.particles.burst(t,80,500,1.6,110,Dy,{drag:1.5,grav:80}),this.flashLight.position.copy(t),this.flashLight.color.setHex(16742960),this.flashLight.intensity=25}boostPickup(e,t){let n=new G(e.x,e.y,e.z+30);this.particles.burst(n,t?50:16,t?500:250,.6,t?40:24,yy,{drag:3,grav:300,up:200})}landingDust(e){this.particles.burst(new G(e.x,e.y,e.z-10),10,180,.5,40,Oy,{drag:3,grav:50})}update(e,t,n){this.time+=e;let r=Math.round(this.shadowFocus.x/32)*32,i=Math.round(this.shadowFocus.y/32)*32;this.sun.target.position.set(r,i,0),this.sun.position.copy(oh).multiplyScalar(9e3).add(this.sun.target.position),this.sun.target.updateMatrixWorld();let a=(window.innerHeight||720)*this.renderer.getPixelRatio();Number.isFinite(this.camera.fov)&&this.camera.fov>0&&this.particles.setViewportHeight(a,this.camera.fov),this.particles.update(e),this.shockwave.update(e,this.camera.position),this.arena.update(this.time,this.camera.position,t),this.stadium.update(this.time,n),this.skyDome.update(this.camera.position,this.time),this.flashLight.intensity*=Math.exp(-4*e),this.ballGlowTimer*=Math.exp(-3*e),this.ballMat.emissiveIntensity=1}lastW=-1;lastH=-1;render(){py(this.ball,this.camera,this.renderer.domElement.height);let e=window.innerWidth,t=window.innerHeight;e!==0&&t!==0&&((e!==this.lastW||t!==this.lastH)&&(this.lastW=e,this.lastH=t,this.resize()),this.composer.render())}},gy=new J(1,.96,1),_y=new J(1,.62,.95),vy=new J(.7,.4,1),yy=new J(1,.62,.2),by=new J(.32,.3,.34),xy=[{max:30,life:.26,w0:4.5,w1:15,speed:700,jitter:70,core:16777215,edge:12615935,gain:1.2},{max:26,life:.2,w0:3.8,w1:12,speed:850,jitter:150,core:16774399,edge:14717183,gain:1},{max:26,life:.16,w0:3,w1:10,speed:950,jitter:230,core:16777215,edge:10514687,gain:.85}],Sy={max:6,life:.06,w0:3.4,w1:5.5,speed:350,jitter:160,core:16774360,edge:16738848,gain:1.3},Cy=new J(.34,.2,.36),wy=new J(1,.9,.6),Ty=new J(1,1,1),Ey=new J(1,.5,.1),Dy=new J(.35,.18,.1),Oy=new J(.25,.3,.2),ky=`/audio/rl/`,Ay=class{ctx;manifest={};picks={};version=0;buffers=new Map;onChange;constructor(e){this.ctx=e}async load(){try{let e=await fetch(ky+`manifest.json`);if(!e.ok)return;this.manifest=await e.json()}catch{return}let e=this.ctx();e&&(await Promise.all(Object.entries(this.manifest).map(async([t,n])=>{let r=await Promise.all(n.items.map(async t=>{try{return await e.decodeAudioData(await(await fetch(ky+t.file)).arrayBuffer())}catch{return null}}));this.buffers.set(t,r.filter(e=>!!e))})),this.version++,this.onChange?.())}has(e){return e in this.manifest}source(e){return this.manifest[e]?.items.map(e=>e.source).join(`, `)??`none`}buffer(e){let t=this.buffers.get(e);return t&&t.length?t[Math.floor(Math.random()*t.length)]:null}async select(e,t){}},jy={master:.35,sfx:.6,crowd:.3,engine:.4},My=.45,Ny=[.8584,1,.7351,.0616,.1537,.1913,.0954,.2076,.1085,.0689,.0541,0,0,0,0,.0086,.0147,.008,.0033,.0138,0,0,.0156,.0076,0,.0093,.0045,.0018,0,.0043,.0038,.0094];function Py(e){let t=e.sampleRate,n=t*3,r=e.createBuffer(1,n,t),i=r.getChannelData(0);for(let e=0;e<n;e++)i[e]=(Math.random()*2-1)*.15;let a=(e,r,a)=>{let o=0;for(;;){o+=-Math.log(1-Math.random())/e;let s=Math.floor(o*t);if(s>=n)break;let c=r*(.4+Math.random()*1.2)*(Math.random()<.5?-1:1),l=Math.floor(t*a/1e3*(.5+Math.random()));for(let e=0;e<l*4&&s+e<n;e++)i[s+e]+=c*Math.exp(-e/l)*(Math.random()*2-1)}};a(300,.35,.6),a(13,.8,5);let o=0;for(let e=0;e<n;e++)o=Math.max(o,Math.abs(i[e]));let s=Math.floor(t*.02);for(let e=0;e<s;e++){let t=e/s;i[e]=i[e]*t+i[n-s+e]*(1-t)}for(let e=0;e<n;e++)i[e]/=o;return r}var Fy=class{ctx=null;master;sfx;engineBus;crowdGain;crowdFilter;noise;world;ui;crackle;paused=!1;engineWave;voices=new Map;crowdLevel=.3;settings;muted=!1;bank=new Ay(()=>this.ctx);crowdSample;toggleMute(){return this.muted=!this.muted,this.muted||this.init(),this.applySettings(this.settings),this.muted}constructor(e){this.settings=e;let t=()=>{this.init(),this.ctx?.resume()};window.addEventListener(`pointerdown`,t),window.addEventListener(`keydown`,t)}init(){if(this.ctx||this.muted)return;let e=new AudioContext;this.ctx=e,this.master=e.createGain(),this.master.connect(e.destination);let t=e.createDynamicsCompressor();t.threshold.value=-24,t.ratio.value=10,t.attack.value=.002,t.release.value=.2,t.connect(this.master),this.world=e.createGain(),this.world.connect(t),this.ui=e.createGain(),this.ui.connect(t),this.sfx=e.createGain(),this.sfx.connect(this.world),this.engineBus=e.createGain(),this.engineBus.connect(this.world),this.noise=e.createBuffer(1,e.sampleRate*2,e.sampleRate);let n=this.noise.getChannelData(0);for(let e=0;e<n.length;e++)n[e]=Math.random()*2-1;let r=e.createBufferSource();r.buffer=this.noise,r.loop=!0,this.crowdFilter=e.createBiquadFilter(),this.crowdFilter.type=`lowpass`,this.crowdFilter.frequency.value=600,this.crowdFilter.Q.value=.5,this.crowdGain=e.createGain(),this.crowdGain.gain.value=0,r.connect(this.crowdFilter).connect(this.crowdGain).connect(this.world),this.crackle=Py(e),r.start(),this.applySettings(this.settings),this.bank.load()}setPaused(e){if(e===this.paused||!this.ctx){this.paused=e;return}this.paused=e,this.world.gain.setTargetAtTime(+!e,this.ctx.currentTime,.04)}applySettings(e){this.settings=e,this.ctx&&(this.master.gain.value=this.muted?0:e.master*My,this.sfx.gain.value=e.sfx,this.engineBus.gain.value=e.engine)}setListener(e){let t=this.ctx;if(!t)return;let n=t.listener,r=e.position,i={x:0,y:0,z:-1},a=e.matrixWorld.elements;i.x=-a[8],i.y=-a[9],i.z=-a[10];let o={x:a[4],y:a[5],z:a[6]},s=t.currentTime;n.positionX?(n.positionX.setTargetAtTime(r.x,s,.02),n.positionY.setTargetAtTime(r.y,s,.02),n.positionZ.setTargetAtTime(r.z,s,.02),n.forwardX.setTargetAtTime(i.x,s,.02),n.forwardY.setTargetAtTime(i.y,s,.02),n.forwardZ.setTargetAtTime(i.z,s,.02),n.upX.setTargetAtTime(o.x,s,.02),n.upY.setTargetAtTime(o.y,s,.02),n.upZ.setTargetAtTime(o.z,s,.02)):n.setPosition(r.x,r.y,r.z)}makePanner(){let e=this.ctx.createPanner();return e.panningModel=`equalpower`,e.distanceModel=`inverse`,e.refDistance=600,e.maxDistance=2e4,e.rolloffFactor=1.1,e}voice(e){if(!this.ctx)return null;let t=this.voices.get(e);if(t)return t;let n=this.ctx,r=this.engineWave??=(()=>{let e=new Float32Array([0,...Ny]);return n.createPeriodicWave(new Float32Array(e.length),e)})(),i=n.createOscillator();i.setPeriodicWave(r);let a=n.createOscillator();a.setPeriodicWave(r);let o=n.createBiquadFilter();o.type=`lowpass`,o.frequency.value=3500,o.Q.value=.7;let s=n.createGain();s.gain.value=0;let c=this.makePanner(),l=n.createGain();l.gain.value=.45,i.connect(o),a.connect(l).connect(o),o.connect(s).connect(c).connect(this.engineBus);let u=n.createBufferSource();u.buffer=this.crackle,u.loop=!0;let d=n.createBiquadFilter();d.type=`highpass`,d.frequency.value=800,d.Q.value=.6;let f=d;for(let[e,t]of[[1180,4],[2080,5],[3540,5],[5680,4]]){let r=n.createBiquadFilter();r.type=`peaking`,r.frequency.value=e,r.Q.value=3.5,r.gain.value=t,f.connect(r),f=r}let p=n.createBiquadFilter();p.type=`lowpass`,p.frequency.value=7e3,f.connect(p);let m=n.createGain();m.gain.value=6,p.connect(m);let h=n.createBufferSource();h.buffer=this.noise,h.loop=!0;let g=n.createBiquadFilter();g.type=`lowpass`,g.frequency.value=75,g.Q.value=.7;let _=n.createBiquadFilter();_.type=`lowpass`,_.frequency.value=75,_.Q.value=.7;let v=n.createGain();v.gain.value=8;let y=n.createBiquadFilter();y.type=`bandpass`,y.frequency.value=85,y.Q.value=1.2;let b=n.createBiquadFilter();b.type=`lowpass`,b.frequency.value=140,b.Q.value=.7;let x=n.createGain();x.gain.value=7;let S=n.createBiquadFilter();S.type=`lowpass`,S.frequency.value=400,S.Q.value=.5;let C=n.createBiquadFilter();C.type=`highpass`,C.frequency.value=120,C.Q.value=.5;let w=n.createGain();w.gain.value=2.2,h.connect(g).connect(_).connect(v),h.connect(y).connect(b).connect(x),h.connect(S).connect(C).connect(w);let T=n.createGain();T.gain.value=1;let E=n.createOscillator();E.frequency.value=1.25;let D=n.createGain();D.gain.value=.35,E.connect(D).connect(T.gain),E.start(),v.connect(T),x.connect(T),w.connect(T),m.connect(T);let O=n.createGain();return O.gain.value=0,u.connect(d),h.start(0,Math.random()),T.connect(O).connect(c),i.start(),a.start(),u.start(),t={osc1:i,osc2:a,filter:o,gain:s,boostSrc:u,boostFilter:d,boostGain:O,panner:c,rpm:0,ver:-1,boostOn:!1,boostT:0},this.voices.set(e,t),t}updateCar(e,t,n,r,i,a,o,s){let c=this.voice(e);if(!c||!this.ctx)return;let l=this.ctx.currentTime,u=Math.abs(r),d=Math.min(1,n/1400)+.12*Math.max(0,Math.min(1,(n-1400)/900))+.1*u;c.rpm+=(d-c.rpm)*.1;let f=55+40*c.rpm;c.osc1.frequency.setTargetAtTime(f,l,.03),c.osc2.frequency.setTargetAtTime(f*1.006,l,.03),c.filter.frequency.setTargetAtTime(2400+1600*u+(a?0:400),l,.05);let p=s?(o?.05:.035)*(.6+.25*c.rpm+.3*u):0;i&&!c.boostOn?(c.boostT=0,s&&this.sample(`boostStart`,t,o?.5:.35,1,.02)):!i&&c.boostOn&&s&&this.sample(`boostEnd`,t,o?.35:.25,1,.02),c.boostOn=i,c.boostT+=1/60;let m=i&&!c.sBoost?1+.8*Math.exp(-c.boostT/.18):1,h=s&&i?(o?.09:.065)*m:0;this.syncLoops(c);let g=!this.bank.has(`engineLoop`);c.gain.gain.setTargetAtTime(c.sEng||!g?0:p,l,.05),c.boostGain.gain.setTargetAtTime(c.sBoost||!g?0:h,l,i?.04:.08),c.sEng&&(c.sEng.src.playbackRate.setTargetAtTime(f/95,l,.04),c.sEng.gain.gain.setTargetAtTime(p*5.5,l,.05)),c.sBoost&&c.sBoost.gain.gain.setTargetAtTime(h*5.5,l,i?.03:.06),c.panner.positionX.setTargetAtTime(t.x,l,.02),c.panner.positionY.setTargetAtTime(t.y,l,.02),c.panner.positionZ.setTargetAtTime(t.z,l,.02)}loopNode(e,t){let n=this.ctx,r=n.createBufferSource();r.buffer=e,r.loop=!0;let i=n.createGain();return i.gain.value=0,r.connect(i).connect(t),r.start(0,Math.random()*e.duration),{src:r,gain:i}}syncLoops(e){if(e.ver===this.bank.version)return;e.ver=this.bank.version;for(let t of[`sEng`,`sBoost`]){let n=e[t];n&&(n.src.stop(),n.gain.disconnect(),e[t]=void 0)}let t=this.bank.buffer(`engineLoop`),n=this.bank.buffer(`boostLoop`);t&&(e.sEng=this.loopNode(t,e.panner)),n&&(e.sBoost=this.loopNode(n,e.panner))}sample(e,t,n,r=1,i=.06,a=!1){let o=this.ctx,s=o?this.bank.buffer(e):null;if(!o||!s)return this.bank.has(e)||Object.keys(this.bank.manifest).length>0;let c=o.createBufferSource();c.buffer=s,c.playbackRate.value=r*(1+(Math.random()*2-1)*i);let l=o.createGain();return l.gain.value=n,c.connect(l),this.route(l,t,a),c.start(),!0}audition(e){switch(this.init(),this.ctx?.resume(),e){case`ballHit`:return this.ballHit(void 0,1600);case`ballBounce`:return this.ballBounce(void 0,1200);case`land`:return this.land(void 0);case`jump`:return this.jump(void 0);case`flip`:return this.flip(void 0);case`supersonic`:return this.supersonic(void 0);case`pickupSmall`:return this.boostPickup(void 0,!1);case`pickupBig`:return this.boostPickup(void 0,!0);case`goal`:return this.goal();case`uiMove`:return this.uiMove();case`uiSelect`:return this.uiSelect();default:return}}silenceCars(){if(!this.ctx)return;let e=this.ctx.currentTime;for(let t of this.voices.values())t.gain.gain.setTargetAtTime(0,e,.05),t.boostGain.gain.setTargetAtTime(0,e,.05),t.sEng?.gain.gain.setTargetAtTime(0,e,.05),t.sBoost?.gain.gain.setTargetAtTime(0,e,.05)}setCrowd(e){if(!this.ctx)return;this.crowdLevel+=(e-this.crowdLevel)*.03;let t=this.ctx.currentTime,n=(.02+this.crowdLevel*.08)*this.settings.crowd,r=this.bank.buffer(`crowdLoop`);this.crowdSample&&this.crowdSample.ver!==this.bank.version&&(this.crowdSample.src.stop(),this.crowdSample.gain.disconnect(),this.crowdSample=void 0),r&&!this.crowdSample&&(this.crowdSample={...this.loopNode(r,this.world),ver:this.bank.version}),this.crowdSample&&this.crowdSample.gain.gain.setTargetAtTime(n*6,t,.1),this.crowdGain.gain.setTargetAtTime(this.crowdSample||this.bank.has(`crowdLoop`)?0:n,t,.1),this.crowdFilter.frequency.setTargetAtTime(450+this.crowdLevel*500,t,.2)}noiseBurst(e){let t=this.ctx;if(!t)return;let n=t.currentTime,r=t.createBufferSource();r.buffer=this.noise,r.playbackRate.value=.8+Math.random()*.4;let i=t.createBiquadFilter();i.type=e.type??`bandpass`,i.frequency.setValueAtTime(e.freq,n),e.sweepTo&&i.frequency.exponentialRampToValueAtTime(e.sweepTo,n+e.dur),i.Q.value=e.q??1;let a=t.createGain();a.gain.setValueAtTime(1e-4,n),a.gain.exponentialRampToValueAtTime(e.vol,n+(e.attack??.005)),a.gain.exponentialRampToValueAtTime(1e-4,n+e.dur),r.connect(i).connect(a),this.route(a,e.at),r.start(n,Math.random()),r.stop(n+e.dur+.05)}tone(e){let t=this.ctx;if(!t)return;let n=t.currentTime+(e.delay??0),r=t.createOscillator();r.type=e.type??`sine`,r.frequency.setValueAtTime(e.freq,n),e.freqEnd&&r.frequency.exponentialRampToValueAtTime(e.freqEnd,n+e.dur);let i=t.createGain();i.gain.setValueAtTime(1e-4,n),i.gain.exponentialRampToValueAtTime(e.vol,n+.008),i.gain.exponentialRampToValueAtTime(1e-4,n+e.dur),r.connect(i),this.route(i,e.at,e.ui),r.start(n),r.stop(n+e.dur+.05)}route(e,t,n=!1){if(n){e.connect(this.ui);return}if(t){let n=this.makePanner();n.positionX.value=t.x,n.positionY.value=t.y,n.positionZ.value=t.z,e.connect(n).connect(this.sfx)}else e.connect(this.sfx)}ballHit(e,t){let n=Math.min(1,t/2500);this.sample(`ballHit`,e,.3+n*.7,1,.03)||(this.tone({at:e,freq:180+n*60,freqEnd:60,dur:.18+n*.1,vol:.125+n*.3,type:`sine`}),this.noiseBurst({at:e,dur:.08+n*.12,freq:1800+n*1500,q:.7,vol:.1+n*.3}),n>.6&&this.noiseBurst({at:e,dur:.35,freq:400,q:.5,vol:n*.4,type:`lowpass`}))}ballBounce(e,t){let n=Math.min(1,t/2e3);this.sample(`ballBounce`,e,.15+n*.5)||(this.tone({at:e,freq:120,freqEnd:50,dur:.15,vol:.06+n*.175}),this.noiseBurst({at:e,dur:.06,freq:900,vol:.025+n*.1}))}jump(e){this.sample(`jump`,e,.35)||this.noiseBurst({at:e,dur:.18,freq:500,sweepTo:1600,q:1.2,vol:.1})}flip(e){this.sample(`flip`,e,.45)||this.noiseBurst({at:e,dur:.3,freq:700,sweepTo:2500,q:1.5,vol:.125})}land(e){this.sample(`land`,e,.35)||(this.tone({at:e,freq:90,freqEnd:40,dur:.15,vol:.1}),this.noiseBurst({at:e,dur:.1,freq:300,type:`lowpass`,vol:.1}))}boostPickup(e,t){this.sample(t?`pickupBig`:`pickupSmall`,e,t?.6:.4)||(this.tone({at:e,freq:t?660:880,freqEnd:1320,dur:t?.25:.12,vol:t?.3:.15,type:`triangle`}),t&&this.tone({at:e,freq:990,freqEnd:1760,dur:.3,vol:.1,type:`sine`,delay:.06}))}bump(e){this.tone({at:e,freq:140,freqEnd:50,dur:.2,vol:.25,type:`square`}),this.noiseBurst({at:e,dur:.2,freq:600,vol:.2})}demo(e){this.noiseBurst({at:e,dur:1.2,freq:1200,sweepTo:120,type:`lowpass`,q:.8,vol:.45}),this.tone({at:e,freq:90,freqEnd:30,dur:.8,vol:.35,type:`sawtooth`})}goal(){if(this.sample(`goal`,void 0,.9,1,0)){this.crowdLevel=1.4;return}this.noiseBurst({dur:2.2,freq:1600,sweepTo:90,type:`lowpass`,q:.7,vol:.5}),this.tone({freq:70,freqEnd:28,dur:1.4,vol:.45,type:`sine`});for(let[e,t]of[[233,.15],[311,.15],[392,.15]])this.tone({freq:e,dur:1.6,vol:.06,type:`sawtooth`,delay:t});this.crowdLevel=1.4}countdown(e){e>0?this.tone({freq:660,dur:.18,vol:.15,type:`square`}):this.tone({freq:1320,dur:.45,vol:.175,type:`square`})}supersonic(e){this.sample(`supersonic`,e,.4)||this.noiseBurst({at:e,dur:.5,freq:2500,sweepTo:600,q:2,vol:.1})}uiMove(){this.sample(`uiMove`,void 0,.25,1,0,!0)||this.tone({freq:1200,dur:.05,vol:.04,type:`triangle`,ui:!0})}uiSelect(){this.sample(`uiSelect`,void 0,.35,1,0,!0)||this.tone({freq:900,freqEnd:1500,dur:.1,vol:.06,type:`triangle`,ui:!0})}whistle(){this.tone({freq:2200,dur:.6,vol:.1,type:`sine`}),this.tone({freq:2300,dur:.6,vol:.06,type:`sine`})}},Iy=`soccar.settings.v4`;function Ly(){return{camera:{...lm},input:{...jt,padBindings:{...At}},graphics:{...my},audio:{...jy},gameplay:{nameplates:!0,debugOverlay:!1,defaultBallCam:!0,playerName:`You`}}}function Ry(){let e=Ly();try{let t=localStorage.getItem(Iy);if(!t)return e;let n=JSON.parse(t);return{camera:{...e.camera,...n.camera},input:{...e.input,...n.input,padBindings:{...e.input.padBindings,...n.input?.padBindings}},graphics:{...e.graphics,...n.graphics},audio:{...e.audio,...n.audio},gameplay:{...e.gameplay,...n.gameplay}}}catch{return e}}function zy(e){try{localStorage.setItem(Iy,JSON.stringify(e))}catch{}}function By(){return new URLSearchParams(location.search).get(`car`)===`soccar`?`/assets/car2.glb`:`/assets/fennec.glb`}var Vy=null;function Hy(e){let t=e.getAttribute(`tangent`),n=e.getAttribute(`normal`);if(!t||!n)return;let r=new G,i=new G,a=new G;for(let e=0;e<t.count;e++){i.set(t.getX(e),t.getY(e),t.getZ(e));let o=t.getW(e);i.lengthSq()>1e-12&&Number.isFinite(i.x+i.y+i.z)&&Number.isFinite(o)&&o!==0||(r.set(n.getX(e),n.getY(e),n.getZ(e)).normalize(),a.set(+(Math.abs(r.x)<.9),Math.abs(r.x)<.9?0:1,0),i.crossVectors(a,r).normalize(),t.setXYZW(e,i.x,i.y,i.z,1))}t.needsUpdate=!0}function Uy(e=By()){return Vy||(Vy=new Promise(t=>{new Sg().load(e,n=>{let r=n.scene;r.rotation.x=Math.PI/2,r.updateMatrixWorld(!0);let i=[];r.traverse(e=>{e.isMesh&&i.push(e)});let a=i.map(e=>{let t=e.geometry.clone();t.applyMatrix4(e.matrixWorld),Hy(t);let n=new X(t,e.material);return n.name=(e.name||``).replace(/_\d+$/,``)||e.parent?.name||``,e.parent&&e.parent!==r&&!e.name&&(n.name=e.parent.name),n.userData.node=e.parent&&e.parent!==r?e.parent.name:e.name,n}),o=e=>String(e.userData.node||e.name),s=(e,t)=>o(e).startsWith(`Wheel${t}`),c=e=>{let t=a.filter(t=>s(t,e));return{spin:t.filter(e=>!/caliper/i.test(o(e))),fixed:t.filter(e=>/caliper/i.test(o(e)))}},l=a.filter(e=>!s(e,`F`)&&!s(e,`R`));if(l.length===0){t(null);return}let u=a.find(e=>/WheelF_Tire/.test(o(e))),d=17.5;if(u){u.geometry.computeBoundingBox();let e=new G;u.geometry.boundingBox.getSize(e),d=Math.max(e.x,e.z)/2}let f=l.filter(e=>/^Nozzle[LR]$/.test(o(e))).map(e=>{e.geometry.computeBoundingBox();let t=new G;return e.geometry.boundingBox.getCenter(t),t.x=e.geometry.boundingBox.min.x,t});if(/fennec/.test(e)){fetch(e.replace(/\.glb$/,`.json`)).then(e=>e.json()).then(e=>{let n=t=>({x:e[t].center[0],y:e[t].center[1],z:e[t].center[2],r:e[t].radius});t({body:l,wheelF:c(`F`),wheelR:c(`R`),tireRadius:e.F.radius,bodyMaps:null,nozzles:f,wheelPos:{F:n(`F`),R:n(`R`)}})}).catch(()=>t({body:l,wheelF:c(`F`),wheelR:c(`R`),tireRadius:d,bodyMaps:null,nozzles:f}));return}Gy().then(e=>t({body:l,wheelF:c(`F`),wheelR:c(`R`),tireRadius:d,bodyMaps:e,nozzles:f}))},void 0,e=>{console.warn(`car asset failed to load, using procedural car`,e),t(null)})}),Vy)}function Wy(e,t=!0){return new Promise(n=>{new eu().load(e,e=>{e.flipY=!1,e.colorSpace=``,e.anisotropy=8,e.generateMipmaps=t,e.minFilter=t?Gt:Ut,n(e)},void 0,()=>n(null))})}async function Gy(){let[e,t,n]=await Promise.all([Wy(`/assets/car/body_normal.webp`),Wy(`/assets/car/body_ao.webp`),Wy(`/assets/car/body_id.webp`)]);return!e||!t||!n?null:{normal:e,ao:t,id:n}}var Ky=180,qy=405,Jy=[180,220,265,315,360,405],Yy=[.9,.945,.985,1.005,1.075],Xy=[.1,.135,.165,.195,.27],Zy=[3.1,3.1,3.2,3.3,4.1],Qy=5,$y=`'Saira Semi Condensed', 'Bahnschrift', sans-serif`;function eb(){let e=[];for(let t=0;t<5;t++){let n=Jy[t],r=Jy[t+1],i=Math.round((r-n)/Qy),a=(r-n)/i;for(let r=0;r<i;r++){let i=n+a*(r+.5),o=Zy[t];e.push({a0:i-o/2,a1:i+o/2,seg:t,f0:(n+a*r-Ky)/225,f1:(n+a*(r+1)-Ky)/225})}}return e}var tb=eb(),nb=e=>(e-90)*Math.PI/180,rb=class{canvas;ctx;size=0;constructor(e){this.canvas=document.createElement(`canvas`),this.canvas.className=`boost-canvas`,e.appendChild(this.canvas),this.ctx=this.canvas.getContext(`2d`)}draw(e,t){let n=this.canvas.clientWidth,r=Math.max(1,Math.round(n*Math.min(2,window.devicePixelRatio||1)));r!==this.size&&(this.canvas.width=this.canvas.height=r,this.size=r);let i=this.ctx,a=r,o=a/3.2,s=a/2,c=a/2;i.setTransform(1,0,0,1,0,0),i.clearRect(0,0,a,a);let l=Math.floor(e+1e-6),u=Math.max(0,Math.min(1,e/100)),d=l>=81,f=i.createRadialGradient(s,c,0,s,c,o*1.42);f.addColorStop(0,`rgba(95, 95, 98, 0.55)`),f.addColorStop(.45,`rgba(45, 45, 48, 0.62)`),f.addColorStop(.72,`rgba(12, 12, 14, 0.62)`),f.addColorStop(1,`rgba(0, 0, 0, 0)`),i.fillStyle=f,i.beginPath(),i.arc(s,c,o*1.42,0,Math.PI*2),i.fill(),f=i.createRadialGradient(s,c,0,s,c,o*.95);let p=d?.5:.16;f.addColorStop(0,`rgba(255, 255, 255, ${p})`),f.addColorStop(.5,`rgba(255, 255, 255, ${p*.45})`),f.addColorStop(1,`rgba(255, 255, 255, 0)`),i.fillStyle=f,i.beginPath(),i.arc(s,c,o*.95,0,Math.PI*2),i.fill(),i.lineCap=`butt`,i.strokeStyle=`rgba(150, 150, 155, 0.75)`,i.lineWidth=o*.018,i.beginPath(),i.arc(s,c,o,nb(Ky),nb(qy)),i.stroke(),Jy.forEach((e,t)=>{let n=e===360||e===405,r=t===0,a=o*(n?1.42:r?1.22:1.13),l=nb(e);i.beginPath(),i.moveTo(s+Math.cos(l)*o,c+Math.sin(l)*o),i.lineTo(s+Math.cos(l)*a,c+Math.sin(l)*a),i.stroke(),!r&&e!==405&&(i.beginPath(),i.arc(s+Math.cos(l)*o,c+Math.sin(l)*o,o*.022,0,Math.PI*2),i.fillStyle=`rgba(160,160,165,0.8)`,i.fill())});for(let e of tb){let t=u<=e.f0?0:u>=e.f1?1:(u-e.f0)/(e.f1-e.f0);if(t<=0)continue;let n=o*(Yy[e.seg]+.035),r=n+o*Xy[e.seg],a=(e.f0+e.f1)/2/.8,l,d;e.seg===4?(l=`255, 255, 255`,d=`rgba(255, 255, 255, 0.7)`):(l=`255, ${Math.round(118+92*a)}, ${Math.round(8+40*a)}`,d=`rgba(255, ${Math.round(120+60*a)}, 20, 0.85)`),i.shadowColor=d,i.shadowBlur=o*.09,i.fillStyle=`rgba(${l}, ${t})`,i.beginPath(),i.arc(s,c,r,nb(e.a0),nb(e.a1)),i.arc(s,c,n,nb(e.a1),nb(e.a0),!0),i.closePath(),i.fill()}if(i.shadowBlur=0,u>0){let e=Ky+225*u;i.strokeStyle=`rgba(255, 255, 255, 0.95)`,i.lineWidth=o*.02,i.shadowColor=`rgba(255,255,255,0.5)`,i.shadowBlur=o*.04;for(let t=0;t<5;t++){let n=Jy[t],r=Math.min(Jy[t+1],e);if(r<=n)break;let a=o*Yy[t];if(i.beginPath(),i.arc(s,c,a,nb(n),nb(r)),i.stroke(),e>Jy[t+1]&&t<4){let e=nb(Jy[t+1]),n=o*Yy[t+1];i.beginPath(),i.moveTo(s+Math.cos(e)*a,c+Math.sin(e)*a),i.lineTo(s+Math.cos(e)*n,c+Math.sin(e)*n),i.stroke()}}i.shadowBlur=0}let m=String(l);i.font=`300 ${o*.66}px 'Saira', ${$y}`,i.fontStretch=`expanded`,i.letterSpacing=`${-o*.035}px`,i.textAlign=`left`,i.textBaseline=`alphabetic`;let h=i.measureText(m),g=h.actualBoundingBoxRight+h.actualBoundingBoxLeft,_=h.actualBoundingBoxAscent+h.actualBoundingBoxDescent,v=Math.min(1.55,o*1.5/Math.max(1,g)),y=c+(d?-o*.1:0),b=(e,t,n,r,a)=>{i.save(),i.translate(s+e,y+t),i.scale(v,1);let o=-g/2+h.actualBoundingBoxLeft,c=_/2-h.actualBoundingBoxDescent;i.lineWidth=a/v,r&&(i.fillStyle=r,i.fillText(m,o,c)),i.strokeStyle=n,i.strokeText(m,o,c),i.restore()};if(i.lineJoin=`round`,b(o*.06,o*.04,`rgba(165, 165, 170, 0.8)`,`rgba(120, 120, 124, 0.4)`,o*.034),i.shadowColor=`rgba(255,255,255,0.55)`,i.shadowBlur=o*(d?.12:.05),b(0,0,`#ffffff`,null,o*.036),i.shadowBlur=0,i.textAlign=`center`,i.textBaseline=`middle`,d){let e=Math.sin(t*2.5*Math.PI*2);i.globalAlpha=Math.max(0,Math.min(1,.5+e*3)),i.fontStretch=`normal`,i.letterSpacing=`0px`,i.font=`400 ${o*.23}px ${$y}`,i.fillStyle=`rgba(215, 215, 220, 1)`,i.fillText(`BOOST`,s,c+o*.42),i.globalAlpha=1}}},ib=`kbm`,ab=new Set;function ob(e){return/054c|dualshock|dualsense|wireless controller|playstation|ps4|ps5/i.test(e)?`ps`:`xbox`}function sb(e){if(e!==ib){ib=e,document.documentElement.dataset.promptDevice=e;for(let e of ab)e()}}function cb(){return ib}function lb(e){return ab.add(e),()=>ab.delete(e)}var ub={confirm:[`cross`,`✕`],back:[`circle`,`○`],x:[`square`,`□`],y:[`triangle`,`△`],start:[`opt`,`OPTIONS`],select:[`opt`,`SHARE`]},db={confirm:[`a`,`A`],back:[`b`,`B`],x:[`x`,`X`],y:[`y`,`Y`],start:[`opt`,`MENU`],select:[`opt`,`VIEW`]};function fb(e,t){if(ib===`kbm`)return`<span class="pg pg-key">${t}</span>`;let[n,r]=(ib===`ps`?ub:db)[e];return n===`opt`?`<span class="pg pg-key">${r}</span>`:ib===`ps`?`<span class="pg pg-ps pg-${n}"><svg viewBox="0 0 20 20"><circle class="ring" cx="10" cy="10" r="8.6"/>${{cross:`<path d="M6.5 6.5 L13.5 13.5 M13.5 6.5 L6.5 13.5"/>`,circle:`<circle cx="10" cy="10" r="4"/>`,square:`<rect x="6.3" y="6.3" width="7.4" height="7.4"/>`,triangle:`<path d="M10 5.8 L14.2 13 H5.8 Z"/>`}[n]}</svg></span>`:`<span class="pg pg-xb pg-${n}">${r}</span>`}function pb(e,t){e.dataset.t!==t&&(e.dataset.t=t,e.textContent=t)}function mb(e,t,n,r){let i=document.createElement(e);return i.className=t,r!==void 0&&(i.textContent=r),n?.appendChild(i),i}var hb=class{root;blueScore;orangeScore;clock;clockWrap;boostMeter;boostWrap;center;banner;bannerSub;feed;ballCamTag;ballCamPrompt;ballCamPad=null;replayTag;scoreboard;top;debug;tip;bannerTimer=0;centerTimer=0;constructor(e){this.root=mb(`div`,`hud`,e),this.top=mb(`div`,`hud-top`,this.root);let t=mb(`div`,`hud-team blue`,this.top);this.blueScore=mb(`div`,`hud-score`,t,`0`),this.clockWrap=mb(`div`,`hud-clock`,this.top),this.clock=mb(`div`,`hud-clock-text`,this.clockWrap,`5:00`);let n=mb(`div`,`hud-team orange`,this.top);this.orangeScore=mb(`div`,`hud-score`,n,`0`),this.boostWrap=mb(`div`,`hud-boost`,this.root),this.boostMeter=new rb(this.boostWrap),this.center=mb(`div`,`hud-center`,this.root);let r=mb(`div`,`hud-banner-wrap`,this.root);this.banner=mb(`div`,`hud-banner`,r),this.bannerSub=mb(`div`,`hud-banner-sub`,r),this.feed=mb(`div`,`hud-feed`,this.root),this.ballCamTag=mb(`div`,`hud-ballcam`,this.root);let i=mb(`div`,`bc-title`,this.ballCamTag);mb(`span`,`bc-dot`,i),mb(`span`,`bc-text`,i,`BALL CAM`),this.ballCamPrompt=mb(`div`,`bc-prompt`,this.ballCamTag),this.replayTag=mb(`div`,`hud-replay`,this.root),mb(`div`,`replay-title`,this.replayTag,`REPLAY`);let a=mb(`div`,`replay-skip`,this.replayTag),o=()=>{a.innerHTML=`PRESS ${fb(`confirm`,`SPACE`)} TO SKIP`};o(),lb(o),this.scoreboard=mb(`div`,`hud-scoreboard`,this.root),this.debug=mb(`div`,`hud-debug`,this.root),this.tip=mb(`div`,`hud-tip`,this.root)}setVisible(e){this.root.style.display=e?`block`:`none`}setMatchUi(e){this.top.style.display=e?`flex`:`none`}setScore(e,t){pb(this.blueScore,String(e)),pb(this.orangeScore,String(t))}setClock(e,t){let n=Math.max(0,t?Math.floor(e):Math.ceil(e)),r=`${t?`+`:``}${Math.floor(n/60)}:${String(n%60).padStart(2,`0`)}`;pb(this.clock,r),this.clockWrap.classList.toggle(`overtime`,t)}setBoost(e,t=!0){this.boostWrap.style.display=t?`block`:`none`,t&&this.boostMeter.draw(e,performance.now()/1e3)}countdown(e){this.center.textContent=e>0?String(e):`GO!`,this.center.className=`hud-center show`+(e>0?``:` go`),this.center.offsetWidth,this.center.classList.add(`pop`),this.centerTimer=e>0?1.1:.9}showBanner(e,t=``,n=`white`,r=2.5){this.banner.textContent=e,this.bannerSub.textContent=t,this.banner.className=`hud-banner show ${n}`,this.bannerSub.className=`hud-banner-sub show`,this.bannerTimer=r}notify(e,t=`white`){let n=mb(`div`,`feed-item ${t}`,this.feed,e);for(setTimeout(()=>n.classList.add(`out`),3200),setTimeout(()=>n.remove(),3800);this.feed.children.length>5;)this.feed.firstChild?.remove()}setBallCam(e,t=!1){if(this.ballCamTag.classList.toggle(`on`,e),this.ballCamPad===null){this.ballCamPad=!0;let e=()=>{this.ballCamPrompt.innerHTML=`PRESS ${fb(`y`,`C`)} TO TOGGLE`};e(),lb(e)}}setReplay(e){this.replayTag.style.display=e?`block`:`none`,this.boostWrap.style.opacity=e?`0`:`1`}setTip(e){this.tipFn=typeof e==`function`?e:null,this.tip.innerHTML=typeof e==`function`?e():e,this.tip.style.display=e?`block`:`none`,this.tipHooked||(this.tipHooked=!0,lb(()=>{this.tipFn&&(this.tip.innerHTML=this.tipFn())}))}tipFn=null;tipHooked=!1;setDebug(e){this.debug.style.display=e?`block`:`none`,e&&(this.debug.textContent=e)}showScoreboard(e,t=[]){if(this.scoreboard.style.display=e?`block`:`none`,!e)return;let n=e=>t.filter(t=>t.team===e).sort((e,t)=>t.score-e.score).map(t=>`<tr class="${e===0?`blue`:`orange`}${t.isPlayer?` me`:``}"><td class="nm">${gb(t.name)}</td><td>${t.score}</td><td>${t.goals}</td><td>${t.assists}</td><td>${t.saves}</td><td>${t.shots}</td></tr>`).join(``);this.scoreboard.innerHTML=`<table><tr><th></th><th>SCORE</th><th>GOALS</th><th>ASSISTS</th><th>SAVES</th><th>SHOTS</th></tr>${n(0)}<tr class="sep"><td colspan="6"></td></tr>${n(1)}</table>`}update(e){this.bannerTimer>0&&(this.bannerTimer-=e,this.bannerTimer<=0&&(this.banner.classList.remove(`show`),this.bannerSub.classList.remove(`show`))),this.centerTimer>0&&(this.centerTimer-=e,this.centerTimer<=0&&(this.center.className=`hud-center`))}};function gb(e){return e.replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}var _b=class{root;stack=[];index=0;listEl;itemEls=[];onNavigate;onSelect;capturing=null;constructor(e){this.root=document.createElement(`div`),this.root.className=`menu-root ui-layer`,e.appendChild(this.root),lb(()=>{this.open&&this.render(!0)})}get open(){return this.stack.length>0}push(e){this.stack.push(e),this.index=bb(e.items,0),this.render()}replace(e){this.stack.pop(),this.push(e)}pop(){let e=this.stack.pop();return this.stack.length?(this.index=bb(this.top.items,0),this.render()):this.root.innerHTML=``,e}closeAll(){this.stack=[],this.root.innerHTML=``,this.root.classList.remove(`visible`)}refresh(){this.open&&this.render(!0)}get top(){return this.stack[this.stack.length-1]}render(e=!1){let t=this.top,n=e&&this.listEl?this.listEl.scrollTop:0;this.root.innerHTML=``,this.root.classList.add(`visible`);let r=document.createElement(`div`),i=t.items.filter(e=>e.type===`slider`||e.type===`toggle`||e.type===`select`||e.type===`bind`).length;r.className=`menu-panel ${t.className??``}${i>=3?` settings`:``}`,this.root.dataset.screen=t.className??`panel`;let a=document.createElement(`div`);if(a.className=`menu-title`,a.textContent=t.title,r.appendChild(a),t.subtitle){let e=document.createElement(`div`);e.className=`menu-subtitle`,e.textContent=t.subtitle,r.appendChild(e)}this.listEl=document.createElement(`div`),this.listEl.className=`menu-list`,this.itemEls=[],t.items.forEach((e,t)=>{let n=document.createElement(`div`);if(n.className=`menu-item ${e.type}`,e.type===`header`||e.type===`text`)n.textContent=e.label;else{let r=document.createElement(`span`);if(r.className=`mi-label`,r.textContent=e.label,e.type===`button`){let t=document.createElement(`span`);if(t.className=`mi-glyph`,t.innerHTML=fb(`confirm`,`ENTER`),n.appendChild(t),e.hint){let t=document.createElement(`span`);t.className=`mi-sub`,t.textContent=e.hint,r.appendChild(t)}}n.appendChild(r);let i=document.createElement(`span`);i.className=`mi-value`,n.appendChild(i),this.fillValue(e,i),n.addEventListener(`mouseenter`,()=>{this.index=t,this.highlight()}),n.addEventListener(`click`,r=>{this.index=t;let i=n.getBoundingClientRect();if(e.type===`slider`||e.type===`select`){let e=r.clientX>i.left+i.width/2;this.adjust(e?1:-1)}else this.activate()}),e.type===`button`&&e.hint&&(n.title=e.hint)}this.listEl.appendChild(n),this.itemEls.push(n)}),r.appendChild(this.listEl);let o=document.createElement(`div`);o.className=`menu-footer`;let s=t.footer;o.innerHTML=typeof s==`function`?s():s??vb(),r.appendChild(o),this.root.appendChild(r),this.highlight(),e&&(this.listEl.scrollTop=n)}fillValue(e,t){switch(e.type){case`slider`:{let n=e.get(),r=(n-e.min)/(e.max-e.min)*100;t.innerHTML=`<span class="sl-track"><span class="sl-fill" style="width:${r}%"></span><span class="sl-knob" style="left:${r}%"></span></span><span class="sl-num">${e.fmt?e.fmt(n):n.toFixed(2)}</span>`;break}case`toggle`:t.innerHTML=`<span class="checkbox${e.get()?` on`:``}"></span>`;break;case`select`:{let n=e.options.find(t=>t.value===e.get());t.innerHTML=`<span class="dropdown"><span>${n?n.label:e.get()}</span><span class="dd-arrow"></span></span>`;break}case`bind`:t.textContent=e.get()}}highlight(){this.itemEls.forEach((e,t)=>e.classList.toggle(`focus`,t===this.index)),this.itemEls[this.index]?.scrollIntoView({block:`nearest`})}move(e){let t=this.top.items,n=this.index;for(let r=0;r<t.length&&(n=(n+e+t.length)%t.length,!yb(t[n]));r++);n!==this.index&&(this.index=n,this.highlight(),this.onNavigate?.())}adjust(e){let t=this.top.items[this.index];if(!t)return;if(t.type===`slider`){let n=Math.min(t.max,Math.max(t.min,Math.round((t.get()+e*t.step)/t.step)*t.step));t.set(Number(n.toFixed(4)))}else if(t.type===`select`){let n=t.options.findIndex(e=>e.value===t.get()),r=t.options[(n+e+t.options.length)%t.options.length];t.set(r.value)}else if(t.type===`toggle`)t.set(!t.get());else return;this.onNavigate?.();let n=this.itemEls[this.index]?.querySelector(`.mi-value`);n&&this.fillValue(t,n)}activate(){let e=this.top.items[this.index];e&&(this.onSelect?.(),e.type===`button`?e.action():e.type===`toggle`||e.type===`select`?this.adjust(1):e.type===`bind`&&e.rebind())}handleInput(e,t){if(this.open){if(this.capturing){if(t!==null){let e=this.capturing;this.capturing=null,e(t)}else if(e.nav.back&&!e.usingGamepad){let e=this.capturing;this.capturing=null,e(null)}return}if(e.nav.up&&this.move(-1),e.nav.down&&this.move(1),e.nav.left&&this.adjust(-1),e.nav.right&&this.adjust(1),e.nav.confirm&&this.activate(),e.nav.back){let e=this.top;e.onBack?e.onBack():this.stack.length>1&&this.pop()}}}};function vb(){return`${fb(`back`,`ESC`)} BACK`}function yb(e){return e.type!==`header`&&e.type!==`text`}function bb(e,t){for(let n=t;n<e.length;n++)if(yb(e[n]))return n;return 0}var xb=new e,Sb=new e,Cb=new e,wb=new e,Tb=new e,Eb=new e,Db=class{pos=new e(0,0,h);vel=new e;angVel=new e;radius=m;mass=30;get inertia(){return .4*this.mass*this.radius*this.radius}lastWorldHitSpeed=0;frozen=!1;reset(e=0,t=0,n=h){this.pos.set(e,t,n),this.vel.set(0,0,0),this.angVel.set(0,0,0),this.frozen=!1}copyFrom(e){this.pos.copy(e.pos),this.vel.copy(e.vel),this.angVel.copy(e.angVel)}integrateForces(e){this.frozen||(this.vel.z+=s*e,this.vel.scale(1-_*e))}integratePosition(e){this.frozen||this.pos.addScaled(this.vel,e)}collideWorld(){if(this.lastWorldHitSpeed=0,this.frozen)return 0;let e=h,t=0;for(let n=0;n<3;n++){let n=et(this.pos.x,this.pos.y,this.pos.z);if(n>=e)break;let r=nt(this.pos,xb),i=this.vel.dot(r);i<0&&(t=Math.max(t,-i),this.bounce(r,i)),this.pos.addScaled(r,e-n)}return this.lastWorldHitSpeed=t,t}bounce(e,t){let n=this.radius,r=this.mass;wb.copy(e).scale(-n),Sb.copy(e).scale(t),Tb.crossVectors(wb,this.angVel),Cb.copy(this.vel).sub(Sb).sub(Tb);let i=Math.max(Cb.length(),1e-4),a=Sb.length()/i,o=-t<20?0:v,s=1/(1/r+n*n/this.inertia),c=-(1+o)*r,l=Math.min(1,2*a);Eb.copy(Cb).scale(-l*s),Tb.crossVectors(wb,Eb).scale(1/this.inertia),this.angVel.add(Tb),this.vel.addScaled(Sb,c/r),this.vel.addScaled(Eb,1/r)}clampVelocities(){this.vel.clampLength(g),this.angVel.clampLength(6)}},Ob=new e,kb=new e,Ab=new e,jb=new e,Mb=new e,Nb=new e,Pb=new e,Fb=new e,Ib=new e,Lb=new e;function Rb(t,n,r){if(t.isDemoed||n.frozen)return null;let i=n.radius;t.hitboxCenter(Ob),Ib.subVectors(n.pos,Ob),t.mat.mulTVec(Ib,kb);let a=lt.x,o=lt.y,s=lt.z,c=Math.max(-a,Math.min(a,kb.x)),l=Math.max(-o,Math.min(o,kb.y)),u=Math.max(-s,Math.min(s,kb.z)),d=kb.x-c,f=kb.y-l,p=kb.z-u,m=d*d+f*f+p*p;if(m>=i*i)return null;let h;if(m>1e-8){let e=Math.sqrt(m);d/=e,f/=e,p/=e,h=i-e}else{let e=a-Math.abs(kb.x),t=o-Math.abs(kb.y),n=s-Math.abs(kb.z);d=f=p=0,e<t&&e<n?(d=Math.sign(kb.x)||1,h=i+e):t<n?(f=Math.sign(kb.y)||1,h=i+t):(p=Math.sign(kb.z)||1,h=i+n)}t.mat.mulVec(Ab.set(d,f,p),Ab),t.mat.mulVec(Ib.set(c,l,u),jb).add(Ob);let g=null;if(r>t.lastExtraBallHitTick+1||t.lastExtraBallHitTick>r){t.lastExtraBallHitTick=r;let i=new e().subVectors(n.pos,t.pos),a=new e().subVectors(n.vel,t.vel),o=Math.min(a.length(),_e);if(o>0){let n=new e(i.x,i.y,i.z*he).normalize(),r=t.forward,a=r.clone().scale(n.dot(r)*(1-ge));n.sub(a).normalize(),g=n.scale(o*ve.get(o))}}let _=1/n.mass,v=_/(_+1/t.mass);n.pos.addScaled(Ab,h*v),t.pos.addScaled(Ab,-h*(1-v)),Mb.subVectors(jb,n.pos),Nb.subVectors(jb,t.pos),Pb.crossVectors(n.angVel,Mb).add(n.vel),t.pointVelocity(jb,Fb);let y=Pb.sub(Fb),b=y.dot(Ab),x=0;if(b<0){x=-b;let e=n.inertia,r=_+Ib.crossVectors(Mb,Ab).lengthSq()/e+t.effectiveMassInv(Nb,Ab),i=-1*b/r;Lb.copy(Ab).scale(i);let a=y.clone().addScaled(Ab,-b),o=a.length();if(o>1e-6){a.scale(1/o);let n=_+Ib.crossVectors(Mb,a).lengthSq()/e+t.effectiveMassInv(Nb,a),r=Math.min(o/n,2*i);Lb.addScaled(a,-r)}n.vel.addScaled(Lb,_),Ib.crossVectors(Mb,Lb).scale(1/e),n.angVel.add(Ib),t.applyImpulse(Lb.scale(-1),jb)}return g&&n.vel.add(g),t.lastBallTouchTick=r,{car:t,impulse:x+(g?g.length():0),point:jb.clone()}}function zb(t){return{c:t.hitboxCenter(new e),a:[t.forward.clone(),t.left.clone(),t.up.clone()],h:[lt.x,lt.y,lt.z]}}function Bb(t,n){let r=new e().subVectors(n.c,t.c),i=1/0,a=new e,o=[...t.a,...n.a];for(let r of t.a)for(let t of n.a){let n=new e().crossVectors(r,t);n.lengthSq()>1e-6&&o.push(n.normalize())}for(let e of o){let o=t.h[0]*Math.abs(t.a[0].dot(e))+t.h[1]*Math.abs(t.a[1].dot(e))+t.h[2]*Math.abs(t.a[2].dot(e)),s=n.h[0]*Math.abs(n.a[0].dot(e))+n.h[1]*Math.abs(n.a[1].dot(e))+n.h[2]*Math.abs(n.a[2].dot(e)),c=r.dot(e),l=o+s-Math.abs(c);if(l<0)return null;l<i&&(i=l,a.copy(e).scale(c>=0?1:-1))}return{n:a,depth:i}}function Vb(t,n,r){let i=new e().subVectors(n,t.c);r.copy(t.c);for(let e=0;e<3;e++){let n=Math.max(-t.h[e],Math.min(t.h[e],i.dot(t.a[e])));r.addScaled(t.a[e],n)}return r}function Hb(t,n,r){if(t.isDemoed||n.isDemoed||t.frozen||n.frozen||t.pos.distanceTo(n.pos)>250)return;let i=zb(t),a=zb(n),o=Bb(i,a);if(!o)return;let s=o.n,c=Vb(i,a.c,new e),l=Vb(a,i.c,new e),u=c.clone().add(l).scale(.5),d=(t,n,i)=>{if(t.bumpCooldowns.has(n.id))return;let a=new e().subVectors(n.pos,t.pos);if(t.vel.dot(a)<=0)return;let o=t.vel.clone().normalize(),s=a.clone().normalize(),c=t.vel.dot(s);if(!(c<=n.vel.dot(o))&&i.x>64.5){if(t.isSupersonic&&t.team!==n.team)n.demolish(),r.push({type:`demo`,attacker:t,victim:n});else{let i=n.isOnGround,a=(i?be:L).get(c),s=i?n.up.clone():new e(0,0,1),l=o.scale(a).addScaled(s,xe.get(c));n.velImpulseCache.add(l),r.push({type:`bump`,attacker:t,victim:n})}t.bumpCooldowns.set(n.id,ye)}},f=t.mat.mulTVec(new e().subVectors(c,t.pos),new e),p=n.mat.mulTVec(new e().subVectors(l,n.pos),new e);if(d(t,n,f),!n.isDemoed&&!t.isDemoed&&d(n,t,p),t.isDemoed||n.isDemoed)return;t.pos.addScaled(s,-o.depth/2),n.pos.addScaled(s,o.depth/2);let m=new e().subVectors(u,t.pos),h=new e().subVectors(u,n.pos),g=t.pointVelocity(u,new e),_=n.pointVelocity(u,new e).sub(g),v=_.dot(s);if(v>=0)return;let y=t.effectiveMassInv(m,s)+n.effectiveMassInv(h,s),b=-(1+me)*v/y,x=s.clone().scale(b),S=_.clone().addScaled(s,-v),C=S.length();if(C>1e-6){S.scale(1/C);let e=t.effectiveMassInv(m,S)+n.effectiveMassInv(h,S);x.addScaled(S,-Math.min(C/e,pe*b))}n.applyImpulse(x,u),t.applyImpulse(x.scale(-1),u)}var Ub=class{ball=new Db;cars=[];pads=Se.map((t,n)=>({index:n,pos:new e(t.x,t.y,t.big?73:70),big:t.big,cooldown:0}));tick=0;events=[];goalsEnabled=!0;goalScoredThisTick=null;lastTouch=null;ballTouchedSinceKickoff=!1;carCarEvents=[];respawnRoll=0;addCar(e,t){let n=new Et(this.cars.length,e);return n.name=t,this.cars.push(n),n}resetPads(){for(let e of this.pads)e.cooldown=0}setupKickoff(e=Math.random()){this.ball.reset(),this.ballTouchedSinceKickoff=!1,this.lastTouch=null;let t=this.cars.filter(e=>e.team===0),n=this.cars.filter(e=>e.team===1),r=Wb(Math.max(t.length,n.length),e);t.forEach((e,t)=>{let n=Ce[r[t]];e.spawn(n.x,n.y,n.yaw)}),n.forEach((e,t)=>{let n=Ce[r[t]];e.spawn(-n.x,-n.y,n.yaw+Math.PI)}),this.resetPads()}step(){let e=o,t=this.ball;this.events.length=0,this.goalScoredThisTick=null;for(let n of this.cars)n.preStep(e,t,this.tick);t.integrateForces(e);let n=we.collideFirst===1;n&&this.collideCarsBall(t);for(let t of this.cars)t.integratePosition(e);t.integratePosition(e);let r=t.collideWorld();r>150&&this.events.push({type:`ballBounce`,speed:r,pos:t.pos.clone()});for(let e of this.cars)e.collideWorld();n||this.collideCarsBall(t),this.carCarEvents.length=0;for(let e=0;e<this.cars.length;e++)for(let t=e+1;t<this.cars.length;t++)Hb(this.cars[e],this.cars[t],this.carCarEvents);for(let e of this.carCarEvents)this.events.push({type:e.type,attacker:e.attacker,victim:e.victim});t.clampVelocities();for(let t of this.cars)t.postStep(e),t.events.jumped&&this.events.push({type:`jump`,car:t}),t.events.flipped&&this.events.push({type:`flip`,car:t}),t.events.landed&&this.events.push({type:`land`,car:t});if(this.updatePads(e),this.updateRespawns(),this.goalsEnabled&&!t.frozen){let e=p+t.radius;if(t.pos.y>e||t.pos.y<-e){let e=t.pos.y>0?0:1;this.goalScoredThisTick=e,this.events.push({type:`goal`,team:e,ballPos:t.pos.clone(),ballSpeed:t.vel.length(),lastTouch:this.lastTouch})}}this.tick++}collideCarsBall(e){for(let t of this.cars){let n=Rb(t,e,this.tick);n&&(this.lastTouch=t,this.ballTouchedSinceKickoff=!0,n.impulse>60&&this.events.push({type:`ballHit`,car:t,strength:n.impulse,point:n.point}))}}updatePads(e){for(let t of this.pads){if(t.cooldown>0){t.cooldown=Math.max(0,t.cooldown-e);continue}let n=t.big?208:144;for(let e of this.cars){if(e.isDemoed||e.boost>=100)continue;let r=e.pos.x-t.pos.x,i=e.pos.y-t.pos.y;if(r*r+i*i<n*n&&Math.abs(e.pos.z-t.pos.z)<168){e.boost=Math.min(100,e.boost+(t.big?100:12)),t.cooldown=t.big?10:4,this.events.push({type:`boostPickup`,car:e,pad:t});break}}}}updateRespawns(){for(let e of this.cars)if(e.isDemoed&&e.demoRespawnTimer<=0){let t=R,n=t[this.respawnRoll++%t.length];e.team===0?e.spawn(n.x,n.y,n.yaw):e.spawn(-n.x,-n.y,n.yaw+Math.PI),e.pos.z=36,this.events.push({type:`respawn`,car:e})}}};function Wb(e,t){let n=[0,1,2,3,4],r=Math.floor(t*2147483647)||1,i=()=>(r=r*16807%2147483647,r/2147483647);for(let e=n.length-1;e>0;e--){let t=Math.floor(i()*(e+1));[n[e],n[t]]=[n[t],n[e]]}return n.slice(0,e)}var Gb={rookie:{speed:.72,boost:!1,flip:!1,aerial:!1,reaction:.35,predict:1.5,aim:.5},pro:{speed:.9,boost:!0,flip:!0,aerial:!1,reaction:.16,predict:3,aim:.8},allstar:{speed:1,boost:!0,flip:!0,aerial:!0,reaction:.06,predict:4,aim:1}},Kb=class{slices=[];sim=new Db;lastTick=-100;update(e,t=4){if(e.tick-this.lastTick<4)return;this.lastTick=e.tick;let n=this.sim;n.copyFrom(e.ball),n.frozen=e.ball.frozen,this.slices.length=0;let r=Math.round(t/o);for(let e=1;e<=r;e++)n.integrateForces(o),n.integratePosition(o),n.collideWorld(),n.clampVelocities(),e%2==0&&this.slices.push({t:e*o,pos:n.pos.clone(),vel:n.vel.clone()})}},qb=class{car;skill;m={kind:`none`};out=at();reactionTimer=0;target=new e;kickoffFlipDone=!1;role=`attack`;constructor(e,t){this.car=e,this.skill=t}get s(){return Gb[this.skill]}reset(){this.m={kind:`none`},this.kickoffFlipDone=!1}tick(t,n,i){let a=this.car,o=at();if(a.isDemoed||a.frozen)return this.out=o,o;let s=t.ball,c=a.team===0?1:-1,u=new e(0,-c*l,0),d=new e(0,c*(l+400),150);if(this.m.kind===`flip`)return this.runFlip(i);if(this.m.kind===`aerial`){let e=this.runAerial(i,n);if(e)return e}if(!a.isOnGround&&a.numWheelsInContact===0)return this.recover(o),o.throttle=1,this.out=o,o;if(a.worldContact.has&&a.up.z<-.5)return o.jump=!this.out.jump,this.out=o,o;let f=!t.ballTouchedSinceKickoff&&s.vel.lengthSq()<1&&Math.abs(s.pos.x)<1&&Math.abs(s.pos.y)<1,p=!1,h=2300;if(f){this.target.set(0,-c*60,0),p=this.s.boost||a.boost>0;let e=a.pos.distanceTo(s.pos);if(this.s.flip&&!this.kickoffFlipDone&&e<520+a.vel.length()*.18&&a.vel.length()>1e3)return this.kickoffFlipDone=!0,this.startFlip(-1,0)}else{this.kickoffFlipDone=!1;let l=n.slices.filter(e=>e.t<=this.s.predict),f=null;for(let t of l){if(t.pos.z>300&&!(this.s.aerial&&t.pos.z<1500))continue;let n=new e().subVectors(d,t.pos);n.z=0,n.normalize();let r=t.pos.clone().addScaled(n,-(m+50));if(this.estimateTime(r,t.pos.z)<=t.t){f=t;break}}if(f||=l[l.length-1]??{t:0,pos:s.pos.clone(),vel:s.vel.clone()},this.role===`support`){let e=r(s.pos.y-c*2600,-4600,4600);if(this.target.set(r(s.pos.x*.4,-2500,2500),e,0),h=1200,a.boost<40){let e=Xb(t,a.pos,!0);e&&e.pos.distanceTo(a.pos)<2500&&this.target.copy(e.pos)}}else{let t=new e().subVectors(d,f.pos);t.z=0,t.normalize();let l=(a.pos.y-f.pos.y)*c>200,g=s.vel.y*-c>500&&Math.abs(s.pos.y-u.y)<5e3;if(l&&(g||Math.abs(f.pos.y-u.y)<3e3)){let t=new e(Math.sign(f.pos.x||1)*700,u.y+c*200,0);if((a.pos.y-u.y)*c>800)this.target.copy(t),p=this.s.boost&&g;else{let t=new e(Math.sign(f.pos.x||1),c*.6,0).normalize();this.target.copy(f.pos).addScaled(t,-(m+60)),p=this.s.boost}}else{let e=r(a.pos.distanceTo(f.pos)*.35,m+40,700)*this.s.aim+(m+40)*(1-this.s.aim);this.target.copy(f.pos).addScaled(t,-e);let n=f.t,i=a.pos.distanceTo(this.target);h=n>.05?i/n:2300,p=this.s.boost&&h>1300}if(this.s.aerial&&f.pos.z>350&&f.pos.z<1600&&a.boost>30&&a.isOnGround&&a.up.z>.9){let t=new e().subVectors(f.pos,a.pos),r=Math.hypot(t.x,t.y),s=(t.x*a.forward.x+t.y*a.forward.y)/Math.max(r,1),l=Yb(r,f.pos.z-a.pos.z);if(s>.9&&Math.abs(l-f.t)<.25&&(f.pos.y-a.pos.y)*c>0)return this.m={kind:`aerial`,t:0,target:f.pos.clone(),tArrive:f.t},this.runAerial(i,n)??o}let _=a.pos.distanceTo(s.pos);if(this.s.flip&&_<330&&s.pos.z<180&&a.vel.length()>700){let t=new e().subVectors(s.pos,a.pos),n=t.dot(a.forward),r=t.dot(a.left),i=Math.atan2(r,n);if(Math.abs(i)<.5)return this.startFlip(-Math.cos(i),-Math.sin(i)*1.2)}}}return this.driveTo(o,this.target,p,h*this.s.speed+(1-this.s.speed)*0),this.applyReaction(o,i),this.out}estimateTime(t,n){let r=this.car,i=Math.hypot(t.x-r.pos.x,t.y-r.pos.y),a=new e().subVectors(t,r.pos),o=a.dot(r.forward),s=a.dot(r.left),c=Math.abs(Math.atan2(s,o)),l=Math.max(0,r.forwardSpeed),u=(this.s.boost&&r.boost>10?2e3:1350)*this.s.speed,d=Math.max(0,(u-l)/1400),f=l+(u-l)*Math.min(1,.5*d);return i/Math.max(400,f)+c*.45+Math.max(0,n-150)*.004}driveTo(t,n,i,a){let o=this.car,s=new e().subVectors(n,o.pos),c=s.dot(o.forward),l=s.dot(o.left);s.dot(o.up);let u=Math.atan2(l,c),d=Math.hypot(c,l),f=o.angVel.dot(o.up);t.steer=r(-u*3.2+f*.18,-1,1);let p=o.forwardSpeed,m=r(a,300,2300);Math.abs(u)>2.2&&d<700&&p<400?(t.throttle=-1,t.steer=-t.steer):t.throttle=p<m?1:p>m+300?-.3:.1,t.handbrake=Math.abs(u)>1.6&&p>700&&o.isOnGround,t.boost=i&&Math.abs(u)<.3&&p<m+100&&p<2280&&o.isOnGround&&o.up.z>.6}applyReaction(e,t){this.reactionTimer-=t,this.reactionTimer<=0||this.skill===`allstar`?(this.out=e,this.reactionTimer=this.s.reaction):(this.out.steer+=(e.steer-this.out.steer)*.35,this.out.throttle=e.throttle,this.out.jump=e.jump)}recover(t){let n=this.car,r=n.vel.clone();r.z=0,Jb(n,r.lengthSq()>100?r.normalize():new e(n.forward.x,n.forward.y,0).normalize(),new e(0,0,1),t)}startFlip(e,t){return this.m={kind:`flip`,t:0,pitch:e,yaw:t},this.runFlip(0)}runFlip(e){let t=this.m;t.t+=e;let n=at();return n.throttle=1,t.t<.07?n.jump=!0:t.t<.1?n.jump=!1:t.t<.2?(n.jump=!0,n.pitch=r(t.pitch,-1,1),n.yaw=r(t.yaw,-1,1)):t.t<1.1&&!this.car.isOnGround?n.pitch=0:this.m={kind:`none`},this.out=n,n}runAerial(t,n){let r=this.m,i=this.car;r.t+=t;let a=at(),o=r.tArrive-r.t,c=n.slices.find(e=>e.t>=o)??n.slices[n.slices.length-1];if(c&&r.target.copy(c.pos),r.t>3||o<-.3||r.t>.3&&i.isOnGround||i.boost<=0)return this.m={kind:`none`},null;r.t<.2?a.jump=!0:r.t<.23?a.jump=!1:r.t<.27&&(a.jump=!0);let l=Math.max(.05,o),u=new e().subVectors(r.target,i.pos).addScaled(i.vel,-l);u.z-=.5*s*l*l;let d=u.clone().normalize(),f=2*u.length()/(l*l);return Jb(i,d,new e(0,0,1),a),a.boost=i.forward.dot(d)>.7&&f>300,a.throttle=1,this.out=a,a}};function Jb(t,n,i,a){let o=t.mat.mulTVec(n,new e),s=t.mat.mulTVec(i,new e),c=t.mat.mulTVec(t.angVel,new e),l=Math.atan2(o.z,Math.hypot(o.x,o.y)*Math.sign(o.x||1)),u=Math.atan2(-o.y,o.x),d=Math.atan2(-s.y,s.z),f=-c.y,p=-c.z,m=c.x;a.pitch=r(l*3.2-f*.55,-1,1),a.yaw=r(u*3.2-p*.6,-1,1),a.roll=r(d*2.2-m*.35,-1,1),Math.abs(u)>1.2&&(a.roll*=.3)}function Yb(e,t){return .35+Math.hypot(e,t)/1150}function Xb(e,t,n){let r=null,i=1/0;for(let a of e.pads){if(a.cooldown>0||n&&!a.big)continue;let e=a.pos.distanceTo(t);e<i&&(i=e,r=a)}return r}var Zb=[`Nova`,`Blitz`,`Comet`,`Vortex`,`Jet`,`Rogue`,`Flux`,`Apex`,`Talon`,`Echo`],Qb=class{renderer;hud;audio;input;settings;world=new Ub;mode=`menu`;phase=`countdown`;config={teamSize:1,skill:`pro`,playerTeam:0,duration:300};player=null;bots=[];predictor=new Kb;score=[0,0];clock=300;overtime=!1;paused=!1;unlimitedBoost=!1;stats=new Map;acc=0;phaseTimer=0;countdownShown=4;prev=null;cur=null;ballRot=new t;replayBuf=[];replayIdx=0;replayEnd=0;replayScorer=-1;waitingForGroundToEnd=!1;lastGoalTeam=0;lastTouches=[];goalPrediction=null;predictBall=new Db;excitement=.3;menuOrbit=0;freeplayGoalTimer=0;endOrbit=0;lastInput=null;fpsAcc=0;fpsFrames=0;fps=0;camera;replayCam;onMatchEnd;constructor(e,t,n,r,i){this.renderer=e,this.hud=t,this.audio=n,this.input=r,this.settings=i,this.camera=new Em(e.camera,i.camera),this.replayCam=new km(e.camera),this.camera.ballCam=i.gameplay.defaultBallCam}resetWorld(){this.world=new Ub,this.renderer.removeAllCars(),this.bots=[],this.player=null,this.stats.clear(),this.score=[0,0],this.overtime=!1,this.replayBuf=[],this.prev=this.cur=null,this.acc=0,this.lastTouches=[],this.goalPrediction=null,this.waitingForGroundToEnd=!1,this.camera.reset(),this.hud.setReplay(!1),this.hud.showScoreboard(!1)}startMenuBackground(){this.resetWorld(),this.mode=`menu`;let e=this.world.addCar(0,`Nova`),t=this.world.addCar(1,`Blitz`);this.bots.push(new qb(e,`allstar`),new qb(t,`allstar`)),this.world.setupKickoff(),this.phase=`playing`,this.hud.setVisible(!1)}startFreeplay(){this.resetWorld(),this.mode=`freeplay`,this.world.goalsEnabled=!0,this.player=this.world.addCar(0,this.settings.gameplay.playerName),this.player.dodgeDeadzone=this.settings.input.dodgeDeadzone,this.stats.set(this.player.id,$b()),this.resetFreeplay(),this.phase=`playing`,this.hud.setVisible(!0),this.hud.setMatchUi(!1),this.hud.setTip(()=>cb()===`kbm`?`FREE PLAY &nbsp; ${fb(`select`,`R`)} RESET &nbsp; ${fb(`x`,`1`)} BALL IN FRONT &nbsp; ${fb(`y`,`2`)} BALL ON CAR &nbsp; ${fb(`start`,`ESC`)} MENU`:`FREE PLAY &nbsp; D-PAD ◀ RESET &nbsp; ▼ BALL IN FRONT &nbsp; ▲ BALL ON CAR &nbsp; ${fb(`start`,`ESC`)} MENU`),setTimeout(()=>this.hud.setTip(``),6e3)}placeBall(e){let t=this.player;if(!t)return;let n=this.world.ball,r=t.forward,i=t.up;if(e===`front`){let e=r.x,i=r.y,a=Math.hypot(e,i)||1,o=114+h;n.reset(t.pos.x+e/a*o,t.pos.y+i/a*o,h),n.vel.set(t.vel.x,t.vel.y,0)}else{let e=40+h;n.reset(t.pos.x+r.x*20+i.x*e,t.pos.y+r.y*20+i.y*e,t.pos.z+r.z*20+i.z*e),n.vel.copy(t.vel)}this.freeplayGoalTimer=0}resetFreeplay(){let e=this.player,t=Ce[4];e.spawn(t.x,t.y,t.yaw,100),this.world.ball.reset(),this.world.resetPads(),this.camera.reset()}startMatch(e){this.resetWorld(),this.mode=`match`,this.config=e,this.world.goalsEnabled=!0;let t=[...Zb].sort(()=>Math.random()-.5),n=0;for(let r of[0,1])for(let i=0;i<e.teamSize;i++){let a=r===e.playerTeam&&i===0,o=this.world.addCar(r,a?this.settings.gameplay.playerName:t[n++]);this.stats.set(o.id,$b()),a?(this.player=o,o.dodgeDeadzone=this.settings.input.dodgeDeadzone):this.bots.push(new qb(o,e.skill))}this.clock=e.duration||0,this.hud.setVisible(!0),this.hud.setMatchUi(!0),this.hud.setTip(``),this.startKickoff()}startKickoff(){this.world.setupKickoff();for(let e of this.world.cars)e.frozen=!0;this.world.ball.frozen=!0;for(let e of this.bots)e.reset();this.phase=`countdown`,this.phaseTimer=3,this.countdownShown=4,this.camera.reset(),this.hud.setReplay(!1),this.lastTouches=[],this.renderer.ball.visible=!0,this.snapshotNow()}frame(e,t){if(this.lastInput=t,this.fpsAcc+=e,this.fpsFrames++,this.fpsAcc>.5&&(this.fps=this.fpsFrames/this.fpsAcc,this.fpsAcc=0,this.fpsFrames=0),!this.paused){this.player&&(this.settings.camera.ballCamMode===`hold`?this.camera.ballCam=this.settings.gameplay.defaultBallCam!==t.ballCamHeld:t.ballCamToggle&&(this.camera.ballCam=!this.camera.ballCam)),this.mode===`freeplay`&&(t.resetPressed||t.freeplay.reset?this.resetFreeplay():t.freeplay.ballFront?this.placeBall(`front`):t.freeplay.ballTop&&this.placeBall(`top`)),this.phase===`replay`&&t.jumpPressed&&this.endReplay(),this.acc+=e;let n=0;for(;this.acc>=.008333333333333333&&n<12;)this.acc-=o,n++,this.tick(t);n>=12&&(this.acc=0)}let n=this.paused?1:this.acc/o;this.render(e,n,t)}tick(e){let t=this.world;if(this.phase===`replay`){this.replayIdx++,this.replayIdx>=this.replayEnd&&this.endReplay();return}if(this.phase!==`ended`){if(this.player){let t=e.controls;this.player.controls={...t}}this.predictor.update(t,4),this.assignRoles();for(let e of this.bots)e.car.controls=e.tick(t,this.predictor,o);if(this.phase===`countdown`){this.phaseTimer-=o;let e=Math.ceil(this.phaseTimer);if(e<this.countdownShown&&e>0&&(this.countdownShown=e,this.hud.countdown(e),this.audio.countdown(e)),this.phaseTimer<=0){this.phase=`playing`;for(let e of t.cars)e.frozen=!1;t.ball.frozen=!1,this.hud.countdown(0),this.audio.countdown(0)}t.step(),this.snapshotNow();return}if(this.unlimitedBoost&&this.player&&(this.player.boost=100),t.step(),this.integrateBallRot(),this.handleEvents(t.events),this.recordReplay(),this.phase===`playing`&&this.mode===`match`&&(t.ballTouchedSinceKickoff&&!this.waitingForGroundToEnd&&(this.overtime?this.clock+=o:this.config.duration>0&&(this.clock-=o,this.clock<=0&&(this.clock=0,this.waitingForGroundToEnd=!0))),this.waitingForGroundToEnd&&t.ball.pos.z<t.ball.radius+8&&t.ball.vel.z<=5&&(this.waitingForGroundToEnd=!1,this.score[0]===this.score[1]?this.beginOvertime():this.endMatch()),t.tick%8==0&&(this.goalPrediction=this.predictGoal())),this.phase===`goal`&&(this.phaseTimer-=o,this.phaseTimer<=0&&this.mode===`match`)){let e=this.overtime,t=this.config.duration>0&&this.clock<=0&&!this.overtime;e||t&&this.score[0]!==this.score[1]?this.beginReplay(!0):this.beginReplay(!1)}if(this.mode===`freeplay`&&this.freeplayGoalTimer>0&&(this.freeplayGoalTimer-=o,this.freeplayGoalTimer<=0&&(t.ball.reset(),t.ball.pos.z=400,this.renderer.ball.visible=!0,this.phase=`playing`)),this.mode===`menu`&&t.goalScoredThisTick!==null){this.renderer.goalExplosion(t.ball.pos,t.goalScoredThisTick),t.setupKickoff();for(let e of this.bots)e.reset()}this.snapshotNow()}}assignRoles(){for(let e of[0,1]){let t=this.bots.filter(t=>t.car.team===e),n=this.player&&this.player.team===e?[this.player]:[];if(t.length+n.length<=1){for(let e of t)e.role=`attack`;continue}let r=this.world.ball.pos,i=[...t.map(e=>e.car),...n],a=e===0?1:-1,o=e=>e.pos.distanceTo(r)+Math.max(0,(e.pos.y-r.y)*a)*1.5,s=i.reduce((e,t)=>o(e)<o(t)?e:t);for(let e of t)e.role=e.car===s?`attack`:`support`}}beginOvertime(){this.overtime=!0,this.clock=0,this.hud.showBanner(`OVERTIME`,`Next goal wins`,`white`,3),this.audio.whistle(),this.startKickoff()}endMatch(){this.phase=`ended`;let e=this.score[0]>this.score[1]?0:1,t=this.player?this.player.team===e:!1;this.hud.showBanner(e===0?`BLUE WINS`:`ORANGE WINS`,this.player?t?`VICTORY`:`DEFEAT`:``,e===0?`blue`:`orange`,999),this.audio.whistle(),this.audio.silenceCars(),this.endOrbit=0,this.hud.showScoreboard(!0,this.scoreRows()),this.onMatchEnd?.(e)}handleEvents(e){if(this.mode===`menu`)return;let t=this.player;for(let n of e)switch(n.type){case`ballHit`:this.renderer.ballHit(n.point,n.strength),this.audio.ballHit(n.point,n.strength),n.car===t&&this.input.rumble(Math.min(1,n.strength/2500),.4,90),this.lastTouches.push({car:n.car,tick:this.world.tick}),this.lastTouches.length>6&&this.lastTouches.shift(),this.excitement=Math.min(1,this.excitement+n.strength/8e3),this.mode===`match`&&this.evaluateShotSave(n.car);break;case`ballBounce`:this.audio.ballBounce(n.pos,n.speed);break;case`goal`:this.onGoal(n.team,n.ballSpeed,n.ballPos,n.lastTouch);break;case`demo`:this.renderer.demoExplosion(n.victim.pos),this.audio.demo(n.victim.pos),this.hud.notify(`${n.attacker.name}  ✖  ${n.victim.name}`,n.attacker.team===0?`blue`:`orange`),(n.victim===t||n.attacker===t)&&this.input.rumble(1,1,300),(n.victim===t||n.attacker===t)&&this.camera.addShake(.6);break;case`bump`:this.audio.bump(n.victim.pos),(n.victim===t||n.attacker===t)&&this.input.rumble(.7,.5,150);break;case`boostPickup`:(n.car===t||n.car.pos.distanceTo(this.renderer.camera.position)<3e3)&&this.audio.boostPickup(n.pad.pos,n.pad.big),this.renderer.boostPickup(n.pad.pos,n.pad.big);break;case`jump`:this.audio.jump(n.car.pos);break;case`flip`:this.audio.flip(n.car.pos);break;case`land`:this.audio.land(n.car.pos),n.car===t&&this.input.rumble(.3,.1,60)}}blastCars(t){let n=1500;for(let r of this.world.cars){if(r.isDemoed)continue;let i=new e().subVectors(r.pos,t),a=i.length();if(a>n)continue;let o=1-a/n;i.z=Math.max(i.z,0)+a*.4+60,i.normalize(),r.vel.addScaled(i,2400*Math.sqrt(o)),r.angVel.add(new e((Math.random()-.5)*8*o,(Math.random()-.5)*8*o,(Math.random()-.5)*5*o))}}onGoal(e,t,n,r){let i=this.world;this.renderer.goalExplosion(n,e),this.blastCars(n),this.audio.goal(),this.camera.addShake(.8),this.input.rumble(.8,.8,400),this.excitement=1.5,i.ball.frozen=!0,i.ball.vel.set(0,0,0),this.renderer.ball.visible=!1;let a=Math.round(t*.036);if(this.mode===`freeplay`){this.hud.showBanner(`GOAL!`,`${a} KPH`,e===0?`blue`:`orange`,2),this.freeplayGoalTimer=2,this.phase=`goal`;return}if(this.mode!==`match`)return;this.score[e]++,this.lastGoalTeam=e;let o=null,s=null;for(let t=this.lastTouches.length-1;t>=0;t--){let n=this.lastTouches[t];if(n.car.team===e){if(!o)o=n.car;else if(n.car!==o&&i.tick-n.tick<600){s=n.car;break}}}if(!o&&r&&r.team===e&&(o=r),o){let e=this.stats.get(o.id);e.goals++,e.score+=100,e.shots++,e.score+=20}if(s){let e=this.stats.get(s.id);e.assists++,e.score+=50}this.replayScorer=o?o.id:-1;let c=o?o.name:`Own goal`;this.hud.showBanner(`${c.toUpperCase()} SCORED!`,`${a} KPH${s?`  ·  Assist: ${s.name}`:``}`,e===0?`blue`:`orange`,3),this.hud.notify(`GOAL  ${c}`,e===0?`blue`:`orange`),this.phase=`goal`,this.phaseTimer=3,this.replayEnd=this.replayBuf.length+120}predictGoal(){let e=this.predictBall;e.copyFrom(this.world.ball);for(let t=0;t<240;t++){if(e.integrateForces(o),e.integratePosition(o),e.collideWorld(),e.pos.y>5124.25+e.radius)return 0;if(e.pos.y<-(5124.25+e.radius))return 1}return null}evaluateShotSave(e){let t=this.goalPrediction,n=this.predictGoal();this.goalPrediction=n;let r=this.stats.get(e.id);r&&(n===e.team&&t!==e.team&&(r.shots++,r.score+=20),t!==null&&t!==e.team&&n!==t&&(r.saves++,r.score+=50,this.hud.notify(`SAVE  ${e.name}`,e.team===0?`blue`:`orange`),e===this.player&&this.hud.showBanner(`SAVE!`,``,e.team===0?`blue`:`orange`,1.5)))}recordReplay(){this.cur&&(this.replayBuf.push(this.cur),this.replayBuf.length>1080&&this.replayBuf.shift())}endAfterReplay=!1;beginReplay(e){this.endAfterReplay=e;let t=this.replayBuf.length,n=Math.min(t-1,this.replayEnd-120);this.replayIdx=Math.max(0,n-540),this.replayEnd=Math.min(t-1,n+110),this.phase=`replay`,this.hud.setReplay(!0),this.audio.silenceCars();let r=this.replayBuf[this.replayIdx];r&&this.replayCam.snap(r.ballPos)}endReplay(){this.hud.setReplay(!1),this.endAfterReplay?this.endMatch():this.startKickoff()}integrateBallRot(){let e=this.world.ball;e.frozen||this.ballRot.integrate(e.angVel,o)}snapshotNow(){this.prev=this.cur;let e=this.world;this.cur={ballPos:e.ball.pos.clone(),ballRot:this.ballRot.clone(),ballVisible:!(this.phase===`goal`||e.ball.frozen&&this.phase!==`countdown`&&this.mode!==`menu`),cars:e.cars.map(e=>({pos:e.pos.clone(),rot:e.rot.clone(),vel:e.vel.clone(),boosting:e.isBoosting,supersonic:e.isSupersonic,demoed:e.isDemoed,braking:e.controls.throttle<0&&e.forwardSpeed>50,onGround:e.isOnGround,wheels:e.wheels.map(e=>({len:e.visualLength,steer:e.steerAngle,spin:e.spin,contact:e.inContact}))}))},this.prev||=this.cur}render(t,n,r){let i=this.renderer,a,o;if(this.phase===`replay`?(a=this.replayBuf[Math.max(0,this.replayIdx-1)]??null,o=this.replayBuf[this.replayIdx]??a):(a=this.prev,o=this.cur),!a||!o){i.render();return}let s=(t,r)=>new e(t.x+(r.x-t.x)*n,t.y+(r.y-t.y)*n,t.z+(r.z-t.z)*n),c=(e,t)=>e.clone().slerp(t,n),l=this.player?this.player.id:-1,u=this.world.cars;o.cars.forEach((e,r)=>{let o=a.cars[r]??e,d=u[r];if(!d)return;let f=o.pos.distanceTo(e.pos)>300,p={id:d.id,team:d.team,name:d.name,pos:f?e.pos:s(o.pos,e.pos),rot:f?e.rot:c(o.rot,e.rot),vel:e.vel,boosting:e.boosting,supersonic:e.supersonic,demoed:e.demoed,braking:e.braking,onGround:e.onGround,wheels:e.wheels.map((e,t)=>({len:o.wheels[t].len+(e.len-o.wheels[t].len)*n,steer:e.steer,spin:o.wheels[t].spin+(e.spin-o.wheels[t].spin)*n,contact:e.contact}))};if(i.syncCar(p,t,l),this.phase!==`replay`&&this.phase!==`ended`){let t=!e.demoed&&this.mode!==`menu`||this.mode===`menu`&&!1;this.audio.updateCar(d.id,p.pos,e.vel.length(),d.controls.throttle,e.boosting,e.onGround,d===this.player,t)}});let d=s(a.ballPos,o.ballPos),f=c(a.ballRot,o.ballRot),p=new Qr(f.x,f.y,f.z,f.w);if(i.syncBall(d,p,o.ballVisible),this.phase===`replay`){let e=u.findIndex(e=>e.id===this.replayScorer),n=e>=0?o.cars[e]:null;this.replayCam.update(t,d,n&&!n.demoed?s(a.cars[e].pos,n.pos):null)}else if(this.mode===`menu`||this.phase===`ended`){this.menuOrbit+=t*.07;let e=6200;i.camera.position.set(Math.cos(this.menuOrbit)*e,Math.sin(this.menuOrbit)*e*1.1,1900),i.camera.up.set(0,0,1),i.camera.lookAt(d.x*.3,d.y*.3,200),this.endOrbit+=t}else if(this.player){let n=this.player,i=u.indexOf(n),l=a.cars[i],f=o.cars[i],p=s(l.pos,f.pos),m=c(l.rot,f.rot),h=ex(m,new e(1,0,0)),g=ex(m,new e(0,0,1)),_=o.ballVisible?d:null;n.isDemoed||this.camera.update(t,{pos:p,vel:f.vel,angVel:n.angVel,forward:h,up:g,isOnGround:f.onGround},_,r)}if(this.camera.updateProjection(i.aspect),this.mode!==`menu`){if(this.hud.setScore(this.score[0],this.score[1]),this.mode===`match`&&this.hud.setClock(this.clock,this.overtime),this.hud.setBoost(this.player?this.player.boost:0,!!this.player&&this.phase!==`replay`&&this.phase!==`ended`),this.hud.setBallCam(this.camera.ballCam,r.usingGamepad),this.phase!==`ended`){let e=r.scoreboard;this.hud.showScoreboard(e,e?this.scoreRows():[])}let e=Math.floor(this.clock/60),t=Math.ceil(this.clock%60);if(i.stadium.setScreens(this.score[0],this.score[1],this.mode===`match`?`${this.overtime?`+`:``}${e}:${String(t===60?0:t).padStart(2,`0`)}`:`FREE`),this.settings.gameplay.debugOverlay&&this.player){let e=this.player;this.hud.setDebug(`FPS ${this.fps.toFixed(0)}\nspeed ${e.vel.length().toFixed(0)}  fwd ${e.forwardSpeed.toFixed(0)}\nboost ${e.boost.toFixed(1)}  ground ${e.isOnGround} wheels ${e.numWheelsInContact}\njumped ${e.hasJumped} flipped ${e.hasFlipped} dbl ${e.hasDoubleJumped}\nsupersonic ${e.isSupersonic}  handbrake ${e.handbrakeVal.toFixed(2)}\nball ${this.world.ball.vel.length().toFixed(0)} uu/s  z ${this.world.ball.pos.z.toFixed(0)}\nin: thr ${e.controls.throttle.toFixed(2)} str ${e.controls.steer.toFixed(2)} p ${e.controls.pitch.toFixed(2)} y ${e.controls.yaw.toFixed(2)} r ${e.controls.roll.toFixed(2)}`)}else this.hud.setDebug(null)}this.excitement+=(.3-this.excitement)*(1-Math.exp(-.5*t)),this.audio.setCrowd(Math.min(1.4,this.excitement)),this.audio.setListener(i.camera),i.update(t,this.world.pads.map(e=>e.cooldown<=0),Math.min(1,this.excitement-.3)),this.hud.update(t),i.render(),this.lastGoalTeam,this.lastInput}scoreRows(){return this.world.cars.map(e=>{let t=this.stats.get(e.id)??$b();return{name:e.name,team:e.team,...t,isPlayer:e===this.player}})}};function $b(){return{score:0,goals:0,assists:0,saves:0,shots:0}}function ex(t,n){let r=new G(n.x,n.y,n.z).applyQuaternion(new Qr(t.x,t.y,t.z,t.w));return new e(r.x,r.y,r.z)}var tx={teamSize:1,skill:`pro`,playerTeam:0,duration:300};function nx(e){return{title:`SOCCAR`,subtitle:`Rocket-powered car soccer`,className:`main`,onBack:()=>{},items:[{type:`button`,label:`PLAY`,hint:`HIT THE FIELD`,action:()=>e.menu.push(rx(e))},{type:`button`,label:`FREE PLAY`,hint:`PRACTICE ON YOUR OWN`,action:()=>{e.menu.closeAll(),e.game.startFreeplay(),e.setPaused(!1)}},{type:`button`,label:`SETTINGS`,hint:`CAMERA, CONTROLS, VIDEO, AUDIO`,action:()=>e.menu.push(ox(e))},{type:`button`,label:`CONTROLS`,hint:`HOW TO PLAY`,action:()=>e.menu.push(hx(e))}],footer:()=>`${fb(`confirm`,`ENTER`)} SELECT<div style="margin-top:6px;opacity:.55;font-size:11px;text-transform:none">Fennec and ball models: "Fennec - Rocket League Car" and "Ball - Rocket League" by Jako (sketchfab.com/fairlight51), CC BY 4.0</div><div style="margin-top:4px;opacity:.55;font-size:11px;text-transform:none">Unofficial fan project. Portions of the materials used are trademarks and/or copyrighted works of Epic Games, Inc. All rights reserved by Epic. This material is not official and is not endorsed by Epic.</div>`}}function rx(e){return{title:`EXHIBITION`,items:[{type:`select`,label:`Mode`,options:[{value:`1`,label:`1v1 Duel`},{value:`2`,label:`2v2 Doubles`},{value:`3`,label:`3v3 Standard`}],get:()=>String(tx.teamSize),set:e=>tx.teamSize=Number(e)},{type:`select`,label:`Bot Difficulty`,options:[{value:`rookie`,label:`Rookie`},{value:`pro`,label:`Pro`},{value:`allstar`,label:`All-Star`}],get:()=>tx.skill,set:e=>tx.skill=e},{type:`select`,label:`Team`,options:[{value:`0`,label:`Blue`},{value:`1`,label:`Orange`}],get:()=>String(tx.playerTeam),set:e=>tx.playerTeam=Number(e)},{type:`select`,label:`Match Length`,options:[{value:`300`,label:`5 Minutes`},{value:`180`,label:`3 Minutes`},{value:`600`,label:`10 Minutes`},{value:`0`,label:`Unlimited`}],get:()=>String(tx.duration),set:e=>tx.duration=Number(e)},{type:`button`,label:`START MATCH`,action:()=>{e.menu.closeAll(),e.game.startMatch({...tx}),e.setPaused(!1)}},{type:`button`,label:`BACK`,action:()=>e.menu.pop()}]}}function ix(e){let t=e.game,n=[{type:`button`,label:`RESUME`,action:()=>e.resume()}];return t.mode===`freeplay`?n.push({type:`toggle`,label:`Unlimited Boost`,get:()=>t.unlimitedBoost,set:e=>t.unlimitedBoost=e},{type:`button`,label:`RESET`,action:()=>{e.resume(),t.startFreeplay()}}):t.mode===`match`&&n.push({type:`button`,label:`RESTART MATCH`,action:()=>{e.resume(),t.startMatch({...t.config})}}),n.push({type:`button`,label:`SETTINGS`,action:()=>e.menu.push(ox(e))},{type:`button`,label:`CONTROLS`,action:()=>e.menu.push(hx(e))},{type:`button`,label:`EXIT TO MAIN MENU`,action:()=>{e.menu.closeAll(),t.startMenuBackground(),e.setPaused(!1),e.menu.push(nx(e))}}),{title:`PAUSED`,items:n,onBack:()=>e.resume()}}function ax(e){return{title:`MATCH OVER`,className:`end`,onBack:()=>{},items:[{type:`button`,label:`PLAY AGAIN`,action:()=>{e.menu.closeAll(),e.game.startMatch({...e.game.config})}},{type:`button`,label:`MAIN MENU`,action:()=>{e.menu.closeAll(),e.game.startMenuBackground(),e.menu.push(nx(e))}}]}}function ox(e){return{title:`SETTINGS`,items:[{type:`button`,label:`CAMERA`,action:()=>e.menu.push(cx(e))},{type:`button`,label:`CONTROLS`,action:()=>e.menu.push(lx(e))},{type:`button`,label:`BUTTON MAPPING`,action:()=>e.menu.push(dx(e))},{type:`button`,label:`VIDEO`,action:()=>e.menu.push(fx(e))},{type:`button`,label:`AUDIO`,action:()=>e.menu.push(px(e))},{type:`button`,label:`GAMEPLAY`,action:()=>e.menu.push(mx(e))},{type:`button`,label:`BACK`,action:()=>e.menu.pop()}]}}function sx(e){zy(e.settings)}function cx(e){let t=e.settings.camera,n=(n,r,i,a,o,s=0)=>({type:`slider`,label:n,min:i,max:a,step:o,get:()=>t[r],set:n=>{t[r]=n,sx(e)},fmt:e=>e.toFixed(s)});return{title:`CAMERA`,items:[n(`Field of View`,`fov`,60,110,1),n(`Distance`,`distance`,100,400,10),n(`Height`,`height`,40,200,10),n(`Angle`,`angle`,-15,0,1),n(`Stiffness`,`stiffness`,0,1,.05,2),n(`Swivel Speed`,`swivelSpeed`,1,10,.1,2),n(`Transition Speed`,`transitionSpeed`,1,2,.05,2),{type:`select`,label:`Ball Camera Mode`,options:[{value:`toggle`,label:`Toggle`},{value:`hold`,label:`Hold`}],get:()=>t.ballCamMode,set:n=>{t.ballCamMode=n,sx(e)}},{type:`toggle`,label:`Invert Swivel`,get:()=>t.invertSwivel,set:n=>{t.invertSwivel=n,sx(e)}},{type:`toggle`,label:`Camera Shake`,get:()=>t.shake,set:n=>{t.shake=n,sx(e)}},{type:`button`,label:`RESET TO DEFAULTS`,action:()=>{Object.assign(t,Ly().camera),sx(e),e.menu.refresh()}},{type:`button`,label:`BACK`,action:()=>e.menu.pop()}]}}function lx(e){let t=e.settings.input;return{title:`CONTROLS`,items:[{type:`slider`,label:`Controller Deadzone`,min:0,max:.5,step:.01,get:()=>t.deadzone,set:n=>{t.deadzone=n,sx(e)},fmt:e=>e.toFixed(2)},{type:`slider`,label:`Dodge Deadzone`,min:.1,max:.9,step:.05,get:()=>t.dodgeDeadzone,set:n=>{t.dodgeDeadzone=n,e.game.player&&(e.game.player.dodgeDeadzone=n),sx(e)},fmt:e=>e.toFixed(2)},{type:`slider`,label:`Steering Sensitivity`,min:.1,max:10,step:.02,get:()=>t.steeringSensitivity,set:n=>{t.steeringSensitivity=n,sx(e)},fmt:e=>e.toFixed(2)},{type:`slider`,label:`Aerial Sensitivity`,min:.1,max:10,step:.02,get:()=>t.aerialSensitivity,set:n=>{t.aerialSensitivity=n,sx(e)},fmt:e=>e.toFixed(2)},{type:`toggle`,label:`Controller Vibration`,get:()=>t.vibration,set:n=>{t.vibration=n,sx(e)}},{type:`button`,label:`BACK`,action:()=>e.menu.pop()}]}}var ux=[[`throttle`,`Throttle`],[`reverse`,`Reverse / Brake`],[`jump`,`Jump`],[`boost`,`Boost`],[`powerslide`,`Powerslide`],[`airRoll`,`Air Roll (Free)`],[`airRollLeft`,`Air Roll Left`],[`airRollRight`,`Air Roll Right`],[`ballCam`,`Ball Cam`],[`rearView`,`Rear View`],[`scoreboard`,`Scoreboard`],[`pause`,`Pause`],[`reset`,`Reset (Free Play)`]];function dx(e){let t=e.settings.input.padBindings;return{title:`BUTTON MAPPING`,subtitle:`Select an action, then press the controller button to assign`,items:[...ux.map(([n,r])=>({type:`bind`,label:r,get:()=>kt[t[n]]??`Button ${t[n]}`,rebind:()=>{let r=document.querySelector(`.menu-item.focus .mi-value`);r&&(r.textContent=`Press a button…`),setTimeout(()=>{e.menu.capturing=r=>{r!==null&&(t[n]=r,sx(e)),e.menu.refresh()}},250)}})),{type:`button`,label:`RESET TO DEFAULTS`,action:()=>{Object.assign(t,At),sx(e),e.menu.refresh()}},{type:`button`,label:`BACK`,action:()=>e.menu.pop()}]}}function fx(e){let t=e.settings.graphics,n=()=>{e.renderer.applySettings(t),sx(e)};return{title:`VIDEO`,items:[{type:`toggle`,label:`Bloom`,get:()=>t.bloom,set:e=>{t.bloom=e,n()}},{type:`toggle`,label:`Shadows`,get:()=>t.shadows,set:e=>{t.shadows=e,n()}},{type:`slider`,label:`Render Scale`,min:.5,max:1,step:.05,get:()=>t.renderScale,set:e=>{t.renderScale=e,t.autoScale=!1,n()},fmt:e=>`${Math.round(e*100)}%`},{type:`toggle`,label:`Auto Render Scale`,get:()=>t.autoScale,set:e=>{t.autoScale=e,n()}},{type:`toggle`,label:`Show Nameplates`,get:()=>e.settings.gameplay.nameplates,set:t=>{e.settings.gameplay.nameplates=t,e.renderer.showNameplates=t,sx(e)}},{type:`button`,label:`BACK`,action:()=>e.menu.pop()}]}}function px(e){let t=e.settings.audio,n=()=>{e.audio.applySettings(t),sx(e)},r=(e,r)=>({type:`slider`,label:e,min:0,max:1,step:.05,get:()=>t[r],set:e=>{t[r]=e,n()},fmt:e=>`${Math.round(e*100)}`});return{title:`AUDIO`,items:[r(`Master Volume`,`master`),r(`Effects`,`sfx`),r(`Engine`,`engine`),r(`Crowd`,`crowd`),{type:`button`,label:`BACK`,action:()=>e.menu.pop()}]}}function mx(e){let t=e.settings.gameplay;return{title:`GAMEPLAY`,items:[{type:`toggle`,label:`Ball Cam On By Default`,get:()=>t.defaultBallCam,set:n=>{t.defaultBallCam=n,sx(e)}},{type:`toggle`,label:`Debug Overlay`,get:()=>t.debugOverlay,set:n=>{t.debugOverlay=n,sx(e)}},{type:`select`,label:`Player Name`,options:[`You`,`Player`,`Ace`,`Striker`,`Keeper`].map(e=>({value:e,label:e})),get:()=>t.playerName,set:n=>{t.playerName=n,sx(e)}},{type:`button`,label:`BACK`,action:()=>e.menu.pop()}]}}function hx(e){return{title:`CONTROLS`,className:`wide`,items:[{type:`header`,label:`ACTION  ·  PS4 CONTROLLER  ·  KEYBOARD & MOUSE`},...[[`Throttle`,`R2`,`W / ↑`],[`Reverse / Brake`,`L2`,`S / ↓`],[`Steer / Pitch / Yaw`,`Left Stick`,`A D / W S`],[`Jump (tap twice: double jump)`,`Cross`,`Space / Right Mouse`],[`Dodge / Flip`,`Jump + Stick (in air)`,`Space + direction`],[`Boost`,`Circle`,`Left Mouse / Right Shift / K`],[`Powerslide / Air Roll`,`Square (hold)`,`Left Shift`],[`Air Roll Left / Right`,`L1 / R1`,`Q / E`],[`Ball Cam`,`Triangle`,`C`],[`Look Around / Rear View`,`Right Stick / R3`,`V`],[`Scoreboard`,`Touchpad`,`Tab`],[`Pause`,`Options`,`Esc`],[`Reset (Free Play)`,`Share`,`R`]].map(([e,t,n])=>({type:`text`,label:`${e}   —   ${t}   ·   ${n}`})),{type:`button`,label:`BACK`,action:()=>e.menu.pop()}]}}var gx=Ry(),[_x,vx]=await Promise.all([Uy(),C_()]);Xv.asset=_x,Y_.asset=vx;var yx=document.getElementById(`app`),bx=document.createElement(`div`);bx.className=`game-layer`,yx.appendChild(bx);var xx=document.createElement(`div`);xx.className=`label-layer`,yx.appendChild(xx);var Sx=new hy(bx,xx,gx.graphics);Sx.showNameplates=gx.gameplay.nameplates;var Cx=new hb(yx),wx=new Nt(gx.input),Tx=new Fy(gx.audio);new URLSearchParams(location.search).has(`mute`)&&(Tx.muted=!0);var Ex=new _b(yx),Dx=new Qb(Sx,Cx,Tx,wx,gx);Ex.onNavigate=()=>Tx.uiMove(),Ex.onSelect=()=>Tx.uiSelect();var Ox=document.createElement(`div`);Ox.className=`pad-status ui-layer`,yx.appendChild(Ox);var kx={menu:Ex,game:Dx,settings:gx,renderer:Sx,audio:Tx,resume:()=>{Ex.closeAll(),Dx.paused=!1,wx.captureMouse=!0},setPaused:e=>{Dx.paused=e}};Dx.onMatchEnd=()=>{setTimeout(()=>{Dx.phase===`ended`&&Ex.push(ax(kx))},2500)},Dx.startMenuBackground(),matchMedia(`(pointer: coarse)`).matches&&!matchMedia(`(any-pointer: fine)`).matches&&Cx.notify(`Soccar needs a keyboard or a controller (no touch controls yet)`),Ex.push(nx(kx)),window.addEventListener(`keydown`,e=>{e.code===`KeyM`&&Cx.notify(Tx.toggleMute()?`Sound muted (M)`:`Sound on (M)`),e.code===`F3`&&(gx.gameplay.debugOverlay=!gx.gameplay.debugOverlay,e.preventDefault()),e.code===`F11`&&(e.preventDefault(),document.fullscreenElement?document.exitFullscreen().catch(()=>{}):document.documentElement.requestFullscreen().catch(()=>{}))}),window.addEventListener(`gamepadconnected`,e=>{Cx.notify(`Controller connected: ${zx(e.gamepad.id)}`),Tx.init()}),window.addEventListener(`gamepaddisconnected`,()=>Cx.notify(`Controller disconnected`));var Ax=document.createElement(`div`);Ax.style.cssText=`position:fixed;top:8px;left:8px;z-index:50;font:600 12px monospace;color:#fff;background:rgba(0,0,0,.55);padding:4px 8px;border-radius:4px;pointer-events:none;display:none`,document.body.appendChild(Ax),new URLSearchParams(location.search).has(`fps`)&&(Ax.style.display=`block`),window.addEventListener(`keydown`,e=>{e.code===`F3`&&(e.preventDefault(),Ax.style.display=Ax.style.display===`none`?`block`:`none`)});var jx=0,Mx=performance.now(),Nx=0,Px=performance.now(),Fx=[],Ix=performance.now()+3e3;function Lx(e,t){let n=gx.graphics;if(!n.autoScale||n.renderScale<=.5||document.visibilityState!==`visible`||e<Ix||(t<200&&Fx.push(t),e-Ix<2e3))return;Fx.sort((e,t)=>e-t);let r=Fx[Fx.length>>1]??0;if(Fx.length=0,Ix=e+1e3,r<=20)return;let i=Math.max(.5,Math.floor(n.renderScale*Math.sqrt(16.7/r)*20)/20);i>=n.renderScale||(n.renderScale=i,Sx.applySettings(n),zy(gx),Cx.notify(`Render scale lowered to ${Math.round(i*100)}% for smoother play (Settings > Video)`))}function Rx(e){Lx(e,e-Px),jx++,Nx=Math.max(Nx,e-Px),e-Mx>500&&(Ax.textContent=`${Math.round(jx*1e3/(e-Mx))} fps  worst ${Nx.toFixed(1)} ms`,jx=0,Mx=e,Nx=0);let t=Math.min(.1,(e-Px)/1e3);Px=e;let n=wx.poll(t),r=wx.pollAnyPadButton();sb(n.usingGamepad?ob(wx.padName):`kbm`),Ex.open?(Ex.handleInput(n,Ex.capturing?r:null),Ex.open||wx.suppressHeld()):n.pausePressed&&(Dx.mode===`freeplay`||Dx.mode===`match`)&&Dx.phase!==`ended`&&(Dx.paused=!0,wx.captureMouse=!1,Tx.silenceCars(),Ex.push(ix(kx)));let i=Ex.open&&Dx.mode!==`menu`?{...n,controls:{...n.controls,jump:!1,boost:!1,throttle:0,steer:0}}:n;Tx.setPaused(Dx.paused&&Dx.mode!==`menu`),Dx.frame(t,i);let a=wx.getGamepad();Ox.textContent=a?`🎮 ${zx(a.id)}${a.mapping===`standard`?``:` (non-standard mapping)`}`:`No controller detected — press any button on your controller`,Ox.classList.toggle(`connected`,!!a),Ox.style.display=Ex.open?`block`:`none`,requestAnimationFrame(Rx)}requestAnimationFrame(Rx);function zx(e){return/054c/i.test(e)||/dualshock|wireless controller/i.test(e)?`DualShock 4`:/0ce6|dualsense/i.test(e)?`DualSense`:/xbox|045e/i.test(e)?`Xbox Controller`:e.replace(/\(.*?\)/g,``).trim().slice(0,32)||`Gamepad`}