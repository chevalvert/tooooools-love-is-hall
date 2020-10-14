import Store from 'store'
import Wall from 'components/Wall'
import { Component } from 'utils/jsx'

export default class App extends Component {
  beforeRender () {
    this.update = this.update.bind(this)
  }

  template () {
    return (
      <main class='app' id='App' store-class-debug={Store.debug}>
        <footer class='app__footer'>
          <div class='app__info'>
            <kbd>espace</kbd> pour générer un nouveau hall<br />
            <kbd>w</kbd> pour passer en mode debug<br />
            <kbd>cmd</kbd>+<kbd>s</kbd> pour enregistrer au format SVG
          </div>
          <div class='app__seed' store-text={Store.seed} />
        </footer>
      </main>
    )
  }

  afterRender () {
    Store.seed.subscribe(this.update)
    this.update()
  }

  update () {
    if (this.refs.wall) this.refs.wall.destroy()
    this.render(<Wall ref={this.ref('wall')} />, this.base)
  }

  beforeDestroy () {
    Store.seed.unsubscribe(this.update)
  }
}
