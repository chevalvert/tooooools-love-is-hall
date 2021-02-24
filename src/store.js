import { readable, writable } from 'utils/state'

const Store = {
  seed: writable(Date.now()),
  debug: writable(false),

  cell: {
    size: readable(295),
    unit: readable('mm')
  },

  wall: {
    cols: readable(4),
    rows: readable(5),
    cellsLength: readable(4)
  },

  colors: {
    length: readable(1),
    primary: readable([
      '#4fc6e1',
      '#d4dd21',
      '#f5821f'
    ]),
    secondary: readable([
      '#f49ac2',
      '#67c18d',
      '#8a6161',
      '#c41330',
      '#004b35',
      '#812990'
    ])
  }
}

window.Store = Store
export default Store
