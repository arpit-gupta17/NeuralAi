import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ════════════════════════════════════════════════════════════════════════
// TIMING
//
// This is now the *second half* of one continuous cinematic, not an
// independent fade-in. LoadingScreen finishes and fades itself out; a
// beat later this component's own opening act starts — a tight core of
// light forms, then the camera pulls back over a few seconds as that
// light stretches into the flowing curve field the rest of the Hero sits
// in front of. `play` (passed from App.jsx) is what starts that act; it
// flips ~300ms after the loader is gone, so nothing here has to guess
// when that was.
// ════════════════════════════════════════════════════════════════════════
export const NEURAL_TIMING = {
  pauseAfterLoad: 0.3, // seconds — quiet beat before the pulse begins
  pulseForm: 0.45,     // seconds — energy pulse forming/expanding
  pullback: 3.6,       // seconds — camera flying back as curves stretch out
  fadeIn: 0.6,         // legacy fallback fade, kept for reduced-motion paths
};

// Hero.jsx calls this for its text-reveal delay. Same signature as before,
// so Hero.jsx needs zero changes — only the number moves, so the headline
// now waits for the pull-back to actually finish instead of a short,
// disconnected fade.
export function textRevealDelayMs(prefersReducedMotion) {
  if (prefersReducedMotion) return 100;
  const total = (NEURAL_TIMING.pauseAfterLoad + NEURAL_TIMING.pulseForm + NEURAL_TIMING.pullback) * 1000;
  return Math.round(total);
}

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInOutQuint = (t) => (t < 0.5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2);
const rand = (min, max) => Math.random() * (max - min) + min;

// World-space volume the whole field lives in — used both to scatter the
// curves and to encode/decode particle positions in the lookup texture.
const BOUNDS = { xMin: -10, xMax: 10, yMin: -6, yMax: 6, zMin: -4.5, zMax: 1.5 };

// Device tiers — curve/particle counts scale down on smaller/touch devices
// so the field stays at 60fps everywhere, per the brief's perf section.
const TIERS = {
  desktop: { curveCount: 340, pointsPerCurve: 200, particleCount: 900, sparkCount: 16, dprMax: 2 },
  tablet: { curveCount: 190, pointsPerCurve: 150, particleCount: 480, sparkCount: 10, dprMax: 1.5 },
  mobile: { curveCount: 110, pointsPerCurve: 110, particleCount: 260, sparkCount: 6, dprMax: 1.25 },
};

function getTier() {
  if (typeof window === 'undefined') return TIERS.desktop;
  const w = window.innerWidth;
  const coarse = window.matchMedia?.('(pointer: coarse)')?.matches;
  if (w < 640 || (coarse && w < 900)) return TIERS.mobile;
  if (w < 1100) return TIERS.tablet;
  return TIERS.desktop;
}

// ── compact 3D simplex noise + curl derivation — this is what makes the
// curves and particles drift organically instead of on a sine loop. ─────
const NOISE_GLSL = `
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  vec3 curlNoise(vec3 p){
    float e = 0.06;
    float n1 = snoise(p + vec3(0.0, e, 0.0));
    float n2 = snoise(p - vec3(0.0, e, 0.0));
    float n3 = snoise(p + vec3(0.0, 0.0, e));
    float n4 = snoise(p - vec3(0.0, 0.0, e));
    float n5 = snoise(p + vec3(e, 0.0, 0.0));
    float n6 = snoise(p - vec3(e, 0.0, 0.0));
    float x = (n1 - n2) - (n3 - n4);
    float y = (n3 - n4) - (n5 - n6);
    float z = (n5 - n6) - (n1 - n2);
    return vec3(x, y, z) / (2.0 * e);
  }
`;

// ════════════════════════════════════════════════════════════════════════
// Curve field generation — CatmullRomCurve3 splines through control points
// built with a random-walk (not a single sine), so paths wander instead
// of reading as a repeated wave. Each curve gets its own amplitude,
// wavelength, phase, speed, depth and brightness.
// ════════════════════════════════════════════════════════════════════════
function buildCurvePoints(index, curveCount) {
  const nCtrl = 6 + Math.floor(Math.random() * 4); // 6–9 control points
  const lane = curveCount > 1 ? index / (curveCount - 1) : 0.5;
  let y = THREE.MathUtils.lerp(BOUNDS.yMin * 0.9, BOUNDS.yMax * 0.9, lane) + rand(-1, 1);
  let z = rand(BOUNDS.zMin, BOUNDS.zMax);
  const pts = [];
  for (let i = 0; i < nCtrl; i++) {
    const u = i / (nCtrl - 1);
    const x = THREE.MathUtils.lerp(BOUNDS.xMin * 0.95, BOUNDS.xMax * 0.95, u) + rand(-0.5, 0.5);
    y = THREE.MathUtils.clamp(y + rand(-1.5, 1.5), BOUNDS.yMin, BOUNDS.yMax);
    z = THREE.MathUtils.clamp(z + rand(-0.4, 0.4), BOUNDS.zMin, BOUNDS.zMax);
    pts.push(new THREE.Vector3(x, y, z));
  }
  return pts;
}

