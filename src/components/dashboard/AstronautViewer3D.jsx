/**
 * AstronautViewer3D.jsx
 * Interactive 3D spacesuit bio-telemetry viewer.
 *
 * Hotspot architecture:
 *  - ScreenProjector (inside Canvas/useFrame) projects world anchors → pixel coords every frame
 *  - HotspotOverlay (outside Canvas, position:absolute inside overflow:hidden container) renders
 *    all labels + an SVG layer for leader-lines / arrowheads / pulsing dots
 *  - Zero drei <Html> usage → bubbles physically cannot escape the canvas container
 */
import React, {
  useState, useRef, useMemo, useEffect,
  useCallback, Suspense
} from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Stars, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { useNavigate } from 'react-router-dom'
import { RotateCcw, Layers, Shield, ExternalLink } from 'lucide-react'

// ─── Layout constants ─────────────────────────────────────────────────────────
const NASA_MODEL_PATH = '/models/astronaut.glb'
const DRACO_PATH      = '/draco/'
const MODEL_HEIGHT    = 2.0   // world units after normalization
const PILL_W          = 72    // approximate pill width  (px)
const PILL_H          = 22    // approximate pill height (px)
const LABEL_OFFSET_X  = 100   // px: how far pill centre sits from model centre-line
const LABEL_MIN_GAP   = 50    // px: minimum vertical gap between consecutive pills
const PADDING         = 10    // px: inset from container edge
const ARROW_R         = 4     // px: dot radius at anchor
const BACKFACE_FADE   = 0.42  // minimum opacity when facing away

try { useGLTF.preload(NASA_MODEL_PATH, DRACO_PATH) } catch (_) {}

// ─── Color helper ─────────────────────────────────────────────────────────────
function sc(s) {
  if (s === 'critical') return '#EF4444'
  if (s === 'caution' || s === 'warning') return '#F59E0B'
  return '#22C55E'
}

