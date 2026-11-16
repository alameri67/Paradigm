/* =====================================================================
   Liquid pill: a plain-JavaScript port of the Nimbus UI "Waterline"
   LiquidNavbar React component (by guglielmogiannattasio.it).
   Same CSS, same WebGL water shader, same spring physics. Added:
   radio-group mode (for trait pickers), a small size, and setActive()
   so the page can move the drop from outside.
   ===================================================================== */

export interface LiquidPillItem {
  label: string;
  /** Inline SVG markup for the icon. */
  icon?: string;
  fx?: "pop" | "spin" | "wave" | "none";
  /** Focus key, used to restore focus after re-renders. */
  fk?: string;
}

export interface LiquidPillOptions {
  items: LiquidPillItem[];
  active?: number;
  mode?: "nav" | "radio";
  size?: "sm";
  compact?: "auto" | boolean;
  ariaLabel?: string;
  labelledBy?: string;
  className?: string;
  onChange?: (index: number, item: LiquidPillItem) => void;
}

export interface LiquidPillHandle {
  el: HTMLElement;
  readonly active: number;
  setActive(i: number): void;
  refresh(): void;
  destroy(): void;
}

interface GLCtx { gl: WebGLRenderingContext; u: Record<string, WebGLUniformLocation | null> }
interface Body { x: number; v: number }
interface Sat { x: number; y: number; vx: number; vy: number; r: number; k: number }
interface Rip { x: number; y: number; age: number; amp: number }

const PAD = 14;

const STYLES = `
.nimbus-nav{--n-tint:rgba(255,255,255,.14);--n-fg:#0B132B;--n-fg-soft:rgba(11,19,43,.6);--n-rim:rgba(255,255,255,.7);
  position:relative;display:inline-flex;align-items:center;gap:2px;padding:6px;border-radius:999px;isolation:isolate;
  font-family:inherit;-webkit-font-smoothing:antialiased;user-select:none;-webkit-tap-highlight-color:transparent}
.nimbus-glass{position:absolute;inset:0;border-radius:inherit;z-index:-2;overflow:hidden;background:var(--n-tint);
  -webkit-backdrop-filter:blur(10px) saturate(1.2) brightness(1.08);backdrop-filter:blur(10px) saturate(1.2) brightness(1.08);
  box-shadow:inset 0 1px 1px var(--n-rim),inset 0 0 0 1px rgba(255,255,255,.2),0 12px 32px -14px rgba(0,40,90,.5),0 2px 6px rgba(0,40,90,.1)}
.nimbus-nav[data-refract="on"] .nimbus-glass{-webkit-backdrop-filter:url(#nimbus-refract) blur(2px) saturate(1.2) brightness(1.08);backdrop-filter:url(#nimbus-refract) blur(2px) saturate(1.2) brightness(1.08)}
.nimbus-water{position:absolute;left:${-PAD}px;top:${-PAD}px;z-index:-1;pointer-events:none}
.nimbus-nav[data-gl="off"] .nimbus-water{display:none}
.nimbus-drop{display:none;position:absolute;top:6px;bottom:6px;left:0;border-radius:999px;z-index:-1;pointer-events:none;will-change:transform,width;
  background:radial-gradient(120% 140% at 30% 0%,rgba(255,255,255,.75),rgba(255,255,255,0) 55%),rgba(255,255,255,.38);
  box-shadow:inset 0 1px 1px rgba(255,255,255,.95),inset 0 -2px 6px rgba(0,162,255,.22),inset 0 0 0 1px rgba(255,255,255,.55),0 6px 16px -6px rgba(0,70,140,.45)}
.nimbus-nav[data-gl="off"] .nimbus-drop{display:block}
.nimbus-item{position:relative;z-index:1;display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 16px;border:0;border-radius:999px;background:none;color:var(--n-fg-soft);
  font-family:inherit;font-weight:500;font-size:14px;line-height:1;letter-spacing:-.01em;text-decoration:none;white-space:nowrap;cursor:pointer;transition:color .25s}
.nimbus-item:hover,.nimbus-item[aria-current="page"],.nimbus-item[aria-checked="true"]{color:var(--n-fg)}
.nimbus-item:focus-visible{outline:2px solid #00A2FF;outline-offset:2px}
.nimbus-nav[data-size="sm"]{padding:4px}
.nimbus-nav[data-size="sm"] .nimbus-item{height:32px;padding:0 12px;font-size:13px}
.nimbus-nav[data-size="sm"] .nimbus-drop{top:4px;bottom:4px}
.nv-ico{position:relative;display:inline-flex;flex:none}
.nv-ico svg{transition:transform .45s cubic-bezier(.3,1.6,.5,1)}
.nimbus-item[aria-current="page"] .nv-ico svg,.nimbus-item[aria-checked="true"] .nv-ico svg{transform:translateY(-1px) scale(1.08)}
.nv-ico[data-fx="pop"] svg{animation:nvPop .5s cubic-bezier(.3,1.6,.5,1) both}
@keyframes nvPop{0%{transform:scale(.72)}60%{transform:scale(1.2)}100%{transform:translateY(-1px) scale(1.08)}}
.nv-ico[data-fx="spin"] svg{animation:nvSpin 1s cubic-bezier(.2,.75,.25,1) both}
@keyframes nvSpin{0%{transform:perspective(80px) rotateY(0)}100%{transform:perspective(80px) rotateY(360deg) translateY(-1px) scale(1.08)}}
.nv-ico[data-fx="wave"] svg{animation:nvWave .9s ease-in-out both;transform-origin:50% 92%}
@keyframes nvWave{0%{transform:none}20%{transform:rotate(-15deg)}40%{transform:rotate(12deg)}60%{transform:rotate(-8deg)}80%{transform:rotate(4deg)}100%{transform:translateY(-1px) scale(1.08)}}
.nimbus-nav[data-compact="true"] .nimbus-item{padding:0 13px}
.nimbus-nav[data-compact="true"] .nimbus-label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (max-width:520px){.nimbus-nav[data-compact="auto"] .nimbus-item{padding:0 13px}.nimbus-nav[data-compact="auto"] .nimbus-label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}}
@media (prefers-reduced-motion:reduce){.nv-ico svg,.nv-ico::before,.nv-ico::after{animation:none!important;transition:none}}
`;

const VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
const FRAG = `precision highp float;
uniform vec2 uRes;uniform float uDpr;uniform float uTime;uniform vec4 uPill;
uniform vec4 uBlob[6];uniform float uSy[6];uniform vec4 uRip[6];uniform vec3 uMouse;uniform float uDark;uniform float uAmb;
float sdRB(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}
float sdCap(vec2 p,vec4 B,float sy){p-=B.xy;p.y/=sy;p.x=max(abs(p.x)-B.z,0.);return(length(p)-B.w)*min(1.,sy);}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float dropD(vec2 p){float d=1e4;for(int i=0;i<6;i++){if(uBlob[i].w>.5){d=smin(d,sdCap(p,uBlob[i],uSy[i]),13.);}}return d;}
float pillD(vec2 p){vec2 h=uPill.zw*.5;return sdRB(p-uPill.xy-h,h,h.y);}
float lens(float d,float w){float t=clamp(-d/w,0.,1.);return sqrt(1.-(1.-t)*(1.-t));}
float waves(vec2 p){float w=0.;
 for(int i=0;i<6;i++){vec4 R=uRip[i];if(R.w>0.){float x=length(p-R.xy)-R.z*240.;w+=R.w*exp(-R.z*1.7)*sin(x*.3)*exp(-x*x/700.);}}
 vec2 m=p-uMouse.xy;w+=uMouse.z*3.6*exp(-dot(m,m)/1000.);
 w+=uAmb*(sin(p.x*.05+uTime*1.2)*.45+sin(p.x*.13-uTime*.85+p.y*.2)*.25);return w;}
float H(vec2 p){float dp=pillD(p);return lens(dp,uPill.w*.36)*2.4+lens(dropD(p),11.)*7.5+waves(p)*smoothstep(0.,7.,-dp);}
float caus(vec2 p,float t){vec2 q=p;float c=0.;for(int i=0;i<3;i++){q+=vec2(sin(q.y*1.1+t),cos(q.x*1.3-t*.7))*.6;c+=1./(1.+16.*abs(sin(q.x)*sin(q.y)));}return c/3.;}
void main(){
 vec2 p=vec2(gl_FragCoord.x,uRes.y*uDpr-gl_FragCoord.y)/uDpr;
 float dp=pillD(p);float dd=dropD(p);
 float h0=H(p);vec3 n=normalize(vec3(h0-H(p+vec2(1.,0.)),h0-H(p+vec2(0.,1.)),1.));
 vec3 V=vec3(0.,0.,1.);
 float spec=pow(max(dot(reflect(-normalize(vec3(-.45,-.8,.85)),n),V),0.),70.);
 float spec2=pow(max(dot(reflect(-normalize(vec3(.6,.75,.7)),n),V),0.),22.)*.3;
 float fres=clamp((1.-n.z)*4.,0.,1.);
 vec3 irid=.5+.5*cos(6.2831*(vec3(0.,.33,.67)+fres*.85+p.x*.0028+uTime*.035));
 float pm=smoothstep(1.,-1.,dp);float dm=smoothstep(1.,-1.,dd)*smoothstep(1.,-2.,dp);
 float sh=smoothstep(9.,-9.,dropD(p-vec2(0.,5.)))*(1.-dm)*pm*(.11+.07*uDark);
 vec3 c=vec3(0.,.14,.36)*sh;float a=sh;
 float pa=clamp(pm*(fres*.5+spec*.9+spec2),0.,1.);
 c=mix(vec3(1.),irid,.5*fres)*pa+c*(1.-pa);a=pa+a*(1.-pa);
 float th=lens(dd,11.);
 float cs=caus((p+n.xy*th*18.)*.085,uTime*.9);
 vec3 tint=mix(vec3(.80,.95,1.),vec3(.55,.82,1.),uDark);
 float rim=dm*(1.-smoothstep(0.,8.,-dd));
 float cres=dm*smoothstep(.12,.55,dot(n.xy,normalize(vec2(.55,.85))))*smoothstep(0.,3.,-dd);
 float body=.5+.5*clamp(-n.y*3.,-1.,1.);
 float da=dm*(.26+.14*body)*(1.-.35*uDark);vec3 dc=mix(tint,vec3(1.),body*.6);
 float la=rim*.22;vec3 lc=mix(vec3(0.,.42,.78),vec3(.1,.55,.95),uDark);dc=lc*la+dc*da*(1.-la);da=la+da*(1.-la);
 la=clamp(cres*.7+smoothstep(.6,1.,cs)*.28*th*dm,0.,1.);dc=vec3(1.)*la+dc*(1.-la);da=la+da*(1.-la);
 la=clamp(dm*(spec*1.2+spec2*.5),0.,1.);dc=vec3(1.)*la+dc*(1.-la);da=la+da*(1.-la);
 la=dm*smoothstep(-2.,0.,dd)*.4;dc=mix(vec3(1.),irid,.35)*la+dc*(1.-la);da=la+da*(1.-la);
 c=dc+c*(1.-da);a=da+a*(1.-da);
 gl_FragColor=vec4(c,a);
}`;

