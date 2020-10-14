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
    rows: readable(11),
    cellsLength: readable(6)
  },

  colors: {
    length: readable(2),
    primary: readable([
      '#4fc6e1',
      '#d4dd21',
      '#f5821f'
    ]),
    secondary: readable([
      '#000000',
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
