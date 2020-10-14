import Cell from 'components/Cell'
import { BASE_UNIT } from 'controllers/symbols'

export default class HallNumber extends Cell {
  beforeRender (props) {
    super.beforeRender(props)
    this.props.color = 'black'
    this.props.class = 'is-locked'
  }

  afterRender (props) {
    this.refs.use.remove()
    this.refs.clipPath.remove()

    const style = (fs, fw = 400) => Object.entries({
      'font-family': 'inter',
      'font-size': fs + 'mm',
      'font-weight': fw
    }).map(([prop, value]) => prop + ':' + value).join(';')

    const padding = 40
    this.render([
      <text
        x={this.state.width - padding}
        y={padding}
        text-anchor='end'
        alignment-baseline='hanging'
        fill='white'
        style={style(BASE_UNIT / 3)}
      >hall</text>,
      <text
        ref={this.ref('number')}
        x={this.state.width - padding}
        y={this.state.height - padding}
        text-anchor='end'
        alignment-baseline='baseline'
        fill='white'
        style={style(BASE_UNIT * 1.6, 600)}
      >
        {props.number}
      </text>
    ], this.base)
  }

  handleClick () {
    this.refs.number.innerHTML = (parseInt(this.refs.number.innerHTML) + 1) % 23
  }
}
