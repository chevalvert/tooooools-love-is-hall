import Store from 'store'

const GROWTH_STRATEGIES = [
  [1, 1, 1, 1],
  [1, 0, 1, 1],
  [1, 1, 0, 1],
  [1, 1, 0, 0],
  [0, 0, 1, 1],
  [1, 1, 0, 0],
  [1, 0, 0, 1],
  [0, 1, 1, 0]
]

export default class VirtualCell {
  constructor (x, y, width = 1, height = 1, isLocked = false) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.isLocked = isLocked
  }

  get xmax () { return this.x + this.width }
  get ymax () { return this.y + this.height }

  project (growth = [0, 0, 0, 0]) {
    return {
      xmin: this.x - growth[0],
      ymin: this.y - growth[1],
      xmax: this.x + this.width + growth[2],
      ymax: this.y + this.height + growth[3],
      ratio: (this.width + growth[2] - growth[0]) / (this.height + growth[3] - growth[1])
    }
  }

  intersects (cell, growth = [0, 0, 0, 0]) {
    const { xmin, xmax, ymin, ymax } = this.project(growth)
    return this !== cell && (
      xmin < cell.xmax &&
      xmax > cell.x &&
      ymin < cell.ymax &&
      ymax > cell.y
    )
  }

  contains ([x, y]) {
    return x >= this.x && x < this.xmax && y >= this.y && y < this.ymax
  }

  overflows (growth) {
    const cols = Store.wall.cols.get()
    const rows = Store.wall.rows.get()
    const { xmin, xmax, ymin, ymax } = this.project(growth)
    return xmin < 0 || ymin < 0 || xmax > cols || ymax > rows
  }

  grow (cells, growthStrategy = GROWTH_STRATEGIES) {
    let hasGrown = false
    if (this.isLocked) return hasGrown

    for (const growth of growthStrategy) {
      const hit = cells.find(cell => this.intersects(cell, growth))
      if (hit || this.overflows(growth)) continue

      this.x -= growth[0]
      this.y -= growth[1]
      this.width += growth[0] + growth[2]
      this.height += growth[1] + growth[3]
      hasGrown = true
      break
    }

    return hasGrown
  }
}
