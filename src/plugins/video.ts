import { Plugin } from './types'

export function backgroundVideoCss(selector: string): string {
  return `
${selector} {
  position: fixed;
  width: 100%;
  height: 100%;
  right: 0;
  bottom: 0;
  z-index: -100;
  object-fit: cover;
  filter: brightness(0.5);
}
`
}

export function video(): Plugin {
  return {
    name: 'video',
    type: 'video/',
    handle(file: Blob) {
      const $video = document.createElement('video')
      $video.id = 'background-' + Date.now()
      $video.muted = true
      $video.loop = true
      $video.autoplay = true
      $video.src = URL.createObjectURL(file)

      const $style = document.createElement('style')
      $style.innerHTML = backgroundVideoCss(`#${$video.id}`)

      document.body.append($video, $style)
    },
  }
}
