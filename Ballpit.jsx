import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Ballpit() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = matchMedia('(max-width: 640px)').matches;

    const PALETTE = ['#F5D5E0', '#6667AB', '#7B337E', '#420D4B'].map(c => new THREE.Color(c));
    const N = isMobile ? 40 : 120;
    const GRAVITY = 0.35, MAX_STEP = 0.10, BOUNCE = 0.85;
    const CURSOR_R = 0.7, CURSOR_PUSH = 0.6;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 1.5 : 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 14;
    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const key = new THREE.DirectionalLight(0xfff0f6, 1.4); key.position.set(4, 8, 10); scene.add(key);
    const rim = new THREE.PointLight(0x6667AB, 30, 40); rim.position.set(-6, -4, 6); scene.add(rim);

    let halfH, halfW;
    function resize() {
      renderer.setSize(innerWidth, innerHeight, false);
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      halfW = halfH * camera.aspect;
    }
    resize();

    const geo = new THREE.SphereGeometry(1, isMobile ? 16 : 24, isMobile ? 16 : 24);
    const mat = new THREE.MeshPhysicalMaterial({
      roughness: 0.42, metalness: 0.08,
      sheen: 0.25, sheenColor: new THREE.Color('#F5D5E0'),
      clearcoat: 0.35, clearcoatRoughness: 0.6,
    });
    const mesh = new THREE.InstancedMesh(geo, mat, N);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(mesh);

    const balls = [];
    const dummy = new THREE.Object3D();
    const gradColor = t => {
      const seg = Math.min(2, Math.floor(t * 3)), f = t * 3 - seg;
      return PALETTE[seg].clone().lerp(PALETTE[seg + 1], f);
    };
    for (let i = 0; i < N; i++) {
      const r = 0.22 + Math.random() * 0.16;
      balls.push({
        r,
        x: (Math.random() * 2 - 1) * (halfW - r),
        y: (Math.random() * 2 - 1) * (halfH - r),
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02,
        phase: Math.random() * Math.PI * 2,
      });
      mesh.setColorAt(i, gradColor(i / (N - 1)));
    }
    mesh.instanceColor.needsUpdate = true;

    const cursor = { x: 1e4, y: 1e4 };
    const onPointerMove = e => {
      cursor.x = (e.clientX / innerWidth * 2 - 1) * halfW;
      cursor.y = -(e.clientY / innerHeight * 2 - 1) * halfH;
    };
    const onPointerLeave = () => { cursor.x = 1e4; cursor.y = 1e4; };

    function commit() {
      balls.forEach((b, i) => {
        dummy.position.set(b.x, b.y, 0);
        dummy.scale.setScalar(b.r);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    }

    let raf = 0;
    const onResizeStatic = () => { resize(); commit(); };

    if (reduceMotion) {
      /* static scatter, no physics loop */
      balls.forEach(b => { b.y = -halfH + b.r + Math.random() * halfH * 0.8; });
      commit();
      addEventListener('resize', onResizeStatic);
      return () => {
        removeEventListener('resize', onResizeStatic);
        geo.dispose(); mat.dispose(); renderer.dispose();
      };
    }

    addEventListener('resize', resize);
    addEventListener('pointermove', onPointerMove, { passive: true });
    addEventListener('pointerleave', onPointerLeave);

    let last = performance.now(), t = 0;
    function step(now) {
      raf = requestAnimationFrame(step);
      if (document.hidden) { last = now; return; }
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now; t += dt;
      for (const b of balls) {
        b.vy -= GRAVITY * dt;
        b.vx += Math.sin(t * 0.6 + b.phase) * 0.012 * dt;
        const dx = b.x - cursor.x, dy = b.y - cursor.y;
        const d = Math.hypot(dx, dy), min = CURSOR_R + b.r;
        if (d < min && d > 1e-4) {
          const f = (min - d) / min * CURSOR_PUSH;
          b.vx += dx / d * f * 6 * dt;
          b.vy += dy / d * f * 6 * dt;
        }
        const sp = Math.hypot(b.vx, b.vy) * dt;
        if (sp > MAX_STEP) { const k = MAX_STEP / sp; b.vx *= k; b.vy *= k; }
        b.x += b.vx * dt; b.y += b.vy * dt;
        if (b.x < -halfW + b.r) { b.x = -halfW + b.r; b.vx = Math.abs(b.vx) * BOUNCE; }
        if (b.x >  halfW - b.r) { b.x =  halfW - b.r; b.vx = -Math.abs(b.vx) * BOUNCE; }
        if (b.y < -halfH + b.r) { b.y = -halfH + b.r; b.vy = Math.abs(b.vy) * BOUNCE; b.vx *= 0.98; }
        if (b.y >  halfH - b.r) { b.y =  halfH - b.r; b.vy = -Math.abs(b.vy) * BOUNCE; }
      }
      /* sphere-sphere collisions: positional separation + soft impulse */
      for (let i = 0; i < N; i++) {
        const a = balls[i];
        for (let j = i + 1; j < N; j++) {
          const c = balls[j];
          const dx = c.x - a.x, dy = c.y - a.y;
          const min = a.r + c.r, d2 = dx * dx + dy * dy;
          if (d2 < min * min && d2 > 1e-6) {
            const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, ov = (min - d) / 2;
            a.x -= nx * ov; a.y -= ny * ov;
            c.x += nx * ov; c.y += ny * ov;
            const rvx = c.vx - a.vx, rvy = c.vy - a.vy;
            const vn = rvx * nx + rvy * ny;
            if (vn < 0) {
              const imp = -vn * 0.5 * BOUNCE;
              a.vx -= nx * imp; a.vy -= ny * imp;
              c.vx += nx * imp; c.vy += ny * imp;
            }
          }
        }
      }
      commit();
    }
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      removeEventListener('pointermove', onPointerMove);
      removeEventListener('pointerleave', onPointerLeave);
      geo.dispose(); mat.dispose(); renderer.dispose();
    };
  }, []);

  return <canvas id="ballpit" ref={canvasRef} aria-hidden="true" />;
}
