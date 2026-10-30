// 1-bit image processing shared by the hero portrait and the startup animation.
// Pure functions over canvas data: no React, no WebGL.

export type Grid = { cols: number; rows: number; luma: Float32Array }

// Samples `img` (object-fit: cover) into a cols×rows luminance grid with a tone curve.
export function sampleGrid(
  img: CanvasImageSource & { width: number; height: number },
  cols: number,
  rows: number,
  gamma = 0.8,
  contrast = 1.1
): Grid {
  const c = document.createElement('canvas')
  c.width = cols
  c.height = rows
  const ctx = c.getContext('2d', { willReadFrequently: true })!
  const ir = img.width / img.height
  const gr = cols / rows
  let sw = img.width
  let sh = img.height
  let sx = 0
  let sy = 0
  if (ir > gr) {
    sw = img.height * gr
    sx = (img.width - sw) / 2
  } else {
    sh = img.width / gr
    sy = (img.height - sh) / 2
  }
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows)
  const data = ctx.getImageData(0, 0, cols, rows).data
  const luma = new Float32Array(cols * rows)
  for (let i = 0; i < luma.length; i++) {
    let l = (0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]) / 255
    l = (Math.pow(l, gamma) - 0.5) * contrast + 0.5
    luma[i] = l < 0 ? 0 : l > 1 ? 1 : l
  }
  return { cols, rows, luma }
}

// Atkinson error diffusion: crisp, high-contrast 1-bit output (the classic Macintosh look).
export function atkinson({ cols, rows, luma }: Grid) {
  const e = Float32Array.from(luma)
  const out = new Uint8Array(cols * rows)
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x
      const o = e[i] > 0.5 ? 1 : 0
      out[i] = o
      const err = (e[i] - o) / 8
      if (x + 1 < cols) e[i + 1] += err
      if (x + 2 < cols) e[i + 2] += err
      if (y + 1 < rows) {
        if (x > 0) e[i + cols - 1] += err
        e[i + cols] += err
        if (x + 1 < cols) e[i + cols + 1] += err
      }
      if (y + 2 < rows) e[i + 2 * cols] += err
    }
  }
  return out
}

export const hexToRgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

// Paints a bit grid into a tiny canvas (one pixel per cell) to be scaled up with nearest-neighbour.
export function paintBits(
  bits: Uint8Array,
  cols: number,
  rows: number,
  on: string,
  off: string,
  target?: HTMLCanvasElement
) {
  const c = target ?? document.createElement('canvas')
  c.width = cols
  c.height = rows
  const ctx = c.getContext('2d')!
  const img = ctx.createImageData(cols, rows)
  const a = hexToRgb(on)
  const b = hexToRgb(off)
  for (let i = 0; i < bits.length; i++) {
    const col = bits[i] ? a : b
    img.data[i * 4] = col[0]
    img.data[i * 4 + 1] = col[1]
    img.data[i * 4 + 2] = col[2]
    img.data[i * 4 + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  return c
}

export function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
