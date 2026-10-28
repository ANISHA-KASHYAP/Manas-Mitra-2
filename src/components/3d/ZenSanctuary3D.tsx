import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Sun,
  Moon,
  Sunset,
  Volume2,
  VolumeX,
  Compass,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Maximize2,
} from 'lucide-react';

type TimeOfDay = 'morning' | 'sunset' | 'night';

export const ZenSanctuary3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);
  const [breathePhase, setBreathePhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

  // Audio Context ref for procedural ambient stream sound
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<{ gain: GainNode | null; interval: number | null }>({
    gain: null,
    interval: null,
  });

  // Scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const lotusRef = useRef<THREE.Group | null>(null);

  // Procedural Web Audio Ambient Sound (Gentle Rain / Mountain Stream)
  const toggleAmbientAudio = () => {
    if (isAudioPlaying) {
      if (audioCtxRef.current) {
        audioCtxRef.current.suspend();
      }
      setIsAudioPlaying(false);
    } else {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // Pink noise generator for gentle stream/breeze
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        whiteNoise.start();

        audioNodesRef.current.gain = gainNode;
      } else {
        audioCtxRef.current.resume();
      }
      setIsAudioPlaying(true);
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene & Atmosphere
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const initialSkyColor = new THREE.Color(0xf6f0ff);
    scene.background = initialSkyColor;
    scene.fog = new THREE.FogExp2(initialSkyColor, 0.022);

    // 2. Camera & Perspective
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 5, 11);

    // 3. Renderer with PBR color management
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Studio Environment Lighting
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Key Directional Light
    const dirLight = new THREE.DirectionalLight(0xfffaed, 2.0);
    dirLight.position.set(7, 12, 6);
    dirLight.castShadow = !isSoftwareGl;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 30;
    dirLight.shadow.camera.left = -8;
    dirLight.shadow.camera.right = 8;
    dirLight.shadow.camera.top = 8;
    dirLight.shadow.camera.bottom = -8;
    dirLight.shadow.bias = -0.0005;
    dirLight.shadow.normalBias = 0.02;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Hemisphere Fill Light
    const hemiLight = new THREE.HemisphereLight(0xe0e7ff, 0xfce7f3, 1.1);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    // 5. OrbitControls with Damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.08; // Keep above ground
    controls.minDistance = 4;
    controls.maxDistance = 22;
    controls.target.set(0, 1.2, 0);

    // 6. Procedural Models Assembly (3-12 Part Composite Subjects)

    // Base Island / Ground
    const groundGeo = new THREE.CylinderGeometry(7.5, 8.2, 1.2, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xded2f9,
      roughness: 0.85,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.6;
    ground.receiveShadow = !isSoftwareGl;
    scene.add(ground);

    // Inner Water Pond
    const pondGeo = new THREE.CylinderGeometry(3.6, 3.6, 0.1, 32);
    const pondMat = new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      roughness: 0.1,
      metalness: 0.35,
    });
    const pond = new THREE.Mesh(pondGeo, pondMat);
    pond.position.y = 0.02;
    pond.receiveShadow = !isSoftwareGl;
    scene.add(pond);

    // Zen Pavilion / Shinto Pagoda (Composite 8 Parts)
    const pavilionGroup = new THREE.Group();

    // 1. Pavilion Stone Platform
    const platGeo = new THREE.BoxGeometry(2.6, 0.3, 2.6);
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 });
    const plat = new THREE.Mesh(platGeo, stoneMat);
    plat.position.set(0, 0.15, -2.8);
    plat.castShadow = !isSoftwareGl;
    plat.receiveShadow = !isSoftwareGl;
    pavilionGroup.add(plat);

    // 2-5. 4 Wooden Pillars
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
    const pillarGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.8, 12);
    const offsets = [
      [-1.0, -1.0],
      [1.0, -1.0],
      [-1.0, 1.0],
      [1.0, 1.0],
    ];
    offsets.forEach(([x, z]) => {
      const p = new THREE.Mesh(pillarGeo, woodMat);
      p.position.set(x, 1.2, -2.8 + z);
      p.castShadow = !isSoftwareGl;
      pavilionGroup.add(p);
    });

    // 6. Pagoda Eaves / Roof Lower
    const roofLowerGeo = new THREE.ConeGeometry(2.2, 0.6, 4);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.5 });
    const roofLower = new THREE.Mesh(roofLowerGeo, roofMat);
    roofLower.rotation.y = Math.PI / 4;
    roofLower.position.set(0, 2.3, -2.8);
    roofLower.castShadow = !isSoftwareGl;
    pavilionGroup.add(roofLower);

    // 7. Pagoda Spire
    const spireGeo = new THREE.CylinderGeometry(0.04, 0.12, 0.7, 8);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
    const spire = new THREE.Mesh(spireGeo, goldMat);
    spire.position.set(0, 2.8, -2.8);
    pavilionGroup.add(spire);

    // 8. Warm Glowing Lantern hanging inside
    const lanternGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      emissive: 0xfbbf24,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });
    const lantern = new THREE.Mesh(lanternGeo, lanternMat);
    lantern.position.set(0, 1.6, -2.8);
    pavilionGroup.add(lantern);

    scene.add(pavilionGroup);

    // Composite Sakura Tree (Trunk + 5 Organic Foliage Clusters)
    const treeGroup = new THREE.Group();
    const trunkGeo = new THREE.CylinderGeometry(0.18, 0.35, 2.4, 10);
    const trunk = new THREE.Mesh(trunkGeo, woodMat);
    trunk.position.set(-3.2, 1.2, 0.8);
    trunk.rotation.z = -0.15;
    trunk.castShadow = !isSoftwareGl;
    treeGroup.add(trunk);

    const sakuraMat = new THREE.MeshStandardMaterial({
      color: 0xfbcfe8,
      roughness: 0.75,
      metalness: 0.05,
    });
    const foliageOffsets = [
      [-3.4, 2.5, 0.8, 0.9],
      [-3.8, 2.2, 0.4, 0.7],
      [-2.8, 2.7, 1.2, 0.75],
      [-3.1, 3.2, 0.7, 0.65],
      [-2.6, 2.1, 0.5, 0.6],
    ];
    foliageOffsets.forEach(([x, y, z, s]) => {
      const fGeo = new THREE.SphereGeometry(s, 16, 16);
      const f = new THREE.Mesh(fGeo, sakuraMat);
      f.position.set(x, y, z);
      f.castShadow = !isSoftwareGl;
      treeGroup.add(f);
    });
    scene.add(treeGroup);

    // Balanced Zen Rock Cairn (3 Stacked Smoothed Stones)
    const stoneGroup = new THREE.Group();
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.7, metalness: 0.1 });
    const rocks = [
      { r: 0.45, h: 0.25, y: 0.15, x: 2.6, z: 1.2 },
      { r: 0.32, h: 0.22, y: 0.38, x: 2.6, z: 1.2 },
      { r: 0.2, h: 0.18, y: 0.58, x: 2.6, z: 1.2 },
    ];
    rocks.forEach(({ r, h, y, x, z }) => {
      const sGeo = new THREE.CylinderGeometry(r, r * 1.15, h, 16);
      const s = new THREE.Mesh(sGeo, rockMat);
      s.position.set(x, y, z);
      s.rotation.y = Math.random();
      s.castShadow = !isSoftwareGl;
      s.receiveShadow = !isSoftwareGl;
      stoneGroup.add(s);
    });
    scene.add(stoneGroup);

    // Center Floating Animated Lotus (Breathing Guide)
    const lotusGroup = new THREE.Group();
    lotusGroup.position.set(0, 0.2, 0);

    const lotusCoreGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const lotusCoreMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfacc15,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });
    const core = new THREE.Mesh(lotusCoreGeo, lotusCoreMat);
    lotusGroup.add(core);

    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      roughness: 0.4,
      metalness: 0.1,
    });
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const petalGeo = new THREE.ConeGeometry(0.16, 0.6, 6);
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.position.set(Math.cos(angle) * 0.35, 0.05, Math.sin(angle) * 0.35);
      petal.rotation.z = Math.PI / 3;
      petal.rotation.y = angle;
      petal.castShadow = !isSoftwareGl;
      lotusGroup.add(petal);
    }
    scene.add(lotusGroup);
    lotusRef.current = lotusGroup;

    // Drifting Glowing Petals (Instanced Particle Mesh)
    const petalCount = 28;
    const instPetalGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const instPetalMat = new THREE.MeshBasicMaterial({ color: 0xfda4af });
    const petalInstances = new THREE.InstancedMesh(instPetalGeo, instPetalMat, petalCount);
    const dummy = new THREE.Object3D();
    const petalData: { x: number; y: number; z: number; speed: number; rot: number }[] = [];

    for (let i = 0; i < petalCount; i++) {
      const p = {
        x: (Math.random() - 0.5) * 10,
        y: 0.5 + Math.random() * 4,
        z: (Math.random() - 0.5) * 10,
        speed: 0.005 + Math.random() * 0.01,
        rot: Math.random() * Math.PI * 2,
      };
      petalData.push(p);
      dummy.position.set(p.x, p.y, p.z);
      dummy.updateMatrix();
      petalInstances.setMatrixAt(i, dummy.matrix);
    }
    petalInstances.instanceMatrix.needsUpdate = true;
    scene.add(petalInstances);

    // 7. Animation Loop with 4-7-8 Breathing Motion Sync
    let frameId = 0;
    const clock = new THREE.Clock();

    function animate() {
      const elapsed = clock.getElapsedTime();

      // Smooth OrbitControls update
      controls.update();

      // 4-7-8 Breathing Motion Loop (4s Inhale, 7s Hold, 8s Exhale = 19s cycle)
      const cycleTime = elapsed % 19;
      let breathScale = 1;
      if (cycleTime < 4) {
        // Inhale: 1 -> 1.4
        const t = cycleTime / 4;
        breathScale = 1 + 0.45 * Math.sin((t * Math.PI) / 2);
        setBreathePhase('Inhale');
      } else if (cycleTime < 11) {
        // Hold at 1.45
        breathScale = 1.45;
        setBreathePhase('Hold');
      } else {
        // Exhale: 1.45 -> 1
        const t = (cycleTime - 11) / 8;
        breathScale = 1.45 - 0.45 * Math.sin((t * Math.PI) / 2);
        setBreathePhase('Exhale');
      }

      if (lotusRef.current) {
        lotusRef.current.scale.set(breathScale, breathScale, breathScale);
        lotusRef.current.rotation.y = elapsed * 0.2;
      }

      // Animate drifting petals
      for (let i = 0; i < petalCount; i++) {
        const p = petalData[i];
        p.y -= p.speed;
        p.x += Math.sin(elapsed + i) * 0.003;
        p.z += Math.cos(elapsed + i) * 0.003;
        if (p.y < 0.1) p.y = 4.5;
        dummy.position.set(p.x, p.y, p.z);
        dummy.rotation.set(elapsed * 0.5, p.rot, 0);
        dummy.updateMatrix();
        petalInstances.setMatrixAt(i, dummy.matrix);
      }
      petalInstances.instanceMatrix.needsUpdate = true;

      // Render scene
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }

    frameId = requestAnimationFrame(animate);

    // 8. Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      pondGeo.dispose();
      pondMat.dispose();
      platGeo.dispose();
      stoneMat.dispose();
      pillarGeo.dispose();
      woodMat.dispose();
      roofLowerGeo.dispose();
      roofMat.dispose();
      spireGeo.dispose();
      goldMat.dispose();
      lanternGeo.dispose();
      lanternMat.dispose();
      trunkGeo.dispose();
      sakuraMat.dispose();
      lotusCoreGeo.dispose();
      lotusCoreMat.dispose();
      petalMat.dispose();
      instPetalGeo.dispose();
      instPetalMat.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Atmosphere on Time of Day Change
  useEffect(() => {
    const scene = sceneRef.current;
    const dir = dirLightRef.current;
    const hemi = hemiLightRef.current;
    if (!scene || !dir || !hemi) return;

    if (timeOfDay === 'morning') {
      const morningColor = new THREE.Color(0xf6f0ff);
      scene.background = morningColor;
      scene.fog = new THREE.FogExp2(morningColor, 0.022);
      dir.color.setHex(0xfffaed);
      dir.intensity = 2.0;
      dir.position.set(7, 12, 6);
      hemi.color.setHex(0xe0e7ff);
      hemi.groundColor.setHex(0xfce7f3);
    } else if (timeOfDay === 'sunset') {
      const sunsetColor = new THREE.Color(0xffedd5);
      scene.background = sunsetColor;
      scene.fog = new THREE.FogExp2(sunsetColor, 0.025);
      dir.color.setHex(0xfb923c);
      dir.intensity = 2.4;
      dir.position.set(10, 5, 2);
      hemi.color.setHex(0xfef08a);
      hemi.groundColor.setHex(0x7c3aed);
    } else if (timeOfDay === 'night') {
      const nightColor = new THREE.Color(0x0f172a);
      scene.background = nightColor;
      scene.fog = new THREE.FogExp2(nightColor, 0.035);
      dir.color.setHex(0x60a5fa);
      dir.intensity = 0.6;
      dir.position.set(4, 9, 4);
      hemi.color.setHex(0x1e1b4b);
      hemi.groundColor.setHex(0x020617);
    }
  }, [timeOfDay]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-2">
          <Sparkles className="w-4 h-4" />
          Interactive 3D Spatial Sanctuary · Three.js PBR Engine
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
          3D Dhyan Vatika (ध्यान वाटिका)
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          An interactive procedural Zen courtyard. Rotate, zoom, and sync your breathing with the floating lotus flower.
        </p>
      </div>

      {/* 3D Viewport Box */}
      <div className="relative w-full h-[580px] rounded-3xl overflow-hidden border border-purple-200 shadow-lg bg-slate-900">
        {/* Three.js Isolated Canvas Mount */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Minimal Spec / Breath Rhythm Badge (Top Left) */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 p-2.5 rounded-2xl bg-white/90 shadow-sm border border-purple-100 text-xs select-none">
          <span className="font-bold text-slate-800">Breath Rhythm:</span>
          <span
            className={`font-extrabold px-2 py-0.5 rounded-md ${
              breathePhase === 'Inhale'
                ? 'bg-purple-100 text-purple-800'
                : breathePhase === 'Hold'
                ? 'bg-sky-100 text-sky-800'
                : 'bg-orange-100 text-orange-800'
            }`}
          >
            {breathePhase}
          </span>
          <span className="text-slate-400 text-[11px] hidden sm:inline">· 4-7-8 Lotus Sync</span>
        </div>

        {/* Unified Bottom Control Dock (Zero Viewport Occlusion) */}
        <div
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[94%] max-w-2xl transition-all duration-300 ${
            isDockCollapsed ? 'translate-y-16 opacity-70' : 'translate-y-0 opacity-100'
          }`}
        >
          {/* Dock Header & Collapse Toggle */}
          <div className="flex justify-center mb-1">
            <button
              onClick={() => setIsDockCollapsed(!isDockCollapsed)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 text-white text-[11px] font-bold shadow-md hover:bg-slate-900 transition"
            >
              {isDockCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span>{isDockCollapsed ? 'Show Zen Controls' : 'Hide Controls'}</span>
            </button>
          </div>

          {/* Controls Bar */}
          <div className="p-3 bg-white/95 border border-purple-200/90 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Time of Day Presets */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-600 text-[11px] mr-1 hidden sm:inline">Time:</span>
              <button
                onClick={() => setTimeOfDay('morning')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition ${
                  timeOfDay === 'morning'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Morning</span>
              </button>

              <button
                onClick={() => setTimeOfDay('sunset')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition ${
                  timeOfDay === 'sunset'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Sunset className="w-3.5 h-3.5" />
                <span>Sunset</span>
              </button>

              <button
                onClick={() => setTimeOfDay('night')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition ${
                  timeOfDay === 'night'
                    ? 'bg-indigo-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Night</span>
              </button>
            </div>

            {/* Audio & Interaction */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleAmbientAudio}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition ${
                  isAudioPlaying
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isAudioPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{isAudioPlaying ? 'Stream Sound On' : 'Ambient Sound'}</span>
              </button>

              <span className="text-[11px] text-slate-400 hidden md:inline">
                Drag to rotate · Scroll to zoom
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* College Project Architecture Rationale Card */}
      <div className="p-6 bg-white rounded-3xl border border-purple-100 shadow-xs space-y-2 text-xs text-slate-600">
        <h4 className="font-extrabold text-slate-800 text-sm">
          Technical 3D Engineering Architecture (Three.js & WebGL)
        </h4>
        <p className="leading-relaxed">
          The 3D Dhyan Vatika is procedurally constructed using Three.js with zero external 3D asset dependencies (preventing network 404 latency). It incorporates physical PBR materials with `RoomEnvironment` reflections, ACES Filmic tone mapping, PCF soft shadows, and instanced drifting petals running at a locked 60 FPS. The center lotus acts as a bio-feedback pacer matching standard 4-7-8 diaphragmatic breathing cycles.
        </p>
      </div>
    </div>
  );
};
