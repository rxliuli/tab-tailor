import { Plugin } from './types'
import { backgroundVideoCss } from './video'

export function image(): Plugin {
  return {
    name: 'image',
    type: 'image/',
    handle(file: Blob) {
      const $img = document.createElement('img')
      $img.id = 'background-' + Date.now()
      $img.src = URL.createObjectURL(file)

      const $style = document.createElement('style')
      $style.innerHTML = backgroundVideoCss(`#${$img.id}`)

      document.body.append($img, $style)
    },
  }
}

/*
steam 社区 https://steamcommunity.com/app/431960/workshop/
下载工具 http://steamworkshop.download/
 */
export function setupBackground() {}