let globalsDone = false;
function ensureGlobals() {
  if (globalsDone) return;
  globalsDone = true;
  const st = document.createElement('style');
  st.textContent = STYLES;
  (document.head || document.documentElement).appendChild(st);
  const holder = document.createElement('div');
  holder.innerHTML = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="nimbus-refract" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.006 0.02" numOctaves="2" seed="7" result="noise"/><feGaussianBlur in="noise" stdDeviation="2" result="soft"/><feDisplacementMap in="SourceGraphic" in2="soft" scale="60" xChannelSelector="R" yChannelSelector="G"/></filter></svg>';
  document.body.appendChild(holder.firstChild!);
}

function supportsRefraction() {
  if (typeof window === 'undefined' || !window.CSS) return false;
  const ua = navigator.userAgent;
  return /Chrome\/|Chromium\/|Edg\//.test(ua) && !/Firefox\//.test(ua) && !!(window.CSS.supports && window.CSS.supports('backdrop-filter', 'url(#a)'));
}

function initGL(canvas: HTMLCanvasElement): GLCtx | null {
  let gl: WebGLRenderingContext | null = null;
  try { gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false }); } catch { gl = null; }
  if (!gl) return null;
  const g = gl;
  const sh = function (type: number, src: string) {
    const s = g.createShader(type)!;
    gl.shaderSource(s, src); gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const p = gl.createProgram();
  gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
  gl.useProgram(p);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(p, 'a');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u: Record<string, WebGLUniformLocation | null> = {};
  ['uRes', 'uDpr', 'uTime', 'uPill', 'uBlob', 'uSy', 'uRip', 'uMouse', 'uDark', 'uAmb'].forEach(function (n) { u[n] = gl.getUniformLocation(p, n); });
  return { gl: gl, u: u };
}

function escHTML(s: string) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c]; }); }

/* opts: { items:[{label, icon?(svg string), fx?, fk?}], active, mode:'nav'|'radio',
           size?:'sm', compact?:'auto'|true|false, ariaLabel?, labelledBy?, onChange?(i,item) } */
