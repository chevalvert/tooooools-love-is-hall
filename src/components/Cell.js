import Store from 'store'
import classnames from 'classnames'
import { Component } from 'utils/jsx'
import Prng from 'utils/prng'

import SYMBOLS, { BASE_UNIT } from 'controllers/symbols'

export default class Cell extends Component {
  beforeRender (props) {
    this.handleClick = this.handleClick.bind(this)

    this.state = {
      id: `${props.x}_${props.y}`,
      position: [
        props.x * Store.cell.size.get(),
        props.y * Store.cell.size.get()
      ],
      width: props.width * Store.cell.size.get(),
      height: props.height * Store.cell.size.get(),
      symbolID: Prng.randomOf(SYMBOLS).filename
    }
  }

  template (props) {
    const { id, position, width, height } = this.state
    const ratio = width / height

    return (
      <g
        class={classnames('cell', props.class)}
        transform={`translate(${position})`}
        event-click={this.handleClick}
      >
        <clipPath id={id} ref={this.ref('clipPath')}>
          <rect
            width={ratio >= 1 ? BASE_UNIT : BASE_UNIT * ratio}
            height={ratio >= 1 ? BASE_UNIT / ratio : BASE_UNIT}
          />
        </clipPath>

        <rect
          width={width}
          height={height}
          fill={props.color}
        />

        <use
          href={'#' + this.state.symbolID}
          clip-path={`url(#${id})`}
          ref={this.ref('use')}
          x={0}
          y={0}
          width={BASE_UNIT}
          height={BASE_UNIT}
          transform={`scale(${Math.max(width, height) / BASE_UNIT})`}
        />
      </g>
    )
  }

  handleClick () {
    this.refs.use.remove()
    this.state.symbolID = Prng.randomOf(SYMBOLS).filename
    this.render((
      <use
        href={'#' + this.state.symbolID}
        clip-path={`url(#${this.state.id})`}
        ref={this.ref('use')}
        x={0}
        y={0}
        width={BASE_UNIT}
        height={BASE_UNIT}
        transform={`scale(${Math.max(this.state.width, this.state.height) / BASE_UNIT})`}
      />
    ), this.base)
  }
}