// ─── Procedural fallback ──────────────────────────────────────────────────────
function ProceduralAstronaut() {
  const white = useMemo(() => new THREE.MeshStandardMaterial({ color: '#F8FAFC', metalness: 0.25, roughness: 0.35 }), [])
  const visor = useMemo(() => new THREE.MeshStandardMaterial({ color: '#F59E0B', metalness: 0.95, roughness: 0.1  }), [])
  const dark  = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1E293B', metalness: 0.5,  roughness: 0.4  }), [])
  const joint = useMemo(() => new THREE.MeshStandardMaterial({ color: '#64748B', metalness: 0.4,  roughness: 0.5  }), [])
  return (
    <group position={[0, -0.1, 0]}>
      <group position={[0, 1.25, 0]}>
        <mesh material={white} castShadow><sphereGeometry args={[0.38, 32, 32]} /></mesh>
        <mesh position={[0, 0.04, 0.22]} rotation={[0.1, 0, 0]} material={visor}>
          <sphereGeometry args={[0.26, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        </mesh>
        <mesh position={[0, -0.32, 0]} rotation={[Math.PI / 2, 0, 0]} material={dark}>
          <torusGeometry args={[0.3, 0.05, 16, 32]} />
        </mesh>
      </group>
      <group position={[0, 0.45, 0]}>
        <mesh material={white} castShadow><cylinderGeometry args={[0.42, 0.36, 0.95, 24]} /></mesh>
        <mesh position={[0, 0.12, 0.38]} material={dark} castShadow><boxGeometry args={[0.42, 0.36, 0.12]} /></mesh>
      </group>
      <group position={[0, 0.52, -0.42]}>
        <mesh material={white} castShadow><boxGeometry args={[0.72, 1.05, 0.36]} /></mesh>
      </group>
      <group position={[-0.62, 0.65, 0]}>
        <mesh rotation={[0, 0, 0.3]} material={white} castShadow><capsuleGeometry args={[0.14, 0.48, 12, 16]} /></mesh>
        <group position={[-0.16, -0.48, 0.1]}>
          <mesh rotation={[0.3, 0, 0.1]} material={white} castShadow><capsuleGeometry args={[0.13, 0.42, 12, 16]} /></mesh>
          <mesh position={[0, -0.28, 0]} material={joint}><sphereGeometry args={[0.13, 16, 16]} /></mesh>
        </group>
      </group>
      <group position={[0.62, 0.65, 0]}>
        <mesh rotation={[0, 0, -0.3]} material={white} castShadow><capsuleGeometry args={[0.14, 0.48, 12, 16]} /></mesh>
        <group position={[0.16, -0.48, 0.1]}>
          <mesh rotation={[0.3, 0, -0.1]} material={white} castShadow><capsuleGeometry args={[0.13, 0.42, 12, 16]} /></mesh>
          <mesh position={[0, -0.28, 0]} material={joint}><sphereGeometry args={[0.13, 16, 16]} /></mesh>
        </group>
      </group>
      <mesh position={[0, -0.15, 0]} material={joint}><cylinderGeometry args={[0.38, 0.34, 0.25, 24]} /></mesh>
      <group position={[-0.28, -0.4, 0]}>
        <mesh rotation={[0.05, 0, -0.05]} material={white} castShadow><capsuleGeometry args={[0.16, 0.55, 12, 16]} /></mesh>
        <group position={[0, -0.58, 0.05]}>
          <mesh material={white} castShadow><capsuleGeometry args={[0.15, 0.52, 12, 16]} /></mesh>
          <mesh position={[0, -0.38, 0.1]} material={dark} castShadow><boxGeometry args={[0.26, 0.2, 0.42]} /></mesh>
        </group>
      </group>
      <group position={[0.28, -0.4, 0]}>
        <mesh rotation={[0.05, 0, 0.05]} material={white} castShadow><capsuleGeometry args={[0.16, 0.55, 12, 16]} /></mesh>
        <group position={[0, -0.58, 0.05]}>
          <mesh material={white} castShadow><capsuleGeometry args={[0.15, 0.52, 12, 16]} /></mesh>
          <mesh position={[0, -0.38, 0.1]} material={dark} castShadow><boxGeometry args={[0.26, 0.2, 0.42]} /></mesh>
        </group>
      </group>
    </group>
  )
}

// ─── NASA GLB Loader ──────────────────────────────────────────────────────────
function NasaAstronautModel({ onModelLoaded, onModelError, onBoundsReady }) {
  const gltf = useGLTF(NASA_MODEL_PATH, DRACO_PATH)
  const normalizedScene = useMemo(() => {
    try {
      const clone   = gltf.scene.clone(true)
      const rawBox  = new THREE.Box3().setFromObject(clone)
      const rawSize = rawBox.getSize(new THREE.Vector3())
      const scale   = MODEL_HEIGHT / (Math.max(rawSize.x, rawSize.y, rawSize.z) || 1)
      clone.scale.setScalar(scale)
      const sb = new THREE.Box3().setFromObject(clone)
      const sc2 = sb.getCenter(new THREE.Vector3())
      clone.position.set(-sc2.x, -sc2.y + 0.05, -sc2.z)
      const finalBox  = new THREE.Box3().setFromObject(clone)
      const finalSize = finalBox.getSize(new THREE.Vector3())
      clone.traverse(child => {
        if (!child.isMesh) return
        child.castShadow = child.receiveShadow = true
        const n = (child.material?.name || child.name || '').toLowerCase()
        const isVisor = n.includes('visor') || n.includes('astnt1_2')
        child.material = new THREE.MeshStandardMaterial(
          isVisor
            ? { color: '#F59E0B', metalness: 0.95, roughness: 0.12, envMapIntensity: 2.0 }
            : { color: '#F8FAFC', metalness: 0.22, roughness: 0.38, envMapIntensity: 1.0 }
        )
      })
      onBoundsReady?.(finalBox, finalSize)
      onModelLoaded?.()
      return clone
    } catch (err) {
      console.warn('[NasaAstronautModel] load error → procedural', err)
      onModelError?.()
      return null
    }
  }, [gltf]) // eslint-disable-line react-hooks/exhaustive-deps
  return normalizedScene ? <primitive object={normalizedScene} /> : <ProceduralAstronaut />
}

class ModelErrorBoundary extends React.Component {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(err) { console.warn('[ModelErrorBoundary]', err); this.props.onError?.() }
  render() { return this.state.hasError ? <ProceduralAstronaut /> : this.props.children }
}

// ─── Camera lerp ─────────────────────────────────────────────────────────────
function CameraController({ target, controlsRef }) {
  useFrame(({ camera }) => {
    if (!target) return
    if (camera.position.distanceTo(target.position) > 0.02) {
      camera.position.lerp(target.position, 0.08)
      controlsRef.current?.target.lerp(target.lookAt ?? new THREE.Vector3(), 0.08)
      controlsRef.current?.update()
    }
  })
  return null
}

// ─── Screen-space projector (inside Canvas) ───────────────────────────────────
/**
 * Projects each world-space anchor to canvas pixels every frame.
 * Also computes a "facing dot" (how much the anchor faces the camera)
 * for opacity fade when rotating to the back.
 */
function ScreenProjector({ anchors, onUpdate }) {
  const { camera, gl } = useThree()
  const _v  = useMemo(() => new THREE.Vector3(), [])
  const _cam = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    const rect = gl.domElement.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    const result = {}
    for (const [id, worldPos] of Object.entries(anchors)) {
      _v.copy(worldPos).project(camera)
      const sx = (_v.x  *  0.5 + 0.5) * rect.width
      const sy = (-_v.y *  0.5 + 0.5) * rect.height
      // dot: +1 = fully facing camera, −1 = fully facing away
      _cam.copy(camera.position).sub(worldPos).normalize()
      const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
      const dot = _cam.dot(fwd)
      result[id] = { sx, sy, behind: _v.z > 1.0, dot }
    }
    onUpdate(result)
  })
  return null
}

