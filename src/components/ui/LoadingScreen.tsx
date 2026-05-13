'use client'

import { useEffect, useState, useMemo } from 'react'

const TAGLINES = [
  'Connecting you to trusted professionals',
  'Building your trusted network',
  'Finding reliable experts near you',
]

const SERVICES = [
  { label: 'Electrician', color: '#fbbf24' },
  { label: 'Plumber',     color: '#60a5fa' },
  { label: 'Carpenter',   color: '#f59e0b' },
  { label: 'Cleaner',     color: '#34d399' },
  { label: 'Mechanic',    color: '#f97316' },
  { label: 'Painter',     color: '#a78bfa' },
  { label: 'AC Tech',     color: '#22d3ee' },
  { label: 'Delivery',    color: '#fb923c' },
]

interface NodeConfig {
  index: number
  cx: number
  cy: number
  label: string
  color: string
  connections: number[]
}

const NODE_RADIUS = 22
const CENTER_X = 160
const CENTER_Y = 160
const ORBIT = 110

function nodes(): NodeConfig[] {
  return SERVICES.map((svc, i) => {
    const angle = (i / SERVICES.length) * Math.PI * 2 - Math.PI / 2
    const cx = CENTER_X + ORBIT * Math.cos(angle)
    const cy = CENTER_Y + ORBIT * Math.sin(angle)
    return {
      index: i,
      cx: Math.round(cx * 10) / 10,
      cy: Math.round(cy * 10) / 10,
      label: svc.label,
      color: svc.color,
      connections: [
        (i - 1 + SERVICES.length) % SERVICES.length,
        (i + 1) % SERVICES.length,
        (i + 4) % SERVICES.length,
      ],
    }
  })
}

function nodePath(label: string): string {
  switch (label) {
    case 'Electrician':
      return 'M13 2L3 14h8l-2 8 10-12h-8z'
    case 'Plumber':
      return 'M12 2C8 8 6 12 6 15c0 3.3 2.7 6 6 6s6-2.7 6-6c0-3-2-7-6-13z'
    case 'Carpenter':
      return 'M8 3l-5 5 8 8 5-5z M16 11l5-5'
    case 'Cleaner':
      return 'M12 2l1 3 3-1-1 3 3 1-3 1 1 3-3-1-1 3-1-3-3 1 1-3-3-1 3-1-1-3 3 1z'
    case 'Mechanic':
      return 'M12 2v3m0 14v3M2 12h3m14 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6l2.1-2.1'
    case 'Painter':
      return 'M3 3h14v5H3z M10 8v11 M14 8v7'
    case 'AC Tech':
      return 'M12 2v20M2 12h20 M6 6l12 12 M18 6l-12 12'
    case 'Delivery':
      return 'M3 4h18v14H3z M3 10h18 M9 4v14 M15 4v14'
    default:
      return 'M12 2a10 10 0 100 20 10 10 0 000-20z'
  }
}