export function createLiquidPill(opts: LiquidPillOptions): LiquidPillHandle {
  ensureGlobals();
  const items = opts.items;
  const mode = opts.mode || 'nav';
  let current = opts.active || 0;

  const nav: HTMLElement = document.createElement(mode === 'nav' ? 'nav' : 'div');
  nav.className = 'nimbus-nav' + (opts.className ? ' ' + opts.className : '');
  nav.dataset.tone = 'light';
  nav.dataset.gl = 'on';
  nav.dataset.refract = supportsRefraction() ? 'on' : 'off';
  if (opts.size) nav.dataset.size = opts.size;
  if (opts.compact != null) nav.dataset.compact = String(opts.compact);
  if (mode === 'radio') nav.setAttribute('role', 'radiogroup');
  if (opts.ariaLabel) nav.setAttribute('aria-label', opts.ariaLabel);
  if (opts.labelledBy) nav.setAttribute('aria-labelledby', opts.labelledBy);
  nav.innerHTML = '<span class="nimbus-glass" aria-hidden="true"></span><canvas class="nimbus-water" aria-hidden="true"></canvas><span class="nimbus-drop" aria-hidden="true"></span>';
  const canvas = nav.querySelector('canvas')!, drop = nav.querySelector<HTMLElement>('.nimbus-drop')!;

  const btns: HTMLButtonElement[] = [], icons: (HTMLElement | null)[] = [];
  items.forEach(function (it, i) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'nimbus-item';
    if (mode === 'radio') b.setAttribute('role', 'radio');
    if (it.fk) b.dataset.fk = it.fk;
    b.setAttribute('aria-label', it.label);
    b.innerHTML = (it.icon ? '<span class="nv-ico">' + it.icon + '</span>' : '') + '<span class="nimbus-label">' + escHTML(it.label) + '</span>';
    b.addEventListener('click', function () { select(i); });
    nav.appendChild(b);
    btns.push(b);
    icons.push(b.querySelector<HTMLElement>('.nv-ico'));
  });

  /* ---- state ---- */
  const s = {
    a: { x: 0, v: 0 } as Body, b: { x: 0, v: 0 } as Body, sy: { s: 1, v: 0 }, lead: 0, lagFrom: 0,
    sats: [] as Sat[], rips: [] as Rip[], t: { x: 0, cy: 0, q: 0, r: 21 }, q: 0,
    mouse: { x: 0, y: 0, s: 0, on: false }, moving: false, split: false, ready: false,
    w: 0, h: 0, visible: true, reduce: false, raf: 0, last: 0, time: 0, glc: null as GLCtx | null
  };
  s.reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  s.glc = initGL(canvas);
  if (!s.glc) nav.dataset.gl = 'off';
  canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); s.glc = null; nav.dataset.gl = 'off'; });

  function updateAria() {
    btns.forEach(function (b, i) {
      const on = i === current;
      if (mode === 'radio') { b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; }
      else if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
  }

  /* ---- drawing ---- */
  function draw() {
    const T = s.t;
    const sep = Math.abs(s.a.x - s.b.x);
    const thin = Math.min(sep / (2 * (s.q + T.r) || 1), 1);
    const r = T.r * (1 - 0.3 * thin);
    if (s.glc) {
      const g = s.glc.gl, u = s.glc.u;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      g.viewport(0, 0, g.drawingBufferWidth, g.drawingBufferHeight);
      g.uniform2f(u.uRes, s.w + PAD * 2, s.h + PAD * 2);
      g.uniform1f(u.uDpr, dpr);
      g.uniform1f(u.uTime, s.time);
      g.uniform4f(u.uPill, PAD, PAD, s.w, s.h);
      const blobs = new Float32Array(24);
      const sy = new Float32Array(6).fill(1);
      const head = s.lead === 0 ? s.a : s.b, tail = s.lead === 0 ? s.b : s.a;
      blobs.set([head.x, T.cy, s.q * (1 - 0.25 * thin), T.r * (1 - 0.12 * thin), tail.x, T.cy, s.q * (1 - 0.8 * thin), T.r * (1 - 0.5 * thin)], 0);
      sy[0] = sy[1] = s.sy.s;
      s.sats.slice(0, 4).forEach(function (d, i) { blobs.set([d.x, d.y, 0, d.r], 8 + i * 4); });
      g.uniform4fv(u.uBlob, blobs);
      g.uniform1fv(u.uSy, sy);
      const rips = new Float32Array(24);
      s.rips.slice(-6).forEach(function (p, i) { rips.set([p.x, p.y, p.age, p.amp], i * 4); });
      g.uniform4fv(u.uRip, rips);
      g.uniform3f(u.uMouse, s.mouse.x, s.mouse.y, s.mouse.s);
      g.uniform1f(u.uDark, 0);
      g.uniform1f(u.uAmb, s.reduce ? 0 : 1);
      g.clearColor(0, 0, 0, 0);
      g.clear(g.COLOR_BUFFER_BIT);
      g.drawArrays(g.TRIANGLES, 0, 3);
    } else {
      const left = Math.min(s.a.x, s.b.x) - s.q - r - PAD;
      const width = sep + 2 * (s.q + r);
      drop.style.width = width + 'px';
      drop.style.transform = 'translateX(' + left + 'px) scaleY(' + s.sy.s + ')';
    }
  }

  /* ---- physics ---- */
  function step(dt: number, now: number) {
    const T = s.t;
    s.time += dt;
    s.q += (T.q - s.q) * Math.min(1, dt * 12);
    const bodies = [s.a, s.b];
    let still = true;
    if (s.reduce) {
      s.a.x = s.b.x = T.x; s.a.v = s.b.v = 0; s.sy.s = 1; s.sats = [];
    } else {
      bodies.forEach(function (B, i) {
        const lead = i === s.lead;
        const k = lead ? 210 : 72, c = lead ? 25 : 13;
        const f = !lead && now < s.lagFrom ? 0.08 : 1;
        B.v += (k * (T.x - B.x) - c * B.v) * dt * f;
        B.x += B.v * dt;
        const lo = PAD + 6 + s.q + T.r - 3, hi = PAD + s.w - 6 - s.q - T.r + 3;
        if (B.x < lo || B.x > hi) {
          s.sy.v -= Math.min(Math.abs(B.v), 900) * 0.0016;
          B.x = Math.max(lo, Math.min(hi, B.x));
          B.v *= -0.25;
        }
        if (Math.abs(T.x - B.x) > 0.3 || Math.abs(B.v) > 3) still = false;
      });
      const L = bodies[s.lead];
      const syT = 1 - 0.2 * Math.min(Math.abs(L.v) / 1500, 1);
      s.sy.v += (280 * (syT - s.sy.s) - 9 * s.sy.v) * dt;
      s.sy.s += s.sy.v * dt;
      if (Math.abs(s.sy.s - 1) > 0.002 || Math.abs(s.sy.v) > 0.02) still = false;
      const sep = Math.abs(s.a.x - s.b.x);
      const r = T.r * (1 - 0.3 * Math.min(sep / (2 * (T.q + T.r) || 1), 1));
      if (!s.split && s.moving && sep - 2 * T.q - 2 * r > -6) {
        s.split = true;
        const lo = bodies[1 - s.lead], hi = bodies[s.lead];
        [0.3, 0.5, 0.72].forEach(function (t, j) {
          s.sats.push({
            x: lo.x + (hi.x - lo.x) * t + (Math.random() - 0.5) * 6,
            y: T.cy + (Math.random() - 0.5) * 10,
            vx: (lo.v + hi.v) * 0.45,
            vy: (Math.random() - 0.5) * 60,
            r: 5 + Math.random() * 3 - j * 0.5,
            k: 70 + Math.random() * 90
          });
        });
      }
      s.sats = s.sats.filter(function (d) {
        d.vx += (d.k * (T.x - d.x) - 9 * d.vx) * dt;
        d.vy += (90 * (T.cy - d.y) - 7 * d.vy) * dt;
        d.x += d.vx * dt; d.y += d.vy * dt;
        d.x = Math.max(PAD + 8 + d.r, Math.min(PAD + s.w - 8 - d.r, d.x));
        d.y = Math.max(T.cy - T.r + d.r, Math.min(T.cy + T.r - d.r, d.y));
        if (Math.abs(T.x - d.x) < T.q + T.r * 0.5) d.r -= dt * 26;
        return d.r > 0.6;
      });
      if (s.sats.length) still = false;
    }
    if (s.moving && still) {
      s.moving = false;
      if (s.split || !s.reduce) s.rips.push({ x: T.x, y: T.cy, age: 0, amp: s.split ? 1.2 : 0.7 });
    }
    s.rips.forEach(function (p) { p.age += dt; });
    s.rips = s.rips.filter(function (p) { return p.age < 2.4; });
    const target = s.mouse.on ? 1 : 0;
    s.mouse.s += (target - s.mouse.s) * Math.min(1, dt * 7);
  }

  function loop() {
    if (s.raf) return;
    s.last = performance.now();
    const tick = function (now: number) {
      const dt = Math.min((now - s.last) / 1000, 1 / 30);
      s.last = now;
      step(dt, now);
      draw();
      const busy = s.moving || s.rips.length || s.sats.length || s.mouse.s > 0.01;
      if (s.visible && (!s.reduce || busy)) s.raf = requestAnimationFrame(tick);
      else s.raf = 0;
    };
    s.raf = requestAnimationFrame(tick);
  }

  /* ---- layout ---- */
  function measure() {
    const el = btns[current];
    if (!el || !nav.isConnected) return;
    s.w = nav.offsetWidth;
    s.h = nav.offsetHeight;
    if (!s.w) return;
    const T = s.t;
    T.r = el.offsetHeight / 2;
    T.q = Math.max(0, el.offsetWidth / 2 - T.r);
    T.cy = PAD + el.offsetTop + el.offsetHeight / 2;
    const nx = PAD + el.offsetLeft + el.offsetWidth / 2;
    if (!s.ready) {
      s.a.x = s.b.x = nx; s.q = T.q; s.ready = true;
    } else if (Math.abs(nx - T.x) > 0.5) {
      s.lead = Math.abs(nx - s.a.x) <= Math.abs(nx - s.b.x) ? 0 : 1;
      s.lagFrom = performance.now() + 70;
      s.moving = true;
      s.split = false;
    }
    T.x = nx;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = s.w + PAD * 2, Hh = s.h + PAD * 2;
    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(Hh * dpr)) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(Hh * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = Hh + 'px';
    }
    loop();
  }

  let lastW = -1;
  const ro = new ResizeObserver(function () {
    const w = nav.offsetWidth;
    if (w !== lastW) { lastW = w; s.ready = false; measure(); }
  });
  ro.observe(nav);
  const io = new IntersectionObserver(function (entries) { s.visible = entries[0].isIntersecting; if (s.visible) loop(); });
  io.observe(nav);
  const onVis = function () { s.visible = document.visibilityState === 'visible'; if (s.visible) loop(); };
  document.addEventListener('visibilitychange', onVis);

  /* ---- interaction ---- */
  function local(cx: number, cy: number) { const r = nav.getBoundingClientRect(); return { x: cx - r.left + PAD, y: cy - r.top + PAD }; }
  function ripple(x: number, y: number, amp: number) { if (s.reduce) return; s.rips.push({ x: x, y: y, age: 0, amp: amp }); loop(); }
  function playFx(i: number, kind: string) {
    icons.forEach(function (ic) { if (ic) ic.removeAttribute('data-fx'); });
    const ic = icons[i];
    if (!ic || kind === 'none') return;
    void ic.offsetWidth;
    ic.setAttribute('data-fx', kind);
  }
  function select(i: number) {
    const it = items[i];
    playFx(i, it.fx || (it.icon ? 'pop' : 'none'));
    if (i !== current) {
      current = i;
      updateAria();
      measure();
      if (opts.onChange) opts.onChange(i, it);
    }
  }

  nav.addEventListener('keydown', function (e: KeyboardEvent) {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let n;
    if (e.key in keys) n = (current + keys[e.key] + items.length) % items.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = items.length - 1;
    else return;
    e.preventDefault();
    select(n);
    btns[n].focus();
  });
  nav.addEventListener('pointermove', function (e: PointerEvent) {
    if (e.pointerType !== 'mouse') return;
    const p = local(e.clientX, e.clientY);
    s.mouse.x = p.x; s.mouse.y = p.y; s.mouse.on = true;
    loop();
  });
  nav.addEventListener('pointerleave', function () { s.mouse.on = false; loop(); });
  nav.addEventListener('pointerdown', function (e: PointerEvent) { const p = local(e.clientX, e.clientY); ripple(p.x, p.y, 0.8); });

  updateAria();

  return {
    el: nav,
    get active() { return current; },
    setActive: function (i: number) { if (i === current || i < 0 || i >= items.length) return; current = i; updateAria(); measure(); },
    refresh: function () { s.ready = false; measure(); },
    destroy: function () {
      ro.disconnect(); io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      if (s.raf) cancelAnimationFrame(s.raf);
      s.raf = 0; s.visible = false;
      const lose = s.glc && s.glc.gl.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext();
      nav.remove();
    }
  };
}

