"use client"

import { useEffect, useRef } from "react"

type Variant = "landing" | "sorting" | "searching" | "graph"

export default function AlgorithmBackground({ variant }: { variant: Variant }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")!
    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight

    let mouseX = w / 2
    let mouseY = h / 2

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    window.addEventListener("mousemove", onMouseMove)

    const count =
      variant === "graph" ? 70 :
      variant === "sorting" ? 45 :
      variant === "searching" ? 30 :
      50

    const nodes = Array.from({ length: count }).map((_, i) => ({
      x: Math.random() * w,
      y: variant === "sorting" ? (i / count) * h : Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      /* GRID (mouse reactive) */
      const gx = (mouseX / w - 0.5) * 40
      const gy = (mouseY / h - 0.5) * 40

      ctx.strokeStyle = "rgba(255,255,255,0.04)"
      for (let x = 0; x < w; x += 60) {
        ctx.beginPath()
        ctx.moveTo(x + gx, 0)
        ctx.lineTo(x + gx, h)
        ctx.stroke()
      }
      for (let y = 0; y < h; y += 60) {
        ctx.beginPath()
        ctx.moveTo(0, y + gy)
        ctx.lineTo(w, y + gy)
        ctx.stroke()
      }

      /* PARTICLES */
      nodes.forEach((n, i) => {
        n.x += n.vx
        n.y += n.vy

        if (n.x < 0 || n.x > w) n.vx *= -1
        if (n.y < 0 || n.y > h) n.vy *= -1

        ctx.fillStyle = "rgba(59,130,246,0.7)"
        ctx.beginPath()
        ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2)
        ctx.fill()

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j]
          const dx = n.x - m.x
          const dy = n.y - m.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          const max =
            variant === "searching" ? 80 :
            variant === "sorting" ? 110 :
            150

          if (dist < max) {
            ctx.strokeStyle = `rgba(59,130,246,${0.12 - dist / max / 10})`
            ctx.beginPath()
            ctx.moveTo(n.x, n.y)
            ctx.lineTo(m.x, m.y)
            ctx.stroke()
          }
        }
      })

      requestAnimationFrame(draw)
    }

    draw()

    const onResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }

    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("resize", onResize)
      window.removeEventListener("mousemove", onMouseMove)
    }
  }, [variant])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
    />
  )
}
