import Store from 'store'
import { render } from 'utils/jsx'
import hotkeys from 'hotkeys-js'

import App from 'components/App'
import save from 'controllers/save'

const [app] = render(<App />, document.body).components

hotkeys('w', () => Store.debug.set(!Store.debug.current))
hotkeys('space', () => Store.seed.set(Date.now()))

hotkeys('cmd + s, s', e => {
  e.preventDefault()
  save(app.refs.wall, Store.seed.get())
})
