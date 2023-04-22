import { setupApp } from './components/app'
import { onSetBackground, plugins, setupUpload } from './components/upload'
import './style.css'
import { get } from 'idb-keyval'

document.addEventListener(
  'dragover',
  function (event) {
    event.preventDefault()
    const files = event.dataTransfer!.files
    if (files.length > 1) {
      alert('Please drop only one file.')
      return false
    }
  },
  false,
)

document.addEventListener(
  'drop',
  async function (event) {
    event.preventDefault()
    onSetBackground(event.dataTransfer?.files)
  },
  false,
)

async function main() {
  const $button = setupUpload()
  const plugin = await get('plugin')
  if (!plugin) {
    $button.classList.add('first')
    setupApp()
    return
  }
  const findPlugin = plugins.find((it) => it.name === plugin)
  if (!findPlugin) {
    return
  }
  const data = await get('data')
  if (!data) {
    return
  }
  findPlugin.handle(data)
}

main()
