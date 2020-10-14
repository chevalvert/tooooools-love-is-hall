/* global h */
import { parse } from 'svg-parser'
const reqs = require.context('../../static/symbols', false, /\.svg$/i)

export const UNWANTED_PROPS = ['id', 'class']
export const BASE_UNIT = 64
export default reqs.keys().map(key => {
  const raw = reqs(key).default
  return {
    raw,
    filename: key.split(/(\\|\/)/g).pop(),
    parsed: parse(raw),
    toJsx: function (props) {
      const svg = this.parsed.children[0]
      return svg.children.map(el => {
        if (el.properties.class === 'st0') return
        if (el.tagName === 'style') return
        for (const prop of UNWANTED_PROPS) delete el.properties[prop]
        return h(el.tagName, Object.assign(el.properties, {
          fill: 'white',
          x: 0,
          y: 0,
          width: BASE_UNIT,
          height: BASE_UNIT
        }, props))
      })
    }
  }
})
