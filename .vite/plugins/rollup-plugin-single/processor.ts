import { OutputBundle, PluginContext } from 'rollup'
import { removeFileExtension, findChunkByName } from './utils'
import { mixinChunksToIIFE } from './mixin'
import { Options } from './typings'

export class ScriptProcessor {
    entryFileNames = []

    constructor(options: Options) {
        this.entryFileNames = options.entryFileNames || []
    }

    async generateBundle(
        context: PluginContext,
        bundle: OutputBundle
    ) {
        for (const entryFileName of this.entryFileNames) {
            const entryName = removeFileExtension(entryFileName)
            const chunk = findChunkByName(entryName, bundle)
            // console.log('[single-script]', entryName)
            // console.log('\n[single-script]', chunk)

            if (chunk) {
                await mixinChunksToIIFE(context, chunk, bundle)
            }
        }
    }
}
