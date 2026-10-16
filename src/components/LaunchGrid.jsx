import { useEffect, useRef } from 'react'

// Columns of flat dashes. "Launch signals" shoot up each column and light the
// dashes they pass through, stepping down a solid purple scale (no gradients).
// Intro: zooms out from deep in. Scroll: keeps zooming out and fades.
// Cursor brightens nearby dashes; window event `launchmania:burst` fires every column.

const SHADES = [
  [0.05, '#1b1530'],
  [0.16, '#241a3d'],
  [0.28, '#3d2a6e'],
  [0.4, '#5b3fb0'],
  [0.52, '#7c56e8'],
  [0.64, '#9d7bff'],
  [0.76, '#c2a1ff'],
  [0.86, '#dfc5ff'],
  [0.94, '#e9ddff'],
  [1.01, '#ffffff'],
]

function shade(v) {
  for (const [t, c] of SHADES) if (v < t) return c
  return '#ffffff'
}

const COL_W = 62
const DASH_W = 46
const DASH_H = 5
const ROW_H = 24
const INTRO_MS = 1800

export function burst() {
  window.dispatchEvent(new Event('launchmania:burst'))
}

export default function LaunchGrid() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let w = 0, h = 0, cols = [], rows = 0, raf = 0, start = performance.now()
    const mouse = { x: -9999, y: -9999 }

    function layout() {
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      const n = Math.ceil(w / COL_W) + 1
      const offset = (w - (n - 1) * COL_W - DASH_W) / 2
      rows = Math.ceil(h / ROW_H) + 1
      cols = Array.from({ length: n }, (_, i) => {
        const x = offset + i * COL_W
        // Keep the middle calm so the headline stays readable.
        const d = Math.abs(x + DASH_W / 2 - w / 2) / (w / 2)
        const inner = w < 760 ? 0.0 : 0.38
        const mask = w < 760 ? 0.2 : d < inner ? 0.06 : Math.min(1, 0.06 + ((d - inner) / 0.22) * 0.94)
        return {
          x,
          mask,
          base: Math.random() * 0.22,
          pulses: [],
          next: Math.random() * 2500,
        }
      })
    }

    function spawn(col, now, strong) {
      col.pulses.push({
        born: now,
        speed: (strong ? 0.5 : 0.18) + Math.random() * 0.35, // px per ms
        len: (strong ? 10 : 5) + Math.random() * 14, // rows of trail
        peak: strong ? 1 : 0.65 + Math.random() * 0.35,
      })
    }

    function onBurst() {
      cols.forEach((c, i) => setTimeout(() => spawn(c, performance.now(), true), Math.abs(i - cols.length / 2) * 35 + Math.random() * 80))
    }

    function draw(now) {
      const t = now - start
      // Intro zoom-out: 2.4x → 1x with an ease-out curve.
      const ip = reduce ? 1 : Math.min(1, t / INTRO_MS)
      const ease = 1 - Math.pow(1 - ip, 4)
      const heroH = canvas.parentElement.offsetHeight || h
      const sp = Math.min(1, Math.max(0, window.scrollY / heroH))
      const scale = (2.4 - 1.4 * ease) * (1 - 0.28 * sp)
      const alpha = ease * (1 - 0.85 * sp)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.globalAlpha = alpha
      ctx.translate(w / 2, h / 2)
      ctx.scale(scale, scale)
      ctx.translate(-w / 2, -h / 2)

      // Screen → canvas space for the cursor.
      const mx = (mouse.x - w / 2) / scale + w / 2
      const my = (mouse.y - h / 2) / scale + h / 2

      for (const col of cols) {
        if (!reduce && now > col.next) {
          spawn(col, now, false)
          col.next = now + 1400 + Math.random() * 4200
        }
        col.pulses = col.pulses.filter((p) => h - (now - p.born) * p.speed > -p.len * ROW_H)

        for (let r = 0; r < rows; r++) {
          const y = r * ROW_H + 6
          let v = col.base
          for (const p of col.pulses) {
            const head = h - (now - p.born) * p.speed
            const d = (y - head) / ROW_H // rows behind the head
            if (d >= 0 && d < p.len) v = Math.max(v, p.peak * (1 - d / p.len))
          }
          const dx = mx - (col.x + DASH_W / 2)
          const dy = my - y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 170) v = Math.max(v, 0.85 * (1 - dist / 170))

          v *= col.mask
          if (v < 0.05) continue
          ctx.fillStyle = shade(v)
          ctx.fillRect(col.x, y, DASH_W, DASH_H)
        }
      }

      ctx.globalAlpha = 1
      if (!reduce) raf = requestAnimationFrame(draw)
    }

    function onMove(e) {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    function onLeave() {
      mouse.x = mouse.y = -9999
    }

    layout()
    // Seed a few signals so the grid isn't empty on first paint.
    cols.forEach((c) => {
      if (Math.random() < 0.45) c.pulses.push({ born: start - Math.random() * 3000, speed: 0.2 + Math.random() * 0.3, len: 6 + Math.random() * 12, peak: 0.8 })
    })
    raf = requestAnimationFrame(draw)

    const ro = new ResizeObserver(() => { layout(); if (reduce) draw(performance.now()) })
    ro.observe(canvas)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('launchmania:burst', onBurst)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('launchmania:burst', onBurst)
    }
  }, [])

  return <canvas ref={ref} className="launchgrid" aria-hidden="true" />
}
