import path from 'path/posix'
import { OutputBundle, OutputChunk, Plugin } from 'rollup'

export function mixinPlugin(bundle: OutputBundle): Plugin {
    // console.log('\n\n[single-script mixin] bundle:', Object.keys(bundle))

    return {
        name: 'mixin',
        resolveId(source, importer) {
            // console.log('\n[single-script mixin] importer:', importer)

            try {
                if (typeof importer === 'undefined') {
                    return source
                } else {
                    // 注意路径的斜杠和反斜杠！
                    // 这里统一使用 linux 格式
                    const dir = path.dirname(importer)
                    const resolveId = path.join(dir, source)
                    // console.log('[single-script mixin] resolveId:', resolveId)
                    return resolveId in bundle ? resolveId : false
                }
            } catch (error) {
                console.error('resolveId', error)
                return null
            }
        },
        load(id) {
            // console.log('[single-script mixin] load id:', id)

            const chunk = bundle[id] as OutputChunk
            if (chunk) {
                // remove chunk from bundle
                if (
                    Object.values(bundle).filter(
                        x => x.type === 'chunk' &&
                            x.imports.includes(chunk.fileName)
                    ).length < 1
                ) {
                    delete bundle[id]
                }
                return {
                    code: chunk.code,
                    map: chunk.map
                }
            } else {
                return null
            }
        }
    }
}
