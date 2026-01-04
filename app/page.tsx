"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

type Node = {
  x: number
  y: number
  vx: number
  vy: number
  level: number
}

export default function LandingPage() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  /* ---------------- Mouse tracking ---------------- */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  /* ---------------- Algorithm-themed background ---------------- */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")!
    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight

    /* Tree / graph-like structure */
    const LEVELS = 5
    const nodes: Node[] = []

    for (let level = 0; level < LEVELS; level++) {
      const count = Math.pow(2, level)
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: (i + 1) * (w / (count + 1)),
          y: (level + 1) * (h / (LEVELS + 1)),
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          level,
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      /* -------- GRID (mouse reactive) -------- */
      const gridSize = 60
      const offsetX = (mouse.x / w - 0.5) * 30
      const offsetY = (mouse.y / h - 0.5) * 30

      ctx.strokeStyle = "rgba(255,255,255,0.04)"
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x + offsetX, 0)
        ctx.lineTo(x + offsetX, h)
        ctx.stroke()
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y + offsetY)
        ctx.lineTo(w, y + offsetY)
        ctx.stroke()
      }

      /* -------- TREE / GRAPH -------- */
      nodes.forEach((n) => {
        n.x += n.vx
        n.y += n.vy

        if (n.x < 0 || n.x > w) n.vx *= -1
        if (n.y < 0 || n.y > h) n.vy *= -1

        ctx.fillStyle = "rgba(59,130,246,0.7)"
        ctx.beginPath()
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2)
        ctx.fill()
      })

      /* Edges (parent → child) */
      nodes.forEach((a) => {
        nodes.forEach((b) => {
          if (b.level === a.level + 1) {
            const dx = a.x - b.x
            const dy = a.y - b.y
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < 220) {
              ctx.strokeStyle = "rgba(59,130,246,0.12)"
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.stroke()
            }
          }
        })
      })

      requestAnimationFrame(draw)
    }

    draw()

    const onResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }

    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [mouse.x, mouse.y])

  return (
    <main className="relative h-screen overflow-hidden text-white">

      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1830] via-[#0d2547] to-[#09152a]" />

      {/* Canvas: grid + algorithm graph */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-[2]"
      />

      {/* Mouse glow */}
      <div
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{
          background: `radial-gradient(
            500px at ${mouse.x}px ${mouse.y}px,
            rgba(59,130,246,0.18),
            transparent 70%
          )`,
        }}
      />

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/30 via-transparent to-black/40" />

      {/* HERO CONTENT */}
      <section className="relative z-10 h-full flex items-center justify-center">
        <div className="max-w-3xl text-center px-6">

          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-blue-500">Algo</span>Wizard Visualizer
          </h1>

          <p className="text-white/75 text-lg md:text-xl mb-10">
            Interactive visualizations designed to make algorithms easy to
            understand, step by step.
          </p>

          <Link
            href="/visualizer"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              setBtnOffset({
                x: (e.clientX - r.left - r.width / 2) * 0.25,
                y: (e.clientY - r.top - r.height / 2) * 0.25,
              })
            }}
            onMouseLeave={() => setBtnOffset({ x: 0, y: 0 })}
            style={{ transform: `translate(${btnOffset.x}px, ${btnOffset.y}px)` }}
            className="
              inline-flex items-center justify-center
              bg-blue-500 text-white
              px-8 py-4 rounded-full text-lg font-medium
              transition-all duration-300
              hover:bg-blue-600
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            Launch Visualizer →
          </Link>

        </div>
      </section>
    </main>
  )
}