// ─── Helper: compute pill edge point toward a target ─────────────────────────
/**
 * Returns the point on the pill boundary (rounded rect) that is
 * closest to target (tx, ty), so leader lines start at the pill edge,
 * not at the pill centre.
 */
function pillEdgePoint(cx, cy, tx, ty) {
  const hw = PILL_W / 2
  const hh = PILL_H / 2
  const dx = tx - cx
  const dy = ty - cy
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const nx = dx / len
  const ny = dy / len
  // Clamp to the rectangular half-extents
  const t = Math.min(
    dx !== 0 ? Math.abs(hw / dx) : Infinity,
    dy !== 0 ? Math.abs(hh / dy) : Infinity
  )
  return { ex: cx + nx * Math.abs(t) * len, ey: cy + ny * Math.abs(t) * len }
  // simpler: intersect the ray with the pill bounding rect
}
function pillEdge(cx, cy, tx, ty) {
  // direction from pill to target
  const dx = tx - cx
  const dy = ty - cy
  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) return { ex: cx, ey: cy }
  const hw = PILL_W / 2 + 2
  const hh = PILL_H / 2 + 2
  // parametric clip
  const tX = dx !== 0 ? hw / Math.abs(dx) : Infinity
  const tY = dy !== 0 ? hh / Math.abs(dy) : Infinity
  const t  = Math.min(tX, tY)
  return { ex: cx + dx * t, ey: cy + dy * t }
}

// ─── SVG leader-line + arrow overlay ─────────────────────────────────────────
/**
 * Pure SVG layer rendered as a sibling of the Canvas.
 * Draws for each visible hotspot:
 *   • a dashed leader line from pill-edge → anchor
 *   • an arrowhead (SVG marker) at the anchor end
 *   • a filled dot + pulsing ring at the anchor
 */
function LeaderLineSVG({ placements, screenPositions, containerW, containerH }) {
  // We animate the pulse ring with a CSS animation injected once
  useEffect(() => {
    const id = 'av3d-pulse-kf'
    if (document.getElementById(id)) return
    const style = document.createElement('style')
    style.id = id
    style.textContent = `
      @keyframes av3dPulse {
        0%   { r: 4;  opacity: 0.9; }
        70%  { r: 11; opacity: 0;   }
        100% { r: 11; opacity: 0;   }
      }
      .av3d-pulse-ring { animation: av3dPulse 1.6s ease-out infinite; }
    `
    document.head.appendChild(style)
    return () => { style.remove() }
  }, [])

  if (!placements || placements.length === 0) return null

  // Build a unique set of colors for <marker> defs (1 marker per color)
  const usedColors = [...new Set(placements.map(p => p.color))]

  return (
    <svg
      style={{
        position:      'absolute',
        inset:         0,
        width:         '100%',
        height:        '100%',
        overflow:      'hidden',
        pointerEvents: 'none',
        zIndex:        19,
      }}
      aria-hidden="true"
    >
      <defs>
        {usedColors.map(color => {
          // encode color to safe id  (#22C55E → c22C55E)
          const cid = 'av3d-arrow-' + color.replace('#', '')
          return (
            <marker
              key={cid}
              id={cid}
              markerWidth="7"
              markerHeight="7"
              refX="3.5"
              refY="3.5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              {/* solid arrowhead triangle pointing right (+X) */}
              <polygon
                points="0,1 7,3.5 0,6"
                fill={color}
                opacity="0.95"
              />
            </marker>
          )
        })}
      </defs>

      {placements.map(p => {
        const sp = screenPositions[p.id]
        if (!sp) return null

        // Anchor pixel (on body surface)
        const ax = sp.sx
        const ay = sp.sy

        // Pill centre  (after collision avoidance, placements carry final sy)
        const px = p.labelX   // assigned in HotspotOverlay
        const py = p.finalSy  // final, clamped pill-centre Y

        // Edge of pill toward the anchor
        const { ex, ey } = pillEdge(px, py, ax, ay)

        const opacity  = Math.max(BACKFACE_FADE, Math.min(1, p.dot + 0.65))
        const cid      = 'av3d-arrow-' + p.color.replace('#', '')

        return (
          <g key={p.id} opacity={opacity}>
            {/* Leader line: pill-edge → just before anchor dot */}
            <line
              x1={ex}  y1={ey}
              x2={ax}  y2={ay}
              stroke={p.color}
              strokeWidth="1.5"
              strokeDasharray="4 3"
              markerEnd={`url(#${cid})`}
              strokeLinecap="round"
            />

            {/* Pulsing ring at anchor */}
            <circle
              className="av3d-pulse-ring"
              cx={ax} cy={ay}
              r={ARROW_R}
              fill="none"
              stroke={p.color}
              strokeWidth="1.5"
            />

            {/* Solid dot at anchor */}
            <circle
              cx={ax} cy={ay}
              r={ARROW_R - 1}
              fill={p.color}
              opacity="0.95"
            />
            {/* White centre pinpoint */}
            <circle
              cx={ax} cy={ay}
              r={1.4}
              fill="#fff"
              opacity="0.9"
            />
          </g>
        )
      })}
    </svg>
  )
}

