'use client';

import {useEffect, useRef, useState} from 'react';
import type * as T from 'three';
import s from './Man3D.module.css';

export type Ev = {id: number; kind: 'eat' | 'drop'};
type Live = {fed: number; chew: boolean; burp: boolean; events: Ev[]};

// Belly size per number of cookies eaten (x, y, z), and how the arms sit (forward swing, inward swing).
const BELLY = [[0.8, 0.92, 0.78], [1, 1, 1], [1.2, 1.07, 1.2], [1.42, 1.14, 1.42]];
const ARMS = [[0.1, 0.3], [0, 0.12], [-0.45, -0.22], [-0.7, -0.3]];

/**
 * A clay-style 3D man drawn with three.js: spheres and capsules, soft lights, a squishy belly that grows with every cookie he eats.
 * The library is loaded only when the popup opens. If WebGL is unavailable a plain cookie shows instead.
 */
export function Man3D({fed, chew, burp, events}: Live) {
  const box = useRef<HTMLDivElement>(null);
  const live = useRef<Live>({fed, chew, burp, events});
  const [failed, setFailed] = useState(false);
  useEffect(() => { live.current = {fed, chew, burp, events}; }, [fed, chew, burp, events]);

  useEffect(() => {
    const host = box.current;
    if (!host) return;
    let stop = () => {};
    let dead = false;
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

    import('three').then(THREE => {
      if (dead) return;
      let renderer: T.WebGLRenderer;
      try { renderer = new THREE.WebGLRenderer({antialias: true, alpha: true}); } catch { setFailed(true); return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
      host.appendChild(renderer.domElement);
      renderer.domElement.className = s.canvas;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(28, 2, 0.1, 50);
      camera.position.set(0, 2.0, 8.4);
      camera.lookAt(0, 1.8, 0);
      scene.add(new THREE.HemisphereLight(0xffffff, 0xb6cdee, 1.7));
      const key = new THREE.DirectionalLight(0xffffff, 2.6); key.position.set(3, 6, 5); scene.add(key);
      const rim = new THREE.DirectionalLight(0xbcd7ff, 1.1); rim.position.set(-5, 3, -2); scene.add(rim);

      const disposables: {dispose(): void}[] = [];
      const mat = (color: number, rough = 0.62) => { const m = new THREE.MeshStandardMaterial({color, roughness: rough, metalness: 0}); disposables.push(m); return m; };
      const geo = <G extends T.BufferGeometry>(g: G) => { disposables.push(g); return g; };
      const skin = mat(0xe3a77c), shirt = mat(0x2f6db5, 0.55), pants = mat(0x17335a), shoe = mat(0x1c1f33, 0.5), hair = mat(0x2b1d14, 0.8);
      const white = mat(0xffffff, 0.3), dark = mat(0x1a1410, 0.4), blush = mat(0xe86f6f, 0.9), cookieM = mat(0xd9a05b, 0.85), chipM = mat(0x5b3a1e, 0.8), mouthM = mat(0x7d2a2a, 0.5), tongueM = mat(0xe8697d, 0.6), tearM = mat(0x7db1ee, 0.2), button = mat(0xf5efa8, 0.5);
      const sphere = (r: number, m: T.Material, ws = 32, hs = 20) => new THREE.Mesh(geo(new THREE.SphereGeometry(r, ws, hs)), m);
      const capsule = (r: number, len: number, m: T.Material) => new THREE.Mesh(geo(new THREE.CapsuleGeometry(r, len, 8, 20)), m);

      const man = new THREE.Group(); scene.add(man);

      // Soft blob shadow on the floor
      const c = document.createElement('canvas'); c.width = c.height = 128;
      const g = c.getContext('2d');
      if (g) { const gr = g.createRadialGradient(64, 64, 4, 64, 64, 62); gr.addColorStop(0, 'rgba(11,26,46,0.45)'); gr.addColorStop(1, 'rgba(11,26,46,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }
      const shadowTex = new THREE.CanvasTexture(c); disposables.push(shadowTex);
      const shadow = new THREE.Mesh(geo(new THREE.PlaneGeometry(1, 1)), new THREE.MeshBasicMaterial({map: shadowTex, transparent: true, depthWrite: false}));
      disposables.push(shadow.material as T.Material);
      shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.02; scene.add(shadow);

      // Legs and shoes
      for (const sx of [-0.34, 0.34]) {
        const leg = capsule(0.23, 0.6, pants); leg.position.set(sx, 0.7, 0); man.add(leg);
        const sh = sphere(0.3, shoe); sh.scale.set(1, 0.55, 1.55); sh.position.set(sx, 0.22, 0.14); man.add(sh);
      }

      // Torso (the belly)
      const torso = new THREE.Group(); torso.position.y = 1.55; man.add(torso);
      const body = sphere(1, shirt, 48, 32); body.scale.set(0.82, 0.88, 0.74); torso.add(body);
      const bellyBtn = sphere(0.045, tongueM); bellyBtn.visible = false; torso.add(bellyBtn);
      const buttons = [0.35, 0.05, -0.25].map(y => { const b = sphere(0.075, button); b.position.set(0, y, 0.76); b.visible = false; torso.add(b); return b; });

      // Arms
      const arms = [-1, 1].map(side => {
        const pivot = new THREE.Group(); pivot.position.set(side * 0.9, 2.12, 0); man.add(pivot);
        const arm = capsule(0.19, 0.5, shirt); arm.position.y = -0.46; pivot.add(arm);
        const hand = sphere(0.2, skin); hand.position.y = -0.92; pivot.add(hand);
        return {side, pivot};
      });

      // Head
      const head = new THREE.Group(); head.position.y = 2.95; man.add(head);
      const skull = sphere(0.66, skin, 40, 28); skull.scale.set(1, 0.97, 0.96); head.add(skull);
      const cap = new THREE.Mesh(geo(new THREE.SphereGeometry(0.685, 40, 24, 0, Math.PI * 2, 0, 1.2)), hair); cap.rotation.x = -0.3; cap.position.y = 0.02; head.add(cap);
      for (const sx of [-1, 1]) { const ear = sphere(0.13, skin); ear.scale.set(0.6, 1, 0.8); ear.position.set(sx * 0.66, -0.02, 0); head.add(ear); }
      const nose = sphere(0.1, skin); nose.position.set(0, -0.08, 0.65); head.add(nose);
      const cheeks = [-1, 1].map(sx => { const ch = sphere(0.12, blush); ch.scale.set(1, 0.6, 0.35); ch.position.set(sx * 0.42, -0.2, 0.55); head.add(ch); return ch; });
      const eyes = new THREE.Group(); head.add(eyes);
      for (const sx of [-1, 1]) {
        const w = sphere(0.14, white); w.scale.set(1, 1.25, 0.55); w.position.set(sx * 0.25, 0.08, 0.56); eyes.add(w);
        const p = sphere(0.072, dark); p.position.set(sx * 0.25 + sx * 0.01, 0.07, 0.62); eyes.add(p);
        const sh = sphere(0.022, white, 12, 8); sh.position.set(sx * 0.25 + sx * 0.03, 0.12, 0.675); eyes.add(sh);
      }
      const brows = [-1, 1].map(sx => { const b = capsule(0.028, 0.2, hair); b.rotation.z = Math.PI / 2; b.position.set(sx * 0.25, 0.34, 0.58); head.add(b); return {side: sx, b}; });
      const smile = new THREE.Mesh(geo(new THREE.TorusGeometry(0.17, 0.03, 10, 28, Math.PI)), mouthM); smile.rotation.z = Math.PI; smile.position.set(0, -0.2, 0.62); head.add(smile);
      const frown = new THREE.Mesh(geo(new THREE.TorusGeometry(0.15, 0.03, 10, 28, Math.PI)), mouthM); frown.position.set(0, -0.38, 0.6); head.add(frown);
      const open = new THREE.Group(); open.position.set(0, -0.3, 0.6); head.add(open);
      const hole = sphere(0.17, mouthM); hole.scale.set(1, 0.85, 0.5); open.add(hole);
      const tongue = sphere(0.09, tongueM); tongue.scale.set(1.1, 0.5, 0.5); tongue.position.set(0, -0.08, 0.03); open.add(tongue);
      const tear = sphere(0.04, tearM, 12, 8); tear.position.set(-0.3, -0.02, 0.62); head.add(tear);

      // Cookies in flight
      type Flight = {mesh: T.Group; kind: Ev['kind']; t: number; id: number};
      const flights: Flight[] = [];
      const seen = {id: 0};
      const makeCookie = () => {
        const grp = new THREE.Group();
        const dough = sphere(0.3, cookieM); dough.scale.set(1, 0.4, 1); grp.add(dough);
        [[0.1, 0.1, 0.08], [-0.12, 0.09, 0.05], [0.02, 0.12, -0.14], [-0.05, 0.1, 0.17], [0.16, 0.08, -0.08]].forEach(([x, y, z]) => { const ch = sphere(0.05, chipM, 12, 8); ch.position.set(x, y, z); grp.add(ch); });
        scene.add(grp); return grp;
      };
      const bez = (a: T.Vector3, b: T.Vector3, p: T.Vector3, t: number, out: T.Vector3) => out.set((1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * b.x + t * t * p.x, (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * b.y + t * t * p.y, (1 - t) * (1 - t) * a.z + 2 * (1 - t) * t * b.z + t * t * p.z);
      const P0 = new THREE.Vector3(2.6, 4.2, 1), P1 = new THREE.Vector3(1.3, 5.2, 1.4), P2 = new THREE.Vector3(0, 2.62, 0.7);

      const size = () => { const w = host.clientWidth || 300, h = host.clientHeight || 150; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
      size();
      const ro = new ResizeObserver(size); ro.observe(host);

      // Smoothed values that chase their targets every frame
      const cur = {bx: 1, by: 1, bz: 1, ax: [0, 0], az: [0, 0], gulp: 0, shake: 0, burp: 0};
      const tmp = new THREE.Vector3();
      let last = performance.now(), raf = 0, running = true, tTotal = 0;

      const frame = (now: number) => {
        raf = 0;
        if (!running) return;
        const dt = Math.min(0.05, (now - last) / 1000); last = now; tTotal += dt;
        const L = live.current;
        const k = calm ? 1 : 1 - Math.exp(-7 * dt);

        for (const e of L.events) if (e.id > seen.id) { seen.id = e.id; if (!calm) flights.push({mesh: makeCookie(), kind: e.kind, t: 0, id: e.id}); else cur.gulp = e.kind === 'eat' ? 1 : 0; }

        const tb = BELLY[L.fed];
        cur.bx += (tb[0] - cur.bx) * k; cur.by += (tb[1] - cur.by) * k; cur.bz += (tb[2] - cur.bz) * k;
        const pulse = 1 + 0.09 * Math.sin(Math.min(1, cur.gulp) * Math.PI) + 0.1 * Math.sin(Math.min(1, cur.burp) * Math.PI);
        cur.gulp = Math.max(0, cur.gulp - dt * 2.2);
        if (L.burp) cur.burp = Math.min(1, cur.burp + dt * 1.6); else cur.burp = 0;
        const breathe = calm ? 1 : 1 + 0.014 * Math.sin(tTotal * 2.2);
        torso.scale.set(cur.bx * pulse, cur.by * pulse * breathe, cur.bz * pulse);
        bellyBtn.visible = L.fed >= 2; bellyBtn.position.set(0, -0.12, 0.74 * 1);
        buttons.forEach(b => { b.visible = L.fed >= 3; });
        const spread = 0.9 + (cur.bx - 1) * 1.0;
        arms.forEach((a, i) => {
          const tg = ARMS[L.fed];
          cur.ax[i] += (tg[0] - cur.ax[i]) * k; cur.az[i] += (a.side * tg[1] - cur.az[i]) * k;
          a.pivot.position.x = a.side * spread; a.pivot.rotation.x = cur.ax[i]; a.pivot.rotation.z = cur.az[i];
        });
        const wave = calm ? 0 : Math.sin(tTotal * 4) * 0.12 * (L.fed === 2 ? 1 : 0);
        arms[1].pivot.rotation.z += wave;

        // Face
        const sad = L.fed === 0, happy = L.fed >= 2;
        frown.visible = sad && !L.chew; smile.visible = !sad && !L.chew && !L.burp; open.visible = L.chew || L.burp;
        smile.scale.setScalar(happy ? 1.25 : 1);
        const chewing = L.chew ? 0.55 + 0.45 * Math.abs(Math.sin(tTotal * 14)) : L.burp ? 1.1 : 1;
        open.scale.set(1, chewing, 1);
        tear.visible = sad;
        if (sad) { const f = (tTotal * 0.6) % 1; tear.position.set(-0.3, -0.02 - f * 0.35, 0.62); tear.scale.setScalar(1 - f * 0.6); }
        brows.forEach(({side, b}) => { b.rotation.z = Math.PI / 2 + (sad ? -side * 0.45 : 0); b.position.y = happy ? 0.38 : 0.34; });
        cheeks.forEach(ch => { ch.visible = L.fed >= 1; });
        const blink = (tTotal % 3.6) > 3.48 ? 0.1 : 1;
        eyes.scale.y += (blink - eyes.scale.y) * 0.6;

        // Idle sway so it reads as 3D, and a head shake when a cookie is refused
        man.rotation.y = calm ? 0 : Math.sin(tTotal * 0.9) * 0.4;
        man.position.y = calm ? 0 : Math.sin(tTotal * 2.2) * 0.015;
        cur.shake = Math.max(0, cur.shake - dt);
        head.rotation.y = cur.shake > 0 ? Math.sin(cur.shake * 28) * 0.45 * Math.min(1, cur.shake * 2) : 0;
        head.rotation.z = sad ? 0.05 : 0;
        const sh = 2.3 + (cur.bx - 1) * 1.6; shadow.scale.set(sh, sh * 0.8, 1);

        // Cookies
        for (let i = flights.length - 1; i >= 0; i--) {
          const f = flights[i];
          if (f.kind === 'eat') {
            f.t += dt / 0.5; const t = Math.min(1, f.t);
            bez(P0, P1, P2, t * t * (3 - 2 * t), f.mesh.position);
            f.mesh.rotation.set(t * 9, t * 6, 0); f.mesh.scale.setScalar(t < 0.85 ? 1 : Math.max(0.01, 1 - (t - 0.85) / 0.15));
            if (f.t >= 1) { cur.gulp = 1; scene.remove(f.mesh); flights.splice(i, 1); }
          } else {
            if (f.t === 0) cur.shake = 0.7;
            f.t += dt; const t = f.t;
            tmp.set(-1.4 * t * 1.6, 3.9 + 1.2 * t - 9 * t * t * 0.5, 1 + 0.9 * t);
            f.mesh.position.copy(tmp); f.mesh.rotation.set(t * 5, t * 3, t * 6);
            if (tmp.y < -0.4 || t > 1.4) { scene.remove(f.mesh); flights.splice(i, 1); }
          }
        }
        renderer.render(scene, camera);
        raf = requestAnimationFrame(frame);
      };
      const start = () => { if (!running) { running = true; last = performance.now(); } if (!raf) raf = requestAnimationFrame(frame); };
      const pause = () => { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } };
      const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : pause()));
      io.observe(host);
      const vis = () => (document.hidden ? pause() : start());
      document.addEventListener('visibilitychange', vis);
      start();

      stop = () => {
        pause(); io.disconnect(); ro.disconnect(); document.removeEventListener('visibilitychange', vis);
        flights.forEach(f => scene.remove(f.mesh));
        disposables.forEach(d => d.dispose());
        renderer.dispose(); renderer.domElement.remove();
      };
    }).catch(() => setFailed(true));

    return () => { dead = true; stop(); };
  }, []);

  return <div className={s.box} ref={box} role="img" aria-label={`Cookie mascot with ${fed} of 3 cookies eaten`}>{failed && <span className={s.fallback} style={{transform: `scale(${1 + fed * 0.25})`}}>🍪</span>}</div>;
}