function Dot({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <div
      className="absolute w-[2px] h-[2px] rounded-full bg-white/20 ls-particle"
      style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${delay}s` }}
    />
  )
}

function LightTrail({ cx1, cy1, cx2, cy2, delay }: { cx1: number; cy1: number; cx2: number; cy2: number; delay: number }) {
  const midX = (cx1 + cx2) / 2
  const midY = (cy1 + cy2) / 2
  return (
    <circle r="2" fill="#22d3ee" className="ls-light-trail" style={{ animationDelay: `${delay}s` }}>
      <animateMotion
        dur="3s"
        repeatCount="indefinite"
        path={`M${cx1},${cy1} Q${midX + (cy2 - cy1) * 0.3},${midY - (cx2 - cx1) * 0.3} ${cx2},${cy2}`}
        begin={`${delay}s`}
      />
    </circle>
  )
}

export default function LoadingScreen() {
  const [taglineIndex, setTaglineIndex] = useState(0)
  const [phase, setPhase] = useState(0)
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  const net = useMemo(() => nodes(), [])
  const linkDefs = useMemo(() => {
    const seen = new Set<string>()
    const defs: { x1: number; y1: number; x2: number; y2: number; idx: number }[] = []
    for (const n of net) {
      for (const conn of n.connections) {
        const key = [n.index, conn].sort().join('-')
        if (!seen.has(key)) {
          seen.add(key)
          defs.push({
            x1: n.cx,
            y1: n.cy,
            x2: net[conn].cx,
            y2: net[conn].cy,
            idx: defs.length,
          })
        }
      }
    }
    return defs
  }, [net])

  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
    }))
  }, [])

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400)
    const t2 = setTimeout(() => setPhase(2), 1200)
    const t3 = setTimeout(() => setPhase(3), 2400)
    const t4 = setTimeout(() => setPhase(4), 3500)
    const t5 = setTimeout(() => setFadeOut(true), 4500)
    const t6 = setTimeout(() => setVisible(false), 5000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); clearTimeout(t6) }
  }, [])

  useEffect(() => {
    if (phase < 2) return
    const interval = setInterval(() => {
      setTaglineIndex((i) => (i + 1) % TAGLINES.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [phase])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #0f1729 0%, #080c18 50%, #050810 100%)',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.08] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #22d3ee 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Particles */}
      {particles.map((p, i) => (
        <Dot key={i} x={p.x} y={p.y} delay={p.delay} />
      ))}

      {/* Header text */}
      <div className="relative z-10 text-center mb-4 sm:mb-6">
        <h1
          className={`font-display text-2xl sm:text-3xl font-bold tracking-tight transition-all duration-1000 ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{
            background: 'linear-gradient(135deg, #f0f4ff 0%, #22d3ee 50%, #fbbf24 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Anywork365
        </h1>
        <p
          className={`text-sm text-white/40 mt-1.5 transition-all duration-700 ${phase >= 2 ? 'opacity-100' : 'opacity-0'}`}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {TAGLINES[taglineIndex]}
        </p>
      </div>

      {/* Network SVG */}
      <div className="relative w-[320px] h-[320px] flex-shrink-0">
        <svg viewBox="0 0 320 320" className="w-full h-full">
          <defs>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Center glow */}
          <circle cx={CENTER_X} cy={CENTER_Y} r="80" fill="url(#centerGlow)" />

          {/* Pulse rings */}
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r="30"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="0.8"
            className="ls-pulse-ring"
            opacity={phase >= 1 ? 1 : 0}
          />
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r="60"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="0.5"
            className="ls-pulse-ring-slow"
            opacity={phase >= 1 ? 1 : 0}
          />
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r="90"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="0.3"
            className="ls-pulse-ring-slower"
            opacity={phase >= 1 ? 1 : 0}
          />

          {/* Center hub */}
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r="8"
            fill="#22d3ee"
            opacity={phase >= 1 ? 0.8 : 0}
            className="ls-hub-pulse"
          />
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r="14"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="1"
            opacity={phase >= 1 ? 0.4 : 0}
            className="ls-hub-glow"
          />

          {/* Network lines */}
          {linkDefs.map((link) => (
            <line
              key={link.idx}
              x1={link.x1}
              y1={link.y1}
              x2={link.x2}
              y2={link.y2}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.8"
              className="ls-line-draw"
              style={{
                animationDelay: `${0.5 + link.idx * 0.08}s`,
                opacity: phase >= 1 ? 1 : 0,
              }}
            />
          ))}

          {/* Light trails */}
          {phase >= 1 && linkDefs.slice(0, 6).map((link, i) => (
            <LightTrail
              key={`trail-${i}`}
              cx1={link.x1}
              cy1={link.y1}
              cx2={link.x2}
              cy2={link.y2}
              delay={1.5 + i * 0.4}
            />
          ))}

          {/* Nodes */}
          {net.map((node) => {
            const nodePhase = Math.max(0, Math.min(1, (phase - 1.5) * 2 - node.index * 0.12))
            const showCheck = phase >= 3 && (node.index === 1 || node.index === 3 || node.index === 5 || node.index === 7)
            return (
              <g
                key={node.index}
                className="ls-node-appear"
                style={{
                  opacity: nodePhase,
                  transform: `scale(${0.6 + 0.4 * nodePhase})`,
                  transformOrigin: `${node.cx}px ${node.cy}px`,
                }}
              >
                {/* Node glow */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={NODE_RADIUS + 6}
                  fill="none"
                  stroke={node.color}
                  strokeWidth="1.5"
                  opacity={phase >= 2 ? 0.3 : 0}
                  className="ls-node-glow"
                  style={{ animationDelay: `${1.5 + node.index * 0.15}s` }}
                />

                {/* Node bg */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={NODE_RADIUS}
                  fill="#0f1729"
                  stroke={node.color}
                  strokeWidth="1"
                  opacity={0.8 + 0.2 * nodePhase}
                  style={{
                    boxShadow: phase >= 2 ? `0 0 12px ${node.color}44` : 'none',
                  }}
                />

                {/* Node icon */}
                <g
                  transform={`translate(${node.cx - 10}, ${node.cy - 10}) scale(0.83)`}
                  opacity={0.9}
                >
                  <path
                    d={nodePath(node.label)}
                    fill="none"
                    stroke={node.color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>

                {/* Checkmark */}
                {showCheck && (
                  <g
                    className="ls-check-appear"
                    transform={`translate(${node.cx + 10}, ${node.cy - 10})`}
                  >
                    <circle r="8" fill="#059669" />
                    <path
                      d="M-3,1 L-1,3 L4,-2"
                      fill="none"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Loading bar */}
      <div className="relative z-10 mt-6 sm:mt-8 w-48 sm:w-56">
        <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${Math.min(100, phase * 28)}%`,
              background: 'linear-gradient(90deg, #22d3ee, #fbbf24)',
            }}
          />
        </div>
        <p className="text-[10px] text-white/20 text-center mt-2 tracking-widest uppercase">
          Securing connection
        </p>
      </div>
    </div>
  )
}
