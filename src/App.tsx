import clsx from 'clsx'
import { useLocalRef } from './utils/mobx'
import { useDropzone } from 'react-dropzone'
import { useAsync, useEvent } from 'react-use'
import { get, set } from 'idb-keyval'
import { observer } from 'mobx-react-lite'
import { observable } from 'mobx'
import React from 'react'

const VideoView = (props: { src: string }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  useEvent('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      videoRef.current?.pause()
    } else if (document.visibilityState === 'visible') {
      videoRef.current?.play()
    }
  })
  return (
    <video
      ref={videoRef}
      src={props.src}
      muted={true}
      loop={true}
      autoPlay={true}
      className="fixed top-0 left-0 min-w-full min-h-full object-cover filter brightness-50"
    />
  )
}
const ImageView = (props: { src: string }) => {
  return (
    <img
      src={props.src}
      className="fixed top-0 left-0 min-w-full min-h-full object-cover filter brightness-50"
    />
  )
}

const plugins: {
  name: string
  type: string
  component: React.FC<{
    src: string
  }>
}[] = [
  {
    name: 'video',
    type: 'video/',
    component: VideoView,
  },
  {
    name: 'image',
    type: 'image/',
    component: ImageView,
  },
]

async function onSetBackground(files?: FileList | File[] | null) {
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
  await Promise.all([set('type', findPlugin.name), set('data', file)])
  store.type = findPlugin.name
  store.component = findPlugin.component
  store.dataUrl = URL.createObjectURL(file)
}

function useDrop() {
  const draggable = useLocalRef(false)
  function onDragStart() {
    console.log('onDragStart')
    draggable.value = true
  }
  function onDragEnd() {
    console.log('onDragEnd')
    draggable.value = false
  }
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      console.log('onDrop', acceptedFiles)
      onSetBackground(acceptedFiles)
    },
    onFileDialogOpen: onDragStart,
    onFileDialogCancel: onDragEnd,
    onDragEnter: onDragStart,
    onDragLeave: onDragEnd,
    onDragOver: (ev) => {
      ev.preventDefault()
    },
  })
  return {
    draggable,
    getRootProps,
    getInputProps,
  }
}

const DargArea = () => {
  const { draggable, getRootProps, getInputProps } = useDrop()
  return (
    <div className="flex items-center justify-center min-h-screen p-10 flex-col">
      <div
        {...getRootProps({
          className: clsx(
            'text-center flex items-center justify-center rounded-lg border-2 border-dashed w-full flex-grow',
            draggable.value ? 'border-blue-500' : 'border-gray-400',
          ),
          tabIndex: 0,
        })}
      >
        <input {...getInputProps()} tabIndex={-1} className="hidden" />
        <p className="text-gray-500">
          Drag or click to select a picture or video as the background
        </p>
      </div>
    </div>
  )
}

const Upload = () => {
  const { draggable, getRootProps, getInputProps } = useDrop()
  return (
    <div
      {...getRootProps({
        className: clsx(
          'fixed right-4 bottom-4 ',
          draggable.value ? 'border-blue-500' : 'border-gray-400',
        ),
        tabIndex: 0,
      })}
    >
      <input {...getInputProps()} tabIndex={-1} className="hidden" />
      <button className="flex items-center justify-center rounded p-2 focus:outline-none focus:ring-0 active:bg-transparent dark:bg-transparent opacity-20 hover:opacity-100 transition-opacity duration-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="h-12 w-12"
        >
          <path
            className="fill-sky-400 stroke-sky-500"
            d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"
          />
        </svg>
      </button>
    </div>
  )
}

const store = observable({
  type: undefined as string | undefined,
  dataUrl: undefined as string | undefined,
  component: undefined as
    | React.FC<{
        src: string
      }>
    | undefined,
})

export const App = observer(() => {
  const state = useAsync(async () => {
    const type = await get('type')
    if (!type) {
      return
    }

    const plugin = plugins.find((it) => it.name === type)
    if (!plugin) {
      return
    }
    const data = await get('data')
    if (!data) {
      return
    }
    store.type = type
    store.component = plugin.component
    store.dataUrl = URL.createObjectURL(data)
  })
  return (
    <>
      {!state.loading && (
        <div>
          {!store.type && <DargArea />}
          {store.type && store.dataUrl && store.component && (
            <>
              {React.createElement(store.component, { src: store.dataUrl })}
              <Upload />
            </>
          )}
        </div>
      )}
    </>
  )
})
