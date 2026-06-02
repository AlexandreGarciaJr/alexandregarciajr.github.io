// ═══════════════════════════════════════════════════════════════════════════
//  HERO THREE.JS — Atoms + Cursor Trail + Atom Hover Interaction
// ═══════════════════════════════════════════════════════════════════════════
(function () {
  const canvas = document.getElementById('threeCanvas');
  const hero = document.getElementById('hero');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 7;

  function resize() {
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Palette ────────────────────────────────────────────────────────────
  const C = {
    nucleus: 0x93c5fd,
    orbitLine: 0x2563a8,
    electron: 0x60a5fa,
    electronHi: 0xe2e8f0,
    trail1: 0x22d3ee,   // cyan — main trail
    trail2: 0x3b82f6,   // blue — secondary trail
    burst: 0x60a5fa,
    dust: 0x1e3a5f,
  };

  // (trail removed — atoms react to cursor directly)

  // ══════════════════════════════════════════════════════════════════════
  //  ATOMS
  // ══════════════════════════════════════════════════════════════════════
  function makeOrbitRing(rx, ry, tilt, az, segments = 120) {
    const pts = [];
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * rx, Math.sin(a) * ry, 0));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color: C.orbitLine, transparent: true, opacity: 0.35 });
    const ring = new THREE.LineLoop(geo, mat);
    ring.rotation.x = tilt;
    ring.rotation.y = az;
    return ring;
  }

  function makeSphere(radius, color, opacity = 1) {
    const geo = new THREE.SphereGeometry(radius, 14, 14);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity });
    return new THREE.Mesh(geo, mat);
  }

  // Screen-space proximity hover (no raycasting bugs)
  let hoveredAtom = null;
  let mouseScreenX = -9999, mouseScreenY = -9999;

  function toScreenPx(worldPos) {
    const v = worldPos.clone().project(camera);
    return {
      x: (v.x + 1) / 2 * canvas.clientWidth,
      y: (-v.y + 1) / 2 * canvas.clientHeight,
    };
  }

  // Global hook — buttons and scroll can fire atom effects
  window.__triggerAtomEffect = function () {
    atoms.forEach(atom => {
      triggerBurst(atom.position.clone());
      atom.userData.hoverT = 1;
    });
  };

  // Burst particles pool
  const BURST_COUNT = 10;
  function makeBurstParticles() {
    const group = new THREE.Group();
    const particles = [];
    for (let i = 0; i < BURST_COUNT; i++) {
      const m = makeSphere(0.04, C.burst, 0.9);
      m.visible = false;
      group.add(m);
      particles.push({ mesh: m, vel: new THREE.Vector3(), life: 0, maxLife: 0 });
    }
    scene.add(group);
    return particles;
  }
  const burstPool = makeBurstParticles();

  function triggerBurst(pos) {
    burstPool.forEach((p, i) => {
      p.mesh.position.copy(pos);
      p.mesh.visible = true;
      p.mesh.material.opacity = 0.9;
      p.life = 1;
      p.maxLife = 0.6 + Math.random() * 0.4;
      const angle = (i / BURST_COUNT) * Math.PI * 2 + Math.random() * 0.5;
      const speed = 0.04 + Math.random() * 0.04;
      p.vel.set(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        (Math.random() - 0.5) * speed
      );
    });
  }

  function updateBurst(dt) {
    burstPool.forEach(p => {
      if (!p.mesh.visible) return;
      p.life -= dt / p.maxLife;
      if (p.life <= 0) { p.mesh.visible = false; return; }
      p.mesh.position.add(p.vel);
      p.vel.multiplyScalar(0.94);
      p.mesh.material.opacity = p.life * 0.9;
      const s = 0.5 + p.life * 0.5;
      p.mesh.scale.setScalar(s);
    });
  }

  function buildAtom(config) {
    const root = new THREE.Group();
    root.position.set(...config.pos);
    root.userData = {
      basePos: [...config.pos],
      scrollTarget: config.scrollTarget ? [...config.scrollTarget] : [...config.pos],
      driftPhase: config.phase,
      scrollRot: config.scrollRot || new THREE.Vector3(0.4, 0.6, 0.1),
      hovered: false,
      hoverT: 0,       // 0→1 transition
      burstDone: false,
    };

    const nuc = makeSphere(config.nucR, C.nucleus);
    const halo = makeSphere(config.nucR * 2.4, 0x22d3ee, 0.06);
    // hover glow ring (starts invisible)
    const glowRingGeo = new THREE.SphereGeometry(config.nucR * 4, 16, 16);
    const glowRingMat = new THREE.MeshBasicMaterial({
      color: C.trail1, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false, wireframe: true,
    });
    const glowRing = new THREE.Mesh(glowRingGeo, glowRingMat);
    root.add(nuc, halo, glowRing);
    root.userData.nuc = nuc;
    root.userData.halo = halo;
    root.userData.glowRing = glowRing;
    root.userData.glowMat = glowRingMat;



    config.shells.forEach(shell => {
      const shell3D = new THREE.Group();
      shell3D.rotation.x = shell.tilt;
      shell3D.rotation.y = shell.az;
      root.add(shell3D);

      const ring = makeOrbitRing(shell.rx, shell.ry, 0, 0);
      shell3D.add(ring);
      shell3D.userData = { ringMat: ring.material };

      shell.electrons.forEach(e => {
        const el = makeSphere(config.elR, e.hi ? C.electronHi : C.electron);
        el.userData = { speed: e.speed, baseSpeed: e.speed, angle: e.startAngle, rx: shell.rx, ry: shell.ry };
        shell3D.add(el);
        if (!shell3D.electrons) shell3D.electrons = [];
        shell3D.electrons.push(el);
      });

      if (!root.shells) root.shells = [];
      root.shells.push(shell3D);
    });

    scene.add(root);
    return root;
  }

  const atoms = [
    buildAtom({
      pos: [3.8, 2, -1.0], scrollTarget: [6.5, 2.8, -3.0], phase: 0.0,
      nucR: 0.13, elR: 0.055, scrollRot: new THREE.Vector3(0.5, 0.8, 0.2),
      shells: [
        { rx: 1.1, ry: 1.1, tilt: 0.3, az: 0.0, electrons: [{ speed: 0.9, startAngle: 0, hi: true }] },
        { rx: 1.4, ry: 0.7, tilt: 1.1, az: 0.6, electrons: [{ speed: -0.6, startAngle: 1.0, hi: false }] },
        {
          rx: 1.5, ry: 1.0, tilt: 0.6, az: 2.1, electrons: [{ speed: 0.45, startAngle: 2.5, hi: false },
          { speed: 0.45, startAngle: 5.2, hi: false }]
        },
      ],
    }),
    buildAtom({
      pos: [-3.6, 1.0, -2.0], scrollTarget: [-6.0, -2.5, -4.0], phase: 1.8,
      nucR: 0.10, elR: 0.045, scrollRot: new THREE.Vector3(-0.4, 0.5, 0.3),
      shells: [
        { rx: 0.9, ry: 0.9, tilt: 0.7, az: 1.2, electrons: [{ speed: 1.1, startAngle: 0, hi: true }] },
        { rx: 1.2, ry: 0.6, tilt: 1.4, az: 0.3, electrons: [{ speed: -0.7, startAngle: 3.0, hi: false }] },
      ],
    }),
    buildAtom({
      pos: [1.8, -2.5, -2.5], scrollTarget: [-1.0, -5.0, -2.0], phase: 3.2,
      nucR: 0.08, elR: 0.038, scrollRot: new THREE.Vector3(0.3, -0.5, 0.6),
      shells: [
        { rx: 0.7, ry: 0.7, tilt: 0.2, az: 0.8, electrons: [{ speed: 1.3, startAngle: 0, hi: false }] },
        { rx: 1.0, ry: 0.5, tilt: 1.0, az: 2.4, electrons: [{ speed: -0.9, startAngle: 1.6, hi: true }] },
      ],
    }),
    buildAtom({
      pos: [-1.2, 2.4, -3.0], scrollTarget: [3.5, 4.5, -5.0], phase: 5.0,
      nucR: 0.07, elR: 0.034, scrollRot: new THREE.Vector3(0.6, 0.3, -0.4),
      shells: [
        { rx: 0.75, ry: 0.75, tilt: 0.5, az: 1.5, electrons: [{ speed: 1.5, startAngle: 0, hi: false }] },
      ],
    }),
    buildAtom({
      pos: [0.4, -0.8, -4.0], scrollTarget: [-4.0, 1.5, -6.0], phase: 2.4,
      nucR: 0.06, elR: 0.028, scrollRot: new THREE.Vector3(-0.3, 0.7, 0.2),
      shells: [
        { rx: 0.6, ry: 0.6, tilt: 0.9, az: 0.4, electrons: [{ speed: 2.0, startAngle: 0, hi: false }] },
        { rx: 0.85, ry: 0.45, tilt: 1.5, az: 1.8, electrons: [{ speed: -1.4, startAngle: 2.0, hi: false }] },
      ],
    }),

    // Átomo superior central (circulo de cima)
    buildAtom({
      pos: [1.2, 1, -1.5], scrollTarget: [2.5, 5.0, -4.0], phase: 4.1,
      nucR: 0.09, elR: 0.040, scrollRot: new THREE.Vector3(0.3, 0.6, -0.3),
      shells: [
        { rx: 0.8, ry: 0.8, tilt: 0.4, az: 1.0, electrons: [{ speed: 1.2, startAngle: 0, hi: true }] },
        { rx: 1.1, ry: 0.6, tilt: 1.2, az: 2.8, electrons: [{ speed: -0.8, startAngle: 2.0, hi: false }] },
      ],
    }),

    // Átomo inferior esquerdo (circulo de baixo)
    buildAtom({
      pos: [-6, -3, -1.8], scrollTarget: [-5.5, -4.0, -4.5], phase: 6.3,
      nucR: 0.11, elR: 0.048, scrollRot: new THREE.Vector3(-0.5, 0.4, 0.5),
      shells: [
        { rx: 1.0, ry: 1.0, tilt: 0.6, az: 0.5, electrons: [{ speed: -1.0, startAngle: 1.5, hi: false }] },
        { rx: 1.3, ry: 0.7, tilt: 1.3, az: 1.9, electrons: [{ speed: 0.7, startAngle: 3.5, hi: true }] },
      ],
    }),

  ];

  // All hit meshes for raycasting

  // ── Dust ──────────────────────────────────────────────────────────────
  const dustCount = 10000;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 16;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({
    size: 0.018, color: C.dust, transparent: true, opacity: 0.7, sizeAttenuation: true,
  })));

  // ── Mouse parallax ──────────────────────────────────────────────────
  let targetX = 0, targetY = 0, camX = 0, camY = 0;
  document.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseScreenX = e.clientX - rect.left;
    mouseScreenY = e.clientY - rect.top;
    targetX = (e.clientX / window.innerWidth - 0.5) * 1.6;
    targetY = (e.clientY / window.innerHeight - 0.5) * 1.2;
  });

  // ── Scroll ───────────────────────────────────────────────────────────
  let scrollProgress = 0;
  let lastScrollBurst = 0;
  window.addEventListener('scroll', () => {
    scrollProgress = Math.min(window.scrollY / hero.clientHeight, 1);
    // Trigger atom burst on scroll (throttled)
    if (scrollProgress < 0.9 && Date.now() - lastScrollBurst > 400) {
      lastScrollBurst = Date.now();
      window.__triggerAtomEffect && window.__triggerAtomEffect();
    }
  });

  const clock = new THREE.Clock();
  let lastT = 0;

  // ── Animate ──────────────────────────────────────────────────────────
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const dt = t - lastT;
    lastT = t;
    const sp = scrollProgress;

    // camera parallax
    camX += (targetX - camX) * 0.04;
    camY += (-targetY - camY) * 0.04;
    camera.position.x = camX;
    camera.position.y = camY;
    camera.lookAt(scene.position);

    // ── Screen-space proximity hover ──
    let newHovered = null;
    const HOVER_RADIUS = 80; // px
    atoms.forEach(atom => {
      const sp2d = toScreenPx(atom.position);
      const dx = mouseScreenX - sp2d.x;
      const dy = mouseScreenY - sp2d.y;
      if (Math.sqrt(dx * dx + dy * dy) < HOVER_RADIUS) newHovered = atom;
    });
    if (newHovered !== hoveredAtom) {
      if (newHovered) triggerBurst(newHovered.position.clone());
      hoveredAtom = newHovered;
    }

    // ── Atoms ──
    const spinBoost = 1 + sp * 6;

    atoms.forEach(atom => {
      const { basePos, scrollTarget, driftPhase, scrollRot,
        nuc, halo, glowRing, glowMat } = atom.userData;

      // lerp toward scroll target
      const lx = basePos[0] + (scrollTarget[0] - basePos[0]) * sp;
      const ly = basePos[1] + (scrollTarget[1] - basePos[1]) * sp;
      const lz = basePos[2] + (scrollTarget[2] - basePos[2]) * sp;
      atom.position.x += (lx + Math.cos(t * 0.18 + driftPhase) * 0.08 - atom.position.x) * 0.06;
      atom.position.y += (ly + Math.sin(t * 0.28 + driftPhase) * 0.18 - atom.position.y) * 0.06;
      atom.position.z += (lz - atom.position.z) * 0.06;

      atom.rotation.x += 0.002 * spinBoost * scrollRot.x;
      atom.rotation.y += 0.002 * spinBoost * scrollRot.y;
      atom.rotation.z += 0.001 * spinBoost * scrollRot.z;

      // hover state
      const isHovered = atom === hoveredAtom;
      atom.userData.hoverT = THREE.MathUtils.lerp(
        atom.userData.hoverT, isHovered ? 1 : 0, 0.08
      );
      const ht = atom.userData.hoverT;

      // nucleus pulse on hover
      const nucScale = 1 + ht * (0.5 + Math.sin(t * 10) * 0.2);
      nuc.scale.setScalar(nucScale);
      halo.scale.setScalar(1 + ht * 1.2);
      halo.material.opacity = 0.06 + ht * 0.18;

      // glow ring on hover
      glowRing.rotation.y = t * 2;
      glowRing.rotation.x = t * 1.3;
      glowMat.opacity = ht * 0.25;

      // electrons
      if (atom.shells) {
        atom.shells.forEach(shell => {
          // orbit ring brightens
          if (shell.userData && shell.userData.ringMat) {
            shell.userData.ringMat.opacity = 0.35 + ht * 0.5;
            shell.userData.ringMat.color.setHex(ht > 0.5 ? C.trail1 : C.orbitLine);
          }
          if (shell.electrons) {
            shell.electrons.forEach(el => {
              // speed up on hover
              const speedMul = 1 + ht * 5;
              el.userData.angle += el.userData.baseSpeed * 0.014 * spinBoost * speedMul;
              const a = el.userData.angle;
              el.position.x = Math.cos(a) * el.userData.rx;
              el.position.y = Math.sin(a) * el.userData.ry;
              el.position.z = 0;
            });
          }
        });
      }
    });

    // ── Burst particles ──
    updateBurst(dt);

    canvas.style.opacity = Math.max(0, 1 - sp * 2.2);
    renderer.render(scene, camera);
  }

  animate();
  setTimeout(() => canvas.classList.add('ready'), 400);
})();

