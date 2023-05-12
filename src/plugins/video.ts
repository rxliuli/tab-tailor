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

      // 假设函数 a 和 b 已经定义
      function a() {
        // console.log('页面不活跃或者已经离开')
        $video.pause()
      }

      function b() {
        // console.log('页面活跃或者已经打开')
        $video.play()
      }

      // 监听 visibilitychange 事件
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') {
          a()
        } else if (document.visibilityState === 'visible') {
          b()
        }
      })
    },
  }
}
