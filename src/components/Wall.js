import Store from 'store'
import { Component } from 'utils/jsx'
import Prng from 'utils/prng'
import dedup from 'utils/array-uniq'

import VirtualCell from 'abstractions/VirtualCell'

import Cell from 'components/Cell'
import HallNumber from 'components/HallNumber'
import SYMBOLS from 'controllers/symbols'

export default class Wall extends Component {
  beforeRender (props) {
    Prng.seed = Store.seed.get()

    this.state = {
      cols: Store.wall.cols.get(),
      rows: Store.wall.rows.get(),
      width: Store.wall.cols.get() * Store.cell.size.get(),
      height: Store.wall.rows.get() * Store.cell.size.get(),
      colors: {
        primary: Prng.randomOf(Store.colors.primary.get()),
        secondary: Prng.shuffle([...Store.colors.secondary.get()])
          .splice(0, Store.colors.length.get())
      }
    }
  }

  template (props) {
    const { width, height } = this.state

    const symbols = SYMBOLS.map(symbol => (
      <symbol id={symbol.filename}>
        {symbol.toJsx()}
      </symbol>
    ))

    return (
      <svg
        ref={this.ref('svg')}
        class='wall'
        width={`${width}${Store.cell.unit.get()}`}
        height={`${height}${Store.cell.unit.get()}`}
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>{symbols}</defs>
        {this.renderCells()}
        {this.renderGrid()}
      </svg>
    )
  }

  renderCells () {
    // Create a special locked cell wich represents existing occupied cells in
    // the real wall
    const hallNumber = new VirtualCell(2, 3, 2, 2, true)

    // 1 -
    // Create an array of unique position and assign a cell on each one,
    // removing possible cell overlapping with the hall number
    const cells = randomlyFill.call(this, Store.wall.cellsLength.get(), {
      indexes: new Array(this.state.cols * this.state.rows).fill(0).map((_, i) => i),
      existingCells: [hallNumber]
    })
    cells.push(hallNumber)

    // 2 -
    // Grow cells using a relatively rigid growth strategy, trying to keep a
    // relatively square ratio
    grow([
      [1, 1, 1, 1],
      [1, 0, 1, 1],
      [1, 1, 0, 1],
      [1, 1, 0, 0],
      [0, 0, 1, 1],
      [1, 1, 0, 0],
      [1, 0, 0, 1],
      [0, 1, 1, 0]
    ])

    // 2 bis -
    // Grow cells using a far more fluid strategy to fill empty spaces
    grow([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]])

    // 3 -
    // Fill possible empty cells left after growth by creating new Cells and
    // growing them with a fluid growth strategy
    const emptyCells = []
    let iter = 0
    while (!emptyCells.length && ++iter < 10) {
      emptyCells.length = 0
      for (let index = 0; index < this.state.cols * this.state.rows; index++) {
        const x = index % this.state.cols
        const y = (index - x) / this.state.cols
        const isEmpty = !cells.find(cell => cell.contains([x, y]))
        if (isEmpty) emptyCells.push(index)
      }

      const newCells = randomlyFill.call(this, Math.ceil(emptyCells.length / 3), { indexes: emptyCells, existingCells: cells })
      newCells.forEach(cell => cells.push(cell))

      grow([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]])
    }

    Prng.reset()
    // Transform virtual cells to jsx
    return cells.sort((a, b) => a.y - b.y).sort((a, b) => a.x - b.x).map(({ x, y, width, height, isLocked }, index) => {
      const colors = [
        this.state.colors.primary,
        ...this.state.colors.secondary
      ]

      const props = {
        x,
        y,
        width,
        height,
        color: colors[index % colors.length]
      }

      return (isLocked
        ? <HallNumber {...props} number={Prng.randomInt(1, 22)} /> // TODO: number based on primary color
        : <Cell {...props} />
      )
    })

    // Return an array of VirtualCell from an array of 1D indexes representing
    // possible cell positions
    function randomlyFill (length, {
      indexes = [],
      existingCells = []
    }) {
      return Prng.shuffle(dedup(indexes)).splice(0, length).map(index => {
        const x = index % this.state.cols
        const y = (index - x) / this.state.cols
        return new VirtualCell(x, y)
      }).filter(cell => {
        for (const existingCell of existingCells) {
          if (cell.intersects(existingCell)) return false
        }
        return true
      })
    }

    // Grow all cells sequentially based on a growth strategy, until no cell
    // cannot grow anymore
    function grow (growthStrategy) {
      while (true) {
        let hasGrown = false
        for (const cell of cells) {
          hasGrown = cell.grow(cells, growthStrategy)
          if (hasGrown) break
        }
        if (!hasGrown) break
      }
    }
  }

  renderGrid () {
    const marks = []
    const size = Store.cell.size.get() * 0.5

    for (let x = 0; x <= this.state.cols; x++) {
      for (let y = 0; y <= this.state.rows; y++) {
        const position = [x * Store.cell.size.get(), y * Store.cell.size.get()]
        marks.push(
          <g class='grid__mark' transform={`translate(${position})`}>
            <line x1={0} y1={-size} x2={0} y2={size} stroke='black' />
            <line x1={-size} y1={0} x2={size} y2={0} stroke='black' />
          </g>
        )
      }
    }

    return (
      <g class='grid no-export'>
        {marks}
      </g>
    )
  }

  get svgString () {
    // Working on a cloned node so that we can mutate and remove elements
    const clonedSvg = this.refs.svg.cloneNode(true)
    clonedSvg.querySelectorAll('.no-export').forEach(el => el.remove())
    return clonedSvg.outerHTML
      .replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"')
      .replace(/href/g, 'xlink:href')
  }
}
