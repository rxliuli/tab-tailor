import { set } from 'idb-keyval'
import { image } from '../plugins/image'
import { video } from '../plugins/video'
import './upload.css'

export const plugins = [image(), video()]

export async function onSetBackground(files?: FileList | null) {
  // const files = event.dataTransfer!.files
  if (!files || files.length > 1) {
    alert('Please drop only one file.')
    return false
  }
  const file = files[0]
  const findPlugin = plugins.find((it) => file.type.startsWith(it.type))
  if (!findPlugin) {
    return
  }
  console.log('findPlugin', findPlugin.name)
  findPlugin.handle(file)
  document.querySelector('#app')?.remove()
  await Promise.all([set('plugin', findPlugin.name), set('data', file)])
}

export function setupUpload() {
  const $button = document.createElement('button')
  $button.title = 'Set background from image or video'
  $button.classList.add('floating-btn')
  $button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>`

  $button.addEventListener('click', () => {
    const $input = document.createElement('input')
    $input.type = 'file'
    $input.accept = 'image/*,video/*'
    $input.addEventListener('change', async () => {
      await onSetBackground($input.files)
    })
    $input.click()
  })

  document.body.append($button)
  return $button
}
