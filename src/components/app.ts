import './app.css'

export function setupApp() {
  const $app = document.querySelector('#app')!
  $app.innerHTML =
    '<h1 class="header">Easily customize your new tab background with videos, GIFs, or images. You can try dragging an image here or click the button in the bottom right corner to set it.</h1>'
}
