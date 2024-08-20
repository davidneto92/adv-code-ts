import { createReadStream } from 'fs'
import { createInterface, Interface } from 'readline'

export const getFileStream = (path: string): Interface => {
  const readStream = createReadStream(path)

  return createInterface({
    input: readStream,
    // ...options
  })
}
