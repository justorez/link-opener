import { OutputChunk, OutputBundle } from 'rollup'

export function removeFileExtension(filePath: string) {
    const index = filePath.lastIndexOf('.')
    return index > -1 ? filePath.substring(0, index) : filePath
}

export function slash(path: string) {
    const isExtendedLengthPath = /^\\\\\?\\/.test(path)
    const hasNonAscii = /[^\u0000-\u0080]+/.test(path)

    if (isExtendedLengthPath || hasNonAscii) {
        return path
    }

    return path.replace(/\\/g, '/')
}

export function findChunkByName(
    name: string,
    bundle: OutputBundle
): OutputChunk | undefined {
    return Object.values(bundle).find((b) => {
        return b.name && b.type === 'chunk' && slash(b.name) === slash(name)
    }) as OutputChunk | undefined
}