function useCurveField(tier) {
  return useMemo(() => {
    const curves = [];
    for (let i = 0; i < tier.curveCount; i++) {
      const ctrl = buildCurvePoints(i, tier.curveCount);
      const spline = new THREE.CatmullRomCurve3(ctrl, false, 'catmullrom', 0.5);
      const points = spline.getPoints(tier.pointsPerCurve - 1);
      const avgZ = ctrl.reduce((s, p) => s + p.z, 0) / ctrl.length;
      const depth = clamp01((avgZ - BOUNDS.zMin) / (BOUNDS.zMax - BOUNDS.zMin));
      curves.push({
        points,
        freq: rand(0.12, 0.34),
        amp: rand(0.15, 0.55),
        phase: rand(0, 100),
        speed: rand(0.4, 1.3),
        depth,
        brightness: rand(0.35, 1.0),
      });
    }
    return curves;
  }, [tier]);
}

// A radial-gradient sprite texture, generated once on a canvas — used for
// the opening energy pulse and the small "spark" flashes. No image assets.
function useGlowTexture() {
  return useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(255,255,255,0.95)');
    g.addColorStop(0.35, 'rgba(150,210,255,0.55)');
    g.addColorStop(1, 'rgba(120,90,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);
}

// ════════════════════════════════════════════════════════════════════════
// NeuralCurves — every sampled curve segment merged into ONE LineSegments
// draw call. Real GL lines (native thin, never a ribbon/tube), displaced
// per-vertex on the GPU by curl noise so they keep evolving forever with
// no visible loop.
// ════════════════════════════════════════════════════════════════════════
const curveVertex = `
  ${NOISE_GLSL}
  attribute float aFreq;
  attribute float aAmp;
  attribute float aPhase;
  attribute float aSpeed;
  attribute float aT;
  attribute float aDepth;
  attribute float aBrightness;
  uniform float uTime;
  uniform float uOpacity;
  varying float vT;
  varying float vAlpha;
  varying float vDepth;
  void main() {
    vec3 p = position;
    vec3 coord = p * aFreq + vec3(0.0, 0.0, uTime * aSpeed * 0.05 + aPhase);
    p += curlNoise(coord) * aAmp;
    vT = aT;
    vDepth = aDepth;
    vAlpha = aBrightness * uOpacity;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const curveFragment = `
  varying float vT;
  varying float vAlpha;
  varying float vDepth;
  void main() {
    vec3 cyan = vec3(0.24, 0.8, 1.0);
    vec3 violet = vec3(0.55, 0.33, 1.0);
    vec3 white = vec3(1.0);
    vec3 color = mix(cyan, violet, vT);
    color = mix(color, white, vDepth * 0.4);
    gl_FragColor = vec4(color, vAlpha * (0.35 + vDepth * 0.55));
  }
`;

function NeuralCurves({ curves, tier, controllerRef }) {
  const materialRef = useRef();
  const meshRef = useRef();

  const geometry = useMemo(() => {
    const P = tier.pointsPerCurve;
    const segCount = curves.length * (P - 1);
    const positions = new Float32Array(segCount * 2 * 3);
    const aFreq = new Float32Array(segCount * 2);
    const aAmp = new Float32Array(segCount * 2);
    const aPhase = new Float32Array(segCount * 2);
    const aSpeed = new Float32Array(segCount * 2);
    const aT = new Float32Array(segCount * 2);
    const aDepth = new Float32Array(segCount * 2);
    const aBrightness = new Float32Array(segCount * 2);

    let v = 0;
    for (const curve of curves) {
      for (let i = 0; i < P - 1; i++) {
        const a = curve.points[i];
        const b = curve.points[i + 1];
        const ta = i / (P - 1);
        const tb = (i + 1) / (P - 1);
        for (const [pt, t] of [[a, ta], [b, tb]]) {
          positions[v * 3] = pt.x;
          positions[v * 3 + 1] = pt.y;
          positions[v * 3 + 2] = pt.z;
          aFreq[v] = curve.freq;
          aAmp[v] = curve.amp;
          aPhase[v] = curve.phase;
          aSpeed[v] = curve.speed;
          aT[v] = t;
          aDepth[v] = curve.depth;
          aBrightness[v] = curve.brightness;
          v++;
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aFreq', new THREE.BufferAttribute(aFreq, 1));
    geo.setAttribute('aAmp', new THREE.BufferAttribute(aAmp, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(aPhase, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(aSpeed, 1));
    geo.setAttribute('aT', new THREE.BufferAttribute(aT, 1));
    geo.setAttribute('aDepth', new THREE.BufferAttribute(aDepth, 1));
    geo.setAttribute('aBrightness', new THREE.BufferAttribute(aBrightness, 1));
    return geo;
  }, [curves, tier.pointsPerCurve]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    materialRef.current.uniforms.uOpacity.value = controllerRef.current.fieldOpacity;
  });

  return (
    <lineSegments ref={meshRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={curveVertex}
        fragmentShader={curveFragment}
        uniforms={{ uTime: { value: 0 }, uOpacity: { value: 0 } }}
      />
    </lineSegments>
  );
}

// ════════════════════════════════════════════════════════════════════════
// FlowParticles — GPU points that travel along the same curves, sampled
// from a small lookup texture (one row per curve) so the vertex shader
// can fetch "where am I on my curve right now" without any CPU work per
// frame. The same curl-noise displacement used for the lines is re-applied
// here so particles visually ride the curve's current shape, not a stale
// straight version of it.
// ════════════════════════════════════════════════════════════════════════
const particleVertex = `
  ${NOISE_GLSL}
  attribute float aCurveRow;
  attribute float aFreq;
  attribute float aAmp;
  attribute float aPhase;
  attribute float aSpeed;
  attribute float aTravelSpeed;
  attribute float aLifeOffset;
  attribute float aSize;
  attribute float aBrightness;
  uniform sampler2D uCurveTex;
  uniform float uTexHeight;
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uBoundsMin;
  uniform vec3 uBoundsScale;
  varying float vAlpha;
  void main() {
    float t = fract(uTime * aTravelSpeed + aLifeOffset);
    float v = (aCurveRow + 0.5) / uTexHeight;
    vec3 raw = texture2D(uCurveTex, vec2(t, v)).rgb;
    vec3 base = raw * uBoundsScale + uBoundsMin;

    vec3 coord = base * aFreq + vec3(0.0, 0.0, uTime * aSpeed * 0.05 + aPhase);
    vec3 p = base + curlNoise(coord) * aAmp;

    // brief brighten right after a particle "respawns" at the curve start —
    // reads as a small energy flash rather than a hard jump.
    float spawnFlash = 1.0 + smoothstep(0.035, 0.0, t) * 2.4;
    vAlpha = aBrightness * uOpacity * spawnFlash;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * (280.0 / -mv.z);
  }
`;
const particleFragment = `
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv) * 2.0;
    float a = smoothstep(1.0, 0.0, d) * vAlpha;
    gl_FragColor = vec4(mix(vec3(0.5, 0.86, 1.0), vec3(1.0), 0.5), a);
  }
