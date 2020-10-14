/* global Blob */
import FileSaver from 'file-saver'

export default (wall, filename = Date.now()) => {
  const blob = new Blob([wall.svgString], { type: 'image/svg+xml' })
  return FileSaver.saveAs(blob, filename)
}