// ─── Full hotspot overlay (labels + leader SVG) ───────────────────────────────
function HotspotOverlay({
  hotspots, screenPositions, activeLayer,
  hoveredId, onHover, onClick,
  containerW, containerH
}) {
  if (!screenPositions || Object.keys(screenPositions).length === 0) return null

  // ── 1. Filter visible hotspots ──────────────────────────────────────────
  const visible = hotspots.filter(h => {
    const sp = screenPositions[h.id]
    if (!sp || sp.behind) return false
    if (activeLayer === 'vitals')          return ['head','chest','arms','abdomen'].includes(h.id)
    if (activeLayer === 'radiation')       return ['backpack'].includes(h.id)
    if (activeLayer === 'musculoskeletal') return ['legs','arms'].includes(h.id)
    return true
  })

  // ── 2. Sort by anchor Y (top → bottom) so collision pass is monotone ──
  const sorted = [...visible].sort(
    (a, b) => (screenPositions[a.id]?.sy ?? 0) - (screenPositions[b.id]?.sy ?? 0)
  )

  // ── 3. Assign sides, compute desired label Y = anchor Y ───────────────
  const placements = sorted.map((h, i) => {
    const sp = screenPositions[h.id]
    return {
      id:      h.id,
      color:   h.color,
      side:    i % 2 === 0 ? 1 : -1,  // +1 = right, -1 = left
      dot:     sp.dot,
      wantedSy: sp.sy,                 // ideal: vertically aligned with anchor
    }
  })

  // ── 4. Collision avoidance (downward pass) ────────────────────────────
  for (let i = 1; i < placements.length; i++) {
    if (placements[i].wantedSy - placements[i - 1].wantedSy < LABEL_MIN_GAP) {
      placements[i].wantedSy = placements[i - 1].wantedSy + LABEL_MIN_GAP
    }
  }

  // ── 5. Clamp inside container ─────────────────────────────────────────
  const minY = PADDING + PILL_H / 2
  const maxY = (containerH || 390) - PADDING - PILL_H / 2
  placements.forEach(p => {
    p.finalSy = Math.max(minY, Math.min(maxY, p.wantedSy))
    // Pill X centre: left/right of model centre-line, scaling down nicely on 360px-430px phones
    const midX = (containerW || 320) / 2
    const dynamicOffset = Math.min(LABEL_OFFSET_X, Math.max(65, (containerW || 320) * 0.28))
    p.labelX   = midX + p.side * dynamicOffset
    // Clamp pill X so it stays inside container
    p.labelX   = Math.max(PADDING + PILL_W / 2,
                           Math.min((containerW || 320) - PADDING - PILL_W / 2, p.labelX))
  })

  // Build lookup
  const pm = {}
  placements.forEach(p => { pm[p.id] = p })

  return (
    <>
      {/* SVG layer: leader lines + arrowheads + anchor dots */}
      <LeaderLineSVG
        placements={placements}
        screenPositions={screenPositions}
        containerW={containerW}
        containerH={containerH}
      />

      {/* Label pills */}
      {hotspots.map(h => {
        const p  = pm[h.id]
        if (!p) return null
        const sp = screenPositions[h.id]
        if (!sp || sp.behind) return null

        const opacity   = Math.max(BACKFACE_FADE, Math.min(1, p.dot + 0.65))
        const isPulse   = h.status === 'caution' || h.status === 'critical'
        const isHovered = hoveredId === h.id

        return (
          <div
            key={h.id}
            style={{
              position:      'absolute',
              left:          p.labelX,
              top:           p.finalSy,
              transform:     'translate(-50%, -50%)',
              opacity,
              zIndex:        20,
              pointerEvents: 'auto',
              transition:    'opacity 0.25s, top 0.12s',
            }}
            onMouseEnter={() => onHover(h.id)}
            onMouseLeave={() => onHover(null)}
            onClick={e => { e.stopPropagation(); onClick(h) }}
          >
            {/* Pulse ring on caution/critical */}
            {isPulse && (
              <div
                className="absolute -inset-2 rounded-full animate-ping opacity-50 pointer-events-none"
                style={{ backgroundColor: h.color }}
              />
            )}

            {/* Pill */}
            <button
              type="button"
              style={{
                backgroundColor: h.color,
                color:           '#fff',
                border:          '1.5px solid rgba(255,255,255,0.55)',
                boxShadow:       `0 0 10px 2px ${h.color}70, 0 2px 6px rgba(0,0,0,0.5)`,
              }}
              className="relative flex items-center gap-1 px-2 py-0.5 rounded-full whitespace-nowrap cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95 backdrop-blur-sm"
              title={`${h.label} — click to open module`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-white shadow-sm flex-shrink-0"
                style={{ boxShadow: `0 0 4px 1px ${h.color}` }}
              />
              <span className="text-[9px] font-black tracking-widest uppercase font-mono leading-none">
                {h.badge}
              </span>
            </button>

            {/* Tooltip card */}
            {isHovered && (
              <div
                style={{
                  position:   'absolute',
                  bottom:     'calc(100% + 8px)',
                  left:       '50%',
                  transform:  'translateX(-50%)',
                  zIndex:     30,
                  pointerEvents: 'auto',
                }}
                className="p-3 rounded-xl bg-white/97 dark:bg-slate-900/97 backdrop-blur-md border border-gray-200 dark:border-slate-700 shadow-2xl text-left w-[250px] max-w-[calc(100vw-3rem)] animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5 border-b border-gray-100 dark:border-slate-800 pb-1.5">
                  <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: h.color }} />
                    <span className="truncate">{h.label}</span>
                  </span>
                  <span
                    className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full font-mono flex-shrink-0"
                    style={{ backgroundColor: `${h.color}25`, color: h.color }}
                  >
                    {h.status}
                  </span>
                </div>
                <div className="mb-2">
                  <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Live Telemetry:</p>
                  <p className="text-[11px] font-bold font-mono text-blue-600 dark:text-blue-300">{h.telemetry}</p>
                </div>
                <div className="mb-2 p-1.5 rounded bg-gray-50 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700/60">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-0.5">
                    <Shield className="w-2.5 h-2.5 text-amber-500" />
                    NASA-STD-3001 Standard:
                  </p>
                  <p className="text-[10px] text-gray-600 dark:text-gray-300 font-mono leading-snug">{h.refRange}</p>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-slate-800 text-[9px]">
                  <span className="text-gray-400 truncate max-w-[130px]">{h.subtext}</span>
                  <span className="text-blue-600 dark:text-blue-300 font-bold flex items-center gap-0.5">
                    Open Module <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                  </span>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}

// ─── Main exported component ──────────────────────────────────────────────────
export default function AstronautViewer3D({ vitals, statuses, onFallbackTo2D }) {
  const navigate     = useNavigate()
  const controlsRef  = useRef(null)
  const containerRef = useRef(null)

  const [activeLayer,   setActiveLayer]   = useState('all')
  const [hoveredId,     setHoveredId]     = useState(null)
  const [cameraTarget,  setCameraTarget]  = useState(null)
  const [screenPos,     setScreenPos]     = useState({})
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 })
  const [modelType,     setModelType]     = useState('NASA GLB')  // eslint-disable-line

  // Track container size for clamping
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setContainerSize({ w: width, h: height })
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // ── Composite statuses ────────────────────────────────────────────────────
  const headStatus = (statuses?.temp === 'critical' || statuses?.stress === 'critical')
    ? 'critical'
    : (statuses?.temp === 'caution' || statuses?.stress === 'caution' ? 'caution' : 'nominal')

  const chestStatus = (statuses?.hr === 'critical' || statuses?.spo2 === 'critical' || statuses?.resp === 'critical')
    ? 'critical'
    : (statuses?.hr === 'caution' || statuses?.spo2 === 'caution' || statuses?.resp === 'caution' ? 'caution' : 'nominal')

  const armsStatus = (statuses?.bp === 'critical' || statuses?.muscle === 'critical')
    ? 'critical'
    : (statuses?.bp === 'caution' || statuses?.muscle === 'caution' ? 'caution' : 'nominal')

  const abdomenStatus = statuses?.hydration || 'nominal'

  const legsStatus = (statuses?.bone === 'critical' || statuses?.muscle === 'critical')
    ? 'critical'
    : (statuses?.bone === 'caution' || statuses?.muscle === 'caution' ? 'caution' : 'nominal')

  const backpackStatus = statuses?.radiation || 'nominal'

  // ── World-space anchor points (in normalized model space, height = 2.0) ──
  // After normalization + 0.05 y-nudge the model spans ≈ y ∈ [-0.95, +0.95]
  //   HEAD     → helmet centre (top front)
  //   CHEST    → sternum / chest DCU (front)
  //   BACKPACK → PLSS centre (back, negative z)
  //   ARMS     → left upper arm
  //   ABDOMEN  → waist / water manifold
  //   LEGS     → left thigh (upper leg)
  const anchors = useMemo(() => ({
    head:     new THREE.Vector3( 0.00,  0.84,  0.10),  // helmet centre
    chest:    new THREE.Vector3( 0.00,  0.42,  0.24),  // upper chest, front face
    backpack: new THREE.Vector3( 0.00,  0.38, -0.32),  // PLSS pack centre
    arms:     new THREE.Vector3(-0.46,  0.20,  0.08),  // left upper arm
    abdomen:  new THREE.Vector3( 0.00, -0.04,  0.24),  // waist, front
    legs:     new THREE.Vector3(-0.22, -0.62,  0.10),  // left thigh
  }), [])

  // ── Hotspot definitions ───────────────────────────────────────────────────
  const hotspots = useMemo(() => [
    {
      id:       'head',
      badge:    'HEAD',
      label:    'Head & Neural Telemetry',
      status:   headStatus,
      color:    sc(headStatus),
      telemetry:`Core Temp: ${vitals?.coreTemp || 36.7}°C • Cognition: ${vitals?.cognitiveScore || 92}%`,
      refRange: 'Core Temp: 36.5–37.5°C • Cognitive Speed ≥85%',
      subtext:  'EEG Neural, SANS ICP & Thermoregulation',
      route:    '/tabs/neuro-cognitive'
    },
    {
      id:       'chest',
      badge:    'CHEST',
      label:    'Chest & Bio-Harness',
      status:   chestStatus,
      color:    sc(chestStatus),
      telemetry:`HR: ${vitals?.hr || 72} bpm • SpO₂: ${vitals?.spo2 || 98}% • Resp: ${vitals?.resp || 15} br/min`,
      refRange: 'HR: 60–85 bpm • SpO₂: ≥95% • Resp: 12–20 br/min',
      subtext:  'Lead-II Surface ECG & Transthoracic Respiratory',
      route:    '/tabs/cardiovascular'
    },
    {
      id:       'backpack',
      badge:    'RAD/PLSS',
      label:    'Life Support Pack & Dosimetry',
      status:   backpackStatus,
      color:    sc(backpackStatus),
      telemetry:`Rad Rate: ${vitals?.radiationRate || 0.042} mSv/h • Shield: Active`,
      refRange: 'Instantaneous Cap: <0.15 mSv/h • Career Cap: 600 mSv',
      subtext:  'TEPC Active Dosimeter & PLSS Atm. Regulator',
      route:    '/tabs/radiation'
    },
    {
      id:       'arms',
      badge:    'BP/ARM',
      label:    'Arms & Brachial Hemodynamics',
      status:   armsStatus,
      color:    sc(armsStatus),
      telemetry:`BP: ${vitals?.bpSys || 118}/${vitals?.bpDia || 76} mmHg • Forearm EMG: Nominal`,
      refRange: 'Systolic: 90–120 mmHg • Diastolic: 60–80 mmHg',
      subtext:  'Brachial Sphygmomanometer & Forearm EMG',
      route:    '/tabs/cardiovascular'
    },
    {
      id:       'abdomen',
      badge:    'H₂O/MET',
      label:    'Abdomen & Fluid Metabolism',
      status:   abdomenStatus,
      color:    sc(abdomenStatus),
      telemetry:`Hydration: ${vitals?.hydration || 91}% • Caloric: 2,800 kcal`,
      refRange: 'Hydration: ≥90% • Metabolic Intake: 2,500–3,200 kcal/day',
      subtext:  'Bio-Impedance Fluid Shift & GI Absorption',
      route:    '/tabs/nutrition'
    },
    {
      id:       'legs',
      badge:    'BONE/LEG',
      label:    'Lower Extremities & Bone Mineral',
      status:   legsStatus,
      color:    sc(legsStatus),
      telemetry:`Bone Density: ${vitals?.boneDensity || 98}% • Muscle Mass: ${vitals?.muscleMass || 96}%`,
      refRange: 'Calcaneus loss: <1.0%/mo • Soleus Volume: ≥90%',
      subtext:  'ARED Load, Calcaneus DXA & Sarcopenia',
      route:    '/tabs/musculoskeletal'
    }
  ], [vitals, headStatus, chestStatus, armsStatus, abdomenStatus, legsStatus, backpackStatus])

  // ── Camera presets ────────────────────────────────────────────────────────
  const handleViewPreset = useCallback(view => {
    const P = new THREE.Vector3
    const presets = {
      front: { position: new THREE.Vector3(0,  0.1,  3.8), lookAt: new THREE.Vector3() },
      back:  { position: new THREE.Vector3(0,  0.1, -3.8), lookAt: new THREE.Vector3() },
      reset: { position: new THREE.Vector3(0,  0.1,  3.8), lookAt: new THREE.Vector3() },
    }
    setCameraTarget(presets[view] || null)
    if (view === 'reset') controlsRef.current?.reset()
  }, [])

  const handleHotspotClick = useCallback(h => {
    if (h.route) navigate(h.route)
  }, [navigate])

  const activeHotspot = hotspots.find(h => h.id === hoveredId)
  const handleScreenUpdate = useCallback(pos => setScreenPos(pos), [])

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="mission-card flex flex-col items-center relative overflow-hidden select-none">

      {/* Header */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-gray-100 dark:border-space-800">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-nasa-blue dark:text-nasa-blueLight" />
          <h3 className="heading-display text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
            EXPLORATION SPACESUIT 3D BIO-TELEMETRY
          </h3>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center bg-gray-100 dark:bg-space-800 p-0.5 rounded-xl border border-gray-200 dark:border-space-700 text-xs">
            <button onClick={() => handleViewPreset('front')} className="min-h-[44px] px-3 py-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-semibold transition-colors">Front</button>
            <button onClick={() => handleViewPreset('back')}  className="min-h-[44px] px-3 py-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-semibold transition-colors">Back</button>
            <button onClick={() => handleViewPreset('reset')} className="min-h-[44px] min-w-[44px] flex items-center justify-center p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" title="Reset View" aria-label="Reset View">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          {onFallbackTo2D && (
            <button onClick={onFallbackTo2D} className="min-h-[44px] text-xs px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-space-800 hover:bg-gray-200 dark:hover:bg-space-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-space-700 font-mono transition-colors" title="Switch to 2D SVG Diagram">
              2D Diagram
            </button>
          )}
        </div>
      </div>

      {/* Layer filter */}
      <div className="w-full flex items-center justify-between gap-2 mb-2 px-1">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Layers className="w-3.5 h-3.5 text-nasa-blue" />
          <span className="font-semibold uppercase hidden sm:inline">Telemetry Layers:</span>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-space-800 p-1 rounded-xl border border-gray-200 dark:border-space-700 text-xs overflow-x-auto max-w-full">
          {[
            { id: 'all',             label: 'All Systems'     },
            { id: 'vitals',          label: 'Vitals'          },
            { id: 'radiation',       label: 'Radiation'       },
            { id: 'musculoskeletal', label: 'Musculoskeletal' },
          ].map(l => (
            <button
              key={l.id}
              onClick={() => setActiveLayer(l.id)}
              className={`min-h-[44px] px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                activeLayer === l.id
                  ? 'bg-nasa-blue text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/*
        ── Canvas + overlay wrapper ──────────────────────────────────────────
        position:relative + overflow:hidden = absolute children CANNOT escape.
        The HotspotOverlay div is a sibling of the Canvas, both inside this div.
      */}
      <div
        ref={containerRef}
        style={{ position: 'relative', overflow: 'hidden' }}
        className="w-full h-[52vh] min-h-[350px] max-h-[460px] sm:h-[390px] rounded-xl bg-radial from-slate-900 via-space-950 to-black border border-gray-200/80 dark:border-space-700/80 shadow-inner"
      >
        {/* HUD watermarks */}
        <div className="absolute top-2 left-3 z-10 pointer-events-none flex items-center gap-1.5 text-[9px] font-mono text-cyan-400/80">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>REAL-TIME 3D SPATIAL TELEMETRY</span>
        </div>
        <div className="absolute top-2 right-3 z-10 pointer-events-none text-[9px] font-mono text-gray-400 text-right">
          DRAG TO ROTATE • SCROLL PAGE OUTSIDE
        </div>

        {/* Three.js Canvas */}
        <Canvas
          dpr={typeof window !== 'undefined' && window.innerWidth < 768 ? [1, 1.25] : [1, 2]}
          camera={{ position: [0, 0.1, 3.8], fov: 46 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%', cursor: 'grab' }}
        >
          <Stars radius={45} depth={25} count={1000} factor={2.5} saturation={0.5} fade speed={0.8} />
          <ambientLight intensity={0.65} />
          <directionalLight position={[ 4,  5,  4]} intensity={1.35} castShadow />
          <directionalLight position={[-4,  3, -4]} intensity={1.1}  color="#38BDF8" />
          <directionalLight position={[ 0, -3,  2]} intensity={0.3}  color="#94A3B8" />

          {/* Glow pedestal ring */}
          <group position={[0, -1.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh><ringGeometry args={[0.02, 0.9, 64]} /><meshBasicMaterial color="#1E6BFF" transparent opacity={0.12} side={THREE.DoubleSide} /></mesh>
            <mesh><ringGeometry args={[0.88, 0.92, 64]} /><meshBasicMaterial color="#38BDF8" transparent opacity={0.45} side={THREE.DoubleSide} /></mesh>
          </group>

          <ContactShadows position={[0, -1.09, 0]} opacity={0.65} scale={3} blur={1.8} far={2.5} color="#020617" />

          <Suspense fallback={<ProceduralAstronaut />}>
            <ModelErrorBoundary onError={() => setModelType('Procedural')}>
              <NasaAstronautModel
                onModelLoaded={() => setModelType('NASA GLB')}
                onModelError={() => setModelType('Procedural')}
                onBoundsReady={() => {}}
              />
            </ModelErrorBoundary>
          </Suspense>

          {/* Projects anchors to screen coords every frame (the RAF loop) */}
          <ScreenProjector anchors={anchors} onUpdate={handleScreenUpdate} />

          <CameraController target={cameraTarget} controlsRef={controlsRef} />

          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.06}
            minDistance={2.0}
            maxDistance={5.5}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={(5 * Math.PI) / 6}
            autoRotate
            autoRotateSpeed={0.6}
            enablePan={false}
            rotateSpeed={0.75}
          />
        </Canvas>

        {/*
          Overlay div: position:absolute inset:0
          pointer-events:none on the wrapper; individual pills opt-in with pointer-events:auto
          z-index:18 → below nav/modals but above WebGL canvas
        */}
        <div
          style={{
            position:      'absolute',
            inset:         0,
            pointerEvents: 'none',
            zIndex:        18,
          }}
        >
          <HotspotOverlay
            hotspots={hotspots}
            screenPositions={screenPos}
            activeLayer={activeLayer}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            onClick={handleHotspotClick}
            containerW={containerSize.w}
            containerH={containerSize.h}
          />
        </div>
      </div>

      {/* Active hotspot telemetry bar */}
      <div className="w-full min-h-[58px] p-2.5 mt-2 rounded-lg bg-gray-50 dark:bg-space-800 border border-gray-200 dark:border-space-700 flex items-center justify-between transition-all">
        {activeHotspot ? (
          <div className="flex items-center gap-2.5">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0 animate-ping"
              style={{ backgroundColor: activeHotspot.color }}
            />
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>{activeHotspot.label}</span>
                <span className="text-[10px] uppercase font-semibold font-mono" style={{ color: activeHotspot.color }}>
                  [{activeHotspot.status}]
                </span>
              </p>
              <p className="text-[11px] font-mono text-blue-600 dark:text-blue-300 font-semibold">
                {activeHotspot.telemetry}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center w-full text-xs text-gray-400">
            Rotate 3D model &amp; hover/tap any hotspot to inspect NASA biometrics • Click to open module
          </div>
        )}
      </div>

      {/* Attribution */}
      <div className="w-full text-center text-[10px] text-gray-400 dark:text-gray-500 pt-2 mt-2 border-t border-gray-100 dark:border-space-800">
        3D model: NASA 3D Resources (nasa3d.arc.nasa.gov), original author DigitalSpace Corporation.
      </div>
    </div>
  )
}