`;

function FlowParticles({ curves, tier, controllerRef }) {
  const materialRef = useRef();

  // Encode each curve's sampled points into one row of a Uint8 lookup
  // texture (RGB = normalized xyz). Uint8 + LinearFilter is universally
  // supported (unlike float textures on some mobile GPUs), and the ~0.08
  // unit quantization this implies is invisible at hero-background scale.
  const curveTexture = useMemo(() => {
    const w = tier.pointsPerCurve;
    const h = curves.length;
    const data = new Uint8Array(w * h * 4);
    const sx = BOUNDS.xMax - BOUNDS.xMin;
    const sy = BOUNDS.yMax - BOUNDS.yMin;
    const sz = BOUNDS.zMax - BOUNDS.zMin;
    for (let row = 0; row < h; row++) {
      const pts = curves[row].points;
      for (let col = 0; col < w; col++) {
        const p = pts[col];
        const idx = (row * w + col) * 4;
        data[idx] = Math.round(((p.x - BOUNDS.xMin) / sx) * 255);
        data[idx + 1] = Math.round(((p.y - BOUNDS.yMin) / sy) * 255);
        data[idx + 2] = Math.round(((p.z - BOUNDS.zMin) / sz) * 255);
        data[idx + 3] = 255;
      }
    }
    const tex = new THREE.DataTexture(data, w, h, THREE.RGBAFormat, THREE.UnsignedByteType);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.generateMipmaps = false;
    tex.needsUpdate = true;
    return tex;
  }, [curves, tier.pointsPerCurve]);

  useEffect(() => () => curveTexture.dispose(), [curveTexture]);

  const geometry = useMemo(() => {
    const count = tier.particleCount;
    const curveRow = new Float32Array(count);
    const aFreq = new Float32Array(count);
    const aAmp = new Float32Array(count);
    const aPhase = new Float32Array(count);
    const aSpeed = new Float32Array(count);
    const aTravelSpeed = new Float32Array(count);
    const aLifeOffset = new Float32Array(count);
    const aSize = new Float32Array(count);
    const aBrightness = new Float32Array(count);
    const positions = new Float32Array(count * 3); // required attr, unused (computed in shader)

    for (let i = 0; i < count; i++) {
      const row = i % curves.length;
      const curve = curves[row];
      curveRow[i] = row;
      aFreq[i] = curve.freq;
      aAmp[i] = curve.amp;
      aPhase[i] = curve.phase;
      aSpeed[i] = curve.speed;
      aTravelSpeed[i] = rand(0.05, 0.22);
      aLifeOffset[i] = Math.random();
      aSize[i] = rand(2.0, 5.0) * (0.5 + curve.depth);
      aBrightness[i] = rand(0.5, 1.0) * curve.brightness;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aCurveRow', new THREE.BufferAttribute(curveRow, 1));
    geo.setAttribute('aFreq', new THREE.BufferAttribute(aFreq, 1));
    geo.setAttribute('aAmp', new THREE.BufferAttribute(aAmp, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(aPhase, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(aSpeed, 1));
    geo.setAttribute('aTravelSpeed', new THREE.BufferAttribute(aTravelSpeed, 1));
    geo.setAttribute('aLifeOffset', new THREE.BufferAttribute(aLifeOffset, 1));
    geo.setAttribute('aSize', new THREE.BufferAttribute(aSize, 1));
    geo.setAttribute('aBrightness', new THREE.BufferAttribute(aBrightness, 1));
    return geo;
  }, [curves, tier.particleCount]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo(
    () => ({
      uCurveTex: { value: curveTexture },
      uTexHeight: { value: curves.length },
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uBoundsMin: { value: new THREE.Vector3(BOUNDS.xMin, BOUNDS.yMin, BOUNDS.zMin) },
      uBoundsScale: { value: new THREE.Vector3(BOUNDS.xMax - BOUNDS.xMin, BOUNDS.yMax - BOUNDS.yMin, BOUNDS.zMax - BOUNDS.zMin) },
    }),
    [curveTexture, curves.length]
  );

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uOpacity.value = controllerRef.current.fieldOpacity;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        uniforms={uniforms}
      />
    </points>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Sparks — a handful of soft sprite flashes placed along random curves,
// each pulsing on its own cycle. Cheap (CPU, tiny count) stand-in for
// "particles meeting" — reads as occasional energy flashes in the field.
// ════════════════════════════════════════════════════════════════════════
function Sparks({ curves, tier, controllerRef, texture }) {
  const sparks = useMemo(() => {
    return new Array(tier.sparkCount).fill(0).map(() => {
      const curve = curves[Math.floor(Math.random() * curves.length)];
      const pt = curve.points[Math.floor(Math.random() * curve.points.length)];
      return {
        pos: [pt.x, pt.y, pt.z],
        period: rand(2.2, 5.5),
        offset: Math.random() * 10,
        maxScale: rand(0.3, 0.7),
      };
    });
  }, [curves, tier.sparkCount]);

  return (
    <group>
      {sparks.map((s, i) => (
        <Spark key={i} data={s} controllerRef={controllerRef} texture={texture} />
      ))}
    </group>
  );
}

function Spark({ data, controllerRef, texture }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const cycle = ((clock.elapsedTime + data.offset) % data.period) / data.period;
    const pulse = Math.max(0, Math.sin(cycle * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5);
    const burst = Math.pow(pulse, 4);
    ref.current.material.opacity = burst * controllerRef.current.fieldOpacity;
    ref.current.scale.setScalar(data.maxScale * (0.4 + burst * 0.6));
  });
  return (
    <sprite ref={ref} position={data.pos}>
      <spriteMaterial map={texture} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0} />
    </sprite>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Dust — small twinkling background points for extra depth, opacity tied
// to the same field-opacity driver as everything else.
// ════════════════════════════════════════════════════════════════════════
const dustVertex = `
  uniform float uTime;
  uniform float uOpacity;
  attribute float aSeed;
  attribute float aSize;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    float t = uTime * 0.12 + aSeed * 20.0;
    p.x += sin(t + p.y * 0.6) * 0.25;
    p.y += cos(t * 1.2 + p.x * 0.5) * 0.18;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * (26.0 / -mv.z) * (0.8 + 0.3 * sin(t * 2.0));
    vAlpha = uOpacity;
  }
