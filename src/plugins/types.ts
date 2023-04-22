export interface Plugin {
  name: string
  type: string
  handle(file: Blob): void
}