`;
const dustFragment = `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = smoothstep(1.0, 0.1, d) * 0.55 * vAlpha;
    gl_FragColor = vec4(0.75, 0.9, 1.0, a);
  }
`;

function Dust({ tier, controllerRef }) {
  const material = useRef(null);
  const count = tier.particleCount < 400 ? 220 : 500;

  const geo = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
      seeds[i] = Math.random();
      sizes[i] = 0.4 + Math.random() * 1.3;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    g.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    return g;
  }, [count]);

  useEffect(() => () => geo.dispose(), [geo]);

  useFrame(({ clock }) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = clock.elapsedTime;
    material.current.uniforms.uOpacity.value = controllerRef.current.fieldOpacity;
  });

  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={dustVertex}
        fragmentShader={dustFragment}
        uniforms={{ uTime: { value: 0 }, uOpacity: { value: 0 } }}
      />
    </points>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PulseCore — the bright point of light the whole sequence opens on.
// ════════════════════════════════════════════════════════════════════════
function PulseCore({ controllerRef, texture }) {
  const ref = useRef();
  useFrame(() => {
    if (!ref.current) return;
    const c = controllerRef.current;
    ref.current.scale.setScalar(Math.max(0.0001, c.pulseScale));
    ref.current.material.opacity = c.pulseOpacity;
  });
  return (
    <sprite ref={ref} position={[0, 0, 0]}>
      <spriteMaterial map={texture} color="#bfe9ff" transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0} />
    </sprite>
  );
}

// ════════════════════════════════════════════════════════════════════════
// IntroDriver — the single state machine for the whole opening cinematic:
// pause → pulse forms/expands → camera pulls back 3.6s → ambient (subtle
// breathing + mouse parallax, forever). Everything else just reads its
// output off `controllerRef` each frame instead of re-deriving it.
// ════════════════════════════════════════════════════════════════════════
function IntroDriver({ play, reduced, controllerRef }) {
  const playStartRef = useRef(null);

  useFrame(({ camera, clock, pointer }) => {
    const c = controllerRef.current;

    if (reduced) {
      c.phase = 'ambient';
      c.fieldOpacity = 1;
      c.pulseOpacity = 0;
      camera.position.set(0, 0, 7);
      camera.lookAt(0, 0, 0);
      return;
    }

    if (!play) {
      // Idle: held at the tight starting frame. The Canvas is already
      // mounted and rendering at this point (see NeuralField below) so
      // shaders are compiled and warm — it's just invisible behind the
      // opaque loading screen until `play` flips.
      c.phase = 'idle';
      c.fieldOpacity = 0;
      c.pulseOpacity = 0;
      c.pulseScale = 0.05;
      camera.position.set(0, 0, 1.3);
      camera.lookAt(0, 0, 0);
      return;
    }

    if (playStartRef.current === null) playStartRef.current = clock.elapsedTime;
    const t = clock.elapsedTime - playStartRef.current;

    const T_PAUSE = NEURAL_TIMING.pauseAfterLoad;
    const T_PULSE_END = T_PAUSE + NEURAL_TIMING.pulseForm;
    const T_PULLBACK_END = T_PULSE_END + NEURAL_TIMING.pullback;

    if (t < T_PAUSE) {
      c.phase = 'pause';
      c.pulseOpacity = 0;
      c.fieldOpacity = 0;
      camera.position.set(0, 0, 1.3);
    } else if (t < T_PULSE_END) {
      c.phase = 'pulse';
      const u = clamp01((t - T_PAUSE) / NEURAL_TIMING.pulseForm);
      c.pulseScale = THREE.MathUtils.lerp(0.05, 3.2, easeOutCubic(u));
      c.pulseOpacity = Math.sin(u * Math.PI);
      c.fieldOpacity = u * 0.22;
      camera.position.z = THREE.MathUtils.lerp(1.3, 1.9, u);
    } else if (t < T_PULLBACK_END) {
      c.phase = 'pullback';
      const u = clamp01((t - T_PULSE_END) / NEURAL_TIMING.pullback);
      const eased = easeInOutQuint(u);
      camera.position.z = THREE.MathUtils.lerp(1.9, 7.0, eased);
      c.pulseOpacity = Math.max(0, 1 - u * 1.3);
      c.pulseScale = THREE.MathUtils.lerp(3.2, 9, eased);
      c.fieldOpacity = THREE.MathUtils.lerp(0.22, 1, eased);
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.15 * eased, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.09 * eased, 0.05);
    } else {
      c.phase = 'ambient';
      c.pulseOpacity = 0;
      c.fieldOpacity = 1;
      const breatheX = Math.sin(clock.elapsedTime * 0.12) * 0.18;
      const breatheY = Math.cos(clock.elapsedTime * 0.1) * 0.11;
      const breatheZ = Math.sin(clock.elapsedTime * 0.06) * 0.25;
      const targetX = pointer.x * 0.55 + breatheX;
      const targetY = -pointer.y * 0.55 + breatheY;
      camera.position.x += (targetX - camera.position.x) * 0.035;
      camera.position.y += (targetY - camera.position.y) * 0.035;
      camera.position.z = 7 + breatheZ;
    }

    camera.lookAt(camera.position.x * 0.5, camera.position.y * 0.5, 0);
  });

  return null;
}

function Scene({ tier, reduced, play }) {
  const controllerRef = useRef({ fieldOpacity: 0, pulseScale: 0.05, pulseOpacity: 0, phase: 'idle' });
  const curves = useCurveField(tier);
  const glowTexture = useGlowTexture();

  return (
    <>
      <fog attach="fog" args={['#04070d', 5, 15]} />
      <IntroDriver play={play} reduced={reduced} controllerRef={controllerRef} />
      <PulseCore controllerRef={controllerRef} texture={glowTexture} />
      <NeuralCurves curves={curves} tier={tier} controllerRef={controllerRef} />
      <FlowParticles curves={curves} tier={tier} controllerRef={controllerRef} />
      <Sparks curves={curves} tier={tier} controllerRef={controllerRef} texture={glowTexture} />
      <Dust tier={tier} controllerRef={controllerRef} />
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Reliability wrapper — pauses offscreen/hidden-tab, recovers from WebGL
// context loss, respects prefers-reduced-motion. `play` controls the
// opening cinematic (see IntroDriver); mounting happens independently so
// the Canvas can warm up before `play` ever flips true.
// ════════════════════════════════════════════════════════════════════════
export default function NeuralField({ className = '', play = true }) {
  const [reduced, setReduced] = useState(false);
  const wrapRef = useRef(null);
  const [active, setActive] = useState(true);
  const [contextKey, setContextKey] = useState(0);
  const [tier, setTier] = useState(() => getTier());

  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(q.matches);
    update();
    q.addEventListener('change', update);
    return () => q.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      threshold: 0.02,
    });
    io.observe(el);
    const onVisibility = () => setActive(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    const onResize = () => setTier(getTier());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`hero-neural-field pointer-events-none ${className}`}
      style={{
        maskImage: 'linear-gradient(to bottom, black 0%, black 62%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 62%, transparent 100%)',
        // Cheap, GPU-composited glow around the bright lines/particles —
        // avoids a full bloom postprocessing pass while still reading as
        // luminous (this project doesn't currently pull in @react-three/
        // postprocessing, so real bloom / chromatic aberration are left
        // out rather than adding a new heavy dependency for it).
        filter: 'drop-shadow(0 0 10px rgba(90,160,255,0.22)) drop-shadow(0 0 22px rgba(140,90,255,0.14))',
      }}
    >
      <Canvas
        key={contextKey}
        dpr={[1, tier.dprMax]}
        frameloop={active ? 'always' : 'never'}
        camera={{ position: [0, 0, 1.3], fov: 48, near: 0.1, far: 100 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e) => e.preventDefault());
          gl.domElement.addEventListener('webglcontextrestored', () => setContextKey((k) => k + 1));
        }}
      >
        <Scene tier={tier} reduced={reduced} play={play} />
      </Canvas>
    </div>
  );
}